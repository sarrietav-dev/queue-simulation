import type { Random } from '../../utils/random'
import type { Distribution } from '../distributions/Distribution'

export class ArrivalIterator {
  constructor(private entryRate: Distribution, private random: Random) {}

  getArrivals(timeLimit: number): number[] {
    const arrivals: number[] = []

    for (let time = 0; time < timeLimit; time++) {
      const peopleArrived = this.entryRate.getVariable(this.random.get())
      arrivals.push(peopleArrived)
    }

    return arrivals
  }
}
