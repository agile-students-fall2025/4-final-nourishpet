import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./schemas/User.js";  // 按你的项目结构

// 加载 .env 中的环境变量
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// 防止 .env 未配置
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
      dbName: "nourishpet", // ⭐ 强制指定数据库（推荐）
    });
    console.log("✅ MongoDB connected successfully!");

    // 测试插入
    const newUser = await User.create({
      name: "Cloud User Test",
      age: 21,
      gender: "male",
      height: 175,
      weight: 63,
    });

    console.log("📌 User created in cloud Atlas:");
    console.log(newUser);

    // 测试查询
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
