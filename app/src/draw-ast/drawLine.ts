import { GraphNode } from "./Node"

export function drawLine(context: CanvasRenderingContext2D, from: { x: number, y: number }, to: { x: number, y: number }) {
    context.beginPath()
    // context.strokeStyle = fromNode.strokeStyle
    context.moveTo(from.x, from.y)
    context.lineTo(to.x, to.y)
    context.stroke()
}