/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/index.ts":
/*!**********************!*\
  !*** ./app/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const newUnification_1 = __webpack_require__(/*! ./tests/newUnification */ "./app/tests/newUnification.ts");
(() => __awaiter(void 0, void 0, void 0, function* () {
    // await autotester()
    // main()
    (0, newUnification_1.newUnification)();
}))();


/***/ }),

/***/ "./app/src/utils/uniq.ts":
/*!*******************************!*\
  !*** ./app/src/utils/uniq.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uniq = void 0;
/**
 * Remove duplicates from an array. Equality by JSON.stringify.
 */
function uniq(seq) {
    let seen = {};
    return seq.filter(e => {
        const k = JSON.stringify(e);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
}
exports.uniq = uniq;


/***/ }),

/***/ "./app/tests/newUnification.ts":
/*!*************************************!*\
  !*** ./app/tests/newUnification.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.newUnification = void 0;
const uniq_1 = __webpack_require__(/*! ../src/utils/uniq */ "./app/src/utils/uniq.ts");
const testData = [
    { x: 1 }, { x: 10 },
    { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 10, y: 11 }, { x: 11, y: 12 },
    { y: 2 }, { y: 11 },
    { y: 1, z: 2 }, { y: 2, z: 3 }, { y: 10, z: 11 }, { y: 11, z: 12 },
    { z: 3 }, { z: 12 },
    { x: 1 }, { x: 10 },
];
const testData2 = [
    { x: 1 }, { x: 10 },
    { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 10, y: 11 }, { x: 11, y: 12 },
    { y: 2 }, { y: 11 },
    { y: 1, z: 2 }, { y: 2, z: 3 }, { y: 10, z: 11 }, { y: 11, z: 12 },
    { z: 3 }, { z: 12 },
    { x: 1 }
];
function allValsOf(maps, variable) {
    return (0, uniq_1.uniq)(maps.flatMap(m => { var _a; return (_a = m[variable]) !== null && _a !== void 0 ? _a : []; }));
}
function allVars(maps) {
    return (0, uniq_1.uniq)(maps.flatMap(x => Object.keys(x)));
}
function isInvalid(map, allValsOfMem) {
    return Object.entries(map).some(x => !allValsOfMem[x[0]].includes(x[1]));
}
function solveMaps(maps) {
    const oneEntryMaps = maps.filter(m => Object.values(m).length <= 1);
    const allValsOfMem = allVars(oneEntryMaps).map(x => ({ [x]: allValsOf(oneEntryMaps, x) })).reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
    const valid = maps.filter(m => !isInvalid(m, allValsOfMem));
    valid.forEach((m1, i) => {
        valid.forEach((m2, j) => {
            if (i !== j && Object.entries(m1).some(e => m2[e[0]] === e[1])) {
                valid[j] = Object.assign(Object.assign({}, m2), m1);
                valid[i] = {};
            }
        });
    });
    return valid.filter(m => Object.values(m).length);
}
function newUnification() {
    const maps = solveMaps(testData);
    console.log(maps);
}
exports.newUnification = newUnification;


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./app/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDRHQUF3RDtBQUd4RCxDQUFDLEdBQVMsRUFBRTtJQUNSLHFCQUFxQjtJQUNyQixTQUFTO0lBQ1QsbUNBQWMsR0FBRTtBQUNwQixDQUFDLEVBQUMsRUFBRTs7Ozs7Ozs7Ozs7Ozs7QUNUSjs7R0FFRztBQUNILFNBQWdCLElBQUksQ0FBSSxHQUFRO0lBQzVCLElBQUksSUFBSSxHQUFHLEVBQVM7SUFFcEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2xCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDNUQsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQVBELG9CQU9DOzs7Ozs7Ozs7Ozs7OztBQ1JELHVGQUF5QztBQUV6QyxNQUFNLFFBQVEsR0FBVTtJQUNwQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDbkIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDbEUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ25CLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ2xFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNuQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7Q0FDdEI7QUFFRCxNQUFNLFNBQVMsR0FBVTtJQUNyQixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDbkIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUU7SUFDbEUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ25CLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ2xFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRTtJQUNuQixFQUFFLENB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L2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvdW5pcS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvdGVzdHMvbmV3VW5pZmljYXRpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWFpbiBmcm9tIFwiLi9zcmMvbWFpbi9tYWluXCI7XG5pbXBvcnQgYXV0b3Rlc3RlciBmcm9tIFwiLi90ZXN0cy9hdXRvdGVzdGVyXCJcbmltcG9ydCB7IG5ld1VuaWZpY2F0aW9uIH0gZnJvbSBcIi4vdGVzdHMvbmV3VW5pZmljYXRpb25cIjtcblxuXG4oYXN5bmMgKCkgPT4ge1xuICAgIC8vIGF3YWl0IGF1dG90ZXN0ZXIoKVxuICAgIC8vIG1haW4oKVxuICAgIG5ld1VuaWZpY2F0aW9uKClcbn0pKCkiLCIvKipcbiAqIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gYW4gYXJyYXkuIEVxdWFsaXR5IGJ5IEpTT04uc3RyaW5naWZ5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5pcTxUPihzZXE6IFRbXSk6IFRbXSB7XG4gICAgbGV0IHNlZW4gPSB7fSBhcyBhbnlcblxuICAgIHJldHVybiBzZXEuZmlsdGVyKGUgPT4ge1xuICAgICAgICBjb25zdCBrID0gSlNPTi5zdHJpbmdpZnkoZSlcbiAgICAgICAgcmV0dXJuIHNlZW4uaGFzT3duUHJvcGVydHkoaykgPyBmYWxzZSA6IChzZWVuW2tdID0gdHJ1ZSlcbiAgICB9KVxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL3NyYy9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9zcmMvbWlkZGxlL2lkL01hcFwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi9zcmMvdXRpbHMvdW5pcVwiO1xuXG5jb25zdCB0ZXN0RGF0YTogTWFwW10gPSBbXG4gICAgeyB4OiAxIH0sIHsgeDogMTAgfSxcbiAgICB7IHg6IDEsIHk6IDIgfSwgeyB4OiAyLCB5OiAzIH0sIHsgeDogMTAsIHk6IDExIH0sIHsgeDogMTEsIHk6IDEyIH0sXG4gICAgeyB5OiAyIH0sIHsgeTogMTEgfSxcbiAgICB7IHk6IDEsIHo6IDIgfSwgeyB5OiAyLCB6OiAzIH0sIHsgeTogMTAsIHo6IDExIH0sIHsgeTogMTEsIHo6IDEyIH0sXG4gICAgeyB6OiAzIH0sIHsgejogMTIgfSxcbiAgICB7IHg6IDEgfSwgeyB4OiAxMCB9LFxuXVxuXG5jb25zdCB0ZXN0RGF0YTI6IE1hcFtdID0gWy8vIFdST05HIFJFU1VMVCBGT1IgVEhJUyBURVNUIVxuICAgIHsgeDogMSB9LCB7IHg6IDEwIH0sXG4gICAgeyB4OiAxLCB5OiAyIH0sIHsgeDogMiwgeTogMyB9LCB7IHg6IDEwLCB5OiAxMSB9LCB7IHg6IDExLCB5OiAxMiB9LFxuICAgIHsgeTogMiB9LCB7IHk6IDExIH0sXG4gICAgeyB5OiAxLCB6OiAyIH0sIHsgeTogMiwgejogMyB9LCB7IHk6IDEwLCB6OiAxMSB9LCB7IHk6IDExLCB6OiAxMiB9LFxuICAgIHsgejogMyB9LCB7IHo6IDEyIH0sXG4gICAgeyB4OiAxIH1cbl1cblxuXG5mdW5jdGlvbiBhbGxWYWxzT2YobWFwczogTWFwW10sIHZhcmlhYmxlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdW5pcShtYXBzLmZsYXRNYXAobSA9PiBtW3ZhcmlhYmxlXSA/PyBbXSkpXG59XG5cbmZ1bmN0aW9uIGFsbFZhcnMobWFwczogTWFwW10pIHtcbiAgICByZXR1cm4gdW5pcShtYXBzLmZsYXRNYXAoeCA9PiBPYmplY3Qua2V5cyh4KSkpXG59XG5cbmZ1bmN0aW9uIGlzSW52YWxpZChtYXA6IE1hcCwgYWxsVmFsc09mTWVtOiB7IFt4OiBJZF06IElkW10gfSkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhtYXApLnNvbWUoeCA9PiAhYWxsVmFsc09mTWVtW3hbMF1dLmluY2x1ZGVzKHhbMV0pKVxufVxuXG5mdW5jdGlvbiBzb2x2ZU1hcHMobWFwczogTWFwW10pOiBNYXBbXSB7XG5cbiAgICBjb25zdCBvbmVFbnRyeU1hcHMgPSBtYXBzLmZpbHRlcihtID0+IE9iamVjdC52YWx1ZXMobSkubGVuZ3RoIDw9IDEpXG4gICAgY29uc3QgYWxsVmFsc09mTWVtID0gYWxsVmFycyhvbmVFbnRyeU1hcHMpLm1hcCh4ID0+ICh7IFt4XTogYWxsVmFsc09mKG9uZUVudHJ5TWFwcywgeCkgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcbiAgICBjb25zdCB2YWxpZCA9IG1hcHMuZmlsdGVyKG0gPT4gIWlzSW52YWxpZChtLCBhbGxWYWxzT2ZNZW0pKVxuXG4gICAgdmFsaWQuZm9yRWFjaCgobTEsIGkpID0+IHtcbiAgICAgICAgdmFsaWQuZm9yRWFjaCgobTIsIGopID0+IHtcblxuICAgICAgICAgICAgaWYgKGkgIT09IGogJiYgT2JqZWN0LmVudHJpZXMobTEpLnNvbWUoZSA9PiBtMltlWzBdXSA9PT0gZVsxXSkpIHtcbiAgICAgICAgICAgICAgICB2YWxpZFtqXSA9IHsgLi4ubTIsIC4uLm0xIH1cbiAgICAgICAgICAgICAgICB2YWxpZFtpXSA9IHt9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIHZhbGlkLmZpbHRlcihtID0+IE9iamVjdC52YWx1ZXMobSkubGVuZ3RoKVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBuZXdVbmlmaWNhdGlvbigpIHtcbiAgICBjb25zdCBtYXBzID0gc29sdmVNYXBzKHRlc3REYXRhKVxuICAgIGNvbnNvbGUubG9nKG1hcHMpXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9