
export function initCanvas() {

    const canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    const context = canvas.getContext('2d')

    if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }

    return context
}