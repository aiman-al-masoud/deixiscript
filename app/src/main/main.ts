import autotester from "../../tests/autotester"
import { getBrain } from "../facade/brain/Brain"

export default function main() {

    const state = {
        brain: getBrain({ root: document.body }),
        promptVisible: false
    }

    const update = () => {
        textarea.hidden = !state.promptVisible
        state.promptVisible ? textarea.focus() : 0
    }

    const textarea = document.createElement('textarea')
    textarea.style.width = '50vw'
    textarea.style.height = '1em'
    textarea.hidden = true
    textarea.style.position = 'sticky'
    textarea.style.top = '0'
    textarea.style.zIndex = '1000'
    document.body.appendChild(textarea)
    document.body.appendChild(document.createElement('br'))
    document.body.appendChild(document.createElement('br'))

    document.body.addEventListener('keydown', async e => {

        if (e.ctrlKey && e.code === 'Space') {
            state.promptVisible = !state.promptVisible
        } else if (e.ctrlKey && e.code === 'Enter') {
            const result = state.brain.executeUnwrapped(textarea.value)
            console.log(result)
        } else if (e.ctrlKey && e.code === 'KeyY') {
            await autotester()
            main()
        }

        update()
    });

    (window as any).brain = state.brain
}