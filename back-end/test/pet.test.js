// back-end/test/pet.test.js
import mongoose from "mongoose";
import { expect } from "chai";
import { MongoMemoryServer } from "mongodb-memory-server";
import Pet from "../schemas/Pet.js";
import { showPetInfo, upgrade } from "../db/petDB.js";

describe("Pet Functions (MongoDB)", function () {
  let mongoServer;
  let userId;

  before(async function () {
    // 启动内存 MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // 模拟一个 user_id
    userId = new mongoose.Types.ObjectId();

    // 插入初始宠物数据：和原测试里保持一致
    await Pet.create({
      name: "Charlie",
      user_id: userId,
      xp: 190,
      level: 4,
      status: "stage1",
    });
  });

  after(async function () {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should show pet info", async function () {
    const pet = await showPetInfo(userId);

    expect(pet).to.include({
      name: "Charlie",
      xp: 190,
      level: 4,
    });
  });

  it("should upgrade pet", async function () {
    const result = await upgrade(userId, 100); // 190 + 100 = 290 xp

    // level 计算规则：floor(290 / 50) + 1 = 6
    expect(result.level).to.equal(6);
    expect(result.xp).to.equal(290);
  });
});
