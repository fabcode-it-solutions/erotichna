import mongoose from "mongoose";
const { Schema } = mongoose;

const headerSchema = new Schema(
  {
    logo: {
      src: {
        type: String,
        required: true,
      },
      link: {
        type: String,
      },
    },
    loginBtn: {
      type: Boolean,
      default: true,
    },
    searchBtn: {
      type: Boolean,
      default: true,
    },
    id:{
      type: String
    },
    menus: [
      {
        label: {
          type: String,
          required: true,
        },
        link: {
          type: String,
          required: true,
        },
      },
    ],
    customButton: {
      label: {
        type: String,
      },
      link: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.header || mongoose.model("header", headerSchema);
