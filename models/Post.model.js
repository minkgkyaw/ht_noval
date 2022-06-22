import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    chapters: {
      type: Number,
      min: 1,
      max: 5000,
      unique: true,
      required: true,
    },
    body: {
      type: String,
      minlength: 5000,
      maxlength: 25000,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        delete ret._id;
        return ret;
      },
    },
  }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
