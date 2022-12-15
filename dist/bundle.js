/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/res/tokens/adjectives.ts":
/*!**************************************!*\
  !*** ./app/res/tokens/adjectives.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "big",
    "small",
    "helpful",
    "red",
    "black"
];


/***/ }),

/***/ "./app/res/tokens/copulas.ts":
/*!***********************************!*\
  !*** ./app/res/tokens/copulas.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "is",
    "are",
    "be"
];


/***/ }),

/***/ "./app/res/tokens/definite_articles.ts":
/*!*********************************************!*\
  !*** ./app/res/tokens/definite_articles.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "the"
];


/***/ }),

/***/ "./app/res/tokens/existential_quantifiers.ts":
/*!***************************************************!*\
  !*** ./app/res/tokens/existential_quantifiers.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "some"
];


/***/ }),

/***/ "./app/res/tokens/hverbs.ts":
/*!**********************************!*\
  !*** ./app/res/tokens/hverbs.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "do",
    "does"
];


/***/ }),

/***/ "./app/res/tokens/indefinite_articles.ts":
/*!***********************************************!*\
  !*** ./app/res/tokens/indefinite_articles.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "a",
    "an"
];


/***/ }),

/***/ "./app/res/tokens/iverbs.ts":
/*!**********************************!*\
  !*** ./app/res/tokens/iverbs.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "exist",
    "run",
    "grow",
    "die",
    "live"
];


/***/ }),

/***/ "./app/res/tokens/mverbs.ts":
/*!**********************************!*\
  !*** ./app/res/tokens/mverbs.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "eat",
    "drink",
    "watch",
    "make",
    "hit",
    "click"
];


/***/ }),

/***/ "./app/res/tokens/negations.ts":
/*!*************************************!*\
  !*** ./app/res/tokens/negations.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "doesn't",
    "does not",
    'not',
    "don't",
    'do not'
];


/***/ }),

/***/ "./app/res/tokens/nonsubconj.ts":
/*!**************************************!*\
  !*** ./app/res/tokens/nonsubconj.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "and",
    "or"
];


/***/ }),

/***/ "./app/res/tokens/nouns.ts":
/*!*********************************!*\
  !*** ./app/res/tokens/nouns.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "cat",
    "mat",
    "table",
    "dog",
    "nodejs",
    "color",
    "button",
    "div"
];


/***/ }),

/***/ "./app/res/tokens/prepositions.ts":
/*!****************************************!*\
  !*** ./app/res/tokens/prepositions.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "to",
    "with",
    "from",
    "of",
    "over",
    "on",
    "at"
];


/***/ }),

/***/ "./app/res/tokens/relprons.ts":
/*!************************************!*\
  !*** ./app/res/tokens/relprons.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "that"
];


/***/ }),

/***/ "./app/res/tokens/subconj.ts":
/*!***********************************!*\
  !*** ./app/res/tokens/subconj.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "if",
    "when",
    "because",
    "while"
];


/***/ }),

/***/ "./app/res/tokens/then.ts":
/*!********************************!*\
  !*** ./app/res/tokens/then.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "then"
];


/***/ }),

/***/ "./app/res/tokens/universal_quantifiers.ts":
/*!*************************************************!*\
  !*** ./app/res/tokens/universal_quantifiers.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = [
    "every",
    "all",
    "each"
];


/***/ }),

/***/ "./app/src/ast/phrases/Complement.ts":
/*!*******************************************!*\
  !*** ./app/src/ast/phrases/Complement.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class Complement {
    constructor(preposition, nounPhrase) {
        this.preposition = preposition;
        this.nounPhrase = nounPhrase;
    }
}
exports["default"] = Complement;


/***/ }),

/***/ "./app/src/ast/phrases/CopulaSubordinateClause.ts":
/*!********************************************************!*\
  !*** ./app/src/ast/phrases/CopulaSubordinateClause.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class CopulaSubordinateClause {
    constructor(relpron, predicate, copula) {
        this.relpron = relpron;
        this.predicate = predicate;
        this.copula = copula;
    }
}
exports["default"] = CopulaSubordinateClause;


/***/ }),

/***/ "./app/src/ast/phrases/NounPhrase.ts":
/*!*******************************************!*\
  !*** ./app/src/ast/phrases/NounPhrase.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class NounPhrase {
    constructor(adjectives, complements, noun, quantifier, article, subordClause) {
        this.adjectives = adjectives;
        this.complements = complements;
        this.noun = noun;
        this.quantifier = quantifier;
        this.article = article;
        this.subordClause = subordClause;
    }
}
exports["default"] = NounPhrase;


/***/ }),

/***/ "./app/src/ast/sentences/ComplexSentence.ts":
/*!**************************************************!*\
  !*** ./app/src/ast/sentences/ComplexSentence.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ComplexSentence {
    constructor(condition, outcome, subconj) {
        this.condition = condition;
        this.outcome = outcome;
        this.subconj = subconj;
    }
}
exports["default"] = ComplexSentence;


/***/ }),

/***/ "./app/src/ast/sentences/CopulaQuestion.ts":
/*!*************************************************!*\
  !*** ./app/src/ast/sentences/CopulaQuestion.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class CopulaQuestion {
    constructor(subject, predicate, copula) {
        this.subject = subject;
        this.predicate = predicate;
        this.copula = copula;
    }
}
exports["default"] = CopulaQuestion;


/***/ }),

/***/ "./app/src/ast/sentences/CopulaSentence.ts":
/*!*************************************************!*\
  !*** ./app/src/ast/sentences/CopulaSentence.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class CopulaSentence {
    constructor(subject, copula, predicate, negation) {
        this.subject = subject;
        this.copula = copula;
        this.predicate = predicate;
        this.negation = negation;
    }
}
exports["default"] = CopulaSentence;


/***/ }),

/***/ "./app/src/ast/sentences/IntransitiveSentence.ts":
/*!*******************************************************!*\
  !*** ./app/src/ast/sentences/IntransitiveSentence.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class IntransitiveSentence {
    constructor(subject, iverb, complements, negation) {
        this.subject = subject;
        this.iverb = iverb;
        this.complements = complements;
        this.negation = negation;
    }
}
exports["default"] = IntransitiveSentence;


/***/ }),

/***/ "./app/src/ast/sentences/MonotransitiveSentence.ts":
/*!*********************************************************!*\
  !*** ./app/src/ast/sentences/MonotransitiveSentence.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class MonotransitiveSentence {
    constructor(subject, mverb, object, complements, negation) {
        this.subject = subject;
        this.mverb = mverb;
        this.object = object;
        this.complements = complements;
        this.negation = negation;
    }
}
exports["default"] = MonotransitiveSentence;


/***/ }),

/***/ "./app/src/ast/tokens/AbstractToken.ts":
/*!*********************************************!*\
  !*** ./app/src/ast/tokens/AbstractToken.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class AbstractToken {
    constructor(string) {
        this.string = string;
    }
}
exports["default"] = AbstractToken;


/***/ }),

/***/ "./app/src/ast/tokens/Adjective.ts":
/*!*****************************************!*\
  !*** ./app/src/ast/tokens/Adjective.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class Adjective extends AbstractToken_1.default {
}
exports["default"] = Adjective;


/***/ }),

/***/ "./app/src/ast/tokens/Article.ts":
/*!***************************************!*\
  !*** ./app/src/ast/tokens/Article.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const definite_articles_1 = __importDefault(__webpack_require__(/*! ../../../res/tokens/definite_articles */ "./app/res/tokens/definite_articles.ts"));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class Article extends AbstractToken_1.default {
    isDefinite() {
        return definite_articles_1.default.includes(this.string);
    }
    toString() {
        return `Article(${this.string}, isDefinite=${this.isDefinite()})`;
    }
}
exports["default"] = Article;


/***/ }),

/***/ "./app/src/ast/tokens/Copula.ts":
/*!**************************************!*\
  !*** ./app/src/ast/tokens/Copula.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class Copula extends AbstractToken_1.default {
}
exports["default"] = Copula;


/***/ }),

