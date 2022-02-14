import {NodeInterface} from "./node"


export interface CanvasInterface {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    nodes: NodeInterface[]

    init(): void
    
    solve(): void
    update(): void
    draw(): void
    render(): void
}

export interface Coordinate {
    x: number
    y: number
}