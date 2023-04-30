export class Client {
    constructor() {}

    private _timeWaiting: number = 0;

    get timeWaiting(): number {
        return this._timeWaiting;
    }
}
