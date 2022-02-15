import {NodeInterface} from "./node"


export interface Coordinate {
    x: number
    y: number
}

export interface CanvasConfig {
    canvasBackground?: string
    lineColor?: string 
    nodeBackground?: string
    nodeTextColor?: string
}