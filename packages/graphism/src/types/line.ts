import { NodeInterface } from "./node";

export interface LineConfig {
    color?: string
    width?: number
    text?: string
}

export interface LineInterface {
    lineConfig?: LineConfig
    from: NodeInterface
    to: NodeInterface

    draw: (ctx: CanvasRenderingContext2D) => void
}