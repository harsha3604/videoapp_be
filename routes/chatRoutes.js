// routes/noteRoutes.js
import express from "express";
import db from "../sqldatabase.js";
import verifyLogin from "../middleware/verifyLogin.js";

const router = express.Router();
const ChatRoom = db.ChatRoom;
const ChatParticipant = db.ChatParticipant;

// create room
router.post("/create", verifyLogin.verifyLogin, async (req, res) => {
  try {
    const { isGroup, groupName } = req.body;

    const userId = req.loginData.userId;

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

// get rooms where you are the participant and creator.
router.get("/", verifyLogin.verifyLogin, async (req, res) => {
  const userId = req.loginData.userId;

  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const { rows: rooms, count: totalChatRooms } = await ChatRoom.findAndCountAll(
    {
      include: [
        {
          model: ChatParticipant,
          as: "chatroomchatparticipant",
          where: { userId },
          attributes: [], // we don't need participation fields in the response
          distinct: true,
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]], // optional: sort newest first
    }
  );

  // Pagination metadata
  const totalPages = Math.ceil(totalChatRooms / limit);

  res.status(200).json({
    currentPage: page,
    totalPages,
    totalChatRooms,
    rooms,
    message: "Chat Rooms sent successfully.",
  });
});

// delete rooms.

export default router;
