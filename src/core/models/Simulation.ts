import { Random } from "../../utils/random";
import { Distribution } from "../distributions/Distribution";
import { Person } from "./Person";
import { Station } from "./Station";

export class Simulation {
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

    private enqueuePeople(...people: Person[]) {
        for (let person of people) {
            this.stations[0].enqueueClient(person);
        }
    }

    private createPerson() {
        return new Person();
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

        return new Simulation(this.stations, this.entryRate, this.random);
    }
}
