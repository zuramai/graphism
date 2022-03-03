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
            // this.openSet.sort((a,b) => a.gCost - b.gCost)
            this.openSet.sort((a,b) => this.fscore(a, endNode) - this.fscore(b, endNode))
            let currentNodeInterface = this.openSet.shift()
            this.closedSet.push(currentNodeInterface)

            if (currentNodeInterface == endNode) {
                while(currentNodeInterface != startNode) {
                    this.path.push(currentNodeInterface)
                    currentNodeInterface = currentNodeInterface.parent
                    // alert("parent is "+currentNodeInterface.coordinate.x + ' '+  currentNodeInterface.coordinate.y)
                }
                return this.finish()
               
            }

            for(let i = 0; i < currentNodeInterface.neighbors.length; i++) {
                let neighbor = currentNodeInterface.neighbors[i]
                if(neighbor.status == NodeInterfaceStatus.WALL || this.closedSet.includes(neighbor)) 
                    continue

                let cost = currentBlock.gCost + 1
                if(cost < neighbor.gCost || !this.openSet.includes(neighbor)) {
                    neighbor.gCost = cost 
                    neighbor.parent = currentBlock
                    
                    if(!this.openSet.includes(neighbor)) {
                        
                        this.openSet.push(neighbor)
                    }
                }
            }
        }
    }

    private fscore(from: NodeInterface, to: NodeInterface) {
        let g = from.gCost + to.distance;
        let h = this.heuristicDistance(to,from)

        return g + h
    }

    private heuristicDistance(from: NodeInterface, to: NodeInterface) {
        return Math.sqrt(
            Math.abs(to.coordinate.x - from.coordinate.x) ** 2 + 
            Math.abs(to.coordinate.y - from.coordinate.y) ** 2
        )
    }
}