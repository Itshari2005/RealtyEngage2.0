import mongoose from "mongoose";
import Payment from "../models/Payment.js";

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

    res.json(payment);
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