/***/ "./app/src/ast/tokens/FullStop.ts":
/*!****************************************!*\
  !*** ./app/src/ast/tokens/FullStop.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class FullStop extends AbstractToken_1.default {
}
exports["default"] = FullStop;


/***/ }),

/***/ "./app/src/ast/tokens/HVerb.ts":
/*!*************************************!*\
  !*** ./app/src/ast/tokens/HVerb.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class HVerb extends AbstractToken_1.default {
}
exports["default"] = HVerb;


/***/ }),

/***/ "./app/src/ast/tokens/IVerb.ts":
/*!*************************************!*\
  !*** ./app/src/ast/tokens/IVerb.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class IVerb extends AbstractToken_1.default {
}
exports["default"] = IVerb;


/***/ }),

/***/ "./app/src/ast/tokens/MVerb.ts":
/*!*************************************!*\
  !*** ./app/src/ast/tokens/MVerb.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class MVerb extends AbstractToken_1.default {
}
exports["default"] = MVerb;


/***/ }),

/***/ "./app/src/ast/tokens/Negation.ts":
/*!****************************************!*\
  !*** ./app/src/ast/tokens/Negation.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class Negation extends AbstractToken_1.default {
}
exports["default"] = Negation;


/***/ }),

/***/ "./app/src/ast/tokens/NonSubordinatingConjunction.ts":
/*!***********************************************************!*\
  !*** ./app/src/ast/tokens/NonSubordinatingConjunction.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class NonSubordinatingConjunction extends AbstractToken_1.default {
}
exports["default"] = NonSubordinatingConjunction;


/***/ }),

/***/ "./app/src/ast/tokens/Noun.ts":
/*!************************************!*\
  !*** ./app/src/ast/tokens/Noun.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class Noun extends AbstractToken_1.default {
}
exports["default"] = Noun;


/***/ }),

/***/ "./app/src/ast/tokens/Preposition.ts":
/*!*******************************************!*\
  !*** ./app/src/ast/tokens/Preposition.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class Preposition extends AbstractToken_1.default {
}
exports["default"] = Preposition;


/***/ }),

/***/ "./app/src/ast/tokens/Quantifier.ts":
/*!******************************************!*\
  !*** ./app/src/ast/tokens/Quantifier.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const existential_quantifiers_1 = __importDefault(__webpack_require__(/*! ../../../res/tokens/existential_quantifiers */ "./app/res/tokens/existential_quantifiers.ts"));
const universal_quantifiers_1 = __importDefault(__webpack_require__(/*! ../../../res/tokens/universal_quantifiers */ "./app/res/tokens/universal_quantifiers.ts"));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class Quantifier extends AbstractToken_1.default {
    isUniversal() {
        return universal_quantifiers_1.default.includes(this.string);
    }
    isExistential() {
        return existential_quantifiers_1.default.includes(this.string);
    }
}
exports["default"] = Quantifier;


/***/ }),

/***/ "./app/src/ast/tokens/RelativePronoun.ts":
/*!***********************************************!*\
  !*** ./app/src/ast/tokens/RelativePronoun.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class RelativePronoun extends AbstractToken_1.default {
}
exports["default"] = RelativePronoun;


/***/ }),

/***/ "./app/src/ast/tokens/SubordinatingConjunction.ts":
/*!********************************************************!*\
  !*** ./app/src/ast/tokens/SubordinatingConjunction.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class SubordinatingConjunction extends AbstractToken_1.default {
}
exports["default"] = SubordinatingConjunction;


/***/ }),

/***/ "./app/src/ast/tokens/Then.ts":
/*!************************************!*\
  !*** ./app/src/ast/tokens/Then.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class Then extends AbstractToken_1.default {
}
exports["default"] = Then;


/***/ }),

/***/ "./app/src/lexer/EagerLexer.ts":
/*!*************************************!*\
  !*** ./app/src/lexer/EagerLexer.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tokenOf_1 = __importDefault(__webpack_require__(/*! ./tokenOf */ "./app/src/lexer/tokenOf.ts"));
class EagerLexer {
    constructor(sourceCode) {
        this.sourceCode = sourceCode;
        //TODO: reconstruct "do not" and "does not" tokens
        //TODO: nouns vs adjectives
        this.tokens = sourceCode.split(/\s+|\./).map(e => !e ? '.' : e).map(tokenOf_1.default);
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
    assert(clazz, args) {
        var _a, _b;
        const current = this.peek;
        if (current instanceof clazz) {
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
}
exports["default"] = EagerLexer;


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

/***/ "./app/src/lexer/tokenOf.ts":
/*!**********************************!*\
  !*** ./app/src/lexer/tokenOf.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const adjectives_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/adjectives */ "./app/res/tokens/adjectives.ts"));
const indefinite_articles_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/indefinite_articles */ "./app/res/tokens/indefinite_articles.ts"));
const definite_articles_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/definite_articles */ "./app/res/tokens/definite_articles.ts"));
const copulas_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/copulas */ "./app/res/tokens/copulas.ts"));
const hverbs_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/hverbs */ "./app/res/tokens/hverbs.ts"));
const iverbs_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/iverbs */ "./app/res/tokens/iverbs.ts"));
const mverbs_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/mverbs */ "./app/res/tokens/mverbs.ts"));
const negations_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/negations */ "./app/res/tokens/negations.ts"));
const nonsubconj_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/nonsubconj */ "./app/res/tokens/nonsubconj.ts"));
const nouns_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/nouns */ "./app/res/tokens/nouns.ts"));
const prepositions_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/prepositions */ "./app/res/tokens/prepositions.ts"));
const existential_quantifiers_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/existential_quantifiers */ "./app/res/tokens/existential_quantifiers.ts"));
const universal_quantifiers_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/universal_quantifiers */ "./app/res/tokens/universal_quantifiers.ts"));
const relprons_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/relprons */ "./app/res/tokens/relprons.ts"));
const subconj_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/subconj */ "./app/res/tokens/subconj.ts"));
const then_1 = __importDefault(__webpack_require__(/*! ../../res/tokens/then */ "./app/res/tokens/then.ts"));
const Article_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Article */ "./app/src/ast/tokens/Article.ts"));
const Copula_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Copula */ "./app/src/ast/tokens/Copula.ts"));
const HVerb_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/HVerb */ "./app/src/ast/tokens/HVerb.ts"));
const IVerb_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/IVerb */ "./app/src/ast/tokens/IVerb.ts"));
const MVerb_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/MVerb */ "./app/src/ast/tokens/MVerb.ts"));
const Negation_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Negation */ "./app/src/ast/tokens/Negation.ts"));
const NonSubordinatingConjunction_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/NonSubordinatingConjunction */ "./app/src/ast/tokens/NonSubordinatingConjunction.ts"));
const Preposition_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Preposition */ "./app/src/ast/tokens/Preposition.ts"));
const Quantifier_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Quantifier */ "./app/src/ast/tokens/Quantifier.ts"));
const Then_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Then */ "./app/src/ast/tokens/Then.ts"));
const RelativePronoun_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/RelativePronoun */ "./app/src/ast/tokens/RelativePronoun.ts"));
const SubordinatingConjunction_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/SubordinatingConjunction */ "./app/src/ast/tokens/SubordinatingConjunction.ts"));
const Noun_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Noun */ "./app/src/ast/tokens/Noun.ts"));
const Adjective_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Adjective */ "./app/src/ast/tokens/Adjective.ts"));
const FullStop_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/FullStop */ "./app/src/ast/tokens/FullStop.ts"));
function tokenOf(string) {
    if (indefinite_articles_1.default.concat(definite_articles_1.default).includes(string)) {
        return new Article_1.default(string);
    }
    else if (copulas_1.default.includes(string)) {
        return new Copula_1.default(string);
    }
    else if (hverbs_1.default.includes(string)) {
        return new HVerb_1.default(string);
    }
    else if (iverbs_1.default.includes(string)) {
        return new IVerb_1.default(string);
    }
    else if (mverbs_1.default.includes(string)) {
        return new MVerb_1.default(string);
    }
    else if (negations_1.default.includes(string)) {
        return new Negation_1.default(string);
    }
    else if (nonsubconj_1.default.includes(string)) {
        return new NonSubordinatingConjunction_1.default(string);
    }
    else if (prepositions_1.default.includes(string)) {
        return new Preposition_1.default(string);
    }
    else if (existential_quantifiers_1.default.concat(universal_quantifiers_1.default).includes(string)) {
        return new Quantifier_1.default(string);
    }
    else if (then_1.default.includes(string)) {
        return new Then_1.default(string);
    }
    else if (relprons_1.default.includes(string)) {
        return new RelativePronoun_1.default(string);
    }
    else if (subconj_1.default.includes(string)) {
        return new SubordinatingConjunction_1.default(string);
    }
    else if (nouns_1.default.includes(string)) {
        return new Noun_1.default(string);
    }
    else if (adjectives_1.default.includes(string)) {
        return new Adjective_1.default(string);
    }
    else if ('.' === string) {
        return new FullStop_1.default('.');
    }
    return new Adjective_1.default(string);
}
exports["default"] = tokenOf;


