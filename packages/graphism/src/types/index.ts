import { NodeEventsMap } from "./node"

export * from "./algorithm"
export * from "./line"
export * from "./node"

export interface Coordinate {
    x: number
    y: number
}

export interface CanvasConfig {
    el?: HTMLCanvasElement | string,
    canvasBackground?: string | CanvasPattern | HTMLImageElement
    lineColor?: string 
    nodeBackground?: string
    nodeTextColor?: string
}

export type CanvasMode = "normal" | "connecting" | "creating"

export interface EventsMap extends NodeEventsMap {
    start: () => void
    end: () => void
    grab: () => void
    mounted: () => void
    unmounted: () => void

    "canvas:click": (coordinate: Coordinate) => void
}