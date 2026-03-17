import Project from "../models/Project.js";
import User from "../models/User.js";

// @desc    Create new project (Admin only)
export const createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      createdBy: req.user._id, 
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error: error.message });
  }
};

// @desc    Get all projects
export const getProjects = async (req, res) => {
  try {
    const { search, status, minPrice, maxPrice } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { area: { $regex: search, $options: "i" } },
      ];
    }
    // 📌 Filter by status
    if (status) {
      query.status = status;
    }
    // 💰 Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const projects = await Project.find(query);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

// @desc    Get single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("createdBy", "name email role");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error fetching project", error: error.message });
  }
};

// @desc    Update project (Admin only)
export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedProject) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error: error.message });
  }
};

// @desc    Delete project (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) return res.status(404).json({ message: "Project not found" });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};

// @desc    Toggle wishlist (Add / Remove)
// @route   POST /api/projects/:id/wishlist
// @access  Private (Customer)
export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const projectId = req.params.id;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isExists = user.wishlist.includes(projectId);

    if (isExists) {
      // Remove
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== projectId
      );
    } else {
      // Add
      user.wishlist.push(projectId);
    }

    await user.save();

    res.status(200).json({
      message: isExists ? "Removed from wishlist" : "Added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating wishlist",
      error: error.message,
    });
  }
};

// @desc    Get user wishlist
// @route   GET /api/projects/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching wishlist",
      error: error.message,
    });
  }
};
