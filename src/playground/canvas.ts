import { Nodee } from "./node"
import { CanvasConfig, CanvasInterface, Coordinate } from "./../types/canvas"

const defaultConfig: CanvasConfig = {
    lineColor: "#555",
    nodeBackground: "white",
    nodeTextColor: "#555",
    canvasBackground: "#ccc"
}

export class Canvas implements CanvasInterface {
    canvas: HTMLCanvasElement
    nodes: Nodee[]
    ctx: CanvasRenderingContext2D;
    dragFrom: Coordinate
    config: CanvasConfig
    
    
    /**
     * Rendering canvas to visualize algorithms
     * @param el Canvas element
     * @param nodes Initial nodes
     * @param config Canvas configuration
     */
    constructor(el: HTMLCanvasElement|string, nodes: Nodee[] = [], config?: CanvasConfig) {
        this.canvas = typeof el == "string" ? document.querySelector<HTMLCanvasElement>("el") : el
        this.ctx = this.canvas.getContext('2d')
        this.nodes = nodes
        this.config = Object.assign(defaultConfig, config)
        this.init()
    }

    generateNodes() {

    }

    init() {
        // Set canvas size
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight


        this.generateNodes()
        this.listener()

        requestAnimationFrame(() => this.render())
    }

    draw() {
        this.drawBackground()
        this.drawLines()
        this.drawNodes()
    }

    drawNodes() {
        for(let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].draw(this.ctx)
        }
    }

    drawBackground() {
        this.ctx.fillStyle = "#eee"
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height)
    }

    drawLines() {
        this.ctx.strokeStyle = "#777"
        
        for(let i = 0; i < this.nodes.length; i++) {
            let node = this.nodes[i]

            for(let j = 0; j < node.neighbors.length; j++) {
                let neighbor = node.neighbors[j]

                this.ctx.beginPath()
                this.ctx.moveTo(node.position.x, node.position.y)
                this.ctx.lineTo(neighbor.node.position.x, neighbor.node.position.y)
                this.ctx.stroke()
                this.ctx.closePath()
            }
        }
    }

    update() {

    }
    
    listener() {
        this.canvas.addEventListener('mousedown', e => {
            let position = this.getCursorPosition(e)

            this.dragFrom = position

            for(let i = 0; i < this.nodes.length; i++) {
                let node = this.nodes[i]

                // if the node is clicked
                if(position.x > node.position.x - node.size &&
                    position.x < node.position.x + node.size &&
                    position.y < node.position.y + node.size &&
                    position.y > node.position.y - node.size ) {
                        console.log('dragging ', node.name)
                        node.movable = true
                        node.moveFrom = {
                            x: node.position.x,
                            y: node.position.y,
                        }

                        console.log('drag from: ', this.dragFrom)
                        console.log('move from: ', node.moveFrom)
                    }
            }
        })
        

        this.canvas.addEventListener('mousemove', e => {
            let position = this.getCursorPosition(e)
            let node;

            for(let i = 0; i < this.nodes.length; i++) {
                node = this.nodes[i]
                
                // if the node is clicked
                if(position.x > node.position.x - node.size &&
                    position.x < node.position.x + node.size &&
                    position.y < node.position.y + node.size &&
                    position.y > node.position.y - node.size ) {
                        this.canvas.style.cursor = 'pointer'
                } else {
                    this.canvas.style.cursor = 'default'
                    
                }

                // Move the node if movable
                if(!this.nodes[i].movable) continue

                let dx = position.x - this.dragFrom.x
                let dy = position.y - this.dragFrom.y
                
                node.position.x = node.moveFrom.x + dx
                node.position.y = node.moveFrom.y + dy
                
            }
        })
        

        this.canvas.addEventListener('mouseup', e => {
            let position = this.getCursorPosition(e)

            for(let i = 0; i < this.nodes.length; i++) {
                if(this.nodes[i].movable) {
                    console.log('stop at', position)
                    console.log('node stop at', this.nodes[i].position)
                }
                this.nodes[i].movable = false
                
            }
        })
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