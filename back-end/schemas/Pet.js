// back-end/schemas/Pet.js
import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
  {

    name: { type: String, default: "Your Pet" },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    xp: { type: Number, default: 0 },


    level: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["stage1", "stage2", "stage3"],
      default: "stage1",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Pet", PetSchema);