import User from "../models/user.model.js";

export const swipeRight = async (req, res) => {
  try {
    const { likeUserId } = req.params;
    const currentUser = await User.findById(req.user._id);
    //find the user that the current user liked
    const likedUser = await User.findById(likeUserId);
    if (!likedUser) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    if (!currentUser.likes.includes(likeUserId)) {
      currentUser.likes.push(likeUserId);
      await currentUser.save();
    }
    //check if the liked user has liked the current user and update the matches array
    if (likedUser.likes.includes(currentUser.id)) {
      currentUser.matches.push(likeUserId);
      likedUser.matches.push(currentUser.id);

      await Promise.all([currentUser.save(), likedUser.save()]);
      //TODO: SEND NOTIFICATION IF THE USER LIKED BACK SOCKET.IO
    }
    res.status(200).json({ success: true, user: currentUser });
  } catch (error) {
    console.log("error swiping right: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const swipeLeft = async (req, res) => {
  try {
    const { dislikesUserId } = req.params;

    const currentUser = await User.findById(req.user._id);
    if (!currentUser.dislikes.includes(dislikesUserId)) {
      currentUser.dislikes.push(dislikesUserId);
      await currentUser.save();
    }
    res.status(200).json({ success: true, user: currentUser });
  } catch (error) {
    console.log("error swiping left: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//left side corner it will show
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

//this will show the which  user profiles will show (find) while swiping
export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    // $and in mongodb is used to add multiple conditions in a single query
    // $ne is used to check if the value is not equal to the specified value
    // $nin is used to check if the value is not in the specified array

    const user = await User.find({
      $and: [
        { _id: { $ne: currentUser.id } }, // Ensure the user is not their own profile
        { _id: { $nin: currentUser.likes } }, // Ensure the user is not already liked by the current user
        { _id: { $nin: currentUser.dislikes } }, // Ensure the user is not disliked by the current user
        { _id: { $nin: currentUser.matches } }, // Ensure the user is not already matched with the current user
        {
          // Match the user
          gender:
            currentUser.genderPreference === "both"
              ? { $in: ["male", "female"] }
              : currentUser.genderPreference,
        },
        // Ensure the other user's gender preference includes the current user's gender
        // or they are open to both genders ("both"), allowing mutual compatibility.
        { genderPreference: { $in: [currentUser.gender, "both"] } },
      ],
    });

    res.status(200).json({ success: true, users: user });
  } catch (error) {
    console.log("error getting user profiles: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
