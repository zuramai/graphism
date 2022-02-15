import './assets/scss/main.scss'
import { Canvas } from "./playground/canvas"
import { Nodee } from "./playground/node"

const canvasEl = document.querySelector('canvas')
const canvas = new Canvas(canvasEl, [])

document.getElementById('node-add').addEventListener('click', () => {
    let name = <HTMLFormElement>document.getElementById("name")
    document.querySelector('.modal-add').classList.remove('modal-open')

    showHelperText(`Click anywhere to create ${name.value} node`)

    canvas.waitingForClick().then(coordinate => {
        canvas.createNode(coordinate, name.value)
        hideHelperText()
    })
})

document.getElementById('generate-graph').addEventListener('click', () => {
    const nodes = generateGraph()
    canvas.nodes = nodes
    hideTitleScreen()
})

document.getElementById('create-new').addEventListener('click', () => {
    hideTitleScreen()
})

function hideTitleScreen() {
    let titleScreen = document.querySelector<HTMLElement>('.page-title')
    titleScreen.classList.toggle('show')
}

let helperText = <HTMLElement>document.getElementById('helper-text')

function showHelperText(text: string, blink: boolean = true) {
    if(blink) {
        helperText.classList.add('blinking')
    }
    helperText.innerText = text
    helperText.classList.add('show')
}

function hideHelperText() {
    helperText.classList.remove('blinking')
    helperText.classList.remove('show')
}

function generateGraph(): Nodee[] {

    // Create new node
    const nodeJakarta: Nodee = new Nodee("Jakarta")
    const nodeBandung: Nodee = new Nodee("Bandung")

    nodeJakarta.position = { x: 130, y: 274 }
    nodeBandung.position = { x: 390, y: 200 }

    nodeJakarta.addNeighbor(nodeBandung, 100)
    nodeBandung.addNeighbor(nodeJakarta, 100)

    const nodes = [nodeJakarta, nodeBandung]

    return nodes
}