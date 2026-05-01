/// <reference types="node" />

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "user@demo.com" },
    update: {},
    create: {
      firstname: "Demo",
      lastname: "User",
      email: "user@demo.com",
      password: password,
      role: "user",
    },
  });

  await prisma.user.upsert({
    where: { email: "moderator@demo.com" },
    update: {},
    create: {
      firstname: "Demo",
      lastname: "Moderator",
      email: "moderator@demo.com",
      password: password,
      role: "moderator",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      firstname: "Demo",
      lastname: "Admin",
      email: "admin@demo.com",
      password: password,
      role: "admin",
    },
  });

  console.log("Seeded users");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
