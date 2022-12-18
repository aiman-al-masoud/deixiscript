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
    toProlog(args) {
        var _a, _b;
        const subjId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (() => { throw new Error('undefined subject id'); })();
        const newId = (0, Clause_1.getRandomId)();
        return (0, Clause_1.clauseOf)(this.preposition.string, subjId, newId)
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
    isUniversallyQuantified() {
        var _a, _b;
        return (_b = (_a = this.quantifier) === null || _a === void 0 ? void 0 : _a.isUniversal()) !== null && _b !== void 0 ? _b : false;
    }
    toProlog(args) {
        var _a, _b, _c, _d;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Clause_1.getRandomId)();
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        return this
            .adjectives
            .map(a => a.string)
            .concat(this.noun ? [this.noun.string] : [])
            .map(p => (0, Clause_1.clauseOf)(p, subjectId))
            .reduce((c1, c2) => c1.concat(c2), (0, Clause_1.emptyClause)())
            .concat(this.complements.map(c => c.toProlog(newArgs)).reduce((c1, c2) => c1.concat(c2), (0, Clause_1.emptyClause)()))
            .concat((_d = (_c = this.subordClause) === null || _c === void 0 ? void 0 : _c.toProlog(newArgs)) !== null && _d !== void 0 ? _d : (0, Clause_1.emptyClause)());
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
    toProlog(args) {
        var _a, _b;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Clause_1.getRandomId)();
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        //TODO: this is WRONG, subject of condition may NOT always be the subject of the outcome
        const condition = this.condition.toProlog(newArgs);
        const outcome = this.outcome.toProlog(newArgs);
        return (0, Clause_1.makeHornClauses)(condition, outcome);
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
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
class CopulaSentence {
    constructor(subject, copula, predicate, negation) {
        this.subject = subject;
        this.copula = copula;
        this.predicate = predicate;
        this.negation = negation;
    }
    toProlog(args) {
        var _a, _b;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Clause_1.getRandomId)();
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        const subject = this.subject.toProlog(newArgs);
        const predicate = this.predicate.toProlog(newArgs).copy({ negate: !!this.negation });
        const result = this.subject.isUniversallyQuantified() ?
            (0, Clause_1.makeHornClauses)(subject, predicate) :
            subject.addRheme(predicate);
        return result;
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
    toProlog(args) {
        var _a, _b;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Clause_1.getRandomId)();
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        return (0, Clause_1.clauseOf)(this.iverb.string, subjectId)
            .concat(this.subject.toProlog(newArgs))
            .concat(this.complements.map(c => c.toProlog(newArgs)).reduce((c1, c2) => c1.concat(c2)));
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

/***/ "./app/src/clauses/AnaClause.ts":
/*!**************************************!*\
  !*** ./app/src/clauses/AnaClause.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class AnaClause {
    constructor(theme, rheme, negated = false) {
        this.theme = theme;
        this.rheme = rheme;
        this.negated = negated;
    }
    addRheme(other) {
        throw new Error("Method not implemented.");
    }
    concat(other) {
        throw new Error("Method not implemented.");
    }
    copy(opts) {
        return new AnaClause(this.theme.copy(), this.rheme.copy());
    }
    toList() {
        return [this.theme.copy(), this.rheme.copy()];
    }
}
exports["default"] = AnaClause;


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
const AnaClause_1 = __importDefault(__webpack_require__(/*! ./AnaClause */ "./app/src/clauses/AnaClause.ts"));
const ListClause_1 = __importDefault(__webpack_require__(/*! ./ListClause */ "./app/src/clauses/ListClause.ts"));
class BasicClause {
    constructor(predicate, args, negated = false) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
    }
    addRheme(rheme) {
        return new AnaClause_1.default(this.copy(), rheme.copy());
    }
    concat(other) {
        return new ListClause_1.default(this.toList().concat(other.toList()));
    }
    copy(opts) {
        return new BasicClause(this.predicate, this.args.concat([]), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated);
    }
    toList() {
        return [this.copy()];
    }
    toString() {
        const core = `${this.predicate}(${this.args.reduce((a1, a2) => a1 + ', ' + a2)})`;
        return this.negated ? `not(${core})` : core;
    }
}
exports.BasicClause = BasicClause;
// export class BasicClause implements Clause {
//     constructor(readonly clauses: string[]) {
//     }
//     isImply(): boolean {
//         return this.clauses.some(c=>c.includes(':-'))
//     }
//     copy(opts?: CopyOpts): Clause {
//         return this.withVars(opts?.withVars ?? false)
//                    .negate(opts?.negate ?? false)
//     }
//     protected withVars(withVars: boolean) {
//         return new BasicClause(withVars ?
//             this.clauses.map(c => c.replaceAll(CONST_PREFIX, VAR_PREFIX)) :
//             this.clauses.map(c => c.replaceAll(VAR_PREFIX, CONST_PREFIX)))
//     }
//     protected negate(negate: boolean) {
//         return negate ?
//             new BasicClause([`not( (${this.clauses.reduce((c1, c2) => `${c1}, ${c2}`)}) )`]) :
//             new BasicClause(this.clauses.concat([]))
//     }
//     concat(other: Clause): Clause {
//         return new BasicClause(this.clauses.concat(other.clauses))
//     }
// }


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
exports.getRandomId = exports.makeHornClauses = exports.emptyClause = exports.clauseOf = exports.VAR_PREFIX = exports.CONST_PREFIX = void 0;
const BasicClause_1 = __webpack_require__(/*! ./BasicClause */ "./app/src/clauses/BasicClause.ts");
const HornClause_1 = __webpack_require__(/*! ./HornClause */ "./app/src/clauses/HornClause.ts");
const ListClause_1 = __importDefault(__webpack_require__(/*! ./ListClause */ "./app/src/clauses/ListClause.ts"));
exports.CONST_PREFIX = 'id';
exports.VAR_PREFIX = 'Id';
function clauseOf(predicate, ...args) {
    return new BasicClause_1.BasicClause(predicate, args);
}
exports.clauseOf = clauseOf;
const emptyClause = () => new ListClause_1.default([]);
exports.emptyClause = emptyClause;
function makeHornClauses(conditions, conclusions) {
    // TODO: this breaks negated ListClauses or ListClauses with negated elements !!!!!!!
    const cond = conditions.toList().map(c => c);
    const conc = conclusions.toList().map(c => c);
    const results = conc.map(c => new HornClause_1.HornClause(cond, c));
    return results.length == 1 ? results[0] : new ListClause_1.default(results);
}
exports.makeHornClauses = makeHornClauses;
function getRandomId() {
    return `${exports.CONST_PREFIX}${parseInt(1000000 * Math.random() + '')}`;
}
exports.getRandomId = getRandomId;


/***/ }),

