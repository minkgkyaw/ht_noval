import createHttpError from "http-errors";
import nextConnect from "next-connect";
import User from "../../../models/User.model";
import logger from "morgan";
import { joiUserRegisterSchema } from "../../../schemas/user.schema";
import db from "../../../utils/db";
import { onError, onNoMatch } from "../../../utils/error";
import { isAuth } from "../../../middleware/isAuth";

const handler = nextConnect({
  onError,
  onNoMatch: onNoMatch,
})
  .use(logger("tiny"))
  .use(isAuth);

handler.post(async (req, res, next) => {
  try {
    // TODO: validate req body
    const data = await joiUserRegisterSchema.validateAsync(req.body);

    // TODO: find user is already existed or not
    await db.connect();
    const existedUser = await User.findOne({ email: data.email });
    await db.disconnect();

    if (existedUser) return next(
        createHttpError(400, `User already registered as ${existedUser.role}`)
      );

    // check is req another admin role, then return 400 error
    if(data.role === 'Admin') {
      await db.connect();
      const isExistedAdmin = await User.find({role: 'Admin'}).count()
      await db.disconnect();

      if(isExistedAdmin >= 2 ) return next(createHttpError(400, 'Admins already existed'))
    }

       // TODO: create new user
    await db.connect();

    const newUser = new User(data);

    const user = await newUser.save();

    await db.disconnect();

    if (!user) return next(createHttpError(409));

    return res.status(201).json({
      meta: {
        id: user._id,
        message: "Successfully created new user",
      },
      user,
    });
  } catch (err) {
    await db.disconnect();
    if (err.isJoi) err.status = 422;
    return next(err);
  }
});

export default handler;
