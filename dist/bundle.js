/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/src/concepts/get.ts":
/*!*********************************!*\
  !*** ./app/src/concepts/get.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.get = void 0;
const getConcepts_1 = __webpack_require__(/*! ./getConcepts */ "./app/src/concepts/getConcepts.ts");
function get(object, concept) {
    // const objectConcepts = getConcepts(object)
    // const propConcepts = getConcepts(prop)
    // const matchingConcepts = propConcepts
    //     .filter(x => objectConcepts.includes(x))
    // return matchingConcepts
    //     .some(x => object[getIsName(x)].bind(object)(prop))
    return object[(0, getConcepts_1.getGetterName)(concept)].bind(object)();
}
exports.get = get;


/***/ }),

/***/ "./app/src/concepts/getConcepts.ts":
/*!*****************************************!*\
  !*** ./app/src/concepts/getConcepts.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConceptName = exports.getGetterName = exports.getIsName = exports.getSetterName = exports.getConcepts = exports.getterPrefix = exports.isPrefix = exports.setterPrefix = void 0;
exports.setterPrefix = 'set';
exports.isPrefix = 'is';
exports.getterPrefix = 'get';
function getConcepts(object) {
    // TODO: try getting a concept from a string object with a 
    // special dictionary, like {red:color, green:color, blue:color}
    const stringConcepts = { 'green': 'color', 'red': 'color', 'blue': 'color', 'black': 'color' };
    const maybeConcept = stringConcepts[object.toString()];
    if (maybeConcept) {
        return [maybeConcept];
    }
    return Object
        .getOwnPropertyNames(object)
        .concat(Object.getOwnPropertyNames(object.__proto__))
        .filter(x => x.includes(exports.setterPrefix) || x.includes(exports.isPrefix))
        .map(x => getConceptName(x));
}
exports.getConcepts = getConcepts;
function getSetterName(concept) {
    return `${exports.setterPrefix}_${concept}`;
}
exports.getSetterName = getSetterName;
function getIsName(concept) {
    return `${exports.isPrefix}_${concept}`;
}
exports.getIsName = getIsName;
function getGetterName(concept) {
    return `${exports.getterPrefix}_${concept}`;
}
exports.getGetterName = getGetterName;
function getConceptName(method) {
    return method
        .replace(exports.isPrefix, '')
        .replace(exports.setterPrefix, '')
        .replace('_', '');
}
exports.getConceptName = getConceptName;


/***/ }),

/***/ "./app/src/concepts/is.ts":
/*!********************************!*\
  !*** ./app/src/concepts/is.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.is = void 0;
const getConcepts_1 = __webpack_require__(/*! ./getConcepts */ "./app/src/concepts/getConcepts.ts");
/**
 * Corresponds to prop(object)
 */
function is(object, prop, ...args) {
    const objectConcepts = (0, getConcepts_1.getConcepts)(object);
    const propConcepts = (0, getConcepts_1.getConcepts)(prop);
    const matchingConcepts = propConcepts
        .filter(x => objectConcepts.includes(x));
    return matchingConcepts
        .some(x => object[(0, getConcepts_1.getIsName)(x)].bind(object)(prop));
}
exports.is = is;


/***/ }),

/***/ "./app/src/concepts/set.ts":
/*!*********************************!*\
  !*** ./app/src/concepts/set.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.set = void 0;
const getConcepts_1 = __webpack_require__(/*! ./getConcepts */ "./app/src/concepts/getConcepts.ts");
function set(object, prop) {
    const objectConcepts = (0, getConcepts_1.getConcepts)(object);
    const propConcepts = (0, getConcepts_1.getConcepts)(prop);
    const matchingConcepts = propConcepts
        .filter(x => objectConcepts.includes(x));
    matchingConcepts.forEach(x => {
        object[(0, getConcepts_1.getSetterName)(x)].bind(object)(prop);
    });
}
exports.set = set;


/***/ }),

/***/ "./app/src/concepts/setConcept.ts":
/*!****************************************!*\
  !*** ./app/src/concepts/setConcept.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setConcept = void 0;
const getConcepts_1 = __webpack_require__(/*! ./getConcepts */ "./app/src/concepts/getConcepts.ts");
function setConcept(object, concept, setter, is, getter) {
    Object.defineProperty(object, (0, getConcepts_1.getSetterName)(concept), { value: setter });
    Object.defineProperty(object, (0, getConcepts_1.getIsName)(concept), { value: is });
    Object.defineProperty(object, (0, getConcepts_1.getGetterName)(concept), { value: getter });
}
exports.setConcept = setConcept;


