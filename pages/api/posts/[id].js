import nextConnect from "next-connect";
import createHttpError from "http-errors";
import morgan from "morgan";
import db from "../../../utils/db";
import Post from "../../../models/Post.model";
import { onError, onNoMatch } from "../../../utils/error";
import {
  joiPostIdSchema,
  joiUpdatePostSchema,
} from "../../../schemas/post.schema";
import { isAuth } from "../../../middleware/isAuth";

const handler = nextConnect({
  onError,
  onNoMatch,
}).use(morgan("tiny")).use(isAuth);

// get post by id
handler.get(async (req, res, next) => {
  try {
    // TODO: validate req query
    const { id } = await joiPostIdSchema.validateAsync(req.query);

    // TODO: find post by chapters
    await db.connect();
    const post = await Post.findById(id);
    await db.disconnect();

    if (!post) return next(createHttpError(404));

    return res.status(200).json({
      meta: {
        id: post.id,
      },
      post,
    });
  } catch (err) {
    await db.disconnect();
    if (err.isJoi) err.status = 422;
    return next(err);
  }
});

// update post by id
handler.patch(async (req, res, next) => {
  try {
    // TODO: validate req body and query
    await joiPostIdSchema.validateAsync(req.query)
    await joiUpdatePostSchema.validateAsync(req.body);

    // TODO: find post by id and update
    await db.connect();

    const newPost = await Post.findByIdAndUpdate(req.query.id, {
      ...req.body,
    });

    await db.disconnect();

    if (!newPost) return next(createHttpError(404));

    // TODO: find updated post by id
    await db.connect();

    const post = await Post.findById(req.query.id);

    await db.disconnect();
    
    return res.status(200).json({
      meta: {
        id: post.id,
        message: "Successfully updated",
      },
      post,
    });
  } catch (err) {
    await db.disconnect();
    if (err.isJoi || err.code === 11000) err.status = 422;
    if (err.code === 11000)
      err.message = `Chapters ${req.body.chapters} is already existed!`;
    return next(err);
  }
});

// delete post by id
handler.delete(async (req, res, next) => {
  try {
    // TODO: validate req body and query
    await joiPostIdSchema.validateAsync(req.query)

    // TODO: find post by id and delete
    await db.connect();

    const post = await Post.findByIdAndDelete(req.query.id);

    await db.disconnect();

    if (!post) return next(createHttpError(404));

    
    return res.status(200).json({
      meta: {
        id: post.id,
        message: "Successfully deleted post.",
      }
    });
  } catch (err) {
    await db.disconnect();
    if (err.isJoi || err.code === 11000) err.status = 422;
    return next(err);
  }
});

export default handler;
