import { expect, it, vi } from "vitest";
import { SimulationBuilder } from "../Simulation";
import { Station } from "../Station";
import { ArrivalIterator } from "../ArrivalIterator";
import { Poisson } from "../../distributions/poisson";
import { Random } from "../../../utils/random";
import { Server } from "../Server";

it("has 4 clients on the system", () => {
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

it("has a total time of 8", () => {
    const arrivalIterator = new ArrivalIterator(
        new Poisson(0.333),
        new Random(2)
    );
    vi.spyOn(arrivalIterator, "getArrivals").mockReturnValue([1, 1, 1, 1]);

    const distribution = new Poisson(0.5);
    vi.spyOn(distribution, "getVariable").mockReturnValue(2);

    const simulation = new SimulationBuilder()
        .setStations([new Station(new Server(distribution, new Random(1)))])
        .setArrivalIterator(arrivalIterator)
        .setTimeStop(4)
        .build();

    simulation.run();

    expect(simulation.time).toBe(8);
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

    expect(simulation.time).toBe(14);
});