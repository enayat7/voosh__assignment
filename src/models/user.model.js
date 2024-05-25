import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    name: { 
        type: String, 
    },
    email: { 
        type: String, 
        required: [true, 'email is required'],
        // unique: true,
        // lowercase:true,
        // trim : true
    },
    password:{
        type: String,
    },
    photo:{
        type: String,
    },
    bio:{
        type: String,
    },
    number:{
        type: String,
    },
    isPublic:{
        type: Boolean,
        default:"true",
    },
    googleId:{
        type: String,
    },
    admin :{
        type: Boolean,
        default:"false",
    }
    
},{ timestamps: true })

export const User = mongoose.model("User", userSchema)