/***/ "./app/src/clauses/HornClause.ts":
/*!***************************************!*\
  !*** ./app/src/clauses/HornClause.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HornClause = void 0;
const ListClause_1 = __importDefault(__webpack_require__(/*! ./ListClause */ "./app/src/clauses/ListClause.ts"));
class HornClause {
    constructor(condition, conclusion, negated = false) {
        this.condition = condition;
        this.conclusion = conclusion;
        this.negated = negated;
    }
    concat(other) {
        return new ListClause_1.default(this.toList().concat(other.toList()));
    }
    copy(opts) {
        return new HornClause(this.condition.map(c => c.copy()), this.conclusion.copy());
    }
    toList() {
        return [this.copy()];
    }
    toString() {
        return `${this.conclusion.toString()} :- ${this.condition.map(c => c.toString()).reduce((c1, c2) => c1 + ', ' + c2)}`;
    }
    addRheme(other) {
        throw new Error('not implemented!');
    }
}
exports.HornClause = HornClause;


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
const AnaClause_1 = __importDefault(__webpack_require__(/*! ./AnaClause */ "./app/src/clauses/AnaClause.ts"));
class ListClause {
    constructor(clauses, negated = false) {
        this.clauses = clauses;
        this.negated = negated;
    }
    concat(other) {
        // if(!this.negated && !other.negated) ...
        if (this.negated) {
            return new ListClause([this.copy(), ...other.toList()]);
        }
        else {
            return new ListClause(this.toList().concat(other.toList()));
        }
    }
    copy(opts) {
        return new ListClause(this.clauses, (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated);
    }
    toList() {
        return this.clauses.concat([]);
    }
    toString() {
        return this.negated ? `not(${this.clauses.toString()})` : this.clauses.toString();
    }
    addRheme(rheme) {
        return new AnaClause_1.default(this.copy(), rheme.copy());
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
test('the cat is not red');
test('every cat is not red');
test('trump is not a great president');
// const p = document.createElement('p')
// document.getElementById('root')?.appendChild(p)
// const textarea = document.createElement('textarea')
// document.getElementById('root')?.appendChild(textarea)
// textarea.oninput = (e)=>{
//     p.innerHTML = getParser(textarea.value).parse().toProlog().clauses.reduce((c1,c2)=>`${c1}<br>${c2}`)
// }

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SSxDQUFDLG9CQUFvQixDQUFDO0FBQzFCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztBQUM1QixJQUFJLENBQUMsZ0NBQWdDLENBQUM7QUFHdEMsd0NBQXdDO0FBQ3hDLGtEQUFrRDtBQUVsRCxzREFBc0Q7QUFDdEQseURBQXlEO0FBRXpELDRCQUE0QjtBQUM1QiwyR0FBMkc7QUFDM0csSUFBSSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2FkamVjdGl2ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvY29wdWxhcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9kZWZpbml0ZV9hcnRpY2xlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9leGlzdGVudGlhbF9xdWFudGlmaWVycy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9odmVyYnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvaW5kZWZpbml0ZV9hcnRpY2xlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9pdmVyYnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvbXZlcmJzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL25lZ2F0aW9ucy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9ub25zdWJjb25qLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL25vdW5zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3ByZXBvc2l0aW9ucy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9yZWxwcm9ucy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9zdWJjb25qLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3RoZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvdW5pdmVyc2FsX3F1YW50aWZpZXJzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3BocmFzZXMvQ29tcGxlbWVudC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9waHJhc2VzL0NvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3BocmFzZXMvTm91blBocmFzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvQ29tcGxleFNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Db3B1bGFRdWVzdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvQ29wdWxhU2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0ludHJhbnNpdGl2ZVNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Nb25vdHJhbnNpdGl2ZVNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9BYnN0cmFjdFRva2VuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9BZGplY3RpdmUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0FydGljbGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0NvcHVsYS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvRnVsbFN0b3AudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0hWZXJiLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9JVmVyYi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTVZlcmIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL05lZ2F0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9Ob25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL05vdW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1ByZXBvc2l0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9RdWFudGlmaWVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9SZWxhdGl2ZVByb25vdW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvVGhlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvQW5hQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9CYXNpY0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9Ib3JuQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9MaXN0Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvdG9rZW5PZi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9CYXNpY1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiYmlnXCIsXG4gICAgXCJzbWFsbFwiLFxuICAgIFwiaGVscGZ1bFwiLFxuICAgIFwicmVkXCIsXG4gICAgXCJibGFja1wiLFxuICAgIFwiZ3JlYXRcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImlzXCIsXG4gICAgXCJhcmVcIixcbiAgICBcImJlXCJcbl0iLCJleHBvcnQgZGVmYXVsdFtcbiAgICBcInRoZVwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwic29tZVwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiZG9cIixcbiAgICBcImRvZXNcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImFcIixcbiAgICBcImFuXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJleGlzdFwiLFxuICAgIFwiZXhpc3RzXCIsXG4gICAgXCJydW5cIixcbiAgICBcImdyb3dcIixcbiAgICBcImRpZVwiLFxuICAgIFwibGl2ZVwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiZWF0XCIsXG4gICAgXCJkcmlua1wiLFxuICAgIFwid2F0Y2hcIixcbiAgICBcIm1ha2VcIixcbiAgICBcImhpdFwiLFxuICAgIFwiY2xpY2tcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImRvZXNuJ3RcIixcbiAgICBcImRvZXMgbm90XCIsXG4gICAgJ25vdCcsXG4gICAgXCJkb24ndFwiLFxuICAgICdkbyBub3QnXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiYW5kXCIsXG4gICAgXCJvclwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiY2F0XCIsXG4gICAgXCJtYXRcIixcbiAgICBcInRhYmxlXCIsXG4gICAgXCJkb2dcIixcbiAgICBcIm5vZGVqc1wiLFxuICAgIFwiY29sb3JcIixcbiAgICBcImJ1dHRvblwiLFxuICAgIFwiZGl2XCIsXG4gICAgXCJwcmVzaWRlbnRcIixcbiAgICBcInRydW1wXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJ0b1wiLFxuICAgIFwid2l0aFwiLFxuICAgIFwiZnJvbVwiLFxuICAgIFwib2ZcIixcbiAgICBcIm92ZXJcIixcbiAgICBcIm9uXCIsXG4gICAgXCJhdFwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwidGhhdFwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiaWZcIixcbiAgICBcIndoZW5cIixcbiAgICBcImJlY2F1c2VcIixcbiAgICBcIndoaWxlXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJ0aGVuXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJldmVyeVwiLFxuICAgIFwiYWxsXCIsXG4gICAgXCJlYWNoXCJcbl0iLCJpbXBvcnQgeyBUb1Byb2xvZ0FyZ3MgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZ2V0UmFuZG9tSWQsIElkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuL05vdW5QaHJhc2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGxlbWVudCBpbXBsZW1lbnRzIFBocmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVwb3NpdGlvbjogUHJlcG9zaXRpb24sIHJlYWRvbmx5IG5vdW5QaHJhc2U6IE5vdW5QaHJhc2UpIHtcblxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2UgeyAvLyBwcmVwb3NpdGlvbihhcmdzLnN1YmplY3QsIFkpICsgbm91bnBocmFzZS50b1Byb2xvZyhzdWJqZWN0PVkpXG5cbiAgICAgICAgY29uc3Qgc3ViaklkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gKCgpOiBJZCA9PiB7IHRocm93IG5ldyBFcnJvcigndW5kZWZpbmVkIHN1YmplY3QgaWQnKSB9KSgpXG4gICAgICAgIGNvbnN0IG5ld0lkID0gZ2V0UmFuZG9tSWQoKVxuXG4gICAgICAgIHJldHVybiBjbGF1c2VPZih0aGlzLnByZXBvc2l0aW9uLnN0cmluZywgc3ViaklkLCBuZXdJZClcbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5ub3VuUGhyYXNlLnRvUHJvbG9nKHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogbmV3SWQgfSB9KSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4vTm91blBocmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSBpbXBsZW1lbnRzIFN1Ym9yZGluYXRlQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJlbHByb246IFJlbGF0aXZlUHJvbm91biwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSkge1xuXG4gICAgfVxuXG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS50b1Byb2xvZyh7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IGFyZ3M/LnJvbGVzPy5zdWJqZWN0IH0gfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vdG9rZW5zL0FkamVjdGl2ZVwiO1xuaW1wb3J0IEFydGljbGUgZnJvbSBcIi4uL3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vdG9rZW5zL05vdW5cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi90b2tlbnMvUXVhbnRpZmllclwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4vQ29tcGxlbWVudFwiO1xuaW1wb3J0IFN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgeyBUb1Byb2xvZ0FyZ3MgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBnZXRSYW5kb21JZCwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdW5QaHJhc2UgaW1wbGVtZW50cyBQaHJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYWRqZWN0aXZlczogQWRqZWN0aXZlW10sXG4gICAgICAgIHJlYWRvbmx5IGNvbXBsZW1lbnRzOiBDb21wbGVtZW50W10sXG4gICAgICAgIHJlYWRvbmx5IG5vdW4/OiBOb3VuLFxuICAgICAgICByZWFkb25seSBxdWFudGlmaWVyPzogUXVhbnRpZmllcixcbiAgICAgICAgcmVhZG9ubHkgYXJ0aWNsZT86IEFydGljbGUsXG4gICAgICAgIHJlYWRvbmx5IHN1Ym9yZENsYXVzZT86IFN1Ym9yZGluYXRlQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBpc1VuaXZlcnNhbGx5UXVhbnRpZmllZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVhbnRpZmllcj8uaXNVbml2ZXJzYWwoKSA/PyBmYWxzZVxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2Uge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAuYWRqZWN0aXZlc1xuICAgICAgICAgICAgLm1hcChhID0+IGEuc3RyaW5nKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLm5vdW4gPyBbdGhpcy5ub3VuLnN0cmluZ10gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihwLCBzdWJqZWN0SWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsYzIpPT5jMS5jb25jYXQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLmNvbXBsZW1lbnRzLm1hcChjPT5jLnRvUHJvbG9nKG5ld0FyZ3MpKS5yZWR1Y2UoKGMxLCBjMik9PmMxLmNvbmNhdChjMiksIGVtcHR5Q2xhdXNlKCkpKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLnN1Ym9yZENsYXVzZT8udG9Qcm9sb2cobmV3QXJncykgPz8gZW1wdHlDbGF1c2UoKSlcblxuICAgIH1cblxufSIsImltcG9ydCBDb21wb3VuZFNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbXBvdW5kU2VudGVuY2VcIjtcbmltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBtYWtlSG9ybkNsYXVzZXMsIENsYXVzZSwgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TaW1wbGVTZW50ZW5jZVwiO1xuaW1wb3J0IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tIFwiLi4vdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuXG4vKipcbiAqIEEgc2VudGVuY2UgdGhhdCByZWxhdGVzIHR3byBzaW1wbGUgc2VudGVuY2VzIGh5cG90YWN0aWNhbGx5LCBpbiBhIFxuICogY29uZGl0aW9uLW91dGNvbWUgcmVsYXRpb25zaGlwLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wbGV4U2VudGVuY2UgaW1wbGVtZW50cyBDb21wb3VuZFNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogU2ltcGxlU2VudGVuY2UsXG4gICAgICAgIHJlYWRvbmx5IG91dGNvbWU6IFNpbXBsZVNlbnRlbmNlLFxuICAgICAgICByZWFkb25seSBzdWJjb25qOiBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24pIHtcblxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2Uge1xuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICAvL1RPRE86IHRoaXMgaXMgV1JPTkcsIHN1YmplY3Qgb2YgY29uZGl0aW9uIG1heSBOT1QgYWx3YXlzIGJlIHRoZSBzdWJqZWN0IG9mIHRoZSBvdXRjb21lXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuY29uZGl0aW9uLnRvUHJvbG9nKG5ld0FyZ3MpXG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLm91dGNvbWUudG9Qcm9sb2cobmV3QXJncylcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBtYWtlSG9ybkNsYXVzZXMoY29uZGl0aW9uLCBvdXRjb21lKVxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBCaW5hcnlRdWVzdGlvbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9CaW5hcnlRdWVzdGlvblwiO1xuaW1wb3J0IHsgVG9Qcm9sb2dBcmdzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFRdWVzdGlvbiBpbXBsZW1lbnRzIEJpbmFyeVF1ZXN0aW9ue1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDpOb3VuUGhyYXNlLCByZWFkb25seSBwcmVkaWNhdGU6Tm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOkNvcHVsYSl7XG5cbiAgICB9XG4gICAgXG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyB8IHVuZGVmaW5lZCk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyAgVG9Qcm9sb2dBcmdzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgZ2V0UmFuZG9tSWQsIG1ha2VIb3JuQ2xhdXNlcyB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IFNpbXBsZVNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1NpbXBsZVNlbnRlbmNlXCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFTZW50ZW5jZSBpbXBsZW1lbnRzIFNpbXBsZVNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsIHJlYWRvbmx5IGNvcHVsYTogQ29wdWxhLCByZWFkb25seSBwcmVkaWNhdGU6IE5vdW5QaHJhc2UsIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2Uge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnN1YmplY3QudG9Qcm9sb2cobmV3QXJncylcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5wcmVkaWNhdGUudG9Qcm9sb2cobmV3QXJncykuY29weSh7bmVnYXRlOiEhdGhpcy5uZWdhdGlvbn0pIFxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuc3ViamVjdC5pc1VuaXZlcnNhbGx5UXVhbnRpZmllZCgpID9cbiAgICAgICAgICAgIG1ha2VIb3JuQ2xhdXNlcyhzdWJqZWN0LCBwcmVkaWNhdGUpIDpcbiAgICAgICAgICAgIHN1YmplY3QuYWRkUmhlbWUocHJlZGljYXRlKVxuXG4gICAgICAgIHJldHVybiByZXN1bHRcblxuICAgIH1cblxufSIsImltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBnZXRSYW5kb21JZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBJVmVyYiBmcm9tIFwiLi4vdG9rZW5zL0lWZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRyYW5zaXRpdmVTZW50ZW5jZSBpbXBsZW1lbnRzIFZlcmJTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLFxuICAgICAgICByZWFkb25seSBpdmVyYjogSVZlcmIsXG4gICAgICAgIHJlYWRvbmx5IGNvbXBsZW1lbnRzOiBDb21wbGVtZW50W10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2Uge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfTtcblxuICAgICAgICByZXR1cm4gY2xhdXNlT2YodGhpcy5pdmVyYi5zdHJpbmcsIHN1YmplY3RJZClcbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5zdWJqZWN0LnRvUHJvbG9nKG5ld0FyZ3MpKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLmNvbXBsZW1lbnRzLm1hcChjID0+IGMudG9Qcm9sb2cobmV3QXJncykpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5jb25jYXQoYzIpKSlcbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IHsgVG9Qcm9sb2dBcmdzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vdG9rZW5zL01WZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlIGltcGxlbWVudHMgVmVyYlNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgbXZlcmI6IE1WZXJiLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG9iamVjdDogTm91blBocmFzZSxcbiAgICAgICAgICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cbiAgICBcbiAgICB0b1Byb2xvZyhhcmdzPzogVG9Qcm9sb2dBcmdzIHwgdW5kZWZpbmVkKTogQ2xhdXNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBBYnN0cmFjdFRva2VuIGltcGxlbWVudHMgVG9rZW57XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdHJpbmc6c3RyaW5nKXtcblxuICAgIH0gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkamVjdGl2ZSBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IGRlZmluaXRlX2FydGljbGVzIGZyb20gXCIuLi8uLi8uLi9yZXMvdG9rZW5zL2RlZmluaXRlX2FydGljbGVzXCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFydGljbGUgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuXG4gICAgaXNEZWZpbml0ZSgpe1xuICAgICAgICByZXR1cm4gZGVmaW5pdGVfYXJ0aWNsZXMuaW5jbHVkZXModGhpcy5zdHJpbmcpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKXtcbiAgICAgICAgcmV0dXJuIGBBcnRpY2xlKCR7dGhpcy5zdHJpbmd9LCBpc0RlZmluaXRlPSR7dGhpcy5pc0RlZmluaXRlKCl9KWBcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnVsbFN0b3AgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIVmVyYiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElWZXJiIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTVZlcmIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZWdhdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdW4gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVwb3NpdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgICAgXG59IiwiaW1wb3J0IGV4aXN0ZW50aWFsX3F1YW50aWZpZXJzIGZyb20gXCIuLi8uLi8uLi9yZXMvdG9rZW5zL2V4aXN0ZW50aWFsX3F1YW50aWZpZXJzXCI7XG5pbXBvcnQgdW5pdmVyc2FsX3F1YW50aWZpZXJzIGZyb20gXCIuLi8uLi8uLi9yZXMvdG9rZW5zL3VuaXZlcnNhbF9xdWFudGlmaWVyc1wiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1YW50aWZpZXIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxuICAgIGlzVW5pdmVyc2FsKCl7XG4gICAgICAgIHJldHVybiB1bml2ZXJzYWxfcXVhbnRpZmllcnMuaW5jbHVkZXModGhpcy5zdHJpbmcpXG4gICAgfVxuXG4gICAgaXNFeGlzdGVudGlhbCgpe1xuICAgICAgICByZXR1cm4gZXhpc3RlbnRpYWxfcXVhbnRpZmllcnMuaW5jbHVkZXModGhpcy5zdHJpbmcpXG4gICAgfVxuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWxhdGl2ZVByb25vdW4gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaGVuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICAgXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IExpc3RDbGF1c2UgZnJvbSBcIi4vTGlzdENsYXVzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmFDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2V7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB0aGVtZTpDbGF1c2UsIHJlYWRvbmx5IHJoZW1lOkNsYXVzZSwgcmVhZG9ubHkgbmVnYXRlZD1mYWxzZSl7XG5cbiAgICB9XG4gICAgXG4gICAgYWRkUmhlbWUob3RoZXI6IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cblxuICAgIGNvbmNhdChvdGhlcjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuICAgIFxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmFDbGF1c2UodGhpcy50aGVtZS5jb3B5KCksIHRoaXMucmhlbWUuY29weSgpKVxuICAgIH1cblxuICAgIHRvTGlzdCgpOiBDbGF1c2VbXSB7Ly8gQkFBQUFERD9cbiAgICAgICAgcmV0dXJuIFt0aGlzLnRoZW1lLmNvcHkoKSwgdGhpcy5yaGVtZS5jb3B5KCldIFxuICAgIH1cblxufSIsImltcG9ydCBBbmFDbGF1c2UgZnJvbSBcIi4vQW5hQ2xhdXNlXCI7XG5pbXBvcnQgeyBDbGF1c2UsIENPTlNUX1BSRUZJWCwgQ29weU9wdHMsIElkLCBWQVJfUFJFRklYIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgTGlzdENsYXVzZSBmcm9tIFwiLi9MaXN0Q2xhdXNlXCI7XG5cblxuZXhwb3J0IGNsYXNzIEJhc2ljQ2xhdXNlIGltcGxlbWVudHMgQ2xhdXNle1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlZGljYXRlOnN0cmluZywgcmVhZG9ubHkgYXJnczpJZFtdLCByZWFkb25seSBuZWdhdGVkPWZhbHNlKXtcblxuICAgIH1cblxuICAgIGFkZFJoZW1lKHJoZW1lOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuYUNsYXVzZSh0aGlzLmNvcHkoKSwgcmhlbWUuY29weSgpKSAgICAgICAgXG4gICAgfVxuXG4gICAgY29uY2F0KG90aGVyOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IExpc3RDbGF1c2UodGhpcy50b0xpc3QoKS5jb25jYXQob3RoZXIudG9MaXN0KCkpKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQmFzaWNDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHRoaXMucHJlZGljYXRlLCB0aGlzLmFyZ3MuY29uY2F0KFtdKSwgb3B0cz8ubmVnYXRlPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkKVxuICAgIH1cblxuICAgIHRvTGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpcy5jb3B5KCldXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKXtcbiAgICAgICAgY29uc3QgY29yZSA9IGAke3RoaXMucHJlZGljYXRlfSgke3RoaXMuYXJncy5yZWR1Y2UoKGExLGEyKT0+YTErJywgJythMil9KWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZD8gYG5vdCgke2NvcmV9KWAgOiBjb3JlXG4gICAgfVxufVxuXG4vLyBleHBvcnQgY2xhc3MgQmFzaWNDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4vLyAgICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlczogc3RyaW5nW10pIHtcblxuLy8gICAgIH1cblxuLy8gICAgIGlzSW1wbHkoKTogYm9vbGVhbiB7XG4vLyAgICAgICAgIHJldHVybiB0aGlzLmNsYXVzZXMuc29tZShjPT5jLmluY2x1ZGVzKCc6LScpKVxuLy8gICAgIH1cblxuLy8gICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcblxuLy8gICAgICAgICByZXR1cm4gdGhpcy53aXRoVmFycyhvcHRzPy53aXRoVmFycyA/PyBmYWxzZSlcbi8vICAgICAgICAgICAgICAgICAgICAubmVnYXRlKG9wdHM/Lm5lZ2F0ZSA/PyBmYWxzZSlcblxuLy8gICAgIH1cblxuLy8gICAgIHByb3RlY3RlZCB3aXRoVmFycyh3aXRoVmFyczogYm9vbGVhbikge1xuXG4vLyAgICAgICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2Uod2l0aFZhcnMgP1xuLy8gICAgICAgICAgICAgdGhpcy5jbGF1c2VzLm1hcChjID0+IGMucmVwbGFjZUFsbChDT05TVF9QUkVGSVgsIFZBUl9QUkVGSVgpKSA6XG4vLyAgICAgICAgICAgICB0aGlzLmNsYXVzZXMubWFwKGMgPT4gYy5yZXBsYWNlQWxsKFZBUl9QUkVGSVgsIENPTlNUX1BSRUZJWCkpKVxuXG4vLyAgICAgfVxuXG4vLyAgICAgcHJvdGVjdGVkIG5lZ2F0ZShuZWdhdGU6IGJvb2xlYW4pIHtcblxuLy8gICAgICAgICByZXR1cm4gbmVnYXRlID9cbi8vICAgICAgICAgICAgIG5ldyBCYXNpY0NsYXVzZShbYG5vdCggKCR7dGhpcy5jbGF1c2VzLnJlZHVjZSgoYzEsIGMyKSA9PiBgJHtjMX0sICR7YzJ9YCl9KSApYF0pIDpcbi8vICAgICAgICAgICAgIG5ldyBCYXNpY0NsYXVzZSh0aGlzLmNsYXVzZXMuY29uY2F0KFtdKSlcbi8vICAgICB9XG5cbi8vICAgICBjb25jYXQob3RoZXI6IENsYXVzZSk6IENsYXVzZSB7XG4vLyAgICAgICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UodGhpcy5jbGF1c2VzLmNvbmNhdChvdGhlci5jbGF1c2VzKSlcbi8vICAgICB9XG5cbi8vIH1cbiIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IHsgSG9ybkNsYXVzZSB9IGZyb20gXCIuL0hvcm5DbGF1c2VcIlxuaW1wb3J0IExpc3RDbGF1c2UgZnJvbSBcIi4vTGlzdENsYXVzZVwiXG5cbmV4cG9ydCBjb25zdCBDT05TVF9QUkVGSVggPSAnaWQnXG5leHBvcnQgY29uc3QgVkFSX1BSRUZJWCA9ICdJZCdcbmV4cG9ydCB0eXBlIElkID0gbnVtYmVyIHwgc3RyaW5nXG5cblxuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuICAgIGNvbmNhdChvdGhlcjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgY29weShvcHRzPzpDb3B5T3B0cyk6Q2xhdXNlXG4gICAgdG9MaXN0KCk6Q2xhdXNlW11cbiAgICBhZGRSaGVtZShyaGVtZTpDbGF1c2UpOkNsYXVzZVxuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ6Ym9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOnN0cmluZywgLi4uYXJnczpJZFtdKXtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlID0gKCk6Q2xhdXNlID0+IG5ldyBMaXN0Q2xhdXNlKFtdKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRze1xuICAgIG5lZ2F0ZT8gOiBib29sZWFuLFxuICAgIHdpdGhWYXJzPyA6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VIb3JuQ2xhdXNlcyhjb25kaXRpb25zOiBDbGF1c2UsIGNvbmNsdXNpb25zOiBDbGF1c2UpOkNsYXVzZSB7XG5cbiAgICAvLyBUT0RPOiB0aGlzIGJyZWFrcyBuZWdhdGVkIExpc3RDbGF1c2VzIG9yIExpc3RDbGF1c2VzIHdpdGggbmVnYXRlZCBlbGVtZW50cyAhISEhISEhXG5cbiAgICBjb25zdCBjb25kID0gY29uZGl0aW9ucy50b0xpc3QoKS5tYXAoYz0+IChjIGFzIEJhc2ljQ2xhdXNlKSlcbiAgICBjb25zdCBjb25jID0gY29uY2x1c2lvbnMudG9MaXN0KCkubWFwKGM9PiAoYyBhcyBCYXNpY0NsYXVzZSkpXG4gICAgY29uc3QgcmVzdWx0cyA9IGNvbmMubWFwKGMgPT4gbmV3IEhvcm5DbGF1c2UoY29uZCwgYykpXG5cbiAgICByZXR1cm4gcmVzdWx0cy5sZW5ndGg9PTEgPyByZXN1bHRzWzBdIDogbmV3IExpc3RDbGF1c2UocmVzdWx0cylcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tSWQoKTogSWQge1xuICAgIHJldHVybiBgJHtDT05TVF9QUkVGSVh9JHtwYXJzZUludCgxMDAwMDAwICogTWF0aC5yYW5kb20oKSsnJyl9YFxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIjtcbmltcG9ydCB7IENsYXVzZSwgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCBMaXN0Q2xhdXNlIGZyb20gXCIuL0xpc3RDbGF1c2VcIjtcblxuZXhwb3J0IGNsYXNzIEhvcm5DbGF1c2UgaW1wbGVtZW50cyBDbGF1c2V7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25kaXRpb246QmFzaWNDbGF1c2VbXSwgcmVhZG9ubHkgY29uY2x1c2lvbjpCYXNpY0NsYXVzZSwgcmVhZG9ubHkgbmVnYXRlZD1mYWxzZSl7XG5cbiAgICB9XG5cbiAgICBjb25jYXQob3RoZXI6IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgTGlzdENsYXVzZSh0aGlzLnRvTGlzdCgpLmNvbmNhdChvdGhlci50b0xpc3QoKSkpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBIb3JuQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIb3JuQ2xhdXNlKHRoaXMuY29uZGl0aW9uLm1hcChjPT5jLmNvcHkoKSksIHRoaXMuY29uY2x1c2lvbi5jb3B5KCkpXG4gICAgfVxuXG4gICAgdG9MaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLmNvcHkoKV1cbiAgICB9XG5cbiAgICB0b1N0cmluZygpe1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5jb25jbHVzaW9uLnRvU3RyaW5nKCl9IDotICR7dGhpcy5jb25kaXRpb24ubWFwKGM9PmMudG9TdHJpbmcoKSkucmVkdWNlKChjMSxjMik9PmMxKycsICcrYzIpfWBcbiAgICB9XG5cblxuICAgIGFkZFJoZW1lKG90aGVyOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgQW5hQ2xhdXNlIGZyb20gXCIuL0FuYUNsYXVzZVwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXN0Q2xhdXNlIGltcGxlbWVudHMgQ2xhdXNle1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlczpDbGF1c2VbXSwgcmVhZG9ubHkgbmVnYXRlZD1mYWxzZSl7XG5cbiAgICB9XG5cbiAgICBjb25jYXQob3RoZXI6IENsYXVzZSk6IENsYXVzZSB7XG5cbiAgICAgICAgLy8gaWYoIXRoaXMubmVnYXRlZCAmJiAhb3RoZXIubmVnYXRlZCkgLi4uXG5cbiAgICAgICAgaWYodGhpcy5uZWdhdGVkKXtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGlzdENsYXVzZShbdGhpcy5jb3B5KCksIC4uLm90aGVyLnRvTGlzdCgpXSlcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RDbGF1c2UodGhpcy50b0xpc3QoKS5jb25jYXQob3RoZXIudG9MaXN0KCkpKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IExpc3RDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IExpc3RDbGF1c2UodGhpcy5jbGF1c2VzLCBvcHRzPy5uZWdhdGU/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQpXG4gICAgfVxuXG4gICAgdG9MaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlcy5jb25jYXQoW10pXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZD8gYG5vdCgke3RoaXMuY2xhdXNlcy50b1N0cmluZygpfSlgIDogdGhpcy5jbGF1c2VzLnRvU3RyaW5nKClcbiAgICB9XG4gICAgXG4gICAgYWRkUmhlbWUocmhlbWU6IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5hQ2xhdXNlKHRoaXMuY29weSgpLCByaGVtZS5jb3B5KCkpICAgICAgICBcbiAgICB9XG59IiwiaW1wb3J0IFRva2VuIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4uL2FzdC90b2tlbnMvQWJzdHJhY3RUb2tlblwiO1xuaW1wb3J0IExleGVyLCB7IEFzc2VydEFyZ3MsIENvbnN0cnVjdG9yIH0gZnJvbSBcIi4vTGV4ZXJcIjtcbmltcG9ydCB0b2tlbk9mIGZyb20gXCIuL3Rva2VuT2ZcIjtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlcntcblxuICAgIHByb3RlY3RlZCByZWFkb25seSB0b2tlbnM6VG9rZW5bXVxuICAgIHByb3RlY3RlZCBfcG9zOm51bWJlclxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTpzdHJpbmcpeyBcbiAgICAgICAgLy9UT0RPOiByZWNvbnN0cnVjdCBcImRvIG5vdFwiIGFuZCBcImRvZXMgbm90XCIgdG9rZW5zXG4gICAgICAgIC8vVE9ETzogbm91bnMgdnMgYWRqZWN0aXZlc1xuICAgICAgICB0aGlzLnRva2VucyA9IHNvdXJjZUNvZGUuc3BsaXQoL1xccyt8XFwuLykubWFwKGU9PiFlPycuJzplKS5tYXAodG9rZW5PZilcbiAgICAgICAgdGhpcy5fcG9zID0gMFxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IFRva2VuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuX3Bvc11cbiAgICB9XG5cbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1zZ30gYXQgJHt0aGlzLl9wb3N9YCk7XG4gICAgfVxuXG5cblxuICAgIFxuICAgIC8qKlxuICAgICAqIFJldHVybiBjdXJyZW50IHRva2VuIGlmZiBvZiBnaXZlbiB0eXBlIGFuZCBtb3ZlIHRvIG5leHQ7IFxuICAgICAqIGVsc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgZG9uJ3QgbW92ZS5cbiAgICAgKiBAcGFyYW0gYXJncyBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBhc3NlcnQgPFQ+KGNsYXp6OkNvbnN0cnVjdG9yPFQ+LCBhcmdzOkFzc2VydEFyZ3MpOiBUfHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMucGVla1xuXG4gICAgICAgIGlmIChjdXJyZW50IGluc3RhbmNlb2YgY2xhenope1xuICAgICAgICAgICAgdGhpcy5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50XG4gICAgICAgIH0gZWxzZSBpZiAoYXJncy5lcnJvck91dD8/dHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcm9hayhhcmdzLmVycm9yTXNnPz8nJylcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsImltcG9ydCBUb2tlbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlcntcbiAgICBuZXh0KCk6dm9pZFxuICAgIGJhY2tUbyhwb3M6bnVtYmVyKTp2b2lkXG4gICAgZ2V0IHBlZWsoKTpUb2tlblxuICAgIGdldCBwb3MoKTpudW1iZXJcbiAgICBjcm9hayhlcnJvck1zZzpzdHJpbmcpOnZvaWQgICBcbiAgICBhc3NlcnQgPFQ+KGNsYXp6OkNvbnN0cnVjdG9yPFQ+LCBhcmdzOkFzc2VydEFyZ3MpOiBUfHVuZGVmaW5lZCBcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBc3NlcnRBcmdze1xuICAgIGVycm9yTXNnPzpzdHJpbmdcbiAgICBlcnJvck91dD86Ym9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZXIoc291cmNlQ29kZTpzdHJpbmcpe1xuICAgIHJldHVybiBuZXcgRWFnZXJMZXhlcihzb3VyY2VDb2RlKVxufVxuXG5leHBvcnQgdHlwZSBDb25zdHJ1Y3RvcjxUPiA9IG5ldyAoLi4uYXJnczogYW55W10pID0+IFRcbiIsImltcG9ydCBhZGplY3RpdmVzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvYWRqZWN0aXZlcydcbmltcG9ydCBpbmRlZmluaXRlX2FydGljbGVzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvaW5kZWZpbml0ZV9hcnRpY2xlcydcbmltcG9ydCBkZWZpbml0ZV9hcnRpY2xlcyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2RlZmluaXRlX2FydGljbGVzJ1xuaW1wb3J0IGNvcHVsYXMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9jb3B1bGFzJ1xuaW1wb3J0IGh2ZXJicyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2h2ZXJicydcbmltcG9ydCBpdmVyYnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9pdmVyYnMnXG5pbXBvcnQgbXZlcmJzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvbXZlcmJzJ1xuaW1wb3J0IG5lZ2F0aW9ucyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL25lZ2F0aW9ucydcbmltcG9ydCBub25zdWJjb25qIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvbm9uc3ViY29uaidcbmltcG9ydCBub3VucyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL25vdW5zJ1xuaW1wb3J0IHByZXBvc2l0aW9ucyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL3ByZXBvc2l0aW9ucydcbmltcG9ydCBleGlzdHF1YW50IGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvZXhpc3RlbnRpYWxfcXVhbnRpZmllcnMnXG5pbXBvcnQgdW5pcXVhbnQgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy91bml2ZXJzYWxfcXVhbnRpZmllcnMnXG5pbXBvcnQgcmVscHJvbnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9yZWxwcm9ucydcbmltcG9ydCBzdWJjb25qIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvc3ViY29uaidcbmltcG9ydCB0aGVuIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvdGhlbidcbmltcG9ydCBBcnRpY2xlIGZyb20gJy4uL2FzdC90b2tlbnMvQXJ0aWNsZSdcbmltcG9ydCBDb3B1bGEgZnJvbSAnLi4vYXN0L3Rva2Vucy9Db3B1bGEnXG5pbXBvcnQgSFZlcmIgZnJvbSAnLi4vYXN0L3Rva2Vucy9IVmVyYidcbmltcG9ydCBJVmVyYiBmcm9tICcuLi9hc3QvdG9rZW5zL0lWZXJiJ1xuaW1wb3J0IE1WZXJiIGZyb20gJy4uL2FzdC90b2tlbnMvTVZlcmInXG5pbXBvcnQgTmVnYXRpb24gZnJvbSAnLi4vYXN0L3Rva2Vucy9OZWdhdGlvbidcbmltcG9ydCBOb25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSAnLi4vYXN0L3Rva2Vucy9Ob25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24nXG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSAnLi4vYXN0L3Rva2Vucy9QcmVwb3NpdGlvbidcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gJy4uL2FzdC90b2tlbnMvUXVhbnRpZmllcidcbmltcG9ydCBUaGVuIGZyb20gJy4uL2FzdC90b2tlbnMvVGhlbidcbmltcG9ydCBSZWxhdGl2ZVByb25vdW4gZnJvbSAnLi4vYXN0L3Rva2Vucy9SZWxhdGl2ZVByb25vdW4nXG5pbXBvcnQgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gJy4uL2FzdC90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uJ1xuaW1wb3J0IE5vdW4gZnJvbSAnLi4vYXN0L3Rva2Vucy9Ob3VuJ1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tICcuLi9hc3QvdG9rZW5zL0FkamVjdGl2ZSdcbmltcG9ydCBUb2tlbiBmcm9tICcuLi9hc3QvaW50ZXJmYWNlcy9Ub2tlbidcbmltcG9ydCBGdWxsU3RvcCBmcm9tICcuLi9hc3QvdG9rZW5zL0Z1bGxTdG9wJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b2tlbk9mKHN0cmluZzpzdHJpbmcpOlRva2Vue1xuICAgIFxuICAgIGlmIChpbmRlZmluaXRlX2FydGljbGVzLmNvbmNhdChkZWZpbml0ZV9hcnRpY2xlcykuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgQXJ0aWNsZShzdHJpbmcpXG4gICAgfWVsc2UgaWYgKGNvcHVsYXMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgQ29wdWxhKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoaHZlcmJzLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IEhWZXJiKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoaXZlcmJzLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IElWZXJiKHN0cmluZylcbiAgICB9ZWxzZSBpZiAobXZlcmJzLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IE1WZXJiKHN0cmluZylcbiAgICB9ZWxzZSBpZiAobmVnYXRpb25zLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IE5lZ2F0aW9uKHN0cmluZylcbiAgICB9ZWxzZSBpZiAobm9uc3ViY29uai5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBOb25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChwcmVwb3NpdGlvbnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgUHJlcG9zaXRpb24oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChleGlzdHF1YW50LmNvbmNhdCh1bmlxdWFudCkuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgUXVhbnRpZmllcihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKHRoZW4uaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgVGhlbihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKHJlbHByb25zLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IFJlbGF0aXZlUHJvbm91bihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKHN1YmNvbmouaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uKHN0cmluZylcbiAgICB9ZWxzZSBpZiAobm91bnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgTm91bihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKGFkamVjdGl2ZXMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgQWRqZWN0aXZlKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoJy4nID09PSBzdHJpbmcpe1xuICAgICAgICByZXR1cm4gbmV3IEZ1bGxTdG9wKCcuJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEFkamVjdGl2ZShzdHJpbmcpXG59IiwiaW1wb3J0IEFzdCBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQXN0XCI7XG5pbXBvcnQgQmluYXJ5UXVlc3Rpb24gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0JpbmFyeVF1ZXN0aW9uXCI7XG5pbXBvcnQgQ29tcG91bmRTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQ29tcG91bmRTZW50ZW5jZVwiO1xuaW1wb3J0IERlY2xhcmF0aW9uIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9EZWNsYXJhdGlvblwiO1xuaW1wb3J0IFF1ZXN0aW9uIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9RdWVzdGlvblwiO1xuaW1wb3J0IFNpbXBsZVNlbnRlbmNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9TaW1wbGVTZW50ZW5jZVwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVmVyYlNlbnRlbmNlXCI7XG5pbXBvcnQgQ29tcGxlbWVudCBmcm9tIFwiLi4vYXN0L3BocmFzZXMvQ29tcGxlbWVudFwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL2FzdC9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvU3Vib3JkaW5hdGVDbGF1c2VcIjtcbmltcG9ydCBDb21wbGV4U2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29tcGxleFNlbnRlbmNlXCI7XG5pbXBvcnQgQ29uanVuY3RpdmVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db25qdW5jdGl2ZVNlbnRlbmNlXCI7XG5pbXBvcnQgQ29wdWxhUXVlc3Rpb24gZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29wdWxhUXVlc3Rpb25cIjtcbmltcG9ydCBDb3B1bGFTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db3B1bGFTZW50ZW5jZVwiO1xuaW1wb3J0IEludHJhbnNpdGl2ZVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0ludHJhbnNpdGl2ZVNlbnRlbmNlXCI7XG5pbXBvcnQgTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Nb25vdHJhbnNpdGl2ZVNlbnRlbmNlXCI7XG5pbXBvcnQgQWRqZWN0aXZlIGZyb20gXCIuLi9hc3QvdG9rZW5zL0FkamVjdGl2ZVwiO1xuaW1wb3J0IEFydGljbGUgZnJvbSBcIi4uL2FzdC90b2tlbnMvQXJ0aWNsZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vYXN0L3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBJVmVyYiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9JVmVyYlwiO1xuaW1wb3J0IE1WZXJiIGZyb20gXCIuLi9hc3QvdG9rZW5zL01WZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvTmVnYXRpb25cIjtcbmltcG9ydCBOb3VuIGZyb20gXCIuLi9hc3QvdG9rZW5zL05vdW5cIjtcbmltcG9ydCBQcmVwb3NpdGlvbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9QcmVwb3NpdGlvblwiO1xuaW1wb3J0IFF1YW50aWZpZXIgZnJvbSBcIi4uL2FzdC90b2tlbnMvUXVhbnRpZmllclwiO1xuaW1wb3J0IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25cIjtcbmltcG9ydCBUaGVuIGZyb20gXCIuLi9hc3QvdG9rZW5zL1RoZW5cIjtcbmltcG9ydCBMZXhlciwgeyBnZXRMZXhlciB9IGZyb20gXCIuLi9sZXhlci9MZXhlclwiO1xuaW1wb3J0IFBhcnNlciBmcm9tIFwiLi9QYXJzZXJcIjtcbmltcG9ydCBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vYXN0L3BocmFzZXMvQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2VcIjtcbmltcG9ydCBSZWxhdGl2ZVByb25vdW4gZnJvbSBcIi4uL2FzdC90b2tlbnMvUmVsYXRpdmVQcm9ub3VuXCI7XG5pbXBvcnQgQ29uc3RpdHVlbnQgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIHByb3RlY3RlZCBseDogTGV4ZXJcblxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZUNvZGU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmx4ID0gZ2V0TGV4ZXIoc291cmNlQ29kZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdHJ5PFQgZXh0ZW5kcyBBc3Q+KG1ldGhvZDogKCkgPT4gVCkge1xuXG4gICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmx4LnBvc1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kKClcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKVxuICAgICAgICAgICAgdGhpcy5seC5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGVycm9yT3V0KGVycm9yTXNnOiBzdHJpbmcpOiBDb25zdGl0dWVudCB7XG4gICAgICAgIHRoaXMubHguY3JvYWsoZXJyb3JNc2cpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1zZylcbiAgICB9XG5cbiAgICBwYXJzZSgpOiBDb25zdGl0dWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlRGVjbGFyYXRpb24pXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlUXVlc3Rpb24pXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlTm91blBocmFzZSkgLy8gZm9yIHF1aWNrIHRvcGljIHJlZmVyZW5jZVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2UoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlRGVjbGFyYXRpb24gPSAoKTogRGVjbGFyYXRpb24gPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvbXBvdW5kKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZVNpbXBsZSkgXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZURlY2xhcmF0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVF1ZXN0aW9uID0gKCk6IFF1ZXN0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VCaW5hcnlRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlUXVlc3Rpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlU2ltcGxlID0gKCk6IFNpbXBsZVNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VWZXJiU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVNpbXBsZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3VuZCA9ICgpOiBDb21wb3VuZFNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb21wbGV4KVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZUNvbmp1bmN0aXZlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VDb21wb3VuZCgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VWZXJiU2VudGVuY2UgPSAoKTogVmVyYlNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VWZXJiU2VudGVuY2UoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhU2VudGVuY2UgPSAoKTogQ29wdWxhU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVNlbnRlbmNlKCksIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3QgbmVnYXRpb24gPSB0aGlzLmx4LmFzc2VydChOZWdhdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVNlbnRlbmNlKHN1YmplY3QsIGNvcHVsYSBhcyBDb3B1bGEsIHByZWRpY2F0ZSwgbmVnYXRpb24pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcGxleCA9ICgpOiBDb21wbGV4U2VudGVuY2UgPT4ge1xuXG4gICAgICAgIGNvbnN0IHN1YmNvbmogPSB0aGlzLmx4LmFzc2VydChTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG5cbiAgICAgICAgaWYgKHN1YmNvbmopIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgdGhpcy5seC5hc3NlcnQoVGhlbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29tcGxleFNlbnRlbmNlKGNvbmRpdGlvbiwgb3V0Y29tZSwgc3ViY29uailcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIGNvbnN0IHN1YmNvbmogPSB0aGlzLmx4LmFzc2VydChTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sIHsgZXJyb3JPdXQ6IHRydWUsIGVycm9yTXNnOiAnZXhwZWN0ZWQgc3Vib3JkaW5hdGluZyBjb25qdW5jdGlvbicgfSlcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb21wbGV4U2VudGVuY2UoY29uZGl0aW9uLCBvdXRjb21lLCBzdWJjb25qIGFzIFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbilcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UgPSAoKTogSW50cmFuc2l0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBuZWdhdGlvbiA9IHRoaXMubHguYXNzZXJ0KE5lZ2F0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBpdmVyYiA9IHRoaXMubHguYXNzZXJ0KElWZXJiLCB7IGVycm9yTXNnOiAncGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSgpLCBleHBlY3RlZCBpLXZlcmInIH0pXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRyYW5zaXRpdmVTZW50ZW5jZShzdWJqZWN0LCBpdmVyYiBhcyBJVmVyYiwgY29tcGxlbWVudHMsIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UgPSAoKTogTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IG5lZ2F0aW9uID0gdGhpcy5seC5hc3NlcnQoTmVnYXRpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IG12ZXJiID0gdGhpcy5seC5hc3NlcnQoTVZlcmIsIHsgZXJyb3JNc2c6ICdwYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UoKSwgZXhwZWN0ZWQgaS12ZXJiJyB9KVxuICAgICAgICBjb25zdCBjczEgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKVxuICAgICAgICBjb25zdCBvYmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IGNzMiA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG4gICAgICAgIHJldHVybiBuZXcgTW9ub3RyYW5zaXRpdmVTZW50ZW5jZShzdWJqZWN0LCBtdmVyYiBhcyBNVmVyYiwgb2JqZWN0LCBjczEuY29uY2F0KGNzMiksIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUJpbmFyeVF1ZXN0aW9uID0gKCk6IEJpbmFyeVF1ZXN0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlQmluYXJ5UXVlc3Rpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhUXVlc3Rpb24gPSAoKTogQ29wdWxhUXVlc3Rpb24gPT4ge1xuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVF1ZXN0aW9uKCksIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVF1ZXN0aW9uKHN1YmplY3QsIHByZWRpY2F0ZSwgY29wdWxhIGFzIENvcHVsYSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VOb3VuUGhyYXNlID0gKCk6IE5vdW5QaHJhc2UgPT4ge1xuICAgICAgICBjb25zdCBxdWFudGlmaWVyID0gdGhpcy5seC5hc3NlcnQoUXVhbnRpZmllciwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgYXJ0aWNsZSA9IHRoaXMubHguYXNzZXJ0KEFydGljbGUsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG5cbiAgICAgICAgbGV0IGFkamVjdGl2ZXMgPSBbXVxuICAgICAgICBsZXQgYWRqXG5cbiAgICAgICAgd2hpbGUgKGFkaiA9IHRoaXMubHguYXNzZXJ0KEFkamVjdGl2ZSwgeyBlcnJvck91dDogZmFsc2UgfSkpIHtcbiAgICAgICAgICAgIGFkamVjdGl2ZXMucHVzaChhZGopXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3VuID0gdGhpcy5seC5hc3NlcnQoTm91biwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3Qgc3Vib3JkaW5hdGVDbGF1c2UgPSB0aGlzLnRyeSh0aGlzLnBhcnNlU3Vib3JkaW5hdGVDbGF1c2UpXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKCkgXG5cbiAgICAgICAgcmV0dXJuIG5ldyBOb3VuUGhyYXNlKGFkamVjdGl2ZXMsIGNvbXBsZW1lbnRzLCBub3VuLCBxdWFudGlmaWVyLCBhcnRpY2xlLCBzdWJvcmRpbmF0ZUNsYXVzZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wbGVtZW50cyA9ICgpOiBDb21wbGVtZW50W10gPT4ge1xuXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gW11cbiAgICAgICAgbGV0IGNvbXBcblxuICAgICAgICB3aGlsZSAoY29tcCA9IHRoaXMudHJ5KHRoaXMucGFyc2VDb21wbGVtZW50KSkge1xuICAgICAgICAgICAgY29tcGxlbWVudHMucHVzaChjb21wKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbXBsZW1lbnRzXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcGxlbWVudCA9ICgpOiBDb21wbGVtZW50ID0+IHtcbiAgICAgICAgY29uc3QgcHJlcG9zaXRpb24gPSB0aGlzLmx4LmFzc2VydChQcmVwb3NpdGlvbiwgeyBlcnJvck1zZzogJ3BhcnNlQ29tcGxlbWVudCgpIGV4cGVjdGVkIHByZXBvc2l0aW9uJyB9KVxuICAgICAgICBjb25zdCBub3VuUGhyYXNlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvbXBsZW1lbnQocHJlcG9zaXRpb24gYXMgUHJlcG9zaXRpb24sIG5vdW5QaHJhc2UpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlU3Vib3JkaW5hdGVDbGF1c2UgPSAoKTogU3Vib3JkaW5hdGVDbGF1c2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKSBcbiAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VTdWJvcmRpbmF0ZUNsYXVzZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSA9ICgpOkNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlID0+e1xuICAgICAgICBjb25zdCByZWxwcm9uID0gdGhpcy5seC5hc3NlcnQoUmVsYXRpdmVQcm9ub3VuLCB7ZXJyb3JNc2c6J3BhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UoKSBleHBlY3RlZCByZWxhdGl2ZSBwcm9ub3VuJ30pXG4gICAgICAgIGNvbnN0IGNvcHVsYSA9IHRoaXMubHguYXNzZXJ0KENvcHVsYSwge2Vycm9yTXNnOidwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKCkgZXhwZWN0ZWQgY29wdWxhJ30pXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIHJldHVybiBuZXcgQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UocmVscHJvbiBhcyBSZWxhdGl2ZVByb25vdW4sIHN1YmplY3QsIGNvcHVsYSBhcyBDb3B1bGEpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29uanVuY3RpdmUgPSAoKTogQ29uanVuY3RpdmVTZW50ZW5jZSA9PiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTk9UIElNUExFTUVOVEVEISBUT0RPIScpXG4gICAgfVxuXG59IiwiaW1wb3J0IEFzdCBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQXN0XCI7XG5pbXBvcnQgQmFzaWNQYXJzZXIgZnJvbSBcIi4vQmFzaWNQYXJzZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFBhcnNlcntcbiAgICBwYXJzZSgpOkFzdCAgIFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6c3RyaW5nKXtcbiAgICByZXR1cm4gbmV3IEJhc2ljUGFyc2VyKHNvdXJjZUNvZGUpXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCBwbCBmcm9tICd0YXUtcHJvbG9nJ1xuaW1wb3J0IEFydGljbGUgZnJvbSAnLi9hc3QvdG9rZW5zL0FydGljbGUnO1xuaW1wb3J0IENvcHVsYSBmcm9tICcuL2FzdC90b2tlbnMvQ29wdWxhJztcbmltcG9ydCBOb3VuIGZyb20gJy4vYXN0L3Rva2Vucy9Ob3VuJztcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSAnLi9sZXhlci9MZXhlcic7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tICcuL3BhcnNlci9QYXJzZXInO1xuaW1wb3J0IFByb2xvZywgeyBnZXRQcm9sb2cgfSBmcm9tICcuL3Byb2xvZy9Qcm9sb2cnO1xuaW1wb3J0IFRhdVByb2xvZyBmcm9tICcuL3Byb2xvZy9UYXVQcm9sb2cnO1xuXG5cbi8vIFBST0xPRyBURVNUIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gY29uc3QgcHJvID0gZ2V0UHJvbG9nKCk7XG4vLyAod2luZG93IGFzIGFueSkucHJvID0gcHJvO1xuLy8gKGFzeW5jICgpID0+IHtcbi8vICAgICBhd2FpdCBwcm8uYXNzZXJ0KCdjYXByYShzY2VtbyknKVxuLy8gICAgIGF3YWl0IHByby5hc3NlcnQoJ21hbW1hbChwZWxvc28pJylcbi8vICAgICBhd2FpdCBwcm8uYXNzZXJ0KCdtYW1tYWwoZmlkbyknKVxuLy8gICAgIGF3YWl0IHByby5hc3NlcnQoJ21hbW1hbChYKSA6LSBjYXByYShYKScpXG4vLyAgICAgY29uc29sZS5sb2coYXdhaXQgcHJvLnF1ZXJ5KCdtYW1tYWwoWCkuJykpXG4vLyAgICAgYXdhaXQgcHJvLnJldHJhY3QoJ2NhcHJhKHNjZW1vKScpXG4vLyAgICAgY29uc29sZS5sb2coYXdhaXQgcHJvLnF1ZXJ5KCdtYW1tYWwoWCkuJykpXG4vLyB9KSgpO1xuLy8gLy8gICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gY29uc29sZS5sb2coKHRva2VuT2YoJ2EnKSBhcyBBcnRpY2xlKS5pc0RlZmluaXRlKCkpXG4vLyBjb25zb2xlLmxvZyh0b2tlbk9mKCdhJykgIGluc3RhbmNlb2YgQXJ0aWNsZSlcbi8vIGNvbnNvbGUubG9nKHRva2VuT2YoJ2EnKSAgaW5zdGFuY2VvZiBRdWFudGlmaWVyKVxuLy8gY29uc29sZS5sb2codG9rZW5PZignZXZlcnknKSAgaW5zdGFuY2VvZiBRdWFudGlmaWVyKVxuLy8gY29uc29sZS5sb2codG9rZW5PZignYScpLnRvU3RyaW5nKCkpXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb25zdCBsZXhlciA9IGdldExleGVyKCd0aGUgY2F0IGlzIGEgY2F0LicpXG4vLyBjb25zb2xlLmxvZyhsZXhlcilcbi8vIGNvbnNvbGUubG9nKCdpcyBpdCBhIG5vdW4/JywgbGV4ZXIuYXNzZXJ0KE5vdW4sIHtlcnJvck91dDpmYWxzZX0pIClcbi8vIGNvbnNvbGUubG9nKGxleGVyLnBlZWspXG4vLyBjb25zb2xlLmxvZygnaXMgaXQgYSBjb3B1bGE/JywgbGV4ZXIuYXNzZXJ0KENvcHVsYSwge2Vycm9yT3V0OmZhbHNlfSkgKVxuLy8gY29uc29sZS5sb2cobGV4ZXIucGVlaylcbi8vIGNvbnNvbGUubG9nKCdpcyBpdCBhbiBhcnRpY2xlPycsIGxleGVyLmFzc2VydChBcnRpY2xlLCB7ZXJyb3JPdXQ6ZmFsc2V9KSApXG4vLyBjb25zb2xlLmxvZyhsZXhlci5wZWVrKVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGNhdCBpcyBiaWcnKS5wYXJzZSgpKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgYmlnIGNhdCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgYmlnIGNhdCBvbiB0aGUgdGFibGUgaXMgZWF0aW5nIHR1bmEnKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGJpZyBjYXQgb24gdGhlIG1hdCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCdldmVyeSBkb2cgaXMgc3R1cGlkJykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBjYXQgdGhhdCBpcyBzbWFydCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCdub2RlanMgaXMgbm90IGhlbHBmdWwnKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcignaWYgdGhlIGRvZyBpcyBzdHVwaWQgdGhlbiB0aGUgY2F0IGlzIGhhcHB5JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBjYXQgaXMgaGFwcHkgaWYgdGhlIGRvZyBpcyBzdHVwaWQnKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKCh3aW5kb3cgYXMgYW55KS5hc3QgPSBnZXRQYXJzZXIoJ3RoZSBjb2xvciBvZiB0aGUgYnV0dG9uIGlzIHJlZCcpLnBhcnNlKCkpXG4vLyBjb25zb2xlLmxvZygod2luZG93IGFzIGFueSkuYXN0ID0gZ2V0UGFyc2VyKCd0aGUgY29sb3Igb2YgdGhlIGJ1dHRvbiBvbiB0aGUgYmxhY2sgZGl2IGlzIHJlZCcpLnBhcnNlKCkpXG5cbmZ1bmN0aW9uIHRlc3Qoc3RyaW5nOnN0cmluZyl7XG4gICAgY29uc29sZS5sb2coc3RyaW5nKVxuICAgIGNvbnNvbGUubG9nKGdldFBhcnNlcihzdHJpbmcpLnBhcnNlKCkudG9Qcm9sb2coKSlcbn1cblxudGVzdCgndGhlIGNhdCBpcyBvbiB0aGUgbWF0JylcbnRlc3QoJ3RoZSBjYXQgdGhhdCBpcyByZWQgaXMgb24gdGhlIG1hdCcpXG50ZXN0KCd0aGUgYmlnIGNhdCB0aGF0IGlzIG9uIHRoZSBtYXQgaXMgYmxhY2snKVxudGVzdCgnZXZlcnkgY2F0IGlzIHJlZCcpXG50ZXN0KCdldmVyeSByZWQgY2F0IGlzIG9uIHRoZSBtYXQnKVxudGVzdCgndGhlIGNhdCBleGlzdHMgb24gdGhlIG1hdCcpXG50ZXN0KCdpZiB0aGUgY2F0IGlzIG9uIHRoZSBtYXQgdGhlbiB0aGUgY2F0IGlzIHJlZCcpXG50ZXN0KCd0aGUgY2F0IGlzIG5vdCByZWQnKVxudGVzdCgnZXZlcnkgY2F0IGlzIG5vdCByZWQnKVxudGVzdCgndHJ1bXAgaXMgbm90IGEgZ3JlYXQgcHJlc2lkZW50JylcblxuXG4vLyBjb25zdCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpXG4vLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpPy5hcHBlbmRDaGlsZChwKVxuXG4vLyBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJylcbi8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk/LmFwcGVuZENoaWxkKHRleHRhcmVhKVxuXG4vLyB0ZXh0YXJlYS5vbmlucHV0ID0gKGUpPT57XG4vLyAgICAgcC5pbm5lckhUTUwgPSBnZXRQYXJzZXIodGV4dGFyZWEudmFsdWUpLnBhcnNlKCkudG9Qcm9sb2coKS5jbGF1c2VzLnJlZHVjZSgoYzEsYzIpPT5gJHtjMX08YnI+JHtjMn1gKVxuLy8gfVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9