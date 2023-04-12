import { AstNode } from "../frontend/parser/interfaces/AstNode"
import { astToEdgeList } from "./astToEdgeList"
import { drawLine } from "./drawLine"
import { drawNode } from "./drawNode"
import { getPos } from "./getPos"

export function plotAst(context: CanvasRenderingContext2D, ast: AstNode) {

    context.clearRect(0, 0, context.canvas.width, context.canvas.height)

    const rect = context.canvas.getBoundingClientRect()

    const edges = astToEdgeList(ast)
    const positions = getPos({ x: rect.x - rect.width / 2, y: rect.y }, edges)

    Object.entries(positions).forEach(e => {

        const name = e[0]
        const pos = e[1]

        drawNode(context, {
            x: pos.x,
            y: pos.y,
            radius: 2, //10
            fillStyle: '#22cccc',
            strokeStyle: '#009999',
            label: name.replaceAll(/\d+/g, '')
        })

    })

    edges.forEach(e => {

        const from = positions[e[0]]
        const to = positions[e[1]]

        if (from && to) {
            drawLine(context, from, to)
        }

    })
}
