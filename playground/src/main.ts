import './assets/scss/main.scss'
import { createGraphism } from "../../packages/graphism/src"
import { NodeInterface } from '../../packages/graphism/src/types'
import { Graphism } from 'graphism'

window.onload = () => {
    const el = document.querySelector<HTMLCanvasElement>('#canvas')

    // Create the canvas instance
    const graphism = createGraphism({
        el,
        canvasBackground: "#efefef",
    })
    
    
    // Event listeners
    document.getElementById('node-add').addEventListener('click', addNode.bind(null, graphism))
    document.getElementById('generate-graph').addEventListener('click', generateGraphEvent.bind(null, graphism))
    document.getElementById('create-new').addEventListener('click', createNewGraph)
    document.getElementById('connectNode').addEventListener('click', connectNode.bind(null, graphism))
    
}


/**
 * Execute create new node
 */
function addNode(graphism: Graphism) {
    let name = <HTMLFormElement>document.getElementById("name")
    document.querySelector('.modal-add').classList.remove('modal-open')

    showHelperText(`Click anywhere to create ${name.value} node`)

    graphism.setMode("creating")
    graphism.on("canvas:click", (coordinate) => {
        let nameVal = name ? name.value : ""
        graphism.createNode(nameVal, coordinate)
        createNotification("success", `Node ${nameVal} created`)
        hideHelperText()
    }, true)
}


/**
 * Start connecting mode in canvas
 */
function connectNode(graphism: Graphism) {
    graphism.setMode('connecting')
    showHelperText("Click any node to connect")

    graphism.on("node:connect", (node1: NodeInterface, node2: NodeInterface) => {
        hideHelperText()
    }) 
}

/**
 * Create new and start with random graph
 */
function generateGraphEvent(graphism: Graphism) {
    const nodes = graphism.generateGraph()
    graphism.nodes = nodes
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

const helperText = <HTMLElement>document.getElementById('helper-text')

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
 * 
 * @param type The notification type (primary, danger, warning)
 * @param text Text content to be displayed in notification
 * @param duration The duration of notification to stay visible
 */
function createNotification(type: string, text: string, duration: number =  2000) {
    let notif = document.createElement('div')
    notif.classList.add("notification")
    notif.classList.add(`notification-${type}`)
    notif.innerText = text

    let btn = document.createElement('button')
    let svgClose = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    let path = document.createElementNS('http://www.w3.org/2000/svg', "path")
    svgClose.setAttribute('width', "16")
    svgClose.setAttribute('height', "16")
    path.setAttribute("d", "M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z")
    
    
    svgClose.appendChild(path)
    btn.appendChild(svgClose)
    notif.appendChild(btn)

    let wrapper = document.querySelector('.notifications')
    wrapper.appendChild(notif)

    setTimeout(() => wrapper.removeChild(notif), duration)

    btn.addEventListener('click', () => {
        wrapper.removeChild(notif)
    },{once: true})
}