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
class KoolParser {
    constructor(sourceCode, lexer = (0, Lexer_1.getLexer)(sourceCode)) {
        this.sourceCode = sourceCode;
        this.lexer = lexer;
        this.topParse = (name, number) => {
            const members = getBlueprint(name);
            if (members.length === 1 && members[0].type.every(t => this.isAtom(t))) {
                return this.parseAtom(members[0], number);
            }
            else {
                return this.parseComposite(name, number);
            }
        };
        this.parseAtom = (m, number) => {
            const atoms = [];
            while (!this.lexer.isEnd && m.type.includes(this.lexer.peek.type)) {
                if (number !== '*' && atoms.length >= 1) {
                    break;
                }
                const x = this.lexer.peek;
                this.lexer.next();
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
        };
        this.isNecessary = (m) => {
            return m.number === 1;
        };
        this.isAtom = (name) => {
            const lexemeTypes = ['adj', 'contraction', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'iverb', 'mverb', 'negation', 'nonsubconj', 'existquant', 'uniquant', 'then', 'relpron', 'negation', 'noun', 'preposition', 'subconj'];
            return lexemeTypes.includes(name);
        };
        this.parseComposite = (name, number) => {
            const links = [];
            for (const m of getBlueprint(name)) {
                const ast = this.parseMember(m);
                if (!ast && this.isNecessary(m)) {
                    return undefined;
                }
                links.push(ast);
            }
            return {
                type: name,
                links: links
            };
        };
        this.parseMember = (m) => {
            let x;
            for (const t of m.type) {
                x = this.topParse(t, m.number);
                if (x) {
                    break;
                }
            }
            return x;
        };
    }
    try(method, ...args) {
        const memento = this.lexer.pos;
        const x = method(args);
        if (!x) {
            this.lexer.backTo(memento);
        }
        return x;
    }
    parseAll() {
        const results = [];
        while (!this.lexer.isEnd) {
            results.push(this.parse());
            this.lexer.assert('fullstop', { errorOut: false });
        }
        return results;
    }
    parse() {
        var _a, _b, _c, _d, _e;
        return (_e = (_d = (_c = (_b = (_a = this.try(this.topParse, 'complexsentence1')) !== null && _a !== void 0 ? _a : this.try(this.topParse, 'complexsentence2')) !== null && _b !== void 0 ? _b : this.try(this.topParse, 'copulasentence')) !== null && _c !== void 0 ? _c : this.try(this.topParse, 'iverbsentence')) !== null && _d !== void 0 ? _d : this.try(this.topParse, 'mverbsentence')) !== null && _e !== void 0 ? _e : this.try(this.topParse, 'nounphrase');
    }
}
//////////////////////////////////////
function testNewXParser() {
    const x = new KoolParser('the cat that is black is red. cat is red if cat is green').parseAll();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDO0lBQ2hELENBQUM7Q0E0Rko7QUFLRCxzQ0FBc0M7QUFFdEMsU0FBd0IsY0FBYztJQUdsQyxNQUFNLENBQUMsR0FBRyxJQUFJLFVBQVUsQ0FBQywwREFBMEQsQ0FBQyxDQUFDLFFBQVEsRUFBRTtJQUMvRiw4RUFBOEU7SUFDOUUsMkZBQTJGO0lBQzNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBRWxCLENBQUM7QUFSRCxvQ0FRQzs7Ozs7OztVQzVQRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL0VhZ2VyTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9MZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9sZXhlci9MZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy90ZXN0cy94bm91bnBocmFzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYWluIGZyb20gXCIuL21haW4vbWFpblwiO1xuaW1wb3J0IGF1dG90ZXN0ZXIgZnJvbSBcIi4vdGVzdHMvYXV0b3Rlc3RlclwiO1xuaW1wb3J0IHsgdG9jbGF1c2V0ZXN0cyB9IGZyb20gXCIuL3Rlc3RzL3RvY2xhdXNldGVzdHNcIjtcbmltcG9ydCB0ZXN0TmV3WFBhcnNlciBmcm9tIFwiLi90ZXN0cy94bm91bnBocmFzZVwiO1xuLy8gaW1wb3J0IHhwYXJzZXJ0ZXN0IGZyb20gXCIuL3Rlc3RzL3hwYXJzZXJ0ZXN0XCI7XG4vLyBhd2FpdCB0b2NsYXVzZXRlc3RzKClcblxuLy8gKGFzeW5jICgpPT57XG4vLyAgICAgYXdhaXQgYXV0b3Rlc3RlcigpXG4vLyB9KSgpXG5cbnRlc3ROZXdYUGFyc2VyKClcblxuLy8gbWFpbigpXG5cbiIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgZ2V0TGV4ZW1lcywgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCI7XG5pbXBvcnQgTGV4ZXIsIHsgQXNzZXJ0QXJncyB9IGZyb20gXCIuL0xleGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlciB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOiBMZXhlbWU8TGV4ZW1lVHlwZT5bXVxuICAgIHByb3RlY3RlZCBfcG9zOiBudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZykge1xuXG4gICAgICAgIHRoaXMudG9rZW5zID0gc291cmNlQ29kZVxuICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgLnNwbGl0KC9cXHMrfFxcLi8pXG4gICAgICAgICAgICAubWFwKHMgPT4gIXMgPyAnLicgOiBzKVxuICAgICAgICAgICAgLmZsYXRNYXAocyA9PiBnZXRMZXhlbWVzKHMpKVxuXG4gICAgICAgIHRoaXMuX3BvcyA9IDBcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBMZXhlbWU8TGV4ZW1lVHlwZT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gY3VycmVudCB0b2tlbiBpZmYgb2YgZ2l2ZW4gdHlwZSBhbmQgbW92ZSB0byBuZXh0OyBcbiAgICAgKiBlbHNlIHJldHVybiB1bmRlZmluZWQgYW5kIGRvbid0IG1vdmUuXG4gICAgICogQHBhcmFtIGFyZ3MgXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgYXNzZXJ0PFQgZXh0ZW5kcyBMZXhlbWVUeXBlPih0eXBlOiBULCBhcmdzOiBBc3NlcnRBcmdzKTogTGV4ZW1lPFQ+IHwgdW5kZWZpbmVkIHtcblxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5wZWVrXG5cbiAgICAgICAgaWYgKGN1cnJlbnQgJiYgY3VycmVudC50eXBlID09PSB0eXBlKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQgYXMgTGV4ZW1lPFQ+XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5lcnJvck91dCA/PyB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmNyb2FrKGFyZ3MuZXJyb3JNc2cgPz8gJycpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMudG9rZW5zLmxlbmd0aFxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4vbGV4ZW1lc1wiXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV4ZW1lPFQgZXh0ZW5kcyBMZXhlbWVUeXBlPiB7XG4gICAgLyoqY2Fub25pY2FsIGZvcm0qLyByZWFkb25seSByb290OiBzdHJpbmdcbiAgICAvKip0b2tlbiB0eXBlKi8gcmVhZG9ubHkgdHlwZTogVFxuICAgIC8qKnVzZWZ1bCBmb3IgaXJyZWd1bGFyIHN0dWZmKi8gcmVhZG9ubHkgZm9ybXM/OiBzdHJpbmdbXVxuICAgIC8qKnJlZmVycyB0byB2ZXJiIGNvbmp1Z2F0aW9ucyBvciBwbHVyYWwgZm9ybXMqLyByZWFkb25seSByZWd1bGFyPzogYm9vbGVhblxuICAgIC8qKnNlbWFudGljYWwgZGVwZW5kZWNlKi8gcmVhZG9ubHkgZGVyaXZlZEZyb20/OiBzdHJpbmdcbiAgICAvKipzZW1hbnRpY2FsIGVxdWl2YWxlbmNlKi8gcmVhZG9ubHkgYWxpYXNGb3I/OiBzdHJpbmdcbiAgICAvKiptYWRlIHVwIG9mIG1vcmUgbGV4ZW1lcyovIHJlYWRvbmx5IGNvbnRyYWN0aW9uRm9yPzogc3RyaW5nW11cbiAgICAvKipmb3JtIG9mIHRoaXMgaW5zdGFuY2UqL3JlYWRvbmx5IHRva2VuPzogc3RyaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3Jtc09mKGxleGVtZTogTGV4ZW1lPExleGVtZVR5cGU+KSB7XG5cbiAgICByZXR1cm4gW2xleGVtZS5yb290XS5jb25jYXQobGV4ZW1lPy5mb3JtcyA/PyBbXSlcbiAgICAgICAgLmNvbmNhdChsZXhlbWUucmVndWxhciA/IFtgJHtsZXhlbWUucm9vdH1zYF0gOiBbXSlcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZW1lcyh3b3JkOiBzdHJpbmcpOiBMZXhlbWU8TGV4ZW1lVHlwZT5bXSB7XG5cbiAgICBjb25zdCBsZXhlbWU6IExleGVtZTxMZXhlbWVUeXBlPiA9XG4gICAgICAgIGxleGVtZXMuZmlsdGVyKHggPT4gZm9ybXNPZih4KS5pbmNsdWRlcyh3b3JkKSkuYXQoMClcbiAgICAgICAgPz8geyByb290OiB3b3JkLCB0eXBlOiAnYWRqJyB9XG5cbiAgICBjb25zdCBsZXhlbWUyOiBMZXhlbWU8TGV4ZW1lVHlwZT4gPSB7IC4uLmxleGVtZSwgdG9rZW46IHdvcmQgfVxuXG4gICAgcmV0dXJuIGxleGVtZTIuY29udHJhY3Rpb25Gb3IgP1xuICAgICAgICBsZXhlbWUyLmNvbnRyYWN0aW9uRm9yLmZsYXRNYXAoeCA9PiBnZXRMZXhlbWVzKHgpKSA6XG4gICAgICAgIFtsZXhlbWUyXVxuXG59XG4iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0xleGVtZVR5cGVcIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXIge1xuICAgIGdldCBwZWVrKCk6IExleGVtZTxMZXhlbWVUeXBlPlxuICAgIGdldCBwb3MoKTogbnVtYmVyXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW5cbiAgICBuZXh0KCk6IHZvaWRcbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWRcbiAgICBhc3NlcnQ8VCBleHRlbmRzIExleGVtZVR5cGU+KHR5cGU6IFQsIGFyZ3M6IEFzc2VydEFyZ3MpOiBMZXhlbWU8VD4gfCB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3NlcnRBcmdzIHtcbiAgICBlcnJvck1zZz86IHN0cmluZ1xuICAgIGVycm9yT3V0PzogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZXIoc291cmNlQ29kZTogc3RyaW5nKTogTGV4ZXIge1xuICAgIHJldHVybiBuZXcgRWFnZXJMZXhlcihzb3VyY2VDb2RlKVxufVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IG5ldyAoLi4uYXJnczogYW55W10pID0+IFRcbiIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCI7XG5cblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IExleGVtZTxMZXhlbWVUeXBlPltdID0gW1xuICAgIHtcbiAgICAgICAgcm9vdDogJ2hhdmUnLFxuICAgICAgICB0eXBlOiAnbXZlcmInLFxuICAgICAgICBmb3JtczogWydoYXZlJywgJ2hhcyddLFxuICAgICAgICByZWd1bGFyOiBmYWxzZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdidXR0b24nLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHJlZ3VsYXI6IHRydWVcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnY2xpY2snLFxuICAgICAgICB0eXBlOiAnbXZlcmInLFxuICAgICAgICBmb3JtczogWydjbGljayddLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NsaWNrZWQnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgZGVyaXZlZEZyb206ICdjbGljaydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAncHJlc3NlZCcsXG4gICAgICAgIHR5cGU6ICdhZGonLFxuICAgICAgICBhbGlhc0ZvcjogJ2NsaWNrZWQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NhdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdiZScsXG4gICAgICAgIHR5cGU6ICdjb3B1bGEnLFxuICAgICAgICBmb3JtczogWydpcycsICdhcmUnXSxcbiAgICAgICAgcmVndWxhcjogZmFsc2VcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImlzbid0XCIsXG4gICAgICAgIHR5cGU6ICdjb250cmFjdGlvbicsXG4gICAgICAgIGNvbnRyYWN0aW9uRm9yOiBbJ2lzJywgJ25vdCddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJyZWRcIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwiZ3JlZW5cIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwiZXhpc3RcIixcbiAgICAgICAgdHlwZTogXCJpdmVyYlwiLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2RvJyxcbiAgICAgICAgdHlwZTogJ2h2ZXJiJyxcbiAgICAgICAgcmVndWxhcjogZmFsc2UsXG4gICAgICAgIGZvcm1zOiBbJ2RvJywgJ2RvZXMnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdzb21lJyxcbiAgICAgICAgdHlwZTogJ2V4aXN0cXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2V2ZXJ5JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbGwnLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FueScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndG8nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3dpdGgnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2Zyb20nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ29mJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvdmVyJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvbicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYXQnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoZW4nLFxuICAgICAgICB0eXBlOiAndGhlbicgLy8gZmlsbGVyIHdvcmRcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnaWYnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnd2hlbicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdiZWNhdXNlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3doaWxlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RoYXQnLFxuICAgICAgICB0eXBlOiAncmVscHJvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnbm90JyxcbiAgICAgICAgdHlwZTogJ25lZ2F0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGUnLFxuICAgICAgICB0eXBlOiAnZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbicsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYW5kJyxcbiAgICAgICAgdHlwZTogJ25vbnN1YmNvbmonXG4gICAgfVxuXSIsImltcG9ydCBMZXhlciwgeyBnZXRMZXhlciB9IGZyb20gXCIuLi9sZXhlci9MZXhlclwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG5cbnR5cGUgQXN0VHlwZSA9IExleGVtZVR5cGUgfCBDb25zdGl0dWVudFR5cGVcblxudHlwZSBDb25zdGl0dWVudFR5cGUgPSAnbm91bnBocmFzZSdcbiAgICB8ICdjb21wbGVtZW50J1xuICAgIHwgJ2NvcHVsYXN1YmNsYXVzZSdcbiAgICB8ICdjb21wbGV4c2VudGVuY2UxJ1xuICAgIHwgJ2NvbXBsZXhzZW50ZW5jZTInXG4gICAgfCAnY29wdWxhc2VudGVuY2UnXG4gICAgfCAnaXZlcmJzZW50ZW5jZSdcbiAgICB8ICdtdmVyYnNlbnRlbmNlJ1xuLy8gfCAnaXZlcmJzdWJjbGF1c2UnXG4vLyB8ICdtdmVyYnN1YmNsYXVzZTEnXG4vLyB8ICdtdmVyYnN1YmNsYXVzZTInXG4vLyB8ICdjb25qc2VudGVjZSdcbi8vIHwgJ2NvcHVsYXF1ZXN0aW9uJ1xuXG50eXBlIENhcmRpbmFsaXR5ID0gJyonIC8vIHplcm8gb3IgbW9yZVxuICAgIHwgJzF8MCcgLy8gb25lIG9yIHplcm9cbiAgICB8IG51bWJlclxuXG50eXBlIFJvbGUgPSAnc3ViamVjdCdcbiAgICB8ICdvYmplY3QnXG4gICAgfCAncHJlZGljYXRlJ1xuICAgIHwgJ2NvbmRpdGlvbidcbiAgICB8ICdjb25zZXF1ZW5jZSdcblxudHlwZSBNZW1iZXIgPSB7XG4gICAgdHlwZTogQXN0VHlwZVtdXG4gICAgbnVtYmVyPzogQ2FyZGluYWxpdHlcbiAgICByb2xlPzogUm9sZVxufVxuXG5jb25zdCBibHVlcHJpbnRzOiB7IFtuYW1lIGluIENvbnN0aXR1ZW50VHlwZV06IE1lbWJlcltdIH0gPSB7XG5cbiAgICAnbm91bnBocmFzZSc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ3VuaXF1YW50JywgJ2V4aXN0cXVhbnQnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGU6IFsnaW5kZWZhcnQnLCAnZGVmYXJ0J10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2FkaiddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IHR5cGU6IFsnbm91biddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGFzdWJjbGF1c2UnLCAvKidpdmVyYnN1YmNsYXVzZScsICdtdmVyYnN1YmNsYXVzZTEnLCAnbXZlcmJzdWJjbGF1c2UyJyovXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvbXBsZW1lbnQnXSwgbnVtYmVyOiAnKicgfSxcbiAgICBdLFxuICAgICdjb21wbGVtZW50JzogW1xuICAgICAgICB7IHR5cGU6IFsncHJlcG9zaXRpb24nXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydub3VucGhyYXNlJ10sIG51bWJlcjogMSB9XG4gICAgXSxcbiAgICAnY29wdWxhc3ViY2xhdXNlJzogW1xuICAgICAgICB7IHR5cGU6IFsncmVscHJvbiddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxIH1cbiAgICBdLFxuICAgICdjb3B1bGFzZW50ZW5jZSc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25lZ2F0aW9uJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAncHJlZGljYXRlJyB9XG4gICAgXSxcbiAgICAnaXZlcmJzZW50ZW5jZSc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25lZ2F0aW9uJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2l2ZXJiJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnY29tcGxlbWVudCddLCBudW1iZXI6ICcqJyB9XG4gICAgXSxcbiAgICAnY29tcGxleHNlbnRlbmNlMSc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ3N1YmNvbmonXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGFzZW50ZW5jZScsICdtdmVyYnNlbnRlbmNlJywgJ2l2ZXJic2VudGVuY2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgICAgICB7IHR5cGU6IFsndGhlbiddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGFzZW50ZW5jZScsICdtdmVyYnNlbnRlbmNlJywgJ2l2ZXJic2VudGVuY2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnY29uc2VxdWVuY2UnIH1cbiAgICBdLFxuICAgICdjb21wbGV4c2VudGVuY2UyJzogW1xuICAgICAgICB7IHR5cGU6IFsnY29wdWxhc2VudGVuY2UnLCAnbXZlcmJzZW50ZW5jZScsICdpdmVyYnNlbnRlbmNlJ10sIG51bWJlcjogMSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9LFxuICAgICAgICB7IHR5cGU6IFsnc3ViY29uaiddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYXNlbnRlbmNlJywgJ212ZXJic2VudGVuY2UnLCAnaXZlcmJzZW50ZW5jZSddLCBudW1iZXI6IDEsIHJvbGU6ICdjb25kaXRpb24nIH1cbiAgICBdLFxuICAgICdtdmVyYnNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGU6IFsnbm91bnBocmFzZSddLCBudW1iZXI6IDEsIHJvbGU6ICdzdWJqZWN0JyB9LFxuICAgICAgICB7IHR5cGU6IFsnbmVnYXRpb24nXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGU6IFsnbXZlcmInXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWydub3VucGhyYXNlJ10sIG51bWJlcjogMSwgcm9sZTogJ29iamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvbXBsZW1lbnQnXSwgbnVtYmVyOiAnKicgfSxcbiAgICBdXG5cbn1cblxuaW50ZXJmYWNlIEFzdE5vZGU8VCBleHRlbmRzIEFzdFR5cGU+IHtcbiAgICB0eXBlOiBUXG4gICAgbmFtZT86IHN0cmluZ1xufVxuXG5pbnRlcmZhY2UgQXRvbU5vZGUgZXh0ZW5kcyBBc3ROb2RlPExleGVtZVR5cGU+IHtcbiAgICBsZXhlbWU6IExleGVtZTxMZXhlbWVUeXBlPlxufVxuXG5pbnRlcmZhY2UgQ29tcG9zaXRlTm9kZSBleHRlbmRzIEFzdE5vZGU8Q29uc3RpdHVlbnRUeXBlPiB7XG4gICAgbGlua3M6IChBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkKVtdXG59XG5cbmZ1bmN0aW9uIGdldEJsdWVwcmludChuYW1lOiBBc3RUeXBlKTogTWVtYmVyW10ge1xuICAgIHJldHVybiBibHVlcHJpbnRzW25hbWUgYXMgQ29uc3RpdHVlbnRUeXBlXSA/PyBbeyB0eXBlOiBbbmFtZV0sIG51bWJlcjogMSB9XSAvLyBUT0RPOiBwcm9ibGVtLCBhZGogaXMgbm90IGFsd2F5cyAxICEhISEhIVxufVxuXG5cbmNsYXNzIEtvb2xQYXJzZXIge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUpKSB7XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdHJ5KG1ldGhvZDogKGFyZ3M6IGFueSkgPT4gQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZCwgLi4uYXJnczogQXN0VHlwZVtdKSB7XG5cbiAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgIGNvbnN0IHggPSBtZXRob2QoYXJncylcblxuICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geFxuICAgIH1cblxuICAgIHBhcnNlQWxsKCkge1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdHM6IChBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkKVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnBhcnNlKCkpXG4gICAgICAgICAgICB0aGlzLmxleGVyLmFzc2VydCgnZnVsbHN0b3AnLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cbiAgICBwYXJzZSgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy50b3BQYXJzZSwgJ2NvbXBsZXhzZW50ZW5jZTEnKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy50b3BQYXJzZSwgJ2NvbXBsZXhzZW50ZW5jZTInKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy50b3BQYXJzZSwgJ2NvcHVsYXNlbnRlbmNlJylcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMudG9wUGFyc2UsICdpdmVyYnNlbnRlbmNlJylcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMudG9wUGFyc2UsICdtdmVyYnNlbnRlbmNlJylcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMudG9wUGFyc2UsICdub3VucGhyYXNlJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdG9wUGFyc2UgPSAobmFtZTogQXN0VHlwZSwgbnVtYmVyPzogQ2FyZGluYWxpdHkpOiBBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBtZW1iZXJzID0gZ2V0Qmx1ZXByaW50KG5hbWUpXG5cbiAgICAgICAgaWYgKG1lbWJlcnMubGVuZ3RoID09PSAxICYmIG1lbWJlcnNbMF0udHlwZS5ldmVyeSh0ID0+IHRoaXMuaXNBdG9tKHQpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VBdG9tKG1lbWJlcnNbMF0sIG51bWJlcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29uc3RpdHVlbnRUeXBlLCBudW1iZXIpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUF0b20gPSAobTogTWVtYmVyLCBudW1iZXI/OiBDYXJkaW5hbGl0eSk6IEF0b21Ob2RlIHwgQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgYXRvbXM6IEF0b21Ob2RlW10gPSBbXVxuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCAmJiBtLnR5cGUuaW5jbHVkZXModGhpcy5sZXhlci5wZWVrLnR5cGUpKSB7XG5cbiAgICAgICAgICAgIGlmIChudW1iZXIgIT09ICcqJyAmJiBhdG9tcy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLmxleGVyLnBlZWtcbiAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICBhdG9tcy5wdXNoKHsgdHlwZTogeC50eXBlLCBsZXhlbWU6IHggfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAoYXRvbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJldHVybiBhdG9tc1swXVxuICAgICAgICAgICAgZGVmYXVsdDpcblxuICAgICAgICAgICAgICAgIGNvbnN0IHg6IGFueSA9IHtcbiAgICAgICAgICAgICAgICAgICAgbGlua3M6IGF0b21zXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB4IGFzIEFzdE5vZGU8QXN0VHlwZT5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGlzTmVjZXNzYXJ5ID0gKG06IE1lbWJlcikgPT4ge1xuICAgICAgICByZXR1cm4gbS5udW1iZXIgPT09IDFcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaXNBdG9tID0gKG5hbWU6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgY29uc3QgbGV4ZW1lVHlwZXM6IExleGVtZVR5cGVbXSA9IFsnYWRqJywgJ2NvbnRyYWN0aW9uJywgJ2NvcHVsYScsICdkZWZhcnQnLCAnaW5kZWZhcnQnLCAnZnVsbHN0b3AnLCAnaHZlcmInLCAnaXZlcmInLCAnbXZlcmInLCAnbmVnYXRpb24nLCAnbm9uc3ViY29uaicsICdleGlzdHF1YW50JywgJ3VuaXF1YW50JywgJ3RoZW4nLCAncmVscHJvbicsICduZWdhdGlvbicsICdub3VuJywgJ3ByZXBvc2l0aW9uJywgJ3N1YmNvbmonXVxuICAgICAgICByZXR1cm4gbGV4ZW1lVHlwZXMuaW5jbHVkZXMobmFtZSBhcyBMZXhlbWVUeXBlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBvc2l0ZSA9IChuYW1lOiBDb25zdGl0dWVudFR5cGUsIG51bWJlcj86IENhcmRpbmFsaXR5KTogQ29tcG9zaXRlTm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IChBc3ROb2RlPEFzdFR5cGU+IHwgdW5kZWZpbmVkKVtdID0gW11cblxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgZ2V0Qmx1ZXByaW50KG5hbWUpKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGFzdCA9IHRoaXMucGFyc2VNZW1iZXIobSlcblxuICAgICAgICAgICAgaWYgKCFhc3QgJiYgdGhpcy5pc05lY2Vzc2FyeShtKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlua3MucHVzaChhc3QpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlcik6IEFzdE5vZGU8QXN0VHlwZT4gfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGxldCB4XG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIG0udHlwZSkge1xuXG4gICAgICAgICAgICB4ID0gdGhpcy50b3BQYXJzZSh0LCBtLm51bWJlcilcblxuICAgICAgICAgICAgaWYgKHgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geFxuICAgIH1cblxuXG59XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRlc3ROZXdYUGFyc2VyKCkge1xuXG5cbiAgICBjb25zdCB4ID0gbmV3IEtvb2xQYXJzZXIoJ3RoZSBjYXQgdGhhdCBpcyBibGFjayBpcyByZWQuIGNhdCBpcyByZWQgaWYgY2F0IGlzIGdyZWVuJykucGFyc2VBbGwoKVxuICAgIC8vIGNvbnN0IHggPSBwYXJzZSgnY29wdWxhc2VudGVuY2UnLCBnZXRMZXhlcigndGhlIGNhdCB0aGF0IGlzIGJsYWNrIGlzIHJlZCcpKVxuICAgIC8vIGNvbnN0IHggPSBwYXJzZSgnY29tcGxleHNlbnRlbmNlMScsIGdldExleGVyKCdpZiB0aGUgY2F0IGlzIHJlZCB0aGVuIHRoZSBjYXQgaXMgYmxhY2snKSlcbiAgICBjb25zb2xlLmxvZyh4KVxuXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==