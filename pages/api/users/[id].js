import nextConnect from "next-connect";
import morgan from "morgan";
import db from '../../../utils/db'
import { onError, onNoMatch } from '../../../utils/error'
import { joiUserIdSchema } from "../../../schemas/user.schema";
import User from '../../../models/User.model'
import { isAuth } from "../../../middleware/isAuth";
import createHttpError from "http-errors";

const handler = nextConnect({
  onError: onError,
  onNoMatch: onNoMatch
}).use(morgan('tiny')).use(isAuth)

// get user by id
handler.get(async (req, res, next) => {
  try {
    // TODO: validate req query id is mongo id
    const {id} = await joiUserIdSchema.validateAsync(req.query)

    // find user by id
    await db.connect();
    const user = await User.findById(id)
    await db.disconnect();

    // TODO: return 404 error if user not found
    if(!user) return next(createHttpError(404))

    return res.status(200).json({
      meta: {
        id: user.id,
        message: 'Successfully got user'
      },
      user
    })
  } catch (err) {
    if(err.isJoi) err.status = 422;
    return next(err)
  }
})

// delete user
handler.delete(async (req, res, next) => {
  try {
    // TODO: validate req query id is mongo id
    const {id} = await joiUserIdSchema.validateAsync(req.query)

    // find user by id and delete
    await db.connect();
    const user = await User.findByIdAndDelete(id)
    await db.disconnect();

    // TODO: return 404 error if user not found
    if(!user) return next(createHttpError(404))

    return res.status(200).json({
      meta: {
        id,
        message: 'Successfully deleted'
      }
    })
  } catch (err) {
    return next(err)
  }
})

export default handler;