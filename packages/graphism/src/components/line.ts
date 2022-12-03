import type { Coordinate, NodeInterface } from '../types'
import type { LineConfig, LineInterface } from '../types/line'
import { getDistance } from '../utils'
import { createElement, createElementNS } from '../utils/dom'
import { Component } from './abstract'

const defaultLineConfig = {
  color: '#404258',
  width: 3,
  hoverColor: 'rgba(120, 118, 240, .6)',
  selectedColor: '#2f5ea8',
  text: null,
  dynamicDistance: false,
}

export default class Line extends Component implements LineInterface {
  id: number
  name: 'node' | 'line' = 'line'
  config: LineConfig = defaultLineConfig
  from: NodeInterface
  to: NodeInterface
  isHovered = false
  isSelected = false
  distance: number
  elements = {
    line: null,
    text: null
  }

  constructor(from: NodeInterface, to: NodeInterface, distance: number, config?: LineConfig) {
    super()
    this.id = Math.floor(Math.random() * Date.now())
    this.config = { ...defaultLineConfig, ...config }
    this.from = from
    this.to = to
    this.distance = distance
  }

  draw(root: SVGGElement) {
    const g = createElementNS('g', { class: "line" })
    const line = createElementNS("line", {
      class: "graphism-line",
      x1: this.from.position.x,
      x2: this.to.position.x,
      y1: this.from.position.y,
      y2: this.to.position.y,
      "data-id": this.id,
      "stroke-width": this.config.width,
      "stroke": this.config.color
    })
    
    const text = this.drawText()
    this.elements = { line, text }

    g.append(line, text)
    root.append(g)

    this.config = new Proxy(this.config, this.proxyHandler())

    // Add hover state
    g.addEventListener('mouseenter', () => this.hover())
    g.addEventListener('mouseleave', () => this.unhover())

    return g 
  }

  updateLinePosition() {
    const line = this.elements.line 
    const attrs = {
      x1: this.from.position.x,
      x2: this.to.position.x,
      y1: this.from.position.y,
      y2: this.to.position.y
    }
    for(const attr in attrs)
      line.setAttribute(attr, attrs[attr])
  }

  drawText() {
    const middlePosition: Coordinate = {
      x: (this.from.position.x + this.to.position.x) / 2,
      y: (this.from.position.y + this.to.position.y) / 2,
    }

    const text = createElementNS('text', {
      x: middlePosition.x,
      y: middlePosition.y,
      fill: this.config.color
    }, el => el.innerHTML = this.config.text)

    return text
  }
  
  proxyHandler() {
    const _this = this
    return {
      set(obj, prop, value) {
        if(prop == 'width') _this.elements.line.setAttribute('width', value) 
        else if(prop == 'color') _this.elements.line.setAttribute('stroke', value) 
        else if(prop == 'text') _this.elements.text.innerText = value 
        return true
      }
    } as ProxyHandler<LineConfig>
  }

  select() {
    this.isSelected = true
    this.elements.line.classList.add('selected')
  }
  
  deselect() {
    this.isSelected = false
    this.elements.line.classList.remove('selected')
  }

  hover() {
    this.config.color = this.config.hoverColor
  }

  unhover() {
    this.config.color = this.config.color
  }

  move(x?: number, y?: number) {
  }

  isOnCoordinate(point: Coordinate): boolean {
    const is = Math.ceil(getDistance(this.from.position, point))
            + Math.ceil(getDistance(this.to.position, point)) === Math.ceil(getDistance(this.from.position, this.to.position))
    return is
  }
}
