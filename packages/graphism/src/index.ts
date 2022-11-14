/* eslint-disable no-cond-assign */
/* eslint-disable curly */
import { createNanoEvents } from 'nanoevents'
import { GraphNode } from './components/node'
import type {
  Mode,
  Coordinate,
  EventsMap,
  GraphismOptions,
  LineConfig,
  LineInterface,
} from './types'
import type { NodeConfig, NodeInterface } from './types/node'
import Line from './components/line'
import type { Component } from './components/abstract'
import { getDistance } from './utils'
import { newAlgorithm } from './algorithms'
import type { AvailableAlgorithms } from './algorithms'
import { createBackground } from './components/background'
import { createElementNS } from './utils/dom'

const defaultConfig: GraphismOptions = {
  lineColor: '#555',
  nodeBackground: 'white',
  nodeTextColor: '#555',
  canvasBackground: '#ccc',
  grid: true,
}

export class Graphism {
  root: SVGElement

  private nodes: NodeInterface[] = []
  private lines: LineInterface[] = []
  private selectedNode: NodeInterface[] = []
  private holdingNode: NodeInterface = null
  private background

  private dragFrom: Coordinate
  private isDirectedGraph = false
  private mode: Mode = 'normal'

  private _hoveredElement: Component = null
  private _emitter = createNanoEvents<EventsMap>()

  private _runningBorderOffset = 0

  /**
   * Rendering canvas to visualize algorithms
   * @param config The canvas configuration
   */
  constructor(public config: GraphismOptions = {}) {
    this.config = Object.assign(defaultConfig, config)
    this.mount(config.el)
    this.init()
  }

  private resolveSelector<T>(selector: string | T | null | undefined): T | null {
    if (typeof selector === 'string')
      return document.querySelector(selector) as unknown as T
    else return selector || null
  }

  private mount(el: string | HTMLDivElement) {
    if (this.root)
      throw new Error('[graphism] already mounted, unmount previous target first')

    const element = this.resolveSelector(el)
    this.root = element.appendChild(createElementNS('svg', {}))

    if (!this.root)
      throw new Error('[graphism] target element not found')

    // Event listeners
    window.addEventListener('keydown', this.keypress.bind(this))
    this.root.addEventListener('mousedown', this.mouseDown.bind(this))
    this.root.addEventListener('mousemove', this.mouseMove.bind(this))
    this.root.addEventListener('mouseup', this.mouseUp.bind(this))
    this.root.addEventListener('click', this.mouseClick.bind(this))

    this._emitter.emit('mounted')

    requestAnimationFrame(() => this.render())
  }

  init() {
    // Set canvas size
    this.root.style.width = "100%"
    this.root.style.height = "100vh"
    this.root.setAttribute("width", this.root.clientWidth.toString())
    this.root.setAttribute("height", this.root.clientHeight.toString())

    this.background = createBackground(this.root, 'grid')
    this.background.draw()

    this.render()
  }

  render() {
    this.draw()
    this.update()
  }

