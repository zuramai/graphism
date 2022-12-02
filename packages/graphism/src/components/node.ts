import type { Mode, Coordinate } from '../types'
import type { LineInterface } from '../types/line'
import type { NeighborInterface, NodeConfig, NodeInterface } from '../types/node'
import { createElementNS } from '../utils/dom'
import { Component } from './abstract'

const defaultNodeConfig: NodeConfig = {
  backgroundColor: 'white',
  borderColor: '#ddd',
  borderSize: 2,
  shape: 'circle',
  size: 50,
  textColor: '#222',
  fontSize: 16,
  hoverBorderSize: 2,
  fontFamily: 'Lora',
  hoverBorderColor: 'rgba(120, 118, 240, .6)',
  hoverBackgroundColor: 'white',
  selectedBorderColor: 'rgba(120, 118, 240, .8)',
  selectedBorderSize: 5,
}

export class GraphNode extends Component implements NodeInterface {
  id: number
  neighbors?: NeighborInterface[] = []
  nodeConfig: NodeConfig = {}
  text: string
  position: Coordinate
  movable = false
  isHovered = false
  isSelected = false
  mode: Mode = 'normal'
  gCost = 0
  elements = {
    circle: null,
    text: null
  }

  _borderOffset?: number = 0

  parent: NodeInterface = null

  constructor(name: string, position: Coordinate, config?: NodeConfig) {
    super()
    this.id = Math.floor(Math.random() * Date.now())
    this.name = 'node'
    this.text = name
    this.position = position
    this.nodeConfig = Object.assign(this.nodeConfig, defaultNodeConfig)
    this.nodeConfig = Object.assign(this.nodeConfig, config)
  }

  addNeighbor(node: NodeInterface, distance: number, line: LineInterface) {
    // If the neighbor already exists
    if (this.neighbors.find(n => n.node === node))
      return

    this.neighbors.push({
      node,
      distance,
      line,
    })
  }

  draw(root: SVGGElement) {
    // Node group
    const g = createElementNS('g', { class: "node" })

    this.elements.circle = createElementNS("circle", { 
      class: "node-circle",
      "data-id": this.id,
      cx: this.position.x, 
      cy: this.position.y,
      r: this.nodeConfig.size,
      fill: this.nodeConfig.backgroundColor,
      stroke: this.nodeConfig.borderColor,
      "stroke-width": this.nodeConfig.borderSize
    })

    
    this.elements.text = createElementNS("text", {
      x: this.position.x, 
      y: this.position.y
    }, el => {
      el.innerHTML = this.text
    })

    this.nodeConfig = new Proxy(this.nodeConfig, this.proxyHandler())

    g.append(this.elements.circle, this.elements.text)
    root.append(g)


    // Add hover state
    g.addEventListener('mouseover', e => this.onhover(e))
    g.addEventListener('mouseleave', e => this.unhover(e))
    g.addEventListener('mouseover', e => this.mouseover(e))

    // ctx.beginPath()
    // ctx.arc(
    //   this.position.x,
    //   this.position.y,
    //   this.nodeConfig.size + 5,
    //   0,
    //   Math.PI * 2,
    // )
    // ctx.fillStyle = this.nodeConfig.hoverBackgroundColor
    // ctx.setLineDash(this.mode === 'connecting' ? [50, 10] : [0])
    // ctx.lineDashOffset = this._borderOffset
    // if (this.isSelected) {
    //   ctx.lineWidth = this.nodeConfig.selectedBorderSize
    //   ctx.strokeStyle = this.nodeConfig.selectedBorderColor
    //   ctx.stroke()
    // }
    // else if (this.isHovered && !this.isSelected) {
    //   ctx.lineWidth = this.nodeConfig.hoverBorderSize
    //   ctx.strokeStyle = this.nodeConfig.hoverBorderColor
    //   ctx.stroke()
    // }
    // ctx.closePath()

    // Create the node shape
    // ctx.beginPath()
    // ctx.fillStyle = this.nodeConfig.backgroundColor
    // ctx.arc(
    //   this.position.x,
    //   this.position.y,
    //   this.nodeConfig.size,
    //   0,
    //   Math.PI * 2,
    // // )
    // ctx.strokeStyle = this.nodeConfig.borderColor
    // ctx.lineWidth = this.nodeConfig.borderSize
    // ctx.stroke()
    // ctx.fill()
    // ctx.closePath()

    // Draw text
    // ctx.fillStyle = this.nodeConfig.textColor
    // ctx.font = `${this.nodeConfig.fontSize}px ${this.nodeConfig.fontFamily}`
    // ctx.textBaseline = 'middle'
    // ctx.textAlign = 'center'
    // ctx.fillText(this.text, this.position.x, this.position.y)
  }

  proxyHandler() {
    const _this = this
    return {
      set(obj, prop, value) {
        if(prop == 'size') _this.elements.circle.setAttribute('r', value)
        else if(prop == 'backgroundColor') _this.elements.circle.setAttribute('fill', value) 
        else if(prop == 'borderColor') _this.elements.circle.setAttribute('stroke', value) 
        else if(prop == 'borderSize') _this.elements.circle.setAttribute('stroke-width', value) 
        return true
      }
    } as ProxyHandler<NodeConfig>
  }

  onhover(e: MouseEvent) {
    this.nodeConfig.borderColor = this.nodeConfig.hoverBorderColor
  }

  unhover(e: MouseEvent) {
    this.nodeConfig.borderColor = this.nodeConfig.borderColor
  }

  mouseover(e: MouseEvent) {

  }

  update() {
    this._borderOffset++
  }

  select() {
    this.isSelected = !this.isSelected

    if (!this.isSelected)
      this._borderOffset = 0
  }

  move(x?: number, y?: number) {
    if (x)
      this.position.x = x
    if (y)
      this.position.y = y
    this.neighbors.forEach((neighbor) => {
      neighbor.line.updateDistance()
    })
  }

}
