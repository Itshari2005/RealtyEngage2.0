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

    totalAmount: Number,
    paidAmount: { type: Number, default: 0 },
    pendingAmount: Number,

    months: Number,
    monthlyAmount: Number,

    status: {
      type: String,
      default: "partial",
    },

    // ✅ NEW (Option B)
    paymentRequests: [
      {
        amount: Number,
        status: { type: String, default: "pending" }, // pending/approved/rejected
        requestedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

paymentSchema.index({ customer: 1, project: 1 }, { unique: true });


export default mongoose.model("Payment", paymentSchema);
