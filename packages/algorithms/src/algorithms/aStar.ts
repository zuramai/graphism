import { NodeInterface } from "graphism"
import { GraphAlgorithm } from "."
import { ShortestPathAlgorithm, SolveOptions } from "../types"
export default class AStarAlgorithm extends GraphAlgorithm implements ShortestPathAlgorithm {
    endNode: NodeInterface

    constructor() {
        super()
    }

    solve(solveOptions: SolveOptions) {
        // Unimplemented
    }
}