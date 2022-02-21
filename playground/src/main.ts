import './assets/scss/main.scss'
import { createGraphism } from "../../packages/graphism/src"

const el = document.querySelector<HTMLCanvasElement>('#canvas')

// Create the canvas instance
const canvas = createGraphism({
    el,
    canvasBackground: "#eee",
})

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
    const nodes = canvas.generateGraph()
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
