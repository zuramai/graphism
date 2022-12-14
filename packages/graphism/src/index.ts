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
  ComponentInterface,
} from './types'
import type { NodeConfig, NodeInterface } from './types/node'
import Line from './components/line'
import type { Component } from './components/abstract'
import { getDistance, getMousePosition } from './utils'
import { newAlgorithm } from './algorithms'
import type { AvailableAlgorithms } from './algorithms'
import { createBackground } from './components/background'
import { createElementNS } from './utils/dom'
import "./css/graphism.css"
import { Position } from 'vitest'

const defaultConfig: GraphismOptions = {
  lineColor: '#555',
  nodeBackground: 'white',
  nodeTextColor: '#555',
  canvasBackground: '#ccc',
  grid: true,
}

export class Graphism {
  root: SVGElement

  private nodes: Record<string, NodeInterface> = {}
  private lines: Record<string, LineInterface> = {}
  private selectedNodes: Record<string, NodeInterface> = {}
  private selectedLines: Record<string, LineInterface> = {}
  private holdingNode: NodeInterface = null
  private background
  private translate: Coordinate = { x: 0, y: 0}

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

    this.root.classList.add("graphism-container")
    this.root.style.width = "100%"
    this.root.style.height = "100vh"
    this.root.setAttribute("width", this.root.clientWidth.toString())
    this.root.setAttribute("height", this.root.clientHeight.toString())

    this.background = createBackground(this.root, 'grid')
    this.background.draw()
    
