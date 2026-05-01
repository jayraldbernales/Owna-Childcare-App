import { PrismaClient } from "@prisma/client";
import { calculateAge, generateLinkCode } from "../utils/childUtils";

const prisma = new PrismaClient();

export const childService = {
  async getChildren(userId: number) {
    const links = await prisma.parentChild.findMany({
      where: { userId },
      include: { child: true },
    });
    return links.map((link) => link.child);
  },

  async createChild(data: any, userId: number) {
    const linkCode = generateLinkCode();
    return prisma.child.create({
      data: {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        age: calculateAge(data.dateOfBirth),
        linkCode,
        createdBy: { connect: { id: userId } },
        parents: {
          create: { user: { connect: { id: userId } } },
        },
      },
    });
  },

  async updateChild(data: any, childId: number) {
    return prisma.child.update({
      where: { id: childId },
      data: {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        age: calculateAge(data.dateOfBirth),
      },
    });
  },

  async deleteChild(childId: number) {
    await prisma.parentChild.deleteMany({ where: { childId } });
    await prisma.child.delete({ where: { id: childId } });
  },

  async canUserModifyChild(userId: number, childId: number) {
    return prisma.parentChild.findFirst({
      where: { userId, childId },
    });
  },

  async linkToChild(userId: number, linkCode: string) {
    const child = await prisma.child.findUnique({ where: { linkCode } });
    if (!child) throw new Error("NOT_FOUND");

    const parentCount = await prisma.parentChild.count({
      where: { childId: child.id },
    });
    if (parentCount >= 2) throw new Error("MAX_PARENTS");

    const existing = await prisma.parentChild.findFirst({
      where: { childId: child.id, userId },
    });
    if (existing) throw new Error("ALREADY_LINKED");

    await prisma.parentChild.create({
      data: { userId, childId: child.id },
    });
    return { message: "Child linked successfully." };
  },
};
