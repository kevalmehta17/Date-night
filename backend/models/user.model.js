import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
      //enum is used to restrict the value of a field to a pre-defined set of values
    },
    genderPreference: {
      type: String,
      enum: ["male", "female", "both"],
    },
    bio: { type: String, default: "" },
    image: { type: String, default: "" },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastlogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash the password before saving the user model
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified
  this.password = await bcrypt.hash(this.password, 10); // Hash with salt rounds of 10
  next();
});

// Match user entered password to hashed password in database
// .methods is an object where you can define custom instance methods for your schema.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
