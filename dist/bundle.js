/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/src/index.ts":
/*!**************************!*\
  !*** ./app/src/index.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const xnounphrase_1 = __importDefault(__webpack_require__(/*! ./tests/xnounphrase */ "./app/src/tests/xnounphrase.ts"));
// import xparsertest from "./tests/xparsertest";
// await toclausetests()
// (async ()=>{
//     await autotester()
// })()
(0, xnounphrase_1.default)();
// main()


/***/ }),

/***/ "./app/src/lexer/EagerLexer.ts":
/*!*************************************!*\
  !*** ./app/src/lexer/EagerLexer.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Lexeme_1 = __webpack_require__(/*! ./Lexeme */ "./app/src/lexer/Lexeme.ts");
class EagerLexer {
    constructor(sourceCode) {
        this.sourceCode = sourceCode;
        this.tokens = sourceCode
            .trim()
            .split(/\s+|\./)
            .map(s => !s ? '.' : s)
            .flatMap(s => (0, Lexeme_1.getLexemes)(s));
        this._pos = 0;
    }
    next() {
        this._pos++;
    }
    get pos() {
        return this._pos;
    }
    backTo(pos) {
        this._pos = pos;
    }
    get peek() {
        return this.tokens[this._pos];
    }
    croak(errorMsg) {
        throw new Error(`${errorMsg} at ${this._pos}`);
    }
    /**
     * Return current token iff of given type and move to next;
     * else return undefined and don't move.
     * @param args
     * @returns
     */
    assert(type, args) {
        var _a, _b;
        const current = this.peek;
        if (current && current.type === type) {
            this.next();
            return current;
        }
        else if ((_a = args.errorOut) !== null && _a !== void 0 ? _a : true) {
            this.croak((_b = args.errorMsg) !== null && _b !== void 0 ? _b : '');
        }
        else {
            return undefined;
        }
    }
    get isEnd() {
        return this.pos >= this.tokens.length;
    }
}
exports["default"] = EagerLexer;


/***/ }),

/***/ "./app/src/lexer/Lexeme.ts":
/*!*********************************!*\
  !*** ./app/src/lexer/Lexeme.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLexemes = exports.formsOf = void 0;
const lexemes_1 = __webpack_require__(/*! ./lexemes */ "./app/src/lexer/lexemes.ts");
function formsOf(lexeme) {
    var _a;
    return [lexeme.root].concat((_a = lexeme === null || lexeme === void 0 ? void 0 : lexeme.forms) !== null && _a !== void 0 ? _a : [])
        .concat(lexeme.regular ? [`${lexeme.root}s`] : []);
}
exports.formsOf = formsOf;
function getLexemes(word) {
    var _a;
    const lexeme = (_a = lexemes_1.lexemes.filter(x => formsOf(x).includes(word)).at(0)) !== null && _a !== void 0 ? _a : { root: word, type: 'adj' };
    const lexeme2 = Object.assign(Object.assign({}, lexeme), { token: word });
    return lexeme2.contractionFor ?
        lexeme2.contractionFor.flatMap(x => getLexemes(x)) :
        [lexeme2];
}
exports.getLexemes = getLexemes;


/***/ }),

/***/ "./app/src/lexer/Lexer.ts":
/*!********************************!*\
  !*** ./app/src/lexer/Lexer.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLexer = void 0;
const EagerLexer_1 = __importDefault(__webpack_require__(/*! ./EagerLexer */ "./app/src/lexer/EagerLexer.ts"));
function getLexer(sourceCode) {
    return new EagerLexer_1.default(sourceCode);
}
exports.getLexer = getLexer;


/***/ }),

