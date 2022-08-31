import type { LineInterface } from '../types/line'
import type { NeighborInterface, NodeInterface } from '../types'
import type { DistanceMap, ProgressStack, ShortestPathAlgorithm } from '../types/algorithm'

export default class DijkstraAlgorithm implements ShortestPathAlgorithm {
  endNode: NodeInterface
  nodes: NodeInterface[] = []
  path: (NodeInterface | LineInterface)[] = []
  startNode: NodeInterface
  progressStack: ProgressStack[] = []

  constructor(nodes: NodeInterface[], startNode: NodeInterface, endNode: NodeInterface) {
    this.nodes = nodes
    this.startNode = startNode
    this.endNode = endNode
  }

  solve() {
    const fromId = this.startNode.id
    const distanceSet: Record<number, DistanceMap> = {}
    const isVisited: Record<number, boolean> = {}

    this.nodes.forEach((node) => {
      isVisited[node.id] = false
      distanceSet[node.id] = {
        distance: node.id === fromId ? 0 : Infinity,
        parent: null,
      }
    })

    let currentNode = this.startNode
    for (let i = 0; i < Object.keys(isVisited).length; i++) {
      let shortestNeighborDistance: Number = Infinity
      let shortestNeighbor: NeighborInterface = null
      currentNode.neighbors.forEach((neighbor) => {
        if (!isVisited[neighbor.node.id]
          && neighbor.distance + distanceSet[currentNode.id].distance < distanceSet[neighbor.node.id].distance) {
          distanceSet[neighbor.node.id].distance = neighbor.distance + distanceSet[currentNode.id].distance
          distanceSet[neighbor.node.id].parent = currentNode.id
          distanceSet[neighbor.node.id].line = neighbor.line
        }

        if (neighbor.distance < shortestNeighborDistance) {
          shortestNeighbor = neighbor
          shortestNeighborDistance = shortestNeighbor.distance
        }
      })

      isVisited[currentNode.id] = true

      currentNode = shortestNeighbor.node
    }

    this.path = [this.endNode, distanceSet[this.endNode.id].line]
    let endNode = distanceSet[this.endNode.id].parent
    while (endNode) {
      const node = this.nodes.find(n => n.id === endNode)
      this.path.push(node)
      this.path.push(distanceSet[endNode].line)
      endNode = distanceSet[endNode].parent
    }
    return this.path.reverse()
  }
}
