import { Server } from "./Server";
import { Client } from "./Client";
import { Mediator } from "./Mediator";

export class Station {
    constructor(...server: Server[]) {
        if (server.length == 0) {
            throw new Error("Cannot create a station with no servers");
        }

        this.addServer(...server);
    }

    private _servers: Server[] = [];
    private queue: Client[] = [];
    private _index: number = 0;
    private _mediator?: Mediator;

    get size() {
        return this._servers.length;
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

        this._servers.push(...server);
    }

    get clientsWaiting() {
        return this.queue.length;
    }

    enqueueClient(person: Client) {
        this.queue.push(person);
    }

    tick() {
        while (this.isAnyServerAvailable()) {
            const server = this.getAvailableServer();

            if (!server) break;

            const client = this.queue.shift();

            if (!client) break;

            server.serve(client);
        }

        this._servers.forEach((server) => server.tick());
    }

    set mediator(mediator: Mediator) {
        this._mediator = mediator;
    }

    private getAvailableServer() {
        return this._servers.find((server) => !server.isBusy);
    }

    private isAnyServerAvailable() {
        return this._servers.some((server) => !server.isBusy);
    }

    set index(index: number) {
        this._index = index;
    }
}