/***/ "./app/src/lexer/lexemes.ts":
/*!**********************************!*\
  !*** ./app/src/lexer/lexemes.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemes = void 0;
exports.lexemes = [
    {
        root: 'have',
        type: 'mverb',
        forms: ['have', 'has'],
        regular: false
    },
    {
        root: 'button',
        type: 'noun',
        regular: true
    },
    {
        root: 'click',
        type: 'mverb',
        forms: ['click'],
        regular: true
    },
    {
        root: 'clicked',
        type: 'adj',
        derivedFrom: 'click'
    },
    {
        root: 'pressed',
        type: 'adj',
        aliasFor: 'clicked'
    },
    {
        root: 'cat',
        type: 'noun'
    },
    {
        root: 'be',
        type: 'copula',
        forms: ['is', 'are'],
        regular: false
    },
    {
        root: "isn't",
        type: 'contraction',
        contractionFor: ['is', 'not']
    },
    {
        root: "red",
        type: "adj"
    },
    {
        root: "green",
        type: "adj"
    },
    {
        root: "exist",
        type: "iverb",
        regular: true
    },
    {
        root: 'do',
        type: 'hverb',
        regular: false,
        forms: ['do', 'does']
    },
    {
        root: 'some',
        type: 'existquant'
    },
    {
        root: 'every',
        type: 'uniquant'
    },
    {
        root: 'all',
        type: 'uniquant'
    },
    {
        root: 'any',
        type: 'uniquant'
    },
    {
        root: 'to',
        type: 'preposition'
    },
    {
        root: 'with',
        type: 'preposition'
    },
    {
        root: 'from',
        type: 'preposition'
    },
    {
        root: 'of',
        type: 'preposition'
    },
    {
        root: 'over',
        type: 'preposition'
    },
    {
        root: 'on',
        type: 'preposition'
    },
    {
        root: 'at',
        type: 'preposition'
    },
    {
        root: 'then',
        type: 'then' // filler word
    },
    {
        root: 'if',
        type: 'subconj'
    },
    {
        root: 'when',
        type: 'subconj'
    },
    {
        root: 'because',
        type: 'subconj'
    },
    {
        root: 'while',
        type: 'subconj'
    },
    {
        root: 'that',
        type: 'relpron'
    },
    {
        root: 'not',
        type: 'negation'
    },
    {
        root: 'the',
        type: 'defart'
    },
    {
        root: 'a',
        type: 'indefart'
    },
    {
        root: 'an',
        type: 'indefart'
    },
    {
        root: '.',
        type: 'fullstop'
    },
    {
        root: 'and',
        type: 'nonsubconj'
    }
];


/***/ }),

