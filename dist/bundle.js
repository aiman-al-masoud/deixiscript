/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/src/concepts/getConcepts.ts":
/*!*****************************************!*\
  !*** ./app/src/concepts/getConcepts.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConceptName = exports.getGetterName = exports.getSetterName = exports.getConcepts = exports.getterPrefix = exports.setterPrefix = void 0;
exports.setterPrefix = 'set';
exports.getterPrefix = 'is';
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
        .filter(x => x.includes(exports.setterPrefix) || x.includes(exports.getterPrefix))
        .map(x => getConceptName(x));
}
exports.getConcepts = getConcepts;
function getSetterName(concept) {
    return `${exports.setterPrefix}_${concept}`;
}
exports.getSetterName = getSetterName;
function getGetterName(concept) {
    return `${exports.getterPrefix}_${concept}`;
}
exports.getGetterName = getGetterName;
function getConceptName(method) {
    return method
        .replace(exports.getterPrefix, '')
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
    return matchingConcepts.some(x => {
        const getter = object[(0, getConcepts_1.getGetterName)(x)].bind(object);
        return getter(prop);
    });
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
        const setter = object[(0, getConcepts_1.getSetterName)(x)].bind(object);
        setter(prop);
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
function setConcept(object, concept, setter, getter) {
    Object.defineProperty(object, (0, getConcepts_1.getSetterName)(concept), { value: setter });
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
    (0, setConcept_1.setConcept)(HTMLButtonElement.prototype, 'color', function (color) {
        this.style.background = color;
    }, function (color) {
        return this.style.background === color;
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

// import main from "./main/main";
Object.defineProperty(exports, "__esModule", ({ value: true }));
const testConcepts_1 = __webpack_require__(/*! ./tests/testConcepts */ "./app/src/tests/testConcepts.ts");
// main()
(0, testConcepts_1.testConcepts)();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxDQUFDLENBQUMsQ0FBQztJQUVQLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQzFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsT0FBTztJQUN2QixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUc1QixNQUFjLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFFekIsQ0FBQztBQXBDRCxvQ0FvQ0M7Ozs7Ozs7VUN6Q0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7QUN0QkEsa0NBQWtDOztBQUVsQywwR0FBb0Q7QUFFcEQsU0FBUztBQUVULCtCQUFZLEdBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NvbmNlcHRzL2dldENvbmNlcHRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY29uY2VwdHMvaXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jb25jZXB0cy9zZXQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jb25jZXB0cy9zZXRDb25jZXB0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvdGVzdHMvdGVzdENvbmNlcHRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBzZXR0ZXJQcmVmaXggPSAnc2V0J1xuZXhwb3J0IGNvbnN0IGdldHRlclByZWZpeCA9ICdpcydcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmNlcHRzKG9iamVjdDogYW55KSB7XG5cbiAgICAvLyBUT0RPOiB0cnkgZ2V0dGluZyBhIGNvbmNlcHQgZnJvbSBhIHN0cmluZyBvYmplY3Qgd2l0aCBhIFxuICAgIC8vIHNwZWNpYWwgZGljdGlvbmFyeSwgbGlrZSB7cmVkOmNvbG9yLCBncmVlbjpjb2xvciwgYmx1ZTpjb2xvcn1cbiAgICBjb25zdCBzdHJpbmdDb25jZXB0czogeyBbeDogc3RyaW5nXTogc3RyaW5nIH0gPSB7ICdncmVlbic6ICdjb2xvcicsICdyZWQnOiAnY29sb3InLCAnYmx1ZScgOiAnY29sb3InLCAnYmxhY2snIDogJ2NvbG9yJyB9XG4gICAgY29uc3QgbWF5YmVDb25jZXB0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSBzdHJpbmdDb25jZXB0c1tvYmplY3QudG9TdHJpbmcoKV1cblxuICAgIGlmIChtYXliZUNvbmNlcHQpIHtcbiAgICAgICAgcmV0dXJuIFttYXliZUNvbmNlcHRdXG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdFxuICAgICAgICAuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpXG4gICAgICAgIC5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqZWN0Ll9fcHJvdG9fXykpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4LmluY2x1ZGVzKHNldHRlclByZWZpeCkgfHwgeC5pbmNsdWRlcyhnZXR0ZXJQcmVmaXgpKVxuICAgICAgICAubWFwKHggPT4gZ2V0Q29uY2VwdE5hbWUoeCkpXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRlck5hbWUoY29uY2VwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke3NldHRlclByZWZpeH1fJHtjb25jZXB0fWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEdldHRlck5hbWUoY29uY2VwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke2dldHRlclByZWZpeH1fJHtjb25jZXB0fWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmNlcHROYW1lKG1ldGhvZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG1ldGhvZFxuICAgICAgICAucmVwbGFjZShnZXR0ZXJQcmVmaXgsICcnKVxuICAgICAgICAucmVwbGFjZShzZXR0ZXJQcmVmaXgsICcnKVxuICAgICAgICAucmVwbGFjZSgnXycsICcnKVxufVxuIiwiaW1wb3J0IHsgZ2V0Q29uY2VwdHMsIGdldEdldHRlck5hbWUgfSBmcm9tIFwiLi9nZXRDb25jZXB0c1wiXG5cbi8qKlxuICogQ29ycmVzcG9uZHMgdG8gcHJvcChvYmplY3QpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpcyhvYmplY3Q6IGFueSwgcHJvcDogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgY29uc3Qgb2JqZWN0Q29uY2VwdHMgPSBnZXRDb25jZXB0cyhvYmplY3QpXG4gICAgY29uc3QgcHJvcENvbmNlcHRzID0gZ2V0Q29uY2VwdHMocHJvcClcblxuICAgIGNvbnN0IG1hdGNoaW5nQ29uY2VwdHMgPSBwcm9wQ29uY2VwdHNcbiAgICAgICAgLmZpbHRlcih4ID0+IG9iamVjdENvbmNlcHRzLmluY2x1ZGVzKHgpKVxuXG4gICAgcmV0dXJuIG1hdGNoaW5nQ29uY2VwdHMuc29tZSh4ID0+IHtcbiAgICAgICAgY29uc3QgZ2V0dGVyID0gb2JqZWN0W2dldEdldHRlck5hbWUoeCldLmJpbmQob2JqZWN0KVxuICAgICAgICByZXR1cm4gZ2V0dGVyKHByb3ApXG4gICAgfSlcblxufSIsImltcG9ydCB7IGdldENvbmNlcHRzLCBnZXRTZXR0ZXJOYW1lIH0gZnJvbSBcIi4vZ2V0Q29uY2VwdHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldChvYmplY3Q6IGFueSwgcHJvcDogYW55KSB7XG5cbiAgICBjb25zdCBvYmplY3RDb25jZXB0cyA9IGdldENvbmNlcHRzKG9iamVjdClcbiAgICBjb25zdCBwcm9wQ29uY2VwdHMgPSBnZXRDb25jZXB0cyhwcm9wKVxuXG4gICAgY29uc3QgbWF0Y2hpbmdDb25jZXB0cyA9IHByb3BDb25jZXB0c1xuICAgICAgICAuZmlsdGVyKHggPT4gb2JqZWN0Q29uY2VwdHMuaW5jbHVkZXMoeCkpXG5cbiAgICBtYXRjaGluZ0NvbmNlcHRzLmZvckVhY2goeCA9PiB7XG4gICAgICAgIGNvbnN0IHNldHRlciA9IG9iamVjdFtnZXRTZXR0ZXJOYW1lKHgpXS5iaW5kKG9iamVjdClcbiAgICAgICAgc2V0dGVyKHByb3ApXG4gICAgfSlcbn0iLCJpbXBvcnQgeyBnZXRHZXR0ZXJOYW1lLCBnZXRTZXR0ZXJOYW1lIH0gZnJvbSBcIi4vZ2V0Q29uY2VwdHNcIlxuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q29uY2VwdChcbiAgICBvYmplY3Q6IGFueSxcbiAgICBjb25jZXB0OiBzdHJpbmcsXG4gICAgc2V0dGVyOiAoLi4uYXJnczogYW55KSA9PiB2b2lkLFxuICAgIGdldHRlcjogKC4uLmFyZ3M6IGFueSkgPT4gYm9vbGVhbikge1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgZ2V0U2V0dGVyTmFtZShjb25jZXB0KSwgeyB2YWx1ZTogc2V0dGVyIH0pXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgZ2V0R2V0dGVyTmFtZShjb25jZXB0KSwgeyB2YWx1ZTogZ2V0dGVyIH0pXG5cbn0iLCJpbXBvcnQgeyBnZXRDb25jZXB0cyB9IGZyb20gXCIuLi9jb25jZXB0cy9nZXRDb25jZXB0c1wiO1xuaW1wb3J0IHsgaXMgfSBmcm9tIFwiLi4vY29uY2VwdHMvaXNcIjtcbmltcG9ydCB7IHNldENvbmNlcHQgfSBmcm9tIFwiLi4vY29uY2VwdHMvc2V0Q29uY2VwdFwiO1xuaW1wb3J0IHsgc2V0IH0gZnJvbSBcIi4uL2NvbmNlcHRzL3NldFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdGVzdENvbmNlcHRzKCkge1xuXG4gICAgY29uc29sZS5sb2coZ2V0Q29uY2VwdHMoJ3JlZCcpKTtcblxuICAgICAgICAvLyBzZXRDb25jZXB0KGIsXG4gICAgICAgIC8vICAgICAnY29sb3InLFxuICAgICAgICAvLyAgICAgZnVuY3Rpb24gKHRoaXM6IGFueSwgY29sb3IpIHtcbiAgICAgICAgLy8gICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmQgPSBjb2xvclxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyAgICAgLFxuICAgICAgICAvLyAgICAgZnVuY3Rpb24gKHRoaXM6IGFueSwgY29sb3IpIHtcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gdGhpcy5zdHlsZS5iYWNrZ3JvdW5kID09PSBjb2xvclxuICAgICAgICAvLyAgICAgfSk7XG5cblxuICAgICAgICAod2luZG93IGFzIGFueSkuaXMgPSBpcztcbiAgICAod2luZG93IGFzIGFueSkuc2V0ID0gc2V0O1xuXG5cbiAgICBzZXRDb25jZXB0KEhUTUxCdXR0b25FbGVtZW50LnByb3RvdHlwZSxcbiAgICAgICAgJ2NvbG9yJyxcbiAgICAgICAgZnVuY3Rpb24gKHRoaXM6IGFueSwgY29sb3IpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZCA9IGNvbG9yXG4gICAgICAgIH1cbiAgICAgICAgLFxuICAgICAgICBmdW5jdGlvbiAodGhpczogYW55LCBjb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3R5bGUuYmFja2dyb3VuZCA9PT0gY29sb3JcbiAgICAgICAgfSk7XG5cbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICBiLnRleHRDb250ZW50ID0gJ2NhcHJhJ1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYik7XG5cblxuICAgICh3aW5kb3cgYXMgYW55KS5iID0gYlxuXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGltcG9ydCBtYWluIGZyb20gXCIuL21haW4vbWFpblwiO1xuXG5pbXBvcnQgeyB0ZXN0Q29uY2VwdHMgfSBmcm9tIFwiLi90ZXN0cy90ZXN0Q29uY2VwdHNcIjtcblxuLy8gbWFpbigpXG5cbnRlc3RDb25jZXB0cygpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9