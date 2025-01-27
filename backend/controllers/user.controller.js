import cloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
  try {
    const { image, ...otherData } = req.body;

    let updatedData = { ...otherData };

    if (image) {
      //base64 format
      if (image.startsWith("data:image")) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(image);
          updatedData.image = uploadResponse.secure_url;
        } catch (error) {
          console.log("Error uploading image to cloudinary: ", error.message);
          res.status(400).json({ success: false, message: error.message });
        }
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, // find the user by id
      updatedData, // update the user document with the new data
      {
        new: true, // return the updated document immediately
      }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("Error updating user profile: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
