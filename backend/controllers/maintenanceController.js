import MaintenanceMember from "../models/MaintenanceMember.js";
import MaintenanceRequest from "../models/MaintenanceRequest.js";

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
