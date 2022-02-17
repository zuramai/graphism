import './assets/scss/main.scss'
import { Canvas } from "./playground/canvas"
import { Nodee } from "./playground/node"

const canvasEl = document.querySelector('canvas')

// Create the canvas instance
const canvas = new Canvas(canvasEl, [])
const helperText = <HTMLElement>document.getElementById('helper-text')

// Event listeners
document.getElementById('node-add').addEventListener('click', addNode)
document.getElementById('generate-graph').addEventListener('click', generateGraphEvent)
document.getElementById('create-new').addEventListener('click', createNewGraph)

/**
 * Execute create new node
 */
function addNode() {
    let name = <HTMLFormElement>document.getElementById("name")
    document.querySelector('.modal-add').classList.remove('modal-open')

    showHelperText(`Click anywhere to create ${name.value} node`)

    canvas.waitingForClick().then(coordinate => {
        canvas.createNode(name ? name.value : "", coordinate)
        hideHelperText()
    })
}

/**
 * Create new and start with random graph
 */
function generateGraphEvent() {
    const nodes = generateGraph(canvas)
    canvas.nodes = nodes
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
    let titleScreen = document.querySelector<HTMLElement>('.page-title')
    titleScreen.classList.toggle('show')
}

/**
 * Show a helper text with custom text
 * @param text The text to be shown
 * @param blink Blink animation for the text
 */
function showHelperText(text: string, blink: boolean = true) {
    if(blink) {
        helperText.classList.add('blinking')
    }
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

/**
 * Generate node at random points
 * @param canvas Canvas instance
 * @returns A set of nodes
 */
function generateGraph(canvas: Canvas): Nodee[] {

    // Create new node
    const nodeJakarta = canvas.createNode("Jakarta", { x: 130, y: 274 })
    const nodeBandung = canvas.createNode("Bandung", { x: 390, y: 200 })

    canvas.addNodeNeighbor(nodeBandung, nodeJakarta, 100)
    canvas.addNodeNeighbor(nodeJakarta, nodeBandung, 100)

    const nodes = [nodeJakarta, nodeBandung]

    return nodes
}