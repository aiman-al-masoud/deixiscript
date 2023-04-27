import { Thing } from "../backend/things/Thing";
import { BrainListener } from "../facade/BrainListener";
import { AstNode } from "../frontend/parser/interfaces/AstNode";
import { plotAst } from "./plotAst";

export class AstCanvas implements BrainListener {

    readonly div = document.createElement('div')
    protected canvas = document.createElement('canvas')
    protected context: CanvasRenderingContext2D | null
    protected cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    protected isDragging = false
    protected dragStart = { x: 0, y: 0 }
    protected ast?: AstNode

    constructor() {
        this.div.appendChild(this.canvas)
        this.context = this.canvas.getContext('2d')

        this.canvas.addEventListener('mousedown', e => {
            this.isDragging = true
            this.dragStart.x = e.x - this.cameraOffset.x
            this.dragStart.y = e.y - this.cameraOffset.y
        })

        this.canvas.addEventListener('mouseup', e => this.isDragging = false)

        this.canvas.addEventListener('mousemove', e => {
            if (this.isDragging) {
                this.cameraOffset.x = e.clientX - this.dragStart.x
                this.cameraOffset.y = e.clientY - this.dragStart.y
                this.replot()
            }
        })
    }

    onUpdate(ast: AstNode, results: Thing[]): void {
        this.ast = ast
        this.replot()
    }

    protected replot = () => {
        window.requestAnimationFrame(() => {
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
            this.context?.translate(window.innerWidth / 2, window.innerHeight / 2)
            this.context?.translate(-window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y)
            this.context?.clearRect(0, 0, window.innerWidth, window.innerHeight)

            if (!this.context) {
                throw new Error('Canvas context is undefined!')
            }

            if (!this.ast) {
                throw new Error('Ast is is undefined!')
            }

            plotAst(this.context, this.ast)
        })
    }

}
