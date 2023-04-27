import { Distribution } from "./Distribution";

export class Uniform implements Distribution {
    constructor(private a: number, private b: number) {}

    getVariable(x: number): number {
        return this.a + (this.b - this.a) * x;
    }
}
