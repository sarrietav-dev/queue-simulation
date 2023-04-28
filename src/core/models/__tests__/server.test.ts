import { expect, it, vi } from "vitest";
import { Server } from "../Server";
import { Random } from "../../../utils/random";
import { Exponential } from "../../distributions/exponential";

it("should be busy when serving a person", () => {
    const dist = new Exponential(2);
    const random = new Random(1);
    const server = new Server(dist, random);

    server.serve();

    expect(server.isBusy).toBe(true);
});

it("should have a correct remaining time", () => {
    const dist = new Exponential(2);
    const random = new Random(1);
    const server = new Server(dist, random);
    vi.spyOn(random, "get").mockReturnValue(0.001964637);

    server.serve();

    expect(server.isBusy).toBe(true);
    expect(server.timeRemaining).toBe(12);
});
