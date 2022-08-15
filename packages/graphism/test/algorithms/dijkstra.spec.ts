import { describe, expect, test } from 'vitest'
import { createGraphism } from '../../src'

const el = document.createElement('canvas')

const graphism = createGraphism({ el })

// Initial state EXAMPLE
const a = graphism.createNode('a', { x: 300, y: 300 })
const b = graphism.createNode('b', { x: 500, y: 450 })
const c = graphism.createNode('c', { x: 550, y: 200 })
const d = graphism.createNode('d', { x: 200, y: 500 })
const e = graphism.createNode('e', { x: 700, y: 420 })
const f = graphism.createNode('f', { x: 1000, y: 420 })
const g = graphism.createNode('g', { x: 500, y: 620 })
const h = graphism.createNode('h', { x: 800, y: 300 })
graphism.addNodeNeighbor(a, b, 100)
graphism.addNodeNeighbor(a, c, 150)
graphism.addNodeNeighbor(a, d, 250)
graphism.addNodeNeighbor(b, e, 50)
graphism.addNodeNeighbor(c, e, 250)
graphism.addNodeNeighbor(f, e, 250)
graphism.addNodeNeighbor(g, d, 1250)
graphism.addNodeNeighbor(g, e, 300)
graphism.addNodeNeighbor(g, f, 400)
graphism.addNodeNeighbor(c, h, 300)
graphism.addNodeNeighbor(h, f, 250)
graphism.addNodeNeighbor(h, e, 200)

describe('dijkstra algorithm', async() => {
  test('algorithm is correct', () => {
    const aToF = graphism.runAlgorithm('dijkstra', a, f)
    expect(aToF).toStrictEqual(['a', 'b', 'e', 'f'])
    const aToH = graphism.runAlgorithm('dijkstra', a, h)
    expect(aToH).toStrictEqual(['a', 'b', 'e', 'h'])
  })
})
