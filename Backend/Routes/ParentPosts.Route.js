import { Router } from "express";
import { handleGet, handlePost, handlePostComments,handleGetComments, handleLike } from "../Controllers/TweetPost.js";
import upload from "../Middlewares/multer.image.js";

const router = Router()

router.route('/posts').get(handleGet)
router.route('/posts').post(upload.single('postPic'),handlePost)
router.route('/comments/:id').post(handlePostComments)
router.route('/comments/:id').get(handleGetComments)
router.route('/like/:id').post(handleLike)

export default router