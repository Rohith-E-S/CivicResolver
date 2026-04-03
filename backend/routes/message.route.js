import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import Message from "../models/message.model.js";

const messageRouter = express.Router();

// GET /api/messages/:complaintId - Fetch chat history
messageRouter.get("/:complaintId", protectRoute, async (req, res) => {
    try {
        const { complaintId } = req.params;

        const messages = await Message.find({ complaintId })
            .populate("fromUser", "fullName email isAdmin")
            .populate("toUser", "fullName email isAdmin")
            .sort({ createdAt: 1 });

        return res.status(200).json({ success: true, messages });
    } catch (error) {
        console.log("Error fetching messages:", error.message);
        return res.status(500).json({
            success: false,
            message: `Error fetching messages: ${error.message}`,
        });
    }
});

export default messageRouter;
