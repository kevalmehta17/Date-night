import { User } from "../models/user.model.js";

export const swipeRight = async (req, res) => {};
export const swipeLeft = async (req, res) => {};

export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "matches",
      "name image"
    );
    res.status(200).json({ success: true, matches: user.matches });
  } catch (error) {
    console.log("error getting matches: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    const user = await User.find({
      $and: [
        { _id: { $ne: currentUser.id } }, // Ensure the user is not their own profile
        { _id: { $nin: currentUser.likes } }, // Ensure the user is not already liked by the current user
        { _id: { $nin: currentUser.dislikes } }, // Ensure the user is not disliked by the current user
        { _id: { $nin: currentUser.matches } }, // Ensure the user is not already matched with the current user
        {
          gender:
            currentUser.genderPreference === "both"
              ? { $in: ["male", "female"] }
              : currentUser.genderPreference, // Gender preference matching
        },
        { genderPreference: { $in: [currentUser.gender, "both"] } }, // Gender preference of the other user
      ],
    });

    res.status(200).json({ success: true, users: user });
  } catch (error) {
    console.log("error getting user profiles: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
