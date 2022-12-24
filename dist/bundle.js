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
    "black",
    "great"
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
    "div",
    "president",
    "trump"
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
class Complement {
    constructor(preposition, nounPhrase) {
        this.preposition = preposition;
        this.nounPhrase = nounPhrase;
    }
    toClause(args) {
        var _a, _b;
        const subjId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (() => { throw new Error('undefined subject id'); })();
        const newId = (0, Clause_1.getRandomId)();
        return (0, Clause_1.clauseOf)(this.preposition.string, subjId, newId)
            .concat(this.nounPhrase.toClause(Object.assign(Object.assign({}, args), { roles: { subject: newId } })));
    }
    get isSideEffecty() {
        return false;
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
    toClause(args) {
        var _a;
        return this.predicate.toClause(Object.assign(Object.assign({}, args), { roles: { subject: (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject } }));
    }
    get isSideEffecty() {
        return false;
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
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
class NounPhrase {
    constructor(adjectives, complements, noun, quantifier, article, subordClause) {
        this.adjectives = adjectives;
        this.complements = complements;
        this.noun = noun;
        this.quantifier = quantifier;
        this.article = article;
        this.subordClause = subordClause;
    }
    isUniQuant() {
        var _a, _b;
        return (_b = (_a = this.quantifier) === null || _a === void 0 ? void 0 : _a.isUniversal()) !== null && _b !== void 0 ? _b : false;
    }
    toClause(args) {
        var _a, _b, _c, _d;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Clause_1.getRandomId)();
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        return this
            .adjectives
            .map(a => a.string)
            .concat(this.noun ? [this.noun.string] : [])
            .map(p => (0, Clause_1.clauseOf)(p, subjectId))
            .reduce((c1, c2) => c1.concat(c2), (0, Clause_1.emptyClause)())
            .concat(this.complements.map(c => c.toClause(newArgs)).reduce((c1, c2) => c1.concat(c2), (0, Clause_1.emptyClause)()))
            .concat((_d = (_c = this.subordClause) === null || _c === void 0 ? void 0 : _c.toClause(newArgs)) !== null && _d !== void 0 ? _d : (0, Clause_1.emptyClause)());
    }
    get isSideEffecty() {
        return false;
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
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
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
    toClause(args) {
        var _a, _b;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Clause_1.getRandomId)();
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        //TODO: this is WRONG, subject of condition may NOT always be the subject of the outcome
        const condition = this.condition.toClause(newArgs);
        const outcome = this.outcome.toClause(newArgs);
        return condition.implies(outcome);
    }
    get isSideEffecty() {
        return true;
    }
}
exports["default"] = ComplexSentence;


/***/ }),

/***/ "./app/src/ast/sentences/CopulaQuestion.ts":
/*!*************************************************!*\
  !*** ./app/src/ast/sentences/CopulaQuestion.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
const CopulaSentence_1 = __importDefault(__webpack_require__(/*! ./CopulaSentence */ "./app/src/ast/sentences/CopulaSentence.ts"));
class CopulaQuestion {
    constructor(subject, predicate, copula) {
        this.subject = subject;
        this.predicate = predicate;
        this.copula = copula;
    }
    toClause(args) {
        var _a, _b;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Clause_1.getRandomId)({ asVar: this.subject.isUniQuant() });
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        //TODO: in case of a universally quantified question eg: "are all cats smart?" the prolog
        // produced should NOT be an implication, but rather a check that all cats are smart.
        return new CopulaSentence_1.default(this.subject, this.copula, this.predicate).toClause(newArgs);
    }
    get isSideEffecty() {
        return false;
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
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
class CopulaSentence {
    constructor(subject, copula, predicate, negation) {
        this.subject = subject;
        this.copula = copula;
        this.predicate = predicate;
        this.negation = negation;
    }
    toClause(args) {
        var _a, _b;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Clause_1.getRandomId)({ asVar: this.subject.isUniQuant() });
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        const subject = this.subject.toClause(newArgs);
        const predicate = this.predicate.toClause(newArgs).copy({ negate: !!this.negation });
        return this.subject.isUniQuant() ?
            subject.implies(predicate) :
            subject.concat(predicate, { asRheme: true });
    }
    get isSideEffecty() {
        return true;
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
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
class IntransitiveSentence {
    constructor(subject, iverb, complements, negation) {
        this.subject = subject;
        this.iverb = iverb;
        this.complements = complements;
        this.negation = negation;
    }
    get isSideEffecty() {
        return true;
    }
    toClause(args) {
        var _a, _b;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Clause_1.getRandomId)({ asVar: this.subject.isUniQuant() });
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        const theme = this.subject.toClause(newArgs);
        const rheme = (0, Clause_1.clauseOf)(this.iverb.string, subjectId)
            .concat(this.complements.map(c => c.toClause(newArgs)).reduce((c1, c2) => c1.concat(c2)));
        return theme.concat(rheme, { asRheme: true });
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
    get isSideEffecty() {
        return true;
    }
    toClause(args) {
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

/***/ "./app/src/clauses/BasicClause.ts":
/*!****************************************!*\
  !*** ./app/src/clauses/BasicClause.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicClause = void 0;
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/clauses/Clause.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/clauses/Imply.ts"));
const ListClause_1 = __importDefault(__webpack_require__(/*! ./ListClause */ "./app/src/clauses/ListClause.ts"));
class BasicClause {
    constructor(predicate, args, negated = false) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
    }
    concat(other, opts) {
        return new ListClause_1.default(this.flatList().concat(other.flatList()));
    }
    copy(opts) {
        return new BasicClause(this.predicate, this.args.map(a => { var _a; return (opts === null || opts === void 0 ? void 0 : opts.map) ? (_a = opts === null || opts === void 0 ? void 0 : opts.map[a]) !== null && _a !== void 0 ? _a : a : a; }), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated);
    }
    flatList() {
        return [this.copy()];
    }
    toString() {
        const core = `${this.predicate}(${this.args.reduce((a1, a2) => a1 + ', ' + a2)})`;
        return this.negated ? `not(${core})` : core;
    }
    toProlog() {
        return [this.toString()];
    }
    get entities() {
        return Array.from(new Set(this.args.concat([])));
    }
    get theme() {
        return this.copy();
    }
    get rheme() {
        return (0, Clause_1.emptyClause)();
    }
    get isImply() {
        return false;
    }
    implies(conclusion) {
        return new Imply_1.default(this.copy(), conclusion.copy());
    }
}
exports.BasicClause = BasicClause;


/***/ }),

/***/ "./app/src/clauses/Clause.ts":
/*!***********************************!*\
  !*** ./app/src/clauses/Clause.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toVar = exports.getRandomId = exports.emptyClause = exports.clauseOf = void 0;
const BasicClause_1 = __webpack_require__(/*! ./BasicClause */ "./app/src/clauses/BasicClause.ts");
const ListClause_1 = __importDefault(__webpack_require__(/*! ./ListClause */ "./app/src/clauses/ListClause.ts"));
function clauseOf(predicate, ...args) {
    return new BasicClause_1.BasicClause(predicate, args);
}
exports.clauseOf = clauseOf;
const emptyClause = () => new ListClause_1.default([]);
exports.emptyClause = emptyClause;
function getRandomId(opts) {
    return `${(opts === null || opts === void 0 ? void 0 : opts.asVar) ? 'Id' : 'id'}${parseInt(1000 * Math.random() + '')}`;
}
exports.getRandomId = getRandomId;
function toVar(id) {
    return (id + '').toUpperCase();
}
exports.toVar = toVar;


/***/ }),

/***/ "./app/src/clauses/Imply.ts":
/*!**********************************!*\
  !*** ./app/src/clauses/Imply.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const ListClause_1 = __importDefault(__webpack_require__(/*! ./ListClause */ "./app/src/clauses/ListClause.ts"));
class Imply {
    constructor(condition, conclusion, negated = false) {
        this.condition = condition;
        this.conclusion = conclusion;
        this.negated = negated;
    }
    concat(other, opts) {
        return new ListClause_1.default([this.copy(), other.copy()]);
    }
    copy(opts) {
        return new Imply(this.condition.copy(opts), this.conclusion.copy(opts), this.negated);
    }
    flatList() {
        return [this.copy()];
    }
    /**
     * Generates horn clauses, since prolog only supports that kind of implication.
     * @returns
     */
    toProlog() {
        const cond = this.condition.flatList().map(c => c);
        const conc = this.conclusion.flatList().map(c => c);
        const results = conc.map(c => `${c.toString()} :- ${cond.map(c => c.toString()).reduce((c1, c2) => c1 + ', ' + c2)}`);
        return results;
    }
    get entities() {
        return this.condition.entities.concat(this.conclusion.entities);
    }
    get theme() {
        return this.condition.theme;
    }
    get rheme() {
        return this.copy(); // dunno what I'm doin'
    }
    get isImply() {
        return true;
    }
    implies(conclusion) {
        throw new Error('not implemented!');
    }
}
exports["default"] = Imply;


/***/ }),

