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
    "exists",
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

/***/ "./app/src/ast/interfaces/Constituent.ts":
/*!***********************************************!*\
  !*** ./app/src/ast/interfaces/Constituent.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.makeHornClauses = exports.getRandomId = void 0;
function getRandomId() {
    return parseInt(1000000 * Math.random() + "");
}
exports.getRandomId = getRandomId;
function makeHornClauses(_conditions, conclusions) {
    const conditions = _conditions.map(s => s.string)
        .reduce((a, b) => `${a}, ${b}`);
    return conclusions.map(p => `${p.string} :- ${conditions}`) // one horn clause for every predicate in the conclusion
        .map(c => ({ string: c }));
}
exports.makeHornClauses = makeHornClauses;


/***/ }),

/***/ "./app/src/ast/phrases/Complement.ts":
/*!*******************************************!*\
  !*** ./app/src/ast/phrases/Complement.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Constituent_1 = __webpack_require__(/*! ../interfaces/Constituent */ "./app/src/ast/interfaces/Constituent.ts");
class Complement {
    constructor(preposition, nounPhrase) {
        this.preposition = preposition;
        this.nounPhrase = nounPhrase;
    }
    toProlog(args) {
        var _a;
        const newId = (0, Constituent_1.getRandomId)();
        return [{ string: `${this.preposition.string}(${(_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject}, ${newId})` }]
            .concat(this.nounPhrase.toProlog(Object.assign(Object.assign({}, args), { roles: { subject: newId } })));
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
    toProlog(args) {
        var _a;
        return this.predicate.toProlog(Object.assign(Object.assign({}, args), { roles: { subject: (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject } }));
    }
}
exports["default"] = CopulaSubordinateClause;


/***/ }),

/***/ "./app/src/ast/phrases/NounPhrase.ts":
/*!*******************************************!*\
  !*** ./app/src/ast/phrases/NounPhrase.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Constituent_1 = __webpack_require__(/*! ../interfaces/Constituent */ "./app/src/ast/interfaces/Constituent.ts");
class NounPhrase {
    constructor(adjectives, complements, noun, quantifier, article, subordClause) {
        this.adjectives = adjectives;
        this.complements = complements;
        this.noun = noun;
        this.quantifier = quantifier;
        this.article = article;
        this.subordClause = subordClause;
    }
    isUniversallyQuantified() {
        var _a, _b;
        return (_b = (_a = this.quantifier) === null || _a === void 0 ? void 0 : _a.isUniversal()) !== null && _b !== void 0 ? _b : false;
    }
    toProlog(args) {
        var _a, _b, _c, _d;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Constituent_1.getRandomId)();
        return this
            .adjectives
            .map(a => a.string)
            .concat(this.noun ? [this.noun.string] : [])
            .map(p => `${p}(${subjectId})`)
            .map(s => ({ string: s }))
            .concat(this.complements.flatMap(c => c.toProlog(Object.assign(Object.assign({}, args), { roles: { subject: subjectId } }))))
            .concat((_d = (_c = this.subordClause) === null || _c === void 0 ? void 0 : _c.toProlog(Object.assign(Object.assign({}, args), { roles: { subject: subjectId } }))) !== null && _d !== void 0 ? _d : []);
    }
}
exports["default"] = NounPhrase;


/***/ }),

/***/ "./app/src/ast/sentences/ComplexSentence.ts":
/*!**************************************************!*\
  !*** ./app/src/ast/sentences/ComplexSentence.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Constituent_1 = __webpack_require__(/*! ../interfaces/Constituent */ "./app/src/ast/interfaces/Constituent.ts");
/**
 * A sentence that relates two simple sentences hypotactically, in a
 * condition-outcome relationship.
 */
class ComplexSentence {
    constructor(condition, outcome, subconj) {
        this.condition = condition;
        this.outcome = outcome;
        this.subconj = subconj;
    }
    toProlog(args) {
        var _a, _b;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Constituent_1.getRandomId)();
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        //TODO: this is WRONG, subject of condition may NOT always be the subject of the outcome
        const condition = this.condition.toProlog(newArgs);
        const outcome = this.outcome.toProlog(newArgs);
        return (0, Constituent_1.makeHornClauses)(condition, outcome);
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
    toProlog(args) {
        throw new Error("Method not implemented.");
    }
}
exports["default"] = CopulaQuestion;


/***/ }),

/***/ "./app/src/ast/sentences/CopulaSentence.ts":
/*!*************************************************!*\
  !*** ./app/src/ast/sentences/CopulaSentence.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Constituent_1 = __webpack_require__(/*! ../interfaces/Constituent */ "./app/src/ast/interfaces/Constituent.ts");
class CopulaSentence {
    constructor(subject, copula, predicate, negation) {
        this.subject = subject;
        this.copula = copula;
        this.predicate = predicate;
        this.negation = negation;
    }
    toProlog(args) {
        var _a, _b;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Constituent_1.getRandomId)();
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        const predicate = this.predicate.toProlog(newArgs);
        const subject = this.subject.toProlog(newArgs);
        return this.subject.isUniversallyQuantified() ?
            (0, Constituent_1.makeHornClauses)(subject, predicate) :
            predicate.concat(subject);
    }
}
exports["default"] = CopulaSentence;


/***/ }),

/***/ "./app/src/ast/sentences/IntransitiveSentence.ts":
/*!*******************************************************!*\
  !*** ./app/src/ast/sentences/IntransitiveSentence.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Constituent_1 = __webpack_require__(/*! ../interfaces/Constituent */ "./app/src/ast/interfaces/Constituent.ts");
