import { Distribution } from './Distribution'

export class Exponential extends Distribution {
  constructor(private lambda: number) {
    super()
  }

  getVariable(x: number): number {
    return -this.lambda * Math.log(x)
  }
}
