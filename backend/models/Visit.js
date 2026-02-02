import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
    },

    // requested | approved | completed | cancelled
    status: {
      type: String,
      default: "requested",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Visit", visitSchema);
