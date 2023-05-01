import { Random } from "../../utils/random";
import { Distribution } from "../distributions/Distribution";
import { Client } from "./Client";

export class Server {
    constructor(private servingRate: Distribution, private random: Random) {}

    private timeRemainingUntilFree: number = -1;
    private clientBeingServed?: Client;
    private _onClientServed: (client: Client) => void = () => {};

    set onClientServed(onClientServed: (client: Client) => void) {
        this._onClientServed = onClientServed;
    }

    get isBusy(): boolean {
        return this.timeRemainingUntilFree > 0;
    }

    get timeRemaining(): number {
        return this.timeRemainingUntilFree;
    }

    serve(client: Client) {
        this.clientBeingServed = client;
        this.timeRemainingUntilFree = Math.round(
            this.servingRate.getVariable(this.random.get())
        );
    }

    tick(): void {
        if (this.timeRemainingUntilFree > 0) {
            this.timeRemainingUntilFree--;
        }
    }

    notifyIfFinished(): void {
        if (this.timeRemainingUntilFree === 0) {
            this.notifyStation();
        }
    }

    notifyStation() {
        if (this.clientBeingServed) {
            this._onClientServed(this.clientBeingServed);
            this.clientBeingServed = undefined;
        }
    }
}
