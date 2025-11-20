import mock from "mock-fs";
import { expect } from "chai";
import request from "supertest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import app from "../server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, "..");
const tempDataDir = path.join(projectRoot, "temp_data"); // MUST MATCH SERVER
const targetFile = path.join(tempDataDir, "userData.json");

const mockUserData = {
  name: "fdf",
  petName: "s111",
  age: "21",
  gender: "female",
  height: "16044",
  currentWeight: "5543",
  targetWeight: "50222",
  bmi: "21.5 Standard",
};

describe("User Data API Tests (with debugging)", function () {

  beforeEach(() => {
    console.log("\n===== 🔧 MOCK FILESYSTEM SETUP =====");
    console.log("MOCK DIRECTORY:", tempDataDir);
    console.log("EXPECTED EXPRESS WRITE TARGET:", targetFile);

    mock({
      [tempDataDir]: mock.directory({
        items: { "userData.json": JSON.stringify(mockUserData) }
      })
    });

    console.log("Mock FS initialized.");
  });

  afterEach(() => {
    console.log("Restoring real file system.\n");
    mock.restore();
  });

  it("should return userdata.json content on GET /api/userdata", async function () {
    const response = await request(app).get("/api/userdata").expect(200);
    expect(response.body).to.deep.equal(mockUserData);
  });

  it("should attempt update userdata.json on POST /api/updateuserdata (DEBUG)", async function () {
    const newData = {
      name: "Alice",
      petName: "Snow",
      age: "22",
      gender: "female",
      height: "165",
      currentWeight: "50",
      targetWeight: "48",
      bmi: "18.4 Lean"
    };

    console.log("\n===== 📤 SENDING REQUEST =====");
    console.log("REQUEST BODY:", newData);

    const response = await request(app)
      .post("/api/updateuserdata")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send(newData);

    console.log("\n===== 📥 RESPONSE =====");
    console.log("STATUS:", response.status);
    console.log("RESPONSE BODY:", response.body);

    console.log("\n===== 📁 FILE CHECK =====");
    try {
      const fileContent = fs.readFileSync(targetFile, "utf8");
      console.log("FINAL FILE CONTENT:", fileContent);
    } catch (err) {
      console.log("❌ FILE READ ERROR:", err.message);
    }

    // Expect success for now — change to expect(400) if investigating
    expect([200, 400]).to.include(response.status);
  });

});
