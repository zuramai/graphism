import './assets/scss/main.scss'
import { Canvas } from "./playground/canvas"
import { Nodee } from "./playground/node"

const canvasEl = document.querySelector('canvas')

// Create new node
const nodeJakarta: Nodee = new Nodee("Jakarta")
const nodeBandung: Nodee = new Nodee("Bandung")

nodeJakarta.position = { x: 130, y: 274 }
nodeBandung.position = { x: 390, y: 200 }

nodeJakarta.addNeighbor(nodeBandung, 100)
nodeBandung.addNeighbor(nodeJakarta, 100)

const nodes = [nodeJakarta, nodeBandung]

const canvas = new Canvas(canvasEl, nodes)
console.log(canvas.nodes)

const addModal = document.querySelector('.modal')
const openAddModal = document.getElementById('openAddModal')
openAddModal.addEventListener('click', e => {
    addModal.classList.toggle('modal-open')
    console.log('open')
})