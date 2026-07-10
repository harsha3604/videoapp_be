// routes/noteRoutes.js
import express from "express";
import db from "../sqldatabase.js";
import verifyLogin from "../middleware/verifyLogin.js";

const router = express.Router();
const Note = db.Note;

// CREATE
router.post("/create", verifyLogin.verifyLogin, async (req, res) => {
  try {
    const { title, content } = req.body;

    const userId = req.loginData.userId;

    if (!title || !content)
      return res
        .status(400)
        .json({ message: "Both fields need to be filled." });

    const note = await Note.create({ title, content, userId });
    res.status(201).json({ message: "Success", note: note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET
router.get("/:note_id", verifyLogin.verifyLogin, async (req, res) => {
  try {
    const { note_id } = req.params;

    const userId = req.loginData.userId;

    const note = await Note.findOne({
      where: {
        id: note_id,
        userId: userId,
      },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    return res
      .status(200)
      .json({ message: "Note retrieved successfully", note: note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET WITH PAGINATION
router.get("/", verifyLogin.verifyLogin, async (req, res) => {
  try {
    const userId = req.loginData.userId;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Fetch notes
    const { rows: notes, count: totalNotes } = await Note.findAndCountAll({
      where: { userId },
      limit,
      offset,
      order: [["createdAt", "DESC"]], // optional: sort newest first
    });

    // Pagination metadata
    const totalPages = Math.ceil(totalNotes / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalNotes,
      notes,
      message: "Notes sent successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:note_id", verifyLogin.verifyLogin, async (req, res) => {
  try {
    const { note_id } = req.params;
    const { title, content } = req.body;

    const userId = req.loginData.userId;

    const note = await Note.findOne({
      where: {
        id: note_id,
        userId: userId,
      },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = title;
    note.content = content;
    await note.save();

    return res
      .status(200)
      .json({ message: "Note updated successfully", note: note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE
router.delete("/:note_id", verifyLogin.verifyLogin, async (req, res) => {
  try {
    const { note_id } = req.params;

    const userId = req.loginData.userId;

    const note = await Note.findOne({
      where: {
        id: note_id,
        userId: userId,
      },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.destroy();

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
