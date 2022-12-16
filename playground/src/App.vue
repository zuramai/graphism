<script setup lang="ts">
import { onMounted } from 'vue'
import type { Coordinate, Graphism, NodeInterface } from 'graphism'
import { createGraphism } from 'graphism'
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
onMounted(() => {
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
})

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

</script>
<template>
    <main>
        <div id="playground-container">
            <!-- Start: Canvas Playground -->
            <div class="playground">
                <!-- Start: Playground Menu -->
                <ul class="menu">
                    <li class="menu-item">
                        <a href="#" id="openAddModal">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-plus-circle"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                                />
                                <path
                                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                                />
                            </svg>
                            <span>Add node</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="#" id="connectNode">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-bezier2"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M1 2.5A1.5 1.5 0 0 1 2.5 1h1A1.5 1.5 0 0 1 5 2.5h4.134a1 1 0 1 1 0 1h-2.01c.18.18.34.381.484.605.638.992.892 2.354.892 3.895 0 1.993.257 3.092.713 3.7.356.476.895.721 1.787.784A1.5 1.5 0 0 1 12.5 11h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5H6.866a1 1 0 1 1 0-1h1.711a2.839 2.839 0 0 1-.165-.2C7.743 11.407 7.5 10.007 7.5 8c0-1.46-.246-2.597-.733-3.355-.39-.605-.952-1-1.767-1.112A1.5 1.5 0 0 1 3.5 5h-1A1.5 1.5 0 0 1 1 3.5v-1zM2.5 2a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm10 10a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"
                                />
                            </svg>
                            <span>Connect</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        <a href="#" id="saveToImage">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-cloud-arrow-down"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M7.646 10.854a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 9.293V5.5a.5.5 0 0 0-1 0v3.793L6.354 8.146a.5.5 0 1 0-.708.708l2 2z"
                                />
                                <path
                                    d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"
                                />
                            </svg>
                            <span>Save</span>
                        </a>
                    </li>
                    <li class="menu-item has-dropdown">
                        <a href="#" id="connectNode">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="currentColor"
                                class="bi bi-play"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
                                />
                            </svg>
                            <span>Run Algorithm</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                fill="currentColor"
                                class="bi bi-chevron-down"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                />
                            </svg>
                        </a>
                        <ul class="dropdown-menu">
                            <li class="dropdown-item dropdown-title">
                                <a>Shortest Paths</a>
                            </li>
                            <li class="dropdown-item">
                                <a href="#" id="solve-dijkstra">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        class="bi bi-play"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
                                        />
                                    </svg>
                                    <span>Dijkstra's Algorithm</span>
                                </a>
                            </li>
                            <li class="dropdown-item">
                                <a href="#" id="solve-aStar">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        class="bi bi-play"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
                                        />
                                    </svg>
                                    <span>A* Algorithm</span>
                                </a>
                            </li>
                            <li class="dropdown-item dropdown-title">
                                <a>Minimum Spanning Tree</a>
                            </li>
                            <li class="dropdown-item">
                                <a href="#" id="solve-kruskal">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        class="bi bi-play"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
                                        />
                                    </svg>
                                    <span> Kruskal's Algorithm </span>
                                </a>
                            </li>
                            <li class="dropdown-item">
                                <a href="#" id="solve-prim">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        class="bi bi-play"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
                                        />
                                    </svg>
                                    <span> Prim's Algorithm </span>
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li class="menu-item">
                        <a href="#" id="clear">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-trash3"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"
                                />
                            </svg>
                            <span>Clear</span>
                        </a>
                    </li>
                    <li class="menu-item ml-auto">
                        <a
                            href="https://github.com/zuramai/graphism"
                            target="_blank"
                            id="clear"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-github"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                                />
                            </svg>
                        </a>
                    </li>
                </ul>
                <!-- End: Playground Menu -->

                <div id="graphism"></div>

                <!-- Helper text -->
                <div id="helper-text" class="blinking">This is helper text</div>
            </div>
            <!-- End: Canvas Playground -->

            <div class="sidebar">
                <ul class="icons">
                    <li class="sidebar-item sidebar-icon">
                        <a href="#" class="sidebar-group-icon" title="Font">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="currentColor"
                                class="bi bi-fonts"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479L12.258 3z"
                                />
                            </svg>
                        </a>
                        <div class="sidebar-sub">
                            <div class="grid two-cols">
                                <div class="form-group">
                                    <label for="font-style">Font Size</label>
                                    <input
                                        type="number"
                                        value="16"
                                        id="custom-font-size"
                                        class="form-input"
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="font-style">Alignment</label>
                                    <div class="flex">
                                        <input
                                            type="radio"
                                            class="radio-hidden"
                                            name="custom-text-align"
                                            id="align-left"
                                        />
                                        <label for="align-left" href="#" class="btn">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                class="bi bi-text-left"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                                                />
                                            </svg>
                                        </label>

                                        <input
                                            type="radio"
                                            class="radio-hidden"
                                            name="custom-text-align"
                                            id="align-center"
                                        />
                                        <label for="align-center" href="#" class="btn">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                class="bi bi-text-left"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                                                />
                                            </svg>
                                        </label>

                                        <input
                                            type="radio"
                                            class="radio-hidden"
                                            name="custom-text-align"
                                            id="align-right"
                                        />
                                        <label for="align-right" href="#" class="btn">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                class="bi bi-text-left"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                                                />
                                            </svg>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="font-style">Font Family</label>
                                <select
                                    name="font-family"
                                    id="custom-font-family"
                                    class="form-input"
                                >
                                    <option value="Lora">Lora</option>
                                    <option value="Arial">Arial</option>
                                    <option value="Helvetica">Helvetica</option>
                                    <option value="Verdana">Verdana</option>
                                    <option value="Times New Roman">
                                        Times New Roman
                                    </option>
                                    <option value="Garamond">Garamond</option>
                                    <option value="Comic Sans MS">Comic Sans MS</option>
                                    <option value="Courier New">Courier New</option>
                                    <option value="Georgie">Georgie</option>
                                    <option value="Lucida Console">Lucida Console</option>
                                    <option value="Tahoma">Tahoma</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="font-style">Color</label>
                                <input
                                    type="color"
                                    id="custom-text-color"
                                    class="form-input"
                                />
                            </div>
                        </div>
                    </li>
                    <li class="sidebar-item sidebar-icon">
                        <a href="#" class="sidebar-group-icon" title="Shape">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="currentColor"
                                class="bi bi-heptagon"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M7.779.052a.5.5 0 0 1 .442 0l6.015 2.97a.5.5 0 0 1 .267.34l1.485 6.676a.5.5 0 0 1-.093.415l-4.162 5.354a.5.5 0 0 1-.395.193H4.662a.5.5 0 0 1-.395-.193L.105 10.453a.5.5 0 0 1-.093-.415l1.485-6.676a.5.5 0 0 1 .267-.34L7.779.053zM2.422 3.813l-1.383 6.212L4.907 15h6.186l3.868-4.975-1.383-6.212L8 1.058 2.422 3.813z"
                                />
                            </svg>
                        </a>
                        <div class="sidebar-sub">
                            <div class="form-group">
                                <label for="font-style">Shape</label>
                                <div class="flex gap-2">
                                    <a href="#" class="btn">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            class="bi bi-square"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                                            />
                                        </svg>
                                    </a>
                                    <a href="#" class="btn btn-active">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            class="bi bi-diamond"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"
                                            />
                                        </svg>
                                    </a>
                                    <a href="#" class="btn">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            class="bi bi-circle"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                                            />
                                        </svg>
                                    </a>
                                    <a href="#" class="btn">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            class="bi bi-hexagon"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M14 4.577v6.846L8 15l-6-3.577V4.577L8 1l6 3.577zM8.5.134a1 1 0 0 0-1 0l-6 3.577a1 1 0 0 0-.5.866v6.846a1 1 0 0 0 .5.866l6 3.577a1 1 0 0 0 1 0l6-3.577a1 1 0 0 0 .5-.866V4.577a1 1 0 0 0-.5-.866L8.5.134z"
                                            />
                                        </svg>
                                    </a>
                                    <a href="#" class="btn">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            class="bi bi-triangle"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div class="grid two-cols">
                                <div class="form-group">
                                    <label for="custom-background-color"
                                        >Background Color</label
                                    >
                                    <input
                                        type="color"
                                        id="custom-background-color"
                                        class="form-input"
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="custom-hover-background-color"
                                        >Background Color</label
                                    >
                                    <input
                                        type="color"
                                        id="custom-hover-background-color"
                                        class="form-input"
                                    />
                                </div>
                            </div>
                            <div class="grid two-cols">
                                <div class="form-group">
                                    <label for="custom-border-color">Border Color</label>
                                    <input
                                        type="color"
                                        id="custom-border-color"
                                        class="form-input"
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="custom-border-hover-color"
                                        >Border Hover Color</label
                                    >
                                    <input
                                        type="color"
                                        id="custom-hover-border-color"
                                        class="form-input"
                                    />
                                </div>
                            </div>
                            <div class="grid two-cols">
                                <div class="form-group">
                                    <label for="custom-width">Width</label>
                                    <input
                                        type="number"
                                        value="25"
                                        id="custom-width"
                                        class="form-input"
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="custom-height">Height</label>
                                    <input
                                        type="number"
                                        value="25"
                                        id="custom-height"
                                        class="form-input"
                                    />
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="custom-border-size">Border Size</label>
                                <input
                                    type="number"
                                    value="2"
                                    id="custom-border-size"
                                    class="form-input"
                                />
                            </div>
                        </div>
                    </li>
                    <li class="sidebar-item sidebar-icon">
                        <a
                            href="#"
                            class="sidebar-group-icon"
                            title="Line options"
                            id="options-line"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="currentColor"
                                class="bi bi-slash-lg"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                                />
                            </svg>
                        </a>
                        <div class="sidebar-sub">
                            <div class="form-group">
                                <label for="font-style">Line</label>
                                <div class="flex gap-2">
                                    <a href="#" class="btn">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            class="bi bi-square"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                                            />
                                        </svg>
                                    </a>
                                    <a href="#" class="btn">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            class="bi bi-square"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div class="grid two-cols">
                                <div class="form-group">
                                    <label for="custom-background-color"
                                        >Background Color</label
                                    >
                                    <input
                                        type="color"
                                        id="line-background-color"
                                        class="form-input"
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="custom-hover-background-color"
                                        >Background Hover Color</label
                                    >
                                    <input
                                        type="color"
                                        id="line-hover-background-color"
                                        class="form-input"
                                    />
                                </div>
                            </div>
                            <div class="grid two-cols">
                                <div class="form-group">
                                    <label for="custom-border-color">Border Color</label>
                                    <input
                                        type="color"
                                        id="line-border-color"
                                        class="form-input"
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="custom-border-hover-color"
                                        >Border Hover Color</label
                                    >
                                    <input
                                        type="color"
                                        id="line-hover-border-color"
                                        class="form-input"
                                    />
                                </div>
                            </div>
                            <div class="grid two-cols">
                                <div class="form-group">
                                    <label for="custom-width">Width</label>
                                    <input
                                        type="number"
                                        value="25"
                                        id="line-width"
                                        class="form-input"
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="custom-height">Height</label>
                                    <input
                                        type="number"
                                        value="25"
                                        id="line-height"
                                        class="form-input"
                                    />
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="custom-border-size">Border Size</label>
                                <input
                                    type="number"
                                    value="2"
                                    id="line-border-size"
                                    class="form-input"
                                />
                            </div>
                        </div>
                    </li>
                    <li class="sidebar-item sidebar-icon">
                        <a href="#" class="sidebar-group-icon" title="Color">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="#e74c3c"
                                stroke="currentColor"
                                class="bi bi-circle-fill"
                                viewBox="0 0 16 16"
                            >
                                <circle cx="8" cy="8" r="7.5" />
                            </svg>
                        </a>
                    </li>
                    <li class="sidebar-item sidebar-icon">
                        <a href="#" class="sidebar-group-icon" title="Visible">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="currentColor"
                                class="bi bi-eye"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
                                />
                                <path
                                    d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"
                                />
                            </svg>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="notifications">
            <!-- Notifications will apear in here -->
        </div>

        <!-- Distance input poppover -->
        <div class="poppover" id="poppover-text">
            <label for="text">Text</label>
            <form class="flex mt-3">
                <input type="text" class="form-control" value="" id="distance-value" />
                <button class="btn btn-primary ml-3">Submit</button>
            </form>
        </div>

        <!-- Add node modal -->
        <div class="modal modal-add">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add Node</h3>
                    <button class="btn btn-transparent btn-circle">x</button>
                </div>
                <form id="form-add-node">
                    <div class="modal-body">
                        <label for="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            class="form-control"
                            autocomplete="off"
                        />
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="node-add">
                            Add and choose location
                        </button>
                        <button class="btn btn-danger modal-close">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="modal-backdrop"></div>
    </main>
</template>
