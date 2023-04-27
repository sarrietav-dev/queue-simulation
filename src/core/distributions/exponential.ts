import { Distribution } from "./Distribution";

export class Exponential implements Distribution {
    constructor(private lambda: number) {}

    getVariable(x: number): number {
        return -this.lambda * Math.log(x);
    }
}
