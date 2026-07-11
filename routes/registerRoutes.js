import express from "express";
import db from "../sqldatabase.js";
import verifyLogin from "../middleware/verifyLogin.js";
import roleOnly from "../middleware/roleOnly.js";

const router = express.Router();
const { User, Event, Registration, sequelize } = db;

//register for an event
router.post(
  "/:eventId/registrations",
  verifyLogin.verifyLogin,
  roleOnly("member"),
  async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const userId = req.user.id; // from auth middleware
      const { eventId } = req.params;

      const event = await Event.findByPk(eventId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!event) {
        await transaction.rollback();
        return res.status(404).json({
          message: "Event not found",
        });
      }

      if (new Date(event.date) < new Date()) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Event has already ended",
        });
      }

      const existingRegistration = await Registration.findOne({
        where: {
          userId,
          eventId,
          attendanceStatus: "registered",
        },
        transaction,
      });

      if (existingRegistration) {
        await transaction.rollback();
        return res.status(409).json({
          message: "Already registered for this event",
        });
      }

      const registrationCount = await Registration.count({
        where: {
          eventId,
          attendanceStatus: "registered",
        },
        transaction,
      });

      if (registrationCount >= event.capacity) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Event is full",
        });
      }

      const registration = await Registration.create(
        {
          userId,
          eventId,
        },
        { transaction },
      );

      await transaction.commit();

      return res.status(201).json({
        message: "Registration successful",
        registration,
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        message: error.message,
      });
    }
  },
);

//deregister from an event
router.delete(
  "/:eventId/registrations",
  verifyLogin.verifyLogin,
  roleOnly("member"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { eventId } = req.params;

      const registration = await Registration.findOne({
        where: {
          userId,
          eventId,
          attendanceStatus: "registered",
        },
      });

      if (!registration) {
        return res.status(404).json({
          message: "Registration not found",
        });
      }

      registration.attendanceStatus = "cancelled";

      await registration.save();

      return res.status(200).json({
        message: "Registration cancelled",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
);

//all events a user registered for
router.get(
  "/me/registrations",
  verifyLogin.verifyLogin,
  roleOnly("member"),
  async (req, res) => {
    const userId = req.user.id;
    try {
      const eventsRegistered = await db.Registration.findAll({
        where: {
          userId: userId,
          attendanceStatus: "registered",
        },
        include: [
          {
            model: db.Event,
            as: "registrationevent",
          },
        ],
      });

      return res.status(200).json({
        message: "Events Retrieved Successfully",
        events: eventsRegistered,
        eventsCount: eventsRegistered.length,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
);

//all users who registered for an event
router.get(
  "/:eventId/registrations",
  verifyLogin.verifyLogin,
  roleOnly("founder"),
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const event = await db.Event.findByPk(eventId);
      const registration = await db.Registration.findAll({
        where: {
          eventId: eventId,
          attendanceStatus: "registered",
        },
        include: [
          {
            model: db.User,
            as: "registrationuser",
            attributes: ["id", "userName", "email"],
          },
        ],
      });
      const count = registration.length;
      const seatsLeft = event.capacity - count;

      return res.status(200).json({
        message: "Registrations retrieved successfully",
        registrations: registration,
        registrationCount: count,
        seatsLeft: seatsLeft,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
);

export default router;
