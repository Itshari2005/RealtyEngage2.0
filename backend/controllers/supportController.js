import Support from "../models/Support.js";

import { 
  sendSupportUserEmail, 
  sendSupportAdminEmail 
} from "../utils/mailer.js";

export const createSupport = async (req, res) => {
  try {
    const support = new Support({
      ...req.body,
      customer: req.user._id,
    });

    const savedSupport = await support.save();

    // USER EMAIL
    try {
      await sendSupportUserEmail({
        to: req.user.email,
        name: req.user.name,
        ticketId: savedSupport._id,
        subject: req.body.subject,
        message: req.body.message,
      });
    } catch (err) {
      console.error("User support mail failed:", err.message);
    }

    // ADMIN EMAIL
    try {
      await sendSupportAdminEmail({
        ticketId: savedSupport._id,
        name: req.user.name,
        email: req.user.email,
        subject: req.body.subject,
        message: req.body.message,
      });
    } catch (err) {
      console.error("Admin support mail failed:", err.message);
    }

    res.status(201).json(savedSupport);

  } catch (error) {
    res.status(500).json({ 
      message: "Error creating support request", 
      error: error.message 
    });
  }
};

// @desc    Get all support requests (Admin only)
export const getAllSupport = async (req, res) => {
  try {
    const supports = await Support.find()
      .populate("customer", "name email number");
    res.status(200).json(supports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching support requests", error: error.message });
  }
};

// @desc    Get single support request (Admin or Owner)
export const getSupportById = async (req, res) => {
  try {
    const support = await Support.findById(req.params.id)
      .populate("customer", "name email number");

    if (!support) return res.status(404).json({ message: "Support request not found" });

    if (req.user.role !== "admin" && support.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this support request" });
    }

    res.status(200).json(support);
  } catch (error) {
    res.status(500).json({ message: "Error fetching support request", error: error.message });
  }
};

// @desc    Update support status (Admin only)
export const updateSupportStatus = async (req, res) => {
  try {
    const support = await Support.findById(req.params.id);
    if (!support) return res.status(404).json({ message: "Support request not found" });

    support.status = req.body.status || support.status;
    await support.save();

    res.status(200).json(support);
  } catch (error) {
    res.status(500).json({ message: "Error updating support request", error: error.message });
  }
};

// @desc    Delete support request (Admin only)
export const deleteSupport = async (req, res) => {
  try {
    const deletedSupport = await Support.findByIdAndDelete(req.params.id);
    if (!deletedSupport) return res.status(404).json({ message: "Support request not found" });

    res.status(200).json({ message: "Support request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting support request", error: error.message });
  }
};
