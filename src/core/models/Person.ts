export class Person {
    constructor() {}

    private _timeWaiting: number = 0;

    get timeWaiting(): number {
        return this._timeWaiting;
    }
}
