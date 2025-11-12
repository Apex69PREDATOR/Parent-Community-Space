import postModel from "../Schemas/PostSchema.js";
import cloudinary from "./Cloudinary.setup.js";
import fs from "fs"
import { io } from "../index.js";
import { candidates } from "./Socket.setup.js";

let uploadToCloudinary =(filePath)=>{
      return new Promise((resolve,reject)=>{
        let stream = cloudinary.uploader.upload_stream({resource_type:'image'},(error,result)=>{
            if(error)
                return reject(error)
            else
                return resolve(result)
        })

        fs.createReadStream(filePath).pipe(stream)

      })
}

const handlePost = async (req,res)=>{

    let publicId = null

    try{
    let {author,message} = req.body

    let file = req?.file?.path

    if(file){
        let uploadStream = await uploadToCloudinary(file)

        fs.unlink(file,(err)=>{
            if(err)
                console.log('error deleting from server storage');
            else
                console.log('file deleted!');
        })

        publicId = uploadStream.public_id
    }

    const newPost = new postModel({author,message,picPath:file})

    await newPost.save()

    candidates.forEach(id=>(
        io.to(id).emit("newPost",newPost)
    ))

    return res.status(200).json({message:"New Post posted successfully"})
    }
    catch(e){

    res.status(500).json({message:"Error uploading your post"})

    if(publicId){
        try {
                await cloudinary.uploader.destroy(publicId)
            } catch (destroyErr) {
                console.error("Failed to delete uploaded image:", destroyErr.message)
            }
    }
    }
}

const handleGet = async (req,res)=>{

    try{
    const allPosts = await postModel.find({},{comments:0}).sort({createdAt:-1})
    console.log(allPosts);
    
    return res.status(200).json({allPosts})
    }
    catch(e){
        return res.status(500).json({message:"cannot get posts for now"})
    }

}

const handleGetComments = async (req,res)=>{
    try {

        let postId = req.params.id

        let comments = await postModel.findById(postId,{comments:1,_id:0})

        return res.status(200).json({comments})
        
    } catch (error) {
        return res.status(500).json({message:"error finding comments"})
    }
}

const handlePostComments = async (req,res)=>{
    try {

        let postId = req.params.id
        let {author,text} = req.body

        let updatedDoc = await postModel.findByIdAndUpdate(postId,{$push:{comments:{author,text}},$inc:{commentCount:1}},{new:true})

        console.log(updatedDoc);

        candidates.forEach(id=>(
            io.to(id).emit("incrComment",updatedDoc._id,updatedDoc.commentCount,{author,text})
        ))



        return res.status(200).json({updatedDoc})
        
    } catch (error) {
        return res.status(500).json({message:"error finding comments"})
    }
}

const handleLike = async (req,res)=>{
    try {
        let postId = req.params.id
        console.log(postId);
        
        let updatedDoc = await postModel.findByIdAndUpdate(postId,{$inc:{likes:1}},{new:true})

        candidates.forEach(id=>(
            io.to(id).emit("incrLike",updatedDoc._id,updatedDoc.likes)
        ))

        return res.status(200).json({updatedDoc})
        
    } catch (error) {
        return res.status(500).json({message:"error giving like to that post"})
    }
}



export {handlePost,handleGet,handleGetComments,handlePostComments,handleLike}