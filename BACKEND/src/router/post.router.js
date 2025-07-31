import { uploadPost,deletePost,updatePost ,allpost,allComments} from "../controller/post.controller.js";
import { Router } from "express";
import { verifyjwt } from "../middleware/verify.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router=Router()

router.route("/uploads").post(upload.single("file"),verifyjwt,uploadPost)
router.route("/delete/:fileId").delete(verifyjwt,deletePost)
router.route("/updatepost").patch(verifyjwt,updatePost)
router.route("/allpost").get(verifyjwt,allpost)
router.route("/allcomments/:id").get(verifyjwt,allComments)
export default router