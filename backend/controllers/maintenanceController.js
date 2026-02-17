import MaintenanceMember from "../models/MaintenanceMember.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";
import User from "../models/User.js";

// ADMIN – Add maintenance member
export const addMaintenanceMember = async (req, res) => {
  try {
    const member = await MaintenanceMember.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CUSTOMER – Get all maintenance members
export const getMaintenanceMembers = async (req, res) => {
  try {
    const members = await MaintenanceMember.find().sort({ category: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CUSTOMER – Submit maintenance request (optional tracking)
export const createMaintenanceRequest = async (req, res) => {
  try {
    if (req.user?.id) {
      await User.findByIdAndUpdate(req.user.id, {
        lifecycleStatus: "Post-Sale",
      });
    }

    const request = await MaintenanceRequest.create({
      ...req.body,
      customer: req.user?.id || null,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN – View maintenance requests (optional)
export const getMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate("maintenanceMember")
      .populate("customer", "name email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN – Assign maintenance member
export const assignMaintenanceMember = async (req, res) => {
  try {
    const { requestId, memberId } = req.body;

    const request = await MaintenanceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.maintenanceMember = memberId;
    request.status = "Assigned";
    request.assignedAt = new Date();

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN – Update maintenance status
export const updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;

    const request = await MaintenanceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;

    if (status === "In Progress") request.startedAt = new Date();
    if (status === "Completed") request.completedAt = new Date();

    if (adminRemarks) request.adminRemarks = adminRemarks;

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

