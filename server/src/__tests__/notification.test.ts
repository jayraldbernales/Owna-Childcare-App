import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let userId: number;

beforeAll(async () => {
  const email = "notifuser@example.com";
  const password = "123456";

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      firstname: "Notif",
      lastname: "User",
      email,
      password: await bcrypt.hash(password, 10),
    },
  });

  userId = user.id;
});

afterAll(async () => {
  await prisma.notification.deleteMany({
    where: { userId },
  });

  await prisma.user.delete({
    where: { id: userId },
  });

  await prisma.$disconnect();
});

describe("Notification API", () => {
  it("should send a notification to a user", async () => {
    const res = await request(app)
      .post("/api/v1/notifications/send")
      .send({
        parentIds: [userId],
        message: "Hello from notification test!",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.notifications).toHaveLength(1);
    expect(res.body.notifications[0]).toMatchObject({
      userId,
      message: "Hello from notification test!",
      read: false,
    });
  });

  it("should fetch notifications for a user", async () => {
    const res = await request(app).get(`/api/v1/notifications/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.notifications)).toBe(true);
    expect(res.body.notifications.length).toBeGreaterThan(0);
  });

  it("should mark all notifications as read", async () => {
    const res = await request(app).put(
      `/api/v1/notifications/mark-read/${userId}`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true });

    const notifs = await prisma.notification.findMany({ where: { userId } });
    notifs.forEach((n) => expect(n.read).toBe(true));
  });

  it("should return 400 for missing fields", async () => {
    const res = await request(app).post("/api/v1/notifications/send").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
