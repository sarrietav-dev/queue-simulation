type Subscriber = () => void;

export class Clock {
    private time: number = 0;
    private subscribers: Subscriber[] = [];
    private static instance: Clock;

    private constructor() {}

    public static getInstance(): Clock {
        if (!Clock.instance) {
            Clock.instance = new Clock();
        }
        return Clock.instance;
    }

    public subscribe(subscriber: Subscriber): void {
        this.subscribers.push(subscriber);
    }

    public tick(): void {
        this.time++;
        this.subscribers.forEach((fn) => fn());
    }

    public getTime(): number {
        return this.time;
    }
}
