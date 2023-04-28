import { Worker } from "@models/Worker";

export class Station {
    constructor() {}

    private workers: Worker[] = [];
    private queue: Worker[] = [];
}
