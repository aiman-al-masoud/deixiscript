import { GraphNode } from "./Node"

export function drawNode(context: CanvasRenderingContext2D, node: GraphNode) {
    context.beginPath()
    context.fillStyle = node.fillStyle
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true)
    context.strokeStyle = node.strokeStyle
    context.fillStyle = node.fillStyle
    context.stroke()
    context.fill()
    context.fillStyle = "#FF0000"
    context.font = "20px Arial";
    const offset = 10 * node.label.length / 2 //some magic in here!
    context.fillText(node.label, node.x - offset, node.y)
}
