type StationData = {
  id: string
  key: string
  servers: ServerData[]
}

type ServerData = {
  key: string
  distribution: DistributionData
}

type Options = {
  simulationTime: number
  seed: number,
  serversWithQueue: boolean
}
