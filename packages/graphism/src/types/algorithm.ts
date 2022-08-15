import type { LineInterface } from './line'
import type { NodeInterface } from './node'

export interface ProgressStack {
  el: NodeInterface | LineInterface
  status: 'PROGRESS' | 'CANCEL' | 'SUCCESS'
}

export interface AlgorithmInterface {
  nodes: NodeInterface[]
  startNode: NodeInterface
  path: (NodeInterface | LineInterface)[]

  progressStack: ProgressStack[]

  solve: (solveOptions: SolveOptions) => void
}

export interface ShortestPathAlgorithm extends AlgorithmInterface {
  endNode: NodeInterface
}

export interface SearchAlgorithm extends AlgorithmInterface {
  findValue: string
}

export interface SpanningTreeAlgorithm {
}

export interface SolveOptions {
  speed: number
}
