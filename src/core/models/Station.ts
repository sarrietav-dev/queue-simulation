import { Server } from "./Server";
import { Client } from "./Client";
import { Mediator } from "./Mediator";

export class Station {
    constructor() {}

    private _workers: Server[] = [];
    private queue: Client[] = [];
    private _index: number = 0;
    private _mediator?: Mediator;

    get size() {
        return this._workers.length;
    }

    addServer(...server: Server[]) {
        if (this.size + server.length > 4) {
            throw new Error("Cannot add more than 4 servers");
        }

        server.forEach((server) => {
            server.onClientServed = (client) => {
                this._mediator?.notify(this._index, client);
            };
        });

        this._workers.push(...server);
    }

    get clientsWaiting() {
        return this.queue.length;
    }

    enqueueClient(person: Client) {
        this.queue.push(person);
    }

    tick() {
        this._workers.forEach((server) => server.tick());

        while (this.isAnyServerAvailable) {
            const server = this.getAvailableServer();

            if (!server) break;

            const client = this.queue.shift();

            if (!client) break;

            server.serve(client);
        }
    }

    set mediator(mediator: Mediator) {
        this._mediator = mediator;
    }

    private getAvailableServer() {
        return this._workers.find((server) => !server.isBusy);
    }

    private isAnyServerAvailable() {
        return this._workers.some((server) => !server.isBusy);
    }
}
