import mongoose from "mongoose";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const { Schema } = mongoose;

const modelSchema = new Schema(
  {
    orderTemp: { type: Number },
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
    },
    scheduleTime:{
      type: String,
    },
    upcoming_scene_video: {
      type: String,
    },
    upcoming_scene_thumbnail_image: {
      type: String,
    },
    profile_image: {
      type: String,
      required: true
    },
    categories: {
      type: [String],
    },
    tags: {
      type: [String],
    },
    seo: {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      permalink: {
        type: String,
      },
      keywords: {
        type: [String],
      },
    },
  },
  { timestamps: true }
);


export default mongoose.models.models || mongoose.model("models", modelSchema);