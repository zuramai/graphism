import { NodeInterface } from "graphism";
import { AlgorithmInterface, ProgressStack, SolveOptions } from "../types";
import AStarAlgorithm from "./aStar";
import BFSAlgorithm from "./bfs";
import DFSAlgorithm from "./dfs";
import DijkstraAlgorithm from "./dijkstra";
import KruskalAlgorithm from "./kruskal";
import PrimAlgorithm from "./prim";


const AvailableAlgorithms = {
    "aStar": AStarAlgorithm,
    "bfs": BFSAlgorithm,
    "dfs": DFSAlgorithm,
    "dijkstra": DijkstraAlgorithm,
    "prim": PrimAlgorithm,
    "kruskal": KruskalAlgorithm,
}

export abstract class GraphAlgorithm implements AlgorithmInterface {
    nodes: NodeInterface[][] = []
    path: NodeInterface[] = []
    startNode: NodeInterface
    progressStack: ProgressStack[] = []

    abstract solve(solveOptions: SolveOptions): void

    static new<T extends keyof typeof AvailableAlgorithms>(nodes: NodeInterface[][], algorithm: T): GraphAlgorithm {
        return new AvailableAlgorithms[algorithm](nodes)
    }
}