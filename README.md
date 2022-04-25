# Graphism
Graphism is a tool to create graph visualization and run an algorithm on top of it.

[Live Demo](https://zuramai.github.io/graphism) (built with Vanilla JavaScript!)

## Features

- Vanilla JavaScript - integrate into any framework you like
- Run algorithms on the graph (like Kruskal's algorithm, Dijkstra's algorithm, etc)
- Design your own graph

## Install

```bash
npm i graphism
```

```html
<canvas id="canvas">
```

```js
import { createGraphism } from 'graphism'

const graphism = createGraphism({
    el: '#canvas',
    canvasBackground: '#eee'
})

// Generate an random graph
graphism.generateGraph()

```

## License
MIT
