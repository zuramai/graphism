import type { Coordinate } from '../../dist'
import type { ComponentInterface } from '../types'

export abstract class Component implements ComponentInterface {
  name: 'node' | 'line' = 'line'
  isHovered = false
  isSelected = false
  moveFrom: Coordinate

  abstract isOnCoordinate(coordinate: Coordinate): boolean
  abstract move (x?: number, y?: number): void
}
