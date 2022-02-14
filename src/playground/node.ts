import { Coordinate } from "../types/canvas";
import { NeighborInterface, NodeInterface } from "../types/node";

export class Nodee implements NodeInterface {
    neighbors?: NeighborInterface[];
    name: string;
    x: number
    y: number
    size: 50
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
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }

    
}