import mongoose from "mongoose";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const { Schema } = mongoose;

const videoRating = new Schema(
  {
    user: {
      type: String,
      ref: "customers",
      required: true,
    },
    video: {
      type: String,
      ref: "videos",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

export default mongoose.models.videoRating ||
  mongoose.model("videoRating", videoRating);
