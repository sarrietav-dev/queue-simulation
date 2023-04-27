import { beforeEach, describe, expect, it } from "vitest";
import { Poisson } from "../poisson";

describe("Test for the Poisson distribution", () => {
    describe("For the mean = 0.333", () => {
        let poisson: Poisson;

        beforeEach(() => {
            poisson = new Poisson(0.333);
        });

        it("returns 0 for 0.52848723", () => {
            const variable = poisson.getVariable(0.52848723);

            expect(variable).toBe(0);
        });

        it("returns 1 for 0.52848724", () => {
            const variable = poisson.getVariable(0.905697446);

            expect(variable).toBe(1);
        });

        it("returns 2 for 0.988212181", () => {
            const variable = poisson.getVariable(0.988212181);

            expect(variable).toBe(2);
        });
    });

    describe("For the mean = 20", () => {
        let poisson: Poisson;

        beforeEach(() => {
            poisson = new Poisson(20);
        });

        it("returns 10 for 0.004995412", () => {
            const variable = poisson.getVariable(0.005995412);

            expect(variable).toBe(10);
        });

        it("returns 20 for 0.551724138", () => {
            const variable = poisson.getVariable(0.551724138);

            expect(variable).toBe(20);
        });

        it("returns 23 for 0.724137931", () => {
            const variable = poisson.getVariable(0.724137931);

            expect(variable).toBe(23);
        });

        it("returns 34 for 0.997311562", () => {
            const variable = poisson.getVariable(0.997311562);

            expect(variable).toBe(34);
        });
    });
});
