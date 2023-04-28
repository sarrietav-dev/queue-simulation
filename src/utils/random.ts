import { Chance } from "chance";

export class Random {
    constructor(seed: number) {
        this.random = new Chance(seed);
    }

    private random: Chance.Chance;

    get(): number {
        return this.random.floating({ min: 0, max: 1, fixed: 8 });
    }
}
