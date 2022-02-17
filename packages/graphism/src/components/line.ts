import { LineConfig, LineInterface } from "../types/line";
import { Nodee } from "./node";

let defaultLineConfig = {
    color: "#777",
    width: 2,
    text: ""
}

export default class Line implements LineInterface {
    lineConfig: LineConfig = defaultLineConfig;
    from: Nodee
    to: Nodee

    constructor(from: Nodee, to: Nodee, config?: LineConfig) {
        this.lineConfig = config
        this.from = from
        this.to = to
    }

    draw(ctx) {
        ctx.strokeStyle = this.lineConfig.color
        ctx.lineWidth = this.lineConfig.width
        ctx.beginPath()
        ctx.moveTo(this.from.position.x, this.from.position.y)
        ctx.lineTo(this.to.position.x, this.to.position.y)
        ctx.stroke()
        ctx.closePath()
    }
}