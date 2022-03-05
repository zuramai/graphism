import { AlgorithmInterface } from "..";
import { NodeInterface } from "graphism";

export default class AStarAlgorithm implements AlgorithmInterface{
    startNode: NodeInterface
    endNode: NodeInterface 
    nodes: NodeInterface[][] = []
    path: NodeInterface[] = []
    progressStack = []

    private openSet: NodeInterface[] = []
    private closedSet: NodeInterface[] = []

    constructor(nodes: NodeInterface[][]) {
        this.nodes = nodes
    }
    
    solve(startNode: NodeInterface, endNode: NodeInterface, speed: number) {
        
    }

}