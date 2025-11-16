import mock from "mock-fs";
import { expect } from "chai";
import request from "supertest";
import app from "../server.js";

const mockHistData = [
  {
    "id": 1,
    "Date": "Nov 10, 2025",
    "Total Intake": 108,
    "Protein": 18,
    "Carbs": 66,
    "Fat": 24,
    "Total Intake Goal": 2283,
    "Protein Goal": 289,
    "Carbs Goal": 438,
    "Fat Goal": 257
  }
];

describe("GET /api/home/nutrition", function () {
  
  beforeEach(function () {
    mock({
      "temp_data": {
        "histData.json": JSON.stringify(mockHistData)
      }
    });
  });

  afterEach(function () {
    mock.restore();
  });

  it("should return 200 and nutrition data", async function () {
    const response = await request(app)
      .get("/api/home/nutrition?id=1")
      .expect(200);

    expect(response.body).to.have.property("date");
    expect(response.body).to.have.property("calories");
    expect(response.body).to.have.property("protein");
  });
});
