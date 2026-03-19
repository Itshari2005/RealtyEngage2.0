import Notification from "../models/Notification.js";
import mongoose from "mongoose";

// Get user notifications
export const getNotifications = async (req, res) => {
  console.log("Logged in user:", req.user._id);
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark as read
export const markAsRead = async (req, res) => {
  try {
    console.log("Received ID:", req.params.id);
    const notification = await Notification.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    console.log("Updated notification:", notification);

    res.json(notification);
  } catch (err) {
    console.error("Mark as read error:", err);
    res.status(500).json({ message: err.message });
  }
};