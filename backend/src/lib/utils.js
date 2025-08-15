import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in mili seconds
    httpOnly: true, //prevent XSS attaks cross site scripting attacks
    sameSite: "None",
    path: "/", //CSRF attacks cross site request forgery attacks
    // secure: process.env.NODE_ENV !== "development",
    secure: true,
  });

  return token;
};
