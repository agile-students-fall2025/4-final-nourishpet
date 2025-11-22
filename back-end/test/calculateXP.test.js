import { expect } from "chai";
import { calculateXP } from "../pet.js";

describe("calculateXP Function", function () {

  it("should return 40 XP when all goals are met", function () {
    const todayArchive = {
      "Total Intake": 2000,
      "Total Intake Goal": 2000,
      "Protein": 100,
      "Protein Goal": 100,
      "Carbs": 250,
      "Carbs Goal": 250,
      "Fat": 70,
      "Fat Goal": 70
    };

    const xp = calculateXP(todayArchive);
    expect(xp).to.equal(40);
  });

  it("should return 0 XP when no goals are met", function () {
    const todayArchive = {
      "Total Intake": 500,
      "Total Intake Goal": 2000,
      "Protein": 20,
      "Protein Goal": 100,
      "Carbs": 50,
      "Carbs Goal": 250,
      "Fat": 10,
      "Fat Goal": 70
    };

    const xp = calculateXP(todayArchive);
    expect(xp).to.equal(0);
  });
});
