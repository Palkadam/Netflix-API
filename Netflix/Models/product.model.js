import mongoose from "mongoose";
import categoryModel from '../Models/category.model'
import subcategoryModel from '../Models/sub_category.model'
import castModel from '../Models/cast.model'

const Schema = mongoose.Schema

const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    categoryID:{
        type:Schema.Types.ObjectId,
        ref: categoryModel
    },
    SubCategoryID:{
        type:Schema.Types.ObjectId,
        ref: subcategoryModel
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    releaseDate:{
        type:Date,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    cast:[
        {
            type:Schema.Types.ObjectId,
            ref:castModel
        }
    ],
    created_At:{
        type:Date,
        default:Date.now()
    }
})

export default mongoose.model('product',productSchema);


