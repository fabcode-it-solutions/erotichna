import mongoose from "mongoose";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const { Schema } = mongoose;

const wishlistSchema = new Schema(
  {
    video: [{ type: String, ref: "videos" }],
    model: [{ type: String, ref: "models" }],
    userId: { type: String, ref: "customers" },
  },
  { timestamps: true }
);

export default mongoose.models.wishlist ||
  mongoose.model("wishlist", wishlistSchema);
