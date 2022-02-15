import { Coordinate } from "../types/canvas";
import { NeighborInterface, NodeInterface } from "../types/node";

export class Nodee implements NodeInterface {
    neighbors?: NeighborInterface[] = [];
    name: string;
    position: Coordinate
    size: number = 50
    movable: boolean = false;
    moveFrom: Coordinate;

    constructor(name: string) {
        this.name = name        
    }

    addNeighbor(node: NodeInterface, distance: number) {
        this.neighbors.push({
            node,
            distance
        })
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "transparent"       
        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
        ctx.strokeStyle = "#aaa"

        ctx.lineWidth = 3
        ctx.stroke()
        ctx.fill()
        ctx.closePath()

        // Draw text
        ctx.fillStyle = "#444"
        ctx.font = "14px Lora"
        ctx.fillText(this.name, this.position.x, this.position.y)
        ctx.textAlign = "center"
    }

    
}