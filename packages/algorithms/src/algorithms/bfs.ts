import { GraphAlgorithm } from "."
import { SearchAlgorithm, SolveOptions } from "../types"
export default class BFSAlgorithm extends GraphAlgorithm implements SearchAlgorithm {
    findValue: string

    constructor() {
        super()
    }

    solve(solveOptions: SolveOptions) {
        // Unimplemented
    }
}