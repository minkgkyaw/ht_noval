import createHttpError from "http-errors";
import nextConnect from "next-connect";
import User from "../../../models/User.model";
import logger from 'morgan'
import { joiLoginSchema } from "../../../schemas/user.schema";
import db from "../../../utils/db";
import { onError, onNoMatch } from "../../../utils/error";

const handler = nextConnect({
  onError,
  onNoMatch: onNoMatch,
}).use(logger('tiny'))


handler.post(async (req, res, next) => {
  try {
    // TODO: validate req body
    const { email, password } = await joiLoginSchema.validateAsync(req.body);

    // TODO: find user
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if (!user) return next(createHttpError(401, "Invalid username or password"));

    // TODO: validate password
    const isMatchPwd = await user.comparePassword(password);

    if (!isMatchPwd)
      return next(createHttpError(401, "Invalid username or password"));

    // TODO: generate token
    const token = await user.generateToken();

    if (!token) 
      return next(createHttpError(500, "Can't get token"));

    res.status(200).json({
      meta: {
        message: "login success"
      },
      user: {
        id: user.id,
        name: user.name,
        token
      }
    });

    if (!user) {
      next(createHttpError(404));
      return await db.disconnect();
    }
  } catch (err) {
    await db.disconnect();
    if (err.isJoi) err.status = 422;
    return next(err);
  }
});

export default handler;
