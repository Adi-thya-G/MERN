import { Router } from "express";
import { allFriends,getAllMessageOfId,markMessageAsSeen ,search} from "../controller/message.controller.js";
import socetVerify from '../middleware/socketVerify.middleware.js'
import { verifyjwt } from "../middleware/verify.middleware.js";
const router=Router()


router.route("/allfriends").post(verifyjwt,allFriends)
router.route("/getallmessage/:id").get(verifyjwt,getAllMessageOfId)
router.route("/seen/:id").put(verifyjwt,markMessageAsSeen)
router.route("/searchlist/").get(verifyjwt,search)
export default router