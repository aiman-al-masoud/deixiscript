import Brain from "../brain/Brain"

export default interface Action {
    run(brain: Brain): Promise<any>
}