/***/ }),

/***/ "./app/src/tests/testConcepts.ts":
/*!***************************************!*\
  !*** ./app/src/tests/testConcepts.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.testConcepts = void 0;
const getConcepts_1 = __webpack_require__(/*! ../concepts/getConcepts */ "./app/src/concepts/getConcepts.ts");
const is_1 = __webpack_require__(/*! ../concepts/is */ "./app/src/concepts/is.ts");
const setConcept_1 = __webpack_require__(/*! ../concepts/setConcept */ "./app/src/concepts/setConcept.ts");
const set_1 = __webpack_require__(/*! ../concepts/set */ "./app/src/concepts/set.ts");
const get_1 = __webpack_require__(/*! ../concepts/get */ "./app/src/concepts/get.ts");
function testConcepts() {
    console.log((0, getConcepts_1.getConcepts)('red'));
    // setConcept(b,
    //     'color',
    //     function (this: any, color) {
    //         this.style.background = color
    //     }
    //     ,
    //     function (this: any, color) {
    //         return this.style.background === color
    //     });
    window.is = is_1.is;
    window.set = set_1.set;
    window.get = get_1.get;
    (0, setConcept_1.setConcept)(HTMLButtonElement.prototype, 'color', function (color) {
        this.style.background = color;
    }, function (color) {
        return this.style.background === color;
    }, function () {
        return this.style.background;
    });
    const b = document.createElement('button');
    b.textContent = 'capra';
    document.body.appendChild(b);
    window.b = b;
}
exports.testConcepts = testConcepts;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**************************!*\
  !*** ./app/src/index.ts ***!
  \**************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const testConcepts_1 = __webpack_require__(/*! ./tests/testConcepts */ "./app/src/tests/testConcepts.ts");
