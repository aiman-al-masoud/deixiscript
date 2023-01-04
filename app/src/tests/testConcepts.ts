import { getConcepts } from "../concepts/getConcepts";
import { is } from "../concepts/is";
import { setConcept } from "../concepts/setConcept";
import { set } from "../concepts/set";

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


    setConcept(HTMLButtonElement.prototype,
        'color',
        function (this: any, color) {
            this.style.background = color
        }
        ,
        function (this: any, color) {
            return this.style.background === color
        });

    const b = document.createElement('button')
    b.textContent = 'capra'
    document.body.appendChild(b);


    (window as any).b = b

}