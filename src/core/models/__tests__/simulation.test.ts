import { describe, expect, it, vi } from "vitest";
import { SimulationBuilder } from "../Simulation";
import { Station } from "../Station";
import { ArrivalIterator } from "../ArrivalIterator";
import { Poisson } from "../../distributions/poisson";
import { Random } from "../../../utils/random";
import { Server } from "../Server";

it("serves every client on the simulation", () => {
    const arrivalIterator = new ArrivalIterator(
        new Poisson(0.333),
        new Random(2)
    );
    vi.spyOn(arrivalIterator, "getArrivals").mockReturnValue([1, 1, 1, 1]);

    const distribution = new Poisson(0.5);
    vi.spyOn(distribution, "getVariable").mockReturnValue(1);

    const simulation = new SimulationBuilder()
        .setStations([new Station(new Server(distribution, new Random(1)))])
        .setArrivalIterator(arrivalIterator)
        .setTimeStop(4)
        .build();

    simulation.run();

    expect(simulation.clientsServed).toBe(4);
});

describe("Time duration tests", () => {
    const arrivalIterator = new ArrivalIterator(
        new Poisson(0.333),
        new Random(2)
    );
    vi.spyOn(arrivalIterator, "getArrivals").mockReturnValue([1, 1, 1, 1]);

    it("has a total time of 8", () => {
        const distribution = new Poisson(0.5);
        vi.spyOn(distribution, "getVariable").mockReturnValue(2);

        const simulation = new SimulationBuilder()
            .setStations([new Station(new Server(distribution, new Random(1)))])
            .setArrivalIterator(arrivalIterator)
            .setTimeStop(4)
            .build();

        simulation.run();

        expect(simulation.time).toBe(9);
    });

    it("has a total time of 5 with 2 servers", () => {
        const distribution = new Poisson(0.5);
        vi.spyOn(distribution, "getVariable").mockReturnValue(2);

        const simulation = new SimulationBuilder()
            .setStations([
                new Station(
                    new Server(distribution, new Random(1)),
                    new Server(distribution, new Random(1))
                ),
            ])
            .setArrivalIterator(arrivalIterator)
            .setTimeStop(4)
            .build();

        simulation.run();

        expect(simulation.time).toBe(6);
    });

    it("has a total time of 8 with 3 servers and serving time of 4", () => {
        const distribution = new Poisson(0.5);
        vi.spyOn(distribution, "getVariable").mockReturnValue(4);

        const simulation = new SimulationBuilder()
            .setStations([
                new Station(
                    new Server(distribution, new Random(1)),
                    new Server(distribution, new Random(1)),
                    new Server(distribution, new Random(1))
                ),
            ])
            .setArrivalIterator(arrivalIterator)
            .setTimeStop(4)
            .build();

        simulation.run();

        expect(simulation.time).toBe(9);
    });

    it("has a total time of 14", () => {
        const arrivalIterator = new ArrivalIterator(
            new Poisson(0.333),
            new Random(2)
        );
        vi.spyOn(arrivalIterator, "getArrivals").mockReturnValue([1, 2, 1, 3]);

        const distribution = new Poisson(0.5);
        vi.spyOn(distribution, "getVariable").mockReturnValue(2);

        const simulation = new SimulationBuilder()
            .setStations([new Station(new Server(distribution, new Random(1)))])
            .setArrivalIterator(arrivalIterator)
            .setTimeStop(4)
            .build();

        simulation.run();

        expect(simulation.time).toBe(15);
    });
});

describe("Multiple stations tests", () => {
    const arrivalIterator = new ArrivalIterator(
        new Poisson(0.333),
        new Random(2)
    );
    vi.spyOn(arrivalIterator, "getArrivals").mockReturnValue([1, 1, 1, 1]);

    it("has a total time of 8 with 2 stations", () => {
        const distribution1 = new Poisson(0.5);
        vi.spyOn(distribution1, "getVariable").mockReturnValue(2);

        const distribution2 = new Poisson(0.5);
        vi.spyOn(distribution2, "getVariable").mockReturnValue(2);

        const simulation = new SimulationBuilder()
            .setStations([
                new Station(new Server(distribution1, new Random(1))),
                new Station(new Server(distribution2, new Random(1))),
            ])
            .setArrivalIterator(arrivalIterator)
            .setTimeStop(4)
            .build();

        simulation.run();

        expect(simulation.time).toBe(11);
    });

    it("has a total time of 9 with 2 stations with 2 servers", () => {
        const distribution1 = new Poisson(0.5);
        vi.spyOn(distribution1, "getVariable").mockReturnValue(2);

        const distribution2 = new Poisson(0.5);
        vi.spyOn(distribution2, "getVariable").mockReturnValue(2);

        const simulation = new SimulationBuilder()
            .setStations([
                new Station(
                    new Server(distribution1, new Random(1)),
                    new Server(distribution1, new Random(1))
                ),
                new Station(
                    new Server(distribution2, new Random(1)),
                    new Server(distribution2, new Random(1))
                ),
            ])
            .setArrivalIterator(arrivalIterator)
            .setTimeStop(4)
            .build();

        simulation.run();

        expect(simulation.time).toBe(8);
    });
});

describe("Longest queue tests", () => {});
