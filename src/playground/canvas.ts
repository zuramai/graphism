import { Nodee } from "./node"
import { CanvasInterface, Coordinate } from "./../types/canvas"


export class Canvas implements CanvasInterface {
    canvas: HTMLCanvasElement
    nodes: Nodee[]
    ctx: CanvasRenderingContext2D;
    dragFrom: Coordinate
    
    
    /**
     * Rendering canvas to visualize algorithms
     * @param nodes Initial nodes
     */
    constructor(el: HTMLCanvasElement|string, nodes: Nodee[] = []) {
        this.canvas = typeof el == "string" ? document.querySelector<HTMLCanvasElement>("el") : el
        this.ctx = this.canvas.getContext('2d')
        this.nodes = nodes
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
                    }
            }
        })
        

        this.canvas.addEventListener('mousemove', e => {
            let position = this.getCursorPosition(e)

            for(let i = 0; i < this.nodes.length; i++) {
                let node = this.nodes[i]
                
                // if the node is clicked
                if(position.x > node.position.x - node.size &&
                    position.x < node.position.x + node.size &&
                    position.y < node.position.y + node.size &&
                    position.y > node.position.y - node.size ) {

                }

                // Move the node if movable
                if(!this.nodes[i].movable) continue

                let dx = position.x - this.dragFrom.x
                let dy = position.y - this.dragFrom.y

                let node = this.nodes[i]
                
                node.position.x = node.moveFrom.x + dx
                node.position.y = node.moveFrom.x + dy
                
            }
        })
        

        this.canvas.addEventListener('mouseup', e => {
            for(let i = 0; i < this.nodes.length; i++) {
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
        setTimeout(() => requestAnimationFrame(() => this.render()), 100)
    }

    solve() {

    }
}