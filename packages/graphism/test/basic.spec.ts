import { describe, expect, test } from 'vitest'
import { createGraphism } from './../src'

describe('render graphism', async() => {
  const el = document.createElement('canvas')
  const graph = createGraphism({ el })

  test('canvas rendered correctly', () => {
    expect(graph.canvas).toBeInstanceOf(HTMLCanvasElement)
  })
})
