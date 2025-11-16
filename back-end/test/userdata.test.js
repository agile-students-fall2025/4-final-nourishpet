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
const tempDataDir = path.join(projectRoot, "temp_data");

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

describe("User Data API Tests", function () {

  beforeEach(() => {
    mock({
      [tempDataDir]: mock.directory({
        items: {
          "userData.json": JSON.stringify(mockUserData),
        },
      }),
    });
  });

  afterEach(() => mock.restore());

  it("should return userdata.json content on GET /api/userdata", async function () {
    const response = await request(app)
      .get("/api/userdata")
      .expect(200);

    expect(response.body).to.deep.equal(mockUserData);
  });

});