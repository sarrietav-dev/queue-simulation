import type { Server } from './Server'
import type { Client } from './Client'
import type { Mediator } from './Mediator'

export class Station {
  constructor(...server: Server[]) {
    if (server.length == 0) {
      throw new Error('Cannot create a station with no servers')
    }

    this.addServer(...server)
  }

  private _servers: Server[] = []
  private queue: Client[] = []
  private _index: number = 0
  private _mediator?: Mediator
  private _greatestQueueLength: number = 0
  private _usesServersWithQueue: boolean = false

  addServer(...server: Server[]) {
    if (this.size + server.length > 4) {
      throw new Error('Cannot add more than 4 servers')
    }

    server.forEach((server) => {
      server.onClientServed = (client) => {
        this._mediator?.notify(this._index, client)
      }
    })

    this._servers.push(...server)
  }

  get size() {
    return this._servers.length
  }

  enqueueClient(person: Client) {
    if (this._usesServersWithQueue) {
      return this.enqueueClientInServer(person)
    }

    this.queue.push(person)

    if (this.queue.length > this._greatestQueueLength) {
      this._greatestQueueLength = this.queue.length
    }
  }

  private enqueueClientInServer(person: Client) {
    const queueLengths = this._servers.map((server) => {
      return server.queue.length
    })

    const minQueueLength = queueLengths.findIndex(() => Math.min(...queueLengths))

    this._servers[minQueueLength].enqueueClient(person)
  }

  get greatestQueueLength() {
    return this._greatestQueueLength
  }

  tick() {
    this._servers.forEach((server) => server.notifyIfFinished())

    if (!this._usesServersWithQueue) {
      while (this.isAnyServerAvailable()) {
        const server = this.getAvailableServer()

        if (!server) break

        const client = this.queue.shift()

        if (!client) break

        server.serve(client)
      }

      this.queue.forEach((client) => client.increaseWaitTime())
    }

    this._servers.forEach((server) => server.tick())
  }

  private isAnyServerAvailable() {
    return this._servers.some((server) => !server.isBusy)
  }

  private getAvailableServer() {
    return this._servers.find((server) => !server.isBusy)
  }

  set mediator(mediator: Mediator) {
    this._mediator = mediator
  }

  set index(index: number) {
    this._index = index
  }

  set usesServersWithQueue(usesServersWithQueue: boolean) {
    this._usesServersWithQueue = usesServersWithQueue

    if (usesServersWithQueue) {
      this._servers.forEach((server) => {
        server.usesQueue = true
      })
    }
  }

  get clientsWaiting() {
    return this.queue.length
  }
}
