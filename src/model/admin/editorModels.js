import mongoose from "mongoose";
const { Schema } = mongoose;

const buttonSchema = new Schema({
  label: { type: String, required: true },
  link: { type: String, required: true },
  icon: { type: Boolean, default: true },
});

const editorModelsSchema = new Schema(
  {
    id: {
      type: String,
    },  
    upcoming: {
      title: { type: String, default: "" },
      cover: { type: String, default: "" },
      link: { type: String, default: "" },
      video: {
        link: { type: String, default: "" },
      },
    }
  },
  { timestamps: true }
);

export default mongoose.models.editorModels || mongoose.model("editorModels", editorModelsSchema);
