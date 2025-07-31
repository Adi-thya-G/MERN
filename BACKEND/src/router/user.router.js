import { Router } from "express";
import { registerUser,login ,getCurrentUser,logout,
  updateUserDeatils,createResetToken,verifyResetToken1,
  changePassword,createAccessToken,userHome,viewprofile} from "../controller/user.controller.js";
import { verifyjwt } from "../middleware/verify.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {verifyResetToken} from '../middleware/verifyResetToken.middleware.js'
const router=Router();
router.route("/register").post(registerUser);
router.route("/login").post(login)
router.route("/getcurrentuser").post(verifyjwt,getCurrentUser)
router.route("/logout").post(verifyjwt,logout)
router.route("/updateuserdetails").post(verifyjwt,upload.single("file"),updateUserDeatils)
router.route("/resetToken").post(createResetToken)
router.route("/verify-reset-token/:resetToken").get(verifyResetToken,verifyResetToken1)
router.route("/changepassword/:resetToken").post(verifyResetToken,changePassword)
router.route("/generate-accesstoken").post(createAccessToken)
router.route("/home").post(verifyjwt,userHome)
router.route("/viewprofile/:id").get(verifyjwt,viewprofile)
export default router;


