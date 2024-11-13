import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/mullter.js"
import { addComment, addNewPost , allPost, bookmarkPost, deletePost, disLikePost, getCommentsPost, getUserPost, likePost } from "../controller/post.controller.js"

const router = express.Router();

router.route("/addpost").post(isAuthenticated, upload.single('image'), addNewPost);
router.route("/all").get(isAuthenticated,allPost);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, disLikePost);
router.route("/:id/comment").post(isAuthenticated, addComment); 
router.route("/:id/comment/all").post(isAuthenticated, getCommentsPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);
 
export default router;