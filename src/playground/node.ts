import { Coordinate } from "../types/canvas";
import { NeighborInterface, NodeConfig, NodeInterface } from "../types/node";
import Line from "./line";


let defaultNodeConfig: NodeConfig = {
    backgroundColor: "white",
    shape: "circle",
    size: 2,
    textColor: "#222"
}

export class Nodee implements NodeInterface {
    neighbors?: NeighborInterface[] = [];
    nodeConfig: NodeConfig = defaultNodeConfig
    name: string;
    position: Coordinate
    size: number = 50
    movable: boolean = false;
    moveFrom: Coordinate;

    constructor(name: string, position: Coordinate, config?: NodeConfig) {
        this.name = name        
        this.position = position
        this.nodeConfig = Object.assign(this.nodeConfig, config)
    }

    addNeighbor(node: Nodee, distance: number) {
        let line = new Line(
            this,
            node,
            {}
            )
        this.neighbors.push({
            node,
            distance,
            line
        })
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Draw adjacent line
        for(let i = 0; i < this.neighbors.length; i++) {
            this.neighbors[i].line.draw(ctx)
        }

        // Create the node shape
        ctx.beginPath()
        ctx.fillStyle = this.nodeConfig.backgroundColor
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
        ctx.strokeStyle = "#aaa"
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.fill()
        ctx.closePath()

        // Draw text
        ctx.fillStyle = this.nodeConfig.textColor
        ctx.font = "14px Lora"
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