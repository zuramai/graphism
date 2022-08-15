import type { NodeInterface } from '../types'
import type { ProgressStack, ShortestPathAlgorithm, SolveOptions } from '../types/algorithm'

export default class DijkstraAlgorithm implements ShortestPathAlgorithm {
  endNode: NodeInterface
  nodes: NodeInterface[] = []
  path: NodeInterface[] = []
  startNode: NodeInterface
  progressStack: ProgressStack[] = []

  constructor(nodes: NodeInterface[]) {
    this.nodes = nodes
  }

  solve(solveOptions: SolveOptions) {
    console.log("running dijkstra")
  }
}
