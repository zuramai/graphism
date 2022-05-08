import { NodeEventsMap } from "./node"
import { LineEventsMap } from "./line"

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

export interface EventsMap extends NodeEventsMap, LineEventsMap {
    start: () => void
    end: () => void
    grab: () => void
    mounted: () => void
    unmounted: () => void
    error: (message: string) => void

    "canvas:click": (coordinate: Coordinate) => void
}

export interface ComponentInterface {
    isHovered: boolean
    isSelected: boolean
    moveFrom: Coordinate
    name:  "node" | "line"

    isOnCoordinate: (point: Coordinate) => boolean 
    move: (x?: number, y?: number) => void
}