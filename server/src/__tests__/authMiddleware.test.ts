// src/__tests__/authMiddleware.unit.test.ts

import authMiddleware from "../middleware/authMiddleware";
import { verifyToken } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

// Mock verifyToken directly
jest.mock("../utils/jwt", () => ({
  verifyToken: jest.fn(),
}));

const mockRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

const mockNext = jest.fn();

describe("authMiddleware (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no token is provided", () => {
    const req = {
      headers: {},
      cookies: {},
    } as any;

    const res = mockRes();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided" });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    const req = {
      headers: {
        authorization: "Bearer invalidtoken",
      },
      cookies: {},
    } as any;

    (verifyToken as jest.Mock).mockReturnValue(null);

    const res = mockRes();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
  });

  it("should call next and attach user if token is valid (header)", () => {
    const mockUser = { id: "123", role: "user" };

    const req = {
      headers: {
        authorization: "Bearer validtoken",
      },
      cookies: {},
    } as any;

    (verifyToken as jest.Mock).mockReturnValue(mockUser);

    const res = mockRes();

    authMiddleware(req, res, mockNext);

    expect(req.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should support token from cookies", () => {
    const mockUser = { id: "456", role: "admin" };

    const req = {
      headers: {},
      cookies: {
        token: "validtoken",
      },
    } as any;

    (verifyToken as jest.Mock).mockReturnValue(mockUser);

    const res = mockRes();

    authMiddleware(req, res, mockNext);

    expect(req.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });
});