/***/ "./app/src/clauses/ListClause.ts":
/*!***************************************!*\
  !*** ./app/src/clauses/ListClause.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/clauses/Imply.ts"));
class ListClause {
    constructor(clauses, negated = false) {
        this.clauses = clauses;
        this.negated = negated;
    }
    concat(other, opts) {
        // TODO: this op is a little bit clumsy, consider using a simplify() method instead.
        if (opts === null || opts === void 0 ? void 0 : opts.asRheme) {
            return new ListClause([this.copy(), other.copy()]);
        }
        if (this.negated && other.negated) {
            return new ListClause([this.copy(), other.copy()]);
        }
        else if (this.negated) {
            return new ListClause([this.copy(), ...other.flatList()]);
        }
        else if (other.negated) {
            return new ListClause([...this.flatList(), other.copy()]);
        }
        else {
            return new ListClause([...this.flatList(), ...other.flatList()]);
        }
    }
    copy(opts) {
        return new ListClause(this.clauses.map(c => c.copy(opts)), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated);
    }
    toString() {
        return this.negated ? `not(${this.clauses.toString()})` : this.clauses.toString();
    }
    flatList() {
        // TODO: if I'm negated return copy of myself as a whole in a list
        // return this.negated ? [this.copy()] : this.clauses.flatMap(c => c.flatList())
        return this.clauses.flatMap(c => c.flatList());
    }
    get entities() {
        return Array.from(new Set(this.clauses.flatMap(c => c.entities)));
    }
    get theme() {
        return this.clauses[0];
    }
    get rheme() {
        return this.clauses[1];
    }
    get isImply() {
        return this.clauses.some(e => e.isImply);
    }
    implies(conclusion) {
        return new Imply_1.default(this.copy(), conclusion.copy());
    }
    toProlog() {
        return this.flatList().map(c => c.toString());
    }
}
exports["default"] = ListClause;


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
        console.debug('tokens', this.tokens);
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
        return (_c = (_b = (_a = this.try(this.parseQuestion)) !== null && _a !== void 0 ? _a : this.try(this.parseDeclaration)) !== null && _b !== void 0 ? _b : this.try(this.parseNounPhrase) // for quick topic reference
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
// COMPILER TESTS
function test(string) {
    console.log(string);
    const clause = (0, Parser_1.getParser)(string).parse().toClause().copy({ map: { 'id1': 1000, 'id2': 2000 } });
    // console.log(clause.flatList().map(c => c.toString()))
    console.log(clause.toProlog());
    // console.log(clause)
    // console.log('entities', clause.entities)
    // console.log('theme', clause.theme)
    // console.log('rheme', clause.rheme)
    // console.log(clause.about('id0'))
}
test('the cat is on the mat');
// test('the cat that is red is on the mat')
// test('the big cat that is on the mat is black')
test('every cat is red');
test('every red cat is on the mat');
// test('the cat exists on the mat')
test('if the cat is on the mat then the cat is red');
// test('the cat is not red')
test('every cat is not red');
// test('trump is not a great president'); // probably need an and predicate
// END COMPILER TESTS
// (async () => {
//     const brain = await getBrain();
//     const c = clauseOf('capra', 'uno')
//         .concat(clauseOf('capra', 2))
//         .concat(clauseOf('capra', 3))
//         .concat(clauseOf('white', 3))
//         .concat(clauseOf('cat', 4))
//         .concat(clauseOf('white', 4))
//     await brain.assert(c);
//     console.log(await brain.query(clauseOf('white', 'X').concat(clauseOf('cat', 'X'))))
// })()
// (async () => {
//     const state = {
//         timer : setTimeout(()=>{},0),
//         brain : await getBrain(),
//         debouncingTime : 0
//     }
//     const p = document.createElement('p')
//     document.getElementById('root')?.appendChild(p)
//     const textarea = document.createElement('textarea')
//     textarea.style.height = '50vh'
//     textarea.style.width = '50vw'
//     document.getElementById('root')?.appendChild(textarea)
//     const onInput = async () => {
//         const text = textarea.value
//         const ast = getParser(text).parse()
//         const clause = ast.toProlog()
//         if (!clause){
//             return 
//         }
//         const mapping = getSandbox(clause).mapTo(state.brain)
//         p.innerHTML = `${(ast as any).constructor.name}: ${clause.toString()}`
//         if (ast instanceof CopulaQuestion){
//             console.log(await state.brain.query(clause))
//         }else{
//             console.log('asserted:', clause.toString())
//         }
//     }
//     textarea.oninput = e => {
//         clearTimeout(state.timer)
//         state.timer = setTimeout(()=>{
//             onInput()
//         }, state.debouncingTime)
//     }
// })();
// (async () => {
//     const prolog = await getBrain();
//     (window as any).prolog = prolog
//     await prolog.assert(clauseOf('cat', 'a'))
//     await prolog.assert(clauseOf('cat', 'b'))
//     await prolog.assert(clauseOf('cat', 'c'))
//     await prolog.assert(clauseOf('white', 'a'))
//     await prolog.assert(clauseOf('dog', 'd'))
//     await prolog.assert(clauseOf('eat', 'a', 'rabbit'))
//     await prolog.assert(clauseOf('eat', 'a', 'mouse'))
//     await prolog.assert(clauseOf('eat', 'a', 'birdie'))
//     await prolog.assert(clauseOf('eat', 'd', 'bone'))
//     await prolog.assert(clauseOf('table', 'tb1'))
//     // const res = await prolog.query(clauseOf('cat', 'X').concat(clauseOf('eat', 'X', 'Y').concat(clauseOf('dog', 'Z'))))
//     // const clause = clauseOf('cat', 'id0').concat(clauseOf('dog', 'id1')).concat(clauseOf('capra', 'id55')) 
//     // const clause = getParser('the cat that is black is smart').parse().toProlog()
//     const clause = getParser('the cat that is white is on the table').parse().toProlog()
//     console.log(clause.toString())
//     const res = await getSandbox(clause).mapTo(prolog)
//     console.log(res)
//     console.log(clause.rheme.copy({ map: res }).toString())
// })();
// (async () => {
//     const brain = await getBrain()
//     const button = document.createElement('button')
//     button.innerText = 'run'
//     document.getElementById('root')?.appendChild(button)
//     const parag = document.createElement('p')
//     document.getElementById('root')?.appendChild(parag)
//     const textarea = document.createElement('textarea')
//     textarea.style.height = '50vh'
//     textarea.style.width = '50vw'
//     document.getElementById('root')?.appendChild(textarea)
//     button.onclick = async e => {
//         console.log(await brain.execute(textarea.value))
//     }
// })();
// prologPlay()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUN0QyxnREFBZ0Q7QUFDaEQsZ0RBQWdEO0FBQ2hELGdEQUFnRDtBQUNoRCxrREFBa0Q7QUFDbEQsZ0RBQWdEO0FBRWhELDBEQUEwRDtBQUMxRCx5REFBeUQ7QUFDekQsMERBQTBEO0FBQzFELHdEQUF3RDtBQUV4RCxvREFBb0Q7QUFFcEQsNkhBQTZIO0FBQzdILGlIQUFpSDtBQUNqSCx1RkFBdUY7QUFDdkYsMkZBQTJGO0FBQzNGLHFDQUFxQztBQUVyQyx5REFBeUQ7QUFDekQsdUJBQXVCO0FBQ3ZCLDhEQUE4RDtBQUU5RCxRQUFRO0FBSVIsaUJBQWlCO0FBQ2pCLHFDQUFxQztBQUVyQyxzREFBc0Q7QUFDdEQsK0JBQStCO0FBQy9CLDJEQUEyRDtBQUUzRCxnREFBZ0Q7QUFDaEQsMERBQTBEO0FBRTFELDBEQUEwRDtBQUMxRCxxQ0FBcUM7QUFDckMsb0NBQW9DO0FBQ3BDLDZEQUE2RDtBQUU3RCxvQ0FBb0M7QUFDcEMsMkRBQTJEO0FBQzNELFFBQVE7QUFFUixRQUFRO0FBR1IsZUFBZSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2FkamVjdGl2ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvY29wdWxhcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9kZWZpbml0ZV9hcnRpY2xlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9leGlzdGVudGlhbF9xdWFudGlmaWVycy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9odmVyYnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvaW5kZWZpbml0ZV9hcnRpY2xlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9pdmVyYnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvbXZlcmJzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL25lZ2F0aW9ucy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9ub25zdWJjb25qLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL25vdW5zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3ByZXBvc2l0aW9ucy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9yZWxwcm9ucy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9zdWJjb25qLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3RoZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvdW5pdmVyc2FsX3F1YW50aWZpZXJzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3BocmFzZXMvQ29tcGxlbWVudC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9waHJhc2VzL0NvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3BocmFzZXMvTm91blBocmFzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvQ29tcGxleFNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Db3B1bGFRdWVzdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvQ29wdWxhU2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0ludHJhbnNpdGl2ZVNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Nb25vdHJhbnNpdGl2ZVNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9BYnN0cmFjdFRva2VuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9BZGplY3RpdmUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0FydGljbGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0NvcHVsYS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvRnVsbFN0b3AudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0hWZXJiLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9JVmVyYi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTVZlcmIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL05lZ2F0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9Ob25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL05vdW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1ByZXBvc2l0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9RdWFudGlmaWVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9SZWxhdGl2ZVByb25vdW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvVGhlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0xpc3RDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9sZXhlci90b2tlbk9mLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvcGFyc2VyL0Jhc2ljUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvcGFyc2VyL1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJiaWdcIixcbiAgICBcInNtYWxsXCIsXG4gICAgXCJoZWxwZnVsXCIsXG4gICAgXCJyZWRcIixcbiAgICBcImJsYWNrXCIsXG4gICAgXCJncmVhdFwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiaXNcIixcbiAgICBcImFyZVwiLFxuICAgIFwiYmVcIlxuXSIsImV4cG9ydCBkZWZhdWx0W1xuICAgIFwidGhlXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJzb21lXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJkb1wiLFxuICAgIFwiZG9lc1wiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiYVwiLFxuICAgIFwiYW5cIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImV4aXN0XCIsXG4gICAgXCJleGlzdHNcIixcbiAgICBcInJ1blwiLFxuICAgIFwiZ3Jvd1wiLFxuICAgIFwiZGllXCIsXG4gICAgXCJsaXZlXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJlYXRcIixcbiAgICBcImRyaW5rXCIsXG4gICAgXCJ3YXRjaFwiLFxuICAgIFwibWFrZVwiLFxuICAgIFwiaGl0XCIsXG4gICAgXCJjbGlja1wiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiZG9lc24ndFwiLFxuICAgIFwiZG9lcyBub3RcIixcbiAgICAnbm90JyxcbiAgICBcImRvbid0XCIsXG4gICAgJ2RvIG5vdCdcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJhbmRcIixcbiAgICBcIm9yXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJjYXRcIixcbiAgICBcIm1hdFwiLFxuICAgIFwidGFibGVcIixcbiAgICBcImRvZ1wiLFxuICAgIFwibm9kZWpzXCIsXG4gICAgXCJjb2xvclwiLFxuICAgIFwiYnV0dG9uXCIsXG4gICAgXCJkaXZcIixcbiAgICBcInByZXNpZGVudFwiLFxuICAgIFwidHJ1bXBcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcInRvXCIsXG4gICAgXCJ3aXRoXCIsXG4gICAgXCJmcm9tXCIsXG4gICAgXCJvZlwiLFxuICAgIFwib3ZlclwiLFxuICAgIFwib25cIixcbiAgICBcImF0XCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJ0aGF0XCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJpZlwiLFxuICAgIFwid2hlblwiLFxuICAgIFwiYmVjYXVzZVwiLFxuICAgIFwid2hpbGVcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcInRoZW5cIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImV2ZXJ5XCIsXG4gICAgXCJhbGxcIixcbiAgICBcImVhY2hcIlxuXSIsImltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBnZXRSYW5kb21JZCwgSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBQaHJhc2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvUGhyYXNlXCI7XG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSBcIi4uL3Rva2Vucy9QcmVwb3NpdGlvblwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4vTm91blBocmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wbGVtZW50IGltcGxlbWVudHMgUGhyYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHByZXBvc2l0aW9uOiBQcmVwb3NpdGlvbiwgcmVhZG9ubHkgbm91blBocmFzZTogTm91blBocmFzZSkge1xuXG4gICAgfVxuXG4gICAgdG9DbGF1c2UoYXJncz86IFRvUHJvbG9nQXJncyk6IENsYXVzZSB7IC8vIHByZXBvc2l0aW9uKGFyZ3Muc3ViamVjdCwgWSkgKyBub3VucGhyYXNlLnRvUHJvbG9nKHN1YmplY3Q9WSlcblxuICAgICAgICBjb25zdCBzdWJqSWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyAoKCk6IElkID0+IHsgdGhyb3cgbmV3IEVycm9yKCd1bmRlZmluZWQgc3ViamVjdCBpZCcpIH0pKClcbiAgICAgICAgY29uc3QgbmV3SWQgPSBnZXRSYW5kb21JZCgpXG5cbiAgICAgICAgcmV0dXJuIGNsYXVzZU9mKHRoaXMucHJlcG9zaXRpb24uc3RyaW5nLCBzdWJqSWQsIG5ld0lkKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLm5vdW5QaHJhc2UudG9DbGF1c2UoeyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBuZXdJZCB9IH0pKVxuXG4gICAgfVxuXG4gICAgZ2V0IGlzU2lkZUVmZmVjdHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxufSIsImltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4vTm91blBocmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSBpbXBsZW1lbnRzIFN1Ym9yZGluYXRlQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJlbHByb246IFJlbGF0aXZlUHJvbm91biwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSkge1xuXG4gICAgfVxuXG4gICAgdG9DbGF1c2UoYXJncz86IFRvUHJvbG9nQXJncyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS50b0NsYXVzZSh7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IGFyZ3M/LnJvbGVzPy5zdWJqZWN0IH0gfSlcbiAgICB9XG5cbiAgICBnZXQgaXNTaWRlRWZmZWN0eSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG59IiwiaW1wb3J0IFBocmFzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9QaHJhc2VcIjtcbmltcG9ydCBBZGplY3RpdmUgZnJvbSBcIi4uL3Rva2Vucy9BZGplY3RpdmVcIjtcbmltcG9ydCBBcnRpY2xlIGZyb20gXCIuLi90b2tlbnMvQXJ0aWNsZVwiO1xuaW1wb3J0IE5vdW4gZnJvbSBcIi4uL3Rva2Vucy9Ob3VuXCI7XG5pbXBvcnQgUXVhbnRpZmllciBmcm9tIFwiLi4vdG9rZW5zL1F1YW50aWZpZXJcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IHsgVG9Qcm9sb2dBcmdzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgZ2V0UmFuZG9tSWQsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3VuUGhyYXNlIGltcGxlbWVudHMgUGhyYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGFkamVjdGl2ZXM6IEFkamVjdGl2ZVtdLFxuICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICByZWFkb25seSBub3VuPzogTm91bixcbiAgICAgICAgcmVhZG9ubHkgcXVhbnRpZmllcj86IFF1YW50aWZpZXIsXG4gICAgICAgIHJlYWRvbmx5IGFydGljbGU/OiBBcnRpY2xlLFxuICAgICAgICByZWFkb25seSBzdWJvcmRDbGF1c2U/OiBTdWJvcmRpbmF0ZUNsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgaXNVbmlRdWFudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVhbnRpZmllcj8uaXNVbml2ZXJzYWwoKSA/PyBmYWxzZVxuICAgIH1cblxuICAgIHRvQ2xhdXNlKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2Uge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAuYWRqZWN0aXZlc1xuICAgICAgICAgICAgLm1hcChhID0+IGEuc3RyaW5nKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLm5vdW4gPyBbdGhpcy5ub3VuLnN0cmluZ10gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihwLCBzdWJqZWN0SWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5jb25jYXQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLmNvbXBsZW1lbnRzLm1hcChjID0+IGMudG9DbGF1c2UobmV3QXJncykpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5jb25jYXQoYzIpLCBlbXB0eUNsYXVzZSgpKSlcbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5zdWJvcmRDbGF1c2U/LnRvQ2xhdXNlKG5ld0FyZ3MpID8/IGVtcHR5Q2xhdXNlKCkpXG5cbiAgICB9XG5cbiAgICBnZXQgaXNTaWRlRWZmZWN0eSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG59IiwiaW1wb3J0IENvbXBvdW5kU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29tcG91bmRTZW50ZW5jZVwiO1xuaW1wb3J0IHsgVG9Qcm9sb2dBcmdzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TaW1wbGVTZW50ZW5jZVwiO1xuaW1wb3J0IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tIFwiLi4vdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuXG4vKipcbiAqIEEgc2VudGVuY2UgdGhhdCByZWxhdGVzIHR3byBzaW1wbGUgc2VudGVuY2VzIGh5cG90YWN0aWNhbGx5LCBpbiBhIFxuICogY29uZGl0aW9uLW91dGNvbWUgcmVsYXRpb25zaGlwLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wbGV4U2VudGVuY2UgaW1wbGVtZW50cyBDb21wb3VuZFNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogU2ltcGxlU2VudGVuY2UsXG4gICAgICAgIHJlYWRvbmx5IG91dGNvbWU6IFNpbXBsZVNlbnRlbmNlLFxuICAgICAgICByZWFkb25seSBzdWJjb25qOiBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24pIHtcblxuICAgIH1cblxuICAgIHRvQ2xhdXNlKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2Uge1xuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICAvL1RPRE86IHRoaXMgaXMgV1JPTkcsIHN1YmplY3Qgb2YgY29uZGl0aW9uIG1heSBOT1QgYWx3YXlzIGJlIHRoZSBzdWJqZWN0IG9mIHRoZSBvdXRjb21lXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuY29uZGl0aW9uLnRvQ2xhdXNlKG5ld0FyZ3MpXG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLm91dGNvbWUudG9DbGF1c2UobmV3QXJncylcblxuICAgICAgICByZXR1cm4gY29uZGl0aW9uLmltcGxpZXMob3V0Y29tZSlcbiAgICB9XG5cbiAgICBnZXQgaXNTaWRlRWZmZWN0eSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgQmluYXJ5UXVlc3Rpb24gZnJvbSBcIi4uL2ludGVyZmFjZXMvQmluYXJ5UXVlc3Rpb25cIjtcbmltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UsIGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgQ29wdWxhU2VudGVuY2UgZnJvbSBcIi4vQ29wdWxhU2VudGVuY2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhUXVlc3Rpb24gaW1wbGVtZW50cyBCaW5hcnlRdWVzdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLCByZWFkb25seSBwcmVkaWNhdGU6IE5vdW5QaHJhc2UsIHJlYWRvbmx5IGNvcHVsYTogQ29wdWxhKSB7XG5cbiAgICB9XG5cbiAgICB0b0NsYXVzZShhcmdzPzogVG9Qcm9sb2dBcmdzKTogQ2xhdXNlIHtcblxuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCh7IGFzVmFyOiB0aGlzLnN1YmplY3QuaXNVbmlRdWFudCgpIH0pXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICAvL1RPRE86IGluIGNhc2Ugb2YgYSB1bml2ZXJzYWxseSBxdWFudGlmaWVkIHF1ZXN0aW9uIGVnOiBcImFyZSBhbGwgY2F0cyBzbWFydD9cIiB0aGUgcHJvbG9nXG4gICAgICAgIC8vIHByb2R1Y2VkIHNob3VsZCBOT1QgYmUgYW4gaW1wbGljYXRpb24sIGJ1dCByYXRoZXIgYSBjaGVjayB0aGF0IGFsbCBjYXRzIGFyZSBzbWFydC5cblxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVNlbnRlbmNlKHRoaXMuc3ViamVjdCwgdGhpcy5jb3B1bGEsIHRoaXMucHJlZGljYXRlKS50b0NsYXVzZShuZXdBcmdzKVxuXG4gICAgfVxuXG4gICAgZ2V0IGlzU2lkZUVmZmVjdHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxufSIsImltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UsIGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgU2ltcGxlU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU2ltcGxlU2VudGVuY2VcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vdG9rZW5zL05lZ2F0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYVNlbnRlbmNlIGltcGxlbWVudHMgU2ltcGxlU2VudGVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDogTm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOiBDb3B1bGEsIHJlYWRvbmx5IHByZWRpY2F0ZTogTm91blBocmFzZSwgcmVhZG9ubHkgbmVnYXRpb24/OiBOZWdhdGlvbikge1xuXG4gICAgfVxuXG4gICAgdG9DbGF1c2UoYXJncz86IFRvUHJvbG9nQXJncyk6IENsYXVzZSB7XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoeyBhc1ZhcjogdGhpcy5zdWJqZWN0LmlzVW5pUXVhbnQoKSB9KVxuICAgICAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMuc3ViamVjdC50b0NsYXVzZShuZXdBcmdzKVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLnByZWRpY2F0ZS50b0NsYXVzZShuZXdBcmdzKS5jb3B5KHsgbmVnYXRlOiAhIXRoaXMubmVnYXRpb24gfSlcblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmlzVW5pUXVhbnQoKSA/XG4gICAgICAgICAgICBzdWJqZWN0LmltcGxpZXMocHJlZGljYXRlKSA6XG4gICAgICAgICAgICBzdWJqZWN0LmNvbmNhdChwcmVkaWNhdGUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuXG4gICAgfVxuXG4gICAgZ2V0IGlzU2lkZUVmZmVjdHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVG9Qcm9sb2dBcmdzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgVmVyYlNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1ZlcmJTZW50ZW5jZVwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4uL3BocmFzZXMvQ29tcGxlbWVudFwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IElWZXJiIGZyb20gXCIuLi90b2tlbnMvSVZlcmJcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vdG9rZW5zL05lZ2F0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludHJhbnNpdGl2ZVNlbnRlbmNlIGltcGxlbWVudHMgVmVyYlNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgIHJlYWRvbmx5IGl2ZXJiOiBJVmVyYixcbiAgICAgICAgcmVhZG9ubHkgY29tcGxlbWVudHM6IENvbXBsZW1lbnRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRpb24/OiBOZWdhdGlvbikge1xuXG4gICAgfVxuXG4gICAgZ2V0IGlzU2lkZUVmZmVjdHkoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgdG9DbGF1c2UoYXJncz86IFRvUHJvbG9nQXJncyk6IENsYXVzZSB7XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoeyBhc1ZhcjogdGhpcy5zdWJqZWN0LmlzVW5pUXVhbnQoKSB9KVxuICAgICAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG5cbiAgICAgICAgY29uc3QgdGhlbWUgPSB0aGlzLnN1YmplY3QudG9DbGF1c2UobmV3QXJncylcbiAgICAgICAgY29uc3QgcmhlbWUgPSBjbGF1c2VPZih0aGlzLml2ZXJiLnN0cmluZywgc3ViamVjdElkKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLmNvbXBsZW1lbnRzLm1hcChjID0+IGMudG9DbGF1c2UobmV3QXJncykpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5jb25jYXQoYzIpKSlcblxuICAgICAgICByZXR1cm4gdGhlbWUuY29uY2F0KHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSlcbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IHsgVG9Qcm9sb2dBcmdzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vdG9rZW5zL01WZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlIGltcGxlbWVudHMgVmVyYlNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgbXZlcmI6IE1WZXJiLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG9iamVjdDogTm91blBocmFzZSxcbiAgICAgICAgICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cbiAgICBcbiAgICBnZXQgaXNTaWRlRWZmZWN0eSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgXG4gICAgdG9DbGF1c2UoYXJncz86IFRvUHJvbG9nQXJncyB8IHVuZGVmaW5lZCk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RUb2tlbiBpbXBsZW1lbnRzIFRva2Vue1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3RyaW5nOnN0cmluZyl7XG5cbiAgICB9ICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGplY3RpdmUgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBkZWZpbml0ZV9hcnRpY2xlcyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy9kZWZpbml0ZV9hcnRpY2xlc1wiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnRpY2xlIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcblxuICAgIGlzRGVmaW5pdGUoKXtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRlX2FydGljbGVzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7XG4gICAgICAgIHJldHVybiBgQXJ0aWNsZSgke3RoaXMuc3RyaW5nfSwgaXNEZWZpbml0ZT0ke3RoaXMuaXNEZWZpbml0ZSgpfSlgXG4gICAgfVxuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYSBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ1bGxTdG9wIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFZlcmIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJVmVyYiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1WZXJiIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmVnYXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3VuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlcG9zaXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgICAgIFxufSIsImltcG9ydCBleGlzdGVudGlhbF9xdWFudGlmaWVycyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy9leGlzdGVudGlhbF9xdWFudGlmaWVyc1wiO1xuaW1wb3J0IHVuaXZlcnNhbF9xdWFudGlmaWVycyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy91bml2ZXJzYWxfcXVhbnRpZmllcnNcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWFudGlmaWVyIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbiAgICBpc1VuaXZlcnNhbCgpe1xuICAgICAgICByZXR1cm4gdW5pdmVyc2FsX3F1YW50aWZpZXJzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cblxuICAgIGlzRXhpc3RlbnRpYWwoKXtcbiAgICAgICAgcmV0dXJuIGV4aXN0ZW50aWFsX3F1YW50aWZpZXJzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVsYXRpdmVQcm9ub3VuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGhlbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgIFxufSIsImltcG9ydCB7IENsYXVzZSwgQ29uY2F0T3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlLCBJZCB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgTGlzdENsYXVzZSBmcm9tIFwiLi9MaXN0Q2xhdXNlXCI7XG5cblxuZXhwb3J0IGNsYXNzIEJhc2ljQ2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHByZWRpY2F0ZTogc3RyaW5nLCByZWFkb25seSBhcmdzOiBJZFtdLCByZWFkb25seSBuZWdhdGVkID0gZmFsc2UpIHtcblxuICAgIH1cblxuICAgIGNvbmNhdChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQ29uY2F0T3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgTGlzdENsYXVzZSh0aGlzLmZsYXRMaXN0KCkuY29uY2F0KG90aGVyLmZsYXRMaXN0KCkpKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQmFzaWNDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHRoaXMucHJlZGljYXRlLCB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwID8gb3B0cz8ubWFwW2FdID8/IGEgOiBhKSwgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZClcbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5jb3B5KCldXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IGNvcmUgPSBgJHt0aGlzLnByZWRpY2F0ZX0oJHt0aGlzLmFyZ3MucmVkdWNlKChhMSwgYTIpID0+IGExICsgJywgJyArIGEyKX0pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke2NvcmV9KWAgOiBjb3JlXG4gICAgfVxuXG4gICAgdG9Qcm9sb2coKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gW3RoaXMudG9TdHJpbmcoKV1cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQodGhpcy5hcmdzLmNvbmNhdChbXSkpKVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KClcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICBnZXQgaXNJbXBseSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMuY29weSgpLCBjb25jbHVzaW9uLmNvcHkoKSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuL0Jhc2ljQ2xhdXNlXCJcbmltcG9ydCBMaXN0Q2xhdXNlIGZyb20gXCIuL0xpc3RDbGF1c2VcIlxuXG5leHBvcnQgdHlwZSBJZCA9IG51bWJlciB8IHN0cmluZ1xuXG4vKipcbiAqIEEgJ2xhbmd1YWdlLWFnbm9zdGljJyBmaXJzdCBvcmRlciBsb2dpYyByZXByZXNlbnRhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuICAgIGNvbmNhdChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQ29uY2F0T3B0cyk6IENsYXVzZVxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICByZWFkb25seSBuZWdhdGVkOiBib29sZWFuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW11cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZVxuICAgIGdldCBpc0ltcGx5KCk6Ym9vbGVhblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjpDbGF1c2UpOkNsYXVzZVxuICAgIHRvUHJvbG9nKCk6c3RyaW5nW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHByZWRpY2F0ZTogc3RyaW5nLCAuLi5hcmdzOiBJZFtdKSB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZSA9ICgpOiBDbGF1c2UgPT4gbmV3IExpc3RDbGF1c2UoW10pXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG5lZ2F0ZT86IGJvb2xlYW5cbiAgICBtYXA/OiBNYXBcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb25jYXRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFJhbmRvbUlkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbUlkKG9wdHM/OiBHZXRSYW5kb21JZE9wdHMpOiBJZCB7IC8vIFRPRE86IGhpZ2hlciBjb25zdCBmb3IgcHJvZHVjdGlvbiB0byBhdm9pZCBjb2xsaXNpb25zXG4gICAgcmV0dXJuIGAke29wdHM/LmFzVmFyPyAnSWQnIDogJ2lkJ30ke3BhcnNlSW50KDEwMDAgKiBNYXRoLnJhbmRvbSgpICsgJycpfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOklkKTpJZHtcbiAgICByZXR1cm4gKGlkKycnKS50b1VwcGVyQ2FzZSgpXG59XG5cbi8qKlxuICogTWFwcGluZyBhbnkgZ2l2ZW4gaWQgaW4gdGhlIHNhbmRib3ggdG8gYW4gaWQgaW4gdGhlIFxuICogbGFyZ2VyIHVuaXZlcnNlLlxuICovXG5leHBvcnQgdHlwZSBNYXAgPSB7IFthOiBJZF06IElkIH0iLCJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuL0Jhc2ljQ2xhdXNlXCI7XG5pbXBvcnQgeyBDbGF1c2UsIENvbmNhdE9wdHMsIENvcHlPcHRzLCBJZCB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IExpc3RDbGF1c2UgZnJvbSBcIi4vTGlzdENsYXVzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25kaXRpb246IENsYXVzZSwgcmVhZG9ubHkgY29uY2x1c2lvbjogQ2xhdXNlLCByZWFkb25seSBuZWdhdGVkID0gZmFsc2UpIHtcblxuICAgIH1cblxuICAgIGNvbmNhdChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQ29uY2F0T3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgTGlzdENsYXVzZShbdGhpcy5jb3B5KCksIG90aGVyLmNvcHkoKV0pXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMuY29uZGl0aW9uLmNvcHkob3B0cyksIHRoaXMuY29uY2x1c2lvbi5jb3B5KG9wdHMpLCB0aGlzLm5lZ2F0ZWQpXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXMuY29weSgpXVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBob3JuIGNsYXVzZXMsIHNpbmNlIHByb2xvZyBvbmx5IHN1cHBvcnRzIHRoYXQga2luZCBvZiBpbXBsaWNhdGlvbi5cbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICB0b1Byb2xvZygpOiBzdHJpbmdbXSB7XG5cbiAgICAgICAgY29uc3QgY29uZCA9IHRoaXMuY29uZGl0aW9uLmZsYXRMaXN0KCkubWFwKGMgPT4gKGMgYXMgQmFzaWNDbGF1c2UpKVxuICAgICAgICBjb25zdCBjb25jID0gdGhpcy5jb25jbHVzaW9uLmZsYXRMaXN0KCkubWFwKGMgPT4gKGMgYXMgQmFzaWNDbGF1c2UpKVxuICAgICAgICBjb25zdCByZXN1bHRzID0gY29uYy5tYXAoYyA9PiBgJHtjLnRvU3RyaW5nKCl9IDotICR7Y29uZC5tYXAoYyA9PiBjLnRvU3RyaW5nKCkpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMSArICcsICcgKyBjMil9YClcblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNvbmNsdXNpb24uZW50aXRpZXMpXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi50aGVtZVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KCkgLy8gZHVubm8gd2hhdCBJJ20gZG9pbidcbiAgICB9XG5cbiAgICBnZXQgaXNJbXBseSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBDb25jYXRPcHRzLCBDb3B5T3B0cywgSWQgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXN0Q2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZXM6IENsYXVzZVtdLCByZWFkb25seSBuZWdhdGVkID0gZmFsc2UpIHtcblxuICAgIH1cblxuICAgIGNvbmNhdChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQ29uY2F0T3B0cyk6IENsYXVzZSB7XG5cbiAgICAgICAgLy8gVE9ETzogdGhpcyBvcCBpcyBhIGxpdHRsZSBiaXQgY2x1bXN5LCBjb25zaWRlciB1c2luZyBhIHNpbXBsaWZ5KCkgbWV0aG9kIGluc3RlYWQuXG5cbiAgICAgICAgaWYgKG9wdHM/LmFzUmhlbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGlzdENsYXVzZShbdGhpcy5jb3B5KCksIG90aGVyLmNvcHkoKV0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5uZWdhdGVkICYmIG90aGVyLm5lZ2F0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGlzdENsYXVzZShbdGhpcy5jb3B5KCksIG90aGVyLmNvcHkoKV0pXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5uZWdhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RDbGF1c2UoW3RoaXMuY29weSgpLCAuLi5vdGhlci5mbGF0TGlzdCgpXSlcbiAgICAgICAgfSBlbHNlIGlmIChvdGhlci5uZWdhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RDbGF1c2UoWy4uLnRoaXMuZmxhdExpc3QoKSwgb3RoZXIuY29weSgpXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGlzdENsYXVzZShbLi4udGhpcy5mbGF0TGlzdCgpLCAuLi5vdGhlci5mbGF0TGlzdCgpXSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBMaXN0Q2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBMaXN0Q2xhdXNlKHRoaXMuY2xhdXNlcy5tYXAoYyA9PiBjLmNvcHkob3B0cykpLCBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3RoaXMuY2xhdXNlcy50b1N0cmluZygpfSlgIDogdGhpcy5jbGF1c2VzLnRvU3RyaW5nKClcbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIC8vIFRPRE86IGlmIEknbSBuZWdhdGVkIHJldHVybiBjb3B5IG9mIG15c2VsZiBhcyBhIHdob2xlIGluIGEgbGlzdFxuICAgICAgICAvLyByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXMuY29weSgpXSA6IHRoaXMuY2xhdXNlcy5mbGF0TWFwKGMgPT4gYy5mbGF0TGlzdCgpKVxuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2VzLmZsYXRNYXAoYyA9PiBjLmZsYXRMaXN0KCkpXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KHRoaXMuY2xhdXNlcy5mbGF0TWFwKGMgPT4gYy5lbnRpdGllcykpKVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2VzWzBdXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZXNbMV1cbiAgICB9XG5cbiAgICBnZXQgaXNJbXBseSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlcy5zb21lKGU9PmUuaXNJbXBseSlcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcy5jb3B5KCksIGNvbmNsdXNpb24uY29weSgpKVxuICAgIH1cblxuICAgIHRvUHJvbG9nKCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxhdExpc3QoKS5tYXAoYz0+Yy50b1N0cmluZygpKVxuICAgIH1cbn0iLCJpbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BYnN0cmFjdFRva2VuXCI7XG5pbXBvcnQgTGV4ZXIsIHsgQXNzZXJ0QXJncywgQ29uc3RydWN0b3IgfSBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHRva2VuT2YgZnJvbSBcIi4vdG9rZW5PZlwiO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVye1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRva2VuczpUb2tlbltdXG4gICAgcHJvdGVjdGVkIF9wb3M6bnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOnN0cmluZyl7IFxuICAgICAgICAvL1RPRE86IHJlY29uc3RydWN0IFwiZG8gbm90XCIgYW5kIFwiZG9lcyBub3RcIiB0b2tlbnNcbiAgICAgICAgLy9UT0RPOiBub3VucyB2cyBhZGplY3RpdmVzXG4gICAgICAgIHRoaXMudG9rZW5zID0gc291cmNlQ29kZS5zcGxpdCgvXFxzK3xcXC4vKS5tYXAoZT0+IWU/Jy4nOmUpLm1hcCh0b2tlbk9mKVxuICAgICAgICBjb25zb2xlLmRlYnVnKCd0b2tlbnMnLCB0aGlzLnRva2VucylcbiAgICAgICAgdGhpcy5fcG9zID0gMFxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IFRva2VuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuX3Bvc11cbiAgICB9XG5cbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1zZ30gYXQgJHt0aGlzLl9wb3N9YCk7XG4gICAgfVxuXG5cblxuICAgIFxuICAgIC8qKlxuICAgICAqIFJldHVybiBjdXJyZW50IHRva2VuIGlmZiBvZiBnaXZlbiB0eXBlIGFuZCBtb3ZlIHRvIG5leHQ7IFxuICAgICAqIGVsc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgZG9uJ3QgbW92ZS5cbiAgICAgKiBAcGFyYW0gYXJncyBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBhc3NlcnQgPFQ+KGNsYXp6OkNvbnN0cnVjdG9yPFQ+LCBhcmdzOkFzc2VydEFyZ3MpOiBUfHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMucGVla1xuXG4gICAgICAgIGlmIChjdXJyZW50IGluc3RhbmNlb2YgY2xhenope1xuICAgICAgICAgICAgdGhpcy5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5lcnJvck91dD8/dHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcm9hayhhcmdzLmVycm9yTXNnPz8nJylcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsImltcG9ydCBUb2tlbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlcntcbiAgICBuZXh0KCk6dm9pZFxuICAgIGJhY2tUbyhwb3M6bnVtYmVyKTp2b2lkXG4gICAgZ2V0IHBlZWsoKTpUb2tlblxuICAgIGdldCBwb3MoKTpudW1iZXJcbiAgICBjcm9hayhlcnJvck1zZzpzdHJpbmcpOnZvaWQgICBcbiAgICBhc3NlcnQgPFQ+KGNsYXp6OkNvbnN0cnVjdG9yPFQ+LCBhcmdzOkFzc2VydEFyZ3MpOiBUfHVuZGVmaW5lZCBcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3NlcnRBcmdze1xuICAgIGVycm9yTXNnPzpzdHJpbmdcbiAgICBlcnJvck91dD86Ym9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZXIoc291cmNlQ29kZTpzdHJpbmcpe1xuICAgIHJldHVybiBuZXcgRWFnZXJMZXhlcihzb3VyY2VDb2RlKVxufVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IG5ldyAoLi4uYXJnczogYW55W10pID0+IFRcbiIsImltcG9ydCBhZGplY3RpdmVzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvYWRqZWN0aXZlcydcbmltcG9ydCBpbmRlZmluaXRlX2FydGljbGVzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvaW5kZWZpbml0ZV9hcnRpY2xlcydcbmltcG9ydCBkZWZpbml0ZV9hcnRpY2xlcyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2RlZmluaXRlX2FydGljbGVzJ1xuaW1wb3J0IGNvcHVsYXMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9jb3B1bGFzJ1xuaW1wb3J0IGh2ZXJicyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2h2ZXJicydcbmltcG9ydCBpdmVyYnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9pdmVyYnMnXG5pbXBvcnQgbXZlcmJzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvbXZlcmJzJ1xuaW1wb3J0IG5lZ2F0aW9ucyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL25lZ2F0aW9ucydcbmltcG9ydCBub25zdWJjb25qIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvbm9uc3ViY29uaidcbmltcG9ydCBub3VucyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL25vdW5zJ1xuaW1wb3J0IHByZXBvc2l0aW9ucyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL3ByZXBvc2l0aW9ucydcbmltcG9ydCBleGlzdHF1YW50IGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvZXhpc3RlbnRpYWxfcXVhbnRpZmllcnMnXG5pbXBvcnQgdW5pcXVhbnQgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy91bml2ZXJzYWxfcXVhbnRpZmllcnMnXG5pbXBvcnQgcmVscHJvbnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9yZWxwcm9ucydcbmltcG9ydCBzdWJjb25qIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvc3ViY29uaidcbmltcG9ydCB0aGVuIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvdGhlbidcbmltcG9ydCBBcnRpY2xlIGZyb20gJy4uL2FzdC90b2tlbnMvQXJ0aWNsZSdcbmltcG9ydCBDb3B1bGEgZnJvbSAnLi4vYXN0L3Rva2Vucy9Db3B1bGEnXG5pbXBvcnQgSFZlcmIgZnJvbSAnLi4vYXN0L3Rva2Vucy9IVmVyYidcbmltcG9ydCBJVmVyYiBmcm9tICcuLi9hc3QvdG9rZW5zL0lWZXJiJ1xuaW1wb3J0IE1WZXJiIGZyb20gJy4uL2FzdC90b2tlbnMvTVZlcmInXG5pbXBvcnQgTmVnYXRpb24gZnJvbSAnLi4vYXN0L3Rva2Vucy9OZWdhdGlvbidcbmltcG9ydCBOb25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSAnLi4vYXN0L3Rva2Vucy9Ob25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24nXG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSAnLi4vYXN0L3Rva2Vucy9QcmVwb3NpdGlvbidcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gJy4uL2FzdC90b2tlbnMvUXVhbnRpZmllcidcbmltcG9ydCBUaGVuIGZyb20gJy4uL2FzdC90b2tlbnMvVGhlbidcbmltcG9ydCBSZWxhdGl2ZVByb25vdW4gZnJvbSAnLi4vYXN0L3Rva2Vucy9SZWxhdGl2ZVByb25vdW4nXG5pbXBvcnQgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gJy4uL2FzdC90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uJ1xuaW1wb3J0IE5vdW4gZnJvbSAnLi4vYXN0L3Rva2Vucy9Ob3VuJ1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tICcuLi9hc3QvdG9rZW5zL0FkamVjdGl2ZSdcbmltcG9ydCBUb2tlbiBmcm9tICcuLi9hc3QvaW50ZXJmYWNlcy9Ub2tlbidcbmltcG9ydCBGdWxsU3RvcCBmcm9tICcuLi9hc3QvdG9rZW5zL0Z1bGxTdG9wJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b2tlbk9mKHN0cmluZzpzdHJpbmcpOlRva2Vue1xuICAgIFxuICAgIGlmIChpbmRlZmluaXRlX2FydGljbGVzLmNvbmNhdChkZWZpbml0ZV9hcnRpY2xlcykuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgQXJ0aWNsZShzdHJpbmcpXG4gICAgfWVsc2UgaWYgKGNvcHVsYXMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgQ29wdWxhKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoaHZlcmJzLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IEhWZXJiKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoaXZlcmJzLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IElWZXJiKHN0cmluZylcbiAgICB9ZWxzZSBpZiAobXZlcmJzLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IE1WZXJiKHN0cmluZylcbiAgICB9ZWxzZSBpZiAobmVnYXRpb25zLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IE5lZ2F0aW9uKHN0cmluZylcbiAgICB9ZWxzZSBpZiAobm9uc3ViY29uai5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBOb25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChwcmVwb3NpdGlvbnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgUHJlcG9zaXRpb24oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChleGlzdHF1YW50LmNvbmNhdCh1bmlxdWFudCkuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgUXVhbnRpZmllcihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKHRoZW4uaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgVGhlbihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKHJlbHByb25zLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IFJlbGF0aXZlUHJvbm91bihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKHN1YmNvbmouaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uKHN0cmluZylcbiAgICB9ZWxzZSBpZiAobm91bnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgTm91bihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKGFkamVjdGl2ZXMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgQWRqZWN0aXZlKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoJy4nID09PSBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gbmV3IEZ1bGxTdG9wKCcuJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEFkamVjdGl2ZShzdHJpbmcpXG59IiwiaW1wb3J0IEFzdCBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQXN0XCI7XG5pbXBvcnQgQmluYXJ5UXVlc3Rpb24gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0JpbmFyeVF1ZXN0aW9uXCI7XG5pbXBvcnQgQ29tcG91bmRTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQ29tcG91bmRTZW50ZW5jZVwiO1xuaW1wb3J0IERlY2xhcmF0aW9uIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9EZWNsYXJhdGlvblwiO1xuaW1wb3J0IFF1ZXN0aW9uIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9RdWVzdGlvblwiO1xuaW1wb3J0IFNpbXBsZVNlbnRlbmNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9TaW1wbGVTZW50ZW5jZVwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVmVyYlNlbnRlbmNlXCI7XG5pbXBvcnQgQ29tcGxlbWVudCBmcm9tIFwiLi4vYXN0L3BocmFzZXMvQ29tcGxlbWVudFwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL2FzdC9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvU3Vib3JkaW5hdGVDbGF1c2VcIjtcbmltcG9ydCBDb21wbGV4U2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29tcGxleFNlbnRlbmNlXCI7XG5pbXBvcnQgQ29uanVuY3RpdmVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db25qdW5jdGl2ZVNlbnRlbmNlXCI7XG5pbXBvcnQgQ29wdWxhUXVlc3Rpb24gZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29wdWxhUXVlc3Rpb25cIjtcbmltcG9ydCBDb3B1bGFTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db3B1bGFTZW50ZW5jZVwiO1xuaW1wb3J0IEludHJhbnNpdGl2ZVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0ludHJhbnNpdGl2ZVNlbnRlbmNlXCI7XG5pbXBvcnQgTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Nb25vdHJhbnNpdGl2ZVNlbnRlbmNlXCI7XG5pbXBvcnQgQWRqZWN0aXZlIGZyb20gXCIuLi9hc3QvdG9rZW5zL0FkamVjdGl2ZVwiO1xuaW1wb3J0IEFydGljbGUgZnJvbSBcIi4uL2FzdC90b2tlbnMvQXJ0aWNsZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vYXN0L3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBJVmVyYiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9JVmVyYlwiO1xuaW1wb3J0IE1WZXJiIGZyb20gXCIuLi9hc3QvdG9rZW5zL01WZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvTmVnYXRpb25cIjtcbmltcG9ydCBOb3VuIGZyb20gXCIuLi9hc3QvdG9rZW5zL05vdW5cIjtcbmltcG9ydCBQcmVwb3NpdGlvbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9QcmVwb3NpdGlvblwiO1xuaW1wb3J0IFF1YW50aWZpZXIgZnJvbSBcIi4uL2FzdC90b2tlbnMvUXVhbnRpZmllclwiO1xuaW1wb3J0IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25cIjtcbmltcG9ydCBUaGVuIGZyb20gXCIuLi9hc3QvdG9rZW5zL1RoZW5cIjtcbmltcG9ydCBMZXhlciwgeyBnZXRMZXhlciB9IGZyb20gXCIuLi9sZXhlci9MZXhlclwiO1xuaW1wb3J0IFBhcnNlciBmcm9tIFwiLi9QYXJzZXJcIjtcbmltcG9ydCBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vYXN0L3BocmFzZXMvQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2VcIjtcbmltcG9ydCBSZWxhdGl2ZVByb25vdW4gZnJvbSBcIi4uL2FzdC90b2tlbnMvUmVsYXRpdmVQcm9ub3VuXCI7XG5pbXBvcnQgQ29uc3RpdHVlbnQgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIHByb3RlY3RlZCBseDogTGV4ZXJcblxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZUNvZGU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmx4ID0gZ2V0TGV4ZXIoc291cmNlQ29kZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdHJ5PFQgZXh0ZW5kcyBBc3Q+KG1ldGhvZDogKCkgPT4gVCkge1xuXG4gICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmx4LnBvc1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kKClcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKVxuICAgICAgICAgICAgdGhpcy5seC5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGVycm9yT3V0KGVycm9yTXNnOiBzdHJpbmcpOiBDb25zdGl0dWVudCB7XG4gICAgICAgIHRoaXMubHguY3JvYWsoZXJyb3JNc2cpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1zZylcbiAgICB9XG5cbiAgICBwYXJzZSgpOiBDb25zdGl0dWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlUXVlc3Rpb24pIFxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZURlY2xhcmF0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZU5vdW5QaHJhc2UpIC8vIGZvciBxdWljayB0b3BpYyByZWZlcmVuY2VcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZURlY2xhcmF0aW9uID0gKCk6IERlY2xhcmF0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb21wb3VuZClcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VTaW1wbGUpIFxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VEZWNsYXJhdGlvbigpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VRdWVzdGlvbiA9ICgpOiBRdWVzdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQmluYXJ5UXVlc3Rpb24pXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVF1ZXN0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVNpbXBsZSA9ICgpOiBTaW1wbGVTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlVmVyYlNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VTaW1wbGUoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG91bmQgPSAoKTogQ29tcG91bmRTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29tcGxleClcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VDb25qdW5jdGl2ZSlcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlQ29tcG91bmQoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlVmVyYlNlbnRlbmNlID0gKCk6IFZlcmJTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlVmVyYlNlbnRlbmNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVNlbnRlbmNlID0gKCk6IENvcHVsYVNlbnRlbmNlID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7IGVycm9yTXNnOiAncGFyc2VDb3B1bGFTZW50ZW5jZSgpLCBleHBlY3RlZCBjb3B1bGEnIH0pXG4gICAgICAgIGNvbnN0IG5lZ2F0aW9uID0gdGhpcy5seC5hc3NlcnQoTmVnYXRpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFTZW50ZW5jZShzdWJqZWN0LCBjb3B1bGEgYXMgQ29wdWxhLCBwcmVkaWNhdGUsIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBsZXggPSAoKTogQ29tcGxleFNlbnRlbmNlID0+IHtcblxuICAgICAgICBjb25zdCBzdWJjb25qID0gdGhpcy5seC5hc3NlcnQoU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuXG4gICAgICAgIGlmIChzdWJjb25qKSB7XG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHRoaXMubHguYXNzZXJ0KFRoZW4sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgICAgICBjb25zdCBvdXRjb21lID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbXBsZXhTZW50ZW5jZShjb25kaXRpb24sIG91dGNvbWUsIHN1YmNvbmopXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBvdXRjb21lID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICBjb25zdCBzdWJjb25qID0gdGhpcy5seC5hc3NlcnQoU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLCB7IGVycm9yT3V0OiB0cnVlLCBlcnJvck1zZzogJ2V4cGVjdGVkIHN1Ym9yZGluYXRpbmcgY29uanVuY3Rpb24nIH0pXG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29tcGxleFNlbnRlbmNlKGNvbmRpdGlvbiwgb3V0Y29tZSwgc3ViY29uaiBhcyBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUludHJhbnNpdGl2ZVNlbnRlbmNlID0gKCk6IEludHJhbnNpdGl2ZVNlbnRlbmNlID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgbmVnYXRpb24gPSB0aGlzLmx4LmFzc2VydChOZWdhdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgaXZlcmIgPSB0aGlzLmx4LmFzc2VydChJVmVyYiwgeyBlcnJvck1zZzogJ3BhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UoKSwgZXhwZWN0ZWQgaS12ZXJiJyB9KVxuICAgICAgICBjb25zdCBjb21wbGVtZW50cyA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG4gICAgICAgIHJldHVybiBuZXcgSW50cmFuc2l0aXZlU2VudGVuY2Uoc3ViamVjdCwgaXZlcmIgYXMgSVZlcmIsIGNvbXBsZW1lbnRzLCBuZWdhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlID0gKCk6IE1vbm90cmFuc2l0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBuZWdhdGlvbiA9IHRoaXMubHguYXNzZXJ0KE5lZ2F0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBtdmVyYiA9IHRoaXMubHguYXNzZXJ0KE1WZXJiLCB7IGVycm9yTXNnOiAncGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlKCksIGV4cGVjdGVkIGktdmVyYicgfSlcbiAgICAgICAgY29uc3QgY3MxID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBjczIgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKVxuICAgICAgICByZXR1cm4gbmV3IE1vbm90cmFuc2l0aXZlU2VudGVuY2Uoc3ViamVjdCwgbXZlcmIgYXMgTVZlcmIsIG9iamVjdCwgY3MxLmNvbmNhdChjczIpLCBuZWdhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VCaW5hcnlRdWVzdGlvbiA9ICgpOiBCaW5hcnlRdWVzdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhUXVlc3Rpb24pXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZUJpbmFyeVF1ZXN0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVF1ZXN0aW9uID0gKCk6IENvcHVsYVF1ZXN0aW9uID0+IHtcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7IGVycm9yTXNnOiAncGFyc2VDb3B1bGFRdWVzdGlvbigpLCBleHBlY3RlZCBjb3B1bGEnIH0pXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFRdWVzdGlvbihzdWJqZWN0LCBwcmVkaWNhdGUsIGNvcHVsYSBhcyBDb3B1bGEpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTm91blBocmFzZSA9ICgpOiBOb3VuUGhyYXNlID0+IHtcbiAgICAgICAgY29uc3QgcXVhbnRpZmllciA9IHRoaXMubHguYXNzZXJ0KFF1YW50aWZpZXIsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IGFydGljbGUgPSB0aGlzLmx4LmFzc2VydChBcnRpY2xlLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuXG4gICAgICAgIGxldCBhZGplY3RpdmVzID0gW11cbiAgICAgICAgbGV0IGFkalxuXG4gICAgICAgIHdoaWxlIChhZGogPSB0aGlzLmx4LmFzc2VydChBZGplY3RpdmUsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pKSB7XG4gICAgICAgICAgICBhZGplY3RpdmVzLnB1c2goYWRqKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgbm91biA9IHRoaXMubHguYXNzZXJ0KE5vdW4sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IHN1Ym9yZGluYXRlQ2xhdXNlID0gdGhpcy50cnkodGhpcy5wYXJzZVN1Ym9yZGluYXRlQ2xhdXNlKVxuICAgICAgICBjb25zdCBjb21wbGVtZW50cyA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpIFxuXG4gICAgICAgIHJldHVybiBuZXcgTm91blBocmFzZShhZGplY3RpdmVzLCBjb21wbGVtZW50cywgbm91biwgcXVhbnRpZmllciwgYXJ0aWNsZSwgc3Vib3JkaW5hdGVDbGF1c2UpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcGxlbWVudHMgPSAoKTogQ29tcGxlbWVudFtdID0+IHtcblxuICAgICAgICBjb25zdCBjb21wbGVtZW50cyA9IFtdXG4gICAgICAgIGxldCBjb21wXG5cbiAgICAgICAgd2hpbGUgKGNvbXAgPSB0aGlzLnRyeSh0aGlzLnBhcnNlQ29tcGxlbWVudCkpIHtcbiAgICAgICAgICAgIGNvbXBsZW1lbnRzLnB1c2goY29tcClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb21wbGVtZW50c1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBsZW1lbnQgPSAoKTogQ29tcGxlbWVudCA9PiB7XG4gICAgICAgIGNvbnN0IHByZXBvc2l0aW9uID0gdGhpcy5seC5hc3NlcnQoUHJlcG9zaXRpb24sIHsgZXJyb3JNc2c6ICdwYXJzZUNvbXBsZW1lbnQoKSBleHBlY3RlZCBwcmVwb3NpdGlvbicgfSlcbiAgICAgICAgY29uc3Qgbm91blBocmFzZSA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb21wbGVtZW50KHByZXBvc2l0aW9uIGFzIFByZXBvc2l0aW9uLCBub3VuUGhyYXNlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVN1Ym9yZGluYXRlQ2xhdXNlID0gKCk6IFN1Ym9yZGluYXRlQ2xhdXNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSkgXG4gICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlU3Vib3JkaW5hdGVDbGF1c2UoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UgPSAoKTpDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSA9PntcbiAgICAgICAgY29uc3QgcmVscHJvbiA9IHRoaXMubHguYXNzZXJ0KFJlbGF0aXZlUHJvbm91biwge2Vycm9yTXNnOidwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKCkgZXhwZWN0ZWQgcmVsYXRpdmUgcHJvbm91bid9KVxuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHtlcnJvck1zZzoncGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSgpIGV4cGVjdGVkIGNvcHVsYSd9KVxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKHJlbHByb24gYXMgUmVsYXRpdmVQcm9ub3VuLCBzdWJqZWN0LCBjb3B1bGEgYXMgQ29wdWxhKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbmp1bmN0aXZlID0gKCk6IENvbmp1bmN0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05PVCBJTVBMRU1FTlRFRCEgVE9ETyEnKVxuICAgIH1cblxufSIsImltcG9ydCBBc3QgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0FzdFwiO1xuaW1wb3J0IEJhc2ljUGFyc2VyIGZyb20gXCIuL0Jhc2ljUGFyc2VyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBQYXJzZXJ7XG4gICAgcGFyc2UoKTpBc3QgICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOnN0cmluZyl7XG4gICAgcmV0dXJuIG5ldyBCYXNpY1BhcnNlcihzb3VyY2VDb2RlKVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgcGwsIHsgZm9ybWF0X2Fuc3dlciB9IGZyb20gJ3RhdS1wcm9sb2cnXG5pbXBvcnQgTm91blBocmFzZSBmcm9tICcuL2FzdC9waHJhc2VzL05vdW5QaHJhc2UnO1xuaW1wb3J0IENvcHVsYVF1ZXN0aW9uIGZyb20gJy4vYXN0L3NlbnRlbmNlcy9Db3B1bGFRdWVzdGlvbic7XG5pbXBvcnQgQXJ0aWNsZSBmcm9tICcuL2FzdC90b2tlbnMvQXJ0aWNsZSc7XG5pbXBvcnQgQ29wdWxhIGZyb20gJy4vYXN0L3Rva2Vucy9Db3B1bGEnO1xuaW1wb3J0IE5vdW4gZnJvbSAnLi9hc3QvdG9rZW5zL05vdW4nO1xuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tICcuL2JyYWluL0JyYWluJztcbmltcG9ydCB7IGdldFNhbmRib3ggfSBmcm9tICcuL2JyYWluL1NhbmRib3gnO1xuaW1wb3J0IHsgQmFzaWNDbGF1c2UgfSBmcm9tICcuL2NsYXVzZXMvQmFzaWNDbGF1c2UnO1xuaW1wb3J0IHsgY2xhdXNlT2YgfSBmcm9tICcuL2NsYXVzZXMvQ2xhdXNlJztcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSAnLi9sZXhlci9MZXhlcic7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tICcuL3BhcnNlci9QYXJzZXInO1xuaW1wb3J0IFByb2xvZywgeyBnZXRQcm9sb2cgfSBmcm9tICcuL3Byb2xvZy9Qcm9sb2cnO1xuaW1wb3J0IFRhdVByb2xvZyBmcm9tICcuL3Byb2xvZy9UYXVQcm9sb2cnO1xuaW1wb3J0IHByb2xvZ1BsYXkgZnJvbSAnLi90ZXN0cy9wcm9sb2ctcGxheWdyb3VuZCc7XG5cblxuLy8gUFJPTE9HIFRFU1QgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb25zdCBwcm8gPSBnZXRQcm9sb2coKTtcbi8vICh3aW5kb3cgYXMgYW55KS5wcm8gPSBwcm87XG4vLyAoYXN5bmMgKCkgPT4ge1xuLy8gICAgIGF3YWl0IHByby5hc3NlcnQoJ2NhcHJhKHNjZW1vKScpXG4vLyAgICAgYXdhaXQgcHJvLmFzc2VydCgnbWFtbWFsKHBlbG9zbyknKVxuLy8gICAgIGF3YWl0IHByby5hc3NlcnQoJ21hbW1hbChmaWRvKScpXG4vLyAgICAgYXdhaXQgcHJvLmFzc2VydCgnbWFtbWFsKFgpIDotIGNhcHJhKFgpJylcbi8vICAgICBjb25zb2xlLmxvZyhhd2FpdCBwcm8ucXVlcnkoJ21hbW1hbChYKS4nKSlcbi8vICAgICBhd2FpdCBwcm8ucmV0cmFjdCgnY2FwcmEoc2NlbW8pJylcbi8vICAgICBjb25zb2xlLmxvZyhhd2FpdCBwcm8ucXVlcnkoJ21hbW1hbChYKS4nKSlcbi8vIH0pKCk7XG4vLyAvLyAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb25zb2xlLmxvZygodG9rZW5PZignYScpIGFzIEFydGljbGUpLmlzRGVmaW5pdGUoKSlcbi8vIGNvbnNvbGUubG9nKHRva2VuT2YoJ2EnKSAgaW5zdGFuY2VvZiBBcnRpY2xlKVxuLy8gY29uc29sZS5sb2codG9rZW5PZignYScpICBpbnN0YW5jZW9mIFF1YW50aWZpZXIpXG4vLyBjb25zb2xlLmxvZyh0b2tlbk9mKCdldmVyeScpICBpbnN0YW5jZW9mIFF1YW50aWZpZXIpXG4vLyBjb25zb2xlLmxvZyh0b2tlbk9mKCdhJykudG9TdHJpbmcoKSlcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIGNvbnN0IGxleGVyID0gZ2V0TGV4ZXIoJ3RoZSBjYXQgaXMgYSBjYXQuJylcbi8vIGNvbnNvbGUubG9nKGxleGVyKVxuLy8gY29uc29sZS5sb2coJ2lzIGl0IGEgbm91bj8nLCBsZXhlci5hc3NlcnQoTm91biwge2Vycm9yT3V0OmZhbHNlfSkgKVxuLy8gY29uc29sZS5sb2cobGV4ZXIucGVlaylcbi8vIGNvbnNvbGUubG9nKCdpcyBpdCBhIGNvcHVsYT8nLCBsZXhlci5hc3NlcnQoQ29wdWxhLCB7ZXJyb3JPdXQ6ZmFsc2V9KSApXG4vLyBjb25zb2xlLmxvZyhsZXhlci5wZWVrKVxuLy8gY29uc29sZS5sb2coJ2lzIGl0IGFuIGFydGljbGU/JywgbGV4ZXIuYXNzZXJ0KEFydGljbGUsIHtlcnJvck91dDpmYWxzZX0pIClcbi8vIGNvbnNvbGUubG9nKGxleGVyLnBlZWspXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgY2F0IGlzIGJpZycpLnBhcnNlKCkpXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBiaWcgY2F0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBiaWcgY2F0IG9uIHRoZSB0YWJsZSBpcyBlYXRpbmcgdHVuYScpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgYmlnIGNhdCBvbiB0aGUgbWF0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ2V2ZXJ5IGRvZyBpcyBzdHVwaWQnKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGNhdCB0aGF0IGlzIHNtYXJ0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ25vZGVqcyBpcyBub3QgaGVscGZ1bCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCdpZiB0aGUgZG9nIGlzIHN0dXBpZCB0aGVuIHRoZSBjYXQgaXMgaGFwcHknKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGNhdCBpcyBoYXBweSBpZiB0aGUgZG9nIGlzIHN0dXBpZCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coKHdpbmRvdyBhcyBhbnkpLmFzdCA9IGdldFBhcnNlcigndGhlIGNvbG9yIG9mIHRoZSBidXR0b24gaXMgcmVkJykucGFyc2UoKSlcbi8vIGNvbnNvbGUubG9nKCh3aW5kb3cgYXMgYW55KS5hc3QgPSBnZXRQYXJzZXIoJ3RoZSBjb2xvciBvZiB0aGUgYnV0dG9uIG9uIHRoZSBibGFjayBkaXYgaXMgcmVkJykucGFyc2UoKSlcblxuLy8gQ09NUElMRVIgVEVTVFNcbmZ1bmN0aW9uIHRlc3Qoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZyhzdHJpbmcpXG4gICAgY29uc3QgY2xhdXNlID0gZ2V0UGFyc2VyKHN0cmluZykucGFyc2UoKS50b0NsYXVzZSgpLmNvcHkoeyBtYXA6IHsgJ2lkMSc6IDEwMDAsICdpZDInOiAyMDAwIH0gfSlcbiAgICAvLyBjb25zb2xlLmxvZyhjbGF1c2UuZmxhdExpc3QoKS5tYXAoYyA9PiBjLnRvU3RyaW5nKCkpKVxuICAgIGNvbnNvbGUubG9nKGNsYXVzZS50b1Byb2xvZygpKVxuICAgIC8vIGNvbnNvbGUubG9nKGNsYXVzZSlcbiAgICAvLyBjb25zb2xlLmxvZygnZW50aXRpZXMnLCBjbGF1c2UuZW50aXRpZXMpXG4gICAgLy8gY29uc29sZS5sb2coJ3RoZW1lJywgY2xhdXNlLnRoZW1lKVxuICAgIC8vIGNvbnNvbGUubG9nKCdyaGVtZScsIGNsYXVzZS5yaGVtZSlcbiAgICAvLyBjb25zb2xlLmxvZyhjbGF1c2UuYWJvdXQoJ2lkMCcpKVxufVxuXG50ZXN0KCd0aGUgY2F0IGlzIG9uIHRoZSBtYXQnKVxuLy8gdGVzdCgndGhlIGNhdCB0aGF0IGlzIHJlZCBpcyBvbiB0aGUgbWF0Jylcbi8vIHRlc3QoJ3RoZSBiaWcgY2F0IHRoYXQgaXMgb24gdGhlIG1hdCBpcyBibGFjaycpXG50ZXN0KCdldmVyeSBjYXQgaXMgcmVkJylcbnRlc3QoJ2V2ZXJ5IHJlZCBjYXQgaXMgb24gdGhlIG1hdCcpXG4vLyB0ZXN0KCd0aGUgY2F0IGV4aXN0cyBvbiB0aGUgbWF0JylcbnRlc3QoJ2lmIHRoZSBjYXQgaXMgb24gdGhlIG1hdCB0aGVuIHRoZSBjYXQgaXMgcmVkJylcbi8vIHRlc3QoJ3RoZSBjYXQgaXMgbm90IHJlZCcpXG50ZXN0KCdldmVyeSBjYXQgaXMgbm90IHJlZCcpXG4vLyB0ZXN0KCd0cnVtcCBpcyBub3QgYSBncmVhdCBwcmVzaWRlbnQnKTsgLy8gcHJvYmFibHkgbmVlZCBhbiBhbmQgcHJlZGljYXRlXG5cbi8vIEVORCBDT01QSUxFUiBURVNUU1xuXG5cbi8vIChhc3luYyAoKSA9PiB7XG4vLyAgICAgY29uc3QgYnJhaW4gPSBhd2FpdCBnZXRCcmFpbigpO1xuLy8gICAgIGNvbnN0IGMgPSBjbGF1c2VPZignY2FwcmEnLCAndW5vJylcbi8vICAgICAgICAgLmNvbmNhdChjbGF1c2VPZignY2FwcmEnLCAyKSlcbi8vICAgICAgICAgLmNvbmNhdChjbGF1c2VPZignY2FwcmEnLCAzKSlcbi8vICAgICAgICAgLmNvbmNhdChjbGF1c2VPZignd2hpdGUnLCAzKSlcbi8vICAgICAgICAgLmNvbmNhdChjbGF1c2VPZignY2F0JywgNCkpXG4vLyAgICAgICAgIC5jb25jYXQoY2xhdXNlT2YoJ3doaXRlJywgNCkpXG5cbi8vICAgICBhd2FpdCBicmFpbi5hc3NlcnQoYyk7XG4vLyAgICAgY29uc29sZS5sb2coYXdhaXQgYnJhaW4ucXVlcnkoY2xhdXNlT2YoJ3doaXRlJywgJ1gnKS5jb25jYXQoY2xhdXNlT2YoJ2NhdCcsICdYJykpKSlcbi8vIH0pKClcblxuLy8gKGFzeW5jICgpID0+IHtcblxuLy8gICAgIGNvbnN0IHN0YXRlID0ge1xuLy8gICAgICAgICB0aW1lciA6IHNldFRpbWVvdXQoKCk9Pnt9LDApLFxuLy8gICAgICAgICBicmFpbiA6IGF3YWl0IGdldEJyYWluKCksXG4vLyAgICAgICAgIGRlYm91bmNpbmdUaW1lIDogMFxuLy8gICAgIH1cblxuLy8gICAgIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbi8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpPy5hcHBlbmRDaGlsZChwKVxuXG4vLyAgICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4vLyAgICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzUwdmgnXG4vLyAgICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNTB2dydcblxuLy8gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk/LmFwcGVuZENoaWxkKHRleHRhcmVhKVxuXG4vLyAgICAgY29uc3Qgb25JbnB1dCA9IGFzeW5jICgpID0+IHtcbi8vICAgICAgICAgY29uc3QgdGV4dCA9IHRleHRhcmVhLnZhbHVlXG4vLyAgICAgICAgIGNvbnN0IGFzdCA9IGdldFBhcnNlcih0ZXh0KS5wYXJzZSgpXG4vLyAgICAgICAgIGNvbnN0IGNsYXVzZSA9IGFzdC50b1Byb2xvZygpXG5cbi8vICAgICAgICAgaWYgKCFjbGF1c2Upe1xuLy8gICAgICAgICAgICAgcmV0dXJuIFxuLy8gICAgICAgICB9XG5cbi8vICAgICAgICAgY29uc3QgbWFwcGluZyA9IGdldFNhbmRib3goY2xhdXNlKS5tYXBUbyhzdGF0ZS5icmFpbilcblxuXG4vLyAgICAgICAgIHAuaW5uZXJIVE1MID0gYCR7KGFzdCBhcyBhbnkpLmNvbnN0cnVjdG9yLm5hbWV9OiAke2NsYXVzZS50b1N0cmluZygpfWBcblxuLy8gICAgICAgICBpZiAoYXN0IGluc3RhbmNlb2YgQ29wdWxhUXVlc3Rpb24pe1xuLy8gICAgICAgICAgICAgY29uc29sZS5sb2coYXdhaXQgc3RhdGUuYnJhaW4ucXVlcnkoY2xhdXNlKSlcbi8vICAgICAgICAgfWVsc2V7XG4vLyAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXNzZXJ0ZWQ6JywgY2xhdXNlLnRvU3RyaW5nKCkpXG4vLyAgICAgICAgIH1cblxuLy8gICAgIH1cblxuLy8gICAgIHRleHRhcmVhLm9uaW5wdXQgPSBlID0+IHtcbi8vICAgICAgICAgY2xlYXJUaW1lb3V0KHN0YXRlLnRpbWVyKVxuLy8gICAgICAgICBzdGF0ZS50aW1lciA9IHNldFRpbWVvdXQoKCk9Pntcbi8vICAgICAgICAgICAgIG9uSW5wdXQoKVxuLy8gICAgICAgICB9LCBzdGF0ZS5kZWJvdW5jaW5nVGltZSlcbi8vICAgICB9XG5cbi8vIH0pKCk7XG5cblxuXG4vLyAoYXN5bmMgKCkgPT4ge1xuXG4vLyAgICAgY29uc3QgcHJvbG9nID0gYXdhaXQgZ2V0QnJhaW4oKTtcbi8vICAgICAod2luZG93IGFzIGFueSkucHJvbG9nID0gcHJvbG9nXG4vLyAgICAgYXdhaXQgcHJvbG9nLmFzc2VydChjbGF1c2VPZignY2F0JywgJ2EnKSlcbi8vICAgICBhd2FpdCBwcm9sb2cuYXNzZXJ0KGNsYXVzZU9mKCdjYXQnLCAnYicpKVxuLy8gICAgIGF3YWl0IHByb2xvZy5hc3NlcnQoY2xhdXNlT2YoJ2NhdCcsICdjJykpXG4vLyAgICAgYXdhaXQgcHJvbG9nLmFzc2VydChjbGF1c2VPZignd2hpdGUnLCAnYScpKVxuLy8gICAgIGF3YWl0IHByb2xvZy5hc3NlcnQoY2xhdXNlT2YoJ2RvZycsICdkJykpXG5cbi8vICAgICBhd2FpdCBwcm9sb2cuYXNzZXJ0KGNsYXVzZU9mKCdlYXQnLCAnYScsICdyYWJiaXQnKSlcbi8vICAgICBhd2FpdCBwcm9sb2cuYXNzZXJ0KGNsYXVzZU9mKCdlYXQnLCAnYScsICdtb3VzZScpKVxuLy8gICAgIGF3YWl0IHByb2xvZy5hc3NlcnQoY2xhdXNlT2YoJ2VhdCcsICdhJywgJ2JpcmRpZScpKVxuLy8gICAgIGF3YWl0IHByb2xvZy5hc3NlcnQoY2xhdXNlT2YoJ2VhdCcsICdkJywgJ2JvbmUnKSlcblxuLy8gICAgIGF3YWl0IHByb2xvZy5hc3NlcnQoY2xhdXNlT2YoJ3RhYmxlJywgJ3RiMScpKVxuXG4vLyAgICAgLy8gY29uc3QgcmVzID0gYXdhaXQgcHJvbG9nLnF1ZXJ5KGNsYXVzZU9mKCdjYXQnLCAnWCcpLmNvbmNhdChjbGF1c2VPZignZWF0JywgJ1gnLCAnWScpLmNvbmNhdChjbGF1c2VPZignZG9nJywgJ1onKSkpKVxuLy8gICAgIC8vIGNvbnN0IGNsYXVzZSA9IGNsYXVzZU9mKCdjYXQnLCAnaWQwJykuY29uY2F0KGNsYXVzZU9mKCdkb2cnLCAnaWQxJykpLmNvbmNhdChjbGF1c2VPZignY2FwcmEnLCAnaWQ1NScpKSBcbi8vICAgICAvLyBjb25zdCBjbGF1c2UgPSBnZXRQYXJzZXIoJ3RoZSBjYXQgdGhhdCBpcyBibGFjayBpcyBzbWFydCcpLnBhcnNlKCkudG9Qcm9sb2coKVxuLy8gICAgIGNvbnN0IGNsYXVzZSA9IGdldFBhcnNlcigndGhlIGNhdCB0aGF0IGlzIHdoaXRlIGlzIG9uIHRoZSB0YWJsZScpLnBhcnNlKCkudG9Qcm9sb2coKVxuLy8gICAgIGNvbnNvbGUubG9nKGNsYXVzZS50b1N0cmluZygpKVxuXG4vLyAgICAgY29uc3QgcmVzID0gYXdhaXQgZ2V0U2FuZGJveChjbGF1c2UpLm1hcFRvKHByb2xvZylcbi8vICAgICBjb25zb2xlLmxvZyhyZXMpXG4vLyAgICAgY29uc29sZS5sb2coY2xhdXNlLnJoZW1lLmNvcHkoeyBtYXA6IHJlcyB9KS50b1N0cmluZygpKVxuXG4vLyB9KSgpO1xuXG5cblxuLy8gKGFzeW5jICgpID0+IHtcbi8vICAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcblxuLy8gICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpXG4vLyAgICAgYnV0dG9uLmlubmVyVGV4dCA9ICdydW4nXG4vLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKT8uYXBwZW5kQ2hpbGQoYnV0dG9uKVxuXG4vLyAgICAgY29uc3QgcGFyYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbi8vICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpPy5hcHBlbmRDaGlsZChwYXJhZylcblxuLy8gICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuLy8gICAgIHRleHRhcmVhLnN0eWxlLmhlaWdodCA9ICc1MHZoJ1xuLy8gICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzUwdncnXG4vLyAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKT8uYXBwZW5kQ2hpbGQodGV4dGFyZWEpXG5cbi8vICAgICBidXR0b24ub25jbGljayA9IGFzeW5jIGUgPT4ge1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhhd2FpdCBicmFpbi5leGVjdXRlKHRleHRhcmVhLnZhbHVlKSlcbi8vICAgICB9XG5cbi8vIH0pKCk7XG5cblxuLy8gcHJvbG9nUGxheSgpIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9