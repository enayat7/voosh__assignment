import { Router } from "express"
import registrationValidate from "../middlewares/registerErrHandle.middleware.js";
import { editProfile, editUploadPhoto, getAllProfileDetails, handleGoogleAuth, handleGoogleCallback, makeAdmin, registerUser } from "../controllers/user.controller.js";
import loginValidate from "../middlewares/loginErrHandle.middleware.js";
import { verifyToken } from "../middlewares/auth.middlware.js";
import { userLogin } from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/google').get(handleGoogleAuth);
router.route('/auth/google/callback').get(handleGoogleCallback); 

router.route("/register").post(registrationValidate, registerUser)
router.route("/login").post(loginValidate, userLogin)
router.route("/all-profile-details").get(verifyToken,getAllProfileDetails);
router.route("/upload-edit-photo").post(verifyToken,upload.single('photo'),editUploadPhoto)
router.route('/edit-profile').put(verifyToken, editProfile)
router.route('/make-admin/:id').post(verifyToken,makeAdmin)
      


export default router

