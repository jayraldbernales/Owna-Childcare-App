import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const authentication = {
  signup: async (req: Request, res: Response) => {
    const firstname = req.body.firstname?.trim();
    const lastname = req.body.lastname?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    const role = "user";

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      const userExists = await prisma.user.findUnique({ where: { email } });
      if (userExists) {
        return res.status(409).json({ error: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          firstname,
          lastname,
          email,
          password: hashedPassword,
          role,
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
        },
      });
      return res.status(201).json({ user });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ error: "Server error." });
    }
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const { signToken } = require("../utils/jwt");
      const token = signToken({ id: user.id.toString(), role: user.role });

      // Store session in Redis
      if (req.session) {
        req.session.userId = user.id.toString();
      }

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Server error." });
    }
  },

  logout: (req: Request, res: Response) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
      });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logout successful" });
  },
};

export default authentication;
