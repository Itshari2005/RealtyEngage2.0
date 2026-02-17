import mongoose from "mongoose";

const maintenanceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    maintenanceMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceMember",
    },
    category: String,
    issueDescription: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerAddress: {
      type: String,
      required: true,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      default: "Submitted", // Submitted | Contacted
    },
    assignedAt: Date,
    startedAt: Date,
    completedAt: Date,
    adminRemarks: String,
  },
  { timestamps: true }
);

export default mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
