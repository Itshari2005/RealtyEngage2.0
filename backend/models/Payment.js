import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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

    // 🔥 NEW: token only
    tokenAmount: {
      type: Number,
      required: true,
    },

    // reserved | confirmed | cancelled
    status: {
      type: String,
      default: "reserved",
    },

    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ customer: 1, project: 1 }, { unique: true });


export default mongoose.model("Payment", paymentSchema);
