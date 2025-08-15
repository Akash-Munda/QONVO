// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// export const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;
//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized access" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if(!decoded) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();

//   } catch (error) {
//     console.error("Error in auth middleware:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute =
  (require = true) =>
  async (req, res, next) => {
    try {
      // console.log(process.env.JWT_SECRET);

      const token = req.cookies?.jwt;
      // No token case
      if (!token) {
        return require
          ? res
              .status(401)
              .json({ message: "Unauthorized access, no token found" })
          : next();
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded._id);

      if (!decoded) {
        return require
          ? res.status(401).json({ message: "Invalid or expired token" })
          : next();
      }

      // Fetch user
      const user = await User.findById(decoded._id);
      if (!user) {
        return require
          ? res.status(401).json({ message: "User not found" })
          : next();
      }

      // Attach user to request
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Error in auth middleware:", error.message);
      return require
        ? res.status(500).json({ message: "Internal Server Error during Auth" })
        : next(); // Optional auth skips on error
    }
  };
