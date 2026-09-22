import mongoose from "mongoose";
const { Schema } = mongoose;

const footerSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    inner_pages: [
      {
        label: {
          type: String,
        },
        link: {
          type: String,
        },
      },
    ],
    social_media: [
      {
        label: {
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

export default mongoose.models.footer || mongoose.model("footer", footerSchema);
