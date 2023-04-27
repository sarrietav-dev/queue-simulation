import { beforeEach, describe, expect, it } from "vitest";
import { Uniform } from "../uniform";

describe("Tests for Uniform distribution", () => {
    describe("For a = 1, b = 2", () => {
        let uniform: Uniform;

        beforeEach(() => {
            uniform = new Uniform(1, 2);
        });

        it("should return correct value for x = 0.434184676", () => {
            expect(uniform.getVariable(0.434184676)).toBeCloseTo(1.434184676);
        });

        it("should return correct value for x = 0.823182711", () => {
            expect(uniform.getVariable(0.823182711)).toBeCloseTo(1.823182711);
        });
    });

    describe("For a = 30000, b = 50000", () => {
        let uniform: Uniform;

        beforeEach(() => {
            uniform = new Uniform(30000, 50000);
        });

        it("should return correct value for x = 0.827586207", () => {
            expect(uniform.getVariable(0.827586207)).toBeCloseTo(46551.72414);
        });

        it("should return correct value for x = 0.068965517", () => {
            expect(uniform.getVariable(0.068965517)).toBeCloseTo(31379.31034);
        });

        it("should return correct value for x = 0", () => {
            expect(uniform.getVariable(0)).toBeCloseTo(30000);
        })

        it("should return correct value for x = 1", () => {
            expect(uniform.getVariable(1)).toBeCloseTo(50000);
        });
    });

    describe("For a = 10, b = 20", () => {
        let uniform: Uniform;

        beforeEach(() => {
            uniform = new Uniform(10, 20);
        });

        it("should return correct value for x = 0.862068966", () => {
            expect(uniform.getVariable(0.862068966)).toBeCloseTo(18.62068966);
        });

        it("should return correct value for x = 0.965517241", () => {
            expect(uniform.getVariable(0.965517241)).toBeCloseTo(19.65517241);
        });
    });
});
