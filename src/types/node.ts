import { Coordinate } from "./canvas";

export interface NodeInterface {
    neighbors?: NeighborInterface[]
    name: string
    position: Coordinate
    size: number
    movable: boolean
    moveFrom: Coordinate
    
    draw: (ctx: CanvasRenderingContext2D) => void
    addNeighbor: (node: NodeInterface, distance: number) => void
}

export interface NeighborInterface {
    node: NodeInterface
    distance: number
}
