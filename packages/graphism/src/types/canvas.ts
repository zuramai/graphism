export interface Coordinate {
    x: number
    y: number
}

export interface CanvasConfig {
    el?: HTMLCanvasElement | string,
    canvasBackground?: string
    lineColor?: string 
    nodeBackground?: string
    nodeTextColor?: string
}