import type { NodeEventsMap } from './node'
import type { LineEventsMap } from './line'

export * from './line'
export * from './node'

export interface Coordinate {
  x: number
  y: number
}

export interface GraphismOptions {
  el?: HTMLDivElement | string
  canvasBackground?: string | CanvasPattern | HTMLImageElement
  lineColor?: string
  nodeBackground?: string
  grid?: boolean
  nodeTextColor?: string
}

export type Mode = 'normal' | 'connecting' | 'creating'

export interface EventsMap extends NodeEventsMap, LineEventsMap {
  grab: () => void
  mounted: () => void
  error: (message: string) => void

  'canvas:click': (coordinate: Coordinate) => void
}

export interface ComponentInterface {
  isHovered: boolean
  isSelected: boolean
  moveFrom: Coordinate
  name: 'node' | 'line'

  select(): void
  deselect(): void
  move: (x?: number, y?: number) => void
}
