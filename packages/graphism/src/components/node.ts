import type { CanvasMode, Coordinate } from '../types'
import type { LineInterface } from '../types/line'
import type { NeighborInterface, NodeConfig, NodeInterface } from '../types/node'
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
}

export class Nodee extends Component implements NodeInterface {
  id: number
  neighbors?: NeighborInterface[] = []
  nodeConfig: NodeConfig = {}
  text: string
  position: Coordinate
  movable = false
  isHovered = false
  isSelected = false
  mode: CanvasMode = 'normal'
  gCost = 0

  _borderOffset?: number = 0

  parent: NodeInterface = null

  constructor(name: string, position: Coordinate, config?: NodeConfig) {
    super()
    this.id = performance.now()
    this.name = 'node'
    this.text = name
    this.position = position
    this.nodeConfig = Object.assign(this.nodeConfig, defaultNodeConfig)
    this.nodeConfig = Object.assign(this.nodeConfig, config)
  }

  addNeighbor(node: NodeInterface, distance: number, line: LineInterface) {
    // If the neighbor already exists
    if (this.neighbors.find(n => n.node === node)) return

    this.neighbors.push({
      node,
      distance,
      line,
    })
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Hover state outer border
    ctx.beginPath()
    ctx.arc(
      this.position.x,
      this.position.y,
      this.nodeConfig.size + 5,
      0,
      Math.PI * 2,
    )
    ctx.strokeStyle = this.nodeConfig.hoverBorderColor
    ctx.fillStyle = this.nodeConfig.hoverBackgroundColor
    ctx.lineWidth = this.nodeConfig.hoverBorderSize
    ctx.setLineDash(this.mode === 'connecting' ? [50, 10] : [0])
    ctx.lineDashOffset = this._borderOffset
    if (this.isHovered && !this.isSelected) ctx.fill()
    if (this.isSelected) ctx.stroke()
    ctx.closePath()

    // Create the node shape
    ctx.beginPath()
    ctx.fillStyle = this.nodeConfig.backgroundColor
    ctx.arc(
      this.position.x,
      this.position.y,
      this.nodeConfig.size,
      0,
      Math.PI * 2,
    )
    ctx.strokeStyle = this.nodeConfig.borderColor
    ctx.lineWidth = this.nodeConfig.borderSize
    ctx.stroke()
    ctx.fill()
    ctx.closePath()

    // Draw text
    ctx.fillStyle = this.nodeConfig.textColor
    ctx.font = `${this.nodeConfig.fontSize}px ${this.nodeConfig.fontFamily}`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    ctx.fillText(this.text, this.position.x, this.position.y)
  }

  update() {
    this._borderOffset++
  }

  select() {
    this.isSelected = !this.isSelected

    if (!this.isSelected) this._borderOffset = 0
  }

  move(x?: number, y?: number) {
    if (x) this.position.x = x
    if (y) this.position.y = y
    this.neighbors.forEach((neighbor) => {
      neighbor.line.updateDistance()
    })
  }

  isOnCoordinate(coordinate: Coordinate): boolean {
    if (
      coordinate.x > this.position.x - this.nodeConfig.size
      && coordinate.x <= this.position.x + this.nodeConfig.size
      && coordinate.y > this.position.y - this.nodeConfig.size
      && coordinate.y <= this.position.y + this.nodeConfig.size
    )
      return true

    return false
  }
}
