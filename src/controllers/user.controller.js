import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import passport from "passport";

const registerUser = async(req,res) =>{

    const { name, email, password, bio, number} = req.body;
    console.log(req.body)

    try {
        const user = await User.findOne({ email });
        console.log(user)
        if (user) {
            return res.send({message: "Email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        console.log(hashPassword)
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
            bio,
            number,
        });
        const token = jwt.sign({ userID: newUser._id, email:newUser.email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRY_TIME })
        return res.status(201).send({
            "message":"registered sucessfully",
            "user_detail":newUser,
            "token":token
        });
    }
    catch(err){
        return res.status(400).send(err)
    }
}

const userLogin = async(req,res) =>{
    const { email, password,username } = req.body;
    // console.log(email) 
    // console.log(password)
    try{
        const user = await User.findOne({email}) 
        // console.log(user)
        if(!user) return res.status(400).send({ message:"No account"})
        const isMatch = bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ userID: user._id, email:user.email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRY_TIME })
            return res.status(201).send({
                "message": "Login Success",
                "token": token })
        }
        if(username) return res.status(400).json({
            "message": "username or Password is Incorrect"
        })
        return res.status(400).send({
            "message": "email or Password is Incorrect"
        })
    }
    catch(err){
        return res.status(400).send({ "message" : "invalid credential" })
    }
}

  const handleGoogleAuth = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  };

  const handleGoogleCallback = (req, res) => {
    passport.authenticate('google', { failureRedirect: '/login' })(req, res, () => {
      // Executed after successful authentication
      const token = jwt.sign({ userID: req?.user?._id, email:req?.user.email }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.EXPIRY_TIME })
      res.send({
        "user": req?.user,
        'token':token
      }); // Assuming you have a profile page
    });
  };

const getAllProfileDetails = async(req,res) =>{
    const { userID, email } = req.authData
    console.log(1234)
    try {
        const user =await User.findOne({ _id:userID})
        let profile
        if(user.admin){
            profile = await User.find({})
        }
        else if(!user.admin){
            profile = await User.find({ isPublic:"true" });
        }
        return res.status(201).send({ "profiles" : profile})
    } catch (err) {
        return res.status(400).send("Unable to retrieve profile")
    }
}

const editUploadPhoto = async(req, res) =>{
    // console.log(2343212332)
    const { userID, email } = req.authData
    try {
        const user =await User.findOne({ _id:userID})
        // console.log(req.file)
        const image = await uploadOnCloudinary(req.file?.path)
                user.photo = image.url
                await user.save();
        return res.status(201).send({ "profiles" : user})
    } catch (err) {
        return res.status(400).send("Unable to upload photo")
    }
}

const editProfile = async(req, res) =>{
    const { userID } = req.authData
    const { name, email, bio, password, isPublic, number } = req.body;
    try {

    const existingUser = await User.findOne({ email, _id: { $ne: userID } });
    if (existingUser) {
      return res.status(400).send('Email already in use by another user');
    }
    const updatedFields = { name, bio, email, isPublic, number };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );
        return res.status(201).send({ "profile Updated sucessfully" : updatedUser})
    } catch (err) {
        return res.status(400).send("Unable to edit profile")
    }
}

const makeAdmin = async(req, res) =>{
    const userID = req.params.id;
    try {
        const user =await User.findOne({ _id:userID})
                user.admin = 'true'
                await user.save();
        return res.status(201).send({ "profiles" : user})
    } catch (err) {
        return res.status(400).send("Unable to make admin")
    }

}


export {
    registerUser,
    userLogin,
    getAllProfileDetails,
    editUploadPhoto,
    editProfile,
    // getAllProduct,
    // cartItems,
    // AddProduct,
    // addToCart,
    // deleteFromCart,
    makeAdmin,
    handleGoogleCallback,
    handleGoogleAuth,
}
