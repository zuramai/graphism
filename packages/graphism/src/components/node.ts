import { Position } from 'vitest'
import type { Mode, Coordinate } from '../types'
import type { LineInterface } from '../types/line'
import type { NeighborInterface, NodeConfig, NodeInterface } from '../types/node'
import { createElementNS } from '../utils/dom'
import { Component } from './abstract'

const defaultNodeConfig: NodeConfig = {
  backgroundColor: 'white',
  borderColor: '#9ba3ab',
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
  config: NodeConfig = {}
  text: string
  position: Coordinate
  movable = false
  isHovered = false
  isSelected = false
  mode: Mode = 'normal'
  gCost = 0
  elements: Record<string, SVGCircleElement|SVGTextElement> = {
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
    this.position = new Proxy(position, this.positionProxy())
    this.config = Object.assign(this.config, defaultNodeConfig)
    this.config = Object.assign(this.config, config)
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
      class: "graphism-node node-circle",
      "data-id": this.id,
      cx: this.position.x, 
      cy: this.position.y,
      r: this.config.size,
      fill: this.config.backgroundColor,
      stroke: this.config.borderColor,
      "stroke-width": this.config.borderSize
    })

    
    this.elements.text = createElementNS("text", {
      x: this.position.x, 
      y: this.position.y
    }, el => {
      el.innerHTML = this.text
    })

    this.config = new Proxy(this.config, this.proxyHandler())

    g.append(this.elements.circle, this.elements.text)
    root.append(g)


    // Add hover state
    g.addEventListener('mouseenter', e => this.hover(e))
    g.addEventListener('mouseleave', e => this.unhover(e))

    // ctx.beginPath()
    // ctx.arc(
    //   this.position.x,
    //   this.position.y,
    //   this.config.size + 5,
    //   0,
    //   Math.PI * 2,
    // )
    // ctx.fillStyle = this.config.hoverBackgroundColor
    // ctx.setLineDash(this.mode === 'connecting' ? [50, 10] : [0])
    // ctx.lineDashOffset = this._borderOffset
    // if (this.isSelected) {
    //   ctx.lineWidth = this.config.selectedBorderSize
    //   ctx.strokeStyle = this.config.selectedBorderColor
    //   ctx.stroke()
    // }
    // else if (this.isHovered && !this.isSelected) {
    //   ctx.lineWidth = this.config.hoverBorderSize
    //   ctx.strokeStyle = this.config.hoverBorderColor
    //   ctx.stroke()
    // }
    // ctx.closePath()

    // Create the node shape
    // ctx.beginPath()
    // ctx.fillStyle = this.config.backgroundColor
    // ctx.arc(
    //   this.position.x,
    //   this.position.y,
    //   this.config.size,
    //   0,
    //   Math.PI * 2,
    // // )
    // ctx.strokeStyle = this.config.borderColor
    // ctx.lineWidth = this.config.borderSize
    // ctx.stroke()
    // ctx.fill()
    // ctx.closePath()

    // Draw text
    // ctx.fillStyle = this.config.textColor
    // ctx.font = `${this.config.fontSize}px ${this.config.fontFamily}`
    // ctx.textBaseline = 'middle'
    // ctx.textAlign = 'center'
    // ctx.fillText(this.text, this.position.x, this.position.y)
  }
  
  positionProxy() {
    const _this = this
    return {
      set(obj, prop, value) {
        if(prop == 'x') {
          _this.elements.circle.setAttribute('cx', value)
          _this.elements.text.setAttribute('x', value)
        } 
        else if(prop == 'y') {
          _this.elements.circle.setAttribute('cy', value)
          _this.elements.text.setAttribute('y', value)
        } 
        obj[prop] = value
        return true
      }
    } as ProxyHandler<Coordinate>
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

  hover(e: MouseEvent) {
    if(!this.isSelected) { 
      this.config.borderSize = this.config.hoverBorderSize
      this.config.borderColor = this.config.hoverBorderColor
    }
  }
  unhover(e: MouseEvent) {
    
    if(!this.isSelected) {
      this.config.borderSize = this.config.borderSize
      this.config.borderColor = this.config.borderColor
    }
  }

  update() {
    this._borderOffset++
  }

  select() {
    if(this.isSelected) return this.deselect()
    this.isSelected = true

    this.config.borderColor = this.config.selectedBorderColor
    this.config.borderSize = this.config.selectedBorderSize
    this.elements.circle.classList.add('selected')
  }

  deselect() {
    console.trace('deselected')
    this.isSelected = false
    this._borderOffset = 0

    this.config.borderSize = this.config.borderSize
    this.config.borderColor = this.config.borderColor
    this.elements.circle.classList.remove('selected')
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
