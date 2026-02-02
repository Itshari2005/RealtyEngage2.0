import mongoose from "mongoose";

const maintenanceMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String, // Plumber, Electrician, etc.
      required: true,
    },
    tier: {
      type: String, // Tier 1 – Immediate, Tier 2 – Scheduled
      required: true,
    },
    cost: {
      type: String, // ₹500 / visit, ₹800 / month
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MaintenanceMember", maintenanceMemberSchema);
