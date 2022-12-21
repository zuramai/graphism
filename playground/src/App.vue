<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Coordinate, Graphism, NodeInterface } from 'graphism'
import { createGraphism } from 'graphism'
import { saveSvg } from '../../packages/graphism/src/utils'
import { camelToSnakeCase } from './utils'
import { showPoppover} from './ui'
import usePoppover from './composables/usePoppover'
import useModal from './composables/useModal'
import Navbar from './components/Navbar.vue'
import Poppover from './components/Poppover.vue'
import Modal from './components/Modal.vue'
import Sidebar from './components/Sidebar.vue'

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

const mode = ref('')
const poppoverText = usePoppover()
const modalAdd = useModal()

let graphism
const root = ref()

const navMenuClick = (menu: string) => {
  if(menu == 'add-node') modalAdd.show()
  else if(menu == 'connect') connectNode(graphism)
  else if(menu == 'save') saveSvg(graphism.root, 'graphism.png')
  else if(menu == 'clear') graphism.clear()
  // onSubmit('form-add-node', e => e.preventDefault())
}

onMounted(() => {
  graphism = createGraphism({
      el: root.value
  }) 
  
  // Customization provider
  const proxy = createProxy(graphism, customizations)
  // customizationHandler(proxy)

  graphism.generateGraph()
  window.addEventListener('resize', resizeCanvas.bind(null, canvas))
})

const setMode = (toMode: string) => {
  mode.value = toMode
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

// function customizationHandler<T extends object>(obj: T) {
//   Object.keys(obj).forEach((key) => {
//     let input = <HTMLInputElement>document.getElementById(`custom-${camelToSnakeCase(key)}`)
//     if (!input)
//       input = document.querySelector<HTMLInputElement>(key)

//     input.addEventListener('input', () => obj[key] = input.value)
//   })
// }

</script>
<template>
    <main>
        <div id="playground-container">
            <!-- Start: Canvas Playground -->
            <div class="playground">
                <!-- Start: Playground Menu -->
                <Navbar @menu-click="navMenuClick"></Navbar>
                <!-- End: Playground Menu -->

                <div id="graphism" ref="root"></div>

                <!-- Helper text -->
                <div id="helper-text" class="blinking">This is helper text</div>
            </div>
            <!-- End: Canvas Playground -->

            <Sidebar></Sidebar>
        </div>

        <div class="notifications">
            <!-- Notifications will apear in here -->
        </div>

        <!-- Distance input poppover -->
        <Poppover title="Text" :x="poppoverText.x.value" :y="poppoverText.y.value" v-show="poppoverText.show">
            <form class="flex mt-3">
                <input type="text" class="form-control" value="" id="distance-value" />
                <button class="btn btn-primary ml-3">Submit</button>
            </form>
        </Poppover>

        <!-- Add node modal -->
        <Modal class="modal-add" title="Add Node" v-model="modalAdd.isShow.value">
            <form @submit.prevent="setMode('puttingNode')" id="form-add-node">
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
                    <button @click.prevent="modalAdd.hide()" class="btn btn-danger modal-close">Cancel</button>
                </div>
            </form>
        </Modal>
    </main>
</template>
