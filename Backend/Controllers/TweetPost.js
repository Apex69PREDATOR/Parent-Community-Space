import postModel from "../Schemas/PostSchema.js";
import cloudinary from "./Cloudinary.setup.js";
import fs from "fs"
import { io } from "../index.js";
import { candidates } from "./Socket.setup.js";
import { log } from "console";
import jwt from "jsonwebtoken"
import { config } from "dotenv";

config()

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

const signToken =  (name)=>{
    let token = jwt.sign({name},process.env.PRIVATE_KEY,{expiresIn:'30d'})
    return token
}

const handlePost = async (req,res)=>{

    let publicId = null
    let secure_url

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

        secure_url = uploadStream.secure_url
    }

    const newPost = new postModel({author,message,picPath:secure_url})

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
        let filterBy = req.params.filterBy
        
        let allPosts
        if(filterBy === "DateAsc")
        allPosts = await postModel.find({},{comments:0}).sort({createdAt:-1})
        else if(filterBy === "DateDsc")
        allPosts = await postModel.find({},{comments:0})
        else if(filterBy === "Likes")
        allPosts = await postModel.find({},{comments:0}).sort({likes:-1})
    
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


        candidates.forEach(id=>(
            io.to(id).emit("incrComment",updatedDoc._id,updatedDoc.commentCount,{author,text})
        ))



        return res.status(200).json({updatedDoc,message:"new comment added!"})
        
    } catch (error) {
        return res.status(500).json({message:"error finding comments"})
    }
}

const handleLike = async (req,res)=>{
    try {
        let postId = req.params.id
        let {token} = req.body
        
        let updatedDoc = await postModel.findByIdAndUpdate(postId,{$inc:{likes:1},$push:{likedBy:token}},{new:true})
       
        candidates.forEach(id=>(
            io.to(id).emit("incrLike",updatedDoc._id,updatedDoc.likes,token)
        ))

        return res.status(200).json({updatedDoc,message:"Liked!"})
        
    } catch (error) {
        return res.status(500).json({message:"error giving like to that post"})
    }
}

const setName = async (req,res)=>{

    try{
    let {name} = req.body

    let token = signToken(name)

    console.log(token);
    

    res.status(200).json({token,name,message:"new name set successfully!"})

    }
    catch(e){
        console.log(e);
        
        res.status(500).json({message:"some error occured"})
    }


}


export {handlePost,handleGet,handleGetComments,handlePostComments,handleLike,setName}