(0, testConcepts_1.testConcepts)();
// main()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZXB0cy9nZXQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jb25jZXB0cy9nZXRDb25jZXB0cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NvbmNlcHRzL2lzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY29uY2VwdHMvc2V0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY29uY2VwdHMvc2V0Q29uY2VwdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3Rlc3RzL3Rlc3RDb25jZXB0cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRDb25jZXB0cywgZ2V0R2V0dGVyTmFtZSwgZ2V0SXNOYW1lIH0gZnJvbSBcIi4vZ2V0Q29uY2VwdHNcIlxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXQob2JqZWN0OiBhbnksIGNvbmNlcHQ6IHN0cmluZykge1xuXG4gICAgLy8gY29uc3Qgb2JqZWN0Q29uY2VwdHMgPSBnZXRDb25jZXB0cyhvYmplY3QpXG4gICAgLy8gY29uc3QgcHJvcENvbmNlcHRzID0gZ2V0Q29uY2VwdHMocHJvcClcblxuICAgIC8vIGNvbnN0IG1hdGNoaW5nQ29uY2VwdHMgPSBwcm9wQ29uY2VwdHNcbiAgICAvLyAgICAgLmZpbHRlcih4ID0+IG9iamVjdENvbmNlcHRzLmluY2x1ZGVzKHgpKVxuXG4gICAgLy8gcmV0dXJuIG1hdGNoaW5nQ29uY2VwdHNcbiAgICAvLyAgICAgLnNvbWUoeCA9PiBvYmplY3RbZ2V0SXNOYW1lKHgpXS5iaW5kKG9iamVjdCkocHJvcCkpXG5cbiAgICByZXR1cm4gb2JqZWN0W2dldEdldHRlck5hbWUoY29uY2VwdCldLmJpbmQob2JqZWN0KSgpXG59IiwiZXhwb3J0IGNvbnN0IHNldHRlclByZWZpeCA9ICdzZXQnXG5leHBvcnQgY29uc3QgaXNQcmVmaXggPSAnaXMnXG5leHBvcnQgY29uc3QgZ2V0dGVyUHJlZml4ID0gJ2dldCdcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmNlcHRzKG9iamVjdDogYW55KSB7XG5cbiAgICAvLyBUT0RPOiB0cnkgZ2V0dGluZyBhIGNvbmNlcHQgZnJvbSBhIHN0cmluZyBvYmplY3Qgd2l0aCBhIFxuICAgIC8vIHNwZWNpYWwgZGljdGlvbmFyeSwgbGlrZSB7cmVkOmNvbG9yLCBncmVlbjpjb2xvciwgYmx1ZTpjb2xvcn1cbiAgICBjb25zdCBzdHJpbmdDb25jZXB0czogeyBbeDogc3RyaW5nXTogc3RyaW5nIH0gPSB7ICdncmVlbic6ICdjb2xvcicsICdyZWQnOiAnY29sb3InLCAnYmx1ZSc6ICdjb2xvcicsICdibGFjayc6ICdjb2xvcicgfVxuICAgIGNvbnN0IG1heWJlQ29uY2VwdDogc3RyaW5nIHwgdW5kZWZpbmVkID0gc3RyaW5nQ29uY2VwdHNbb2JqZWN0LnRvU3RyaW5nKCldXG5cbiAgICBpZiAobWF5YmVDb25jZXB0KSB7XG4gICAgICAgIHJldHVybiBbbWF5YmVDb25jZXB0XVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3RcbiAgICAgICAgLmdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KVxuICAgICAgICAuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdC5fX3Byb3RvX18pKVxuICAgICAgICAuZmlsdGVyKHggPT4geC5pbmNsdWRlcyhzZXR0ZXJQcmVmaXgpIHx8IHguaW5jbHVkZXMoaXNQcmVmaXgpKVxuICAgICAgICAubWFwKHggPT4gZ2V0Q29uY2VwdE5hbWUoeCkpXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRlck5hbWUoY29uY2VwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke3NldHRlclByZWZpeH1fJHtjb25jZXB0fWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldElzTmFtZShjb25jZXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7aXNQcmVmaXh9XyR7Y29uY2VwdH1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHZXR0ZXJOYW1lKGNvbmNlcHQ6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtnZXR0ZXJQcmVmaXh9XyR7Y29uY2VwdH1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25jZXB0TmFtZShtZXRob2Q6IHN0cmluZykge1xuICAgIHJldHVybiBtZXRob2RcbiAgICAgICAgLnJlcGxhY2UoaXNQcmVmaXgsICcnKVxuICAgICAgICAucmVwbGFjZShzZXR0ZXJQcmVmaXgsICcnKVxuICAgICAgICAucmVwbGFjZSgnXycsICcnKVxufVxuIiwiaW1wb3J0IHsgZ2V0Q29uY2VwdHMsIGdldElzTmFtZSB9IGZyb20gXCIuL2dldENvbmNlcHRzXCJcblxuLyoqXG4gKiBDb3JyZXNwb25kcyB0byBwcm9wKG9iamVjdClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzKG9iamVjdDogYW55LCBwcm9wOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBvYmplY3RDb25jZXB0cyA9IGdldENvbmNlcHRzKG9iamVjdClcbiAgICBjb25zdCBwcm9wQ29uY2VwdHMgPSBnZXRDb25jZXB0cyhwcm9wKVxuXG4gICAgY29uc3QgbWF0Y2hpbmdDb25jZXB0cyA9IHByb3BDb25jZXB0c1xuICAgICAgICAuZmlsdGVyKHggPT4gb2JqZWN0Q29uY2VwdHMuaW5jbHVkZXMoeCkpXG5cbiAgICByZXR1cm4gbWF0Y2hpbmdDb25jZXB0c1xuICAgICAgICAuc29tZSh4ID0+IG9iamVjdFtnZXRJc05hbWUoeCldLmJpbmQob2JqZWN0KShwcm9wKSlcblxufSIsImltcG9ydCB7IGdldENvbmNlcHRzLCBnZXRTZXR0ZXJOYW1lIH0gZnJvbSBcIi4vZ2V0Q29uY2VwdHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldChvYmplY3Q6IGFueSwgcHJvcDogYW55KSB7XG5cbiAgICBjb25zdCBvYmplY3RDb25jZXB0cyA9IGdldENvbmNlcHRzKG9iamVjdClcbiAgICBjb25zdCBwcm9wQ29uY2VwdHMgPSBnZXRDb25jZXB0cyhwcm9wKVxuXG4gICAgY29uc3QgbWF0Y2hpbmdDb25jZXB0cyA9IHByb3BDb25jZXB0c1xuICAgICAgICAuZmlsdGVyKHggPT4gb2JqZWN0Q29uY2VwdHMuaW5jbHVkZXMoeCkpXG5cbiAgICBtYXRjaGluZ0NvbmNlcHRzLmZvckVhY2goeCA9PiB7XG4gICAgICAgIG9iamVjdFtnZXRTZXR0ZXJOYW1lKHgpXS5iaW5kKG9iamVjdCkocHJvcClcbiAgICB9KVxufSIsImltcG9ydCB7IGdldEdldHRlck5hbWUsIGdldElzTmFtZSwgZ2V0U2V0dGVyTmFtZSB9IGZyb20gXCIuL2dldENvbmNlcHRzXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENvbmNlcHQoXG4gICAgb2JqZWN0OiBhbnksXG4gICAgY29uY2VwdDogc3RyaW5nLFxuICAgIHNldHRlcjogKC4uLmFyZ3M6IGFueSkgPT4gdm9pZCxcbiAgICBpczogKC4uLmFyZ3M6IGFueSkgPT4gYm9vbGVhbixcbiAgICBnZXR0ZXI6ICgpID0+IGFueSkge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgZ2V0U2V0dGVyTmFtZShjb25jZXB0KSwgeyB2YWx1ZTogc2V0dGVyIH0pXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgZ2V0SXNOYW1lKGNvbmNlcHQpLCB7IHZhbHVlOiBpcyB9KVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIGdldEdldHRlck5hbWUoY29uY2VwdCksIHsgdmFsdWU6IGdldHRlciB9KVxuXG59IiwiaW1wb3J0IHsgZ2V0Q29uY2VwdHMgfSBmcm9tIFwiLi4vY29uY2VwdHMvZ2V0Q29uY2VwdHNcIjtcbmltcG9ydCB7IGlzIH0gZnJvbSBcIi4uL2NvbmNlcHRzL2lzXCI7XG5pbXBvcnQgeyBzZXRDb25jZXB0IH0gZnJvbSBcIi4uL2NvbmNlcHRzL3NldENvbmNlcHRcIjtcbmltcG9ydCB7IHNldCB9IGZyb20gXCIuLi9jb25jZXB0cy9zZXRcIjtcbmltcG9ydCB7IGdldCB9IGZyb20gXCIuLi9jb25jZXB0cy9nZXRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RDb25jZXB0cygpIHtcblxuICAgIGNvbnNvbGUubG9nKGdldENvbmNlcHRzKCdyZWQnKSk7XG5cbiAgICAvLyBzZXRDb25jZXB0KGIsXG4gICAgLy8gICAgICdjb2xvcicsXG4gICAgLy8gICAgIGZ1bmN0aW9uICh0aGlzOiBhbnksIGNvbG9yKSB7XG4gICAgLy8gICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmQgPSBjb2xvclxuICAgIC8vICAgICB9XG4gICAgLy8gICAgICxcbiAgICAvLyAgICAgZnVuY3Rpb24gKHRoaXM6IGFueSwgY29sb3IpIHtcbiAgICAvLyAgICAgICAgIHJldHVybiB0aGlzLnN0eWxlLmJhY2tncm91bmQgPT09IGNvbG9yXG4gICAgLy8gICAgIH0pO1xuXG5cbiAgICAod2luZG93IGFzIGFueSkuaXMgPSBpcztcbiAgICAod2luZG93IGFzIGFueSkuc2V0ID0gc2V0O1xuICAgICh3aW5kb3cgYXMgYW55KS5nZXQgPSBnZXQ7XG5cblxuICAgIHNldENvbmNlcHQoSFRNTEJ1dHRvbkVsZW1lbnQucHJvdG90eXBlLFxuICAgICAgICAnY29sb3InLFxuICAgICAgICBmdW5jdGlvbiAodGhpczogYW55LCBjb2xvcikge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kID0gY29sb3JcbiAgICAgICAgfVxuICAgICAgICAsXG4gICAgICAgIGZ1bmN0aW9uICh0aGlzOiBhbnksIGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdHlsZS5iYWNrZ3JvdW5kID09PSBjb2xvclxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAodGhpczogYW55KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdHlsZS5iYWNrZ3JvdW5kXG4gICAgICAgIH0pO1xuXG4gICAgY29uc3QgYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG4gICAgYi50ZXh0Q29udGVudCA9ICdjYXByYSdcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGIpO1xuXG5cbiAgICAod2luZG93IGFzIGFueSkuYiA9IGJcblxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgbWFpbiBmcm9tIFwiLi9tYWluL21haW5cIjtcblxuaW1wb3J0IHsgdGVzdENvbmNlcHRzIH0gZnJvbSBcIi4vdGVzdHMvdGVzdENvbmNlcHRzXCI7XG5cbnRlc3RDb25jZXB0cygpXG4vLyBtYWluKCkiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=