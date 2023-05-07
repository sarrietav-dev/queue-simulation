import { Exponential } from '@/core/distributions/exponential'
import { Poisson } from '@/core/distributions/poisson'
import { Uniform } from '@/core/distributions/uniform'
import { ArrivalIterator } from '@/core/models/ArrivalIterator'
import { SimulationBuilder, type SimulationResults } from '@/core/models/Simulation'
import { Random } from './random'
import { Station } from '@/core/models/Station'
import { Server } from '../core/models/Server'

type SimulationData = {
  arrival: DistributionData
  stations: StationData[]
  options: Options
}

export class SimulationRunner {
  constructor(private data: SimulationData) {
    this.builder = this.createSimulationBuilder()
  }

  private builder: SimulationBuilder

  private createSimulationBuilder(): SimulationBuilder {
    const { arrival, stations, options } = this.data
    const builder = new SimulationBuilder()
    
    const random = new Random(this.data.options.seed)

    builder.setArrivalIterator(
      new ArrivalIterator(this.getDistribution(arrival), random)
    )
    builder.setTimeStop(options.simulationTime)

    builder.setStations(
      stations.map((station) => {
        const servers = station.servers.map((server) => {
          return new Server(
            this.getDistribution(server.distribution),
            random
          )
        })

        return new Station(...servers)
      })
    )

    return builder
  }

  public get runs(): Promise<SimulationResults>[] {
    const results = []
    results.push(this.simulationResultPromiseFactory(this.builder))
    return results
  }

  private getDistribution = (distributionData: DistributionData) => {
    switch (distributionData.name) {
      case 'exponential':
        return new Exponential(Number((distributionData.mean as Mean).mean))
      case 'uniform':
        return new Uniform(
          Number((distributionData.mean as UniformMean).a),
          Number((distributionData.mean as UniformMean).b)
        )
      case 'poisson':
        return new Poisson(Number((distributionData.mean as Mean).mean))
    }
  }

  private simulationResultPromiseFactory(builder: SimulationBuilder): Promise<SimulationResults> {
    return new Promise((resolve, reject) => {
      try {
        resolve(builder.build().run())
      } catch (error) {
        reject(error)
      }
    })
  }
}
