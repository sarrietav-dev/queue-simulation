import { Station } from "./Station";

export class Simulation {
    private stations: Station[] = [];
    private arrivalRate: number = 0;
    private timePassed: number = 0;
    private isRealtime: boolean = false;
}
