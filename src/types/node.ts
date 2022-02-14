import { Coordinate } from "./canvas";

export interface NodeInterface {
    neighbors?: NeighborInterface[]
    name: string
    x: number
    y: number
    size: 50
    movable: boolean
    moveFrom: Coordinate
    
    draw: (ctx: CanvasRenderingContext2D) => void
    addNeighbor: (node: NodeInterface, distance: number) => void
}

export interface NeighborInterface {
    node: NodeInterface
    distance: number
}
