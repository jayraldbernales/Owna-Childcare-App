import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let token = "";
let createdChildId: number;

beforeAll(async () => {
  const testEmail = "testuser@example.com";
  const password = "123456";

  await prisma.user.upsert({
    where: { email: testEmail },
    update: {},
    create: {
      firstname: "Test",
      lastname: "User",
      email: testEmail.toLowerCase(),
      password: await bcrypt.hash(password, 10),
    },
  });

  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: testEmail, password });

  console.log("LOGIN RESPONSE BODY:", res.body);
  token = res.body.token;
  if (!token) {
    throw new Error("Login failed — token not returned.");
  }
});

afterAll(async () => {
  const testUser = await prisma.user.findUnique({
    where: { email: "testuser@example.com" },
    include: {
      parentLinks: true,
    },
  });

  if (testUser) {
    const linkedChildIds = testUser.parentLinks.map((pc) => pc.childId);

    await prisma.parentChild.deleteMany({
      where: { userId: testUser.id },
    });

    await prisma.child.deleteMany({
      where: { id: { in: linkedChildIds } },
    });

    await prisma.user.delete({
      where: { id: testUser.id },
    });
  }

  await prisma.$disconnect();
});

describe("Children CRUD", () => {
  it("should create a child", async () => {
    const res = await request(app)
      .post("/api/children")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstname: "Child",
        lastname: "One",
        gender: "Male",
        dateOfBirth: "2015-05-01",
        age: 9,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdChildId = res.body.id;
  });

  it("should get children for the user", async () => {
    const res = await request(app)
      .get("/api/children")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update the child", async () => {
    const res = await request(app)
      .put(`/api/children/${createdChildId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ dateOfBirth: "2014-05-01" });

    expect(res.statusCode).toBe(200);
    expect(res.body.age).toBe(11);
  });

  it("should delete the child", async () => {
    const res = await request(app)
      .delete(`/api/children/${createdChildId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});
