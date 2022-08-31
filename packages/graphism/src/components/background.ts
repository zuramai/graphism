import { createElementNS } from '../utils/dom'

type BackgroundType = 'grid' | HTMLImageElement | CanvasPattern

class Background {
  ctx: CanvasRenderingContext2D
  type: BackgroundType = 'grid'
  grid: HTMLImageElement

  constructor(ctx: CanvasRenderingContext2D, type: BackgroundType) {
    this.ctx = ctx
    this.type = type

    if (this.type === 'grid')
      this.createGrid()
  }

  createGrid() {
    const svg = createElementNS('svg', { xmlns: 'http://www.w3.org/2000/svg' }, (svgEl) => {
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
      svgEl.append(createElementNS('rect', { width: '100%', height: '100%', fill: 'url(#grid)' }))
      svgEl.appendChild(defs)
    })

    // Set svg to full width
    svg.setAttribute('width', document.body.clientWidth.toString())
    svg.setAttribute('height', document.body.clientHeight.toString())

    const xml = new XMLSerializer().serializeToString(svg)
    const svg64 = btoa(xml)
    const b64Start = 'data:image/svg+xml;base64,'
    const image64 = b64Start + svg64
    const img = new Image()
    img.src = image64
    this.grid = img
    console.log(img)

    this.ctx.drawImage(
      img,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    )
  }

  draw() {
    const canvas = this.ctx.canvas

    if (this.type === 'grid') {
      this.ctx.drawImage(
        this.grid,
        0,
        0,
        canvas.width,
        canvas.height,
      )
      return
    }

    if (
      typeof this.type == 'string'
      || this.type instanceof CanvasPattern
    ) {
      this.ctx.fillStyle = this.type
      this.ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    else if (this.type instanceof HTMLImageElement) {
      this.ctx.drawImage(
        this.type,
        0,
        0,
        canvas.width,
        canvas.height,
      )
    }
  }
}

export const createBackground = (ctx: CanvasRenderingContext2D, type: BackgroundType) => {
  return new Background(ctx, type)
}
