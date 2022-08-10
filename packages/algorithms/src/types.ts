import type { LineInterface, NodeInterface } from 'graphism'

export interface ProgressStack {
  el: NodeInterface | LineInterface
  status: 'PROGRESS' | 'CANCEL' | 'SUCCESS'
}

export interface AlgorithmInterface {
  nodes: NodeInterface[][]
  startNode: NodeInterface
  path: (NodeInterface|LineInterface)[]

  progressStack: ProgressStack[]

  solve: (solveOptions: SolveOptions) => void
}

export interface ShortestPathAlgorithm {
  endNode: NodeInterface
}

export interface SearchAlgorithm {
  findValue: string
}

export interface SpanningTreeAlgorithm {
}

export interface SolveOptions {
  speed: number
}
