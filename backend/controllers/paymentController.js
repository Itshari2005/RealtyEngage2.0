import mongoose from "mongoose";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Razorpay from "razorpay";
import crypto from "crypto";
/*
  CUSTOMER → reserve token
*/
export const reserveToken = async (req, res) => {
  try {
    const { projectId, tokenAmount } = req.body;

     // ✅ PREVENT DUPLICATE RESERVATION
    const existing = await Payment.findOne({
      customer: new mongoose.Types.ObjectId(req.user.id),
      project: new mongoose.Types.ObjectId(projectId),
    });

    if (existing) {
      return res.status(400).json({ message: "Already reserved" });
    }

    const payment = await Payment.create({
      customer: req.user.id,
      project: projectId,
      tokenAmount,
      status: "reserved",
    });

    await User.findByIdAndUpdate(req.user.id, {
      lifecycleStatus: "Booked",
    });

    await Notification.create({
      user: req.user.id,
      message: "Your property has been reserved successfully (Token Paid)",
      type: "payment",
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
  CUSTOMER → my reservations
*/
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ customer: req.user.id })
      .populate("project", "name")
      .populate("customer", "name email");

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
  ADMIN → all reservations
*/
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("customer", "name email")
      .populate("project");

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const requestPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    const payment = await Payment.findById(paymentId);

    payment.paymentRequests.push({
      amount,
      status: "pending",
    });

    await payment.save();

    await Notification.create({
      user: req.user.id,
      message: "Payment request sent to admin",
      type: "payment",
    });

    res.json({ message: "Payment request sent to admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const approvePayment = async (req, res) => {
  try {
    const { paymentId, requestIndex } = req.body;

    const payment = await Payment.findById(paymentId);

    const reqItem = payment.paymentRequests[requestIndex];

    if (!reqItem) return res.status(400).json({ message: "Invalid request" });

    reqItem.status = "approved";

    payment.paidAmount += reqItem.amount;
    payment.pendingAmount -= reqItem.amount;

    if (payment.pendingAmount <= 0) {
      payment.status = "paid";
      payment.pendingAmount = 0;
    }

    await payment.save();

    await Notification.create({
      user: payment.customer,
      message: "Your payment has been approved",
      type: "payment",
    });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEMIPlan = async (req, res) => {
  try {
    const { projectId, totalAmount, months, downPayment } = req.body;

    const monthlyAmount = Math.ceil((totalAmount - downPayment) / months);

    const payment = await Payment.findOneAndUpdate(
  { customer: req.user.id, project: projectId },
  {
    totalAmount,
    months,
    monthlyAmount,
    paidAmount: downPayment,
    pendingAmount: totalAmount - downPayment,
    status: "partial",
  },
  { new: true, upsert: true }  // ⭐ ADD THIS
);

    await User.findByIdAndUpdate(req.user.id, {
      lifecycleStatus: "Booked",
    });
    res.json(payment);

    await Notification.create({
      user: req.user.id,
      message: "EMI plan created successfully",
      type: "payment",
    }); 

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
  CUSTOMER → full settlement
*/
export const settleFullPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    if (payment.pendingAmount <= 0)
      return res.status(400).json({ message: "Already paid" });

    payment.paidAmount += payment.pendingAmount;
    payment.pendingAmount = 0;
    payment.status = "paid";

    await payment.save();

    await User.findByIdAndUpdate(payment.customer, {
      lifecycleStatus: "Owner",
    });

    await Notification.create({
      user: payment.customer,
      message: "Full payment completed. You are now the owner 🎉",
      type: "payment",
    });
    
    res.json(payment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
  ADMIN → payment analytics
*/
export const getPaymentAnalytics = async (req, res) => {
  try {
    const payments = await Payment.find();

    const totalRevenue = payments.reduce(
      (sum, p) => sum + (p.paidAmount || p.tokenAmount || 0),
      0
    );

    const totalPending = payments.reduce(
      (sum, p) => sum + (p.pendingAmount || 0),
      0
    );

    const emiActive = payments.filter(
      (p) => p.status === "partial"
    ).length;

    const completed = payments.filter(
      (p) => p.status === "paid"
    ).length;

    res.json({
      totalRevenue,
      totalPending,
      emiActive,
      completed,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
      amount,
      type, // "emi" or "full"
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update payment in DB
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (type === "full") {
      payment.paidAmount += payment.pendingAmount;
      payment.pendingAmount = 0;
      payment.status = "paid";

      await User.findByIdAndUpdate(payment.customer, {
        lifecycleStatus: "Owner",
      });

      await Notification.create({
        user: payment.customer,
        message: "Full payment completed online. You are now the owner 🎉",
        type: "payment",
      });

    } else {
      // EMI payment
      payment.paidAmount += amount;
      payment.pendingAmount -= amount;

      if (payment.pendingAmount <= 0) {
        payment.pendingAmount = 0;
        payment.status = "paid";
      }

      payment.paymentRequests.push({
        amount,
        status: "approved",
        requestedAt: new Date(),
      });

      await Notification.create({
        user: payment.customer,
        message: `EMI payment of ₹${amount} completed successfully`,
        type: "payment",
      });
    }

    await payment.save();
    res.json({ success: true, payment });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



