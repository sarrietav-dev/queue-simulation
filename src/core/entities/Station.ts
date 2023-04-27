import { Worker } from "./Worker";

export class Station {
    constructor(private id: string) {}

    private workers: Worker[] = [];
    private queue: Worker[] = [];
}
