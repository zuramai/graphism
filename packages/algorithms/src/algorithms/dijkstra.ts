import { NodeInterface } from "graphism";
import { GraphAlgorithm } from ".";
import { ShortestPathAlgorithm, SolveOptions } from "../types";

export default class DijkstraAlgorithm extends GraphAlgorithm implements ShortestPathAlgorithm {
    endNode: NodeInterface;
    
    private openSet: NodeInterface[] = []
    private closedSet: NodeInterface[] = []

    constructor(nodes: NodeInterface[][]) {
        super()
        this.nodes = nodes
    }
    
    
    solve(solveOptions: SolveOptions) {
        this.openSet.push(this.startNode)

        if(this.openSet.length > 0) {
            this.openSet.sort((a,b) => a.gCost - b.gCost)
            
            let currentNode = this.openSet.shift()
            this.closedSet.push(currentNode)

            // Backtracking
            if (currentNode == this.endNode) {
                while(currentNode != this.startNode) {
                    this.path.push(currentNode)
                    currentNode = currentNode.parent
                    // alert("parent is "+currentNode.coordinate.x + ' '+  currentNode.coordinate.y)
                }
            }

            for(let i = 0; i < currentNode.neighbors.length; i++) {
                let neighbor = currentNode.neighbors[i]
                if(this.closedSet.includes(neighbor.node)) 
                    continue

                let cost = currentNode.gCost + 1
                if(cost < neighbor.node.gCost || !this.openSet.includes(neighbor.node)) {
                    neighbor.node.gCost = cost 
                    neighbor.node.parent = currentNode
                    
                    if(!this.openSet.includes(neighbor.node)) {
                        this.openSet.push(neighbor.node)
                    }
                }
            }
        }
    }
}