import { AstNode } from "../frontend/parser/interfaces/AstNode"
import { astToEdgeList } from "./astToEdgeList"
import { drawLine } from "./drawLine"
import { drawNode } from "./drawNode"
import { getCoords } from "./getCoords"

export function plotAst(context: CanvasRenderingContext2D, ast: AstNode) {

    context.clearRect(0, 0, context.canvas.width, context.canvas.height)

    const rect = context.canvas.getBoundingClientRect()

    const edges = astToEdgeList(ast)
    const coords = getCoords({ x: rect.x - rect.width / 2, y: rect.y }, edges)

    Object.entries(coords).forEach(c => {

        const name = c[0]
        const pos = c[1]

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

        const from = coords[e[0]]
        const to = coords[e[1]]

        if (from && to) {
            drawLine(context, from, to)
        }

    })
}
