import type { ProgressStack, SearchAlgorithm, SolveOptions } from '../types/algorithm'
import type { NodeInterface } from '../types'
export default class DFSAlgorithm implements SearchAlgorithm {
  findValue: string
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
