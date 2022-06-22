import mongoose from "mongoose";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const cwd = process.cwd();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Developer", "Helper"],
      default: "Helper",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  try {
    // change role
    if(this.email === process.env.DEVELOPER_MAIL) this.role = 'Developer';
    
    const salt = await bcrypt.genSalt(+process.env.SALT_ROUND);
    return (this.password = await bcrypt.hash(this.password, salt));
  } catch (err) {
    return next(createHttpError(409, err.message));
  }
});

userSchema.methods.generateToken = async function () {
  try {
    const privateKey = fs.readFileSync(path.join(cwd, "cert", "private.key"));
    return await jwt.sign(
      {
        id: this.id,
      },
      privateKey,
      { expiresIn: "1y", algorithm: process.env.JWT_ALGORITHM }
    );
  } catch (err) {
    console.log(err.message);
    return new Error(err);
  }
};

userSchema.methods.comparePassword = async function (text) {
  try {
    return await bcrypt.compare(text, this.password)
  } catch (err) {
    console.log(err.message);
    return new Error(err);
  }
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
