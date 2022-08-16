/* eslint-disable no-cond-assign */
/* eslint-disable curly */
import { createNanoEvents } from 'nanoevents'
import { Nodee } from './components/node'
import type {
  CanvasConfig,
  CanvasMode,
  Coordinate,
  EventsMap,
  LineConfig,
  LineInterface,
} from './types'
import type { NodeConfig, NodeInterface } from './types/node'
import Line from './components/line'
import type { Component } from './components/abstract'
import { getDistance } from './utils'
import { newAlgorithm } from './algorithms'
import type { AvailableAlgorithms } from './algorithms'

const defaultConfig: CanvasConfig = {
  lineColor: '#555',
  nodeBackground: 'white',
  nodeTextColor: '#555',
  canvasBackground: '#ccc',
}

export class Graphism {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  nodes: NodeInterface[] = []
  dragFrom: Coordinate
  isDirectedGraph = false
  lines: LineInterface[] = []
  selectedNode: NodeInterface[] = []
  holdingNode: NodeInterface = null
  mode: CanvasMode = 'normal'

  private _hoveredElement: Component = null
  private _emitter = createNanoEvents<EventsMap>()

  private _runningBorderOffset = 0

  /**
   * Rendering canvas to visualize algorithms
   * @param config The canvas configuration
   */
  constructor(public config: CanvasConfig = {}) {
    this.config = Object.assign(defaultConfig, config)
    this.mount(config.el)
  }

  private resolveSelector<T>(selector: string | T | null | undefined): T | null {
    if (typeof selector === 'string')
      return document.querySelector(selector) as unknown as T
    else return selector || null
  }

  private mount(el: string | HTMLCanvasElement) {
    if (this.canvas) throw new Error('[graphism] already mounted, unmount previous target first')

    this.canvas = this.resolveSelector(el)

    if (!this.canvas) throw new Error('[graphism] target element not found')

    this.ctx = this.canvas.getContext('2d')

    // Set canvas size
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight

    // Event listeners
    this.canvas.addEventListener('mousedown', this.mouseDown.bind(this))
    this.canvas.addEventListener('mousemove', this.mouseMove.bind(this))
    this.canvas.addEventListener('mouseup', this.mouseUp.bind(this))
    this.canvas.addEventListener('click', this.mouseClick.bind(this))

    this._emitter.emit('mounted')

    requestAnimationFrame(() => this.render())
  }

  on<E extends keyof EventsMap>(event: E, callback: any, once = false) {
    const unbind = this._emitter.on(event, (...args) => {
      if (once) unbind()
      callback(...args) // eslint-disable-line n/no-callback-literal
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
    const nodeJakarta = this.createNode('Jakarta', { x: 130, y: 274 })
    const nodeBandung = this.createNode('Bandung', { x: 390, y: 200 })

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
    for (let i = 0; i < this.lines.length; i++)
      this.lines[i].draw(this.ctx)
  }

  private drawNodes() {
    for (let i = 0; i < this.nodes.length; i++)
      this.nodes[i].draw(this.ctx)
  }

  private drawBackground() {
    // Background
    if (
      typeof this.config.canvasBackground == 'string'
      || this.config.canvasBackground instanceof CanvasPattern
    ) {
      this.ctx.fillStyle = this.config.canvasBackground
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
    else if (this.config.canvasBackground instanceof HTMLImageElement) {
      this.ctx.drawImage(
        this.config.canvasBackground,
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      )
    }

    if (['creating', 'connecting'].includes(this.mode)) {
      // Running border
      this.ctx.save()
      this.ctx.beginPath()

      this.ctx.strokeStyle = 'rgb(120, 118, 240)'
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
      this.mode = 'creating'

      this.canvas.addEventListener(
        'click',
        (e) => {
          const position = this.getCursorPosition(e)
          resolve(position)
        },
        { once: true },
      )
    })
  }

  createNode(
    name: string,
    coordinate: Coordinate,
    config?: NodeConfig,
  ): NodeInterface {
    const node = new Nodee(name, coordinate, config)
    this.nodes.push(node)

    this._emitter.emit('node:created', node)
    this.setMode('normal')
    this.clearSelectedNode()

    console.log('creating new node ', name, ' at ', coordinate)

    return node
  }

  clear() {
    this.lines = []
    this.nodes = []
    this.mode = 'normal'
  }

  clearSelectedNode() {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].isSelected = false
      this.nodes[i].mode = 'normal'
      this.nodes[i].movable = false
    }
    this._emitter.emit('node:clearSelect')
    this.selectedNode = []
    console.log('clearing selected node')
  }

  clearSelectedLine() {
    for (let i = 0; i < this.lines.length; i++)
      this.lines[i].isSelected = false

    this._emitter.emit('line:clearSelect')

    this.selectedNode = []
    console.log('clearing selected line')
  }

