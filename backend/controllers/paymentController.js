import Payment from "../models/Payment.js";
import Project from "../models/Project.js";

import {
  sendPaymentUserEmail,
  sendPaymentAdminEmail,
  sendMonthlyPaymentUserEmail,
  sendMonthlyPaymentAdminEmail,
} from "../utils/mailer.js";

export const createPayment = async (req, res) => {
  try {
    const { projectId, plan, paidAmount = 0, paymentMethod } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const totalAmount = Number(project.priceRange.replace(/[^0-9]/g, ""));
    const pendingAmount = totalAmount - paidAmount;

    const status =
      paidAmount === 0 ? "pending" : pendingAmount === 0 ? "paid" : "partial";

    const payment = await Payment.create({
      customer: req.user._id,
      project: projectId,
      plan,
      totalAmount,
      paidAmount,
      pendingAmount,
      paymentMethod,
      status,
      month: paidAmount > 0 ? 1 : 0,
    });

    // USER MAIL
    try {
      await sendPaymentUserEmail({
        to: req.user.email,
        name: req.user.name,
        projectName: project.name,
        plan,
        totalAmount,
        paidAmount,
        pendingAmount,
        status,
      });
    } catch (err) {
      console.error("User payment mail failed:", err.message);
    }

    // ADMIN MAIL
    try {
      await sendPaymentAdminEmail({
        customerName: req.user.name,
        customerEmail: req.user.email,
        projectName: project.name,
        plan,
        totalAmount,
        paidAmount,
        pendingAmount,
        status,
      });
    } catch (err) {
      console.error("Admin payment mail failed:", err.message);
    }

    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// GET ALL PAYMENTS (Admin)
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("customer", "name email")
      .populate("project", "name priceRange");
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE PAYMENT (Admin marks EMI or adjusts payment)
export const updatePayment = async (req, res) => {
  try {
    const { paidAmount } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.paidAmount += paidAmount;
    if (payment.paidAmount > payment.totalAmount) payment.paidAmount = payment.totalAmount;

    payment.pendingAmount = payment.totalAmount - payment.paidAmount;
    payment.status = payment.pendingAmount === 0 ? "paid" : "partial";
    if (payment.pendingAmount > 0) payment.month += 1;

    await payment.save();

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// USER MAKES MONTHLY PAYMENT
export const payMonthly = async (req, res) => {
  try {
    const { paymentId, amount, paymentMethod } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid payment amount" });

    const payment = await Payment.findById(paymentId).populate("project");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.paidAmount += amount;
    if (payment.paidAmount > payment.totalAmount)
      payment.paidAmount = payment.totalAmount;

    payment.pendingAmount = payment.totalAmount - payment.paidAmount;
    payment.status = payment.pendingAmount === 0 ? "paid" : "partial";

    if (payment.pendingAmount > 0) payment.month += 1;

    payment.paymentMethod = paymentMethod;

    await payment.save();

    // USER MAIL
    try {
      await sendMonthlyPaymentUserEmail({
        to: req.user.email,
        name: req.user.name,
        projectName: payment.project.name,
        paidNow: amount,
        totalPaid: payment.paidAmount,
        pendingAmount: payment.pendingAmount,
        month: payment.month,
        status: payment.status,
      });
    } catch (err) {
      console.error("User monthly mail failed:", err.message);
    }

    // ADMIN MAIL
    try {
      await sendMonthlyPaymentAdminEmail({
        customerName: req.user.name,
        customerEmail: req.user.email,
        projectName: payment.project.name,
        paidNow: amount,
        totalPaid: payment.paidAmount,
        pendingAmount: payment.pendingAmount,
        month: payment.month,
        status: payment.status,
      });
    } catch (err) {
      console.error("Admin monthly mail failed:", err.message);
    }

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET payments of the logged-in user
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ customer: req.user._id })
      .populate("project", "name priceRange")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
