import { CanvasMode, ComponentInterface, Coordinate } from ".";
import { LineInterface } from "./line";

export interface NodeInterface extends ComponentInterface {
    text: string
    neighbors?: NeighborInterface[]
    mode: CanvasMode
    position: Coordinate
    nodeConfig: NodeConfig
    movable: boolean
    moveFrom: Coordinate

    // Backtracking purpose
    parent: NodeInterface

    
    move: (x?: number, y?: number) => void
    update: () => void
    select: () => void
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
    fontFamily?: string
    borderColor?: string
    borderSize?: number
    hoverBorderColor?: string
    hoverBorderSize?: number
    hoverBackgroundColor?: string
}

export interface NodeEventsMap {
    "node:created": (node: NodeInterface) => void
    "node:move": (node: NodeInterface) => void
    "node:mouseover": (node: NodeInterface) => void
    "node:mouseleave": (node: NodeInterface) => void
    "node:click": (node: NodeInterface) => void
    "node:connect": (node1: NodeInterface, node2: NodeInterface) => void
}