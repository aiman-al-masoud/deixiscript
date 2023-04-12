import { getBrain } from "../facade/Brain"

export default function main() {

    const leftDiv = document.createElement('div')
    const rightDiv = document.createElement('div')

    const split = 'height: 100%; width: 50%; position: fixed; z-index: 1; top: 0;  padding-top: 20px;' //overflow-x: hidden;
    const left = 'left: 0; background-color: #111;'
    const right = 'right: 0; background-color: #000;'

    leftDiv.style.cssText = split + left
    rightDiv.style.cssText = split + right + 'overflow:scroll;' + 'overflow-x:scroll;' + 'overflow-y:scroll;'
    rightDiv.style.overflowX = 'scroll'
    rightDiv.style.overflowY = 'scroll'
    rightDiv.style.overflow = 'scroll'

    document.body.appendChild(leftDiv)
    document.body.appendChild(rightDiv)

    const canvas = document.createElement('canvas')
    rightDiv.appendChild(canvas)

    canvas.width = window.innerWidth / 2
    canvas.height = window.innerHeight /// 2
    const canvasContext = canvas.getContext('2d') // check

    const textarea = document.createElement('textarea')
    textarea.style.width = '40vw'
    textarea.style.height = '40vh'
    leftDiv.appendChild(textarea)

    const consoleOutput = document.createElement('textarea')
    consoleOutput.style.width = '40vw'
    consoleOutput.style.height = '40vh'
    leftDiv.appendChild(consoleOutput)

    const brain = getBrain({ canvasContext })

    document.body.addEventListener('keydown', async e => {

        if (e.ctrlKey && e.code === 'Enter') {
            const result = brain.executeUnwrapped(textarea.value)
            consoleOutput.value = result.toString()
            console.log(result)
        } else if (e.ctrlKey && e.code === 'KeyY') {
            main()
        }

    });

    (window as any).brain = brain

}