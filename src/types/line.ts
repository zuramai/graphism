import { Nodee } from "../playground/node";
import { Coordinate } from "./canvas";

export interface LineConfig {
    color?: string
    width?: number
    text?: string
}

export interface LineInterface {
    lineConfig?: LineConfig
    from: Nodee
    to: Nodee

    draw: (ctx: CanvasRenderingContext2D) => void
}