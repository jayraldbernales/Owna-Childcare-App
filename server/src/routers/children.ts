import express from "express";
import {
  getChildren,
  createChild,
  updateChild,
  deleteChild,
  linkToChild,
} from "../controllers/childController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Children
 *   description: API for managing children
 */
router.get("/", getChildren);
/**
 * @swagger
 * /api/children:
 *   get:
 *     summary: Get all children for the authenticated user
 *     tags: [Children]
 *     responses:
 *       200:
 *         description: List of children
 *       401:
 *         description: Unauthorized
 */
router.post("/", createChild);
/**
 * @swagger
 * /api/children:
 *   post:
 *     summary: Create a new child for the authenticated user
 *     tags: [Children]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Child created successfully
 */
router.put("/:id", updateChild);
/**
 * @swagger
 * /api/children/{id}:
 *   put:
 *     summary: Update a child's details
 *     tags: [Children]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the child to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Child updated successfully
 */
router.delete("/:id", deleteChild);
/**
 * @swagger
 * /api/children/{id}:
 *   delete:
 *     summary: Delete a child
 *     tags: [Children]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the child to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Child deleted successfully
 */
router.post("/link", linkToChild);

export default router;
