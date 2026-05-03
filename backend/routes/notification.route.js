import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  markOneRead,
  clearAll,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:userId",              getNotifications);
router.get("/:userId/unread-count", getUnreadCount);
router.patch("/:userId/read-all",   markAllRead);
router.patch("/:id/read",           markOneRead);
router.delete("/:userId",           clearAll);

export default router;
