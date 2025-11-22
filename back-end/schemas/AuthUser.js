import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const AuthUserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  // link to nutrition profile
  nutrition_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

// Hash password before saving
AuthUserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
AuthUserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Create JWT
AuthUserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      nutrition_user_id: this.nutrition_user_id,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default mongoose.model("AuthUser", AuthUserSchema);