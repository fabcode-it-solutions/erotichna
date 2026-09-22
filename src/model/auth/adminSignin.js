import mongoose from "mongoose";

const { Schema} = mongoose;

const userSchema = new Schema({
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        name:{
            type:String            
        },
        role:{
            type:String,
        },
        userID:{
            type:String
        },
        username:{
            type:String
        },
        last_name: {
            type: String,
          },
        firstName:{
            type:String
        },
        otpTokenExpire:{
            type:String
        },
        otpToken:{
            type:String
        },
        passwordTokenExpire:{
            type:String
        },       
        passwordToken:{
            type:String
        }           
},{timestamps:true})

export default  mongoose.models.adminUsers || mongoose.model('adminUsers', userSchema);