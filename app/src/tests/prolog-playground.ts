import { getProlog } from "../prolog/Prolog"

/**
 * An interactive testing environment to play around with tau-prolog
 */
export default async function prologPlay() {

    const state = {
        prolog: getProlog(),
        queryMode: true, // false is assert mode
    }

    const textArea = document.createElement('textarea')
    textArea.style.height = '100vh'
    textArea.style.width = '80vw'
    textArea.style.fontSize = '3em'
    document.body.appendChild(textArea)
    textArea.focus()

    const update = () => {
        document.body.style.background = state.queryMode ? 'green' : '#ffa06b'
        document.title = state.queryMode ? 'QUERY' : 'ASSERT'
    }

    document.body.addEventListener('keydown', e => {
        state.queryMode = e.ctrlKey && e.code === 'Space' ? !state.queryMode : state.queryMode
        update()
    })

    document.body.addEventListener('keydown', async e => {

        if (e.ctrlKey && e.code === 'Enter') {

            if (state.queryMode) {
                console.log(await state.prolog.query(textArea.value.endsWith('.') ? textArea.value : textArea.value + '.'))

            } else {

                for (const code of textArea.value.split('.').filter(v => v.trim())) {
                    await state.prolog.assert(code)
                    console.log('asserted:', code)
                }

            }

        }
    })

    update()
}