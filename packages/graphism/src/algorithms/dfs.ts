import type { SearchAlgorithm, SolveOptions } from '../types/algorithm'
import { GraphAlgorithm } from '.'
export default class DFSAlgorithm extends GraphAlgorithm implements SearchAlgorithm {
  findValue: string

  constructor() {
    super()
  }

  solve(solveOptions: SolveOptions) {
    // Unimplemented
  }
}
