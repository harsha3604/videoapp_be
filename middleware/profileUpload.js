import multer from "multer";
import path from "path";
import fs from "fs";

const profilePicUploadDir = "uploads/profile-images";

// Ensure the folder exists so multer doesn't throw on a missing directory
if (!fs.existsSync(profilePicUploadDir)) {
  fs.mkdirSync(profilePicUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePicUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, png, webp, gif) are allowed"));
  }
};

const profileUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap
});

export default profileUpload;
