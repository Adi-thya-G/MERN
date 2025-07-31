import { Router } from "express";
import {follow,countFollowerAndFollowingAndPost} from '../controller/follower.controller.js'
import {verifyjwt} from '../middleware/verify.middleware.js'
const router=Router()

router.route("/:id").post(verifyjwt,follow)
router.route("/count/:id").get(verifyjwt,countFollowerAndFollowingAndPost)
export default router