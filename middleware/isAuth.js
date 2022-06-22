import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import createHttpError from "http-errors";

const cwd = process.cwd();

export const isAuth = async (req, res, next) => {
  try {
    // for register
    if(req.url === '/api/auth/register' && req.body.email && req.body.email === process.env.DEVELOPER_MAIL) return next()
    
    const authHeader = req.headers["authorization"];

    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const [type, token] = authHeader.split(" ");

    if (!type || !token || type !== "Bearer")
      return res.status(401).json({ message: "Unauthorized" });

    const publicKey = fs.readFileSync(path.join(cwd, "cert", "public.pem"));

    const verifiedUser = await jwt.verify(token, publicKey, {
      algorithms: [process.env.JWT_ALGORITHM],
    });

    if (!verifiedUser) return res.status(401).json({ message: "Unauthorized" });

    return next();
  } catch (err) {
    if(err.name === 'JsonWebTokenError') err.status = 401
    return next(err);
  }
};
