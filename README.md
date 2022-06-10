<p align="center">
    <img src="https://user-images.githubusercontent.com/45036724/172974810-4ba481f9-bd24-4128-99aa-ebfdd61cf19a.svg" alt="Graphism Logo" width="400" height="120" align="center">
</p>
<p align="center">
A tool to create graph visualization 
</p>
<p align="center">
    <a href="https://zuramai.github.io/graphism">Playground</a> • <a href="https://zuramai.github.io/graphism/docs">Documentation</a>
</p>

## Features

- Vanilla JavaScript - integrate into any framework you like
- Run algorithms on the graph (like Kruskal's algorithm, Dijkstra's algorithm, etc)
- Design your own graph
- Save graph in .png

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
