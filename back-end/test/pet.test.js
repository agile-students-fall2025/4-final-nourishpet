import mock from "mock-fs";
import { expect } from "chai";
import { showPetInfo, upgrade } from "../pet.js";

describe("Pet Functions (mocked fs)", function () {
  beforeEach(function () {
    mock({
      "temp_data/pet_info.json": JSON.stringify({
        id: 1,
        petName: "Charlie",
        level: 4,
        xp: 190,
      }),
    });
  });

  afterEach(function () {
    mock.restore();
  });

  it("should show pet info", function () {
    expect(showPetInfo()).to.deep.equal({
      id: 1,
      petName: "Charlie",
      level: 4,
      xp: 190,
    });
  });

  it("should upgrade pet", function () {
    const result = upgrade(100);
    expect(result.level).to.equal(6);
  });
});
