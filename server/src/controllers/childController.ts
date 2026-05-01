import { Response } from "express";
import { AuthRequest } from "../types/auth";
import { childService } from "../services/childService";

export const getChildren = async (req: AuthRequest, res: Response) => {
  try {
    const children = await childService.getChildren(Number(req.user?.id));
    res.json(children);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch children" });
  }
};

export const createChild = async (req: AuthRequest, res: Response) => {
  try {
    const child = await childService.createChild(
      req.body,
      Number(req.user?.id)
    );
    res.status(201).json(child);
  } catch (error) {
    res.status(500).json({ error: "Failed to create child" });
  }
};

export const updateChild = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId } = req.user!;
    const childId = parseInt(req.params.id);
    const link = await childService.canUserModifyChild(Number(userId), childId);
    if (!link) return res.status(403).json({ error: "Unauthorized" });

    const updated = await childService.updateChild(req.body, childId);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update child" });
  }
};

export const deleteChild = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId } = req.user!;
    const childId = parseInt(req.params.id);
    const link = await childService.canUserModifyChild(Number(userId), childId);
    if (!link) return res.status(403).json({ error: "Unauthorized" });

    await childService.deleteChild(childId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete child" });
  }
};

export const linkToChild = async (req: AuthRequest, res: Response) => {
  try {
    const result = await childService.linkToChild(
      Number(req.user?.id),
      req.body.linkCode
    );
    res.status(200).json(result);
  } catch (error: any) {
    switch (error.message) {
      case "NOT_FOUND":
        res.status(404).json({ error: "Child not found with this link code." });
        break;
      case "MAX_PARENTS":
        res.status(400).json({ error: "This child already has two parents." });
        break;
      case "ALREADY_LINKED":
        res
          .status(400)
          .json({ error: "You are already linked to this child." });
        break;
      default:
        res.status(500).json({ error: "Failed to link to child." });
    }
  }
};
