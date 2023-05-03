type StationData = {
  id: string
  key: string
  servers: ServerData[]
}

type ServerData = {
  distribution: DistributionData
}
