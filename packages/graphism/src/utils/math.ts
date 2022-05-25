import { Coordinate } from "../types";

/**
 * Calculate Distance between two points
 * @param a Point 1
 * @param b Point 2
 */
export function distance(a: Coordinate, b: Coordinate): number {
    return Math.sqrt(
        Math.abs(a.x - b.x) ** 2 + 
        Math.abs(a.y - b.y) ** 2
    )
}