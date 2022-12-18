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
        var _a;
        const newId = (0, Clause_1.getRandomId)();
        return (0, Clause_1.clauseOf)(`${this.preposition.string}(${(_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject}, ${newId})`)
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
            .map(p => (0, Clause_1.clauseOf)(`${p}(${subjectId})`))
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
            predicate.concat(subject);
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
        return (0, Clause_1.clauseOf)(`${this.iverb.string}(${subjectId})`)
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

/***/ "./app/src/clauses/BasicClause.ts":
/*!****************************************!*\
  !*** ./app/src/clauses/BasicClause.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicClause = void 0;
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/clauses/Clause.ts");
class BasicClause {
    constructor(clauses) {
        this.clauses = clauses;
    }
    isImply() {
        return this.clauses.some(c => c.includes(':-'));
    }
    copy(opts) {
        var _a, _b;
        return this.withVars((_a = opts === null || opts === void 0 ? void 0 : opts.withVars) !== null && _a !== void 0 ? _a : false)
            .negate((_b = opts === null || opts === void 0 ? void 0 : opts.negate) !== null && _b !== void 0 ? _b : false);
    }
    withVars(withVars) {
        return new BasicClause(withVars ?
            this.clauses.map(c => c.replaceAll(Clause_1.CONST_PREFIX, Clause_1.VAR_PREFIX)) :
            this.clauses.map(c => c.replaceAll(Clause_1.VAR_PREFIX, Clause_1.CONST_PREFIX)));
    }
    negate(negate) {
        return negate ?
            new BasicClause([`not( (${this.clauses.reduce((c1, c2) => `${c1}, ${c2}`)}) )`]) :
            new BasicClause(this.clauses.concat([]));
    }
    concat(other) {
        return new BasicClause(this.clauses.concat(other.clauses));
    }
}
exports.BasicClause = BasicClause;


/***/ }),

