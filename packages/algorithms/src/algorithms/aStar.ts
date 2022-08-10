import type { NodeInterface } from 'graphism'
import type { ShortestPathAlgorithm, SolveOptions } from '../types'
import { GraphAlgorithm } from '.'
export default class AStarAlgorithm extends GraphAlgorithm implements ShortestPathAlgorithm {
  endNode: NodeInterface

  constructor() {
    super()
  }

  solve(solveOptions: SolveOptions) {
    // Unimplemented
  }
}
