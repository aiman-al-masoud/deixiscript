import { getBrain } from "../brain/Brain"

export default async function playground(){
    
    const brain = await getBrain()

    const button = document.createElement('button')
    button.innerText = 'run'
    document.getElementById('root')?.appendChild(button)

    const parag = document.createElement('p')
    document.getElementById('root')?.appendChild(parag)

    const textarea = document.createElement('textarea')
    textarea.style.height = '50vh'
    textarea.style.width = '50vw'
    document.getElementById('root')?.appendChild(textarea)

    button.onclick = async e => {
        console.log(await brain.execute(textarea.value))
    }

}