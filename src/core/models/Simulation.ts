import { Random } from "../../utils/random";
import { Distribution } from "../distributions/Distribution";
import { Client } from "./Client";
import { Mediator } from "./Mediator";
import { Station } from "./Station";

export class Simulation implements Mediator {
    constructor(
        private stations: Station[],
        private entryRate: Distribution,
        private random: Random
    ) {}

    private time: number = 0;
    private timeStop: number = 60;
    private peopleInSystem: number = 0;
    private peopleServed: number = 0;

    public run() {
        while (
            this.time < this.timeStop &&
            this.peopleServed < this.peopleInSystem
        ) {
            const peopleArrived = this.getPeopleArrived();
            const people = Array.from({ length: peopleArrived }, () =>
                this.createPerson()
            );
            this.tick();
            this.enqueuePeople(...people);
        }
    }
    getPeopleArrived() {
        const peopleArrived = this.entryRate.getVariable(this.random.get());
        this.peopleInSystem += peopleArrived;
        return peopleArrived;
    }

    private tick() {}

    private enqueuePeople(...people: Client[]) {
        for (let person of people) {
            this.stations[0].enqueueClient(person);
        }
    }

    private createPerson() {
        return new Client();
    }

    notify(senderIndex: number, client: Client): void {
        if (senderIndex === this.stations.length - 1) {
            this.peopleServed++;
        } else {
            this.stations[senderIndex + 1].enqueueClient(client);
        }
    }
}

export class SimulationBuilder {
    private stations: Station[] = [];
    private entryRate?: Distribution;
    private random?: Random;

    public setStations(stations: Station[]): SimulationBuilder {
        this.stations = stations;
        return this;
    }

    public setEntryRate(distribution: Distribution): SimulationBuilder {
        this.entryRate = distribution;
        return this;
    }

    public setRandom(random: Random): SimulationBuilder {
        this.random = random;
        return this;
    }

    public build(): Simulation {
        if (!this.entryRate) {
            throw new Error("Entry rate is not set");
        }

        if (!this.random) {
            throw new Error("Random is not set");
        }

        const simulation = new Simulation(
            this.stations,
            this.entryRate,
            this.random
        );

        for (let station of this.stations) {
            station.mediator = simulation;
        }

        return simulation;
    }
}