  on<E extends keyof EventsMap>(event: E, callback: any, once = false) {
    const unbind = this._emitter.on(event, (...args) => {
      if (once)
        unbind()
      callback(...args)
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
    const a = this.createNode('a', { x: 300, y: 300 })
    const b = this.createNode('b', { x: 500, y: 450 })
    const c = this.createNode('c', { x: 550, y: 200 })
    const d = this.createNode('d', { x: 200, y: 500 })
    const e = this.createNode('e', { x: 700, y: 420 })
    const f = this.createNode('f', { x: 1000, y: 420 })
    const g = this.createNode('g', { x: 500, y: 620 })
    const h = this.createNode('h', { x: 800, y: 300 })
    this.addNodeNeighbor(a, b, 100)
    this.addNodeNeighbor(a, c, 150)
    this.addNodeNeighbor(a, d, 250)
    this.addNodeNeighbor(b, e, 50)
    this.addNodeNeighbor(c, e, 250)
    this.addNodeNeighbor(f, e, 250)
    this.addNodeNeighbor(g, d, 1250)
    this.addNodeNeighbor(g, e, 300)
    this.addNodeNeighbor(g, f, 400)
    this.addNodeNeighbor(c, h, 300)
    this.addNodeNeighbor(h, f, 250)
    this.addNodeNeighbor(h, e, 200)
  }

  private draw() {
    this.drawNodes()
    // this.drawMode()
    // this.drawLines()
  }

  private drawLines() {
    for (let i = 0; i < this.lines.length; i++)
      this.lines[i].draw()
  }

  private drawNodes() {
    const g = createElementNS('g', { class: "nodes" })
    for (let i = 0; i < this.nodes.length; i++)
      this.nodes[i].draw(g)
    this.root.append(g)
  }

  drawMode() {
    if (['creating', 'connecting'].includes(this.mode)) {
      // Running border
      // this.ctx.save()
      // this.ctx.beginPath()

      // this.ctx.strokeStyle = 'rgb(120, 118, 240)'
      // this.ctx.rect(0, 0, this.root.width, this.root.height)
      // this.ctx.lineWidth = 10
      // this.ctx.setLineDash([0, 25, 50])
      // this.ctx.lineDashOffset = this._runningBorderOffset
      // this.ctx.stroke()

      // this.ctx.closePath()

      // this.ctx.restore()
    }
  }

  waitingForClick(): Promise<Coordinate> {
    return new Promise((resolve) => {
      this.mode = 'creating'

      this.root.addEventListener(
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
    const node = new GraphNode(name, coordinate, config)
    this.nodes.push(node)

    this._emitter.emit('node:created', node)
    this.setMode('normal')
    this.clearSelectedNode()

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
  }

  clearSelectedLine() {
    for (let i = 0; i < this.lines.length; i++)
      this.lines[i].isSelected = false

    this._emitter.emit('line:clearSelect')

    this.selectedNode = []
  }

  runAlgorithm<T extends keyof typeof AvailableAlgorithms>(algorithmName: T, from: NodeInterface, to: NodeInterface) {
    const algo = newAlgorithm(algorithmName, this.nodes, from, to)

    const path = algo.solve()
    console.log(path)

    path.forEach((element) => {
      if (element instanceof Line) {
        element.lineConfig.color = 'blue'
      }
      else if (element instanceof GraphNode) {
        element.nodeConfig.backgroundColor = 'blue'
        element.nodeConfig.textColor = 'white'
      }
    })
  }

  setMode(mode: Mode) {
    this.mode = mode
    this.clearSelectedNode()
  }

  getSelectedNode() {
    return this.selectedNode
  }

  addNodeNeighbor(from: NodeInterface, to: NodeInterface, distance?: number) {
    let line: LineInterface
    const lineConfig: LineConfig = {}
    if (distance === null || distance === undefined)
      lineConfig.dynamicDistance = true

    distance ??= Math.round(getDistance(from.position, to.position))
    // Check if the line exists from the other way around
    const createdLine = this.lines.find(
      l => (l.from === from && l.to === to) || (l.from === to && l.to === from),
    )

    if (createdLine)
      line = createdLine
    else {
      line = new Line(from, to, distance, lineConfig)
      this.lines.push(line)
    }

    from.addNeighbor(to, distance, line)

    if (!this.isDirectedGraph)
      to.addNeighbor(from, distance, line)

    this._emitter.emit('node:connect', from, to)
  }

  private update() {
    for (let i = 0; i < this.nodes.length; i++) this.nodes[i].update()

    if (['creating', 'connecting'].includes(this.mode)) {
      this._runningBorderOffset++
    }
  }

  private keypress(e: KeyboardEvent) {
    console.log('keypress')
    switch (e.key) {
      case 'a':
        e.preventDefault()
        if (e.ctrlKey)
          this.selectAllNode()
        break
      default:
        break
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

    this.root.style.cursor = 'grab'

    // Change cursor on node hover
    if ((element = elements.find(el => el.isOnCoordinate(position)))) {
      this.root.style.cursor = 'pointer'
      this._emitter.emit(`${element.name}:mouseover`, element as LineInterface)
      this._hoveredElement = element
      element.isHovered = true
    }

    if (!this.nodes.length || !this.holdingNode)
      return
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
          if (!e.ctrlKey)
            this.clearSelectedNode()
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

      if (!isLineClicked)
        this.clearSelectedLine()
      if (!isNodeClicked)
        this.clearSelectedNode()
    }
  }

  selectNode(node: NodeInterface, mode: Mode = 'normal') {
    node.select()
    node.mode = !node.isSelected ? 'normal' : mode
    this.selectedNode.push(node)
  }

  selectAllNode() {
    for (let i = 0; i < this.nodes.length; i++) {
      this.selectNode(this.nodes[i])
    }
  }

  getCursorPosition(e) {
    const rect = this.root.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

}

export * from './types'
export function createGraphism(config?: GraphismOptions): Graphism {
  return new Graphism(config)
}
