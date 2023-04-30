import { ArrivalIterator } from "./ArrivalIterator";
import { Client } from "./Client";
import { Mediator } from "./Mediator";
import { Station } from "./Station";

export class Simulation implements Mediator {
    constructor(
        private stations: Station[],
        arrivalIterator: ArrivalIterator,
        private timeStop: number = 60
    ) {
        this.arrivals = arrivalIterator.getArrivals(this.timeStop);
    }

    private time: number = 0;
    private clientsInSystem: number = 0;
    private _clientsServed: number = 0;
    private arrivals: number[] = [];

    public run() {
        const arrivingClients = this.arrivals.reduce((a, b) => a + b, 0);
        while (arrivingClients > this.clientsServed) {
            const clientsArrived = this.getClientsArrived();
            const clients: Client[] = Array.from(
                { length: clientsArrived },
                () => this.createClient()
            );
            this.tick();
            this.enqueueClient(...clients);
        }
    }

    get clientsServed(): number {
        return this._clientsServed;
    }

    getClientsArrived() {
        const clientsArrived = this.arrivals[this.time];
        this.clientsInSystem += clientsArrived;
        return clientsArrived;
    }

    private tick() {
        this.time++;
        this.stations.forEach((station) => station.tick());
    }

    private enqueueClient(...clients: Client[]) {
        for (let client of clients) {
            this.stations[0].enqueueClient(client);
        }
    }

    private createClient() {
        return new Client();
    }

    notify(senderIndex: number, client: Client): void {
        if (senderIndex === this.stations.length - 1) {
            this._clientsServed++;
        } else {
            this.stations[senderIndex + 1].enqueueClient(client);
        }
    }
}

export class SimulationBuilder {
    private stations: Station[] = [];
    private arrivalIterator?: ArrivalIterator;
    private timeStop: number = 60;

    public setStations(stations: Station[]): SimulationBuilder {
        this.stations = stations;
        return this;
    }

    public setTimeStop(timeStop: number): SimulationBuilder {
        this.timeStop = timeStop;
        return this;
    }

    public setArrivalIterator(
        arrivalIterator: ArrivalIterator
    ): SimulationBuilder {
        this.arrivalIterator = arrivalIterator;
        return this;
    }

    public build(): Simulation {
        if (this.stations.length === 0) {
            throw new Error("Stations not set");
        }

        if (!this.arrivalIterator) {
            throw new Error("Arrival iterator not set");
        }

        const simulation = new Simulation(
            this.stations,
            this.arrivalIterator,
            this.timeStop
        );

        for (let station of this.stations) {
            station.mediator = simulation;
        }

        return simulation;
    }
}
