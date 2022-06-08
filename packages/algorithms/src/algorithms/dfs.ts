import { GraphAlgorithm } from "."
import { SearchAlgorithm, SolveOptions } from "../types"
export default class DFSAlgorithm extends GraphAlgorithm implements SearchAlgorithm {
    findValue: string

    constructor() {
        super()
    }

    solve(solveOptions: SolveOptions) {
        // Unimplemented
    }
}