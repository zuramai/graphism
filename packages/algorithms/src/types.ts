import { NodeInterface, LineInterface } from "graphism"

export interface ProgressStack {
    el: NodeInterface | LineInterface
    status: "PROGRESS" | "CANCEL" | "SUCCESS"
}

export interface AlgorithmInterface {
    nodes: NodeInterface[][]
    startNode: NodeInterface
    path: NodeInterface[]
    
    progressStack: ProgressStack[]

    solve: (solveOptions: SolveOptions) => void
}

export interface ShortestPathAlgorithm {
    searchValue: string
    endNode: NodeInterface
}

export interface SearchAlgorithm {
    findValue: NodeList
}

export interface SolveOptions {
    speed: number
}