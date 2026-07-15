import express from "express";
import db from "../sqldatabase.js";
import verifyLogin from "../middleware/verifyLogin.js";
import roleOnly from "../middleware/roleOnly.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const Event = db.Event;
const Registration = db.Registration;
const User = db.User;

//CREATE

router.post(
  "/create",
  verifyLogin.verifyLogin,
  roleOnly("founder"),
  async (req, res) => {
    try {
      // console.log("started");
      // console.log(req.cookies);
      const { title, description, date, capacity, location, locationLink } =
        req.body;

      if (!title || !date || !capacity || !location || !locationLink) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const event = await Event.create({
        title,
        description,
        date,
        capacity,
        location,
        locationLink,
      });
      res
        .status(201)
        .json({ message: "Event created successfully", event: event });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

//GET
router.get("/:event_id", async (req, res) => {
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
router.put(
  "/:event_id",
  verifyLogin.verifyLogin,
  roleOnly("founder"),
  async (req, res) => {
    try {
      const { event_id } = req.params;
      const { title, description, date, capacity, location, locationLink } =
        req.body;

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
      if (location) event.location = location;
      if (locationLink) event.locationLink = locationLink;

      await event.save();

      return res
        .status(200)
        .json({ message: "Event updated successfully", event: event });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

//GET WITH PAGINATION
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "No token found" });
    const decoded = jwt.verify(token, process.env.secretKey);
    const user = await User.findByPk(decoded.id);
    const userId = user.dataValues.id;

    const { rows: events, count: totalEvents } = await Event.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Registration,
          as: "eventregistration",
          attributes: ["userId", "attendanceStatus"],
          where: {
            attendanceStatus: "registered",
          },
          required: false,
        },
      ],
    });

    const eventsWithRegistrationInfo = events.map((event) => {
      const eventJson = event.toJSON();
      const registrations = eventJson.eventregistration;

      return {
        ...eventJson,
        registeredCount: registrations.length,
        seatsLeft: eventJson.capacity - registrations.length,
        isRegistered: userId
          ? registrations.some((r) => r.userId === userId)
          : false,
      };
    });

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
      events: eventsWithRegistrationInfo,
      message: "Events sent successfully.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

//DELETE
router.delete(
  "/:event_id",
  verifyLogin.verifyLogin,
  roleOnly("founder"),
  async (req, res) => {
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
  },
);

export default router;
