import { Distribution } from "@distributions/Distribution";
import { Person } from "./Person";
import { Random } from "utils/random";

export class Worker {
    constructor(
        private servingRate: Distribution,
        private random: Random
    ) {}

    private timeRemainingUntilFree: number = 0;

    get isBusy(): boolean {
        return this.timeRemainingUntilFree > 0;
    }

    get timeRemaining(): number {
        return this.timeRemainingUntilFree;
    }

    serve(person: Person) {
        this.timeRemainingUntilFree = Math.round(
            this.servingRate.getVariable(this.random.get())
        );
    }
}
