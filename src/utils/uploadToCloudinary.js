import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const uploadToCloudinary = async (filePath, folder = "events") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });

    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

export default uploadToCloudinary;
