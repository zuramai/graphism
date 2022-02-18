import { createNanoEvents } from "nanoevents";
import { Coordinate, EventsMap, NodeEventsMap } from "../types";
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
    hoverBorderSize: 10,
    hoverBorderColor: 'rgba(57, 138, 185, .2)'
}

export class Nodee implements NodeInterface {
    neighbors?: NeighborInterface[] = [];
    nodeConfig: NodeConfig = defaultNodeConfig
    name: string;
    position: Coordinate
    movable: boolean = false;
    moveFrom: Coordinate;
    private _emitter = createNanoEvents<NodeEventsMap>()

    constructor(name: string, position: Coordinate, config?: NodeConfig) {
        this.name = name        
        this.position = position
        this.nodeConfig = Object.assign(this.nodeConfig, config)
    }

    on<E extends keyof NodeEventsMap>(event: E, callback: NodeEventsMap[E]) {
        return this._emitter.on(event, callback)
    }

    addNeighbor(node: Nodee, distance: number, line: LineInterface) {
        this.neighbors.push({
            node,
            distance,
            line
        })
    }

    draw(ctx: CanvasRenderingContext2D) {

        // Outer border
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.nodeConfig.size , 0, Math.PI * 2)
        ctx.strokeStyle = this.nodeConfig.hoverBorderColor
        ctx.lineWidth = this.nodeConfig.hoverBorderSize
        ctx.stroke()
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