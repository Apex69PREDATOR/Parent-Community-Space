import mongoose,{Schema} from "mongoose";

const postSchema = new Schema({
    author : {type:String,required:true},
    message : {type:String,required:true},
    likes : {type:Number,required:true,default:0},
    likedBy : {type:[{type:String}],default:[]},
    createdAt : {type:Date,required:true,default:new Date},
    comments : {type:[{author:{type:String},text:{type:String}}],required:true,default:[]},
    commentCount : {type:Number,required:true,default:0},
    picPath : {type:String}
})

const postModel = mongoose.model('Posts',postSchema)

export default postModel