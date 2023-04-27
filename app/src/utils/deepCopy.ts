// import { newInstance } from "./newInstance"

// export function deepCopy(object: object) {

//     if (!(object instanceof HTMLElement)) {
//         // return undefined
//         return { __proto__: object }
//     }

//     try {
//         const wrapped = object.cloneNode(true) as HTMLElement
//         return wrapped
//     } catch {
//         return newInstance(object)
//     }

//     // if (object instanceof HTMLElement) {
//     //     const wrapped = object.cloneNode(true) as HTMLElement
//     //     wrapped.innerHTML = object.innerHTML
//     //     return wrapped
//     // } else {
//     //     // return { ...object }
//     //     return { __proto__: object }
//     // }

// }
