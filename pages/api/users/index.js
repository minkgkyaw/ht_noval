import nextConnect from "next-connect";
import morgan from "morgan";
import db from "../../../utils/db";
import { onError, onNoMatch } from "../../../utils/error";
import { joiUserIdSchema } from "../../../schemas/user.schema";
import User from "../../../models/User.model";
import { isAuth } from "../../../middleware/isAuth";
import createHttpError from "http-errors";

const handler = nextConnect({
  onError,
  onNoMatch,
}).use(morgan('tiny')).use(isAuth);

handler.get(async (req, res, next) => {
  try {
    await db.connect();
    const users = await User.find().sort([["role", 1]]);
    await db.disconnect();

    if (!users) return next(createHttpError(404));

    if (users.length < 1) return next(createHttpError(404));

    return res.status(200).json({
      meta: {
        total: users.length,
      },
      users,
    });
  } catch (err) {
    return next(err);
  }
});

export default handler;