/***/ }),

/***/ "./app/src/parser/BasicParser.ts":
/*!***************************************!*\
  !*** ./app/src/parser/BasicParser.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Complement_1 = __importDefault(__webpack_require__(/*! ../ast/phrases/Complement */ "./app/src/ast/phrases/Complement.ts"));
const NounPhrase_1 = __importDefault(__webpack_require__(/*! ../ast/phrases/NounPhrase */ "./app/src/ast/phrases/NounPhrase.ts"));
const ComplexSentence_1 = __importDefault(__webpack_require__(/*! ../ast/sentences/ComplexSentence */ "./app/src/ast/sentences/ComplexSentence.ts"));
const CopulaQuestion_1 = __importDefault(__webpack_require__(/*! ../ast/sentences/CopulaQuestion */ "./app/src/ast/sentences/CopulaQuestion.ts"));
const CopulaSentence_1 = __importDefault(__webpack_require__(/*! ../ast/sentences/CopulaSentence */ "./app/src/ast/sentences/CopulaSentence.ts"));
const IntransitiveSentence_1 = __importDefault(__webpack_require__(/*! ../ast/sentences/IntransitiveSentence */ "./app/src/ast/sentences/IntransitiveSentence.ts"));
const MonotransitiveSentence_1 = __importDefault(__webpack_require__(/*! ../ast/sentences/MonotransitiveSentence */ "./app/src/ast/sentences/MonotransitiveSentence.ts"));
const Adjective_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Adjective */ "./app/src/ast/tokens/Adjective.ts"));
const Article_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Article */ "./app/src/ast/tokens/Article.ts"));
const Copula_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Copula */ "./app/src/ast/tokens/Copula.ts"));
const IVerb_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/IVerb */ "./app/src/ast/tokens/IVerb.ts"));
const MVerb_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/MVerb */ "./app/src/ast/tokens/MVerb.ts"));
const Negation_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Negation */ "./app/src/ast/tokens/Negation.ts"));
const Noun_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Noun */ "./app/src/ast/tokens/Noun.ts"));
const Preposition_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Preposition */ "./app/src/ast/tokens/Preposition.ts"));
const Quantifier_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Quantifier */ "./app/src/ast/tokens/Quantifier.ts"));
const SubordinatingConjunction_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/SubordinatingConjunction */ "./app/src/ast/tokens/SubordinatingConjunction.ts"));
const Then_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/Then */ "./app/src/ast/tokens/Then.ts"));
const Lexer_1 = __webpack_require__(/*! ../lexer/Lexer */ "./app/src/lexer/Lexer.ts");
const CopulaSubordinateClause_1 = __importDefault(__webpack_require__(/*! ../ast/phrases/CopulaSubordinateClause */ "./app/src/ast/phrases/CopulaSubordinateClause.ts"));
const RelativePronoun_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/RelativePronoun */ "./app/src/ast/tokens/RelativePronoun.ts"));
class BasicParser {
    constructor(sourceCode) {
        this.parseDeclaration = () => {
            var _a, _b;
            return (_b = (_a = this.try(this.parseCompound)) !== null && _a !== void 0 ? _a : this.try(this.parseSimple)) !== null && _b !== void 0 ? _b : this.errorOut('parseDeclaration()');
        };
        this.parseQuestion = () => {
            var _a;
            return (_a = this.try(this.parseBinaryQuestion)) !== null && _a !== void 0 ? _a : this.errorOut('parseQuestion()');
        };
        this.parseSimple = () => {
            var _a, _b;
            return (_b = (_a = this.try(this.parseCopulaSentence)) !== null && _a !== void 0 ? _a : this.try(this.parseVerbSentence)) !== null && _b !== void 0 ? _b : this.errorOut('parseSimple()');
        };
        this.parseCompound = () => {
            var _a, _b;
            return (_b = (_a = this.try(this.parseComplex)) !== null && _a !== void 0 ? _a : this.try(this.parseConjunctive)) !== null && _b !== void 0 ? _b : this.errorOut('parseCompound()');
        };
        this.parseVerbSentence = () => {
            var _a, _b;
            return (_b = (_a = this.try(this.parseIntransitiveSentence)) !== null && _a !== void 0 ? _a : this.try(this.parseMonotransitiveSentence)) !== null && _b !== void 0 ? _b : this.errorOut('parseVerbSentence()');
        };
        this.parseCopulaSentence = () => {
            const subject = this.parseNounPhrase();
            const copula = this.lx.assert(Copula_1.default, { errorMsg: 'parseCopulaSentence(), expected copula' });
            const negation = this.lx.assert(Negation_1.default, { errorOut: false });
            const predicate = this.parseNounPhrase();
            return new CopulaSentence_1.default(subject, copula, predicate, negation);
        };
        this.parseComplex = () => {
            const subconj = this.lx.assert(SubordinatingConjunction_1.default, { errorOut: false });
            if (subconj) {
                const condition = this.parseSimple();
                this.lx.assert(Then_1.default, { errorOut: false });
                const outcome = this.parseSimple();
                return new ComplexSentence_1.default(condition, outcome, subconj);
            }
            else {
                const outcome = this.parseSimple();
                const subconj = this.lx.assert(SubordinatingConjunction_1.default, { errorOut: true, errorMsg: 'expected subordinating conjunction' });
                const condition = this.parseSimple();
                return new ComplexSentence_1.default(condition, outcome, subconj);
            }
        };
        this.parseIntransitiveSentence = () => {
            const subject = this.parseNounPhrase();
            const negation = this.lx.assert(Negation_1.default, { errorOut: false });
            const iverb = this.lx.assert(IVerb_1.default, { errorMsg: 'parseIntransitiveSentence(), expected i-verb' });
            const complements = this.parseComplements();
            return new IntransitiveSentence_1.default(subject, iverb, complements, negation);
        };
        this.parseMonotransitiveSentence = () => {
            const subject = this.parseNounPhrase();
            const negation = this.lx.assert(Negation_1.default, { errorOut: false });
            const mverb = this.lx.assert(MVerb_1.default, { errorMsg: 'parseMonotransitiveSentence(), expected i-verb' });
            const cs1 = this.parseComplements();
            const object = this.parseNounPhrase();
            const cs2 = this.parseComplements();
            return new MonotransitiveSentence_1.default(subject, mverb, object, cs1.concat(cs2), negation);
        };
        this.parseBinaryQuestion = () => {
            var _a;
            return (_a = this.try(this.parseCopulaQuestion)) !== null && _a !== void 0 ? _a : this.errorOut('parseBinaryQuestion()');
        };
        this.parseCopulaQuestion = () => {
            const copula = this.lx.assert(Copula_1.default, { errorMsg: 'parseCopulaQuestion(), expected copula' });
            const subject = this.parseNounPhrase();
            const predicate = this.parseNounPhrase();
            return new CopulaQuestion_1.default(subject, predicate, copula);
        };
        this.parseNounPhrase = () => {
            const quantifier = this.lx.assert(Quantifier_1.default, { errorOut: false });
            const article = this.lx.assert(Article_1.default, { errorOut: false });
            let adjectives = [];
            let adj;
            while (adj = this.lx.assert(Adjective_1.default, { errorOut: false })) {
                adjectives.push(adj);
            }
            const noun = this.lx.assert(Noun_1.default, { errorOut: false });
            const subordinateClause = this.try(this.parseSubordinateClause);
            const complements = this.parseComplements();
            return new NounPhrase_1.default(adjectives, complements, noun, quantifier, article, subordinateClause);
        };
        this.parseComplements = () => {
            const complements = [];
            let comp;
            while (comp = this.try(this.parseComplement)) {
                complements.push(comp);
            }
            return complements;
        };
        this.parseComplement = () => {
            const preposition = this.lx.assert(Preposition_1.default, { errorMsg: 'parseComplement() expected preposition' });
            const nounPhrase = this.parseNounPhrase();
            return new Complement_1.default(preposition, nounPhrase);
        };
        this.parseSubordinateClause = () => {
            var _a;
            return (_a = this.try(this.parseCopulaSubordinateClause)) !== null && _a !== void 0 ? _a : this.errorOut('parseSubordinateClause()');
        };
        this.parseCopulaSubordinateClause = () => {
            const relpron = this.lx.assert(RelativePronoun_1.default, { errorMsg: 'parseCopulaSubordinateClause() expected relative pronoun' });
            const copula = this.lx.assert(Copula_1.default, { errorMsg: 'parseCopulaSubordinateClause() expected copula' });
            const subject = this.parseNounPhrase();
            return new CopulaSubordinateClause_1.default(relpron, subject, copula);
        };
        this.parseConjunctive = () => {
            throw new Error('NOT IMPLEMENTED! TODO!');
        };
        this.lx = (0, Lexer_1.getLexer)(sourceCode);
    }
    try(method) {
        const memento = this.lx.pos;
        try {
            return method();
        }
        catch (error) {
            console.debug(error.message);
            this.lx.backTo(memento);
        }
    }
    errorOut(errorMsg) {
        this.lx.croak(errorMsg);
        throw new Error(errorMsg);
    }
    parse() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.try(this.parseDeclaration)) !== null && _a !== void 0 ? _a : this.try(this.parseQuestion)) !== null && _b !== void 0 ? _b : this.try(this.parseNounPhrase) // for quick topic reference
        ) !== null && _c !== void 0 ? _c : this.errorOut('parse()');
    }
}
exports["default"] = BasicParser;


