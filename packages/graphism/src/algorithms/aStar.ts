import type { NodeInterface } from '../types'
import type { ShortestPathAlgorithm, SolveOptions } from '../types/algorithm'
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
