import express from "express";
import db from "../sqldatabase.js";
import verifyLogin from "../middleware/verifyLogin.js";

const router = express.Router();
const Event = db.Event;

//CREATE

router.post("/create", verifyLogin.verifyLogin, async (req, res) => {
  try {
    console.log("started");
    const { title, description, date, capacity } = req.body;

    if (!title || !date || !capacity) {
      return res
        .status(400)
        .json({ message: "Title, date, and capacity are required." });
    }

    const event = await Event.create({ title, description, date, capacity });
    res
      .status(201)
      .json({ message: "Event created successfully", event: event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET
router.get("/:event_id", verifyLogin.verifyLogin, async (req, res) => {
  try {
    const { event_id } = req.params;

    const event = await Event.findOne({
      where: {
        id: event_id,
      },
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    return res
      .status(200)
      .json({ message: "Event retrieved successfully", event: event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//UPDATE
router.put("/:event_id", verifyLogin.verifyLogin, async (req, res) => {
  try {
    const { event_id } = req.params;
    const { title, description, date, capacity } = req.body;

    const event = await Event.findOne({
      where: {
        id: event_id,
      },
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Update the event fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = date;
    if (capacity) event.capacity = capacity;

    await event.save();

    return res
      .status(200)
      .json({ message: "Event updated successfully", event: event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET WITH PAGINATION
router.get("/", verifyLogin.verifyLogin, async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    // Fetch events
    const { rows: events, count: totalEvents } = await Event.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]], // optional: sort newest first
    });

    // Pagination metadata
    const totalPages = Math.ceil(totalEvents / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalEvents,
      events,
      message: "Events sent successfully.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE
router.delete("/:event_id", verifyLogin.verifyLogin, async (req, res) => {
  try {
    const { event_id } = req.params;

    const event = await Event.findOne({
      where: {
        id: event_id,
      },
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.destroy();

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
