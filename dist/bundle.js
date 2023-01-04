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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUMxQyxDQUFDLENBQUMsV0FBVyxHQUFHLE9BQU87SUFDdkIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFHNUIsTUFBYyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBRXpCLENBQUM7QUFwQ0Qsb0NBb0NDOzs7Ozs7O1VDekNEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7O0FDdEJBLGtDQUFrQzs7QUFFbEMsMEdBQW9EO0FBRXBELFNBQVM7QUFFVCwrQkFBWSxHQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jb25jZXB0cy9nZXRDb25jZXB0cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NvbmNlcHRzL2lzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY29uY2VwdHMvc2V0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY29uY2VwdHMvc2V0Q29uY2VwdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3Rlc3RzL3Rlc3RDb25jZXB0cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3Qgc2V0dGVyUHJlZml4ID0gJ3NldCdcbmV4cG9ydCBjb25zdCBnZXR0ZXJQcmVmaXggPSAnaXMnXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25jZXB0cyhvYmplY3Q6IGFueSkge1xuXG4gICAgLy8gVE9ETzogdHJ5IGdldHRpbmcgYSBjb25jZXB0IGZyb20gYSBzdHJpbmcgb2JqZWN0IHdpdGggYSBcbiAgICAvLyBzcGVjaWFsIGRpY3Rpb25hcnksIGxpa2Uge3JlZDpjb2xvciwgZ3JlZW46Y29sb3IsIGJsdWU6Y29sb3J9XG4gICAgY29uc3Qgc3RyaW5nQ29uY2VwdHM6IHsgW3g6IHN0cmluZ106IHN0cmluZyB9ID0geyAnZ3JlZW4nOiAnY29sb3InLCAncmVkJzogJ2NvbG9yJywgJ2JsdWUnOiAnY29sb3InLCAnYmxhY2snOiAnY29sb3InIH1cbiAgICBjb25zdCBtYXliZUNvbmNlcHQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHN0cmluZ0NvbmNlcHRzW29iamVjdC50b1N0cmluZygpXVxuXG4gICAgaWYgKG1heWJlQ29uY2VwdCkge1xuICAgICAgICByZXR1cm4gW21heWJlQ29uY2VwdF1cbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0XG4gICAgICAgIC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdClcbiAgICAgICAgLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QuX19wcm90b19fKSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHguaW5jbHVkZXMoc2V0dGVyUHJlZml4KSB8fCB4LmluY2x1ZGVzKGdldHRlclByZWZpeCkpXG4gICAgICAgIC5tYXAoeCA9PiBnZXRDb25jZXB0TmFtZSh4KSlcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2V0dGVyTmFtZShjb25jZXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7c2V0dGVyUHJlZml4fV8ke2NvbmNlcHR9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2V0dGVyTmFtZShjb25jZXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7Z2V0dGVyUHJlZml4fV8ke2NvbmNlcHR9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uY2VwdE5hbWUobWV0aG9kOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbWV0aG9kXG4gICAgICAgIC5yZXBsYWNlKGdldHRlclByZWZpeCwgJycpXG4gICAgICAgIC5yZXBsYWNlKHNldHRlclByZWZpeCwgJycpXG4gICAgICAgIC5yZXBsYWNlKCdfJywgJycpXG59XG4iLCJpbXBvcnQgeyBnZXRDb25jZXB0cywgZ2V0R2V0dGVyTmFtZSB9IGZyb20gXCIuL2dldENvbmNlcHRzXCJcblxuLyoqXG4gKiBDb3JyZXNwb25kcyB0byBwcm9wKG9iamVjdClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzKG9iamVjdDogYW55LCBwcm9wOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICBjb25zdCBvYmplY3RDb25jZXB0cyA9IGdldENvbmNlcHRzKG9iamVjdClcbiAgICBjb25zdCBwcm9wQ29uY2VwdHMgPSBnZXRDb25jZXB0cyhwcm9wKVxuXG4gICAgY29uc3QgbWF0Y2hpbmdDb25jZXB0cyA9IHByb3BDb25jZXB0c1xuICAgICAgICAuZmlsdGVyKHggPT4gb2JqZWN0Q29uY2VwdHMuaW5jbHVkZXMoeCkpXG5cbiAgICByZXR1cm4gbWF0Y2hpbmdDb25jZXB0cy5zb21lKHggPT4ge1xuICAgICAgICBjb25zdCBnZXR0ZXIgPSBvYmplY3RbZ2V0R2V0dGVyTmFtZSh4KV0uYmluZChvYmplY3QpXG4gICAgICAgIHJldHVybiBnZXR0ZXIocHJvcClcbiAgICB9KVxuXG59IiwiaW1wb3J0IHsgZ2V0Q29uY2VwdHMsIGdldFNldHRlck5hbWUgfSBmcm9tIFwiLi9nZXRDb25jZXB0c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0KG9iamVjdDogYW55LCBwcm9wOiBhbnkpIHtcblxuICAgIGNvbnN0IG9iamVjdENvbmNlcHRzID0gZ2V0Q29uY2VwdHMob2JqZWN0KVxuICAgIGNvbnN0IHByb3BDb25jZXB0cyA9IGdldENvbmNlcHRzKHByb3ApXG5cbiAgICBjb25zdCBtYXRjaGluZ0NvbmNlcHRzID0gcHJvcENvbmNlcHRzXG4gICAgICAgIC5maWx0ZXIoeCA9PiBvYmplY3RDb25jZXB0cy5pbmNsdWRlcyh4KSlcblxuICAgIG1hdGNoaW5nQ29uY2VwdHMuZm9yRWFjaCh4ID0+IHtcbiAgICAgICAgb2JqZWN0W2dldFNldHRlck5hbWUoeCldLmJpbmQob2JqZWN0KShwcm9wKVxuICAgIH0pXG59IiwiaW1wb3J0IHsgZ2V0R2V0dGVyTmFtZSwgZ2V0U2V0dGVyTmFtZSB9IGZyb20gXCIuL2dldENvbmNlcHRzXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHNldENvbmNlcHQoXG4gICAgb2JqZWN0OiBhbnksXG4gICAgY29uY2VwdDogc3RyaW5nLFxuICAgIHNldHRlcjogKC4uLmFyZ3M6IGFueSkgPT4gdm9pZCxcbiAgICBnZXR0ZXI6ICguLi5hcmdzOiBhbnkpID0+IGJvb2xlYW4pIHtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIGdldFNldHRlck5hbWUoY29uY2VwdCksIHsgdmFsdWU6IHNldHRlciB9KVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIGdldEdldHRlck5hbWUoY29uY2VwdCksIHsgdmFsdWU6IGdldHRlciB9KVxuXG59IiwiaW1wb3J0IHsgZ2V0Q29uY2VwdHMgfSBmcm9tIFwiLi4vY29uY2VwdHMvZ2V0Q29uY2VwdHNcIjtcbmltcG9ydCB7IGlzIH0gZnJvbSBcIi4uL2NvbmNlcHRzL2lzXCI7XG5pbXBvcnQgeyBzZXRDb25jZXB0IH0gZnJvbSBcIi4uL2NvbmNlcHRzL3NldENvbmNlcHRcIjtcbmltcG9ydCB7IHNldCB9IGZyb20gXCIuLi9jb25jZXB0cy9zZXRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RDb25jZXB0cygpIHtcblxuICAgIGNvbnNvbGUubG9nKGdldENvbmNlcHRzKCdyZWQnKSk7XG5cbiAgICAvLyBzZXRDb25jZXB0KGIsXG4gICAgLy8gICAgICdjb2xvcicsXG4gICAgLy8gICAgIGZ1bmN0aW9uICh0aGlzOiBhbnksIGNvbG9yKSB7XG4gICAgLy8gICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmQgPSBjb2xvclxuICAgIC8vICAgICB9XG4gICAgLy8gICAgICxcbiAgICAvLyAgICAgZnVuY3Rpb24gKHRoaXM6IGFueSwgY29sb3IpIHtcbiAgICAvLyAgICAgICAgIHJldHVybiB0aGlzLnN0eWxlLmJhY2tncm91bmQgPT09IGNvbG9yXG4gICAgLy8gICAgIH0pO1xuXG5cbiAgICAod2luZG93IGFzIGFueSkuaXMgPSBpcztcbiAgICAod2luZG93IGFzIGFueSkuc2V0ID0gc2V0O1xuXG5cbiAgICBzZXRDb25jZXB0KEhUTUxCdXR0b25FbGVtZW50LnByb3RvdHlwZSxcbiAgICAgICAgJ2NvbG9yJyxcbiAgICAgICAgZnVuY3Rpb24gKHRoaXM6IGFueSwgY29sb3IpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZCA9IGNvbG9yXG4gICAgICAgIH1cbiAgICAgICAgLFxuICAgICAgICBmdW5jdGlvbiAodGhpczogYW55LCBjb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3R5bGUuYmFja2dyb3VuZCA9PT0gY29sb3JcbiAgICAgICAgfSk7XG5cbiAgICBjb25zdCBiID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJylcbiAgICBiLnRleHRDb250ZW50ID0gJ2NhcHJhJ1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYik7XG5cblxuICAgICh3aW5kb3cgYXMgYW55KS5iID0gYlxuXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGltcG9ydCBtYWluIGZyb20gXCIuL21haW4vbWFpblwiO1xuXG5pbXBvcnQgeyB0ZXN0Q29uY2VwdHMgfSBmcm9tIFwiLi90ZXN0cy90ZXN0Q29uY2VwdHNcIjtcblxuLy8gbWFpbigpXG5cbnRlc3RDb25jZXB0cygpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9