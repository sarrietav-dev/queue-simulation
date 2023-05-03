import type { Distribution } from './Distribution'

type Limit = { lower: number; upper: number }

export class Poisson implements Distribution {
  constructor(private mean: number) {
    this.generateLimits()
  }

  private limits: Limit[] = []

  getVariable(x: number): number {
    return this.limits.findIndex((value) => {
      return x >= value.lower && x < value.upper
    })
  }

  private generateLimits() {
    let previous: number = 0
    let current: number = 0

    while (previous < 0.999) {
      const upper = previous + this.probability(current)
      this.limits.push({ lower: previous, upper })
      previous = upper
      current++
    }

    this.limits[this.limits.length - 1].upper = 1
  }

  private probability(x: number) {
    return (Math.pow(this.mean, x) * Math.exp(-this.mean)) / this.factorial(x)
  }

  private factorial(x: number): number {
    return x <= 1 ? 1 : x * this.factorial(x - 1)
  }
}
