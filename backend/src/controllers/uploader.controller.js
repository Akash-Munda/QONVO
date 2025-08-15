import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploader = async (req, res, next) => {
  const file = req.files?.file; // name="file" in form/input

  if (!file || Array.isArray(file)) {
    return next();
  }

  // Upload to Cloudinary using the temp path
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "my_uploads", // optional
    resource_type: "auto", // auto-detect image/video
  });

  if (!result) {
    return res.status(500).json({ message: "Image uploadation failed." });
  }
  // Optional: Delete local temp file after upload
  fs.unlinkSync(file.tempFilePath);

  req.file = {
    url: result.secure_url,
    public_id: result.public_id,
  };

  next(); // move on to your profile update controller
};

export default uploader;
