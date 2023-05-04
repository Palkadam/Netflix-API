import mongoose from "mongoose"

const Schema = mongoose.Schema

const castSchema = new Schema({    
    name:{
        type:String,
        required:true
    }, 
    about:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    created_At:{
        type:Date,
        default:Date.now()
    }
})

export default mongoose.model('cast',castSchema);

