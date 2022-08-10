import type { SearchAlgorithm, SolveOptions } from '../types'
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
