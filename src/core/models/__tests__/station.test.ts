import { Exponential } from "../../distributions/exponential";
import { Server } from "../Server";
import { Station } from "../Station";
import { Person } from "../Person";
import { Random } from "../../../utils/random";
import { describe, expect, it, vi } from "vitest";

it("should have four workers", () => {
    const station = new Station();

    const servers: Server[] = [];

    for (let i = 0; i < 4; i++) {
        servers.push(new Server(new Exponential(2), new Random(1)));
    }

    station.addServer(...servers);

    expect(station.size).toBe(4);
});

describe("when adding workers", () => {
    it("should not accept another worker when it's full capacity", () => {
        const station = new Station();

        const servers: Server[] = [];

        for (let i = 0; i < 4; i++) {
            servers.push(new Server(new Exponential(2), new Random(1)));
        }

        station.addServer(...servers);

        expect(() =>
            station.addServer(new Server(new Exponential(2), new Random(1)))
        ).toThrow("Cannot add more than 4 servers");
    });

    it("should not accept more than 4 workers", () => {
        const station = new Station();

        const servers: Server[] = [];

        for (let i = 0; i < 5; i++) {
            servers.push(new Server(new Exponential(2), new Random(1)));
        }

        expect(() => station.addServer(...servers)).toThrow(
            "Cannot add more than 4 servers"
        );
    });
});

describe("when pushing clients to the queue", () => {
    it("should serve a client if a server is available", () => {
        const station = new Station();

        station.addServer(new Server(new Exponential(2), new Random(1)));

        station.enqueueClient(new Person());
        station.tick();

        expect(station.clientsWaiting).toBe(0);
    });

    it("should push a client to the queue if no server is available", () => {
        const station = new Station();

        station.addServer(new Server(new Exponential(2), new Random(1)));

        station.enqueueClient(new Person());
        station.enqueueClient(new Person());

        station.tick();

        expect(station.clientsWaiting).toBe(1);
    });

    it("should serve a client from the queue if a server becomes available", () => {
        const station = new Station();

        const random = new Random(1);
        const server = new Server(new Exponential(2), random);

        vi.spyOn(random, "get").mockReturnValue(0.5);

        station.addServer(server);

        station.enqueueClient(new Person());

        station.tick();

        station.enqueueClient(new Person());

        station.tick();

        expect(station.clientsWaiting).toBe(0);
    });

    it("should assign a client to the second server if one is busy", () => {
        const station = new Station();

        const random1 = new Random(1);
        const random2 = new Random(1);
        const server = new Server(new Exponential(2), random1);
        const server2 = new Server(new Exponential(2), random2);

        vi.spyOn(random1, "get").mockReturnValue(0.349705305);
        vi.spyOn(random2, "get").mockReturnValue(0.5);

        station.addServer(server, server2);

        station.enqueueClient(new Person());
        station.enqueueClient(new Person());

        station.tick();

        expect(station.clientsWaiting).toBe(0);
    });
});
