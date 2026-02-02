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
      .populate("project");

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
