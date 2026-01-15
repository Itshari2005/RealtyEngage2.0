
import Enquiry from "../models/Enquiry.js";

import { sendEnquiryEmail } from "../utils/mailer.js";



export const createEnquiry = async (req, res) => {
  console.log("🚀 createEnquiry controller HIT");
  try {
    //  Create enquiry document
    const enquiry = new Enquiry({
      ...req.body,
      customer: req.user._id,
    });

    //  Save to DB
    const savedEnquiry = await enquiry.save();

    // Send response
    res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      enquiry: savedEnquiry,
    });

    //  Send confirmation email to CUSTOMER
    try {
      await sendEnquiryEmail({
        to: req.user.email,
        name: req.user.name,
        projectName: req.body.projectName || "Property Enquiry",
        message: req.body.message || "",
      });
    } catch (mailError) {
      console.error("Customer email failed:", mailError.message);
      
    }

    //  Send notification email to ADMIN
    try {
      await sendEnquiryEmail({
        to: process.env.ADMIN_EMAIL,
        name: "Admin",
        projectName: req.body.projectName || "Property Enquiry",
        message: `
          New enquiry received.

          Customer: ${req.user.name}
          Email: ${req.user.email}
          Message: ${req.body.message || "N/A"}
        `,
      });
    } catch (mailError) {
      console.error("Admin email failed:", mailError.message);
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating enquiry",
      error: error.message,
    });
  }
};


// @desc    Get all enquiries (Admin only)
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("customer", "name email number")
      .populate("project", "name area status");
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enquiries", error: error.message });
  }
};

// @desc    Get single enquiry by ID (Admin or Owner)
export const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate("customer", "name email number")
      .populate("project", "name area status");

    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

    // allow only admin or owner to see enquiry
    if (req.user.role !== "admin" && enquiry.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this enquiry" });
    }

    res.status(200).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enquiry", error: error.message });
  }
};

// @desc    Update enquiry status (Admin only)
export const updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

    enquiry.status = req.body.status || enquiry.status;
    await enquiry.save();

    res.status(200).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: "Error updating enquiry", error: error.message });
  }
};

// @desc    Delete enquiry (Admin only)
export const deleteEnquiry = async (req, res) => {
  try {
    const deletedEnquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deletedEnquiry) return res.status(404).json({ message: "Enquiry not found" });

    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting enquiry", error: error.message });
  }
};


export const getMyEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ customer: req.user._id })
      .populate("project", "name area status"); // Only project info needed
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your enquiries", error: error.message });
  }
};