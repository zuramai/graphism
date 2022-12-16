import './assets/scss/main.scss'
import type { Coordinate, Graphism, NodeInterface } from 'graphism'
import { createGraphism } from 'graphism'
import 'graphism/dist/index.css'
import { saveSvg } from '../../packages/graphism/src/utils'
import { camelToSnakeCase, onClick, onSubmit } from './utils'
import { createNotification } from './components/notification'
import { showPoppover, toggleModalFromSelector } from './ui'

const customizations = {
  fontSize: 22,
  fontFamily: 'Lora',
  textColor: '#222',
  backgroundColor: 'white',
  borderColor: '#ddd',
  borderSize: 2,
  width: 50,
  height: 50,
  hoverBorderColor: 'rgba(120, 118, 240, .6)',
  hoverBackgroundColor: 'white',
}
window.onload = () => {
  const el = document.querySelector<HTMLDivElement>('#graphism')

  // Create the canvas instance
  const graphism = createGraphism({
    el,
  })

  // Customization provider
  const proxy = createProxy(graphism, customizations)
  customizationHandler(proxy)

  graphism.generateGraph()

  graphismEventListeners(graphism, el)
}

/**
 * Add listeners to improve playground functionality
 * @param graphism Graphism instance
 * @param canvas HTML canvas element
 */
function graphismEventListeners(graphism: Graphism, canvas: HTMLDivElement) {
  window.addEventListener('resize', resizeCanvas.bind(null, canvas))
  onSubmit('form-add-node', e => e.preventDefault())
  onClick('node-add', addNode.bind(null, graphism))
  onClick('generate-graph', generateGraphEvent.bind(null, graphism))
  onClick('create-new', createNewGraph)
  onClick('connectNode', connectNode.bind(null, graphism))
  onClick('saveToImage', () => saveSvg(graphism.root, 'graphism.png'))
  onClick('clear', () => graphism.clear())

  toggleModalFromSelector(document.querySelector('.modal-add'), document.getElementById('openAddModal'))
  algorithmEventListeners(graphism)
  graphism.on('line:select', () => {
    document.getElementById('options-line').classList.remove('disabled')
  })
  graphism.on('line:clearSelect', () => {
    document.getElementById('options-line').classList.add('disabled')
  })
}

function algorithmEventListeners(graphism: Graphism) {
  onClick('solve-dijkstra', () => {
    graphism.setMode('connecting')
    showHelperText('Select starting node..')
    graphism.clearSelectedNode()

    graphism.on('node:select', (node1: NodeInterface) => {
      showHelperText('Select ending node..')
      graphism.on('node:select', (node2: NodeInterface) => {
        graphism.runAlgorithm('dijkstra', node1, node2)
        hideHelperText()
        graphism.setMode('normal')
      }, true)
    }, true)
  })
}

/**
 * Execute create new node
 */
function addNode(graphism: Graphism) {
  const name = <HTMLFormElement>document.getElementById('name')
  document.querySelector('.modal-add').classList.remove('modal-open')

  showHelperText(`Click anywhere to create ${name.value} node`)

  graphism.setMode('creating')
  graphism.on('canvas:click', (coordinate: Coordinate) => {
    console.log('canvas:click')
    const nameVal = name ? name.value : ''
    graphism.createNode(nameVal, coordinate)
    createNotification('success', `Node ${nameVal} created`)
    hideHelperText()
  }, true)
}

/**
 * Start connecting mode in canvas
 */
function connectNode(graphism: Graphism) {
  graphism.setMode('connecting')
  showHelperText('Click any node to connect')
  graphism.clearSelectedNodes()
  graphism.on('node:select', (node1: NodeInterface) => {
    // On node 1 selected
    graphism.on('node:select', (node2: NodeInterface) => {
      console.log('connecting two node')

      // On node 2 selected
      // Show the poppover for user to input line text
      const poppoverEl = showPoppover('poppover-text', {
        x: node2.position.x,
        y: node2.position.y,
      })

      const textForm = poppoverEl.querySelector('form')
      textForm.addEventListener('submit', (e: SubmitEvent) => {
        e.preventDefault()
        const text = (document.getElementById('distance-value') as HTMLInputElement).value
        graphism.addNodeNeighbor(node1, node2, text === '' ? null : ~~text)
        graphism.clearSelectedNodes()
        graphism.setMode('normal')
        poppoverEl.style.visibility = 'hidden'
      }, { once: true })
    }, true)
  }, true)
  graphism.on('node:connect', () => {
    hideHelperText()
  }, true)
}

/**
 * Create new and start with random graph
 */
function generateGraphEvent(graphism: Graphism) {
  graphism.generateGraph()
  hideTitleScreen()
}

/**
 * Create new and start with clean canvas
 */
function createNewGraph() {
  hideTitleScreen()
}

/**
 * Hide the title screen
 */
function hideTitleScreen() {
  const titleScreen = document.querySelector<HTMLElement>('.page-title')
  titleScreen.classList.toggle('show')
}

const helperText = <HTMLElement>document.getElementById('helper-text')

/**
 * Show a helper text with custom text
 * @param text The text to be shown
 * @param blink Blink animation for the text
 */
function showHelperText(text: string, blink = true) {
  if (blink)
    helperText.classList.add('blinking')

  helperText.innerText = text
  helperText.classList.add('show')
}

/**
 * Hide the helper text
 */
function hideHelperText() {
  helperText.classList.remove('blinking')
  helperText.classList.remove('show')
}

function resizeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  canvas.setAttribute('width', canvas.width.toString())
  canvas.setAttribute('height', canvas.height.toString())
}

function createProxy<T extends object>(graphism: Graphism, target: T): T {
  return new Proxy(target, {
    set(obj, prop, value) {
      obj[prop] = value

      // Change the input value
      const input = <HTMLInputElement>document.getElementById(`custom-${camelToSnakeCase(prop)}`)
      input.value = value

      // Change the configuration in the node
      graphism.getSelectedNodes()[0].config[prop] = value

      return true
    },
  })
}

function customizationHandler<T extends object>(obj: T) {
  Object.keys(obj).forEach((key) => {
    let input = <HTMLInputElement>document.getElementById(`custom-${camelToSnakeCase(key)}`)
    if (!input)
      input = document.querySelector<HTMLInputElement>(key)

    input.addEventListener('input', () => obj[key] = input.value)
  })
}
