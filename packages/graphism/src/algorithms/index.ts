import type { NodeInterface } from '../types'
import type { AlgorithmInterface } from '../types/algorithm'
import AStarAlgorithm from './aStar'
import BFSAlgorithm from './bfs'
import DFSAlgorithm from './dfs'
import DijkstraAlgorithm from './dijkstra'
import KruskalAlgorithm from './kruskal'
import PrimAlgorithm from './prim'

export const AvailableAlgorithms = {
  aStar: AStarAlgorithm,
  bfs: BFSAlgorithm,
  dfs: DFSAlgorithm,
  dijkstra: DijkstraAlgorithm,
  prim: PrimAlgorithm,
  kruskal: KruskalAlgorithm,
}

export function newAlgorithm<T extends keyof typeof AvailableAlgorithms>(algorithm: T, nodes: NodeInterface[], startNode: NodeInterface, endNode: NodeInterface): AlgorithmInterface {
  return new AvailableAlgorithms[algorithm](nodes, startNode, endNode)
}
