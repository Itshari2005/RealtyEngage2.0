import User from "../models/User.js";

/* =========================
   CUSTOMER → Toggle Favorite
========================= */
export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { projectId } = req.body;

    const exists = user.favorites.includes(projectId);

    if (exists) {
      user.favorites.pull(projectId);
    } else {
      user.favorites.push(projectId);
    }

    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   CUSTOMER → Get My Favorites
========================= */
export const getMyFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
