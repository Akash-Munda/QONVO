// // const express = require('express');
// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import { connectDB } from "./lib/db.js";

// import authRoutes from "./routes/auth.route.js";
// import messageRoutes from "./routes/message.route.js";
// import { app, server } from "./lib/socket.js";

// dotenv.config();

// const PORT = process.env.PORT;

// app.use(express.json());
// app.use(cookieParser());
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Adjust this to your frontend URL
//     credentials: true, // Allow credentials (cookies, authorization headers, etc.)
//   })
// );

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// server.listen(PORT, () => {
//   console.log("Server is running on port :" + PORT);
//   connectDB();
// });

import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import path from "path";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
// const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ===== Middleware =====
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 1 * 1024 * 1024 },
  })
);

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// if (process.env.NODE_ENV === "production") {
//   // Serve static files from the React frontend app
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   // Handle React routing, return all requests to React app
//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.join(__dirname, "../frontend/dist", "dist", "index.html")
//     );
//   });
// }

app.use(express.static(path.join(__dirname, "../frontend/dist"))); // if Vite
// app.use(express.static(path.join(__dirname, "../frontend/build"))); // if CRA

// Catch-all to serve index.html for React Router
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ===== Serve Frontend in Production =====
// app.use(express.static(path.join(__dirname, "frontend", "dist")));

// // Catch-all for client-side routing
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

// ===== Root Route =====
app.get("/server", (req, res) => {
  res.status(200).json({ message: "Server fired up" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server running fine" });
});

// ===== 404 Handler =====

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ===== Setup Socket.IO =====

// ===== Start Server =====
server.listen(PORT, () => {
  console.log(`Server fired up on ${PORT}`);
  connectDB();
});
