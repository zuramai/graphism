import { Nodee } from "./components/node"
import { CanvasConfig, CanvasMode, Coordinate, EventsMap, Hoverable, LineInterface } from "./types"
import { NodeConfig, NodeInterface } from "./types/node"
import { createNanoEvents } from 'nanoevents'
import Line from "./components/line"

const defaultConfig: CanvasConfig = {
    lineColor: "#555",
    nodeBackground: "white",
    nodeTextColor: "#555",
    canvasBackground: "#ccc"
}

export class Graphism {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D;
    nodes: Nodee[] = []
    dragFrom: Coordinate
    isDirectedGraph: boolean = false
    lines: Line[] = []
    selectedNode: Nodee[] = []
    holdingNode: Nodee = null
    mode: CanvasMode = "normal"

    private _hoveredElement: LineInterface|NodeInterface = null
    private _emitter = createNanoEvents<EventsMap>()

    private _runningBorderOffset: number = 0
    
    
    /**
     * Rendering canvas to visualize algorithms
     * @param config The canvas configuration
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

    on<E extends keyof EventsMap>(event: E, callback: any, once: boolean = false) {
        const unbind =  this._emitter.on(event, (...args) => {
            if(once) unbind()
            callback(...args)
        })
        return unbind
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


        if(["creating", "connecting"].includes(this.mode)) {
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
            this.mode = "creating"

            this.canvas.addEventListener('click', e => {
                let position = this.getCursorPosition(e)
                resolve(position)
            }, { once: true })
        })
    }

    createNode(name: string, coordinate: Coordinate,  config?: NodeConfig): Nodee {
        let node = new Nodee(name, coordinate, config)
        this.nodes.push(node)

        this._emitter.emit("node:created", node)
        this.setMode('normal')
        this.clearSelectedNode()

        console.log("creating new node ", name," at ", coordinate)

        return node
    }

    clearSelectedNode() {
        for(let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].isSelected = false
            this.nodes[i].mode = "normal"
            this.nodes[i].movable = false
        }
        this.selectedNode = []
        console.log('clearing selected node')
    }

    setMode(mode: CanvasMode) {
        this.mode = mode

        switch (mode) {
            case "connecting":
                this.clearSelectedNode()
                this.on("node:click", (node1: NodeInterface) => {
                    this.on("node:click", (node2: NodeInterface) => {
                        this.addNodeNeighbor(node1, node2, 0)
                        this.clearSelectedNode()
                        this.mode = "normal"
                    }, true)
                }, true)
                break;
            default:
                break;
        }
    }

    addNodeNeighbor(from: NodeInterface, to: NodeInterface, distance: number) {
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
        for(let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].update()
        }
        if(["creating", "connecting"].includes(this.mode)) {
            this._runningBorderOffset++
        }
    }
    

    private mouseUp(e: MouseEvent) {
        this.holdingNode = null

        console.log("Mouseup ", this.selectedNode)
    }

    private mouseDown(e: MouseEvent) {
        let position = this.getCursorPosition(e)
        console.log('mousedown')

        this.dragFrom = position

        for(let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i]

            // if the node is clicked
            if(node.isOnCoordinate(position))  {
                this.holdingNode = node
                node.moveFrom = {
                    x: node.position.x,
                    y: node.position.y,
                }

                for(let j = 0; j < this.selectedNode.length; j++) {
                    let s = this.selectedNode[j]
                    s.moveFrom = {
                        x: s.position.x,
                        y: s.position.y,
                    }
                }

            }
        }
    }

    private mouseMove(e: MouseEvent) {
        let position = this.getCursorPosition(e)
        let node: Nodee;
        let line: LineInterface;
        if(this._hoveredElement != null) {
            this._hoveredElement.isHovered = false
            this._hoveredElement = null
        }
        this.canvas.style.cursor = 'grab'

        // Change cursor on node hover
        if(node = this.nodes.find(node => node.isOnCoordinate(position))) {
            this.canvas.style.cursor = 'pointer'
            this._emitter.emit("node:mouseover", node)
            this._hoveredElement = node
            node.isHovered = true
        } else if (line = this.lines.find(line => line.isOnCoordinate(position))) {
            // Change cursor on line hover
            this.canvas.style.cursor = 'pointer'
            this._emitter.emit("line:mouseover", line)
            this._hoveredElement = line
            line.isHovered = true
            console.log("checking line")
        } 
        
        if(!this.nodes.length) return
        let dx = position.x - this.dragFrom.x
        let dy = position.y - this.dragFrom.y

        console.log("Move dx = ", dx, " dy", dy)

        if(!this.holdingNode) return

        // If selected more than one nodes and move the selected node
        if(this.selectedNode.length > 1 && this.holdingNode.isSelected) {
            for(let i = 0; i < this.selectedNode.length; i++) {
                node = this.nodes[i]
                node.move(node.moveFrom.x + dx, node.moveFrom.y + dy)    
            }            
        } else {
            // Just move the holding node
            node = this.holdingNode
            node.move(node.moveFrom.x + dx, node.moveFrom.y + dy)
        }
    }
    private mouseClick(e: MouseEvent) {
        let position = this.getCursorPosition(e)

        // If the click is instant click (not moving or dragging)
        if(position.x == this.dragFrom.x && position.y == this.dragFrom.y) {
            this._emitter.emit('canvas:click', position)
            let isNodeClicked = false            

            // Check if a node is clicked
            for(let i = this.nodes.length-1; i >= 0; i--) {
                let node = this.nodes[i]

                if(node.isOnCoordinate(position)) {
                    if(!e.ctrlKey) this.clearSelectedNode()
                    this.selectNode(node, this.mode)
                    isNodeClicked = true
                    this._emitter.emit("node:click", node)
                    break
                }
            }

            if(!isNodeClicked) this.clearSelectedNode()

        }
    }

    selectNode(node: Nodee, mode: CanvasMode = "normal") {
        node.select()
        node.mode = !node.isSelected ? "normal" : mode
        this.selectedNode.push(node)
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

}

export * from "./types"
export function createGraphism(config?: CanvasConfig): Graphism {
    return new Graphism(config)
}