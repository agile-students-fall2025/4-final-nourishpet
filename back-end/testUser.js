import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./schemas/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI not found in .env file");
  process.exit(1);
}

async function main() {
  try {
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "nourishpet",
    });
    console.log("✅ MongoDB connected successfully!");

    const newUser = await User.create({
      name: "Cloud User Test",
      age: 21,
      gender: "male",
      height: 175,
      weight: 63,
    });

    console.log("📌 User created in cloud Atlas:");
    console.log(newUser);

    const allUsers = await User.find();
    console.log("\n📄 All users in nourishpet.users:");
    console.log(allUsers);

  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB disconnected.");
  }
}

main();
