import request from "supertest";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Authentication API", () => {
  const testUser = {
    firstname: "Jayrald",
    lastname: "Bernales",
    email: "jayraldtest@example.com",
    password: "123456",
  };

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it("should signup a new user", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should not allow duplicate signup", async () => {
    const res = await request(app).post("/api/v1/auth/signup").send(testUser);
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error", "User already exists.");
  });

  it("should login the user with correct credentials", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should not login with wrong password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials.");
  });

  it("should logout the user", async () => {
    const res = await request(app).post("/api/v1/auth/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Logout successful");
  });
});
