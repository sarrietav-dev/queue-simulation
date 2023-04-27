export class Worker {
    constructor(private id: string) {}

    private isBusy: boolean = false;
    private timeRemainingUntilFree: number = 0;
}
