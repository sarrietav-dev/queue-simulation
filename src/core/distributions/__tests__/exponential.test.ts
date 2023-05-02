import { beforeEach, describe, expect, it } from "vitest";
import { Exponential } from "../exponential";

describe("Tests for Exponential distribution", () => {
  describe("For mean = 2", () => {
    let exponential: Exponential;

    beforeEach(() => {
      exponential = new Exponential(2);
    });

    it("should return correct value for x = 0.434184676", () => {
      expect(exponential.getVariable(0.434184676)).toBeCloseTo(1.66857063);
    });

    it("should return correct value for x = 0.823182711", () => {
      expect(exponential.getVariable(0.823182711)).toBeCloseTo(0.389154193);
    });
  });

  describe("For mean = 16", () => {
    let exponential: Exponential;

    beforeEach(() => {
      exponential = new Exponential(16);
    });

    it("should return correct value for x = 0.862068966", () => {
      expect(exponential.getVariable(0.862068966)).toBeCloseTo(2.374720082);
    });

    it("should return correct value for x = 0.965517241", () => {
      expect(exponential.getVariable(0.965517241)).toBeCloseTo(0.561461117);
    });
  });

  describe("For mean = 36", () => {
    let exponential: Exponential;

    beforeEach(() => {
      exponential = new Exponential(36);
    });

    it("should return correct value for x = 0.862068966", () => {
      expect(exponential.getVariable(0.862068966)).toBeCloseTo(5.343120184);
    });

    it("should return correct value for x = 0.965517241", () => {
      expect(exponential.getVariable(0.965517241)).toBeCloseTo(1.263287513);
    });
  });
});
