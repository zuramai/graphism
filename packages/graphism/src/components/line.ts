import type { Coordinate, NodeInterface } from '../types'
import type { LineConfig, LineInterface } from '../types/line'
import { getDistance } from '../utils'
import { Component } from './abstract'

const defaultLineConfig = {
  color: '#777',
  width: 5,
  hoverColor: 'rgba(120, 118, 240, .6)',
  selectedColor: '#2f5ea8',
  text: null,
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
    this.lineConfig = Object.assign(defaultLineConfig, config)
    this.from = from
    this.to = to
    this.distance = distance
  }

  draw(ctx) {
    ctx.strokeStyle = this.lineConfig.color

    if (this.isSelected)
      ctx.strokeStyle = this.lineConfig.selectedColor
    else if (this.isHovered)
      ctx.strokeStyle = this.lineConfig.hoverColor

    ctx.lineWidth = this.lineConfig.width
    ctx.beginPath()
    ctx.moveTo(this.from.position.x, this.from.position.y)
    ctx.lineTo(this.to.position.x, this.to.position.y)
    ctx.stroke()
    ctx.closePath()

    this.drawText(ctx)
  }

  drawText(ctx: CanvasRenderingContext2D) {
    const middlePosition: Coordinate = {
      x: (this.from.position.x + this.to.position.x) / 2,
      y: (this.from.position.y + this.to.position.y) / 2,
    }
    ctx.fillStyle = this.lineConfig.selectedColor
    ctx.font = '18px Arial bold'
    if (!this.lineConfig.text) {
      // If text doesn't exists, draw the distance
      if(this.distance === 0) return
      ctx.fillText(this.distance.toString(), middlePosition.x, middlePosition.y)
      return
    }

    ctx.fillText(this.lineConfig.text, middlePosition.x, middlePosition.y)
  }

  move(x?: number, y?: number) {
  }

  isOnCoordinate(point: Coordinate): boolean {
    const is = Math.ceil(getDistance(this.from.position, point))
            + Math.ceil(getDistance(this.to.position, point)) === Math.ceil(getDistance(this.from.position, this.to.position))
    return is
  }
}
