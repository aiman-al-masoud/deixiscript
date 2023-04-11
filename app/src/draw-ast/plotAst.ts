import { AstNode } from "../frontend/parser/interfaces/AstNode"
import { astToEdgeList } from "./astToEdgeList"
import { drawLine } from "./drawLine"
import { drawNode } from "./drawNode"
import { getPos } from "./getPos"

export function plotAst(context: CanvasRenderingContext2D, ast: AstNode) {

    const edges = astToEdgeList(ast)
    const positions = getPos(edges)

    console.log(edges)

    Object.entries(positions).forEach(e => {
        const name = e[0]
        const pos = e[1]

        drawNode(context,
            {
                x: pos.x,
                y: pos.y,
                radius: 10,
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