/***/ "./app/src/clauses/Clause.ts":
/*!***********************************!*\
  !*** ./app/src/clauses/Clause.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRandomId = exports.makeHornClauses = exports.emptyClause = exports.clauseOf = exports.VAR_PREFIX = exports.CONST_PREFIX = void 0;
const BasicClause_1 = __webpack_require__(/*! ./BasicClause */ "./app/src/clauses/BasicClause.ts");
exports.CONST_PREFIX = 'id';
exports.VAR_PREFIX = 'Id';
function clauseOf(string) {
    return new BasicClause_1.BasicClause(string instanceof Array ? string : [string]);
}
exports.clauseOf = clauseOf;
const emptyClause = () => clauseOf([]);
exports.emptyClause = emptyClause;
function makeHornClauses(_conditions, conclusions) {
    const conditions = _conditions.clauses.map(s => s)
        .reduce((a, b) => `${a}, ${b}`);
    return conclusions
        .clauses
        .map(p => clauseOf(`${p} :- ${conditions}`)) // one horn clause for every predicate in the conclusion
        .reduce((c1, c2) => c1.concat(c2));
}
exports.makeHornClauses = makeHornClauses;
function getRandomId() {
    return `${exports.CONST_PREFIX}${parseInt(1000000 * Math.random() + '')}`;
}
exports.getRandomId = getRandomId;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyx5Q0FBeUMsQ0FBQztBQUMvQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7QUFDeEIsSUFBSSxDQUFDLDZCQUE2QixDQUFDO0FBQ25DLElBQUksQ0FBQywyQkFBMkIsQ0FBQztBQUNqQyxJQUFJLENBQUMsOENBQThDLENBQUM7QUFDcEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDO0FBQzFCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztBQUM1QixJQUFJLENBQUMsZ0NBQWdDLENBQUM7QUFHdEMsd0NBQXdDO0FBQ3hDLGtEQUFrRDtBQUVsRCxzREFBc0Q7QUFDdEQseURBQXlEO0FBRXpELDRCQUE0QjtBQUM1QiwyR0FBMkc7QUFDM0csSUFBSSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2FkamVjdGl2ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvY29wdWxhcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9kZWZpbml0ZV9hcnRpY2xlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9leGlzdGVudGlhbF9xdWFudGlmaWVycy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9odmVyYnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvaW5kZWZpbml0ZV9hcnRpY2xlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9pdmVyYnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvbXZlcmJzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL25lZ2F0aW9ucy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9ub25zdWJjb25qLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL25vdW5zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3ByZXBvc2l0aW9ucy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9yZWxwcm9ucy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9zdWJjb25qLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3RoZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvdW5pdmVyc2FsX3F1YW50aWZpZXJzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3BocmFzZXMvQ29tcGxlbWVudC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9waHJhc2VzL0NvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3BocmFzZXMvTm91blBocmFzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvQ29tcGxleFNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Db3B1bGFRdWVzdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvQ29wdWxhU2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0ludHJhbnNpdGl2ZVNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Nb25vdHJhbnNpdGl2ZVNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9BYnN0cmFjdFRva2VuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9BZGplY3RpdmUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0FydGljbGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0NvcHVsYS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvRnVsbFN0b3AudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0hWZXJiLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9JVmVyYi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTVZlcmIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL05lZ2F0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9Ob25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL05vdW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1ByZXBvc2l0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9RdWFudGlmaWVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9SZWxhdGl2ZVByb25vdW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvVGhlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL0VhZ2VyTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9sZXhlci9MZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL3Rva2VuT2YudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9wYXJzZXIvQmFzaWNQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9wYXJzZXIvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImJpZ1wiLFxuICAgIFwic21hbGxcIixcbiAgICBcImhlbHBmdWxcIixcbiAgICBcInJlZFwiLFxuICAgIFwiYmxhY2tcIixcbiAgICBcImdyZWF0XCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJpc1wiLFxuICAgIFwiYXJlXCIsXG4gICAgXCJiZVwiXG5dIiwiZXhwb3J0IGRlZmF1bHRbXG4gICAgXCJ0aGVcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcInNvbWVcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImRvXCIsXG4gICAgXCJkb2VzXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJhXCIsXG4gICAgXCJhblwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiZXhpc3RcIixcbiAgICBcImV4aXN0c1wiLFxuICAgIFwicnVuXCIsXG4gICAgXCJncm93XCIsXG4gICAgXCJkaWVcIixcbiAgICBcImxpdmVcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImVhdFwiLFxuICAgIFwiZHJpbmtcIixcbiAgICBcIndhdGNoXCIsXG4gICAgXCJtYWtlXCIsXG4gICAgXCJoaXRcIixcbiAgICBcImNsaWNrXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJkb2Vzbid0XCIsXG4gICAgXCJkb2VzIG5vdFwiLFxuICAgICdub3QnLFxuICAgIFwiZG9uJ3RcIixcbiAgICAnZG8gbm90J1xuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImFuZFwiLFxuICAgIFwib3JcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImNhdFwiLFxuICAgIFwibWF0XCIsXG4gICAgXCJ0YWJsZVwiLFxuICAgIFwiZG9nXCIsXG4gICAgXCJub2RlanNcIixcbiAgICBcImNvbG9yXCIsXG4gICAgXCJidXR0b25cIixcbiAgICBcImRpdlwiLFxuICAgIFwicHJlc2lkZW50XCIsXG4gICAgXCJ0cnVtcFwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwidG9cIixcbiAgICBcIndpdGhcIixcbiAgICBcImZyb21cIixcbiAgICBcIm9mXCIsXG4gICAgXCJvdmVyXCIsXG4gICAgXCJvblwiLFxuICAgIFwiYXRcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcInRoYXRcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImlmXCIsXG4gICAgXCJ3aGVuXCIsXG4gICAgXCJiZWNhdXNlXCIsXG4gICAgXCJ3aGlsZVwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwidGhlblwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiZXZlcnlcIixcbiAgICBcImFsbFwiLFxuICAgIFwiZWFjaFwiXG5dIiwiaW1wb3J0IHsgVG9Qcm9sb2dBcmdzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuL05vdW5QaHJhc2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGxlbWVudCBpbXBsZW1lbnRzIFBocmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVwb3NpdGlvbjogUHJlcG9zaXRpb24sIHJlYWRvbmx5IG5vdW5QaHJhc2U6IE5vdW5QaHJhc2UpIHtcblxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2UgeyAvLyBwcmVwb3NpdGlvbihhcmdzLnN1YmplY3QsIFkpICsgbm91bnBocmFzZS50b1Byb2xvZyhzdWJqZWN0PVkpXG5cbiAgICAgICAgY29uc3QgbmV3SWQgPSBnZXRSYW5kb21JZCgpXG5cbiAgICAgICAgcmV0dXJuIGNsYXVzZU9mKGAke3RoaXMucHJlcG9zaXRpb24uc3RyaW5nfSgke2FyZ3M/LnJvbGVzPy5zdWJqZWN0fSwgJHtuZXdJZH0pYClcbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5ub3VuUGhyYXNlLnRvUHJvbG9nKHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogbmV3SWQgfSB9KSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4vTm91blBocmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSBpbXBsZW1lbnRzIFN1Ym9yZGluYXRlQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJlbHByb246IFJlbGF0aXZlUHJvbm91biwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSkge1xuXG4gICAgfVxuXG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS50b1Byb2xvZyh7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IGFyZ3M/LnJvbGVzPy5zdWJqZWN0IH0gfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vdG9rZW5zL0FkamVjdGl2ZVwiO1xuaW1wb3J0IEFydGljbGUgZnJvbSBcIi4uL3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vdG9rZW5zL05vdW5cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi90b2tlbnMvUXVhbnRpZmllclwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4vQ29tcGxlbWVudFwiO1xuaW1wb3J0IFN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgeyBUb1Byb2xvZ0FyZ3MgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UsIGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdW5QaHJhc2UgaW1wbGVtZW50cyBQaHJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYWRqZWN0aXZlczogQWRqZWN0aXZlW10sXG4gICAgICAgIHJlYWRvbmx5IGNvbXBsZW1lbnRzOiBDb21wbGVtZW50W10sXG4gICAgICAgIHJlYWRvbmx5IG5vdW4/OiBOb3VuLFxuICAgICAgICByZWFkb25seSBxdWFudGlmaWVyPzogUXVhbnRpZmllcixcbiAgICAgICAgcmVhZG9ubHkgYXJ0aWNsZT86IEFydGljbGUsXG4gICAgICAgIHJlYWRvbmx5IHN1Ym9yZENsYXVzZT86IFN1Ym9yZGluYXRlQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBpc1VuaXZlcnNhbGx5UXVhbnRpZmllZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVhbnRpZmllcj8uaXNVbml2ZXJzYWwoKSA/PyBmYWxzZVxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2Uge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAuYWRqZWN0aXZlc1xuICAgICAgICAgICAgLm1hcChhID0+IGEuc3RyaW5nKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLm5vdW4gPyBbdGhpcy5ub3VuLnN0cmluZ10gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihgJHtwfSgke3N1YmplY3RJZH0pYCkgKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsYzIpPT5jMS5jb25jYXQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLmNvbXBsZW1lbnRzLm1hcChjPT5jLnRvUHJvbG9nKG5ld0FyZ3MpKS5yZWR1Y2UoKGMxLCBjMik9PmMxLmNvbmNhdChjMiksIGVtcHR5Q2xhdXNlKCkpKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLnN1Ym9yZENsYXVzZT8udG9Qcm9sb2cobmV3QXJncykgPz8gZW1wdHlDbGF1c2UoKSlcblxuICAgIH1cblxufSIsImltcG9ydCBDb21wb3VuZFNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbXBvdW5kU2VudGVuY2VcIjtcbmltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBtYWtlSG9ybkNsYXVzZXMsIENsYXVzZSwgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TaW1wbGVTZW50ZW5jZVwiO1xuaW1wb3J0IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tIFwiLi4vdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuXG4vKipcbiAqIEEgc2VudGVuY2UgdGhhdCByZWxhdGVzIHR3byBzaW1wbGUgc2VudGVuY2VzIGh5cG90YWN0aWNhbGx5LCBpbiBhIFxuICogY29uZGl0aW9uLW91dGNvbWUgcmVsYXRpb25zaGlwLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wbGV4U2VudGVuY2UgaW1wbGVtZW50cyBDb21wb3VuZFNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogU2ltcGxlU2VudGVuY2UsXG4gICAgICAgIHJlYWRvbmx5IG91dGNvbWU6IFNpbXBsZVNlbnRlbmNlLFxuICAgICAgICByZWFkb25seSBzdWJjb25qOiBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24pIHtcblxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2Uge1xuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICAvL1RPRE86IHRoaXMgaXMgV1JPTkcsIHN1YmplY3Qgb2YgY29uZGl0aW9uIG1heSBOT1QgYWx3YXlzIGJlIHRoZSBzdWJqZWN0IG9mIHRoZSBvdXRjb21lXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuY29uZGl0aW9uLnRvUHJvbG9nKG5ld0FyZ3MpXG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLm91dGNvbWUudG9Qcm9sb2cobmV3QXJncylcblxuICAgICAgICByZXR1cm4gbWFrZUhvcm5DbGF1c2VzKGNvbmRpdGlvbiwgb3V0Y29tZSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgQmluYXJ5UXVlc3Rpb24gZnJvbSBcIi4uL2ludGVyZmFjZXMvQmluYXJ5UXVlc3Rpb25cIjtcbmltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhUXVlc3Rpb24gaW1wbGVtZW50cyBCaW5hcnlRdWVzdGlvbntcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6Tm91blBocmFzZSwgcmVhZG9ubHkgcHJlZGljYXRlOk5vdW5QaHJhc2UsIHJlYWRvbmx5IGNvcHVsYTpDb3B1bGEpe1xuXG4gICAgfVxuICAgIFxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MgfCB1bmRlZmluZWQpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG4gICAgXG59IiwiaW1wb3J0IHsgIFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UsIGdldFJhbmRvbUlkLCBtYWtlSG9ybkNsYXVzZXMgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TaW1wbGVTZW50ZW5jZVwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhU2VudGVuY2UgaW1wbGVtZW50cyBTaW1wbGVTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBuZWdhdGlvbj86IE5lZ2F0aW9uKSB7XG5cbiAgICB9XG5cbiAgICB0b1Byb2xvZyhhcmdzPzogVG9Qcm9sb2dBcmdzKTogQ2xhdXNlIHtcblxuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5zdWJqZWN0LnRvUHJvbG9nKG5ld0FyZ3MpXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMucHJlZGljYXRlLnRvUHJvbG9nKG5ld0FyZ3MpLmNvcHkoe25lZ2F0ZTohIXRoaXMubmVnYXRpb259KSBcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnN1YmplY3QuaXNVbml2ZXJzYWxseVF1YW50aWZpZWQoKSA/XG4gICAgICAgICAgICBtYWtlSG9ybkNsYXVzZXMoc3ViamVjdCwgcHJlZGljYXRlKSA6XG4gICAgICAgICAgICBwcmVkaWNhdGUuY29uY2F0KHN1YmplY3QpXG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVG9Qcm9sb2dBcmdzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgVmVyYlNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1ZlcmJTZW50ZW5jZVwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4uL3BocmFzZXMvQ29tcGxlbWVudFwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IElWZXJiIGZyb20gXCIuLi90b2tlbnMvSVZlcmJcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vdG9rZW5zL05lZ2F0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludHJhbnNpdGl2ZVNlbnRlbmNlIGltcGxlbWVudHMgVmVyYlNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgIHJlYWRvbmx5IGl2ZXJiOiBJVmVyYixcbiAgICAgICAgcmVhZG9ubHkgY29tcGxlbWVudHM6IENvbXBsZW1lbnRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRpb24/OiBOZWdhdGlvbikge1xuXG4gICAgfVxuXG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyk6IENsYXVzZSB7XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKVxuICAgICAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9O1xuXG4gICAgICAgIHJldHVybiBjbGF1c2VPZihgJHt0aGlzLml2ZXJiLnN0cmluZ30oJHtzdWJqZWN0SWR9KWApXG4gICAgICAgICAgICAuY29uY2F0KHRoaXMuc3ViamVjdC50b1Byb2xvZyhuZXdBcmdzKSlcbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5jb21wbGVtZW50cy5tYXAoYyA9PiBjLnRvUHJvbG9nKG5ld0FyZ3MpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuY29uY2F0KGMyKSkpXG4gICAgfVxuXG59XG5cbiIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBWZXJiU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvVmVyYlNlbnRlbmNlXCI7XG5pbXBvcnQgQ29tcGxlbWVudCBmcm9tIFwiLi4vcGhyYXNlcy9Db21wbGVtZW50XCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgTVZlcmIgZnJvbSBcIi4uL3Rva2Vucy9NVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSBpbXBsZW1lbnRzIFZlcmJTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG12ZXJiOiBNVmVyYixcbiAgICAgICAgICAgICAgICByZWFkb25seSBvYmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgY29tcGxlbWVudHM6IENvbXBsZW1lbnRbXSxcbiAgICAgICAgICAgICAgICByZWFkb25seSBuZWdhdGlvbj86IE5lZ2F0aW9uKSB7XG5cbiAgICB9XG4gICAgXG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyB8IHVuZGVmaW5lZCk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RUb2tlbiBpbXBsZW1lbnRzIFRva2Vue1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3RyaW5nOnN0cmluZyl7XG5cbiAgICB9ICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGplY3RpdmUgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBkZWZpbml0ZV9hcnRpY2xlcyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy9kZWZpbml0ZV9hcnRpY2xlc1wiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnRpY2xlIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcblxuICAgIGlzRGVmaW5pdGUoKXtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRlX2FydGljbGVzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7XG4gICAgICAgIHJldHVybiBgQXJ0aWNsZSgke3RoaXMuc3RyaW5nfSwgaXNEZWZpbml0ZT0ke3RoaXMuaXNEZWZpbml0ZSgpfSlgXG4gICAgfVxuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYSBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ1bGxTdG9wIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFZlcmIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJVmVyYiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1WZXJiIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmVnYXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3VuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlcG9zaXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgICAgIFxufSIsImltcG9ydCBleGlzdGVudGlhbF9xdWFudGlmaWVycyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy9leGlzdGVudGlhbF9xdWFudGlmaWVyc1wiO1xuaW1wb3J0IHVuaXZlcnNhbF9xdWFudGlmaWVycyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy91bml2ZXJzYWxfcXVhbnRpZmllcnNcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWFudGlmaWVyIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbiAgICBpc1VuaXZlcnNhbCgpe1xuICAgICAgICByZXR1cm4gdW5pdmVyc2FsX3F1YW50aWZpZXJzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cblxuICAgIGlzRXhpc3RlbnRpYWwoKXtcbiAgICAgICAgcmV0dXJuIGV4aXN0ZW50aWFsX3F1YW50aWZpZXJzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVsYXRpdmVQcm9ub3VuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGhlbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgIFxufSIsImltcG9ydCB7IENsYXVzZSwgQ09OU1RfUFJFRklYLCBDb3B5T3B0cywgVkFSX1BSRUZJWCB9IGZyb20gXCIuL0NsYXVzZVwiO1xuXG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2VzOiBzdHJpbmdbXSkge1xuXG4gICAgfVxuXG4gICAgaXNJbXBseSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlcy5zb21lKGM9PmMuaW5jbHVkZXMoJzotJykpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgICAgIHJldHVybiB0aGlzLndpdGhWYXJzKG9wdHM/LndpdGhWYXJzID8/IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgIC5uZWdhdGUob3B0cz8ubmVnYXRlID8/IGZhbHNlKVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHdpdGhWYXJzKHdpdGhWYXJzOiBib29sZWFuKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZSh3aXRoVmFycyA/XG4gICAgICAgICAgICB0aGlzLmNsYXVzZXMubWFwKGMgPT4gYy5yZXBsYWNlQWxsKENPTlNUX1BSRUZJWCwgVkFSX1BSRUZJWCkpIDpcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlcy5tYXAoYyA9PiBjLnJlcGxhY2VBbGwoVkFSX1BSRUZJWCwgQ09OU1RfUFJFRklYKSkpXG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbmVnYXRlKG5lZ2F0ZTogYm9vbGVhbikge1xuXG4gICAgICAgIHJldHVybiBuZWdhdGUgP1xuICAgICAgICAgICAgbmV3IEJhc2ljQ2xhdXNlKFtgbm90KCAoJHt0aGlzLmNsYXVzZXMucmVkdWNlKChjMSwgYzIpID0+IGAke2MxfSwgJHtjMn1gKX0pIClgXSkgOlxuICAgICAgICAgICAgbmV3IEJhc2ljQ2xhdXNlKHRoaXMuY2xhdXNlcy5jb25jYXQoW10pKVxuICAgIH1cblxuICAgIGNvbmNhdChvdGhlcjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZSh0aGlzLmNsYXVzZXMuY29uY2F0KG90aGVyLmNsYXVzZXMpKVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQmFzaWNDbGF1c2UgfSBmcm9tIFwiLi9CYXNpY0NsYXVzZVwiXG5cbmV4cG9ydCBjb25zdCBDT05TVF9QUkVGSVggPSAnaWQnXG5leHBvcnQgY29uc3QgVkFSX1BSRUZJWCA9ICdJZCdcblxuZXhwb3J0IHR5cGUgSWQgPSBudW1iZXIgfCBzdHJpbmdcblxuXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG4gICAgY2xhdXNlczogc3RyaW5nW11cbiAgICBjb25jYXQob3RoZXI6IENsYXVzZSk6IENsYXVzZVxuICAgIGNvcHkob3B0czpDb3B5T3B0cyk6Q2xhdXNlXG4gICAgaXNJbXBseSgpOmJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHN0cmluZzogc3RyaW5nIHwgc3RyaW5nW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2Uoc3RyaW5nIGluc3RhbmNlb2YgQXJyYXkgPyBzdHJpbmcgOiBbc3RyaW5nXSlcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0c3tcbiAgICBuZWdhdGU/IDogYm9vbGVhbixcbiAgICB3aXRoVmFycz8gOiBib29sZWFuXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZSA9ICgpID0+IGNsYXVzZU9mKFtdKVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUhvcm5DbGF1c2VzKF9jb25kaXRpb25zOiBDbGF1c2UsIGNvbmNsdXNpb25zOiBDbGF1c2UpIHtcblxuICAgIGNvbnN0IGNvbmRpdGlvbnMgPSBfY29uZGl0aW9ucy5jbGF1c2VzLm1hcChzID0+IHMpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGAke2F9LCAke2J9YCk7XG5cbiAgICByZXR1cm4gY29uY2x1c2lvbnNcbiAgICAgICAgLmNsYXVzZXNcbiAgICAgICAgLm1hcChwID0+IGNsYXVzZU9mKGAke3B9IDotICR7Y29uZGl0aW9uc31gKSkgLy8gb25lIGhvcm4gY2xhdXNlIGZvciBldmVyeSBwcmVkaWNhdGUgaW4gdGhlIGNvbmNsdXNpb25cbiAgICAgICAgLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5jb25jYXQoYzIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbUlkKCk6IElkIHtcbiAgICByZXR1cm4gYCR7Q09OU1RfUFJFRklYfSR7cGFyc2VJbnQoMTAwMDAwMCAqIE1hdGgucmFuZG9tKCkrJycpfWBcbn0iLCJpbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BYnN0cmFjdFRva2VuXCI7XG5pbXBvcnQgTGV4ZXIsIHsgQXNzZXJ0QXJncywgQ29uc3RydWN0b3IgfSBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHRva2VuT2YgZnJvbSBcIi4vdG9rZW5PZlwiO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVye1xuXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRva2VuczpUb2tlbltdXG4gICAgcHJvdGVjdGVkIF9wb3M6bnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOnN0cmluZyl7IFxuICAgICAgICAvL1RPRE86IHJlY29uc3RydWN0IFwiZG8gbm90XCIgYW5kIFwiZG9lcyBub3RcIiB0b2tlbnNcbiAgICAgICAgLy9UT0RPOiBub3VucyB2cyBhZGplY3RpdmVzXG4gICAgICAgIHRoaXMudG9rZW5zID0gc291cmNlQ29kZS5zcGxpdCgvXFxzK3xcXC4vKS5tYXAoZT0+IWU/Jy4nOmUpLm1hcCh0b2tlbk9mKVxuICAgICAgICB0aGlzLl9wb3MgPSAwXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogVG9rZW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cblxuXG4gICAgXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGN1cnJlbnQgdG9rZW4gaWZmIG9mIGdpdmVuIHR5cGUgYW5kIG1vdmUgdG8gbmV4dDsgXG4gICAgICogZWxzZSByZXR1cm4gdW5kZWZpbmVkIGFuZCBkb24ndCBtb3ZlLlxuICAgICAqIEBwYXJhbSBhcmdzIFxuICAgICAqIEByZXR1cm5zIFxuICAgICAqL1xuICAgIGFzc2VydCA8VD4oY2xheno6Q29uc3RydWN0b3I8VD4sIGFyZ3M6QXNzZXJ0QXJncyk6IFR8dW5kZWZpbmVkIHtcblxuICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5wZWVrXG5cbiAgICAgICAgaWYgKGN1cnJlbnQgaW5zdGFuY2VvZiBjbGF6eil7XG4gICAgICAgICAgICB0aGlzLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmVycm9yT3V0Pz90cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmNyb2FrKGFyZ3MuZXJyb3JNc2c/PycnKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IFRva2VuIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Ub2tlblwiXG5pbXBvcnQgRWFnZXJMZXhlciBmcm9tIFwiLi9FYWdlckxleGVyXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIExleGVye1xuICAgIG5leHQoKTp2b2lkXG4gICAgYmFja1RvKHBvczpudW1iZXIpOnZvaWRcbiAgICBnZXQgcGVlaygpOlRva2VuXG4gICAgZ2V0IHBvcygpOm51bWJlclxuICAgIGNyb2FrKGVycm9yTXNnOnN0cmluZyk6dm9pZCAgIFxuICAgIGFzc2VydCA8VD4oY2xheno6Q29uc3RydWN0b3I8VD4sIGFyZ3M6QXNzZXJ0QXJncyk6IFR8dW5kZWZpbmVkIFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzc2VydEFyZ3N7XG4gICAgZXJyb3JNc2c/OnN0cmluZ1xuICAgIGVycm9yT3V0Pzpib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlcihzb3VyY2VDb2RlOnN0cmluZyl7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUpXG59XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0gbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gVFxuIiwiaW1wb3J0IGFkamVjdGl2ZXMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9hZGplY3RpdmVzJ1xuaW1wb3J0IGluZGVmaW5pdGVfYXJ0aWNsZXMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9pbmRlZmluaXRlX2FydGljbGVzJ1xuaW1wb3J0IGRlZmluaXRlX2FydGljbGVzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvZGVmaW5pdGVfYXJ0aWNsZXMnXG5pbXBvcnQgY29wdWxhcyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2NvcHVsYXMnXG5pbXBvcnQgaHZlcmJzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvaHZlcmJzJ1xuaW1wb3J0IGl2ZXJicyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2l2ZXJicydcbmltcG9ydCBtdmVyYnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9tdmVyYnMnXG5pbXBvcnQgbmVnYXRpb25zIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvbmVnYXRpb25zJ1xuaW1wb3J0IG5vbnN1YmNvbmogZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9ub25zdWJjb25qJ1xuaW1wb3J0IG5vdW5zIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvbm91bnMnXG5pbXBvcnQgcHJlcG9zaXRpb25zIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvcHJlcG9zaXRpb25zJ1xuaW1wb3J0IGV4aXN0cXVhbnQgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9leGlzdGVudGlhbF9xdWFudGlmaWVycydcbmltcG9ydCB1bmlxdWFudCBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL3VuaXZlcnNhbF9xdWFudGlmaWVycydcbmltcG9ydCByZWxwcm9ucyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL3JlbHByb25zJ1xuaW1wb3J0IHN1YmNvbmogZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9zdWJjb25qJ1xuaW1wb3J0IHRoZW4gZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy90aGVuJ1xuaW1wb3J0IEFydGljbGUgZnJvbSAnLi4vYXN0L3Rva2Vucy9BcnRpY2xlJ1xuaW1wb3J0IENvcHVsYSBmcm9tICcuLi9hc3QvdG9rZW5zL0NvcHVsYSdcbmltcG9ydCBIVmVyYiBmcm9tICcuLi9hc3QvdG9rZW5zL0hWZXJiJ1xuaW1wb3J0IElWZXJiIGZyb20gJy4uL2FzdC90b2tlbnMvSVZlcmInXG5pbXBvcnQgTVZlcmIgZnJvbSAnLi4vYXN0L3Rva2Vucy9NVmVyYidcbmltcG9ydCBOZWdhdGlvbiBmcm9tICcuLi9hc3QvdG9rZW5zL05lZ2F0aW9uJ1xuaW1wb3J0IE5vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tICcuLi9hc3QvdG9rZW5zL05vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbidcbmltcG9ydCBQcmVwb3NpdGlvbiBmcm9tICcuLi9hc3QvdG9rZW5zL1ByZXBvc2l0aW9uJ1xuaW1wb3J0IFF1YW50aWZpZXIgZnJvbSAnLi4vYXN0L3Rva2Vucy9RdWFudGlmaWVyJ1xuaW1wb3J0IFRoZW4gZnJvbSAnLi4vYXN0L3Rva2Vucy9UaGVuJ1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tICcuLi9hc3QvdG9rZW5zL1JlbGF0aXZlUHJvbm91bidcbmltcG9ydCBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSAnLi4vYXN0L3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24nXG5pbXBvcnQgTm91biBmcm9tICcuLi9hc3QvdG9rZW5zL05vdW4nXG5pbXBvcnQgQWRqZWN0aXZlIGZyb20gJy4uL2FzdC90b2tlbnMvQWRqZWN0aXZlJ1xuaW1wb3J0IFRva2VuIGZyb20gJy4uL2FzdC9pbnRlcmZhY2VzL1Rva2VuJ1xuaW1wb3J0IEZ1bGxTdG9wIGZyb20gJy4uL2FzdC90b2tlbnMvRnVsbFN0b3AnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRva2VuT2Yoc3RyaW5nOnN0cmluZyk6VG9rZW57XG4gICAgXG4gICAgaWYgKGluZGVmaW5pdGVfYXJ0aWNsZXMuY29uY2F0KGRlZmluaXRlX2FydGljbGVzKS5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBBcnRpY2xlKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoY29wdWxhcy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGEoc3RyaW5nKVxuICAgIH1lbHNlIGlmIChodmVyYnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgSFZlcmIoc3RyaW5nKVxuICAgIH1lbHNlIGlmIChpdmVyYnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgSVZlcmIoc3RyaW5nKVxuICAgIH1lbHNlIGlmIChtdmVyYnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgTVZlcmIoc3RyaW5nKVxuICAgIH1lbHNlIGlmIChuZWdhdGlvbnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgTmVnYXRpb24oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChub25zdWJjb25qLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IE5vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKHByZXBvc2l0aW9ucy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBQcmVwb3NpdGlvbihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKGV4aXN0cXVhbnQuY29uY2F0KHVuaXF1YW50KS5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBRdWFudGlmaWVyKHN0cmluZylcbiAgICB9ZWxzZSBpZiAodGhlbi5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBUaGVuKHN0cmluZylcbiAgICB9ZWxzZSBpZiAocmVscHJvbnMuaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgUmVsYXRpdmVQcm9ub3VuKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoc3ViY29uai5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChub3Vucy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBOb3VuKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoYWRqZWN0aXZlcy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBBZGplY3RpdmUoc3RyaW5nKVxuICAgIH1lbHNlIGlmICgnLicgPT09IHN0cmluZyl7XG4gICAgICAgIHJldHVybiBuZXcgRnVsbFN0b3AoJy4nKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgQWRqZWN0aXZlKHN0cmluZylcbn0iLCJpbXBvcnQgQXN0IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Bc3RcIjtcbmltcG9ydCBCaW5hcnlRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQmluYXJ5UXVlc3Rpb25cIjtcbmltcG9ydCBDb21wb3VuZFNlbnRlbmNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Db21wb3VuZFNlbnRlbmNlXCI7XG5pbXBvcnQgRGVjbGFyYXRpb24gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0RlY2xhcmF0aW9uXCI7XG5pbXBvcnQgUXVlc3Rpb24gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1F1ZXN0aW9uXCI7XG5pbXBvcnQgU2ltcGxlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1NpbXBsZVNlbnRlbmNlXCI7XG5pbXBvcnQgVmVyYlNlbnRlbmNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Db21wbGVtZW50XCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vYXN0L3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IFN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IENvbXBsZXhTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db21wbGV4U2VudGVuY2VcIjtcbmltcG9ydCBDb25qdW5jdGl2ZVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0Nvbmp1bmN0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBDb3B1bGFRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db3B1bGFRdWVzdGlvblwiO1xuaW1wb3J0IENvcHVsYVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvcHVsYVNlbnRlbmNlXCI7XG5pbXBvcnQgSW50cmFuc2l0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvSW50cmFuc2l0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL01vbm90cmFuc2l0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBBZGplY3RpdmUgZnJvbSBcIi4uL2FzdC90b2tlbnMvQWRqZWN0aXZlXCI7XG5pbXBvcnQgQXJ0aWNsZSBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi9hc3QvdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IElWZXJiIGZyb20gXCIuLi9hc3QvdG9rZW5zL0lWZXJiXCI7XG5pbXBvcnQgTVZlcmIgZnJvbSBcIi4uL2FzdC90b2tlbnMvTVZlcmJcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9OZWdhdGlvblwiO1xuaW1wb3J0IE5vdW4gZnJvbSBcIi4uL2FzdC90b2tlbnMvTm91blwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL1ByZXBvc2l0aW9uXCI7XG5pbXBvcnQgUXVhbnRpZmllciBmcm9tIFwiLi4vYXN0L3Rva2Vucy9RdWFudGlmaWVyXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuaW1wb3J0IFRoZW4gZnJvbSBcIi4uL2FzdC90b2tlbnMvVGhlblwiO1xuaW1wb3J0IExleGVyLCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCI7XG5pbXBvcnQgUGFyc2VyIGZyb20gXCIuL1BhcnNlclwiO1xuaW1wb3J0IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Db3B1bGFTdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vYXN0L3Rva2Vucy9SZWxhdGl2ZVByb25vdW5cIjtcbmltcG9ydCBDb25zdGl0dWVudCBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNQYXJzZXIgaW1wbGVtZW50cyBQYXJzZXIge1xuXG4gICAgcHJvdGVjdGVkIGx4OiBMZXhlclxuXG4gICAgY29uc3RydWN0b3Ioc291cmNlQ29kZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMubHggPSBnZXRMZXhlcihzb3VyY2VDb2RlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCB0cnk8VCBleHRlbmRzIEFzdD4obWV0aG9kOiAoKSA9PiBUKSB7XG5cbiAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubHgucG9zXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QoKVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UpXG4gICAgICAgICAgICB0aGlzLmx4LmJhY2tUbyhtZW1lbnRvKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgZXJyb3JPdXQoZXJyb3JNc2c6IHN0cmluZyk6IENvbnN0aXR1ZW50IHtcbiAgICAgICAgdGhpcy5seC5jcm9hayhlcnJvck1zZylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTXNnKVxuICAgIH1cblxuICAgIHBhcnNlKCk6IENvbnN0aXR1ZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VEZWNsYXJhdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VOb3VuUGhyYXNlKSAvLyBmb3IgcXVpY2sgdG9waWMgcmVmZXJlbmNlXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VEZWNsYXJhdGlvbiA9ICgpOiBEZWNsYXJhdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29tcG91bmQpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlU2ltcGxlKSBcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlRGVjbGFyYXRpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlUXVlc3Rpb24gPSAoKTogUXVlc3Rpb24gPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUJpbmFyeVF1ZXN0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VRdWVzdGlvbigpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VTaW1wbGUgPSAoKTogU2ltcGxlU2VudGVuY2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvcHVsYVNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZVZlcmJTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlU2ltcGxlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBvdW5kID0gKCk6IENvbXBvdW5kU2VudGVuY2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvbXBsZXgpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlQ29uanVuY3RpdmUpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZUNvbXBvdW5kKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVZlcmJTZW50ZW5jZSA9ICgpOiBWZXJiU2VudGVuY2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUludHJhbnNpdGl2ZVNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVZlcmJTZW50ZW5jZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb3B1bGFTZW50ZW5jZSA9ICgpOiBDb3B1bGFTZW50ZW5jZSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IGNvcHVsYSA9IHRoaXMubHguYXNzZXJ0KENvcHVsYSwgeyBlcnJvck1zZzogJ3BhcnNlQ29wdWxhU2VudGVuY2UoKSwgZXhwZWN0ZWQgY29wdWxhJyB9KVxuICAgICAgICBjb25zdCBuZWdhdGlvbiA9IHRoaXMubHguYXNzZXJ0KE5lZ2F0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIHJldHVybiBuZXcgQ29wdWxhU2VudGVuY2Uoc3ViamVjdCwgY29wdWxhIGFzIENvcHVsYSwgcHJlZGljYXRlLCBuZWdhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wbGV4ID0gKCk6IENvbXBsZXhTZW50ZW5jZSA9PiB7XG5cbiAgICAgICAgY29uc3Qgc3ViY29uaiA9IHRoaXMubHguYXNzZXJ0KFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcblxuICAgICAgICBpZiAoc3ViY29uaikge1xuICAgICAgICAgICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICB0aGlzLmx4LmFzc2VydChUaGVuLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICAgICAgY29uc3Qgb3V0Y29tZSA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb21wbGV4U2VudGVuY2UoY29uZGl0aW9uLCBvdXRjb21lLCBzdWJjb25qKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgb3V0Y29tZSA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgY29uc3Qgc3ViY29uaiA9IHRoaXMubHguYXNzZXJ0KFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiwgeyBlcnJvck91dDogdHJ1ZSwgZXJyb3JNc2c6ICdleHBlY3RlZCBzdWJvcmRpbmF0aW5nIGNvbmp1bmN0aW9uJyB9KVxuICAgICAgICAgICAgY29uc3QgY29uZGl0aW9uID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbXBsZXhTZW50ZW5jZShjb25kaXRpb24sIG91dGNvbWUsIHN1YmNvbmogYXMgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSA9ICgpOiBJbnRyYW5zaXRpdmVTZW50ZW5jZSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IG5lZ2F0aW9uID0gdGhpcy5seC5hc3NlcnQoTmVnYXRpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IGl2ZXJiID0gdGhpcy5seC5hc3NlcnQoSVZlcmIsIHsgZXJyb3JNc2c6ICdwYXJzZUludHJhbnNpdGl2ZVNlbnRlbmNlKCksIGV4cGVjdGVkIGktdmVyYicgfSlcbiAgICAgICAgY29uc3QgY29tcGxlbWVudHMgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKVxuICAgICAgICByZXR1cm4gbmV3IEludHJhbnNpdGl2ZVNlbnRlbmNlKHN1YmplY3QsIGl2ZXJiIGFzIElWZXJiLCBjb21wbGVtZW50cywgbmVnYXRpb24pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSA9ICgpOiBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgbmVnYXRpb24gPSB0aGlzLmx4LmFzc2VydChOZWdhdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgbXZlcmIgPSB0aGlzLmx4LmFzc2VydChNVmVyYiwgeyBlcnJvck1zZzogJ3BhcnNlTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSgpLCBleHBlY3RlZCBpLXZlcmInIH0pXG4gICAgICAgIGNvbnN0IGNzMSA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgY3MyID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcbiAgICAgICAgcmV0dXJuIG5ldyBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlKHN1YmplY3QsIG12ZXJiIGFzIE1WZXJiLCBvYmplY3QsIGNzMS5jb25jYXQoY3MyKSwgbmVnYXRpb24pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQmluYXJ5UXVlc3Rpb24gPSAoKTogQmluYXJ5UXVlc3Rpb24gPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvcHVsYVF1ZXN0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VCaW5hcnlRdWVzdGlvbigpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb3B1bGFRdWVzdGlvbiA9ICgpOiBDb3B1bGFRdWVzdGlvbiA9PiB7XG4gICAgICAgIGNvbnN0IGNvcHVsYSA9IHRoaXMubHguYXNzZXJ0KENvcHVsYSwgeyBlcnJvck1zZzogJ3BhcnNlQ29wdWxhUXVlc3Rpb24oKSwgZXhwZWN0ZWQgY29wdWxhJyB9KVxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIHJldHVybiBuZXcgQ29wdWxhUXVlc3Rpb24oc3ViamVjdCwgcHJlZGljYXRlLCBjb3B1bGEgYXMgQ29wdWxhKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU5vdW5QaHJhc2UgPSAoKTogTm91blBocmFzZSA9PiB7XG4gICAgICAgIGNvbnN0IHF1YW50aWZpZXIgPSB0aGlzLmx4LmFzc2VydChRdWFudGlmaWVyLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBhcnRpY2xlID0gdGhpcy5seC5hc3NlcnQoQXJ0aWNsZSwgeyBlcnJvck91dDogZmFsc2UgfSlcblxuICAgICAgICBsZXQgYWRqZWN0aXZlcyA9IFtdXG4gICAgICAgIGxldCBhZGpcblxuICAgICAgICB3aGlsZSAoYWRqID0gdGhpcy5seC5hc3NlcnQoQWRqZWN0aXZlLCB7IGVycm9yT3V0OiBmYWxzZSB9KSkge1xuICAgICAgICAgICAgYWRqZWN0aXZlcy5wdXNoKGFkailcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5vdW4gPSB0aGlzLmx4LmFzc2VydChOb3VuLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBzdWJvcmRpbmF0ZUNsYXVzZSA9IHRoaXMudHJ5KHRoaXMucGFyc2VTdWJvcmRpbmF0ZUNsYXVzZSlcbiAgICAgICAgY29uc3QgY29tcGxlbWVudHMgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKSBcblxuICAgICAgICByZXR1cm4gbmV3IE5vdW5QaHJhc2UoYWRqZWN0aXZlcywgY29tcGxlbWVudHMsIG5vdW4sIHF1YW50aWZpZXIsIGFydGljbGUsIHN1Ym9yZGluYXRlQ2xhdXNlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBsZW1lbnRzID0gKCk6IENvbXBsZW1lbnRbXSA9PiB7XG5cbiAgICAgICAgY29uc3QgY29tcGxlbWVudHMgPSBbXVxuICAgICAgICBsZXQgY29tcFxuXG4gICAgICAgIHdoaWxlIChjb21wID0gdGhpcy50cnkodGhpcy5wYXJzZUNvbXBsZW1lbnQpKSB7XG4gICAgICAgICAgICBjb21wbGVtZW50cy5wdXNoKGNvbXApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcGxlbWVudHNcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wbGVtZW50ID0gKCk6IENvbXBsZW1lbnQgPT4ge1xuICAgICAgICBjb25zdCBwcmVwb3NpdGlvbiA9IHRoaXMubHguYXNzZXJ0KFByZXBvc2l0aW9uLCB7IGVycm9yTXNnOiAncGFyc2VDb21wbGVtZW50KCkgZXhwZWN0ZWQgcHJlcG9zaXRpb24nIH0pXG4gICAgICAgIGNvbnN0IG5vdW5QaHJhc2UgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIHJldHVybiBuZXcgQ29tcGxlbWVudChwcmVwb3NpdGlvbiBhcyBQcmVwb3NpdGlvbiwgbm91blBocmFzZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VTdWJvcmRpbmF0ZUNsYXVzZSA9ICgpOiBTdWJvcmRpbmF0ZUNsYXVzZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UpIFxuICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVN1Ym9yZGluYXRlQ2xhdXNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlID0gKCk6Q29wdWxhU3Vib3JkaW5hdGVDbGF1c2UgPT57XG4gICAgICAgIGNvbnN0IHJlbHByb24gPSB0aGlzLmx4LmFzc2VydChSZWxhdGl2ZVByb25vdW4sIHtlcnJvck1zZzoncGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSgpIGV4cGVjdGVkIHJlbGF0aXZlIHByb25vdW4nfSlcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7ZXJyb3JNc2c6J3BhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UoKSBleHBlY3RlZCBjb3B1bGEnfSlcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZShyZWxwcm9uIGFzIFJlbGF0aXZlUHJvbm91biwgc3ViamVjdCwgY29wdWxhIGFzIENvcHVsYSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb25qdW5jdGl2ZSA9ICgpOiBDb25qdW5jdGl2ZVNlbnRlbmNlID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOT1QgSU1QTEVNRU5URUQhIFRPRE8hJylcbiAgICB9XG5cbn0iLCJpbXBvcnQgQXN0IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Bc3RcIjtcbmltcG9ydCBCYXNpY1BhcnNlciBmcm9tIFwiLi9CYXNpY1BhcnNlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgUGFyc2Vye1xuICAgIHBhcnNlKCk6QXN0ICAgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTpzdHJpbmcpe1xuICAgIHJldHVybiBuZXcgQmFzaWNQYXJzZXIoc291cmNlQ29kZSlcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHBsIGZyb20gJ3RhdS1wcm9sb2cnXG5pbXBvcnQgQXJ0aWNsZSBmcm9tICcuL2FzdC90b2tlbnMvQXJ0aWNsZSc7XG5pbXBvcnQgQ29wdWxhIGZyb20gJy4vYXN0L3Rva2Vucy9Db3B1bGEnO1xuaW1wb3J0IE5vdW4gZnJvbSAnLi9hc3QvdG9rZW5zL05vdW4nO1xuaW1wb3J0IHsgZ2V0TGV4ZXIgfSBmcm9tICcuL2xleGVyL0xleGVyJztcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gJy4vcGFyc2VyL1BhcnNlcic7XG5pbXBvcnQgUHJvbG9nLCB7IGdldFByb2xvZyB9IGZyb20gJy4vcHJvbG9nL1Byb2xvZyc7XG5pbXBvcnQgVGF1UHJvbG9nIGZyb20gJy4vcHJvbG9nL1RhdVByb2xvZyc7XG5cblxuLy8gUFJPTE9HIFRFU1QgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb25zdCBwcm8gPSBnZXRQcm9sb2coKTtcbi8vICh3aW5kb3cgYXMgYW55KS5wcm8gPSBwcm87XG4vLyAoYXN5bmMgKCkgPT4ge1xuLy8gICAgIGF3YWl0IHByby5hc3NlcnQoJ2NhcHJhKHNjZW1vKScpXG4vLyAgICAgYXdhaXQgcHJvLmFzc2VydCgnbWFtbWFsKHBlbG9zbyknKVxuLy8gICAgIGF3YWl0IHByby5hc3NlcnQoJ21hbW1hbChmaWRvKScpXG4vLyAgICAgYXdhaXQgcHJvLmFzc2VydCgnbWFtbWFsKFgpIDotIGNhcHJhKFgpJylcbi8vICAgICBjb25zb2xlLmxvZyhhd2FpdCBwcm8ucXVlcnkoJ21hbW1hbChYKS4nKSlcbi8vICAgICBhd2FpdCBwcm8ucmV0cmFjdCgnY2FwcmEoc2NlbW8pJylcbi8vICAgICBjb25zb2xlLmxvZyhhd2FpdCBwcm8ucXVlcnkoJ21hbW1hbChYKS4nKSlcbi8vIH0pKCk7XG4vLyAvLyAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb25zb2xlLmxvZygodG9rZW5PZignYScpIGFzIEFydGljbGUpLmlzRGVmaW5pdGUoKSlcbi8vIGNvbnNvbGUubG9nKHRva2VuT2YoJ2EnKSAgaW5zdGFuY2VvZiBBcnRpY2xlKVxuLy8gY29uc29sZS5sb2codG9rZW5PZignYScpICBpbnN0YW5jZW9mIFF1YW50aWZpZXIpXG4vLyBjb25zb2xlLmxvZyh0b2tlbk9mKCdldmVyeScpICBpbnN0YW5jZW9mIFF1YW50aWZpZXIpXG4vLyBjb25zb2xlLmxvZyh0b2tlbk9mKCdhJykudG9TdHJpbmcoKSlcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIGNvbnN0IGxleGVyID0gZ2V0TGV4ZXIoJ3RoZSBjYXQgaXMgYSBjYXQuJylcbi8vIGNvbnNvbGUubG9nKGxleGVyKVxuLy8gY29uc29sZS5sb2coJ2lzIGl0IGEgbm91bj8nLCBsZXhlci5hc3NlcnQoTm91biwge2Vycm9yT3V0OmZhbHNlfSkgKVxuLy8gY29uc29sZS5sb2cobGV4ZXIucGVlaylcbi8vIGNvbnNvbGUubG9nKCdpcyBpdCBhIGNvcHVsYT8nLCBsZXhlci5hc3NlcnQoQ29wdWxhLCB7ZXJyb3JPdXQ6ZmFsc2V9KSApXG4vLyBjb25zb2xlLmxvZyhsZXhlci5wZWVrKVxuLy8gY29uc29sZS5sb2coJ2lzIGl0IGFuIGFydGljbGU/JywgbGV4ZXIuYXNzZXJ0KEFydGljbGUsIHtlcnJvck91dDpmYWxzZX0pIClcbi8vIGNvbnNvbGUubG9nKGxleGVyLnBlZWspXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgY2F0IGlzIGJpZycpLnBhcnNlKCkpXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBiaWcgY2F0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBiaWcgY2F0IG9uIHRoZSB0YWJsZSBpcyBlYXRpbmcgdHVuYScpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgYmlnIGNhdCBvbiB0aGUgbWF0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ2V2ZXJ5IGRvZyBpcyBzdHVwaWQnKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGNhdCB0aGF0IGlzIHNtYXJ0JykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ25vZGVqcyBpcyBub3QgaGVscGZ1bCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCdpZiB0aGUgZG9nIGlzIHN0dXBpZCB0aGVuIHRoZSBjYXQgaXMgaGFwcHknKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGNhdCBpcyBoYXBweSBpZiB0aGUgZG9nIGlzIHN0dXBpZCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coKHdpbmRvdyBhcyBhbnkpLmFzdCA9IGdldFBhcnNlcigndGhlIGNvbG9yIG9mIHRoZSBidXR0b24gaXMgcmVkJykucGFyc2UoKSlcbi8vIGNvbnNvbGUubG9nKCh3aW5kb3cgYXMgYW55KS5hc3QgPSBnZXRQYXJzZXIoJ3RoZSBjb2xvciBvZiB0aGUgYnV0dG9uIG9uIHRoZSBibGFjayBkaXYgaXMgcmVkJykucGFyc2UoKSlcblxuZnVuY3Rpb24gdGVzdChzdHJpbmc6c3RyaW5nKXtcbiAgICBjb25zb2xlLmxvZyhzdHJpbmcpXG4gICAgY29uc29sZS5sb2coZ2V0UGFyc2VyKHN0cmluZykucGFyc2UoKS50b1Byb2xvZygpKVxufVxuXG50ZXN0KCd0aGUgY2F0IGlzIG9uIHRoZSBtYXQnKVxudGVzdCgndGhlIGNhdCB0aGF0IGlzIHJlZCBpcyBvbiB0aGUgbWF0JylcbnRlc3QoJ3RoZSBiaWcgY2F0IHRoYXQgaXMgb24gdGhlIG1hdCBpcyBibGFjaycpXG50ZXN0KCdldmVyeSBjYXQgaXMgcmVkJylcbnRlc3QoJ2V2ZXJ5IHJlZCBjYXQgaXMgb24gdGhlIG1hdCcpXG50ZXN0KCd0aGUgY2F0IGV4aXN0cyBvbiB0aGUgbWF0JylcbnRlc3QoJ2lmIHRoZSBjYXQgaXMgb24gdGhlIG1hdCB0aGVuIHRoZSBjYXQgaXMgcmVkJylcbnRlc3QoJ3RoZSBjYXQgaXMgbm90IHJlZCcpXG50ZXN0KCdldmVyeSBjYXQgaXMgbm90IHJlZCcpXG50ZXN0KCd0cnVtcCBpcyBub3QgYSBncmVhdCBwcmVzaWRlbnQnKVxuXG5cbi8vIGNvbnN0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJylcbi8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk/LmFwcGVuZENoaWxkKHApXG5cbi8vIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKT8uYXBwZW5kQ2hpbGQodGV4dGFyZWEpXG5cbi8vIHRleHRhcmVhLm9uaW5wdXQgPSAoZSk9Pntcbi8vICAgICBwLmlubmVySFRNTCA9IGdldFBhcnNlcih0ZXh0YXJlYS52YWx1ZSkucGFyc2UoKS50b1Byb2xvZygpLmNsYXVzZXMucmVkdWNlKChjMSxjMik9PmAke2MxfTxicj4ke2MyfWApXG4vLyB9XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=