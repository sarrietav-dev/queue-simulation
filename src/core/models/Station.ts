import { Server } from "./Server";
import { Person } from "./Person";

export class Station {
    constructor() {}

    private _workers: Server[] = [];
    private queue: Person[] = [];

    get size() {
        return this._workers.length;
    }

    addServer(...server: Server[]) {
        if (this.size + server.length > 4) {
            throw new Error("Cannot add more than 4 servers");
        }

        this._workers.push(...server);
    }

    get clientsWaiting() {
        return this.queue.length;
    }

    enqueueClient(person: Person) {
        this.queue.push(person);
    }

    tick() {
        this._workers.forEach((server) => server.tick());

        while (this.isAnyServerAvailable) {
            const server = this.getAvailableServer();

            if (server) {
                this.queue.shift();
                server.serve();
            } else {
                break;
            }
        }
    }

    private getAvailableServer() {
        return this._workers.find((server) => !server.isBusy);
    }

    private isAnyServerAvailable() {
        return this._workers.some((server) => !server.isBusy);
    }
}
