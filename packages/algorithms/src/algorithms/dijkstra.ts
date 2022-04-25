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
        this.openSet.push(startNode)

        if(this.openSet.length > 0) {
            this.openSet.sort((a,b) => a.gCost - b.gCost)
            
            let currentNode = this.openSet.shift()
            this.closedSet.push(currentNode)

            if (currentNode == endNode) {
                while(currentNode != startNode) {
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

    // private fscore(from: NodeInterface, to: NeighborInterface) {
    //     let g = from.gCost + to.distance;
    //     return g 
    // }
}