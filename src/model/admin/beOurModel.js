import mongoose from "mongoose";
const { Schema } = mongoose;

const beOurModelSchema = new Schema(
  {
    id: {
      type: String,
    },
    video: {
      link: { type: String, default: "" },
    },
    heading: {
      type: String,
    },
    desktopImage: {
      type: String,
    },
    mobileImage: {
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
  },
  { timestamps: true }
);

export default mongoose.models.beOurModel ||
  mongoose.model("beOurModel", beOurModelSchema);
