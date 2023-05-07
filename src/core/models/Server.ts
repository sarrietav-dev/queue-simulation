import type { Random } from '../../utils/random'
import type { Distribution } from '../distributions/Distribution'
import type { Client } from './Client'

export class Server {
  constructor(private servingRate: Distribution, private random: Random) {}

  private timeRemainingUntilFree: number = -1
  private clientBeingServed?: Client
  private _onClientServed: (client: Client) => void = () => {}
  private _queue: Client[] = []
  private _usesQueue: boolean = false

  set onClientServed(onClientServed: (client: Client) => void) {
    this._onClientServed = onClientServed
  }

  set usesQueue(usesQueue: boolean) {
    this._usesQueue = usesQueue
  }

  get isBusy(): boolean {
    return this.timeRemainingUntilFree > 0
  }

  get timeRemaining(): number {
    return this.timeRemainingUntilFree
  }

  serve(client: Client): void {
    this.clientBeingServed = client
    while (this.timeRemainingUntilFree <= 0) {
      this.timeRemainingUntilFree = Math.round(this.servingRate.getVariable(this.random.get()))
    }
  }

  tick(): void {
    if (this._usesQueue && !this.isBusy) {
      const client = this._queue.shift()

      if (client) {
        this.serve(client)
      }
    }

    if (this.isBusy) {
      this.timeRemainingUntilFree--
    }
  }

  notifyIfFinished(): void {
    if (this.timeRemainingUntilFree === 0) {
      this.notifyStation()
    }
  }

  notifyStation(): void {
    if (this.clientBeingServed) {
      this._onClientServed(this.clientBeingServed)
      this.clientBeingServed = undefined
    }
  }

  enqueueClient(client: Client): void {
    this._queue.push(client)
  }

  get queue(): Client[] {
    return this._queue
  }
}
