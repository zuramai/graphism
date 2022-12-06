import type { NodeInterface } from './node'
import type { ComponentInterface } from '.'

export interface LineConfig {
  color?: string
  hoverColor?: string
  selectedColor?: string
  width?: number
  text?: string
}

export interface LineInterface extends ComponentInterface {
  id: number
  config?: LineConfig
  from: NodeInterface
  to: NodeInterface
  isHovered: boolean
  updateLinePosition: () => void
  draw: (root: SVGGElement) => void
}

export interface LineEventsMap {
  'line:select': (line: LineInterface) => void
  'line:deselect': (line: LineInterface) => void
  'line:clearSelect': () => void
  'line:mouseover': (line: LineInterface) => void
}