/***/ "./app/src/tests/xnounphrase.ts":
/*!**************************************!*\
  !*** ./app/src/tests/xnounphrase.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parse = void 0;
const Lexer_1 = __webpack_require__(/*! ../lexer/Lexer */ "./app/src/lexer/Lexer.ts");
const blueprints = {
    'nounphrase': [
        { type: ['uniquant', 'existquant'], number: '1|0' },
        { type: ['indefart', 'defart'], number: '1|0' },
        { type: ['adj'], number: '*' },
        { type: ['noun'], number: '1|0' },
        { type: ['copulasubclause', /*'iverbsubclause', 'mverbsubclause1', 'mverbsubclause2'*/], number: '*' },
        { type: ['complement'], number: '*' },
    ],
    'complement': [
        { type: ['preposition'], number: 1 },
        { type: ['nounphrase'], number: 1 }
    ],
    'copulasubclause': [
        { type: ['relpron'], number: 1 },
        { type: ['copula'], number: 1 },
        { type: ['nounphrase'], number: 1 }
    ],
    'copulasentence': [
        { type: ['nounphrase'], number: 1, role: 'subject' },
        { type: ['copula'], number: 1 },
        { type: ['negation'], number: '1|0' },
        { type: ['nounphrase'], number: 1, role: 'predicate' }
    ],
    'iverbsentence': [
        { type: ['nounphrase'], number: 1, role: 'subject' },
        { type: ['negation'], number: '1|0' },
        { type: ['iverb'], number: 1 },
        { type: ['complement'], number: '*' }
    ],
    'complexsentence1': [
        { type: ['subconj'], number: 1 },
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'condition' },
        { type: ['then'], number: '1|0' },
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'consequence' }
    ],
    'complexsentence2': [
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'consequence' },
        { type: ['subconj'], number: 1 },
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'condition' }
    ],
    'mverbsentence': [
        { type: ['nounphrase'], number: 1, role: 'subject' },
        { type: ['negation'], number: '1|0' },
        { type: ['mverb'], number: 1 },
        { type: ['complement'], number: '*' },
        { type: ['nounphrase'], number: 1, role: 'object' },
        { type: ['complement'], number: '*' },
    ]
};
function getBlueprint(name) {
    var _a;
    return (_a = blueprints[name]) !== null && _a !== void 0 ? _a : [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
}
function isAtom(name) {
    const lexemeTypes = ['adj', 'contraction', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'iverb', 'mverb', 'negation', 'nonsubconj', 'existquant', 'uniquant', 'then', 'relpron', 'negation', 'noun', 'preposition', 'subconj'];
    return lexemeTypes.includes(name);
}
function parse(name, lexer, number) {
    const members = getBlueprint(name);
    if (members.length === 1 && members[0].type.every(t => isAtom(t))) {
        return parseAtom(members[0], lexer, number);
    }
    else {
        return parseComposite(name, lexer, number);
    }
}
exports.parse = parse;
function parseAtom(m, lexer, number) {
    const atoms = [];
    while (!lexer.isEnd && m.type.includes(lexer.peek.type)) {
        if (number !== '*' && atoms.length >= 1) {
            break;
        }
        const x = lexer.peek;
        lexer.next();
        atoms.push({ type: x.type, lexeme: x });
    }
    switch (atoms.length) {
        case 0:
            return undefined;
        case 1:
            return atoms[0];
        default:
            const x = {
                links: atoms
            };
            return x;
    }
}
function isNecessary(m) {
    return m.number === 1;
}
function parseComposite(name, lexer, number) {
    const links = [];
    for (const m of getBlueprint(name)) {
        const ast = parseMember(m, lexer);
        if (!ast && isNecessary(m)) {
            return undefined;
        }
        links.push(ast);
    }
    return {
        type: name,
        links: links
    };
}
function parseMember(m, lexer) {
    let x;
    const memento = lexer.pos;
    for (const t of m.type) {
        x = parse(t, lexer, m.number);
        if (x) {
            break;
        }
        else {
            lexer.backTo(memento);
        }
    }
    return x;
}
//////////////////////////////////////
function testNewXParser() {
    const x = parse('copulasentence', (0, Lexer_1.getLexer)('the black red cat is green'));
    // const x = parse('copulasentence', getLexer('the cat that is black is red'))
    // const x = parse('complexsentence1', getLexer('if the cat is red then the cat is black'))
    console.log(x);
}
exports["default"] = testNewXParser;


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
/******/ 	var __webpack_exports__ = __webpack_require__("./app/src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QkFBUSxFQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDekUsOEVBQThFO0lBQzlFLDJGQUEyRjtJQUMzRixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUVsQixDQUFDO0FBUEQsb0NBT0M7Ozs7Ozs7VUM3TkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdGVzdHMveG5vdW5waHJhc2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWFpbiBmcm9tIFwiLi9tYWluL21haW5cIjtcbmltcG9ydCBhdXRvdGVzdGVyIGZyb20gXCIuL3Rlc3RzL2F1dG90ZXN0ZXJcIjtcbmltcG9ydCB7IHRvY2xhdXNldGVzdHMgfSBmcm9tIFwiLi90ZXN0cy90b2NsYXVzZXRlc3RzXCI7XG5pbXBvcnQgdGVzdE5ld1hQYXJzZXIgZnJvbSBcIi4vdGVzdHMveG5vdW5waHJhc2VcIjtcbi8vIGltcG9ydCB4cGFyc2VydGVzdCBmcm9tIFwiLi90ZXN0cy94cGFyc2VydGVzdFwiO1xuLy8gYXdhaXQgdG9jbGF1c2V0ZXN0cygpXG5cbi8vIChhc3luYyAoKT0+e1xuLy8gICAgIGF3YWl0IGF1dG90ZXN0ZXIoKVxuLy8gfSkoKVxuXG50ZXN0TmV3WFBhcnNlcigpXG5cbi8vIG1haW4oKVxuXG4iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IGdldExleGVtZXMsIExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IExleGVyLCB7IEFzc2VydEFyZ3MgfSBmcm9tIFwiLi9MZXhlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYWdlckxleGVyIGltcGxlbWVudHMgTGV4ZXIge1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRva2VuczogTGV4ZW1lPExleGVtZVR5cGU+W11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcpIHtcblxuICAgICAgICB0aGlzLnRva2VucyA9IHNvdXJjZUNvZGVcbiAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgLm1hcChzID0+ICFzID8gJy4nIDogcylcbiAgICAgICAgICAgIC5mbGF0TWFwKHMgPT4gZ2V0TGV4ZW1lcyhzKSlcblxuICAgICAgICB0aGlzLl9wb3MgPSAwXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lPExleGVtZVR5cGU+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuX3Bvc11cbiAgICB9XG5cbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1zZ30gYXQgJHt0aGlzLl9wb3N9YCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGN1cnJlbnQgdG9rZW4gaWZmIG9mIGdpdmVuIHR5cGUgYW5kIG1vdmUgdG8gbmV4dDsgXG4gICAgICogZWxzZSByZXR1cm4gdW5kZWZpbmVkIGFuZCBkb24ndCBtb3ZlLlxuICAgICAqIEBwYXJhbSBhcmdzIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIGFzc2VydDxUIGV4dGVuZHMgTGV4ZW1lVHlwZT4odHlwZTogVCwgYXJnczogQXNzZXJ0QXJncyk6IExleGVtZTxUPiB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMucGVla1xuXG4gICAgICAgIGlmIChjdXJyZW50ICYmIGN1cnJlbnQudHlwZSA9PT0gdHlwZSkge1xuICAgICAgICAgICAgdGhpcy5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50IGFzIExleGVtZTxUPlxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MuZXJyb3JPdXQgPz8gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcm9hayhhcmdzLmVycm9yTXNnID8/ICcnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZTxUIGV4dGVuZHMgTGV4ZW1lVHlwZT4ge1xuICAgIC8qKmNhbm9uaWNhbCBmb3JtKi8gcmVhZG9ubHkgcm9vdDogc3RyaW5nXG4gICAgLyoqdG9rZW4gdHlwZSovIHJlYWRvbmx5IHR5cGU6IFRcbiAgICAvKip1c2VmdWwgZm9yIGlycmVndWxhciBzdHVmZiovIHJlYWRvbmx5IGZvcm1zPzogc3RyaW5nW11cbiAgICAvKipyZWZlcnMgdG8gdmVyYiBjb25qdWdhdGlvbnMgb3IgcGx1cmFsIGZvcm1zKi8gcmVhZG9ubHkgcmVndWxhcj86IGJvb2xlYW5cbiAgICAvKipzZW1hbnRpY2FsIGRlcGVuZGVjZSovIHJlYWRvbmx5IGRlcml2ZWRGcm9tPzogc3RyaW5nXG4gICAgLyoqc2VtYW50aWNhbCBlcXVpdmFsZW5jZSovIHJlYWRvbmx5IGFsaWFzRm9yPzogc3RyaW5nXG4gICAgLyoqbWFkZSB1cCBvZiBtb3JlIGxleGVtZXMqLyByZWFkb25seSBjb250cmFjdGlvbkZvcj86IHN0cmluZ1tdXG4gICAgLyoqZm9ybSBvZiB0aGlzIGluc3RhbmNlKi9yZWFkb25seSB0b2tlbj86IHN0cmluZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybXNPZihsZXhlbWU6IExleGVtZTxMZXhlbWVUeXBlPikge1xuXG4gICAgcmV0dXJuIFtsZXhlbWUucm9vdF0uY29uY2F0KGxleGVtZT8uZm9ybXMgPz8gW10pXG4gICAgICAgIC5jb25jYXQobGV4ZW1lLnJlZ3VsYXIgPyBbYCR7bGV4ZW1lLnJvb3R9c2BdIDogW10pXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVtZXMod29yZDogc3RyaW5nKTogTGV4ZW1lPExleGVtZVR5cGU+W10ge1xuXG4gICAgY29uc3QgbGV4ZW1lOiBMZXhlbWU8TGV4ZW1lVHlwZT4gPVxuICAgICAgICBsZXhlbWVzLmZpbHRlcih4ID0+IGZvcm1zT2YoeCkuaW5jbHVkZXMod29yZCkpLmF0KDApXG4gICAgICAgID8/IHsgcm9vdDogd29yZCwgdHlwZTogJ2FkaicgfVxuXG4gICAgY29uc3QgbGV4ZW1lMjogTGV4ZW1lPExleGVtZVR5cGU+ID0geyAuLi5sZXhlbWUsIHRva2VuOiB3b3JkIH1cblxuICAgIHJldHVybiBsZXhlbWUyLmNvbnRyYWN0aW9uRm9yID9cbiAgICAgICAgbGV4ZW1lMi5jb250cmFjdGlvbkZvci5mbGF0TWFwKHggPT4gZ2V0TGV4ZW1lcyh4KSkgOlxuICAgICAgICBbbGV4ZW1lMl1cblxufVxuIiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9MZXhlbWVUeXBlXCJcbmltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIExleGVyIHtcbiAgICBnZXQgcGVlaygpOiBMZXhlbWU8TGV4ZW1lVHlwZT5cbiAgICBnZXQgcG9zKCk6IG51bWJlclxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkXG4gICAgYXNzZXJ0PFQgZXh0ZW5kcyBMZXhlbWVUeXBlPih0eXBlOiBULCBhcmdzOiBBc3NlcnRBcmdzKTogTGV4ZW1lPFQ+IHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXJ0QXJncyB7XG4gICAgZXJyb3JNc2c/OiBzdHJpbmdcbiAgICBlcnJvck91dD86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6IHN0cmluZyk6IExleGVyIHtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSlcbn1cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUXG4iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuXG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBMZXhlbWU8TGV4ZW1lVHlwZT5bXSA9IFtcbiAgICB7XG4gICAgICAgIHJvb3Q6ICdoYXZlJyxcbiAgICAgICAgdHlwZTogJ212ZXJiJyxcbiAgICAgICAgZm9ybXM6IFsnaGF2ZScsICdoYXMnXSxcbiAgICAgICAgcmVndWxhcjogZmFsc2VcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYnV0dG9uJyxcbiAgICAgICAgdHlwZTogJ25vdW4nLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NsaWNrJyxcbiAgICAgICAgdHlwZTogJ212ZXJiJyxcbiAgICAgICAgZm9ybXM6IFsnY2xpY2snXSxcbiAgICAgICAgcmVndWxhcjogdHJ1ZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjbGlja2VkJyxcbiAgICAgICAgdHlwZTogJ2FkaicsXG4gICAgICAgIGRlcml2ZWRGcm9tOiAnY2xpY2snXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZXNzZWQnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgYWxpYXNGb3I6ICdjbGlja2VkJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjYXQnLFxuICAgICAgICB0eXBlOiAnbm91bidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYmUnLFxuICAgICAgICB0eXBlOiAnY29wdWxhJyxcbiAgICAgICAgZm9ybXM6IFsnaXMnLCAnYXJlJ10sXG4gICAgICAgIHJlZ3VsYXI6IGZhbHNlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJpc24ndFwiLFxuICAgICAgICB0eXBlOiAnY29udHJhY3Rpb24nLFxuICAgICAgICBjb250cmFjdGlvbkZvcjogWydpcycsICdub3QnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwicmVkXCIsXG4gICAgICAgIHR5cGU6IFwiYWRqXCJcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImdyZWVuXCIsXG4gICAgICAgIHR5cGU6IFwiYWRqXCJcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImV4aXN0XCIsXG4gICAgICAgIHR5cGU6IFwiaXZlcmJcIixcbiAgICAgICAgcmVndWxhcjogdHJ1ZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdkbycsXG4gICAgICAgIHR5cGU6ICdodmVyYicsXG4gICAgICAgIHJlZ3VsYXI6IGZhbHNlLFxuICAgICAgICBmb3JtczogWydkbycsICdkb2VzJ11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc29tZScsXG4gICAgICAgIHR5cGU6ICdleGlzdHF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdldmVyeScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYWxsJyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbnknLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RvJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aXRoJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdmcm9tJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvZicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3ZlcicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb24nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2F0JyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGVuJyxcbiAgICAgICAgdHlwZTogJ3RoZW4nIC8vIGZpbGxlciB3b3JkXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2lmJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3doZW4nLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYmVjYXVzZScsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aGlsZScsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGF0JyxcbiAgICAgICAgdHlwZTogJ3JlbHByb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ25vdCcsXG4gICAgICAgIHR5cGU6ICduZWdhdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhlJyxcbiAgICAgICAgdHlwZTogJ2RlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYScsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYW4nLFxuICAgICAgICB0eXBlOiAnaW5kZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJy4nLFxuICAgICAgICB0eXBlOiAnZnVsbHN0b3AnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FuZCcsXG4gICAgICAgIHR5cGU6ICdub25zdWJjb25qJ1xuICAgIH1cbl0iLCJpbXBvcnQgTGV4ZXIsIHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuXG50eXBlIEFzdFR5cGUgPSBMZXhlbWVUeXBlIHwgQ29uc3RpdHVlbnRUeXBlXG5cbnR5cGUgQ29uc3RpdHVlbnRUeXBlID0gJ25vdW5waHJhc2UnXG4gICAgfCAnY29tcGxlbWVudCdcbiAgICB8ICdjb3B1bGFzdWJjbGF1c2UnXG4gICAgfCAnY29tcGxleHNlbnRlbmNlMSdcbiAgICB8ICdjb21wbGV4c2VudGVuY2UyJ1xuICAgIHwgJ2NvcHVsYXNlbnRlbmNlJ1xuICAgIHwgJ2l2ZXJic2VudGVuY2UnXG4gICAgfCAnbXZlcmJzZW50ZW5jZSdcbi8vIHwgJ2l2ZXJic3ViY2xhdXNlJ1xuLy8gfCAnbXZlcmJzdWJjbGF1c2UxJ1xuLy8gfCAnbXZlcmJzdWJjbGF1c2UyJ1xuLy8gfCAnY29uanNlbnRlY2UnXG4vLyB8ICdjb3B1bGFxdWVzdGlvbidcblxudHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCBudW1iZXJcblxudHlwZSBSb2xlID0gJ3N1YmplY3QnXG4gICAgfCAnb2JqZWN0J1xuICAgIHwgJ3ByZWRpY2F0ZSdcbiAgICB8ICdjb25kaXRpb24nXG4gICAgfCAnY29uc2VxdWVuY2UnXG5cbnR5cGUgTWVtYmVyID0ge1xuICAgIHR5cGU6IEFzdFR5cGVbXVxuICAgIG51bWJlcj86IENhcmRpbmFsaXR5XG4gICAgcm9sZT86IFJvbGVcbn1cblxuY29uc3QgYmx1ZXByaW50czogeyBbbmFtZSBpbiBDb25zdGl0dWVudFR5cGVdOiBNZW1iZXJbXSB9ID0ge1xuXG4gICAgJ25vdW5waHJhc2UnOiBbXG4gICAgICAgIHsgdHlwZTogWyd1bmlxdWFudCcsICdleGlzdHF1YW50J10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2luZGVmYXJ0JywgJ2RlZmFydCddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZTogWydhZGonXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhc3ViY2xhdXNlJywgLyonaXZlcmJzdWJjbGF1c2UnLCAnbXZlcmJzdWJjbGF1c2UxJywgJ212ZXJic3ViY2xhdXNlMicqL10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonIH0sXG4gICAgXSxcbiAgICAnY29tcGxlbWVudCc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ3ByZXBvc2l0aW9uJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnbm91bnBocmFzZSddLCBudW1iZXI6IDEgfVxuICAgIF0sXG4gICAgJ2NvcHVsYXN1YmNsYXVzZSc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ3JlbHByb24nXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGEnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydub3VucGhyYXNlJ10sIG51bWJlcjogMSB9XG4gICAgXSxcbiAgICAnY29wdWxhc2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZTogWydub3VucGhyYXNlJ10sIG51bWJlcjogMSwgcm9sZTogJ3N1YmplY3QnIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGEnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWyduZWdhdGlvbiddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZTogWydub3VucGhyYXNlJ10sIG51bWJlcjogMSwgcm9sZTogJ3ByZWRpY2F0ZScgfVxuICAgIF0sXG4gICAgJ2l2ZXJic2VudGVuY2UnOiBbXG4gICAgICAgIHsgdHlwZTogWydub3VucGhyYXNlJ10sIG51bWJlcjogMSwgcm9sZTogJ3N1YmplY3QnIH0sXG4gICAgICAgIHsgdHlwZTogWyduZWdhdGlvbiddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZTogWydpdmVyYiddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvbXBsZW1lbnQnXSwgbnVtYmVyOiAnKicgfVxuICAgIF0sXG4gICAgJ2NvbXBsZXhzZW50ZW5jZTEnOiBbXG4gICAgICAgIHsgdHlwZTogWydzdWJjb25qJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhc2VudGVuY2UnLCAnbXZlcmJzZW50ZW5jZScsICdpdmVyYnNlbnRlbmNlJ10sIG51bWJlcjogMSwgcm9sZTogJ2NvbmRpdGlvbicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3RoZW4nXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGU6IFsnY29wdWxhc2VudGVuY2UnLCAnbXZlcmJzZW50ZW5jZScsICdpdmVyYnNlbnRlbmNlJ10sIG51bWJlcjogMSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9XG4gICAgXSxcbiAgICAnY29tcGxleHNlbnRlbmNlMic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYXNlbnRlbmNlJywgJ212ZXJic2VudGVuY2UnLCAnaXZlcmJzZW50ZW5jZSddLCBudW1iZXI6IDEsIHJvbGU6ICdjb25zZXF1ZW5jZScgfSxcbiAgICAgICAgeyB0eXBlOiBbJ3N1YmNvbmonXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGFzZW50ZW5jZScsICdtdmVyYnNlbnRlbmNlJywgJ2l2ZXJic2VudGVuY2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnY29uZGl0aW9uJyB9XG4gICAgXSxcbiAgICAnbXZlcmJzZW50ZW5jZSc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25lZ2F0aW9uJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ212ZXJiJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnY29tcGxlbWVudCddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IHR5cGU6IFsnbm91bnBocmFzZSddLCBudW1iZXI6IDEsIHJvbGU6ICdvYmplY3QnIH0sXG4gICAgICAgIHsgdHlwZTogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonIH0sXG4gICAgXVxuXG59XG5cbmludGVyZmFjZSBBc3ROb2RlPFQgZXh0ZW5kcyBBc3RUeXBlPiB7XG4gICAgdHlwZTogVFxuICAgIG5hbWU/OiBzdHJpbmdcbn1cblxuaW50ZXJmYWNlIEF0b21Ob2RlIGV4dGVuZHMgQXN0Tm9kZTxMZXhlbWVUeXBlPiB7XG4gICAgbGV4ZW1lOiBMZXhlbWU8TGV4ZW1lVHlwZT5cbn1cblxuaW50ZXJmYWNlIENvbXBvc2l0ZU5vZGUgZXh0ZW5kcyBBc3ROb2RlPENvbnN0aXR1ZW50VHlwZT4ge1xuICAgIGxpbmtzOiAoQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZClbXVxufVxuXG5mdW5jdGlvbiBnZXRCbHVlcHJpbnQobmFtZTogQXN0VHlwZSk6IE1lbWJlcltdIHtcbiAgICByZXR1cm4gYmx1ZXByaW50c1tuYW1lIGFzIENvbnN0aXR1ZW50VHlwZV0gPz8gW3sgdHlwZTogW25hbWVdLCBudW1iZXI6IDEgfV0gLy8gVE9ETzogcHJvYmxlbSwgYWRqIGlzIG5vdCBhbHdheXMgMSAhISEhISFcbn1cblxuZnVuY3Rpb24gaXNBdG9tKG5hbWU6IEFzdFR5cGUpIHtcbiAgICBjb25zdCBsZXhlbWVUeXBlczogTGV4ZW1lVHlwZVtdID0gWydhZGonLCAnY29udHJhY3Rpb24nLCAnY29wdWxhJywgJ2RlZmFydCcsICdpbmRlZmFydCcsICdmdWxsc3RvcCcsICdodmVyYicsICdpdmVyYicsICdtdmVyYicsICduZWdhdGlvbicsICdub25zdWJjb25qJywgJ2V4aXN0cXVhbnQnLCAndW5pcXVhbnQnLCAndGhlbicsICdyZWxwcm9uJywgJ25lZ2F0aW9uJywgJ25vdW4nLCAncHJlcG9zaXRpb24nLCAnc3ViY29uaiddXG4gICAgcmV0dXJuIGxleGVtZVR5cGVzLmluY2x1ZGVzKG5hbWUgYXMgTGV4ZW1lVHlwZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKG5hbWU6IEFzdFR5cGUsIGxleGVyOiBMZXhlciwgbnVtYmVyPzogQ2FyZGluYWxpdHkpOiBBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IG1lbWJlcnMgPSBnZXRCbHVlcHJpbnQobmFtZSlcblxuICAgIGlmIChtZW1iZXJzLmxlbmd0aCA9PT0gMSAmJiBtZW1iZXJzWzBdLnR5cGUuZXZlcnkodCA9PiBpc0F0b20odCkpKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUF0b20obWVtYmVyc1swXSwgbGV4ZXIsIG51bWJlcilcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb25zdGl0dWVudFR5cGUsIGxleGVyLCBudW1iZXIpXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHBhcnNlQXRvbShtOiBNZW1iZXIsIGxleGVyOiBMZXhlciwgbnVtYmVyPzogQ2FyZGluYWxpdHkpOiBBdG9tTm9kZSB8IEFzdE5vZGU8QXN0VHlwZT4gfCB1bmRlZmluZWQge1xuXG4gICAgY29uc3QgYXRvbXM6IEF0b21Ob2RlW10gPSBbXVxuXG4gICAgd2hpbGUgKCFsZXhlci5pc0VuZCAmJiBtLnR5cGUuaW5jbHVkZXMobGV4ZXIucGVlay50eXBlKSkge1xuXG4gICAgICAgIGlmIChudW1iZXIgIT09ICcqJyAmJiBhdG9tcy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHggPSBsZXhlci5wZWVrXG4gICAgICAgIGxleGVyLm5leHQoKVxuICAgICAgICBhdG9tcy5wdXNoKHsgdHlwZTogeC50eXBlLCBsZXhlbWU6IHggfSlcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGF0b21zLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBhdG9tc1swXVxuICAgICAgICBkZWZhdWx0OlxuXG4gICAgICAgICAgICBjb25zdCB4OiBhbnkgPSB7XG4gICAgICAgICAgICAgICAgbGlua3M6IGF0b21zXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geCBhcyBBc3ROb2RlPEFzdFR5cGU+XG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGlzTmVjZXNzYXJ5KG06IE1lbWJlcikge1xuICAgIHJldHVybiBtLm51bWJlciA9PT0gMVxufVxuXG5mdW5jdGlvbiBwYXJzZUNvbXBvc2l0ZShuYW1lOiBDb25zdGl0dWVudFR5cGUsIGxleGVyOiBMZXhlciwgbnVtYmVyPzogQ2FyZGluYWxpdHkpOiBDb21wb3NpdGVOb2RlIHwgdW5kZWZpbmVkIHtcblxuICAgIGNvbnN0IGxpbmtzOiAoQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZClbXSA9IFtdXG5cbiAgICBmb3IgKGNvbnN0IG0gb2YgZ2V0Qmx1ZXByaW50KG5hbWUpKSB7XG5cbiAgICAgICAgY29uc3QgYXN0ID0gcGFyc2VNZW1iZXIobSwgbGV4ZXIpXG5cbiAgICAgICAgaWYgKCFhc3QgJiYgaXNOZWNlc3NhcnkobSkpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmtzLnB1c2goYXN0KVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6IG5hbWUsXG4gICAgICAgIGxpbmtzOiBsaW5rc1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VNZW1iZXIobTogTWVtYmVyLCBsZXhlcjogTGV4ZXIpOiBBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkIHtcblxuICAgIGxldCB4XG4gICAgY29uc3QgbWVtZW50byA9IGxleGVyLnBvc1xuXG4gICAgZm9yIChjb25zdCB0IG9mIG0udHlwZSkge1xuXG4gICAgICAgIHggPSBwYXJzZSh0LCBsZXhlciwgbS5udW1iZXIpXG5cbiAgICAgICAgaWYgKHgpIHtcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXhlci5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIHhcbn1cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlc3ROZXdYUGFyc2VyKCkge1xuXG4gICAgY29uc3QgeCA9IHBhcnNlKCdjb3B1bGFzZW50ZW5jZScsIGdldExleGVyKCd0aGUgYmxhY2sgcmVkIGNhdCBpcyBncmVlbicpKVxuICAgIC8vIGNvbnN0IHggPSBwYXJzZSgnY29wdWxhc2VudGVuY2UnLCBnZXRMZXhlcigndGhlIGNhdCB0aGF0IGlzIGJsYWNrIGlzIHJlZCcpKVxuICAgIC8vIGNvbnN0IHggPSBwYXJzZSgnY29tcGxleHNlbnRlbmNlMScsIGdldExleGVyKCdpZiB0aGUgY2F0IGlzIHJlZCB0aGVuIHRoZSBjYXQgaXMgYmxhY2snKSlcbiAgICBjb25zb2xlLmxvZyh4KVxuXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==