class IntransitiveSentence {
    constructor(subject, iverb, complements, negation) {
        this.subject = subject;
        this.iverb = iverb;
        this.complements = complements;
        this.negation = negation;
    }
    toProlog(args) {
        var _a, _b;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Constituent_1.getRandomId)();
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        return [{ string: `${this.iverb.string}(${subjectId})` }]
            .concat(this.subject.toProlog(newArgs))
            .concat(this.complements.flatMap(c => c.toProlog(newArgs)));
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
    toProlog(args) {
        throw new Error("Method not implemented.");
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
// console.log((window as any).ast = getParser('the color of the button on the black div is red').parse())
function test(string) {
    console.log(string);
    console.log((0, Parser_1.getParser)(string).parse().toProlog());
}
test('the cat is on the mat');
test('the cat that is red is on the mat');
test('the big cat that is on the mat is black');
test('every cat is red');
test('every red cat is on the mat');
test('the cat exists on the mat');
test('if the cat is on the mat then the cat is red');

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQztBQUNyRCxDQUFDO0FBRUQsSUFBSSxDQUFDLHVCQUF1QixDQUFDO0FBQzdCLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQztBQUN6QyxJQUFJLENBQUMseUNBQXlDLENBQUM7QUFDL0MsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0FBQ3hCLElBQUksQ0FBQyw2QkFBNkIsQ0FBQztBQUNuQyxJQUFJLENBQUMsMkJBQTJCLENBQUM7QUFDakMsSUFBSSxDQUFDLDhDQUE4QyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvYWRqZWN0aXZlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9jb3B1bGFzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2RlZmluaXRlX2FydGljbGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2V4aXN0ZW50aWFsX3F1YW50aWZpZXJzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2h2ZXJicy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9pbmRlZmluaXRlX2FydGljbGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2l2ZXJicy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9tdmVyYnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvbmVnYXRpb25zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL25vbnN1YmNvbmoudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvbm91bnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvcHJlcG9zaXRpb25zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3JlbHByb25zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3N1YmNvbmoudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvdGhlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy91bml2ZXJzYWxfcXVhbnRpZmllcnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvaW50ZXJmYWNlcy9Db25zdGl0dWVudC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9waHJhc2VzL0NvbXBsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Db3B1bGFTdWJvcmRpbmF0ZUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9waHJhc2VzL05vdW5QaHJhc2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvbXBsZXhTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvQ29wdWxhUXVlc3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvcHVsYVNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9JbnRyYW5zaXRpdmVTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvTW9ub3RyYW5zaXRpdmVTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQWJzdHJhY3RUb2tlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQWRqZWN0aXZlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9BcnRpY2xlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9Db3B1bGEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0Z1bGxTdG9wLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9IVmVyYi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvSVZlcmIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL01WZXJiLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9OZWdhdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9Ob3VuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9QcmVwb3NpdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUXVhbnRpZmllci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUmVsYXRpdmVQcm9ub3VuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1RoZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9sZXhlci90b2tlbk9mLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvcGFyc2VyL0Jhc2ljUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvcGFyc2VyL1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJiaWdcIixcbiAgICBcInNtYWxsXCIsXG4gICAgXCJoZWxwZnVsXCIsXG4gICAgXCJyZWRcIixcbiAgICBcImJsYWNrXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJpc1wiLFxuICAgIFwiYXJlXCIsXG4gICAgXCJiZVwiXG5dIiwiZXhwb3J0IGRlZmF1bHRbXG4gICAgXCJ0aGVcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcInNvbWVcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImRvXCIsXG4gICAgXCJkb2VzXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJhXCIsXG4gICAgXCJhblwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiZXhpc3RcIixcbiAgICBcImV4aXN0c1wiLFxuICAgIFwicnVuXCIsXG4gICAgXCJncm93XCIsXG4gICAgXCJkaWVcIixcbiAgICBcImxpdmVcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImVhdFwiLFxuICAgIFwiZHJpbmtcIixcbiAgICBcIndhdGNoXCIsXG4gICAgXCJtYWtlXCIsXG4gICAgXCJoaXRcIixcbiAgICBcImNsaWNrXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJkb2Vzbid0XCIsXG4gICAgXCJkb2VzIG5vdFwiLFxuICAgICdub3QnLFxuICAgIFwiZG9uJ3RcIixcbiAgICAnZG8gbm90J1xuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImFuZFwiLFxuICAgIFwib3JcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImNhdFwiLFxuICAgIFwibWF0XCIsXG4gICAgXCJ0YWJsZVwiLFxuICAgIFwiZG9nXCIsXG4gICAgXCJub2RlanNcIixcbiAgICBcImNvbG9yXCIsXG4gICAgXCJidXR0b25cIixcbiAgICBcImRpdlwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwidG9cIixcbiAgICBcIndpdGhcIixcbiAgICBcImZyb21cIixcbiAgICBcIm9mXCIsXG4gICAgXCJvdmVyXCIsXG4gICAgXCJvblwiLFxuICAgIFwiYXRcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcInRoYXRcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImlmXCIsXG4gICAgXCJ3aGVuXCIsXG4gICAgXCJiZWNhdXNlXCIsXG4gICAgXCJ3aGlsZVwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwidGhlblwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiZXZlcnlcIixcbiAgICBcImFsbFwiLFxuICAgIFwiZWFjaFwiXG5dIiwiaW1wb3J0IHsgdHlwZSB9IGZyb20gXCJ0YXUtcHJvbG9nXCI7XG5pbXBvcnQgQXN0IGZyb20gXCIuL0FzdFwiO1xuXG4vKipcbiAqIFNvbWUgc3ludGFjdGljIHN0cnVjdHVyZSB0aGF0IGNhbiBiZSBjb252ZXJ0ZWQgdG8gYSBcbiAqIGZpcnN0LW9yZGVyIGxvZ2ljIGZvcm11bGEuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBDb25zdGl0dWVudCBleHRlbmRzIEFzdCB7XG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyk6IENsYXVzZVtdXG59XG5cbmV4cG9ydCB0eXBlIElkID0gbnVtYmVyIHwgc3RyaW5nXG5cbmV4cG9ydCBpbnRlcmZhY2UgUm9sZXMge1xuICAgIHN1YmplY3Q/OiBJZCxcbiAgICBvYmplY3Q/OiBJZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRvUHJvbG9nQXJncyB7XG4gICAgd2l0aFZhcnM/OiBib29sZWFuLFxuICAgIHJvbGVzPzogUm9sZXMsXG4gICAgYW5hcGhvcmE/OiB7XG4gICAgICAgIFtwcmVkaWNhdGU6IHN0cmluZ106IElkXG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZXtcbiAgICBzdHJpbmcgOiBzdHJpbmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbUlkKCk6SWR7XG4gICAgcmV0dXJuIHBhcnNlSW50KDEwMDAwMDAqTWF0aC5yYW5kb20oKStcIlwiKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUhvcm5DbGF1c2VzKF9jb25kaXRpb25zOkNsYXVzZVtdLCBjb25jbHVzaW9uczpDbGF1c2VbXSl7ICAgIFxuICAgIFxuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBfY29uZGl0aW9ucy5tYXAocyA9PiBzLnN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBgJHthfSwgJHtifWApXG5cbiAgICByZXR1cm4gY29uY2x1c2lvbnMubWFwKHAgPT4gYCR7cC5zdHJpbmd9IDotICR7Y29uZGl0aW9uc31gKSAvLyBvbmUgaG9ybiBjbGF1c2UgZm9yIGV2ZXJ5IHByZWRpY2F0ZSBpbiB0aGUgY29uY2x1c2lvblxuICAgICAgICAgICAgICAgICAgICAgIC5tYXAoYyA9PiAoeyBzdHJpbmc6IGMgfSkpXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IHsgVG9Qcm9sb2dBcmdzLCBDbGF1c2UsIGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCBQaHJhc2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvUGhyYXNlXCI7XG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSBcIi4uL3Rva2Vucy9QcmVwb3NpdGlvblwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4vTm91blBocmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wbGVtZW50IGltcGxlbWVudHMgUGhyYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHByZXBvc2l0aW9uOiBQcmVwb3NpdGlvbiwgcmVhZG9ubHkgbm91blBocmFzZTogTm91blBocmFzZSkge1xuXG4gICAgfVxuXG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyk6IENsYXVzZVtdIHsgLy8gcHJlcG9zaXRpb24oYXJncy5zdWJqZWN0LCBZKSArIG5vdW5waHJhc2UudG9Qcm9sb2coc3ViamVjdD1ZKVxuXG4gICAgICAgIGNvbnN0IG5ld0lkID0gZ2V0UmFuZG9tSWQoKTtcblxuICAgICAgICByZXR1cm4gW3sgc3RyaW5nOiBgJHt0aGlzLnByZXBvc2l0aW9uLnN0cmluZ30oJHthcmdzPy5yb2xlcz8uc3ViamVjdH0sICR7bmV3SWR9KWAgfV1cbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5ub3VuUGhyYXNlLnRvUHJvbG9nKHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogbmV3SWQgfSB9KSlcblxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCB7IFRvUHJvbG9nQXJncywgQ2xhdXNlIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCBQaHJhc2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvUGhyYXNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU3Vib3JkaW5hdGVDbGF1c2VcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBOb3VuIGZyb20gXCIuLi90b2tlbnMvTm91blwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4vTm91blBocmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSBpbXBsZW1lbnRzIFN1Ym9yZGluYXRlQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJlbHByb246IFJlbGF0aXZlUHJvbm91biwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSkge1xuXG4gICAgfVxuICAgIFxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS50b1Byb2xvZyh7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IGFyZ3M/LnJvbGVzPy5zdWJqZWN0IH0gfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vdG9rZW5zL0FkamVjdGl2ZVwiO1xuaW1wb3J0IEFydGljbGUgZnJvbSBcIi4uL3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vdG9rZW5zL05vdW5cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi90b2tlbnMvUXVhbnRpZmllclwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4vQ29tcGxlbWVudFwiO1xuaW1wb3J0IFN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgeyBUb1Byb2xvZ0FyZ3MsIENsYXVzZSwgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3VuUGhyYXNlIGltcGxlbWVudHMgUGhyYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGFkamVjdGl2ZXM6IEFkamVjdGl2ZVtdLFxuICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICByZWFkb25seSBub3VuPzogTm91bixcbiAgICAgICAgcmVhZG9ubHkgcXVhbnRpZmllcj86IFF1YW50aWZpZXIsXG4gICAgICAgIHJlYWRvbmx5IGFydGljbGU/OiBBcnRpY2xlLFxuICAgICAgICByZWFkb25seSBzdWJvcmRDbGF1c2U/OiBTdWJvcmRpbmF0ZUNsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgaXNVbml2ZXJzYWxseVF1YW50aWZpZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1YW50aWZpZXI/LmlzVW5pdmVyc2FsKCkgPz8gZmFsc2VcbiAgICB9XG5cbiAgICB0b1Byb2xvZyhhcmdzPzogVG9Qcm9sb2dBcmdzKTogQ2xhdXNlW10ge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgLmFkamVjdGl2ZXNcbiAgICAgICAgICAgIC5tYXAoYSA9PiBhLnN0cmluZylcbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5ub3VuID8gW3RoaXMubm91bi5zdHJpbmddIDogW10pXG4gICAgICAgICAgICAubWFwKHAgPT4gYCR7cH0oJHtzdWJqZWN0SWR9KWApXG4gICAgICAgICAgICAubWFwKHMgPT4gKHsgc3RyaW5nOiBzIH0pKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLmNvbXBsZW1lbnRzLmZsYXRNYXAoYyA9PiBjLnRvUHJvbG9nKHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfSkpKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLnN1Ym9yZENsYXVzZT8udG9Qcm9sb2coeyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9KSA/PyBbXSlcblxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBDb21wb3VuZFNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbXBvdW5kU2VudGVuY2VcIjtcbmltcG9ydCB7IFRvUHJvbG9nQXJncywgQ2xhdXNlLCBnZXRSYW5kb21JZCwgbWFrZUhvcm5DbGF1c2VzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TaW1wbGVTZW50ZW5jZVwiO1xuaW1wb3J0IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tIFwiLi4vdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuXG4vKipcbiAqIEEgc2VudGVuY2UgdGhhdCByZWxhdGVzIHR3byBzaW1wbGUgc2VudGVuY2VzIGh5cG90YWN0aWNhbGx5LCBpbiBhIFxuICogY29uZGl0aW9uLW91dGNvbWUgcmVsYXRpb25zaGlwLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wbGV4U2VudGVuY2UgaW1wbGVtZW50cyBDb21wb3VuZFNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogU2ltcGxlU2VudGVuY2UsXG4gICAgICAgIHJlYWRvbmx5IG91dGNvbWU6IFNpbXBsZVNlbnRlbmNlLFxuICAgICAgICByZWFkb25seSBzdWJjb25qOiBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24pIHtcblxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2VbXSB7XG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIC8vVE9ETzogdGhpcyBpcyBXUk9ORywgc3ViamVjdCBvZiBjb25kaXRpb24gbWF5IE5PVCBhbHdheXMgYmUgdGhlIHN1YmplY3Qgb2YgdGhlIG91dGNvbWVcbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy5jb25kaXRpb24udG9Qcm9sb2cobmV3QXJncylcbiAgICAgICAgY29uc3Qgb3V0Y29tZSA9IHRoaXMub3V0Y29tZS50b1Byb2xvZyhuZXdBcmdzKVxuXG4gICAgICAgIHJldHVybiBtYWtlSG9ybkNsYXVzZXMoY29uZGl0aW9uLCBvdXRjb21lKVxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBCaW5hcnlRdWVzdGlvbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9CaW5hcnlRdWVzdGlvblwiO1xuaW1wb3J0IHsgVG9Qcm9sb2dBcmdzLCBDbGF1c2UgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFRdWVzdGlvbiBpbXBsZW1lbnRzIEJpbmFyeVF1ZXN0aW9ue1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDpOb3VuUGhyYXNlLCByZWFkb25seSBwcmVkaWNhdGU6Tm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOkNvcHVsYSl7XG5cbiAgICB9XG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyB8IHVuZGVmaW5lZCk6IENsYXVzZVtdIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCB7IENsYXVzZSwgZ2V0UmFuZG9tSWQsIG1ha2VIb3JuQ2xhdXNlcywgVG9Qcm9sb2dBcmdzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TaW1wbGVTZW50ZW5jZVwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhU2VudGVuY2UgaW1wbGVtZW50cyBTaW1wbGVTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBuZWdhdGlvbj86IE5lZ2F0aW9uKSB7XG5cbiAgICB9XG5cbiAgICB0b1Byb2xvZyhhcmdzPzogVG9Qcm9sb2dBcmdzKTogQ2xhdXNlW10ge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMucHJlZGljYXRlLnRvUHJvbG9nKG5ld0FyZ3MpXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnN1YmplY3QudG9Qcm9sb2cobmV3QXJncylcblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmlzVW5pdmVyc2FsbHlRdWFudGlmaWVkKCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ha2VIb3JuQ2xhdXNlcyhzdWJqZWN0LCBwcmVkaWNhdGUpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVkaWNhdGUuY29uY2F0KHN1YmplY3QpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgfVxuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IHsgVG9Qcm9sb2dBcmdzLCBDbGF1c2UsIGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCBWZXJiU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvVmVyYlNlbnRlbmNlXCI7XG5pbXBvcnQgQ29tcGxlbWVudCBmcm9tIFwiLi4vcGhyYXNlcy9Db21wbGVtZW50XCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgSVZlcmIgZnJvbSBcIi4uL3Rva2Vucy9JVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50cmFuc2l0aXZlU2VudGVuY2UgaW1wbGVtZW50cyBWZXJiU2VudGVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDogTm91blBocmFzZSxcbiAgICAgICAgcmVhZG9ubHkgaXZlcmI6IElWZXJiLFxuICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGlvbj86IE5lZ2F0aW9uKSB7XG5cbiAgICB9XG5cbiAgICB0b1Byb2xvZyhhcmdzPzogVG9Qcm9sb2dBcmdzKTogQ2xhdXNlW10ge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfTtcblxuICAgICAgICByZXR1cm4gW3sgc3RyaW5nOiBgJHt0aGlzLml2ZXJiLnN0cmluZ30oJHtzdWJqZWN0SWR9KWAgfV1cbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5zdWJqZWN0LnRvUHJvbG9nKG5ld0FyZ3MpKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLmNvbXBsZW1lbnRzLmZsYXRNYXAoYz0+Yy50b1Byb2xvZyhuZXdBcmdzKSkpXG5cbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IHsgVG9Qcm9sb2dBcmdzLCBDbGF1c2UgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vdG9rZW5zL01WZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlIGltcGxlbWVudHMgVmVyYlNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgbXZlcmI6IE1WZXJiLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG9iamVjdDogTm91blBocmFzZSxcbiAgICAgICAgICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cbiAgICB0b1Byb2xvZyhhcmdzPzogVG9Qcm9sb2dBcmdzIHwgdW5kZWZpbmVkKTogQ2xhdXNlW10ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0VG9rZW4gaW1wbGVtZW50cyBUb2tlbntcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN0cmluZzpzdHJpbmcpe1xuXG4gICAgfSAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRqZWN0aXZlIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgZGVmaW5pdGVfYXJ0aWNsZXMgZnJvbSBcIi4uLy4uLy4uL3Jlcy90b2tlbnMvZGVmaW5pdGVfYXJ0aWNsZXNcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJ0aWNsZSBleHRlbmRzIEFic3RyYWN0VG9rZW57XG5cbiAgICBpc0RlZmluaXRlKCl7XG4gICAgICAgIHJldHVybiBkZWZpbml0ZV9hcnRpY2xlcy5pbmNsdWRlcyh0aGlzLnN0cmluZylcbiAgICB9XG5cbiAgICB0b1N0cmluZygpe1xuICAgICAgICByZXR1cm4gYEFydGljbGUoJHt0aGlzLnN0cmluZ30sIGlzRGVmaW5pdGU9JHt0aGlzLmlzRGVmaW5pdGUoKX0pYFxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGEgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGdWxsU3RvcCBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhWZXJiIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSVZlcmIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNVmVyYiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5lZ2F0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm91biBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXBvc2l0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICAgICBcbn0iLCJpbXBvcnQgZXhpc3RlbnRpYWxfcXVhbnRpZmllcnMgZnJvbSBcIi4uLy4uLy4uL3Jlcy90b2tlbnMvZXhpc3RlbnRpYWxfcXVhbnRpZmllcnNcIjtcbmltcG9ydCB1bml2ZXJzYWxfcXVhbnRpZmllcnMgZnJvbSBcIi4uLy4uLy4uL3Jlcy90b2tlbnMvdW5pdmVyc2FsX3F1YW50aWZpZXJzXCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVhbnRpZmllciBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG4gICAgaXNVbml2ZXJzYWwoKXtcbiAgICAgICAgcmV0dXJuIHVuaXZlcnNhbF9xdWFudGlmaWVycy5pbmNsdWRlcyh0aGlzLnN0cmluZylcbiAgICB9XG5cbiAgICBpc0V4aXN0ZW50aWFsKCl7XG4gICAgICAgIHJldHVybiBleGlzdGVudGlhbF9xdWFudGlmaWVycy5pbmNsdWRlcyh0aGlzLnN0cmluZylcbiAgICB9XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbGF0aXZlUHJvbm91biBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRoZW4gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgICBcbn0iLCJpbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BYnN0cmFjdFRva2VuXCI7XG5pbXBvcnQgTGV4ZXIsIHsgQXNzZXJ0QXJncywgQ29uc3RydWN0b3IgfSBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHRva2VuT2YgZnJvbSBcIi4vdG9rZW5PZlwiO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVye1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRva2VuczpUb2tlbltdXG4gICAgcHJvdGVjdGVkIF9wb3M6bnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOnN0cmluZyl7IFxuICAgICAgICAvL1RPRE86IHJlY29uc3RydWN0IFwiZG8gbm90XCIgYW5kIFwiZG9lcyBub3RcIiB0b2tlbnNcbiAgICAgICAgLy9UT0RPOiBub3VucyB2cyBhZGplY3RpdmVzXG4gICAgICAgIHRoaXMudG9rZW5zID0gc291cmNlQ29kZS5zcGxpdCgvXFxzK3xcXC4vKS5tYXAoZT0+IWU/Jy4nOmUpLm1hcCh0b2tlbk9mKVxuICAgICAgICB0aGlzLl9wb3MgPSAwXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogVG9rZW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cblxuXG4gICAgXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGN1cnJlbnQgdG9rZW4gaWZmIG9mIGdpdmVuIHR5cGUgYW5kIG1vdmUgdG8gbmV4dDsgXG4gICAgICogZWxzZSByZXR1cm4gdW5kZWZpbmVkIGFuZCBkb24ndCBtb3ZlLlxuICAgICAqIEBwYXJhbSBhcmdzIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIGFzc2VydCA8VD4oY2xheno6Q29uc3RydWN0b3I8VD4sIGFyZ3M6QXNzZXJ0QXJncyk6IFR8dW5kZWZpbmVkIHtcblxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5wZWVrXG5cbiAgICAgICAgaWYgKGN1cnJlbnQgaW5zdGFuY2VvZiBjbGF6eil7XG4gICAgICAgICAgICB0aGlzLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmVycm9yT3V0Pz90cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmNyb2FrKGFyZ3MuZXJyb3JNc2c/PycnKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IFRva2VuIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Ub2tlblwiXG5pbXBvcnQgRWFnZXJMZXhlciBmcm9tIFwiLi9FYWdlckxleGVyXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIExleGVye1xuICAgIG5leHQoKTp2b2lkXG4gICAgYmFja1RvKHBvczpudW1iZXIpOnZvaWRcbiAgICBnZXQgcGVlaygpOlRva2VuXG4gICAgZ2V0IHBvcygpOm51bWJlclxuICAgIGNyb2FrKGVycm9yTXNnOnN0cmluZyk6dm9pZCAgIFxuICAgIGFzc2VydCA8VD4oY2xheno6Q29uc3RydWN0b3I8VD4sIGFyZ3M6QXNzZXJ0QXJncyk6IFR8dW5kZWZpbmVkIFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzc2VydEFyZ3N7XG4gICAgZXJyb3JNc2c/OnN0cmluZ1xuICAgIGVycm9yT3V0Pzpib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlcihzb3VyY2VDb2RlOnN0cmluZyl7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUpXG59XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0gbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gVFxuIiwiaW1wb3J0IGFkamVjdGl2ZXMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9hZGplY3RpdmVzJ1xuaW1wb3J0IGluZGVmaW5pdGVfYXJ0aWNsZXMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9pbmRlZmluaXRlX2FydGljbGVzJ1xuaW1wb3J0IGRlZmluaXRlX2FydGljbGVzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvZGVmaW5pdGVfYXJ0aWNsZXMnXG5pbXBvcnQgY29wdWxhcyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2NvcHVsYXMnXG5pbXBvcnQgaHZlcmJzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvaHZlcmJzJ1xuaW1wb3J0IGl2ZXJicyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2l2ZXJicydcbmltcG9ydCBtdmVyYnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9tdmVyYnMnXG5pbXBvcnQgbmVnYXRpb25zIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvbmVnYXRpb25zJ1xuaW1wb3J0IG5vbnN1YmNvbmogZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9ub25zdWJjb25qJ1xuaW1wb3J0IG5vdW5zIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvbm91bnMnXG5pbXBvcnQgcHJlcG9zaXRpb25zIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvcHJlcG9zaXRpb25zJ1xuaW1wb3J0IGV4aXN0cXVhbnQgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9leGlzdGVudGlhbF9xdWFudGlmaWVycydcbmltcG9ydCB1bmlxdWFudCBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL3VuaXZlcnNhbF9xdWFudGlmaWVycydcbmltcG9ydCByZWxwcm9ucyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL3JlbHByb25zJ1xuaW1wb3J0IHN1YmNvbmogZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9zdWJjb25qJ1xuaW1wb3J0IHRoZW4gZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy90aGVuJ1xuaW1wb3J0IEFydGljbGUgZnJvbSAnLi4vYXN0L3Rva2Vucy9BcnRpY2xlJ1xuaW1wb3J0IENvcHVsYSBmcm9tICcuLi9hc3QvdG9rZW5zL0NvcHVsYSdcbmltcG9ydCBIVmVyYiBmcm9tICcuLi9hc3QvdG9rZW5zL0hWZXJiJ1xuaW1wb3J0IElWZXJiIGZyb20gJy4uL2FzdC90b2tlbnMvSVZlcmInXG5pbXBvcnQgTVZlcmIgZnJvbSAnLi4vYXN0L3Rva2Vucy9NVmVyYidcbmltcG9ydCBOZWdhdGlvbiBmcm9tICcuLi9hc3QvdG9rZW5zL05lZ2F0aW9uJ1xuaW1wb3J0IE5vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tICcuLi9hc3QvdG9rZW5zL05vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbidcbmltcG9ydCBQcmVwb3NpdGlvbiBmcm9tICcuLi9hc3QvdG9rZW5zL1ByZXBvc2l0aW9uJ1xuaW1wb3J0IFF1YW50aWZpZXIgZnJvbSAnLi4vYXN0L3Rva2Vucy9RdWFudGlmaWVyJ1xuaW1wb3J0IFRoZW4gZnJvbSAnLi4vYXN0L3Rva2Vucy9UaGVuJ1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tICcuLi9hc3QvdG9rZW5zL1JlbGF0aXZlUHJvbm91bidcbmltcG9ydCBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSAnLi4vYXN0L3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24nXG5pbXBvcnQgTm91biBmcm9tICcuLi9hc3QvdG9rZW5zL05vdW4nXG5pbXBvcnQgQWRqZWN0aXZlIGZyb20gJy4uL2FzdC90b2tlbnMvQWRqZWN0aXZlJ1xuaW1wb3J0IFRva2VuIGZyb20gJy4uL2FzdC9pbnRlcmZhY2VzL1Rva2VuJ1xuaW1wb3J0IEZ1bGxTdG9wIGZyb20gJy4uL2FzdC90b2tlbnMvRnVsbFN0b3AnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRva2VuT2Yoc3RyaW5nOnN0cmluZyk6VG9rZW57XG4gICAgXG4gICAgaWYgKGluZGVmaW5pdGVfYXJ0aWNsZXMuY29uY2F0KGRlZmluaXRlX2FydGljbGVzKS5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBBcnRpY2xlKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoY29wdWxhcy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGEoc3RyaW5nKVxuICAgIH1lbHNlIGlmIChodmVyYnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgSFZlcmIoc3RyaW5nKVxuICAgIH1lbHNlIGlmIChpdmVyYnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgSVZlcmIoc3RyaW5nKVxuICAgIH1lbHNlIGlmIChtdmVyYnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgTVZlcmIoc3RyaW5nKVxuICAgIH1lbHNlIGlmIChuZWdhdGlvbnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgTmVnYXRpb24oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChub25zdWJjb25qLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IE5vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKHByZXBvc2l0aW9ucy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVwb3NpdGlvbihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKGV4aXN0cXVhbnQuY29uY2F0KHVuaXF1YW50KS5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFudGlmaWVyKHN0cmluZylcbiAgICB9ZWxzZSBpZiAodGhlbi5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBUaGVuKHN0cmluZylcbiAgICB9ZWxzZSBpZiAocmVscHJvbnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgUmVsYXRpdmVQcm9ub3VuKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoc3ViY29uai5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChub3Vucy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBOb3VuKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoYWRqZWN0aXZlcy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBBZGplY3RpdmUoc3RyaW5nKVxuICAgIH1lbHNlIGlmICgnLicgPT09IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBuZXcgRnVsbFN0b3AoJy4nKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgQWRqZWN0aXZlKHN0cmluZylcbn0iLCJpbXBvcnQgQXN0IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Bc3RcIjtcbmltcG9ydCBCaW5hcnlRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQmluYXJ5UXVlc3Rpb25cIjtcbmltcG9ydCBDb21wb3VuZFNlbnRlbmNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Db21wb3VuZFNlbnRlbmNlXCI7XG5pbXBvcnQgRGVjbGFyYXRpb24gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0RlY2xhcmF0aW9uXCI7XG5pbXBvcnQgUXVlc3Rpb24gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1F1ZXN0aW9uXCI7XG5pbXBvcnQgU2ltcGxlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1NpbXBsZVNlbnRlbmNlXCI7XG5pbXBvcnQgVmVyYlNlbnRlbmNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Db21wbGVtZW50XCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vYXN0L3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IFN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IENvbXBsZXhTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db21wbGV4U2VudGVuY2VcIjtcbmltcG9ydCBDb25qdW5jdGl2ZVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0Nvbmp1bmN0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBDb3B1bGFRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db3B1bGFRdWVzdGlvblwiO1xuaW1wb3J0IENvcHVsYVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvcHVsYVNlbnRlbmNlXCI7XG5pbXBvcnQgSW50cmFuc2l0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvSW50cmFuc2l0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL01vbm90cmFuc2l0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBBZGplY3RpdmUgZnJvbSBcIi4uL2FzdC90b2tlbnMvQWRqZWN0aXZlXCI7XG5pbXBvcnQgQXJ0aWNsZSBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi9hc3QvdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IElWZXJiIGZyb20gXCIuLi9hc3QvdG9rZW5zL0lWZXJiXCI7XG5pbXBvcnQgTVZlcmIgZnJvbSBcIi4uL2FzdC90b2tlbnMvTVZlcmJcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9OZWdhdGlvblwiO1xuaW1wb3J0IE5vdW4gZnJvbSBcIi4uL2FzdC90b2tlbnMvTm91blwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL1ByZXBvc2l0aW9uXCI7XG5pbXBvcnQgUXVhbnRpZmllciBmcm9tIFwiLi4vYXN0L3Rva2Vucy9RdWFudGlmaWVyXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuaW1wb3J0IFRoZW4gZnJvbSBcIi4uL2FzdC90b2tlbnMvVGhlblwiO1xuaW1wb3J0IExleGVyLCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCI7XG5pbXBvcnQgUGFyc2VyIGZyb20gXCIuL1BhcnNlclwiO1xuaW1wb3J0IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Db3B1bGFTdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vYXN0L3Rva2Vucy9SZWxhdGl2ZVByb25vdW5cIjtcbmltcG9ydCBDb25zdGl0dWVudCBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNQYXJzZXIgaW1wbGVtZW50cyBQYXJzZXIge1xuXG4gICAgcHJvdGVjdGVkIGx4OiBMZXhlclxuXG4gICAgY29uc3RydWN0b3Ioc291cmNlQ29kZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubHggPSBnZXRMZXhlcihzb3VyY2VDb2RlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCB0cnk8VCBleHRlbmRzIEFzdD4obWV0aG9kOiAoKSA9PiBUKSB7XG5cbiAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubHgucG9zXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QoKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpXG4gICAgICAgICAgICB0aGlzLmx4LmJhY2tUbyhtZW1lbnRvKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZXJyb3JPdXQoZXJyb3JNc2c6IHN0cmluZyk6IENvbnN0aXR1ZW50IHtcbiAgICAgICAgdGhpcy5seC5jcm9hayhlcnJvck1zZylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTXNnKVxuICAgIH1cblxuICAgIHBhcnNlKCk6IENvbnN0aXR1ZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VEZWNsYXJhdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VOb3VuUGhyYXNlKSAvLyBmb3IgcXVpY2sgdG9waWMgcmVmZXJlbmNlXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VEZWNsYXJhdGlvbiA9ICgpOiBEZWNsYXJhdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29tcG91bmQpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlU2ltcGxlKSBcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlRGVjbGFyYXRpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlUXVlc3Rpb24gPSAoKTogUXVlc3Rpb24gPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUJpbmFyeVF1ZXN0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VRdWVzdGlvbigpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VTaW1wbGUgPSAoKTogU2ltcGxlU2VudGVuY2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvcHVsYVNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZVZlcmJTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlU2ltcGxlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBvdW5kID0gKCk6IENvbXBvdW5kU2VudGVuY2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvbXBsZXgpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlQ29uanVuY3RpdmUpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZUNvbXBvdW5kKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVZlcmJTZW50ZW5jZSA9ICgpOiBWZXJiU2VudGVuY2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUludHJhbnNpdGl2ZVNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVZlcmJTZW50ZW5jZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb3B1bGFTZW50ZW5jZSA9ICgpOiBDb3B1bGFTZW50ZW5jZSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IGNvcHVsYSA9IHRoaXMubHguYXNzZXJ0KENvcHVsYSwgeyBlcnJvck1zZzogJ3BhcnNlQ29wdWxhU2VudGVuY2UoKSwgZXhwZWN0ZWQgY29wdWxhJyB9KVxuICAgICAgICBjb25zdCBuZWdhdGlvbiA9IHRoaXMubHguYXNzZXJ0KE5lZ2F0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIHJldHVybiBuZXcgQ29wdWxhU2VudGVuY2Uoc3ViamVjdCwgY29wdWxhIGFzIENvcHVsYSwgcHJlZGljYXRlLCBuZWdhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wbGV4ID0gKCk6IENvbXBsZXhTZW50ZW5jZSA9PiB7XG5cbiAgICAgICAgY29uc3Qgc3ViY29uaiA9IHRoaXMubHguYXNzZXJ0KFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcblxuICAgICAgICBpZiAoc3ViY29uaikge1xuICAgICAgICAgICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICB0aGlzLmx4LmFzc2VydChUaGVuLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICAgICAgY29uc3Qgb3V0Y29tZSA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb21wbGV4U2VudGVuY2UoY29uZGl0aW9uLCBvdXRjb21lLCBzdWJjb25qKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgb3V0Y29tZSA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgY29uc3Qgc3ViY29uaiA9IHRoaXMubHguYXNzZXJ0KFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiwgeyBlcnJvck91dDogdHJ1ZSwgZXJyb3JNc2c6ICdleHBlY3RlZCBzdWJvcmRpbmF0aW5nIGNvbmp1bmN0aW9uJyB9KVxuICAgICAgICAgICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbXBsZXhTZW50ZW5jZShjb25kaXRpb24sIG91dGNvbWUsIHN1YmNvbmogYXMgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSA9ICgpOiBJbnRyYW5zaXRpdmVTZW50ZW5jZSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IG5lZ2F0aW9uID0gdGhpcy5seC5hc3NlcnQoTmVnYXRpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IGl2ZXJiID0gdGhpcy5seC5hc3NlcnQoSVZlcmIsIHsgZXJyb3JNc2c6ICdwYXJzZUludHJhbnNpdGl2ZVNlbnRlbmNlKCksIGV4cGVjdGVkIGktdmVyYicgfSlcbiAgICAgICAgY29uc3QgY29tcGxlbWVudHMgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKVxuICAgICAgICByZXR1cm4gbmV3IEludHJhbnNpdGl2ZVNlbnRlbmNlKHN1YmplY3QsIGl2ZXJiIGFzIElWZXJiLCBjb21wbGVtZW50cywgbmVnYXRpb24pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSA9ICgpOiBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgbmVnYXRpb24gPSB0aGlzLmx4LmFzc2VydChOZWdhdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgbXZlcmIgPSB0aGlzLmx4LmFzc2VydChNVmVyYiwgeyBlcnJvck1zZzogJ3BhcnNlTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSgpLCBleHBlY3RlZCBpLXZlcmInIH0pXG4gICAgICAgIGNvbnN0IGNzMSA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgY3MyID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcbiAgICAgICAgcmV0dXJuIG5ldyBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlKHN1YmplY3QsIG12ZXJiIGFzIE1WZXJiLCBvYmplY3QsIGNzMS5jb25jYXQoY3MyKSwgbmVnYXRpb24pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQmluYXJ5UXVlc3Rpb24gPSAoKTogQmluYXJ5UXVlc3Rpb24gPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvcHVsYVF1ZXN0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VCaW5hcnlRdWVzdGlvbigpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb3B1bGFRdWVzdGlvbiA9ICgpOiBDb3B1bGFRdWVzdGlvbiA9PiB7XG4gICAgICAgIGNvbnN0IGNvcHVsYSA9IHRoaXMubHguYXNzZXJ0KENvcHVsYSwgeyBlcnJvck1zZzogJ3BhcnNlQ29wdWxhUXVlc3Rpb24oKSwgZXhwZWN0ZWQgY29wdWxhJyB9KVxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIHJldHVybiBuZXcgQ29wdWxhUXVlc3Rpb24oc3ViamVjdCwgcHJlZGljYXRlLCBjb3B1bGEgYXMgQ29wdWxhKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU5vdW5QaHJhc2UgPSAoKTogTm91blBocmFzZSA9PiB7XG4gICAgICAgIGNvbnN0IHF1YW50aWZpZXIgPSB0aGlzLmx4LmFzc2VydChRdWFudGlmaWVyLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBhcnRpY2xlID0gdGhpcy5seC5hc3NlcnQoQXJ0aWNsZSwgeyBlcnJvck91dDogZmFsc2UgfSlcblxuICAgICAgICBsZXQgYWRqZWN0aXZlcyA9IFtdXG4gICAgICAgIGxldCBhZGpcblxuICAgICAgICB3aGlsZSAoYWRqID0gdGhpcy5seC5hc3NlcnQoQWRqZWN0aXZlLCB7IGVycm9yT3V0OiBmYWxzZSB9KSkge1xuICAgICAgICAgICAgYWRqZWN0aXZlcy5wdXNoKGFkailcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5vdW4gPSB0aGlzLmx4LmFzc2VydChOb3VuLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBzdWJvcmRpbmF0ZUNsYXVzZSA9IHRoaXMudHJ5KHRoaXMucGFyc2VTdWJvcmRpbmF0ZUNsYXVzZSlcbiAgICAgICAgY29uc3QgY29tcGxlbWVudHMgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKSBcblxuICAgICAgICByZXR1cm4gbmV3IE5vdW5QaHJhc2UoYWRqZWN0aXZlcywgY29tcGxlbWVudHMsIG5vdW4sIHF1YW50aWZpZXIsIGFydGljbGUsIHN1Ym9yZGluYXRlQ2xhdXNlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBsZW1lbnRzID0gKCk6IENvbXBsZW1lbnRbXSA9PiB7XG5cbiAgICAgICAgY29uc3QgY29tcGxlbWVudHMgPSBbXVxuICAgICAgICBsZXQgY29tcFxuXG4gICAgICAgIHdoaWxlIChjb21wID0gdGhpcy50cnkodGhpcy5wYXJzZUNvbXBsZW1lbnQpKSB7XG4gICAgICAgICAgICBjb21wbGVtZW50cy5wdXNoKGNvbXApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcGxlbWVudHNcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wbGVtZW50ID0gKCk6IENvbXBsZW1lbnQgPT4ge1xuICAgICAgICBjb25zdCBwcmVwb3NpdGlvbiA9IHRoaXMubHguYXNzZXJ0KFByZXBvc2l0aW9uLCB7IGVycm9yTXNnOiAncGFyc2VDb21wbGVtZW50KCkgZXhwZWN0ZWQgcHJlcG9zaXRpb24nIH0pXG4gICAgICAgIGNvbnN0IG5vdW5QaHJhc2UgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIHJldHVybiBuZXcgQ29tcGxlbWVudChwcmVwb3NpdGlvbiBhcyBQcmVwb3NpdGlvbiwgbm91blBocmFzZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VTdWJvcmRpbmF0ZUNsYXVzZSA9ICgpOiBTdWJvcmRpbmF0ZUNsYXVzZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UpIFxuICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVN1Ym9yZGluYXRlQ2xhdXNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlID0gKCk6Q29wdWxhU3Vib3JkaW5hdGVDbGF1c2UgPT57XG4gICAgICAgIGNvbnN0IHJlbHByb24gPSB0aGlzLmx4LmFzc2VydChSZWxhdGl2ZVByb25vdW4sIHtlcnJvck1zZzoncGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSgpIGV4cGVjdGVkIHJlbGF0aXZlIHByb25vdW4nfSlcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7ZXJyb3JNc2c6J3BhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UoKSBleHBlY3RlZCBjb3B1bGEnfSlcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZShyZWxwcm9uIGFzIFJlbGF0aXZlUHJvbm91biwgc3ViamVjdCwgY29wdWxhIGFzIENvcHVsYSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb25qdW5jdGl2ZSA9ICgpOiBDb25qdW5jdGl2ZVNlbnRlbmNlID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOT1QgSU1QTEVNRU5URUQhIFRPRE8hJylcbiAgICB9XG5cbn0iLCJpbXBvcnQgQXN0IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Bc3RcIjtcbmltcG9ydCBCYXNpY1BhcnNlciBmcm9tIFwiLi9CYXNpY1BhcnNlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgUGFyc2Vye1xuICAgIHBhcnNlKCk6QXN0ICAgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTpzdHJpbmcpe1xuICAgIHJldHVybiBuZXcgQmFzaWNQYXJzZXIoc291cmNlQ29kZSlcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHBsIGZyb20gJ3RhdS1wcm9sb2cnXG5pbXBvcnQgQXJ0aWNsZSBmcm9tICcuL2FzdC90b2tlbnMvQXJ0aWNsZSc7XG5pbXBvcnQgQ29wdWxhIGZyb20gJy4vYXN0L3Rva2Vucy9Db3B1bGEnO1xuaW1wb3J0IE5vdW4gZnJvbSAnLi9hc3QvdG9rZW5zL05vdW4nO1xuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tICcuL2xleGVyL0xleGVyJztcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gJy4vcGFyc2VyL1BhcnNlcic7XG5pbXBvcnQgUHJvbG9nLCB7IGdldFByb2xvZyB9IGZyb20gJy4vcHJvbG9nL1Byb2xvZyc7XG5pbXBvcnQgVGF1UHJvbG9nIGZyb20gJy4vcHJvbG9nL1RhdVByb2xvZyc7XG5cblxuLy8gUFJPTE9HIFRFU1QgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb25zdCBwcm8gPSBnZXRQcm9sb2coKTtcbi8vICh3aW5kb3cgYXMgYW55KS5wcm8gPSBwcm87XG4vLyAoYXN5bmMgKCkgPT4ge1xuLy8gICAgIGF3YWl0IHByby5hc3NlcnQoJ2NhcHJhKHNjZW1vKScpXG4vLyAgICAgYXdhaXQgcHJvLmFzc2VydCgnbWFtbWFsKHBlbG9zbyknKVxuLy8gICAgIGF3YWl0IHByby5hc3NlcnQoJ21hbW1hbChmaWRvKScpXG4vLyAgICAgYXdhaXQgcHJvLmFzc2VydCgnbWFtbWFsKFgpIDotIGNhcHJhKFgpJylcbi8vICAgICBjb25zb2xlLmxvZyhhd2FpdCBwcm8ucXVlcnkoJ21hbW1hbChYKS4nKSlcbi8vICAgICBhd2FpdCBwcm8ucmV0cmFjdCgnY2FwcmEoc2NlbW8pJylcbi8vICAgICBjb25zb2xlLmxvZyhhd2FpdCBwcm8ucXVlcnkoJ21hbW1hbChYKS4nKSlcbi8vIH0pKCk7XG4vLyAvLyAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb25zb2xlLmxvZygodG9rZW5PZignYScpIGFzIEFydGljbGUpLmlzRGVmaW5pdGUoKSlcbi8vIGNvbnNvbGUubG9nKHRva2VuT2YoJ2EnKSAgaW5zdGFuY2VvZiBBcnRpY2xlKVxuLy8gY29uc29sZS5sb2codG9rZW5PZignYScpICBpbnN0YW5jZW9mIFF1YW50aWZpZXIpXG4vLyBjb25zb2xlLmxvZyh0b2tlbk9mKCdldmVyeScpICBpbnN0YW5jZW9mIFF1YW50aWZpZXIpXG4vLyBjb25zb2xlLmxvZyh0b2tlbk9mKCdhJykudG9TdHJpbmcoKSlcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIGNvbnN0IGxleGVyID0gZ2V0TGV4ZXIoJ3RoZSBjYXQgaXMgYSBjYXQuJylcbi8vIGNvbnNvbGUubG9nKGxleGVyKVxuLy8gY29uc29sZS5sb2coJ2lzIGl0IGEgbm91bj8nLCBsZXhlci5hc3NlcnQoTm91biwge2Vycm9yT3V0OmZhbHNlfSkgKVxuLy8gY29uc29sZS5sb2cobGV4ZXIucGVlaylcbi8vIGNvbnNvbGUubG9nKCdpcyBpdCBhIGNvcHVsYT8nLCBsZXhlci5hc3NlcnQoQ29wdWxhLCB7ZXJyb3JPdXQ6ZmFsc2V9KSApXG4vLyBjb25zb2xlLmxvZyhsZXhlci5wZWVrKVxuLy8gY29uc29sZS5sb2coJ2lzIGl0IGFuIGFydGljbGU/JywgbGV4ZXIuYXNzZXJ0KEFydGljbGUsIHtlcnJvck91dDpmYWxzZX0pIClcbi8vIGNvbnNvbGUubG9nKGxleGVyLnBlZWspXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgY2F0IGlzIGJpZycpLnBhcnNlKCkpXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBiaWcgY2F0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBiaWcgY2F0IG9uIHRoZSB0YWJsZSBpcyBlYXRpbmcgdHVuYScpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgYmlnIGNhdCBvbiB0aGUgbWF0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ2V2ZXJ5IGRvZyBpcyBzdHVwaWQnKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGNhdCB0aGF0IGlzIHNtYXJ0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ25vZGVqcyBpcyBub3QgaGVscGZ1bCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCdpZiB0aGUgZG9nIGlzIHN0dXBpZCB0aGVuIHRoZSBjYXQgaXMgaGFwcHknKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGNhdCBpcyBoYXBweSBpZiB0aGUgZG9nIGlzIHN0dXBpZCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coKHdpbmRvdyBhcyBhbnkpLmFzdCA9IGdldFBhcnNlcigndGhlIGNvbG9yIG9mIHRoZSBidXR0b24gaXMgcmVkJykucGFyc2UoKSlcbi8vIGNvbnNvbGUubG9nKCh3aW5kb3cgYXMgYW55KS5hc3QgPSBnZXRQYXJzZXIoJ3RoZSBjb2xvciBvZiB0aGUgYnV0dG9uIG9uIHRoZSBibGFjayBkaXYgaXMgcmVkJykucGFyc2UoKSlcblxuZnVuY3Rpb24gdGVzdChzdHJpbmc6c3RyaW5nKXtcbiAgICBjb25zb2xlLmxvZyhzdHJpbmcpXG4gICAgY29uc29sZS5sb2coZ2V0UGFyc2VyKHN0cmluZykucGFyc2UoKS50b1Byb2xvZygpKVxufVxuXG50ZXN0KCd0aGUgY2F0IGlzIG9uIHRoZSBtYXQnKVxudGVzdCgndGhlIGNhdCB0aGF0IGlzIHJlZCBpcyBvbiB0aGUgbWF0JylcbnRlc3QoJ3RoZSBiaWcgY2F0IHRoYXQgaXMgb24gdGhlIG1hdCBpcyBibGFjaycpXG50ZXN0KCdldmVyeSBjYXQgaXMgcmVkJylcbnRlc3QoJ2V2ZXJ5IHJlZCBjYXQgaXMgb24gdGhlIG1hdCcpXG50ZXN0KCd0aGUgY2F0IGV4aXN0cyBvbiB0aGUgbWF0JylcbnRlc3QoJ2lmIHRoZSBjYXQgaXMgb24gdGhlIG1hdCB0aGVuIHRoZSBjYXQgaXMgcmVkJylcblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9