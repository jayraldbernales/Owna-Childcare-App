import { childService } from "../services/childService";
import { PrismaClient } from "@prisma/client";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    parentChild: {
      findMany: jest.fn(),
      deleteMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    child: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe("childService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getChildren", () => {
    it("should return children linked to user", async () => {
      const mockLinks = [
        { child: { id: 1, firstname: "Child1" } },
        { child: { id: 2, firstname: "Child2" } },
      ];
      (prisma.parentChild.findMany as jest.Mock).mockResolvedValue(mockLinks);

      const result = await childService.getChildren(1);
      expect(prisma.parentChild.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: { child: true },
      });
      expect(result).toEqual(mockLinks.map((link) => link.child));
    });
  });

  describe("createChild", () => {
    it("should create a child with generated linkCode and age", async () => {
      const data = { firstname: "NewChild", dateOfBirth: "2015-01-01" };
      const userId = 1;
      const createdChild = { id: 1, ...data };
      (prisma.child.create as jest.Mock).mockResolvedValue(createdChild);

      const result = await childService.createChild(data, userId);
      expect(prisma.child.create).toHaveBeenCalled();
      expect(result).toEqual(createdChild);
    });
  });

  describe("updateChild", () => {
    it("should update child data", async () => {
      const data = { firstname: "UpdatedChild", dateOfBirth: "2014-01-01" };
      const childId = 1;
      const updatedChild = { id: childId, ...data };
      (prisma.child.update as jest.Mock).mockResolvedValue(updatedChild);

      const result = await childService.updateChild(data, childId);
      expect(prisma.child.update).toHaveBeenCalledWith({
        where: { id: childId },
        data: expect.objectContaining({ firstname: "UpdatedChild" }),
      });
      expect(result).toEqual(updatedChild);
    });
  });

  describe("deleteChild", () => {
    it("should delete child and parentChild links", async () => {
      (prisma.parentChild.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.child.delete as jest.Mock).mockResolvedValue({});

      await childService.deleteChild(1);
      expect(prisma.parentChild.deleteMany).toHaveBeenCalledWith({
        where: { childId: 1 },
      });
      expect(prisma.child.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe("canUserModifyChild", () => {
    it("should return parentChild link if exists", async () => {
      const mockLink = { id: 1, userId: 1, childId: 1 };
      (prisma.parentChild.findFirst as jest.Mock).mockResolvedValue(mockLink);

      const result = await childService.canUserModifyChild(1, 1);
      expect(prisma.parentChild.findFirst).toHaveBeenCalledWith({
        where: { userId: 1, childId: 1 },
      });
      expect(result).toEqual(mockLink);
    });
  });

  describe("linkToChild", () => {
    it("should link user to child if conditions met", async () => {
      const userId = 1;
      const linkCode = "abc123";
      const child = { id: 1, linkCode };
      (prisma.child.findUnique as jest.Mock).mockResolvedValue(child);
      (prisma.parentChild.count as jest.Mock).mockResolvedValue(1);
      (prisma.parentChild.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.parentChild.create as jest.Mock).mockResolvedValue({});

      const result = await childService.linkToChild(userId, linkCode);
      expect(prisma.child.findUnique).toHaveBeenCalledWith({
        where: { linkCode },
      });
      expect(prisma.parentChild.count).toHaveBeenCalledWith({
        where: { childId: child.id },
      });
      expect(prisma.parentChild.findFirst).toHaveBeenCalledWith({
        where: { childId: child.id, userId },
      });
      expect(prisma.parentChild.create).toHaveBeenCalledWith({
        data: { userId, childId: child.id },
      });
      expect(result).toEqual({ message: "Child linked successfully." });
    });

    it("should throw NOT_FOUND error if child not found", async () => {
      (prisma.child.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(childService.linkToChild(1, "invalid")).rejects.toThrow(
        "NOT_FOUND"
      );
    });

    it("should throw MAX_PARENTS error if parent count >= 2", async () => {
      const child = { id: 1, linkCode: "abc123" };
      (prisma.child.findUnique as jest.Mock).mockResolvedValue(child);
      (prisma.parentChild.count as jest.Mock).mockResolvedValue(2);
      await expect(childService.linkToChild(1, "abc123")).rejects.toThrow(
        "MAX_PARENTS"
      );
    });

    it("should throw ALREADY_LINKED error if user already linked", async () => {
      const child = { id: 1, linkCode: "abc123" };
      (prisma.child.findUnique as jest.Mock).mockResolvedValue(child);
      (prisma.parentChild.count as jest.Mock).mockResolvedValue(1);
      (prisma.parentChild.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
      await expect(childService.linkToChild(1, "abc123")).rejects.toThrow(
        "ALREADY_LINKED"
      );
    });
  });
});
