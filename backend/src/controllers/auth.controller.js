import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";                        

//SIGNUP
export const signup = async (req, res) => {
  //   res.send("signup route is working");
  const { email, fullName, password } = req.body;
  try {
    //hash password
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      //generate JWT token here
      generateToken(newUser._id, res);
      //send response to client
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "User creation failed" });
    }
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//LOGIN
export const login = async (req, res) => {
  // res.send("login route is working");

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credential" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credential" });
    }

    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//LOGOUT
//clear cookie

export const logout = (req, res) => {
  // res.send("logout route is working");
  try {
    res.clearCookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//UPADTE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id; // Ensure user ID is set

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    //here we upload the profile picture to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    // Check if uploadResponse and secure_url exist
    // if (!uploadResponse || !uploadResponse.secure_url) {
    //   return res
    //     .status(500)
    //     .json({ message: "Failed to upload profile picture" });
    // }
    //update user profile with new profile picture
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true,  }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updateUser);
    //find the user by ID
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//this function is used to check if the user is authenticated or not
//it will return the user object if authenticated

export const checkAuth = (req, res) => {
  try{
    res.status(200).json(req.user);
  }catch (error) {
    console.error("Error checking authentication:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}