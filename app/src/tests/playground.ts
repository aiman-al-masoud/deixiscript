import { getBrain } from "../brain/Brain"

export default async function playground() {
    
    const state = {
        brain : await getBrain(),
        promptVisible : false
    }
    
    const update = ()=>{
        console.log(state)
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

    
    document.body.addEventListener('keydown', e=>{

        if(e.ctrlKey && e.code === 'Space'){
            state.promptVisible = ! state.promptVisible
        }else if (e.ctrlKey && e.code === 'Enter'){
            state.brain.execute(textarea.value)
        }

        update()
    })

}