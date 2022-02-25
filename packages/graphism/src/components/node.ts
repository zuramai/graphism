import { createNanoEvents } from "nanoevents";
import { CanvasMode, Coordinate, EventsMap, NodeEventsMap } from "../types";
import { LineInterface } from "../types/line";
import { NeighborInterface, NodeConfig, NodeInterface } from "../types/node";


let defaultNodeConfig: NodeConfig = {
    backgroundColor: "white",
    borderColor: "#ddd",
    borderSize: 2,
    shape: "circle",
    size: 50,
    textColor: "#222",
    fontSize: 22,
    hoverBorderSize: 2,
    hoverBorderColor: 'rgba(120, 118, 240, .6)',
    hoverFillColor: 'rgba(120, 118, 240, .3)'
}

export class Nodee implements NodeInterface {
    neighbors?: NeighborInterface[] = [];
    nodeConfig: NodeConfig = defaultNodeConfig
    name: string;
    position: Coordinate
    movable: boolean = false;
    moveFrom: Coordinate;
    isHovered = false
    isSelected = false
    mode:CanvasMode = "normal"
    
    _borderOffset = 0
    

    constructor(name: string, position: Coordinate, config?: NodeConfig) {
        this.name = name        
        this.position = position
        this.nodeConfig = Object.assign(this.nodeConfig, config)
    }

    addNeighbor(node: Nodee, distance: number, line: LineInterface) {
        // If the neighbor already exists
        if(this.neighbors.find(n => n.node == node)) return

        this.neighbors.push({
            node,
            distance,
            line
        })
    }

    draw(ctx: CanvasRenderingContext2D) {

        // Hover state outer border 
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.nodeConfig.size + 5, 0, Math.PI * 2)
        ctx.strokeStyle = this.nodeConfig.hoverBorderColor
        ctx.fillStyle = this.nodeConfig.hoverFillColor
        ctx.lineWidth = this.nodeConfig.hoverBorderSize
        ctx.setLineDash(this.mode == "connecting" ? [50,10] : [0])
        ctx.lineDashOffset = this._borderOffset
        if(this.isHovered && !this.isSelected) ctx.fill()
        if(this.isSelected) ctx.stroke()
        ctx.closePath()

        // Create the node shape
        ctx.beginPath()
        ctx.fillStyle = this.nodeConfig.backgroundColor
        ctx.arc(this.position.x, this.position.y, this.nodeConfig.size, 0, Math.PI * 2)
        ctx.strokeStyle = this.nodeConfig.borderColor
        ctx.lineWidth = this.nodeConfig.borderSize
        ctx.stroke()
        ctx.fill()
        ctx.closePath()

        // Draw text
        ctx.fillStyle = this.nodeConfig.textColor
        ctx.font = `${this.nodeConfig.fontSize}px Lora"`
        ctx.fillText(this.name, this.position.x, this.position.y)
        ctx.textAlign = "center"
    }

    update() {
        this._borderOffset++
    }

    select() {
        this.isSelected = !this.isSelected

        if(!this.isSelected) this._borderOffset = 0
    }

    move(x?: number, y?: number) {
        if(x) this.position.x = x
        if(y) this.position.y = y
    }

    isOnCoordinate(coordinate: Coordinate): boolean {
        if(coordinate.x > this.position.x - this.nodeConfig.size &&
            coordinate.x <= this.position.x + this.nodeConfig.size &&
            coordinate.y > this.position.y - this.nodeConfig.size &&
            coordinate.y <= this.position.y + this.nodeConfig.size) {
                return true
            }
        return false
    }
}