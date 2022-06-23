import nextConnect from "next-connect";
import createHttpError from "http-errors";
import morgan from "morgan";
import db from "../../../utils/db";
import Post from "../../../models/Post.model";
import { onError, onNoMatch } from "../../../utils/error";
import {
  joiCreateNewPostSchema,
  joiPaginationSchema,
} from "../../../schemas/post.schema";
import { isAuth } from "../../../middleware/isAuth";

const handler = nextConnect({
  onError,
  onNoMatch,
}).use(morgan("tiny"));

// get all posts
handler.get(async (req, res, next) => {
  try {
    // TODO: validate req params (pagination)
    let { page, limit, sort } = await joiPaginationSchema.validateAsync(req.query);

    // TODO: pagination
    if (!page) page = 1;

    // TODO: find post
    if (!limit) limit = 10;

    if(!sort) sort = 1;

    const skip = (page - 1) * limit;

    await db.connect();

    const posts = await Post.find().skip(skip).limit(limit).sort([['chapters', sort]]).exec();

    const total = await Post.find().count();

    await db.disconnect();

    if (!posts || posts.length < 1) return next(createHttpError(404));

    return res.status(200).json({
      meta: {
        total,
        page,
        limit,
      },
      posts,
    });
  } catch (err) {
    await db.disconnect();
    if (err.isJoi) err.status = 422;
    return next(err);
  }
});

// create new posts
handler.use(isAuth).post(async (req, res, next) => {
  try {
    // TODO: validate req body
    const data = await joiCreateNewPostSchema.validateAsync(req.body);

    // TODO: create new post
    await db.connect();

    const newPost = new Post(data);

    const post = await newPost.save();

    if (!post) return next(createHttpError(409, "Can't create new post"));

    return res.status(201).json({
      meta: {
        id: post.id,
        message: "Created post successfully",
      },
      post,
    });
  } catch (err) {
    await db.disconnect();
    if (err.isJoi || err.code === 11000 || err.name === 'ValidationError') err.status = 422;
    if (err.code === 11000)
      err.message = `Chapters ${req.body.chapters} is already existed!`;
    return next(err);
  }
});

export default handler;
