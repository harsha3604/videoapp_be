import fs from "fs";
import db from "../sqldatabase.js";

const User = db.User;

// Deletes an uploaded file if a later step in the pipeline fails.
// Safe to call even if req.file is undefined (e.g. no image was uploaded).
const cleanupUploadedFile = (req) => {
  if (req.file?.path) {
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Failed to clean up orphaned upload:", err);
      }
    });
  }
};

const saveUser = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: { userName: req.body.userName },
    });
    if (username) {
      cleanupUploadedFile(req);
      return res.status(409).json({ message: "username already taken" });
    }

    const emailcheck = await User.findOne({
      where: { email: req.body.email },
    });
    if (emailcheck) {
      cleanupUploadedFile(req);
      return res.status(409).json({ message: "email already taken" });
    }

    // if (req.body.phoneNumber) {
    //   const phoneCheck = await User.findOne({
    //     where: { phoneNumber: req.body.phoneNumber },
    //   });
    //   if (phoneCheck) {
    //     cleanupUploadedFile(req);
    //     return res.status(409).json({ message: "phone number already taken" });
    //   }
    // }

    next();
  } catch (error) {
    console.log(error);
    cleanupUploadedFile(req);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default { saveUser, cleanupUploadedFile };
