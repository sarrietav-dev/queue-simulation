import { Exponential } from "../../distributions/exponential";
import { Server } from "../Server";
import { Station } from "../Station";
import { Client } from "../Client";
import { Random } from "../../../utils/random";
import { describe, expect, it, vi } from "vitest";

it("should have four workers", () => {
    const servers: Server[] = [];

    for (let i = 0; i < 4; i++) {
        servers.push(new Server(new Exponential(2), new Random(1)));
    }

    const station = new Station(...servers);

    expect(station.size).toBe(4);
});

it("should throw an error when creating with no servers", () => {
    expect(() => new Station()).toThrow(
        "Cannot create a station with no servers"
    );
});

describe("when adding workers", () => {
    it("should not accept another worker when it's full capacity", () => {
        const servers: Server[] = [];

        for (let i = 0; i < 4; i++) {
            servers.push(new Server(new Exponential(2), new Random(1)));
        }

        const station = new Station(...servers);

        expect(() =>
            station.addServer(new Server(new Exponential(2), new Random(1)))
        ).toThrow("Cannot add more than 4 servers");
    });

    it("should not accept more than 4 workers", () => {
        const servers: Server[] = [];

        for (let i = 0; i < 5; i++) {
            servers.push(new Server(new Exponential(2), new Random(1)));
        }

        expect(() => new Station(...servers)).toThrow(
            "Cannot add more than 4 servers"
        );
    });
});

describe("when pushing clients to the queue", () => {
    it("should serve a client if a server is available", () => {
        const station = new Station(
            new Server(new Exponential(2), new Random(1))
        );

        station.enqueueClient(new Client());
        station.tick();

        expect(station.clientsWaiting).toBe(0);
    });

    it("should push a client to the queue if no server is available", () => {
        const station = new Station(
            new Server(new Exponential(2), new Random(1))
        );

        station.enqueueClient(new Client());
        station.enqueueClient(new Client());

        station.tick();

        expect(station.clientsWaiting).toBe(1);
    });

    it("should serve a client from the queue if a server becomes available", () => {
        const random = new Random(1);
        const station = new Station(new Server(new Exponential(2), random));

        vi.spyOn(random, "get").mockReturnValue(0.5);

        station.enqueueClient(new Client());

        station.tick();

        station.enqueueClient(new Client());

        station.tick();

        expect(station.clientsWaiting).toBe(0);
    });

    it("should assign a client to the second server if one is busy", () => {
        const random1 = new Random(1);
        const random2 = new Random(1);
        const station = new Station(
            new Server(new Exponential(2), random1),
            new Server(new Exponential(2), random2)
        );

        vi.spyOn(random1, "get").mockReturnValue(0.349705305);
        vi.spyOn(random2, "get").mockReturnValue(0.5);

        station.enqueueClient(new Client());
        station.enqueueClient(new Client());

        station.tick();

        expect(station.clientsWaiting).toBe(0);
    });
});
