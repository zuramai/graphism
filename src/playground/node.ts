import { Coordinate } from "../types/canvas";
import { LineInterface } from "../types/line";
import { NeighborInterface, NodeConfig, NodeInterface } from "../types/node";
import Line from "./line";


let defaultNodeConfig: NodeConfig = {
    backgroundColor: "white",
    shape: "circle",
    size: 50,
    textColor: "#222",
    fontSize: 14
}

export class Nodee implements NodeInterface {
    neighbors?: NeighborInterface[] = [];
    nodeConfig: NodeConfig = defaultNodeConfig
    name: string;
    position: Coordinate
    movable: boolean = false;
    moveFrom: Coordinate;

    constructor(name: string, position: Coordinate, config?: NodeConfig) {
        this.name = name        
        this.position = position
        this.nodeConfig = Object.assign(this.nodeConfig, config)
    }

    addNeighbor(node: Nodee, distance: number, line: Line) {
        this.neighbors.push({
            node,
            distance,
            line
        })
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Create the node shape
        ctx.beginPath()
        ctx.fillStyle = this.nodeConfig.backgroundColor
        ctx.arc(this.position.x, this.position.y, this.nodeConfig.size, 0, Math.PI * 2)
        ctx.strokeStyle = "#aaa"
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.fill()
        ctx.closePath()

        // Draw text
        ctx.fillStyle = this.nodeConfig.textColor
        ctx.font = `${this.nodeConfig.fontSize}px Lora"`
        ctx.fillText(this.name, this.position.x, this.position.y)
        ctx.textAlign = "center"
    }

    move(x?: number, y?: number) {
        if(x) this.position.x = x
        if(y) this.position.y = y

    }

    onHover(callback: Function) {
        callback.call(this)
    }

    
}