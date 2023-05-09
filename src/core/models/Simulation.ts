import type { ArrivalIterator } from './ArrivalIterator'
import { Client } from './Client'
import type { Mediator } from './Mediator'
import type { Station } from './Station'

export type SimulationResults = {
  time: number
  longestQueue: {
    station: number[]
    length: number
  }
  waitTimeAverage: number
}

type LongestQueueResult = {
  station: number[]
  length: number
}

export class Simulation implements Mediator {
  constructor(
    private stations: Station[],
    arrivalIterator: ArrivalIterator,
    private timeStop: number = 60
  ) {
    this.arrivals = arrivalIterator.getArrivals(this.timeStop)
  }

  private _time: number = 0
  private _clientsInSystem: number = 0
  private _clientsServed: number = 0
  private waitTimeAcumulator: number = 0
  private arrivals: number[] = []

  public run(): SimulationResults {
    const arrivingClients = this.arrivingClients

    while (arrivingClients > this.clientsServed) {
      const clientsArrived = this.getArrivingClients()
      const clients: Client[] = Array.from({ length: clientsArrived }, () => this.createClient())
      this.enqueueClient(...clients)
      this.tick()
    }

    return {
      time: this.time,
      longestQueue: this.longestQueue,
      waitTimeAverage: this.averageWaitTime
    }
  }

  private get arrivingClients(): number {
    return this.arrivals.reduce((a, b) => a + b, 0)
  }

  get clientsServed(): number {
    return this._clientsServed
  }

  getArrivingClients(): number {
    const clientsArrived = this.arrivals[this._time] ?? 0
    this._clientsInSystem += clientsArrived
    return clientsArrived
  }

  private createClient(): Client {
    return new Client()
  }

  private enqueueClient(...clients: Client[]): void {
    for (const client of clients) {
      this.stations[0].enqueueClient(client)
    }
  }

  private tick(): void {
    this._time++
    this.stations.forEach((station) => station.tick())
  }

  get time(): number {
    return this._time
  }

  private get longestQueue(): LongestQueueResult {
    let longestQueue: LongestQueueResult = {
      station: [],
      length: 0
    }

    this.stations.forEach((station, index) => {
      const stationLongestQueue = station.greatestQueueLength

      if (stationLongestQueue === longestQueue.length) {
        longestQueue.station.push(index)
      } else if (stationLongestQueue > longestQueue.length) {
        longestQueue = {
          station: [index],
          length: stationLongestQueue
        }
      }
    })

    return longestQueue
  }

  get averageWaitTime(): number {
    return this.waitTimeAcumulator / this.clientsServed
  }

  get clientsInSystem(): number {
    return this._clientsInSystem
  }

  notify(senderIndex: number, client: Client): void {
    if (senderIndex === this.stations.length - 1) {
      this.waitTimeAcumulator += client.timeWaiting
      this._clientsServed++
    } else {
      this.stations[senderIndex + 1].enqueueClient(client)
    }
  }
}

export class SimulationBuilder {
  private stations: Station[] = []
  private arrivalIterator?: ArrivalIterator
  private timeStop: number = 60
  private usesServersWithQueue: boolean = false

  public setStations(stations: Station[]): SimulationBuilder {
    this.stations = stations
    return this
  }

  public setTimeStop(timeStop: number): SimulationBuilder {
    this.timeStop = timeStop
    return this
  }

  public setServersWithQueue(serversWithQueue: boolean): SimulationBuilder {
    this.usesServersWithQueue = serversWithQueue
    return this
  }

  public setArrivalIterator(arrivalIterator: ArrivalIterator): SimulationBuilder {
    this.arrivalIterator = arrivalIterator
    return this
  }

  public build(): Simulation {
    if (this.stations.length === 0) {
      throw new Error('Stations not set')
    }

    if (!this.arrivalIterator) {
      throw new Error('Arrival iterator not set')
    }

    const simulation = new Simulation(this.stations, this.arrivalIterator, this.timeStop)

    this.stations.forEach((station, i) => {
      station.usesServersWithQueue = this.usesServersWithQueue
      station.mediator = simulation
      station.index = i
    })

    return simulation
  }
}
