import { NodeInterface } from "graphism"
import { AlgorithmInterface } from "./../types"

export class PrimAlgorithm implements AlgorithmInterface {
    startNode: NodeInterface
    endNode: NodeInterface 
    nodes: NodeInterface[][] = []
    path: NodeInterface[] = []
    progressStack = []

    constructor() {

    }

    solve() {

    }
}