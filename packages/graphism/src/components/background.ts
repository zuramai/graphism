import { createElementNS } from '../utils/dom'

type BackgroundType = 'grid' | HTMLImageElement | CanvasPattern

class Background {
  root: SVGElement
  type: BackgroundType = 'grid'
  grid: HTMLImageElement

  constructor(root: SVGElement, type: BackgroundType) {
    this.root = root
    this.type = type
  }

  createGrid() {
    const svg = createElementNS('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'background' }, (svgEl) => {
      const defs = createElementNS('defs', {}, (defsEl) => {
        const smallGridPattern = createElementNS('pattern', { id: 'smallGrid', width: '8', height: '8', patternUnits: 'userSpaceOnUse' }, (smallGridEl) => {
          const path = createElementNS('path', { 'd': 'M 8 0 L 0 0 0 8', 'fill': 'none', 'stroke': 'rgb(203 213 225)', 'stroke-width': '.5' })
          smallGridEl.append(path)
        })
        const gridPattern = createElementNS('pattern', { id: 'grid', width: '80', height: '80', patternUnits: 'userSpaceOnUse' }, (smallGridEl) => {
          const rect = createElementNS('rect', { width: '80', height: '80', fill: 'url(#smallGrid)' })
          const path2 = createElementNS('path', { 'd': 'M 80 0 L 0 0 0 80', 'fill': 'none', 'stroke': 'rgb(148 163 184)', 'stroke-width': '.5' })
          smallGridEl.append(rect)
          smallGridEl.append(path2)
        })
        defsEl.append(smallGridPattern)
        defsEl.append(gridPattern)
      })
      svgEl.append(createElementNS('rect', { width: '100%', height: '100%', fill: 'url(#grid)', id: 'bg-grid-rect' }))
      svgEl.appendChild(defs)
    })

    // Set svg to full width
    svg.setAttribute('width', document.body.clientWidth.toString())
    svg.setAttribute('height', document.body.clientHeight.toString())

    console.log('drawing background')

    return svg
  }

  draw() {
    if (this.type === 'grid') {
      this.root.append(this.createGrid())
    }
    else if (typeof this.type == 'string' || this.type instanceof CanvasPattern) {

    }
    else if (this.type instanceof HTMLImageElement) {

    }
  }
}

export const createBackground = (root: SVGElement, type: BackgroundType) => {
  return new Background(root, type)
}
