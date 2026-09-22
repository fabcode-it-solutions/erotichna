import mongoose from "mongoose";
const { Schema } = mongoose;

const videosSchema = new Schema(
  {
    order: { type: Number, default: 1 },
    orderTemp: { type: Number, default: 1 },
    id: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
    },
    directedBy: {
      type: String,
    },
    expert: {
      type: String,
    },
    tags: {
      type: [String],
    },
    categories: {
      type: [String],
    },
    video: {
      src: {
        type: String,
        select: false,
      },
      duration: {
        type: String,
      },
    },
    poster: {
      type: String,
    },
    hoveredVideo: {
      src: {
        type: String,
      },
    },
    trailer: {
      src: {
        type: String,
      },
    },
    gallery: {
      type: [String],
    },
    previewGallery: {
      type: [String],
    },
    videoView: {
      type: String,
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
    ratings: [{ type: String, ref: "videoRating" }],
    model: [
      {
        id: {
          type: String,
        },
        name: {
          type: String,
        },
        link: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.videos || mongoose.model("videos", videosSchema);
