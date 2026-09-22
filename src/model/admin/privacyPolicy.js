import mongoose from "mongoose";
const { Schema } = mongoose;

const privacyPolicySchema = new Schema(
    {
        title: {
            type: String,
        },
        description: {
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

export default mongoose.models.privacyPolicy || mongoose.model("privacyPolicy", privacyPolicySchema);
