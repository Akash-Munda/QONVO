// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     fullName: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     profilePic: {
//       type: String,
//       default: " ",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const User = mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    email: { 
      type: String,
      required: [true, "Kindly provide email address"],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
      default: " ",
    },
    password: {
      type: String,
      required: [true, "Kindly provide password"],
      minlength: 6,
      trim: true,
    },
    profilePic: {
      type: String,
      default: "/avatar.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
