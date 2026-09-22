import mongoose from "mongoose";
const { Schema } = mongoose;

const buttonSchema = new Schema({
  label: { type: String, required: true },
  link: { type: String, required: true },
  icon: { type: Boolean, default: true },
});
const VideoSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  order: { type: Number, default: 1 },
  subHeading: {
    type: String,
  },
  image: {
    type: String,
  },
  updateAt:{
    type: String,
  },
  video: {
    src: {
      type: String,
      required: true,
    },
  },
  link: {
    type: String,
    required: true,
  },
});
const ItemsSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  order: { type: Number, default: 1 },
  image: {
    type: String,
  },
  link: {
    type: String,
  },
});
const homeSchema = new Schema({
  id: {
    type: String,
  },
  banner: {
    order: { type: Number, default: 1 },
    desktop: { type: String, default: "" },
    mobile: { type: String, default: "" },
    video: {
      link: { type: String, default: "" },
      mobileLink: { type: String, default: "" },
    },
    trailer: {
      src: { type: String, default: "" },
    },
    link: { type: String, default: "" },
    subHeading: { type: String, default: "" },
    heading: { type: String, default: "" },
    mainHeading: { type: String, default: "" },
    mainHeadingLink: { type: String, default: "" },
    primaryButton: buttonSchema,
    secondaryButton: buttonSchema,
  },
  topVideos: {
    order: { type: Number, default: 1 },
    title: { type: String, default: "" },
    models: {
      type: [String],
      ref: "models",
    },
    videos: {
      type: [VideoSchema],
      required: true,
    },
  },
  singleImage: {
    order: { type: Number, default: 1 },
    desktop: { type: String, default: "" },
    mobile: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  latestVideos: {
    order: { type: Number, default: 1 },
    title: { type: String, default: "" },
    showAllButton: { type: Boolean, default: true },
    primaryButton: buttonSchema,
    models: {
      type: [String],
      ref: "models",
    },
    videos: {
      type: [VideoSchema],
      required: true,
    },
  },
  performers: {
    order: { type: Number, default: 1 },
    title: { type: String, default: "" },
    items: {
      type: [ItemsSchema],
    },
  },
  singleImageSecond: {
    order: { type: Number, default: 1 },
    desktop: { type: String, default: "" },
    mobile: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  upcoming: {
    order: { type: Number, default: 1 },
    title: { type: String, default: "" },
    cover: { type: String, default: "" },
    link: { type: String, default: "" },
    video: {
      link: { type: String, default: "" },
      mobileLink: { type: String, default: "" },
    },
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
});

export default mongoose.models.homepageData ||
  mongoose.model("homepageData", homeSchema);
