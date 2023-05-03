import type { SimulationResults } from '@/core/models/Simulation'
import { defineStore } from 'pinia'

type State = {
  simulations: Promise<SimulationResults>[]
}

export const useSimulations = defineStore('simulations', {
  state: (): State => ({
    simulations: []
  })
})