    this.root.appendChild(createElementNS("g", { class: "g-components" }))
    this.draw()
  }

  render() {
    this.update()
    this.makeDraggable()
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
    const gNodes = createElementNS('g', { class: "nodes" })
    const gLines = createElementNS('g', { class: "lines" })

    this.root.querySelector('.g-components').append(gLines)
    this.root.querySelector('.g-components').append(gNodes)
  }

  private drawLine(line: LineInterface) {
    const g = this.root.querySelector('.lines') as SVGGElement
    line.draw(g)
  }

  private drawNode(node: NodeInterface) {
    const g = this.root.querySelector('.nodes') as SVGGElement
    node.draw(g)
  }

  drawMode() {
    if (['creating', 'connecting'].includes(this.mode)) {
      const g = createElementNS('g', { class: "nodes" })


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
    this.nodes[node.id] = node
    this.drawNode(node)
    this._emitter.emit('node:created', node)
    this.setMode('normal')
    this.clearSelectedNodes()
    
    return node
  }

  clear() {
    this.root.querySelector('.lines').innerHTML = ""
    this.root.querySelector('.nodes').innerHTML = ""
    this.lines = {}
    this.nodes = {}
    this.mode = 'normal'
  }

  clearSelectedNodes() {
    for(const id in this.selectedNodes) {
      const node = this.nodes[id]
      node.deselect()
      node.isSelected = false
      node.mode = 'normal'
      node.movable = false
    }
    this._emitter.emit('node:clearSelect')
    this.selectedNodes = {}
  }

  clearSelectedLines() {
    for (const lineId in this.lines)
      this.lines[lineId].deselect()

    this._emitter.emit('line:clearSelect')
    this.selectedLines = {}
  }

  runAlgorithm<T extends keyof typeof AvailableAlgorithms>(algorithmName: T, from: NodeInterface, to: NodeInterface) {
    const algo = newAlgorithm(algorithmName, Object.values(this.nodes), from, to)

    const path = algo.solve()
    console.log(path)

    path.forEach((element) => {
      if (element instanceof Line) {
        element.config.color = 'blue'
      }
      else if (element instanceof GraphNode) {
        element.config.backgroundColor = 'blue'
        element.config.textColor = 'white'
      }
    })
  }

  setMode(mode: Mode) {
    this.mode = mode
    this.clearSelectedNodes()
  }

  getSelectedNodes() {
    return this.selectedNodes
  }

  addNodeNeighbor(from: NodeInterface, to: NodeInterface, text?: string|number) {
    let line: LineInterface
    const lineConfig: LineConfig = {}

    // Check if the line exists from the other way around
    const createdLine = Object.values(this.lines).find(
      l => (l.from === from && l.to === to) || (l.from === to && l.to === from),
    )

    const lineText = typeof text == 'number' ? text.toString() : text

    if (createdLine)
      line = createdLine
    else {
      line = new Line(from, to, lineText, lineConfig)
      this.lines[line.id] = line
    }

    from.addNeighbor(to, lineText, line)

    if (!this.isDirectedGraph)
      to.addNeighbor(from, lineText, line)
    
    this.drawLine(line)

    this._emitter.emit('node:connect', from, to)
  }

  private update() {
    for(const nodeId in this.nodes) 
      this.nodes[nodeId].update()
    
    if (['creating', 'connecting'].includes(this.mode)) {
      this._runningBorderOffset++
    }
  }

  private dragScreen() {

  }

  private dragSelectedNodes() {

    for(const nodeId in this.selectedNodes) {
      const currentNode = this.nodes[nodeId]

      // Move the line that connected to the node
      currentNode.neighbors.forEach(neighbor => {
        neighbor.line.updateLinePosition()
      })

      this._emitter.emit("node:move", currentNode)
    }
  }

  private makeDraggable() {
    let holdingComponent: NodeInterface|HTMLElement = null 

    // Mouse-to-node offsets for every selected nodes
    let offsets: Record<number, Coordinate> = {}

    const startDrag = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)
      
      let mousePos = getMousePosition(e, this.root as SVGGraphicsElement);
      
      if(target.classList.contains('graphism-node')) {
        // Start dragging the node
        const clickedNode = this.nodes[target.getAttribute('data-id')]
        holdingComponent = clickedNode
        
        for(const nodeId in this.selectedNodes) {
          const currentNode = this.nodes[nodeId]
          offsets[nodeId] = {
            x: mousePos.x - parseFloat(currentNode.elements.circle.getAttribute("cx")),
            y: mousePos.y - parseFloat(currentNode.elements.circle.getAttribute("cy"))
          }
        }
  
       } else if(target.id == 'bg-grid-rect') {
        // Move the entire canvas
        holdingComponent = target
        offsets[0] = {
          x: mousePos.x,
          y: mousePos.y,
        }
       }
       
    }
    const drag = (e: MouseEvent) => {
      if(!holdingComponent) return 

      const coord = getMousePosition(e, this.root as SVGGraphicsElement)

      if(holdingComponent instanceof GraphNode) {
        for(const nodeId in this.selectedNodes) {
          const currentNode = this.nodes[nodeId]
          currentNode.position.x = coord.x - offsets[nodeId].x
          currentNode.position.y = coord.y - offsets[nodeId].y
        }
        this.dragSelectedNodes()
      }
      else if(holdingComponent instanceof HTMLElement) {
        // Move the grid
        this.dragScreen()
      }

    }
    const endDrag = () => {
      holdingComponent = null
    }
    this.root.addEventListener('mousedown', startDrag)
    this.root.addEventListener('mousemove', drag)
    this.root.addEventListener('mouseleave', endDrag)
    this.root.addEventListener('mouseup', endDrag)
    this.root.addEventListener('touchstart', startDrag);
    this.root.addEventListener('touchmove', drag);
    this.root.addEventListener('touchend', endDrag);
    this.root.addEventListener('touchleave', endDrag);
    this.root.addEventListener('touchcancel', endDrag);


  }

  private keypress(e: KeyboardEvent) {
    switch (e.key) {
      case 'a':
        if (e.ctrlKey) {
          e.preventDefault()
          this.selectAllNode()
        }
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
  }

  private mouseMove(e: MouseEvent) {
    const position = this.getCursorPosition(e)
    let element: Component
    
    if (!this.nodes.length || !this.holdingNode)
      return
    const dx = position.x - this.dragFrom.x
    const dy = position.y - this.dragFrom.y

    // If selected more than one nodes, move all selected node
    if (Object.keys(this.selectedNodes).length > 1 && this.holdingNode.isSelected) {
      for(const selectedNodeId in this.selectedNodes) {
        element = this.nodes[selectedNodeId]
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
    const target = e.target as HTMLElement
    let isLineClicked = false, 
        isNodeClicked = false
    
    this._emitter.emit('canvas:click', position)


    if(target.classList.contains('graphism-node')) {
      let nodeId = target.getAttribute('data-id')
      const node = this.nodes[nodeId]
      const nodeIsNotSelected = () => Object.keys(this.selectedNodes).every(n => n !== node.id.toString())

      if (!e.ctrlKey && nodeIsNotSelected())
        this.clearSelectedNodes()
      
      isNodeClicked = true
      this.selectNode(node, this.mode)
      console.log('selected nodes: ', this.selectedNodes)
    }
    else if(target.classList.contains('graphism-line')) {
      if (!e.ctrlKey)
        this.clearSelectedLines()

      let lineId = target.getAttribute('data-id')
      const line = this.lines[lineId]
      line.select()
      this.selectedLines[lineId] = line
      
      this._emitter.emit('line:select', line)
      isLineClicked = true
    }

    if (!isLineClicked)
      this.clearSelectedLines()
    if (!isNodeClicked)
      this.clearSelectedNodes()
  }

  selectNode(node: NodeInterface, mode: Mode = 'normal') {
    node.select()
    node.mode = !node.isSelected ? 'normal' : mode
    this.selectedNodes[node.id] = node
    this._emitter.emit('node:select', node)
  }

  selectAllNode() {
    for(const nodeId in this.nodes) {
      this.selectNode(this.nodes[nodeId])
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
