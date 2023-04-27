import { Exponential } from "./distributions/exponential";
import { Poisson } from "./distributions/poisson";

export class Main {
    constructor(private timeStop: number) {}

    private poisson = new Poisson(0.33);
    private queue: number[] = [];
    private server: Server = new Server();

    run() {
        for (let i = 0; i < this.timeStop; i++) {
            let peopleArrived = this.tickPersonArrived(i);
            this.server.tick();

            this.enqueuePeople(i, peopleArrived);

            console.log("Queue: %s", this.queue);

            if (!this.server.isBusy) {
                let person = this.nextFromQueue();

                if (person == undefined) {
                    console.log("No one is being served");
                    continue;
                }

                console.log("Person %d is being served", person);

                let serverTime = new Exponential(2).getVariable(Math.random());

                this.server.serve(person, serverTime);
            }
        }
    }

    tickPersonArrived(time: number) {
        let r = Math.random();
        var peopleArrived = this.poisson.getVariable(r);
        console.log("Time: %d, People arrived: %d", time, peopleArrived);
        return peopleArrived;
    }

    enqueuePeople(time: number, people: number) {
        for (let i = 0; i < people; i++) {
            this.queue.push(time);
        }
    }

    nextFromQueue() {
        return this.queue.shift();
    }
}

class Server {
    constructor() {}

    private person: number = 0;
    private timeLeft: number = 0;

    serve(person: number, time: number) {
        this.person = person;
        this.timeLeft = Math.round(time);

        console.log(
            "Person %d will be served for %d minutes",
            person,
            Math.round(this.timeLeft)
        );
    }

    tick() {
        if (this.timeLeft <= 0) {
            console.log("Person %d is done being served", this.person);
            return;
        }

        this.timeLeft--;
        console.log("Time left: %d for person %d", this.timeLeft, this.person);
    }

    get isBusy() {
        return this.timeLeft > 0;
    }
}
