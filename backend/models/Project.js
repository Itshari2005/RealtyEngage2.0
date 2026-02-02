import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    area: {
      type: String,
      required: [true, "Area is required"],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["upcoming", "in-progress", "completed"],
      default: "upcoming",
    },
    features: {
      type: [String], 
    },

    price: {
      type: Number, 
      required: true
    },

    minDownPayment:{
      type: Number,
      default: 0,
    },

    emiMonths:{
      type: Number,
      default: 12,
    },

    location: {
      type: String,
    },
    image: {
      type: String, 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
