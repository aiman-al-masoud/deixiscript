import BasicBrain from "./BasicBrain"

/**
 * The main facade controller.
 */
export default interface Brain {
    execute(natlang: string): Promise<any[]>
}

export async function getBrain(): Promise<Brain> {
    return new BasicBrain()
}
