import mongoose from "mongoose";

const Schema = mongoose.Schema

const subCategory = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

export default mongoose.model('sub_category',subCategory)