  runAlgorithm<T extends keyof typeof AvailableAlgorithms>(algorithmName: T, from: NodeInterface, to: NodeInterface) {
    const algo = newAlgorithm(algorithmName, this.nodes, from, to)

    return algo.solve({
      speed: 1,
    })
  }

  setMode(mode: CanvasMode) {
    this.mode = mode
  }

  addNodeNeighbor(from: NodeInterface, to: NodeInterface, distance?: number) {
    let line: LineInterface
    const lineConfig: LineConfig = {}
    if (distance === null || distance === undefined) lineConfig.dynamicDistance = true

    distance ??= Math.round(getDistance(from.position, to.position))
    // Check if the line exists from the other way around
    const createdLine = this.lines.find(
      l => (l.from === from && l.to === to) || (l.from === to && l.to === from),
    )

    if (createdLine) line = createdLine
    else {
      line = new Line(from, to, distance, lineConfig)
      this.lines.push(line)
    }

    from.addNeighbor(to, distance, line)

    if (!this.isDirectedGraph) to.addNeighbor(from, distance, line)

    this._emitter.emit('node:connect', from, to)
  }

  private update() {
    for (let i = 0; i < this.nodes.length; i++) this.nodes[i].update()

    if (['creating', 'connecting'].includes(this.mode)) {
      this._runningBorderOffset++
    }
  }

  private mouseUp() {
    this.holdingNode = null
  }

  private mouseDown(e: MouseEvent) {
    const position = this.getCursorPosition(e)

    this.dragFrom = position

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i]

      // if the node is clicked
      if (node.isOnCoordinate(position)) {
        this.holdingNode = node
        node.moveFrom = {
          x: node.position.x,
          y: node.position.y,
        }

        for (let j = 0; j < this.selectedNode.length; j++) {
          const s = this.selectedNode[j]
          s.moveFrom = {
            x: s.position.x,
            y: s.position.y,
          }
        }
      }
    }
  }

  private mouseMove(e: MouseEvent) {
    const position = this.getCursorPosition(e)
    let element: Component
    const elements: Component[] = [...this.nodes, ...this.lines]

    if (this._hoveredElement != null) {
      this._hoveredElement.isHovered = false
      this._hoveredElement = null
    }

    this.canvas.style.cursor = 'grab'

    // Change cursor on node hover
    if ((element = elements.find(el => el.isOnCoordinate(position)))) {
      this.canvas.style.cursor = 'pointer'
      this._emitter.emit(`${element.name}:mouseover`, element as LineInterface)
      this._hoveredElement = element
      element.isHovered = true
    }

    if (!this.nodes.length || !this.holdingNode) return
    const dx = position.x - this.dragFrom.x
    const dy = position.y - this.dragFrom.y

    // If selected more than one nodes, move all selected node
    if (this.selectedNode.length > 1 && this.holdingNode.isSelected) {
      for (let i = 0; i < this.selectedNode.length; i++) {
        element = this.nodes[i]
        element.move(element.moveFrom.x + dx, element.moveFrom.y + dy)
      }
    }
    else {
      // Just move the holding node
      element.move(element.moveFrom.x + dx, element.moveFrom.y + dy)
    }
  }

  private mouseClick(e: MouseEvent) {
    const position = this.getCursorPosition(e)

    // If the click is instant click (not moving or dragging)
    if (position.x === this.dragFrom.x && position.y === this.dragFrom.y) {
      this._emitter.emit('canvas:click', position)
      let isNodeClicked = false
      let isLineClicked = false

      // Check if a node is clicked
      for (let i = this.nodes.length - 1; i >= 0; i--) {
        const node = this.nodes[i]

        if (node.isOnCoordinate(position)) {
          if (!e.ctrlKey) this.clearSelectedNode()
          this.selectNode(node, this.mode)
          isNodeClicked = true
          this._emitter.emit('node:select', node)
          break
        }
      }

      // Check if a line is clicked
      for (let i = 0; i < this.lines.length; i++) {
        const line = this.lines[i]
        if (line.isOnCoordinate(position)) {
          line.isSelected = true
          isLineClicked = true
          this._emitter.emit('line:select', line)
        }
      }

      if (!isLineClicked) this.clearSelectedLine()
      if (!isNodeClicked) this.clearSelectedNode()
    }
  }

  selectNode(node: NodeInterface, mode: CanvasMode = 'normal') {
    node.select()
    node.mode = !node.isSelected ? 'normal' : mode
    this.selectedNode.push(node)
  }

  getCursorPosition(e) {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.draw()
    this.update()
    requestAnimationFrame(() => this.render())
  }
}

export * from './types'
export function createGraphism(config?: CanvasConfig): Graphism {
  return new Graphism(config)
}
