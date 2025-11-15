// const { expect } = require('chai');
// const { add, multiply, divide } = require('../server.js');

// describe('Math Functions', function() {
//   describe('add()', function() {
//     it('should add two positive numbers', function() {
//       expect(add(2, 3)).to.equal(5);
//     });
//   });

//   describe('multiply()', function() {
//     it('should multiply correctly', function() {
//       expect(multiply(2, 3)).to.equal(6);
//     });
//   });

//   describe('divide()', function() {
//     it('should divide correctly', function() {
//       expect(divide(6, 2)).to.equal(3);
//     });

//     it('should throw error when dividing by zero', function() {
//       expect(() => divide(5, 0)).to.throw('divide by 0');
//     });
//   });
// });

import mock, { restore } from "mock-fs";
import { expect } from "chai";
import request from "supertest";
import app from "../server.js";

const mockData = [
  { "id": 1, "Date": "Nov 12, 2025",
    "Total Intake": 108, "Protein": 18, "Carbs": 66, "Fat": 24,
    "Total Intake Goal": 2283, "Protein Goal": 289, "Carbs Goal": 438, "Fat Goal": 257,
    "Food List": ["Banana"], "Gram List": [150], "Protein List": [18], "Fat List": [24], "Carbs List": [66]},
  { "id": 2, "Date": "Nov 11, 2025",
    "Total Intake": 222, "Protein": 15, "Carbs": 49, "Fat": 100,
    "Total Intake Goal": 2283, "Protein Goal": 289, "Carbs Goal": 438, "Fat Goal": 257,
    "Food List": ["Banana"], "Gram List": [150], "Protein List": [18], "Fat List": [24], "Carbs List": [66]},
];
const mockFoodData = [
  { "food": "Banana","carbs": 44,"protein": 12,"fat": 16 },
  { "food": "Duck","carbs": 89,"protein": 67,"fat": 18 }
];
 
//test for getting histdata
describe("GET /api/histdata", function () {
  
  describe("when histData.json exists", function () {
    
    // create a fake histData before each testing
    beforeEach(function () {
      mock({
        "temp_data": {
            "histData.json": JSON.stringify(mockData),
        }
      });
    });

    // restore the real file system after each testing
    afterEach(function () {
      mock.restore();
    });

    it("should return 200 and fetched data", async function () {
      
      const response = await request(app)
        .get("/api/histdata")            // GET request
        .expect("Content-Type", /json/)  // Check if the response is JSON
        .expect(200);                    // Check for status

      // Check that the response body matches our mock data
      expect(response.body).to.deep.equal(mockData);
    });
  });

  describe("when histData.json does not exist", function () {
    
    // empty db
    beforeEach(function () {
      mock({});
    });

    afterEach(function () {
      mock.restore();
    });

    it("should return a 500 status and an error message", async function () {
      const response = await request(app)
        .get("/api/histdata")
        .expect("Content-Type", /json/)
        .expect(500); // Expecting the 500 status from your catch block

      // Check the error message in the response body
      expect(response.body.error).to.equal("Failed to fetch data");
    });
  });
});

//test for getting fooddata
describe("GET /api/fooddata", function () {

  describe("when foodData.json exists", function () {

    beforeEach(function () {
      mock({
        "temp_data": {
          "foodData.json": JSON.stringify(mockFoodData)
        }
      });
    });

    afterEach(function () {
      restore();
    });

    it("should return a 200 status and the food data", async function () {
      const response = await request(app)
        .get("/api/fooddata")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).to.deep.equal(mockFoodData);
    });
  });

  describe("when foodData.json does NOT exist", function () {

    beforeEach(function () {
      mock({}); 
    });

    afterEach(function () {
      restore();
    });

    it("should return a 500 status and an error message", async function () {
      const response = await request(app)
        .get("/api/fooddata")
        .expect("Content-Type", /json/)
        .expect(500);

      expect(response.body.error).to.equal("Failed to fetch data");
    });
  });
});