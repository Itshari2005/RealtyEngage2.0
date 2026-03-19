import Visit from "../models/Visit.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

/* =========================
   CUSTOMER → create visit
========================= */
export const createVisit = async (req, res) => {
  try {
    const { projectId, date, time, notes } = req.body;

    const visit = await Visit.create({
      customer: req.user.id,
      project: projectId,
      date,
      time,
      notes,

    });

    
    await User.findByIdAndUpdate(req.user.id, {
      lifecycleStatus: "Visit Scheduled",
    });

    await Notification.create({
      user: req.user.id,
      message: "Your visit has been scheduled successfully",
      type: "visit",
    });

    res.status(201).json(visit);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CUSTOMER → my visits
========================= */
export const getMyVisits = async (req, res) => {
  try {
    const visits = await Visit.find({ customer: req.user.id }).populate("project");
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ADMIN → all visits
========================= */
export const getAllVisits = async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate("customer", "name email")
      .populate("project");

    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   ADMIN → update status
========================= */
export const updateVisitStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("customer");

    // ✅ UPDATE CUSTOMER LIFECYCLE BASED ON VISIT STATUS
    if (status === "approved") {
      await User.findByIdAndUpdate(visit.customer._id, {
        lifecycleStatus: "Visit Approved",
      });

      await Notification.create({
        user: visit.customer._id,
        message: "Your visit has been approved",
        type: "visit",
      });
    }

    if (status === "completed") {
      await User.findByIdAndUpdate(visit.customer._id, {
        lifecycleStatus: "Visited",
      });

      await Notification.create({
        user: visit.customer._id,
        message: "Your visit has been marked as completed",
        type: "visit",
      });
    }

    res.json(visit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
