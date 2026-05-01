import express from "express";
import {
  sendNotification,
  getUserNotifications,
  markAllAsRead,
} from "../controllers/notificationController";

const router = express.Router();

router.post("/send", sendNotification);
router.get("/:userId", getUserNotifications);
router.put("/mark-read/:userId", markAllAsRead);

export default router;
