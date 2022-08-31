import type { ProgressStack, SolveOptions, SpanningTreeAlgorithm } from '../types/algorithm'
import type { NodeInterface } from '../types'
export default class KruskalAlgorithm implements SpanningTreeAlgorithm {
  nodes: NodeInterface[] = []
  path: NodeInterface[] = []
  startNode: NodeInterface
  progressStack: ProgressStack[] = []
  constructor() {
  }

  solve(_: SolveOptions) {
    // Unimplemented
    return []
  }
}
