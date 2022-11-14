import type { Coordinate, NodeInterface } from '../types'
import type { LineConfig, LineInterface } from '../types/line'
import { getDistance } from '../utils'
import { createElement, createElementNS } from '../utils/dom'
import { Component } from './abstract'

const defaultLineConfig = {
  color: '#777',
  width: 5,
  hoverColor: 'rgba(120, 118, 240, .6)',
  selectedColor: '#2f5ea8',
  text: null,
  dynamicDistance: false,
}

export default class Line extends Component implements LineInterface {
  name: 'node' | 'line' = 'line'
  lineConfig: LineConfig = defaultLineConfig
  from: NodeInterface
  to: NodeInterface
  isHovered = false
  isSelected = false
  distance: number

  constructor(from: NodeInterface, to: NodeInterface, distance: number, config?: LineConfig) {
    super()
    this.lineConfig = { ...defaultLineConfig, ...config }
    this.from = from
    this.to = to
    this.distance = distance
  }

  draw(root: SVGGElement) {
    const g = createElementNS('g', { class: "lines" })
    const line = createElementNS("line", {
      x1: this.from.position.x,
      x2: this.to.position.x,
      y1: this.from.position.y,
      y2: this.to.position.y,
      "stroke-width": this.lineConfig.width,
      "stroke": this.lineConfig.selectedColor
    })
    
    const text = this.drawText()

    g.append(line, text)
    root.append(g)
    
    return g 
  }

  drawText() {
    const middlePosition: Coordinate = {
      x: (this.from.position.x + this.to.position.x) / 2,
      y: (this.from.position.y + this.to.position.y) / 2,
    }

    const text = createElementNS('text', {
      x: middlePosition.x,
      y: middlePosition.y,
      fill: this.lineConfig.selectedColor
    }, el => el.innerHTML = this.lineConfig.text)

    // if (!this.lineConfig.text) {
    //   // If text doesn't exists, draw the distance
    //   if (this.distance === 0)
    //     return
    //   ctx.fillText(this.distance.toString(), middlePosition.x, middlePosition.y)
    //   return
    // }
    return text
  }

  updateDistance() {
    if (this.lineConfig.dynamicDistance)
      this.distance = Math.round(getDistance(this.from.position, this.to.position))
  }

  move(x?: number, y?: number) {
  }

  isOnCoordinate(point: Coordinate): boolean {
    const is = Math.ceil(getDistance(this.from.position, point))
            + Math.ceil(getDistance(this.to.position, point)) === Math.ceil(getDistance(this.from.position, this.to.position))
    return is
  }
}
