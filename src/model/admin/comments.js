import mongoose from "mongoose";
const { Schema } = mongoose;

const commentsSchema = new Schema(
  {
    id: {
      type: String,
    },
    author: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    comment: {
      type: String,
    },
    likes: {
      count: {
        type: Number,
        default: 0,
      },
      userIds: [String],
    },
    dislikes: {
      count: {
        type: Number,
        default: 0,
      },
      userIds: [String],
    },
    status: {
      type: String,
    },
    post: {
      title: {
        type: String,
      },
      link: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.comments ||
  mongoose.model("comments", commentsSchema);
