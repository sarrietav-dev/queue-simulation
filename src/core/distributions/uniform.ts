import { Distribution } from './Distribution'

export class Uniform extends Distribution {
  constructor(private a: number, private b: number) {
    super()
  }

  getVariable(x: number): number {
    return this.a + (this.b - this.a) * x
  }
}
