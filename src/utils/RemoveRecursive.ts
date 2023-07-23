

export type RemoveRecursive<FromT, RemovedT extends unknown[]> =
    FromT extends RemovedT[number] ? never :
    { [K in keyof FromT]: RemoveRecursive<FromT[K], RemovedT> }


// type ParamMember = {
//     param: string,
// }

// type UseTemplateMember = {
//     g: 1,
//     // param: string,
// }

// type Something = {
//     stoopid: UseTemplateMember | ParamMember,
//     buruf: {
//         makessense: {
//             hello: ParamMember | UseTemplateMember,
//         }
//     }
// }

// type CrapArray = Something[]
// type hhh = RemoveRecursive<CrapArray, [ParamMember]>
