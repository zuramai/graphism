import { Coordinate, NodeInterface } from "../types";
import { LineConfig, LineInterface } from "../types/line";
import { distance } from "../utils";
import { Component } from "./abstract";

let defaultLineConfig = {
    color: "#777",
    width: 5,
    hoverColor: "rgba(120, 118, 240, .6)",
    selectedColor: "#2f5ea8",
    text: ""
}

export default class Line extends Component implements LineInterface {
    name: "node" | "line" = "line";
    lineConfig: LineConfig = defaultLineConfig;
    from: NodeInterface
    to: NodeInterface
    isHovered: boolean = false
    isSelected: boolean = false

    constructor(from: NodeInterface, to: NodeInterface, config?: LineConfig) {
        super()
        this.lineConfig = Object.assign(defaultLineConfig, config)
        this.from = from
        this.to = to
    }

    draw(ctx) {
        ctx.strokeStyle = this.lineConfig.color

        if(this.isSelected)
            ctx.strokeStyle = this.lineConfig.selectedColor
        else if(this.isHovered)
            ctx.strokeStyle = this.lineConfig.hoverColor

        ctx.lineWidth = this.lineConfig.width
        ctx.beginPath()
        ctx.moveTo(this.from.position.x, this.from.position.y)
        ctx.lineTo(this.to.position.x, this.to.position.y)
        ctx.stroke()
        ctx.closePath()
    }

    move(x?: number, y?: number) {
        
    }


    isOnCoordinate(point: Coordinate): boolean {
        let is = Math.ceil(distance(this.from.position, point)) + 
            Math.ceil(distance(this.to.position, point)) == Math.ceil(distance(this.from.position, this.to.position)) 
        return is
    }

}