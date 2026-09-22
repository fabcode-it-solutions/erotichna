import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    otpTokenExpire: {
      type: String,
    },
    last_name: {
      type: String,
    },
    otpToken: {
      type: String,
    },
    passwordTokenExpire: {
      type: String,
    },
    passwordToken: {
      type: String,
    },
    passwordPin: {
      type: String,
    },
    userID: {
      type: String,
    },
    username: {
      type: String,
    },
    firstName: {
      type: String,
    },
    role: {
      type: String,
    },
    subscription: {
      type: { type: String, default: "" },
      active: { type: Boolean, default: false },
    },
    status: {
      type: String,
    },
    loginType: {
      type: String,
      enum: ["password", "google", "twitter"],
      default: "password",
    },
    googleId: {
      type: String,
      default: null,
    },
    twitterEmail: {
      type: String,
      unique: true,
      sparse: true,
    },
    twitterId: {
      type: String,
      default: "",
    },
    checkedout: { type: Boolean, default: false },
    checkoutDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Customers ||
  mongoose.model("Customers", userSchema);
