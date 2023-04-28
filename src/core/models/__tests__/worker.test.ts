import { expect, it, vi } from "vitest";
import { Worker } from "../Worker";
import { Person } from "../Person";
import { Random } from "../../../utils/random";
import { Exponential } from "../../distributions/exponential";

it("should be busy when serving a person", () => {
    const dist = new Exponential(2);
    const random = new Random(1);
    const worker = new Worker("1", dist, random);

    worker.serve(new Person("4"));

    expect(worker.isBusy).toBe(true);
});

it("should be busy when serving a person", () => {
    const dist = new Exponential(2);
    const random = new Random(1);
    const worker = new Worker("1", dist, random);
    vi.spyOn(random, "get").mockReturnValue(0.001964637);

    worker.serve(new Person("4"));

    expect(worker.isBusy).toBe(true);
    expect(worker.timeRemaining).toBe(12);
});
