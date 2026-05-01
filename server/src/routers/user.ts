import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import UserControllers from "../controllers/userControllers";

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Get users by role
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched users by role
 *       400:
 *         description: Bad request, role query parameter is required
 */
router.get("/", UserControllers.getUsersByRole);

/**
 * @swagger
 * /api/v1/user/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully fetched user profile
 *       401:
 *         description: Unauthorized
 */
router.get("/me", UserControllers.getProfile);

/**
 * @swagger
 * /api/v1/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", UserControllers.updateProfile);

/**
 * @swagger
 * /api/v1/user/password:
 *   put:
 *     summary: Change user password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or password mismatch
 *       401:
 *         description: Unauthorized
 */
router.put("/password", UserControllers.changePassword);

export default router;
