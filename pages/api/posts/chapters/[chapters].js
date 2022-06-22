import nextConnect from "next-connect";
import createHttpError from "http-errors";
import morgan from "morgan";
import db from "../../../../utils/db";
import Post from "../../../../models/Post.model";
import { onError, onNoMatch } from "../../../../utils/error";
import {
  joiChaptersSchema,
} from "../../../../schemas/post.schema";

const handler = nextConnect({
  onError,
  onNoMatch,
}).use(morgan("tiny"));

// get post by chapters
handler.get(async (req, res, next) => {
  try {
    // TODO: validate req query
    const { chapters } = await joiChaptersSchema.validateAsync(req.query);

    // TODO: find post by chapters
    await db.connect();
    const post = await Post.findOne({ chapters });
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

export default handler;
