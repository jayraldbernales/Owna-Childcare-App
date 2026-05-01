import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const sendNotification = async (req: Request, res: Response) => {
  const { parentIds, message } = req.body;
  const io = req.app.get("io"); // Might be undefined in tests

  if (!parentIds || !Array.isArray(parentIds) || !message) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  try {
    const notifications = await Promise.all(
      parentIds.map((userId: number) =>
        prisma.notification.create({
          data: {
            userId,
            message,
            read: false,
          },
        })
      )
    );

    // Only emit if io is defined (in production or development runtime)
    if (io) {
      notifications.forEach((notification) => {
        io.to(`user_${notification.userId}`).emit(
          "newNotification",
          notification
        );
      });
    }

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ error: "Failed to send notifications" });
  }
};

export const getUserNotifications = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ notifications });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    await prisma.notification.updateMany({
      where: {
        userId: parseInt(userId),
        read: false,
      },
      data: {
        read: true,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
