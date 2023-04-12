import { Thing } from "../backend/Thing";
import { BrainListener } from "../facade/BrainListener";
import { AstNode } from "../frontend/parser/interfaces/AstNode";
import { plotAst } from "./plotAst";

export class AstCanvas implements BrainListener {

    readonly div = document.createElement('div')
    protected canvas = document.createElement('canvas')
    protected context: CanvasRenderingContext2D | null

    constructor() {
        this.div.appendChild(this.canvas)
        this.canvas.width = window.innerWidth / 2
        this.canvas.height = window.innerHeight /// 2
        this.context = this.canvas.getContext('2d')
    }

    onUpdate(ast: AstNode, results: Thing[]): void {

        if (!this.context) {
            throw new Error('Canvas context is undefined!')
        }

        plotAst(this.context, ast)
    }

}