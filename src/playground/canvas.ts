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
        this.generateNodes()

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
        this.canvas.addEventListener('dragstart', e => {
            let position = this.getCursorPosition(e)

            for(let i = 0; i < this.nodes.length; i++) {
                let node = this.nodes[i]

                // if the node is clicked
                if(position.x > node.x - node.size &&
                    position.x < node.x + node.size &&
                    position.y < node.y + node.size &&
                    position.y > node.y - node.size ) {
                        node.movable = true
                        node.moveFrom = {
                            x: node.x,
                            y: node.y,
                        }
                    }
            }
        })

        this.canvas.addEventListener('dragover', e => {
            for(let i = 0; i < this.nodes.length; i++) {
                if(!this.nodes[i].movable) continue
                
                
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
        this.draw()
        this.update()
        setTimeout(() => requestAnimationFrame(() => this.render()), 100)
    }

    solve() {

    }
}