import mongoose from "mongoose";
const { Schema } = mongoose;

const categoriesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    id: {
      type: String,
    },
    status: {
        type: String,
      },
  },
  { timestamps: true }
);

export default mongoose.models.categories ||
  mongoose.model("categories", categoriesSchema);
