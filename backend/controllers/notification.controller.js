import Notification from "../models/notification.model.js";

/** GET /api/notifications/:userId */
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = parseInt(req.query.skip)  || 0;

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments({ userId, isRead: false }),
    ]);

    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** GET /api/notifications/:userId/unread-count */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ userId: req.params.userId, isRead: false });
    res.json({ success: true, unreadCount: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** PATCH /api/notifications/:userId/read-all */
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.params.userId, isRead: false }, { isRead: true });
    res.json({ success: true, message: "All notifications marked as read." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** PATCH /api/notifications/:id/read */
export const markOneRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** DELETE /api/notifications/:userId */
export const clearAll = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.params.userId });
    res.json({ success: true, message: "All notifications cleared." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
