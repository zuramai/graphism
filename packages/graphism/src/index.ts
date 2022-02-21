import { Nodee } from "./components/node"
import { CanvasConfig, Coordinate, EventsMap } from "./types"
import { NodeConfig } from "./types/node"
import { createNanoEvents } from 'nanoevents'
import Line from "./components/line"

const defaultConfig: CanvasConfig = {
    lineColor: "#555",
    nodeBackground: "white",
    nodeTextColor: "#555",
    canvasBackground: "#eee"
}

export class Graphism {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D;
    nodes: Nodee[] = []
    dragFrom: Coordinate
    isDirectedGraph: boolean = false
    lines: Line[] = []
    selectedNode: Node[] = []

    private _hoveredNode: Nodee = null
    private _emitter = createNanoEvents<EventsMap>()

    private _runningBorder: boolean = false
    private _runningBorderOffset: number = 0
    
    
    /**
     * Rendering canvas to visualize algorithms
     * @param el Canvas element
     * @param nodes Initial nodes
     * @param config Canvas configuration
     */
    constructor(public config: CanvasConfig = {}) {
        this.config = Object.assign(defaultConfig, config)
        this.mount(config.el)
    }

    resolveSelector<T>(selector: string | T | null | undefined): T | null {
        if (typeof selector === 'string')
          return document.querySelector(selector) as unknown as T
        else
          return selector || null
    }

    mount(el: string | HTMLCanvasElement) {
        if (this.canvas)
            throw new Error('[graphism] already mounted, unmount previous target first')

        this.canvas = this.resolveSelector(el)
        
        if (!this.canvas)
            throw new Error('[graphism] target element not found')

        this.ctx = this.canvas.getContext('2d')

        // Set canvas size
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight

        // Event listeners
        this.canvas.addEventListener('mousedown', this.mouseDown.bind(this))
        this.canvas.addEventListener('mousemove', this.mouseMove.bind(this))
        this.canvas.addEventListener('mouseup', this.mouseUp.bind(this))
        this.canvas.addEventListener('click', this.mouseClick.bind(this))

        this._emitter.emit("mounted")

        requestAnimationFrame(() => this.render())
    }

    on<E extends keyof EventsMap>(event: E, callback: EventsMap[E]) {
        return this._emitter.on(event, callback)
    }

    /**
     * Generate node at random points
     * @param canvas Canvas instance
     * @returns A set of nodes
     */
    generateGraph() {
         // Create new node
        const nodeJakarta = this.createNode("Jakarta", { x: 130, y: 274 })
        const nodeBandung = this.createNode("Bandung", { x: 390, y: 200 })

        this.addNodeNeighbor(nodeBandung, nodeJakarta, 100)
        this.addNodeNeighbor(nodeJakarta, nodeBandung, 100)

        const nodes = [nodeJakarta, nodeBandung]

        this.nodes = nodes

        return nodes
    }

    private draw() {
        this.drawBackground()
        this.drawLines()
        this.drawNodes()
    }

    private drawLines() {
        for(let i = 0; i < this.lines.length; i++) {
            this.lines[i].draw(this.ctx)
        }
    }

    private drawNodes() {
        for(let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw(this.ctx)
        }
    }

    private drawBackground() {
        // Background
        if(typeof this.config.canvasBackground == 'string' || this.config.canvasBackground instanceof CanvasPattern) {
            this.ctx.fillStyle = this.config.canvasBackground
            this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height)
        } else if (this.config.canvasBackground instanceof HTMLImageElement) 
            this.ctx.drawImage(this.config.canvasBackground, 0, 0, this.canvas.width, this.canvas.height)


        if(this._runningBorder) {
            // Running border

            this.ctx.save()
            this.ctx.beginPath()

            this.ctx.strokeStyle = "rgb(120, 118, 240)"
            this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.lineWidth = 10
            this.ctx.setLineDash([0, 25, 50])
            this.ctx.lineDashOffset = this._runningBorderOffset
            this.ctx.stroke()

            this.ctx.closePath()

            this.ctx.restore()
        }
    }

    
    waitingForClick(): Promise<Coordinate> {
        return new Promise((resolve) => {
            this._runningBorder = true
            this.canvas.addEventListener('click', e => {
                let position = this.getCursorPosition(e)
                this._runningBorder = false
                resolve(position)
            })
        })
    }

    createNode(name: string, coordinate: Coordinate,  config?: NodeConfig): Nodee {
        let node = new Nodee(name, coordinate, config)
        this.nodes.push(node)

        this._emitter.emit("node:created", node)

        console.log("creating new node ", name," at ", coordinate)

        return node
    }

    addNodeNeighbor(from: Nodee, to: Nodee, distance: number) {
        let line: Line

        // Check if the line exists from the other way around
        let createdLine = this.lines.find(l => 
            (l.from == from && l.to == to) ||
            (l.from == to && l.to == from) 
        )

        if(createdLine) {
            line = createdLine
        } else {
            line = new Line(from, to, {})
            this.lines.push(line)
        }

        from.addNeighbor(to, distance, line)

        if(!this.isDirectedGraph)
            to.addNeighbor(from, distance, line)

        this._emitter.emit("node:connect", from, to)
    }

    private update() {
        if(this._runningBorder) {
            this._runningBorderOffset++
        }
    }
    

    private mouseUp(e: MouseEvent) {
        let position = this.getCursorPosition(e)
        console.log(e)

        for(let i = 0; i < this.nodes.length; i++) {
            if(this.nodes[i].movable) {
                console.log('stop at', position)
                console.log('node stop at', this.nodes[i].position)
            }
            this.nodes[i].movable = false
            
        }
    }

    private mouseDown(e: MouseEvent) {
        let position = this.getCursorPosition(e)

        this.dragFrom = position

        for(let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i]

            // if the node is clicked
            if(node.isOnCoordinate(position))  {
                node.movable = true
                node.moveFrom = {
                    x: node.position.x,
                    y: node.position.y,
                }

            }
        }
    }

    private mouseMove(e: MouseEvent) {
        let position = this.getCursorPosition(e)
        let node: Nodee;

        // Change cursor on node hover
        if(node = this.nodes.find(node => node.isOnCoordinate(position))) {
            this.canvas.style.cursor = 'pointer'
            this._emitter.emit("node:mouseover", node)
            this._hoveredNode = node
            node.isHovered = true
        } else {
            if(this.canvas.style.cursor == 'pointer') {
                this._hoveredNode.isHovered = false
                this._emitter.emit("node:mouseleave", this._hoveredNode) 
            }
            this.canvas.style.cursor = 'grab'
        }

        for(let i = 0; i < this.nodes.length; i++) {
            node = this.nodes[i]

            // Move the node if movable
            if(!this.nodes[i].movable) continue

            let dx = position.x - this.dragFrom.x
            let dy = position.y - this.dragFrom.y
            
            node.move(node.moveFrom.x + dx, node.moveFrom.y + dy)
        }
    }
    private mouseClick(e: MouseEvent) {
        let position = this.getCursorPosition(e)
        let node: Nodee = null;

        // Check if a node is clicked
        for(let i = this.nodes.length-1; i >= 0; i--) {
            node = this.nodes[i]
            if(node.isOnCoordinate(position)) {
                node.isActive = !node.isActive
                break
            }
        }
    }

    
    getCursorPosition(e) {
        let rect = this.canvas.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y:  e.clientY - rect.top,
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.draw()
        this.update()
        requestAnimationFrame(() => this.render())
    }

    solve() {

    }
}

export function createGraphism(config?: CanvasConfig): Graphism {
    return new Graphism(config)
}