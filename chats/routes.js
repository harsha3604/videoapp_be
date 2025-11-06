// routes/noteRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../sqldatabase");
const jwt = require("jsonwebtoken");

const User = db.User;
const Note = db.Note;
const ChatRoom = db.ChatRoom;
const ChatParticipant = db.ChatParticipant;

router.post("/create", async (req, res) => {
  try {
    const { isGroup, groupName } = req.body;
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "No token found" });

    const decoded = jwt.verify(token, process.env.secretKey);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const userId = user.dataValues.id;

    const room = await ChatRoom.create({
      groupName: groupName,
      isGroup: isGroup,
      createdBy: userId,
    });

    const roomId = room.dataValues.id;

    // Add creator as participant
    await ChatParticipant.create({
      userId: userId,
      chatRoomId: roomId,
    });

    res.status(200).json({ message: "Chat room created successfully", room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
