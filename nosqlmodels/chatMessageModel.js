import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: Number,
      required: true,
    },
    senderId: {
      type: Number,
      required: true,
    },
    receiverId: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    //implement media later.
  },
  { timestamps: true }
);

export default mongoose.model("chatMessage", chatMessageSchema);
