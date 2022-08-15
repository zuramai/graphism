import type { NodeInterface } from '../types'
import type { ProgressStack, ShortestPathAlgorithm, SolveOptions } from '../types/algorithm'
export default class AStarAlgorithm implements ShortestPathAlgorithm {
  endNode: NodeInterface
  nodes: NodeInterface[] = []
  path: NodeInterface[] = []
  startNode: NodeInterface
  progressStack: ProgressStack[] = []

  constructor() {
  }

  solve(solveOptions: SolveOptions) {
    // Unimplemented
  }
}