/***/ }),

/***/ "./app/src/parser/Parser.ts":
/*!**********************************!*\
  !*** ./app/src/parser/Parser.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getParser = void 0;
const BasicParser_1 = __importDefault(__webpack_require__(/*! ./BasicParser */ "./app/src/parser/BasicParser.ts"));
function getParser(sourceCode) {
    return new BasicParser_1.default(sourceCode);
}
exports.getParser = getParser;


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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**************************!*\
  !*** ./app/src/index.ts ***!
  \**************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Parser_1 = __webpack_require__(/*! ./parser/Parser */ "./app/src/parser/Parser.ts");
// PROLOG TEST //////////////////////////////////////////
// const pro = getProlog();
// (window as any).pro = pro;
// (async () => {
//     await pro.assert('capra(scemo)')
//     await pro.assert('mammal(peloso)')
//     await pro.assert('mammal(fido)')
//     await pro.assert('mammal(X) :- capra(X)')
//     console.log(await pro.query('mammal(X).'))
//     await pro.retract('capra(scemo)')
//     console.log(await pro.query('mammal(X).'))
// })();
// //      //////////////////////////////////////////
//////////////////////////////////////////////////////////////
// console.log((tokenOf('a') as Article).isDefinite())
// console.log(tokenOf('a')  instanceof Article)
// console.log(tokenOf('a')  instanceof Quantifier)
// console.log(tokenOf('every')  instanceof Quantifier)
// console.log(tokenOf('a').toString())
//////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////
// const lexer = getLexer('the cat is a cat.')
// console.log(lexer)
// console.log('is it a noun?', lexer.assert(Noun, {errorOut:false}) )
// console.log(lexer.peek)
// console.log('is it a copula?', lexer.assert(Copula, {errorOut:false}) )
// console.log(lexer.peek)
// console.log('is it an article?', lexer.assert(Article, {errorOut:false}) )
// console.log(lexer.peek)
///////////////////////////////////////////////////////
// console.log(getParser('the cat is big').parse())
// console.log(getParser('the big cat').parse() )
// console.log(getParser('the big cat on the table is eating tuna').parse() )
// console.log(getParser('the big cat on the mat').parse() )
// console.log(getParser('every dog is stupid').parse() )
// console.log(getParser('the cat that is smart').parse() )
// console.log(getParser('nodejs is not helpful').parse() )
// console.log(getParser('if the dog is stupid then the cat is happy').parse() )
// console.log(getParser('the cat is happy if the dog is stupid').parse() )
// console.log((window as any).ast = getParser('the color of the button is red').parse())
console.log(window.ast = (0, Parser_1.getParser)('the color of the button on the black div is red').parse());

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSwwQkFBMEI7QUFDMUIsdURBQXVEO0FBR3ZELG1EQUFtRDtBQUNuRCxpREFBaUQ7QUFDakQsNkVBQTZFO0FBQzdFLDREQUE0RDtBQUM1RCx5REFBeUQ7QUFDekQsMkRBQTJEO0FBQzNELDJEQUEyRDtBQUMzRCxnRkFBZ0Y7QUFDaEYsMkVBQTJFO0FBQzNFLHlGQUF5RjtBQUN6RixPQUFPLENBQUMsR0FBRyxDQUFFLE1BQWMsQ0FBQyxHQUFHLEdBQUcsc0JBQVMsRUFBQyxpREFBaUQsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvYWRqZWN0aXZlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9jb3B1bGFzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2RlZmluaXRlX2FydGljbGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2V4aXN0ZW50aWFsX3F1YW50aWZpZXJzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2h2ZXJicy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9pbmRlZmluaXRlX2FydGljbGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2l2ZXJicy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9tdmVyYnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvbmVnYXRpb25zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL25vbnN1YmNvbmoudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvbm91bnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvcHJlcG9zaXRpb25zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3JlbHByb25zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3N1YmNvbmoudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvdGhlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy91bml2ZXJzYWxfcXVhbnRpZmllcnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Db21wbGVtZW50LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3BocmFzZXMvQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Ob3VuUGhyYXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Db21wbGV4U2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvcHVsYVF1ZXN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Db3B1bGFTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvSW50cmFuc2l0aXZlU2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL01vbm90cmFuc2l0aXZlU2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0Fic3RyYWN0VG9rZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0FkamVjdGl2ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQXJ0aWNsZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQ29wdWxhLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9GdWxsU3RvcC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvSFZlcmIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0lWZXJiLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9NVmVyYi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTmVnYXRpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL05vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTm91bi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUHJlcG9zaXRpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1F1YW50aWZpZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1JlbGF0aXZlUHJvbm91bi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9UaGVuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvdG9rZW5PZi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9CYXNpY1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiYmlnXCIsXG4gICAgXCJzbWFsbFwiLFxuICAgIFwiaGVscGZ1bFwiLFxuICAgIFwicmVkXCIsXG4gICAgXCJibGFja1wiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiaXNcIixcbiAgICBcImFyZVwiLFxuICAgIFwiYmVcIlxuXSIsImV4cG9ydCBkZWZhdWx0W1xuICAgIFwidGhlXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJzb21lXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJkb1wiLFxuICAgIFwiZG9lc1wiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiYVwiLFxuICAgIFwiYW5cIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImV4aXN0XCIsXG4gICAgXCJydW5cIixcbiAgICBcImdyb3dcIixcbiAgICBcImRpZVwiLFxuICAgIFwibGl2ZVwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiZWF0XCIsXG4gICAgXCJkcmlua1wiLFxuICAgIFwid2F0Y2hcIixcbiAgICBcIm1ha2VcIixcbiAgICBcImhpdFwiLFxuICAgIFwiY2xpY2tcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImRvZXNuJ3RcIixcbiAgICBcImRvZXMgbm90XCIsXG4gICAgJ25vdCcsXG4gICAgXCJkb24ndFwiLFxuICAgICdkbyBub3QnXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiYW5kXCIsXG4gICAgXCJvclwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiY2F0XCIsXG4gICAgXCJtYXRcIixcbiAgICBcInRhYmxlXCIsXG4gICAgXCJkb2dcIixcbiAgICBcIm5vZGVqc1wiLFxuICAgIFwiY29sb3JcIixcbiAgICBcImJ1dHRvblwiLFxuICAgIFwiZGl2XCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJ0b1wiLFxuICAgIFwid2l0aFwiLFxuICAgIFwiZnJvbVwiLFxuICAgIFwib2ZcIixcbiAgICBcIm92ZXJcIixcbiAgICBcIm9uXCIsXG4gICAgXCJhdFwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwidGhhdFwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiaWZcIixcbiAgICBcIndoZW5cIixcbiAgICBcImJlY2F1c2VcIixcbiAgICBcIndoaWxlXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJ0aGVuXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJldmVyeVwiLFxuICAgIFwiYWxsXCIsXG4gICAgXCJlYWNoXCJcbl0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuL05vdW5QaHJhc2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGxlbWVudCBpbXBsZW1lbnRzIFBocmFzZXtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHByZXBvc2l0aW9uOlByZXBvc2l0aW9uLCByZWFkb25seSBub3VuUGhyYXNlOk5vdW5QaHJhc2Upe1xuXG4gICAgfVxuICAgICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBQaHJhc2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvUGhyYXNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU3Vib3JkaW5hdGVDbGF1c2VcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBOb3VuIGZyb20gXCIuLi90b2tlbnMvTm91blwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4vTm91blBocmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSBpbXBsZW1lbnRzIFN1Ym9yZGluYXRlQ2xhdXNle1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcmVscHJvbjpSZWxhdGl2ZVByb25vdW4sIHJlYWRvbmx5IHByZWRpY2F0ZTpOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6Q29wdWxhKXtcblxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vdG9rZW5zL0FkamVjdGl2ZVwiO1xuaW1wb3J0IEFydGljbGUgZnJvbSBcIi4uL3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vdG9rZW5zL05vdW5cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi90b2tlbnMvUXVhbnRpZmllclwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4vQ29tcGxlbWVudFwiO1xuaW1wb3J0IFN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdW5QaHJhc2UgaW1wbGVtZW50cyBQaHJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYWRqZWN0aXZlczogQWRqZWN0aXZlW10sIFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IGNvbXBsZW1lbnRzOiBDb21wbGVtZW50W10sIFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG5vdW4/OiBOb3VuLCBcbiAgICAgICAgICAgICAgICByZWFkb25seSBxdWFudGlmaWVyPzogUXVhbnRpZmllciwgXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgYXJ0aWNsZT86IEFydGljbGUsIFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IHN1Ym9yZENsYXVzZT86IFN1Ym9yZGluYXRlQ2xhdXNlKSB7XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgQ29tcG91bmRTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db21wb3VuZFNlbnRlbmNlXCI7XG5pbXBvcnQgU2ltcGxlU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU2ltcGxlU2VudGVuY2VcIjtcbmltcG9ydCBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSBcIi4uL3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGxleFNlbnRlbmNlIGltcGxlbWVudHMgQ29tcG91bmRTZW50ZW5jZXtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjpTaW1wbGVTZW50ZW5jZSwgcmVhZG9ubHkgb3V0Y29tZTpTaW1wbGVTZW50ZW5jZSwgcmVhZG9ubHkgc3ViY29uajpTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24pe1xuXG4gICAgfVxuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBCaW5hcnlRdWVzdGlvbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9CaW5hcnlRdWVzdGlvblwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFRdWVzdGlvbiBpbXBsZW1lbnRzIEJpbmFyeVF1ZXN0aW9ue1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDpOb3VuUGhyYXNlLCByZWFkb25seSBwcmVkaWNhdGU6Tm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOkNvcHVsYSl7XG5cbiAgICB9XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFNpbXBsZVNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1NpbXBsZVNlbnRlbmNlXCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFTZW50ZW5jZSBpbXBsZW1lbnRzIFNpbXBsZVNlbnRlbmNle1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDpOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6Q29wdWxhLCByZWFkb25seSBwcmVkaWNhdGU6Tm91blBocmFzZSwgcmVhZG9ubHkgbmVnYXRpb24/Ok5lZ2F0aW9uKXtcbiAgICAgICAgXG4gICAgfVxuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBWZXJiU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvVmVyYlNlbnRlbmNlXCI7XG5pbXBvcnQgQ29tcGxlbWVudCBmcm9tIFwiLi4vcGhyYXNlcy9Db21wbGVtZW50XCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgSVZlcmIgZnJvbSBcIi4uL3Rva2Vucy9JVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50cmFuc2l0aXZlU2VudGVuY2UgaW1wbGVtZW50cyBWZXJiU2VudGVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDogTm91blBocmFzZSwgXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgaXZlcmI6IElWZXJiLCBcbiAgICAgICAgICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLCBcbiAgICAgICAgICAgICAgICByZWFkb25seSBuZWdhdGlvbj86IE5lZ2F0aW9uKSB7XG5cbiAgICB9XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vdG9rZW5zL01WZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlIGltcGxlbWVudHMgVmVyYlNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgbXZlcmI6IE1WZXJiLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG9iamVjdDogTm91blBocmFzZSxcbiAgICAgICAgICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RUb2tlbiBpbXBsZW1lbnRzIFRva2Vue1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3RyaW5nOnN0cmluZyl7XG5cbiAgICB9ICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGplY3RpdmUgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBkZWZpbml0ZV9hcnRpY2xlcyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy9kZWZpbml0ZV9hcnRpY2xlc1wiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnRpY2xlIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcblxuICAgIGlzRGVmaW5pdGUoKXtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRlX2FydGljbGVzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7XG4gICAgICAgIHJldHVybiBgQXJ0aWNsZSgke3RoaXMuc3RyaW5nfSwgaXNEZWZpbml0ZT0ke3RoaXMuaXNEZWZpbml0ZSgpfSlgXG4gICAgfVxuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYSBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ1bGxTdG9wIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFZlcmIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJVmVyYiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1WZXJiIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmVnYXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3VuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlcG9zaXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgICAgIFxufSIsImltcG9ydCBleGlzdGVudGlhbF9xdWFudGlmaWVycyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy9leGlzdGVudGlhbF9xdWFudGlmaWVyc1wiO1xuaW1wb3J0IHVuaXZlcnNhbF9xdWFudGlmaWVycyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy91bml2ZXJzYWxfcXVhbnRpZmllcnNcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWFudGlmaWVyIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbiAgICBpc1VuaXZlcnNhbCgpe1xuICAgICAgICByZXR1cm4gdW5pdmVyc2FsX3F1YW50aWZpZXJzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cblxuICAgIGlzRXhpc3RlbnRpYWwoKXtcbiAgICAgICAgcmV0dXJuIGV4aXN0ZW50aWFsX3F1YW50aWZpZXJzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVsYXRpdmVQcm9ub3VuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGhlbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgIFxufSIsImltcG9ydCBUb2tlbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuLi9hc3QvdG9rZW5zL0Fic3RyYWN0VG9rZW5cIjtcbmltcG9ydCBMZXhlciwgeyBBc3NlcnRBcmdzLCBDb25zdHJ1Y3RvciB9IGZyb20gXCIuL0xleGVyXCI7XG5pbXBvcnQgdG9rZW5PZiBmcm9tIFwiLi90b2tlbk9mXCI7XG5cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYWdlckxleGVyIGltcGxlbWVudHMgTGV4ZXJ7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOlRva2VuW11cbiAgICBwcm90ZWN0ZWQgX3BvczpudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6c3RyaW5nKXsgXG4gICAgICAgIC8vVE9ETzogcmVjb25zdHJ1Y3QgXCJkbyBub3RcIiBhbmQgXCJkb2VzIG5vdFwiIHRva2Vuc1xuICAgICAgICAvL1RPRE86IG5vdW5zIHZzIGFkamVjdGl2ZXNcbiAgICAgICAgdGhpcy50b2tlbnMgPSBzb3VyY2VDb2RlLnNwbGl0KC9cXHMrfFxcLi8pLm1hcChlPT4hZT8nLic6ZSkubWFwKHRva2VuT2YpXG4gICAgICAgIHRoaXMuX3BvcyA9IDBcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBUb2tlbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuXG5cbiAgICBcbiAgICAvKipcbiAgICAgKiBSZXR1cm4gY3VycmVudCB0b2tlbiBpZmYgb2YgZ2l2ZW4gdHlwZSBhbmQgbW92ZSB0byBuZXh0OyBcbiAgICAgKiBlbHNlIHJldHVybiB1bmRlZmluZWQgYW5kIGRvbid0IG1vdmUuXG4gICAgICogQHBhcmFtIGFyZ3MgXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgYXNzZXJ0IDxUPihjbGF6ejpDb25zdHJ1Y3RvcjxUPiwgYXJnczpBc3NlcnRBcmdzKTogVHx1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLnBlZWtcblxuICAgICAgICBpZiAoY3VycmVudCBpbnN0YW5jZW9mIGNsYXp6KXtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MuZXJyb3JPdXQ/P3RydWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3JvYWsoYXJncy5lcnJvck1zZz8/JycpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1Rva2VuXCJcbmltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXJ7XG4gICAgbmV4dCgpOnZvaWRcbiAgICBiYWNrVG8ocG9zOm51bWJlcik6dm9pZFxuICAgIGdldCBwZWVrKCk6VG9rZW5cbiAgICBnZXQgcG9zKCk6bnVtYmVyXG4gICAgY3JvYWsoZXJyb3JNc2c6c3RyaW5nKTp2b2lkICAgXG4gICAgYXNzZXJ0IDxUPihjbGF6ejpDb25zdHJ1Y3RvcjxUPiwgYXJnczpBc3NlcnRBcmdzKTogVHx1bmRlZmluZWQgXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXJ0QXJnc3tcbiAgICBlcnJvck1zZz86c3RyaW5nXG4gICAgZXJyb3JPdXQ/OmJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6c3RyaW5nKXtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSlcbn1cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUXG4iLCJpbXBvcnQgYWRqZWN0aXZlcyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2FkamVjdGl2ZXMnXG5pbXBvcnQgaW5kZWZpbml0ZV9hcnRpY2xlcyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2luZGVmaW5pdGVfYXJ0aWNsZXMnXG5pbXBvcnQgZGVmaW5pdGVfYXJ0aWNsZXMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9kZWZpbml0ZV9hcnRpY2xlcydcbmltcG9ydCBjb3B1bGFzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvY29wdWxhcydcbmltcG9ydCBodmVyYnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9odmVyYnMnXG5pbXBvcnQgaXZlcmJzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvaXZlcmJzJ1xuaW1wb3J0IG12ZXJicyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL212ZXJicydcbmltcG9ydCBuZWdhdGlvbnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9uZWdhdGlvbnMnXG5pbXBvcnQgbm9uc3ViY29uaiBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL25vbnN1YmNvbmonXG5pbXBvcnQgbm91bnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9ub3VucydcbmltcG9ydCBwcmVwb3NpdGlvbnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9wcmVwb3NpdGlvbnMnXG5pbXBvcnQgZXhpc3RxdWFudCBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2V4aXN0ZW50aWFsX3F1YW50aWZpZXJzJ1xuaW1wb3J0IHVuaXF1YW50IGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvdW5pdmVyc2FsX3F1YW50aWZpZXJzJ1xuaW1wb3J0IHJlbHByb25zIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvcmVscHJvbnMnXG5pbXBvcnQgc3ViY29uaiBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL3N1YmNvbmonXG5pbXBvcnQgdGhlbiBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL3RoZW4nXG5pbXBvcnQgQXJ0aWNsZSBmcm9tICcuLi9hc3QvdG9rZW5zL0FydGljbGUnXG5pbXBvcnQgQ29wdWxhIGZyb20gJy4uL2FzdC90b2tlbnMvQ29wdWxhJ1xuaW1wb3J0IEhWZXJiIGZyb20gJy4uL2FzdC90b2tlbnMvSFZlcmInXG5pbXBvcnQgSVZlcmIgZnJvbSAnLi4vYXN0L3Rva2Vucy9JVmVyYidcbmltcG9ydCBNVmVyYiBmcm9tICcuLi9hc3QvdG9rZW5zL01WZXJiJ1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gJy4uL2FzdC90b2tlbnMvTmVnYXRpb24nXG5pbXBvcnQgTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gJy4uL2FzdC90b2tlbnMvTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uJ1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gJy4uL2FzdC90b2tlbnMvUHJlcG9zaXRpb24nXG5pbXBvcnQgUXVhbnRpZmllciBmcm9tICcuLi9hc3QvdG9rZW5zL1F1YW50aWZpZXInXG5pbXBvcnQgVGhlbiBmcm9tICcuLi9hc3QvdG9rZW5zL1RoZW4nXG5pbXBvcnQgUmVsYXRpdmVQcm9ub3VuIGZyb20gJy4uL2FzdC90b2tlbnMvUmVsYXRpdmVQcm9ub3VuJ1xuaW1wb3J0IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tICcuLi9hc3QvdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvbidcbmltcG9ydCBOb3VuIGZyb20gJy4uL2FzdC90b2tlbnMvTm91bidcbmltcG9ydCBBZGplY3RpdmUgZnJvbSAnLi4vYXN0L3Rva2Vucy9BZGplY3RpdmUnXG5pbXBvcnQgVG9rZW4gZnJvbSAnLi4vYXN0L2ludGVyZmFjZXMvVG9rZW4nXG5pbXBvcnQgRnVsbFN0b3AgZnJvbSAnLi4vYXN0L3Rva2Vucy9GdWxsU3RvcCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9rZW5PZihzdHJpbmc6c3RyaW5nKTpUb2tlbntcbiAgICBcbiAgICBpZiAoaW5kZWZpbml0ZV9hcnRpY2xlcy5jb25jYXQoZGVmaW5pdGVfYXJ0aWNsZXMpLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IEFydGljbGUoc3RyaW5nKVxuICAgIH1lbHNlIGlmIChjb3B1bGFzLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IENvcHVsYShzdHJpbmcpXG4gICAgfWVsc2UgaWYgKGh2ZXJicy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBIVmVyYihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKGl2ZXJicy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBJVmVyYihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKG12ZXJicy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBNVmVyYihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKG5lZ2F0aW9ucy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBOZWdhdGlvbihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKG5vbnN1YmNvbmouaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uKHN0cmluZylcbiAgICB9ZWxzZSBpZiAocHJlcG9zaXRpb25zLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IFByZXBvc2l0aW9uKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoZXhpc3RxdWFudC5jb25jYXQodW5pcXVhbnQpLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IFF1YW50aWZpZXIoc3RyaW5nKVxuICAgIH1lbHNlIGlmICh0aGVuLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IFRoZW4oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChyZWxwcm9ucy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWxhdGl2ZVByb25vdW4oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChzdWJjb25qLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKG5vdW5zLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IE5vdW4oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChhZGplY3RpdmVzLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IEFkamVjdGl2ZShzdHJpbmcpXG4gICAgfWVsc2UgaWYgKCcuJyA9PT0gc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIG5ldyBGdWxsU3RvcCgnLicpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBBZGplY3RpdmUoc3RyaW5nKVxufSIsImltcG9ydCBBc3QgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0FzdFwiO1xuaW1wb3J0IEJpbmFyeVF1ZXN0aW9uIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9CaW5hcnlRdWVzdGlvblwiO1xuaW1wb3J0IENvbXBvdW5kU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0NvbXBvdW5kU2VudGVuY2VcIjtcbmltcG9ydCBEZWNsYXJhdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvRGVjbGFyYXRpb25cIjtcbmltcG9ydCBRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvUXVlc3Rpb25cIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvU2ltcGxlU2VudGVuY2VcIjtcbmltcG9ydCBWZXJiU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1ZlcmJTZW50ZW5jZVwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4uL2FzdC9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgQ29tcGxleFNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvbXBsZXhTZW50ZW5jZVwiO1xuaW1wb3J0IENvbmp1bmN0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29uanVuY3RpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IENvcHVsYVF1ZXN0aW9uIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvcHVsYVF1ZXN0aW9uXCI7XG5pbXBvcnQgQ29wdWxhU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29wdWxhU2VudGVuY2VcIjtcbmltcG9ydCBJbnRyYW5zaXRpdmVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9JbnRyYW5zaXRpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IE1vbm90cmFuc2l0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvTW9ub3RyYW5zaXRpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BZGplY3RpdmVcIjtcbmltcG9ydCBBcnRpY2xlIGZyb20gXCIuLi9hc3QvdG9rZW5zL0FydGljbGVcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL2FzdC90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgSVZlcmIgZnJvbSBcIi4uL2FzdC90b2tlbnMvSVZlcmJcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9NVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL05lZ2F0aW9uXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vYXN0L3Rva2Vucy9Ob3VuXCI7XG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi9hc3QvdG9rZW5zL1F1YW50aWZpZXJcIjtcbmltcG9ydCBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uXCI7XG5pbXBvcnQgVGhlbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9UaGVuXCI7XG5pbXBvcnQgTGV4ZXIsIHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIjtcbmltcG9ydCBQYXJzZXIgZnJvbSBcIi4vUGFyc2VyXCI7XG5pbXBvcnQgQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2FzdC9waHJhc2VzL0NvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgUmVsYXRpdmVQcm9ub3VuIGZyb20gXCIuLi9hc3QvdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY1BhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBwcm90ZWN0ZWQgbHg6IExleGVyXG5cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VDb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5seCA9IGdldExleGVyKHNvdXJjZUNvZGUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRyeTxUIGV4dGVuZHMgQXN0PihtZXRob2Q6ICgpID0+IFQpIHtcblxuICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5seC5wb3NcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZCgpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKChlcnJvciBhcyBFcnJvcikubWVzc2FnZSlcbiAgICAgICAgICAgIHRoaXMubHguYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBlcnJvck91dChlcnJvck1zZzogc3RyaW5nKTogQXN0IHtcbiAgICAgICAgdGhpcy5seC5jcm9hayhlcnJvck1zZylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTXNnKVxuICAgIH1cblxuICAgIHBhcnNlKCk6IEFzdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlRGVjbGFyYXRpb24pXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlUXVlc3Rpb24pXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlTm91blBocmFzZSkgLy8gZm9yIHF1aWNrIHRvcGljIHJlZmVyZW5jZVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2UoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlRGVjbGFyYXRpb24gPSAoKTogRGVjbGFyYXRpb24gPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvbXBvdW5kKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZVNpbXBsZSkgXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZURlY2xhcmF0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVF1ZXN0aW9uID0gKCk6IFF1ZXN0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VCaW5hcnlRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlUXVlc3Rpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlU2ltcGxlID0gKCk6IFNpbXBsZVNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VWZXJiU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVNpbXBsZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3VuZCA9ICgpOiBDb21wb3VuZFNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb21wbGV4KVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZUNvbmp1bmN0aXZlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VDb21wb3VuZCgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VWZXJiU2VudGVuY2UgPSAoKTogVmVyYlNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VWZXJiU2VudGVuY2UoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhU2VudGVuY2UgPSAoKTogQ29wdWxhU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVNlbnRlbmNlKCksIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3QgbmVnYXRpb24gPSB0aGlzLmx4LmFzc2VydChOZWdhdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVNlbnRlbmNlKHN1YmplY3QsIGNvcHVsYSBhcyBDb3B1bGEsIHByZWRpY2F0ZSwgbmVnYXRpb24pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcGxleCA9ICgpOiBDb21wbGV4U2VudGVuY2UgPT4ge1xuXG4gICAgICAgIGNvbnN0IHN1YmNvbmogPSB0aGlzLmx4LmFzc2VydChTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG5cbiAgICAgICAgaWYgKHN1YmNvbmopIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgdGhpcy5seC5hc3NlcnQoVGhlbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29tcGxleFNlbnRlbmNlKGNvbmRpdGlvbiwgb3V0Y29tZSwgc3ViY29uailcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIGNvbnN0IHN1YmNvbmogPSB0aGlzLmx4LmFzc2VydChTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sIHsgZXJyb3JPdXQ6IHRydWUsIGVycm9yTXNnOiAnZXhwZWN0ZWQgc3Vib3JkaW5hdGluZyBjb25qdW5jdGlvbicgfSlcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb21wbGV4U2VudGVuY2UoY29uZGl0aW9uLCBvdXRjb21lLCBzdWJjb25qIGFzIFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbilcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UgPSAoKTogSW50cmFuc2l0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBuZWdhdGlvbiA9IHRoaXMubHguYXNzZXJ0KE5lZ2F0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBpdmVyYiA9IHRoaXMubHguYXNzZXJ0KElWZXJiLCB7IGVycm9yTXNnOiAncGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSgpLCBleHBlY3RlZCBpLXZlcmInIH0pXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRyYW5zaXRpdmVTZW50ZW5jZShzdWJqZWN0LCBpdmVyYiBhcyBJVmVyYiwgY29tcGxlbWVudHMsIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UgPSAoKTogTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IG5lZ2F0aW9uID0gdGhpcy5seC5hc3NlcnQoTmVnYXRpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IG12ZXJiID0gdGhpcy5seC5hc3NlcnQoTVZlcmIsIHsgZXJyb3JNc2c6ICdwYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UoKSwgZXhwZWN0ZWQgaS12ZXJiJyB9KVxuICAgICAgICBjb25zdCBjczEgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKVxuICAgICAgICBjb25zdCBvYmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IGNzMiA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG4gICAgICAgIHJldHVybiBuZXcgTW9ub3RyYW5zaXRpdmVTZW50ZW5jZShzdWJqZWN0LCBtdmVyYiBhcyBNVmVyYiwgb2JqZWN0LCBjczEuY29uY2F0KGNzMiksIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUJpbmFyeVF1ZXN0aW9uID0gKCk6IEJpbmFyeVF1ZXN0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlQmluYXJ5UXVlc3Rpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhUXVlc3Rpb24gPSAoKTogQ29wdWxhUXVlc3Rpb24gPT4ge1xuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVF1ZXN0aW9uKCksIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVF1ZXN0aW9uKHN1YmplY3QsIHByZWRpY2F0ZSwgY29wdWxhIGFzIENvcHVsYSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VOb3VuUGhyYXNlID0gKCk6IE5vdW5QaHJhc2UgPT4ge1xuICAgICAgICBjb25zdCBxdWFudGlmaWVyID0gdGhpcy5seC5hc3NlcnQoUXVhbnRpZmllciwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgYXJ0aWNsZSA9IHRoaXMubHguYXNzZXJ0KEFydGljbGUsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG5cbiAgICAgICAgbGV0IGFkamVjdGl2ZXMgPSBbXVxuICAgICAgICBsZXQgYWRqXG5cbiAgICAgICAgd2hpbGUgKGFkaiA9IHRoaXMubHguYXNzZXJ0KEFkamVjdGl2ZSwgeyBlcnJvck91dDogZmFsc2UgfSkpIHtcbiAgICAgICAgICAgIGFkamVjdGl2ZXMucHVzaChhZGopXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3VuID0gdGhpcy5seC5hc3NlcnQoTm91biwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3Qgc3Vib3JkaW5hdGVDbGF1c2UgPSB0aGlzLnRyeSh0aGlzLnBhcnNlU3Vib3JkaW5hdGVDbGF1c2UpXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKCkgXG5cbiAgICAgICAgcmV0dXJuIG5ldyBOb3VuUGhyYXNlKGFkamVjdGl2ZXMsIGNvbXBsZW1lbnRzLCBub3VuLCBxdWFudGlmaWVyLCBhcnRpY2xlLCBzdWJvcmRpbmF0ZUNsYXVzZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wbGVtZW50cyA9ICgpOiBDb21wbGVtZW50W10gPT4ge1xuXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gW11cbiAgICAgICAgbGV0IGNvbXBcblxuICAgICAgICB3aGlsZSAoY29tcCA9IHRoaXMudHJ5KHRoaXMucGFyc2VDb21wbGVtZW50KSkge1xuICAgICAgICAgICAgY29tcGxlbWVudHMucHVzaChjb21wKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbXBsZW1lbnRzXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcGxlbWVudCA9ICgpOiBDb21wbGVtZW50ID0+IHtcbiAgICAgICAgY29uc3QgcHJlcG9zaXRpb24gPSB0aGlzLmx4LmFzc2VydChQcmVwb3NpdGlvbiwgeyBlcnJvck1zZzogJ3BhcnNlQ29tcGxlbWVudCgpIGV4cGVjdGVkIHByZXBvc2l0aW9uJyB9KVxuICAgICAgICBjb25zdCBub3VuUGhyYXNlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvbXBsZW1lbnQocHJlcG9zaXRpb24gYXMgUHJlcG9zaXRpb24sIG5vdW5QaHJhc2UpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlU3Vib3JkaW5hdGVDbGF1c2UgPSAoKTogU3Vib3JkaW5hdGVDbGF1c2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKSBcbiAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VTdWJvcmRpbmF0ZUNsYXVzZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSA9ICgpOkNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlID0+e1xuICAgICAgICBjb25zdCByZWxwcm9uID0gdGhpcy5seC5hc3NlcnQoUmVsYXRpdmVQcm9ub3VuLCB7ZXJyb3JNc2c6J3BhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UoKSBleHBlY3RlZCByZWxhdGl2ZSBwcm9ub3VuJ30pXG4gICAgICAgIGNvbnN0IGNvcHVsYSA9IHRoaXMubHguYXNzZXJ0KENvcHVsYSwge2Vycm9yTXNnOidwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKCkgZXhwZWN0ZWQgY29wdWxhJ30pXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIHJldHVybiBuZXcgQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UocmVscHJvbiBhcyBSZWxhdGl2ZVByb25vdW4sIHN1YmplY3QsIGNvcHVsYSBhcyBDb3B1bGEpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29uanVuY3RpdmUgPSAoKTogQ29uanVuY3RpdmVTZW50ZW5jZSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTk9UIElNUExFTUVOVEVEISBUT0RPIScpXG4gICAgfVxuXG59IiwiaW1wb3J0IEFzdCBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQXN0XCI7XG5pbXBvcnQgQmFzaWNQYXJzZXIgZnJvbSBcIi4vQmFzaWNQYXJzZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFBhcnNlcntcbiAgICBwYXJzZSgpOkFzdCAgIFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6c3RyaW5nKXtcbiAgICByZXR1cm4gbmV3IEJhc2ljUGFyc2VyKHNvdXJjZUNvZGUpXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCBwbCBmcm9tICd0YXUtcHJvbG9nJ1xuaW1wb3J0IEFydGljbGUgZnJvbSAnLi9hc3QvdG9rZW5zL0FydGljbGUnO1xuaW1wb3J0IENvcHVsYSBmcm9tICcuL2FzdC90b2tlbnMvQ29wdWxhJztcbmltcG9ydCBOb3VuIGZyb20gJy4vYXN0L3Rva2Vucy9Ob3VuJztcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSAnLi9sZXhlci9MZXhlcic7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tICcuL3BhcnNlci9QYXJzZXInO1xuaW1wb3J0IFByb2xvZywgeyBnZXRQcm9sb2cgfSBmcm9tICcuL3Byb2xvZy9Qcm9sb2cnO1xuaW1wb3J0IFRhdVByb2xvZyBmcm9tICcuL3Byb2xvZy9UYXVQcm9sb2cnO1xuXG5cbi8vIFBST0xPRyBURVNUIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gY29uc3QgcHJvID0gZ2V0UHJvbG9nKCk7XG4vLyAod2luZG93IGFzIGFueSkucHJvID0gcHJvO1xuXG4vLyAoYXN5bmMgKCkgPT4ge1xuLy8gICAgIGF3YWl0IHByby5hc3NlcnQoJ2NhcHJhKHNjZW1vKScpXG4vLyAgICAgYXdhaXQgcHJvLmFzc2VydCgnbWFtbWFsKHBlbG9zbyknKVxuLy8gICAgIGF3YWl0IHByby5hc3NlcnQoJ21hbW1hbChmaWRvKScpXG4vLyAgICAgYXdhaXQgcHJvLmFzc2VydCgnbWFtbWFsKFgpIDotIGNhcHJhKFgpJylcbi8vICAgICBjb25zb2xlLmxvZyhhd2FpdCBwcm8ucXVlcnkoJ21hbW1hbChYKS4nKSlcbi8vICAgICBhd2FpdCBwcm8ucmV0cmFjdCgnY2FwcmEoc2NlbW8pJylcbi8vICAgICBjb25zb2xlLmxvZyhhd2FpdCBwcm8ucXVlcnkoJ21hbW1hbChYKS4nKSlcbi8vIH0pKCk7XG4vLyAvLyAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb25zb2xlLmxvZygodG9rZW5PZignYScpIGFzIEFydGljbGUpLmlzRGVmaW5pdGUoKSlcbi8vIGNvbnNvbGUubG9nKHRva2VuT2YoJ2EnKSAgaW5zdGFuY2VvZiBBcnRpY2xlKVxuLy8gY29uc29sZS5sb2codG9rZW5PZignYScpICBpbnN0YW5jZW9mIFF1YW50aWZpZXIpXG4vLyBjb25zb2xlLmxvZyh0b2tlbk9mKCdldmVyeScpICBpbnN0YW5jZW9mIFF1YW50aWZpZXIpXG4vLyBjb25zb2xlLmxvZyh0b2tlbk9mKCdhJykudG9TdHJpbmcoKSlcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIGNvbnN0IGxleGVyID0gZ2V0TGV4ZXIoJ3RoZSBjYXQgaXMgYSBjYXQuJylcbi8vIGNvbnNvbGUubG9nKGxleGVyKVxuLy8gY29uc29sZS5sb2coJ2lzIGl0IGEgbm91bj8nLCBsZXhlci5hc3NlcnQoTm91biwge2Vycm9yT3V0OmZhbHNlfSkgKVxuLy8gY29uc29sZS5sb2cobGV4ZXIucGVlaylcbi8vIGNvbnNvbGUubG9nKCdpcyBpdCBhIGNvcHVsYT8nLCBsZXhlci5hc3NlcnQoQ29wdWxhLCB7ZXJyb3JPdXQ6ZmFsc2V9KSApXG4vLyBjb25zb2xlLmxvZyhsZXhlci5wZWVrKVxuLy8gY29uc29sZS5sb2coJ2lzIGl0IGFuIGFydGljbGU/JywgbGV4ZXIuYXNzZXJ0KEFydGljbGUsIHtlcnJvck91dDpmYWxzZX0pIClcbi8vIGNvbnNvbGUubG9nKGxleGVyLnBlZWspXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgY2F0IGlzIGJpZycpLnBhcnNlKCkpXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBiaWcgY2F0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBiaWcgY2F0IG9uIHRoZSB0YWJsZSBpcyBlYXRpbmcgdHVuYScpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgYmlnIGNhdCBvbiB0aGUgbWF0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ2V2ZXJ5IGRvZyBpcyBzdHVwaWQnKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGNhdCB0aGF0IGlzIHNtYXJ0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ25vZGVqcyBpcyBub3QgaGVscGZ1bCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCdpZiB0aGUgZG9nIGlzIHN0dXBpZCB0aGVuIHRoZSBjYXQgaXMgaGFwcHknKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGNhdCBpcyBoYXBweSBpZiB0aGUgZG9nIGlzIHN0dXBpZCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coKHdpbmRvdyBhcyBhbnkpLmFzdCA9IGdldFBhcnNlcigndGhlIGNvbG9yIG9mIHRoZSBidXR0b24gaXMgcmVkJykucGFyc2UoKSlcbmNvbnNvbGUubG9nKCh3aW5kb3cgYXMgYW55KS5hc3QgPSBnZXRQYXJzZXIoJ3RoZSBjb2xvciBvZiB0aGUgYnV0dG9uIG9uIHRoZSBibGFjayBkaXYgaXMgcmVkJykucGFyc2UoKSlcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==