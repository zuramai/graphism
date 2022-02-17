import { Coordinate } from "./canvas";
import { LineInterface } from "./line";

export interface NodeInterface {
    neighbors?: NeighborInterface[]
    name: string
    position: Coordinate
    nodeConfig: NodeConfig
    movable: boolean
    moveFrom: Coordinate
    
    move: (x?: number, y?: number) => void
    draw: (ctx: CanvasRenderingContext2D) => void
    addNeighbor: (node: NodeInterface, distance: number, line: LineInterface) => void
    isOnCoordinate: (coordinate: Coordinate) => boolean
}

export interface NeighborInterface {
    node: NodeInterface
    distance: number
    line: LineInterface
}


export interface NodeConfig {
    backgroundColor?: string
    shape?: "circle" | "square"
    size?: number
    textColor?: string
    fontSize?: number
}