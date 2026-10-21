import mongoose from "mongoose";



const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:false
    },
    googleId:{
        type:String,
        default:""
    },
    authProvider:{
        type:String,
        enum:['local', 'google'],
        default:"local"
    },
    image:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:"user"
    }
})
const User=mongoose.model('User',userSchema)
export default User 