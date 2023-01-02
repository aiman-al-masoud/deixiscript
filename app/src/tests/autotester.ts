import Brain, { getBrain } from "../brain/Brain";

export default async function autotester() {

    const brain = await getBrain({ withActuator: true })

    await brain.execute('x is a red button.')
    const object = await getObject('x', brain)
    
    console.log('hi', object.style.background)

    await brain.execute('is x a red button')

    await brain.execute('every clicked button is green.')
    console.log(object.style.background)
    object.click()

    setTimeout(() => {
        console.log(object.style.background)
    }, 500)


}

async function getObject(description: string, brain: Brain) {
    const candidates = await brain.execute(description)
    const firstCandidate = candidates[0]
    const id = Object.entries(firstCandidate).filter(x => x[0] !== '_')[0][1]
    const wrapper = await brain.ed.get(id)
    return wrapper.object
}
