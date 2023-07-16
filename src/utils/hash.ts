import { sorted } from "./sorted.ts";

// From: https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
function sortObjectKeys(obj: any) {

    if (obj == null || obj == undefined) {
        return obj
    }

    if (typeof obj !== 'object') { // it is a primitive: number/string (in an array)
        return obj
    }

    if (obj instanceof Array) return obj

    return sorted(Object.keys(obj)).reduce((acc: any, key) => {
        if (Array.isArray(obj[key])) {
            acc[key] = obj[key].map(sortObjectKeys);
        }
        else if (typeof obj[key] === 'object') {
            acc[key] = sortObjectKeys(obj[key]);
        }
        else {
            acc[key] = obj[key];
        }
        return acc;
    }, {});
}

export function hash(obj: any) {
    const sortedObject = sortObjectKeys(obj);
    // const jsonstring = JSON.stringify(sortedObject, function (k, v) { return v === undefined ? "undef" : v; });

    const jsonstring = JSON.stringify(sortedObject)

    // Remove all whitespace
    // let jsonstringNoWhitespace: string = jsonstring.replace(/\s+/g, '');

    // return jsonstringNoWhitespace

    return jsonstring

    // let JSONBuffer: Buffer = Buffer.from(jsonstringNoWhitespace, 'binary');   // encoding: encoding to use, optional.  Default is 'utf8'
    // return xxhash.hash64(JSONBuffer, 0xCAFEBABE, "hex");
}


// const x = {
//     type: "arbitrary-type",
//     head: { type: "variable", value: "x20", varType: "panel", x:[1,2] },
//     description: { type: "boolean", value: true }
// }

// const y = {
//     description: { type: "boolean", value: true },
//     head: {x:[1,2], type: "variable", value: "x20", varType: "panel" },
//     type: "arbitrary-type"
// }

// console.log(hash(x) === hash(y))
// // console.log()

// console.log(sortObjectKeys([3, 2, 1]))

