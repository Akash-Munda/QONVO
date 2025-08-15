// import { generateToken } from "../lib/utils.js";
// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import cloudinary from "../lib/cloudinary.js";

// //SIGNUP
// export const signup = async (req, res) => {
//   //   res.send("signup route is working");
//   const { email, fullName, password } = req.body;
//   try {
//     //hash password
//     if (!email || !fullName || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 6 characters long" });
//     }

//     const user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       fullName,
//       email,
//       password: hashedPassword,
//     });
//     if (newUser) {
//       //generate JWT token here
//       generateToken(newUser._id, res);
//       //send response to client
//       await newUser.save();
//       return res.status(201).json({
//         _id: newUser._id,
//         fullName: newUser.fullName,
//         email: newUser.email,
//         profilePic: newUser.profilePic,
//       });
//     } else {
//       return res.status(400).json({ message: "User creation failed" });
//     }
//   } catch (error) {
//     console.error("Error during signup:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// //LOGIN
// export const login = async (req, res) => {
//   // res.send("login route is working");

//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credential" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Invalid credential" });
//     }

//     generateToken(user._id, res);
//     return res.status(200).json({
//       _id: user._id,
//       fullName: user.fullName,
//       email: user.email,
//       profilePic: user.profilePic,
//     });
//   } catch (error) {
//     console.error("Error during login:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// //LOGOUT
// //clear cookie

// export const logout = (req, res) => {
//   // res.send("logout route is working");
//   try {
//     res.clearCookie("jwt", "", { maxAge: 0 });
//     return res.status(200).json({ message: "Logout successfully" });
//   } catch (error) {
//     console.error("Error during logout:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// //UPADTE PROFILE
// export const updateProfile = async (req, res) => {
//   try {
//     const { profilePic } = req.body;
//     const userId = req.user._id; // Ensure user ID is set

//     if (!profilePic) {
//       return res.status(400).json({ message: "Profile picture is required" });
//     }
//     //here we upload the profile picture to cloudinary
//     const uploadResponse = await cloudinary.uploader.upload(profilePic);
//     // Check if uploadResponse and secure_url exist
//     // if (!uploadResponse || !uploadResponse.secure_url) {
//     //   return res
//     //     .status(500)
//     //     .json({ message: "Failed to upload profile picture" });
//     // }
//     //update user profile with new profile picture
//     const updateUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: uploadResponse.secure_url },
//       { new: true,  }
//     );

//     if (!updateUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(updateUser);
//     //find the user by ID
//   } catch (error) {
//     console.error("Error updating profile:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// //this function is used to check if the user is authenticated or not
// //it will return the user object if authenticated

// export const checkAuth = (req, res) => {
//   try{
//     res.status(200).json(req.user);
//   }catch (error) {
//     console.error("Error checking authentication:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// }

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
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All mandatory fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (!/[a-z]/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must have small character" });
    }

    if (!/[A-Z]/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must have a capital character" });
    }

    if (!/\d/.test(password)) {
      return res.status(400).json({ message: "Password must have a number" });
    }

    if (/\s/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must not have space between" });
    }
    if (!/\W/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must have special characters" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with email already exists. Please login." });
    }

    // const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    // const newUser = new User({
    //   fullName,
    //   email,
    //   password: hashedPassword,
    // });

    if (!newUser) {
      return res.status(400).json({ message: "User creation failed" });

      //generate JWT token here
      //send response to client
      // await newUser.save();
    }
    generateToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////
//LOGIN
export const login = async (req, res) => {
  // res.send("login route is working");
  if (req.user) {
    return res.status(200).json({ message: "User already logged in." });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password." });
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

////////////////////////////////////////////////////////////////////////////
//LOGOUT
//clear cookie

export const logout = (req, res) => {
  // res.send("logout route is working");
  try {
    // res.clearCookie("jwt", "", { maxAge: 0 });
    res.clearCookie("jwt", {
      httpOnly: true, //prevent XSS attaks cross site scripting attacks
      sameSite: "None", //CSRF attacks cross site request forgery attacks
      secure: true,
      path: "/",
    });
    return res
      .status(200)
      .json({ message: `Logout successfully, PLease visit again.` });
  } catch (error) {
    console.error("Error during logout:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/////////////////////////////////////////////////////////////////////////////

//UPADTE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body ?? {};
    const { url } = req.file ?? {};
    const userId = req.user._id; // Ensure user ID is set

    if (!userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update profile,login required." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName && fullName !== user.fullName) {
      user.fullName = fullName;
    }
    if (url) {
      user.profilePic = url;
    }
    await user.save();

    res.status(200).json(user);
    //find the user by ID
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//this function is used to check if the user is authenticated or not
//it will return the user object if authenticated

export const checkAuth = async (req, res) => {
  try {
    console.log("Api auth check");
    let user = await User.findById(req.user?._id);
    if (req.user) return res.status(200).json(user);
    return res.status(403).json({ message: "User not authenticated" });
  } catch (error) {
    console.error("Error checking authentication:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(`getting user ${id}`);
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(203).json({ user });
  } catch (error) {
    console.error(` Error fetching user : ${error.message}`);
    return res
      .status(500)
      .json({ message: `Internal Server Error : ${error.message}` });
  }
};
