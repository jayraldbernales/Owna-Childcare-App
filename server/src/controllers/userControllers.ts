import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/auth";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const UserControllers = {
  init: (req: AuthRequest, res: Response) => {
    res.status(200).json({ message: "User route working" });
  },

  getUsersByRole: async (req: AuthRequest, res: Response) => {
    try {
      const role = req.query.role as string;

      if (!role) {
        return res
          .status(400)
          .json({ error: "Role query parameter is required." });
      }

      const users = await prisma.user.findMany({
        where: { role },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
        },
      });

      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users by role:", error);
      res.status(500).json({ error: "Failed to fetch users by role" });
    }
  },

  getProfile: async (req: AuthRequest, res: Response) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(req.user?.id) },
        select: {
          firstname: true,
          lastname: true,
          email: true,
          role: true,
        },
      });
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  },

  updateProfile: async (req: AuthRequest, res: Response) => {
    try {
      const { firstname, lastname, email } = req.body;
      const userId = Number(req.user?.id);

      if (!firstname || !lastname || !email) {
        return res.status(400).json({ error: "All fields are required." });
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: { firstname, lastname, email },
      });

      return res
        .status(200)
        .json({ message: "Profile updated", user: updated });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  },

  changePassword: async (req: AuthRequest, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = Number(req.user?.id);

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Current and new passwords are required.",
        });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user || !user.password) {
        return res.status(404).json({ error: "User not found." });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Current password is incorrect." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return res.status(200).json({ message: "Password updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update password" });
    }
  },
};

export default UserControllers;
