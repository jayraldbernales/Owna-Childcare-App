import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let token = "";
let userId: number;

beforeAll(async () => {
  const email = "usertest@example.com";
  const password = "123456";

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      firstname: "Test",
      lastname: "User",
      email,
      password: await bcrypt.hash(password, 10),
      role: "parent",
    },
  });

  userId = user.id;

  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password });

  token = res.body.token;
});

afterAll(async () => {
  await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
});

describe("UserControllers", () => {
  it("should get users by role", async () => {
    const res = await request(app)
      .get("/api/v1/user?role=parent")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(
      res.body.find((u: any) => u.email === "usertest@example.com")
    ).toBeTruthy();
  });

  it("should get user profile", async () => {
    const res = await request(app)
      .get("/api/v1/user/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("usertest@example.com");
  });

  it("should update user profile", async () => {
    const res = await request(app)
      .put("/api/v1/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstname: "Updated",
        lastname: "User",
        email: "usertest@example.com",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.firstname).toBe("Updated");
  });

  it("should change user password", async () => {
    const res = await request(app)
      .put("/api/v1/user/password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "123456",
        newPassword: "newpass123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password updated");
  });
});
