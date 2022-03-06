import { Component } from ".";
import { NodeInterface } from "./node";

export interface LineConfig {
    color?: string
    hoverColor?: string
    width?: number
    text?: string
}

export interface LineInterface extends Component {
    lineConfig?: LineConfig
    from: NodeInterface
    to: NodeInterface
    isHovered: boolean 
    draw: (ctx: CanvasRenderingContext2D) => void
}


export interface LineEventsMap {
    "line:mouseover": (line: LineInterface) => void
}
