import mock from "mock-fs";
import { expect } from "chai";
import { calculateNutritionGoals } from "../nutritionGoals.js";

describe("calculateNutritionGoals Function", function () {
  
  beforeEach(function () {
    mock({
      "temp_data": {
        "userData.json": JSON.stringify({
          age: "25",
          gender: "male",
          height: "175",
          currentWeight: "70"
        })
      }
    });
  });

  afterEach(function () {
    mock.restore();
  });

  it("should calculate nutrition goals", function () {
    const goals = calculateNutritionGoals();

    expect(goals).to.have.property("Total Intake Goal");
    expect(goals).to.have.property("Protein Goal");
    expect(goals).to.have.property("Carbs Goal");
    expect(goals).to.have.property("Fat Goal");
  });
});
