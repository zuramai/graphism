import { ComponentInterface } from ".";
import { NodeInterface } from "./node";

export interface LineConfig {
    color?: string
    hoverColor?: string
    selectedColor?: string
    width?: number
    text?: string
}

export interface LineInterface extends ComponentInterface {
    lineConfig?: LineConfig
    from: NodeInterface
    to: NodeInterface
    isHovered: boolean 
    draw: (ctx: CanvasRenderingContext2D) => void
}


export interface LineEventsMap {
    "line:select": (line: LineInterface) => void
    "line:deselect": (line: LineInterface) => void
    "line:clearSelect": () => void
    "line:mouseover": (line: LineInterface) => void
}
