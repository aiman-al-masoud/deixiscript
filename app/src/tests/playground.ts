import { getBrain } from "../brain/Brain"

export default async function playground() {

    const state = {
        brain: await getBrain({ withActuator: true }),
        promptVisible: false
    };

    (window as any).brain = state.brain

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
            const result = await state.brain.execute(textarea.value)
            // console.log(result)
        }

        update()
    })

}