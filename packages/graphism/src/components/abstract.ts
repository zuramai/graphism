import { Coordinate } from "../../dist";
import { ComponentInterface } from "../types";

export abstract class Component implements ComponentInterface {
    name: "node" | "line" = "line";
    isHovered: boolean = false
    isSelected: boolean = false
    moveFrom: Coordinate

    abstract isOnCoordinate(coordinate: Coordinate): boolean
    abstract move (x?: number, y?: number): void
}