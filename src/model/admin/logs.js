import mongoose from "mongoose";
const { Schema } = mongoose;

const logsSchema = new Schema(
  {
    heading: {
      type: String 
    },
    error:{
        type: String  
    },
    errorDescription:{
        type: String  
    }

  },
  { timestamps: true }
);

export default mongoose.models.logs || mongoose.model("logs", logsSchema);
