import { Router } from "express";
import { handleGet, handlePost, handlePostComments,handleGetComments, handleLike,setName } from "../Controllers/TweetPost.js";
import upload from "../Middlewares/multer.image.js";

const router = Router()

router.route('/posts/:filterBy').get(handleGet)
router.route('/posts').post(upload.single('postPic'),handlePost)
router.route('/comments/:id').post(handlePostComments)
router.route('/comments/:id').get(handleGetComments)
router.route('/like/:id').post(handleLike)
router.route('/setName').post(setName)

export default router