import './assets/scss/main.scss'
import { Canvas } from "./playground/canvas"
import { Nodee } from "./playground/node"

const canvasEl = document.querySelector('canvas')

// Create new node
const nodeJakarta: Nodee = new Nodee("Jakarta")
const nodeBandung: Nodee = new Nodee("Bandung")

nodeJakarta.addNeighbor(nodeBandung, 100)
nodeBandung.addNeighbor(nodeJakarta, 100)

const nodes = [nodeJakarta, nodeBandung]

const canvas = new Canvas(canvasEl, nodes)
