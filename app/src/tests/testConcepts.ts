import { getConcepts } from "../concepts/getConcepts";
import { is } from "../concepts/is";
import { setConcept } from "../concepts/setConcept";
import { set } from "../concepts/set";
import { get } from "../concepts/get";

export function testConcepts() {

    console.log(getConcepts('red'));

    // setConcept(b,
    //     'color',
    //     function (this: any, color) {
    //         this.style.background = color
    //     }
    //     ,
    //     function (this: any, color) {
    //         return this.style.background === color
    //     });


    (window as any).is = is;
    (window as any).set = set;
    (window as any).get = get;


    setConcept(HTMLButtonElement.prototype,
        'color',
        function (this: any, color) {
            this.style.background = color
        },
        function (this: any, color) {
            return this.style.background === color
        },
        function (this: any) {
            return this.style.background
        });


    setConcept(HTMLButtonElement.prototype,
        'size',
        function (this: HTMLButtonElement, size) {
            this.style.width = size
        },
        function (this: any, size) {
            return  this.style.width === size
        },
        function (this: any) {
            return this.style.width
        });

    const b = document.createElement('button')
    b.textContent = 'capra'
    document.body.appendChild(b);


    (window as any).b = b

}