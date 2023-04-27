export class Exponential {
    constructor(private lambda: number) {}

    getVariable(x: number): number {
        return -this.lambda * Math.log(x);
    }
}
