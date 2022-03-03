import { NodeInterface, LineInterface } from "graphism"

export interface AlgorithmInterface {
    nodes: NodeInterface[][]
    startNode: NodeInterface
    endNode: NodeInterface
    path: NodeInterface[]
    
    progressStack: {
        el: NodeInterface | LineInterface
        status: "PROGRESS" | "CANCEL" | "SUCCESS"
    }[]

    solve: (startNode: NodeInterface, endNode: NodeInterface, speed: number) => void
}