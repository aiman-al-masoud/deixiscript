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
        return this.subject.isUniversallyQuantified() ?
            (0, Clause_1.makeHornClauses)(subject, predicate) :
            subject.concat(predicate, { asRheme: true });
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
        const theme = this.subject.toProlog(newArgs);
        const rheme = (0, Clause_1.clauseOf)(this.iverb.string, subjectId)
            .concat(this.complements.map(c => c.toProlog(newArgs)).reduce((c1, c2) => c1.concat(c2)));
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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicClause = void 0;
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/clauses/Clause.ts");
const ListClause_1 = __importDefault(__webpack_require__(/*! ./ListClause */ "./app/src/clauses/ListClause.ts"));
class BasicClause {
    constructor(predicate, args, negated = false) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
    }
    concat(other, opts) {
        return new ListClause_1.default(this.toList().concat(other.toList()));
    }
    copy(opts) {
        return new BasicClause(this.predicate, this.args.map(a => { var _a; return (opts === null || opts === void 0 ? void 0 : opts.map) ? (_a = opts === null || opts === void 0 ? void 0 : opts.map[a]) !== null && _a !== void 0 ? _a : a : a; }), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated);
    }
    toList() {
        return [this.copy()];
    }
    about(id) {
        return this.args.includes(id) ? this.toList() : [];
    }
    flatList() {
        return this.toList();
    }
    toString() {
        const core = `${this.predicate}(${this.args.reduce((a1, a2) => a1 + ', ' + a2)})`;
        return this.negated ? `not(${core})` : core;
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
    return `${exports.CONST_PREFIX}${parseInt(10 * Math.random() + '')}`;
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
    concat(other, opts) {
        return new ListClause_1.default(this.toList().concat(other.toList()));
    }
    copy(opts) {
        return new HornClause(this.condition.map(c => c.copy(opts)), this.conclusion.copy(opts));
    }
    toList() {
        return [this.copy()];
    }
    toString() {
        return `${this.conclusion.toString()} :- ${this.condition.map(c => c.toString()).reduce((c1, c2) => c1 + ', ' + c2)}`;
    }
    get entities() {
        return Array.from(new Set(this.condition.flatMap(c => c.entities).concat(this.conclusion.entities)));
    }
    get theme() {
        return this.condition.flatMap(c => c.theme).reduce((c1, c2) => c2.concat(c2));
    }
    get rheme() {
        return this.copy(); // dunno what I'm doin'
    }
    about(id) {
        return this.conclusion.about(id).concat(this.condition.flatMap(c => c.about(id)));
    }
    flatList() {
        return this.toList();
    }
}
exports.HornClause = HornClause;


/***/ }),

/***/ "./app/src/clauses/ListClause.ts":
/*!***************************************!*\
  !*** ./app/src/clauses/ListClause.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
            return new ListClause([this.copy(), ...other.toList()]);
        }
        else if (other.negated) {
            return new ListClause([...this.toList(), other.copy()]);
        }
        else {
            return new ListClause([...this.toList(), ...other.toList()]);
        }
    }
    copy(opts) {
        return new ListClause(this.clauses.map(c => c.copy(opts)), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated);
    }
    toList() {
        return this.clauses.concat([]);
    }
    toString() {
        return this.negated ? `not(${this.clauses.toString()})` : this.clauses.toString();
    }
    about(ids) {
        return this.clauses.flatMap(c => c.about(ids));
    }
    flatList() {
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
    const clause = (0, Parser_1.getParser)(string).parse().toProlog().copy({ map: { 'id1': 1000, 'id2': 2000 } });
    console.log(clause.flatList().map(c => c.toString()));
    console.log(clause);
    console.log('entities', clause.entities);
    console.log('theme', clause.theme);
    console.log('rheme', clause.rheme);
    console.log(clause.about('id0'));
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
test('trump is not a great president'); // probably need an and predicate
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvYWRqZWN0aXZlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9jb3B1bGFzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2RlZmluaXRlX2FydGljbGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2V4aXN0ZW50aWFsX3F1YW50aWZpZXJzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2h2ZXJicy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9pbmRlZmluaXRlX2FydGljbGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL2l2ZXJicy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy9tdmVyYnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvbmVnYXRpb25zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL25vbnN1YmNvbmoudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvbm91bnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvcHJlcG9zaXRpb25zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3JlbHByb25zLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9yZXMvdG9rZW5zL3N1YmNvbmoudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3Jlcy90b2tlbnMvdGhlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvcmVzL3Rva2Vucy91bml2ZXJzYWxfcXVhbnRpZmllcnMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Db21wbGVtZW50LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3BocmFzZXMvQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Ob3VuUGhyYXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Db21wbGV4U2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvcHVsYVF1ZXN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Db3B1bGFTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvSW50cmFuc2l0aXZlU2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL01vbm90cmFuc2l0aXZlU2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0Fic3RyYWN0VG9rZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0FkamVjdGl2ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQXJ0aWNsZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQ29wdWxhLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9GdWxsU3RvcC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvSFZlcmIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0lWZXJiLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9NVmVyYi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTmVnYXRpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL05vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTm91bi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUHJlcG9zaXRpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1F1YW50aWZpZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1JlbGF0aXZlUHJvbm91bi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9UaGVuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9CYXNpY0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9Ib3JuQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9MaXN0Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvdG9rZW5PZi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9CYXNpY1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiYmlnXCIsXG4gICAgXCJzbWFsbFwiLFxuICAgIFwiaGVscGZ1bFwiLFxuICAgIFwicmVkXCIsXG4gICAgXCJibGFja1wiLFxuICAgIFwiZ3JlYXRcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImlzXCIsXG4gICAgXCJhcmVcIixcbiAgICBcImJlXCJcbl0iLCJleHBvcnQgZGVmYXVsdFtcbiAgICBcInRoZVwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwic29tZVwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiZG9cIixcbiAgICBcImRvZXNcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImFcIixcbiAgICBcImFuXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJleGlzdFwiLFxuICAgIFwiZXhpc3RzXCIsXG4gICAgXCJydW5cIixcbiAgICBcImdyb3dcIixcbiAgICBcImRpZVwiLFxuICAgIFwibGl2ZVwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiZWF0XCIsXG4gICAgXCJkcmlua1wiLFxuICAgIFwid2F0Y2hcIixcbiAgICBcIm1ha2VcIixcbiAgICBcImhpdFwiLFxuICAgIFwiY2xpY2tcIlxuXSIsImV4cG9ydCBkZWZhdWx0IFtcbiAgICBcImRvZXNuJ3RcIixcbiAgICBcImRvZXMgbm90XCIsXG4gICAgJ25vdCcsXG4gICAgXCJkb24ndFwiLFxuICAgICdkbyBub3QnXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiYW5kXCIsXG4gICAgXCJvclwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiY2F0XCIsXG4gICAgXCJtYXRcIixcbiAgICBcInRhYmxlXCIsXG4gICAgXCJkb2dcIixcbiAgICBcIm5vZGVqc1wiLFxuICAgIFwiY29sb3JcIixcbiAgICBcImJ1dHRvblwiLFxuICAgIFwiZGl2XCIsXG4gICAgXCJwcmVzaWRlbnRcIixcbiAgICBcInRydW1wXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJ0b1wiLFxuICAgIFwid2l0aFwiLFxuICAgIFwiZnJvbVwiLFxuICAgIFwib2ZcIixcbiAgICBcIm92ZXJcIixcbiAgICBcIm9uXCIsXG4gICAgXCJhdFwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwidGhhdFwiXG5dIiwiZXhwb3J0IGRlZmF1bHQgW1xuICAgIFwiaWZcIixcbiAgICBcIndoZW5cIixcbiAgICBcImJlY2F1c2VcIixcbiAgICBcIndoaWxlXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJ0aGVuXCJcbl0iLCJleHBvcnQgZGVmYXVsdCBbXG4gICAgXCJldmVyeVwiLFxuICAgIFwiYWxsXCIsXG4gICAgXCJlYWNoXCJcbl0iLCJpbXBvcnQgeyBUb1Byb2xvZ0FyZ3MgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZ2V0UmFuZG9tSWQsIElkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuL05vdW5QaHJhc2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGxlbWVudCBpbXBsZW1lbnRzIFBocmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVwb3NpdGlvbjogUHJlcG9zaXRpb24sIHJlYWRvbmx5IG5vdW5QaHJhc2U6IE5vdW5QaHJhc2UpIHtcblxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2UgeyAvLyBwcmVwb3NpdGlvbihhcmdzLnN1YmplY3QsIFkpICsgbm91bnBocmFzZS50b1Byb2xvZyhzdWJqZWN0PVkpXG5cbiAgICAgICAgY29uc3Qgc3ViaklkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gKCgpOiBJZCA9PiB7IHRocm93IG5ldyBFcnJvcigndW5kZWZpbmVkIHN1YmplY3QgaWQnKSB9KSgpXG4gICAgICAgIGNvbnN0IG5ld0lkID0gZ2V0UmFuZG9tSWQoKVxuXG4gICAgICAgIHJldHVybiBjbGF1c2VPZih0aGlzLnByZXBvc2l0aW9uLnN0cmluZywgc3ViaklkLCBuZXdJZClcbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5ub3VuUGhyYXNlLnRvUHJvbG9nKHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogbmV3SWQgfSB9KSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4vTm91blBocmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSBpbXBsZW1lbnRzIFN1Ym9yZGluYXRlQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJlbHByb246IFJlbGF0aXZlUHJvbm91biwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSkge1xuXG4gICAgfVxuXG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS50b1Byb2xvZyh7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IGFyZ3M/LnJvbGVzPy5zdWJqZWN0IH0gfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vdG9rZW5zL0FkamVjdGl2ZVwiO1xuaW1wb3J0IEFydGljbGUgZnJvbSBcIi4uL3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vdG9rZW5zL05vdW5cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi90b2tlbnMvUXVhbnRpZmllclwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4vQ29tcGxlbWVudFwiO1xuaW1wb3J0IFN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgeyBUb1Byb2xvZ0FyZ3MgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBnZXRSYW5kb21JZCwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdW5QaHJhc2UgaW1wbGVtZW50cyBQaHJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYWRqZWN0aXZlczogQWRqZWN0aXZlW10sXG4gICAgICAgIHJlYWRvbmx5IGNvbXBsZW1lbnRzOiBDb21wbGVtZW50W10sXG4gICAgICAgIHJlYWRvbmx5IG5vdW4/OiBOb3VuLFxuICAgICAgICByZWFkb25seSBxdWFudGlmaWVyPzogUXVhbnRpZmllcixcbiAgICAgICAgcmVhZG9ubHkgYXJ0aWNsZT86IEFydGljbGUsXG4gICAgICAgIHJlYWRvbmx5IHN1Ym9yZENsYXVzZT86IFN1Ym9yZGluYXRlQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBpc1VuaXZlcnNhbGx5UXVhbnRpZmllZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVhbnRpZmllcj8uaXNVbml2ZXJzYWwoKSA/PyBmYWxzZVxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2Uge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAuYWRqZWN0aXZlc1xuICAgICAgICAgICAgLm1hcChhID0+IGEuc3RyaW5nKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLm5vdW4gPyBbdGhpcy5ub3VuLnN0cmluZ10gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihwLCBzdWJqZWN0SWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsYzIpPT5jMS5jb25jYXQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLmNvbXBsZW1lbnRzLm1hcChjPT5jLnRvUHJvbG9nKG5ld0FyZ3MpKS5yZWR1Y2UoKGMxLCBjMik9PmMxLmNvbmNhdChjMiksIGVtcHR5Q2xhdXNlKCkpKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLnN1Ym9yZENsYXVzZT8udG9Qcm9sb2cobmV3QXJncykgPz8gZW1wdHlDbGF1c2UoKSlcblxuICAgIH1cblxufSIsImltcG9ydCBDb21wb3VuZFNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbXBvdW5kU2VudGVuY2VcIjtcbmltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBtYWtlSG9ybkNsYXVzZXMsIENsYXVzZSwgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TaW1wbGVTZW50ZW5jZVwiO1xuaW1wb3J0IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tIFwiLi4vdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuXG4vKipcbiAqIEEgc2VudGVuY2UgdGhhdCByZWxhdGVzIHR3byBzaW1wbGUgc2VudGVuY2VzIGh5cG90YWN0aWNhbGx5LCBpbiBhIFxuICogY29uZGl0aW9uLW91dGNvbWUgcmVsYXRpb25zaGlwLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wbGV4U2VudGVuY2UgaW1wbGVtZW50cyBDb21wb3VuZFNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogU2ltcGxlU2VudGVuY2UsXG4gICAgICAgIHJlYWRvbmx5IG91dGNvbWU6IFNpbXBsZVNlbnRlbmNlLFxuICAgICAgICByZWFkb25seSBzdWJjb25qOiBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24pIHtcblxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2Uge1xuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICAvL1RPRE86IHRoaXMgaXMgV1JPTkcsIHN1YmplY3Qgb2YgY29uZGl0aW9uIG1heSBOT1QgYWx3YXlzIGJlIHRoZSBzdWJqZWN0IG9mIHRoZSBvdXRjb21lXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMuY29uZGl0aW9uLnRvUHJvbG9nKG5ld0FyZ3MpXG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLm91dGNvbWUudG9Qcm9sb2cobmV3QXJncylcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBtYWtlSG9ybkNsYXVzZXMoY29uZGl0aW9uLCBvdXRjb21lKVxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBCaW5hcnlRdWVzdGlvbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9CaW5hcnlRdWVzdGlvblwiO1xuaW1wb3J0IHsgVG9Qcm9sb2dBcmdzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFRdWVzdGlvbiBpbXBsZW1lbnRzIEJpbmFyeVF1ZXN0aW9ue1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDpOb3VuUGhyYXNlLCByZWFkb25seSBwcmVkaWNhdGU6Tm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOkNvcHVsYSl7XG5cbiAgICB9XG4gICAgXG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyB8IHVuZGVmaW5lZCk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgeyBUb1Byb2xvZ0FyZ3MgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBnZXRSYW5kb21JZCwgbWFrZUhvcm5DbGF1c2VzIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgU2ltcGxlU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU2ltcGxlU2VudGVuY2VcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vdG9rZW5zL05lZ2F0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYVNlbnRlbmNlIGltcGxlbWVudHMgU2ltcGxlU2VudGVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDogTm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOiBDb3B1bGEsIHJlYWRvbmx5IHByZWRpY2F0ZTogTm91blBocmFzZSwgcmVhZG9ubHkgbmVnYXRpb24/OiBOZWdhdGlvbikge1xuXG4gICAgfVxuXG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyk6IENsYXVzZSB7XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKVxuICAgICAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMuc3ViamVjdC50b1Byb2xvZyhuZXdBcmdzKVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSB0aGlzLnByZWRpY2F0ZS50b1Byb2xvZyhuZXdBcmdzKS5jb3B5KHsgbmVnYXRlOiAhIXRoaXMubmVnYXRpb24gfSlcblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJqZWN0LmlzVW5pdmVyc2FsbHlRdWFudGlmaWVkKCkgP1xuICAgICAgICAgICAgbWFrZUhvcm5DbGF1c2VzKHN1YmplY3QsIHByZWRpY2F0ZSkgOlxuICAgICAgICAgICAgc3ViamVjdC5jb25jYXQocHJlZGljYXRlLCB7YXNSaGVtZTp0cnVlfSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBnZXRSYW5kb21JZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBJVmVyYiBmcm9tIFwiLi4vdG9rZW5zL0lWZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRyYW5zaXRpdmVTZW50ZW5jZSBpbXBsZW1lbnRzIFZlcmJTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLFxuICAgICAgICByZWFkb25seSBpdmVyYjogSVZlcmIsXG4gICAgICAgIHJlYWRvbmx5IGNvbXBsZW1lbnRzOiBDb21wbGVtZW50W10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cblxuICAgIHRvUHJvbG9nKGFyZ3M/OiBUb1Byb2xvZ0FyZ3MpOiBDbGF1c2Uge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKClcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIGNvbnN0IHRoZW1lID0gdGhpcy5zdWJqZWN0LnRvUHJvbG9nKG5ld0FyZ3MpXG4gICAgICAgIGNvbnN0IHJoZW1lID0gY2xhdXNlT2YodGhpcy5pdmVyYi5zdHJpbmcsIHN1YmplY3RJZClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jb25jYXQodGhpcy5jb21wbGVtZW50cy5tYXAoYyA9PiBjLnRvUHJvbG9nKG5ld0FyZ3MpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuY29uY2F0KGMyKSkpXG5cbiAgICAgICAgcmV0dXJuIHRoZW1lLmNvbmNhdChyaGVtZSwge2FzUmhlbWU6dHJ1ZX0pXG4gICAgfVxuXG59XG5cbiIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCB7IFRvUHJvbG9nQXJncyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBWZXJiU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvVmVyYlNlbnRlbmNlXCI7XG5pbXBvcnQgQ29tcGxlbWVudCBmcm9tIFwiLi4vcGhyYXNlcy9Db21wbGVtZW50XCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgTVZlcmIgZnJvbSBcIi4uL3Rva2Vucy9NVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSBpbXBsZW1lbnRzIFZlcmJTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG12ZXJiOiBNVmVyYixcbiAgICAgICAgICAgICAgICByZWFkb25seSBvYmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgY29tcGxlbWVudHM6IENvbXBsZW1lbnRbXSxcbiAgICAgICAgICAgICAgICByZWFkb25seSBuZWdhdGlvbj86IE5lZ2F0aW9uKSB7XG5cbiAgICB9XG4gICAgXG4gICAgdG9Qcm9sb2coYXJncz86IFRvUHJvbG9nQXJncyB8IHVuZGVmaW5lZCk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RUb2tlbiBpbXBsZW1lbnRzIFRva2Vue1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3RyaW5nOnN0cmluZyl7XG5cbiAgICB9ICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGplY3RpdmUgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBkZWZpbml0ZV9hcnRpY2xlcyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy9kZWZpbml0ZV9hcnRpY2xlc1wiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnRpY2xlIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcblxuICAgIGlzRGVmaW5pdGUoKXtcbiAgICAgICAgcmV0dXJuIGRlZmluaXRlX2FydGljbGVzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7XG4gICAgICAgIHJldHVybiBgQXJ0aWNsZSgke3RoaXMuc3RyaW5nfSwgaXNEZWZpbml0ZT0ke3RoaXMuaXNEZWZpbml0ZSgpfSlgXG4gICAgfVxuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYSBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ1bGxTdG9wIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFZlcmIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJVmVyYiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1WZXJiIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmVnYXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3VuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlcG9zaXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgICAgIFxufSIsImltcG9ydCBleGlzdGVudGlhbF9xdWFudGlmaWVycyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy9leGlzdGVudGlhbF9xdWFudGlmaWVyc1wiO1xuaW1wb3J0IHVuaXZlcnNhbF9xdWFudGlmaWVycyBmcm9tIFwiLi4vLi4vLi4vcmVzL3Rva2Vucy91bml2ZXJzYWxfcXVhbnRpZmllcnNcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWFudGlmaWVyIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbiAgICBpc1VuaXZlcnNhbCgpe1xuICAgICAgICByZXR1cm4gdW5pdmVyc2FsX3F1YW50aWZpZXJzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cblxuICAgIGlzRXhpc3RlbnRpYWwoKXtcbiAgICAgICAgcmV0dXJuIGV4aXN0ZW50aWFsX3F1YW50aWZpZXJzLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVsYXRpdmVQcm9ub3VuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGhlbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgIFxufSIsImltcG9ydCB7IENsYXVzZSwgQ29uY2F0T3B0cywgQ09OU1RfUFJFRklYLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UsIElkLCBWQVJfUFJFRklYIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgTGlzdENsYXVzZSBmcm9tIFwiLi9MaXN0Q2xhdXNlXCI7XG5cblxuZXhwb3J0IGNsYXNzIEJhc2ljQ2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHByZWRpY2F0ZTogc3RyaW5nLCByZWFkb25seSBhcmdzOiBJZFtdLCByZWFkb25seSBuZWdhdGVkPWZhbHNlKSB7XG5cbiAgICB9XG5cbiAgICBjb25jYXQob3RoZXI6IENsYXVzZSwgb3B0cz86IENvbmNhdE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IExpc3RDbGF1c2UodGhpcy50b0xpc3QoKS5jb25jYXQob3RoZXIudG9MaXN0KCkpKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQmFzaWNDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHRoaXMucHJlZGljYXRlLCB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwID8gb3B0cz8ubWFwW2FdID8/IGEgOiBhKSwgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZClcbiAgICB9XG5cbiAgICB0b0xpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXMuY29weSgpXVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJncy5pbmNsdWRlcyhpZCkgPyB0aGlzLnRvTGlzdCgpIDogW11cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvTGlzdCgpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IGNvcmUgPSBgJHt0aGlzLnByZWRpY2F0ZX0oJHt0aGlzLmFyZ3MucmVkdWNlKChhMSwgYTIpID0+IGExICsgJywgJyArIGEyKX0pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke2NvcmV9KWAgOiBjb3JlXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KHRoaXMuYXJncy5jb25jYXQoW10pKSlcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBlbXB0eUNsYXVzZSgpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQmFzaWNDbGF1c2UgfSBmcm9tIFwiLi9CYXNpY0NsYXVzZVwiXG5pbXBvcnQgeyBIb3JuQ2xhdXNlIH0gZnJvbSBcIi4vSG9ybkNsYXVzZVwiXG5pbXBvcnQgTGlzdENsYXVzZSBmcm9tIFwiLi9MaXN0Q2xhdXNlXCJcblxuZXhwb3J0IGNvbnN0IENPTlNUX1BSRUZJWCA9ICdpZCdcbmV4cG9ydCBjb25zdCBWQVJfUFJFRklYID0gJ0lkJ1xuZXhwb3J0IHR5cGUgSWQgPSBudW1iZXIgfCBzdHJpbmdcblxuXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG4gICAgY29uY2F0KG90aGVyOiBDbGF1c2UsIG9wdHM/OkNvbmNhdE9wdHMpOiBDbGF1c2VcbiAgICBjb3B5KG9wdHM/OkNvcHlPcHRzKTpDbGF1c2VcbiAgICB0b0xpc3QoKTpDbGF1c2VbXVxuICAgIGFib3V0KGlkOklkKTpDbGF1c2VbXVxuICAgIGZsYXRMaXN0KCk6Q2xhdXNlW11cbiAgICByZWFkb25seSBuZWdhdGVkOmJvb2xlYW5cbiAgICBnZXQgZW50aXRpZXMoKTpJZFtdXG4gICAgZ2V0IHRoZW1lKCk6Q2xhdXNlXG4gICAgZ2V0IHJoZW1lKCk6Q2xhdXNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGF1c2VPZihwcmVkaWNhdGU6c3RyaW5nLCAuLi5hcmdzOklkW10pe1xuICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UocHJlZGljYXRlLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgZW1wdHlDbGF1c2UgPSAoKTpDbGF1c2UgPT4gbmV3IExpc3RDbGF1c2UoW10pXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHN7XG4gICAgbmVnYXRlPyA6IGJvb2xlYW5cbiAgICBtYXA/IDogTWFwXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uY2F0T3B0c3tcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUhvcm5DbGF1c2VzKGNvbmRpdGlvbnM6IENsYXVzZSwgY29uY2x1c2lvbnM6IENsYXVzZSk6Q2xhdXNlIHtcblxuICAgIC8vIFRPRE86IHRoaXMgYnJlYWtzIG5lZ2F0ZWQgTGlzdENsYXVzZXMgb3IgTGlzdENsYXVzZXMgd2l0aCBuZWdhdGVkIGVsZW1lbnRzICEhISEhISFcblxuICAgIGNvbnN0IGNvbmQgPSBjb25kaXRpb25zLnRvTGlzdCgpLm1hcChjPT4gKGMgYXMgQmFzaWNDbGF1c2UpKVxuICAgIGNvbnN0IGNvbmMgPSBjb25jbHVzaW9ucy50b0xpc3QoKS5tYXAoYz0+IChjIGFzIEJhc2ljQ2xhdXNlKSlcbiAgICBjb25zdCByZXN1bHRzID0gY29uYy5tYXAoYyA9PiBuZXcgSG9ybkNsYXVzZShjb25kLCBjKSlcblxuICAgIHJldHVybiByZXN1bHRzLmxlbmd0aD09MSA/IHJlc3VsdHNbMF0gOiBuZXcgTGlzdENsYXVzZShyZXN1bHRzKVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21JZCgpOiBJZCB7IC8vIFRPRE86IGhpZ2hlciBjb25zdCBmb3IgcHJvZHVjdGlvbiB0byBhdm9pZCBjb2xsaXNpb25zXG4gICAgcmV0dXJuIGAke0NPTlNUX1BSRUZJWH0ke3BhcnNlSW50KDEwICogTWF0aC5yYW5kb20oKSsnJyl9YFxufVxuXG4vKipcbiAqIE1hcHBpbmcgYW55IGdpdmVuIGlkIGluIHRoZSBzYW5kYm94IHRvIGFuIGlkIGluIHRoZSBcbiAqIGxhcmdlciB1bml2ZXJzZS5cbiAqL1xuZXhwb3J0IHR5cGUgTWFwID0geyBbYTogSWRdOiBJZCB9IiwiaW1wb3J0IHsgQmFzaWNDbGF1c2UgfSBmcm9tIFwiLi9CYXNpY0NsYXVzZVwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBDb25jYXRPcHRzLCBDb3B5T3B0cywgSWQgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCBMaXN0Q2xhdXNlIGZyb20gXCIuL0xpc3RDbGF1c2VcIjtcblxuZXhwb3J0IGNsYXNzIEhvcm5DbGF1c2UgaW1wbGVtZW50cyBDbGF1c2V7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25kaXRpb246QmFzaWNDbGF1c2VbXSwgcmVhZG9ubHkgY29uY2x1c2lvbjpCYXNpY0NsYXVzZSwgcmVhZG9ubHkgbmVnYXRlZD1mYWxzZSl7XG5cbiAgICB9XG5cbiAgICBjb25jYXQob3RoZXI6IENsYXVzZSwgb3B0cz86Q29uY2F0T3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgTGlzdENsYXVzZSh0aGlzLnRvTGlzdCgpLmNvbmNhdChvdGhlci50b0xpc3QoKSkpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBIb3JuQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBIb3JuQ2xhdXNlKHRoaXMuY29uZGl0aW9uLm1hcChjPT5jLmNvcHkob3B0cykpLCB0aGlzLmNvbmNsdXNpb24uY29weShvcHRzKSlcbiAgICB9XG5cbiAgICB0b0xpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXMuY29weSgpXVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCl7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmNvbmNsdXNpb24udG9TdHJpbmcoKX0gOi0gJHt0aGlzLmNvbmRpdGlvbi5tYXAoYz0+Yy50b1N0cmluZygpKS5yZWR1Y2UoKGMxLGMyKT0+YzErJywgJytjMil9YFxuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldCh0aGlzLmNvbmRpdGlvbi5mbGF0TWFwKGM9PmMuZW50aXRpZXMpLmNvbmNhdCh0aGlzLmNvbmNsdXNpb24uZW50aXRpZXMpKSlcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLmZsYXRNYXAoYz0+Yy50aGVtZSkucmVkdWNlKChjMSwgYzIpPT5jMi5jb25jYXQoYzIpKVxuICAgIH1cbiAgICBcbiAgICBnZXQgcmhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSgpIC8vIGR1bm5vIHdoYXQgSSdtIGRvaW4nXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25jbHVzaW9uLmFib3V0KGlkKS5jb25jYXQodGhpcy5jb25kaXRpb24uZmxhdE1hcChjPT5jLmFib3V0KGlkKSkpXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy50b0xpc3QoKVxuICAgIH1cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIENvbmNhdE9wdHMsIENvcHlPcHRzLCBJZCB9IGZyb20gXCIuL0NsYXVzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXN0Q2xhdXNlIGltcGxlbWVudHMgQ2xhdXNle1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlczpDbGF1c2VbXSwgcmVhZG9ubHkgbmVnYXRlZD1mYWxzZSl7XG5cbiAgICB9XG5cbiAgICBjb25jYXQob3RoZXI6IENsYXVzZSwgb3B0cz86Q29uY2F0T3B0cyk6IENsYXVzZSB7XG5cbiAgICAgICAgLy8gVE9ETzogdGhpcyBvcCBpcyBhIGxpdHRsZSBiaXQgY2x1bXN5LCBjb25zaWRlciB1c2luZyBhIHNpbXBsaWZ5KCkgbWV0aG9kIGluc3RlYWQuXG5cbiAgICAgICAgaWYob3B0cz8uYXNSaGVtZSl7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RDbGF1c2UoW3RoaXMuY29weSgpLCBvdGhlci5jb3B5KCldKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5uZWdhdGVkICYmIG90aGVyLm5lZ2F0ZWQpe1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBMaXN0Q2xhdXNlKFt0aGlzLmNvcHkoKSwgb3RoZXIuY29weSgpXSlcbiAgICAgICAgfWVsc2UgaWYgKHRoaXMubmVnYXRlZCl7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RDbGF1c2UoW3RoaXMuY29weSgpLCAuLi5vdGhlci50b0xpc3QoKV0pXG4gICAgICAgIH1lbHNlIGlmIChvdGhlci5uZWdhdGVkKXtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGlzdENsYXVzZShbLi4udGhpcy50b0xpc3QoKSwgb3RoZXIuY29weSgpXSlcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gbmV3IExpc3RDbGF1c2UoWy4uLnRoaXMudG9MaXN0KCksIC4uLm90aGVyLnRvTGlzdCgpXSlcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IExpc3RDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IExpc3RDbGF1c2UodGhpcy5jbGF1c2VzLm1hcChjPT5jLmNvcHkob3B0cykpLCBvcHRzPy5uZWdhdGU/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQpXG4gICAgfVxuXG4gICAgdG9MaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlcy5jb25jYXQoW10pXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZD8gYG5vdCgke3RoaXMuY2xhdXNlcy50b1N0cmluZygpfSlgIDogdGhpcy5jbGF1c2VzLnRvU3RyaW5nKClcbiAgICB9XG4gICAgXG4gICAgYWJvdXQoaWRzOiBJZCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlcy5mbGF0TWFwKGM9PmMuYWJvdXQoaWRzKSlcbiAgICB9XG4gICAgXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2VzLmZsYXRNYXAoYz0+Yy5mbGF0TGlzdCgpKVxuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldCh0aGlzLmNsYXVzZXMuZmxhdE1hcChjPT5jLmVudGl0aWVzKSkgIClcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlc1swXVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2VzWzFdXG4gICAgfVxufSIsImltcG9ydCBUb2tlbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuLi9hc3QvdG9rZW5zL0Fic3RyYWN0VG9rZW5cIjtcbmltcG9ydCBMZXhlciwgeyBBc3NlcnRBcmdzLCBDb25zdHJ1Y3RvciB9IGZyb20gXCIuL0xleGVyXCI7XG5pbXBvcnQgdG9rZW5PZiBmcm9tIFwiLi90b2tlbk9mXCI7XG5cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYWdlckxleGVyIGltcGxlbWVudHMgTGV4ZXJ7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOlRva2VuW11cbiAgICBwcm90ZWN0ZWQgX3BvczpudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6c3RyaW5nKXsgXG4gICAgICAgIC8vVE9ETzogcmVjb25zdHJ1Y3QgXCJkbyBub3RcIiBhbmQgXCJkb2VzIG5vdFwiIHRva2Vuc1xuICAgICAgICAvL1RPRE86IG5vdW5zIHZzIGFkamVjdGl2ZXNcbiAgICAgICAgdGhpcy50b2tlbnMgPSBzb3VyY2VDb2RlLnNwbGl0KC9cXHMrfFxcLi8pLm1hcChlPT4hZT8nLic6ZSkubWFwKHRva2VuT2YpXG4gICAgICAgIHRoaXMuX3BvcyA9IDBcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBUb2tlbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuXG5cbiAgICBcbiAgICAvKipcbiAgICAgKiBSZXR1cm4gY3VycmVudCB0b2tlbiBpZmYgb2YgZ2l2ZW4gdHlwZSBhbmQgbW92ZSB0byBuZXh0OyBcbiAgICAgKiBlbHNlIHJldHVybiB1bmRlZmluZWQgYW5kIGRvbid0IG1vdmUuXG4gICAgICogQHBhcmFtIGFyZ3MgXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgYXNzZXJ0IDxUPihjbGF6ejpDb25zdHJ1Y3RvcjxUPiwgYXJnczpBc3NlcnRBcmdzKTogVHx1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLnBlZWtcblxuICAgICAgICBpZiAoY3VycmVudCBpbnN0YW5jZW9mIGNsYXp6KXtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MuZXJyb3JPdXQ/P3RydWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3JvYWsoYXJncy5lcnJvck1zZz8/JycpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1Rva2VuXCJcbmltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXJ7XG4gICAgbmV4dCgpOnZvaWRcbiAgICBiYWNrVG8ocG9zOm51bWJlcik6dm9pZFxuICAgIGdldCBwZWVrKCk6VG9rZW5cbiAgICBnZXQgcG9zKCk6bnVtYmVyXG4gICAgY3JvYWsoZXJyb3JNc2c6c3RyaW5nKTp2b2lkICAgXG4gICAgYXNzZXJ0IDxUPihjbGF6ejpDb25zdHJ1Y3RvcjxUPiwgYXJnczpBc3NlcnRBcmdzKTogVHx1bmRlZmluZWQgXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXJ0QXJnc3tcbiAgICBlcnJvck1zZz86c3RyaW5nXG4gICAgZXJyb3JPdXQ/OmJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6c3RyaW5nKXtcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSlcbn1cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUXG4iLCJpbXBvcnQgYWRqZWN0aXZlcyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2FkamVjdGl2ZXMnXG5pbXBvcnQgaW5kZWZpbml0ZV9hcnRpY2xlcyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2luZGVmaW5pdGVfYXJ0aWNsZXMnXG5pbXBvcnQgZGVmaW5pdGVfYXJ0aWNsZXMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9kZWZpbml0ZV9hcnRpY2xlcydcbmltcG9ydCBjb3B1bGFzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvY29wdWxhcydcbmltcG9ydCBodmVyYnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9odmVyYnMnXG5pbXBvcnQgaXZlcmJzIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvaXZlcmJzJ1xuaW1wb3J0IG12ZXJicyBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL212ZXJicydcbmltcG9ydCBuZWdhdGlvbnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9uZWdhdGlvbnMnXG5pbXBvcnQgbm9uc3ViY29uaiBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL25vbnN1YmNvbmonXG5pbXBvcnQgbm91bnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9ub3VucydcbmltcG9ydCBwcmVwb3NpdGlvbnMgZnJvbSAnLi4vLi4vcmVzL3Rva2Vucy9wcmVwb3NpdGlvbnMnXG5pbXBvcnQgZXhpc3RxdWFudCBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL2V4aXN0ZW50aWFsX3F1YW50aWZpZXJzJ1xuaW1wb3J0IHVuaXF1YW50IGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvdW5pdmVyc2FsX3F1YW50aWZpZXJzJ1xuaW1wb3J0IHJlbHByb25zIGZyb20gJy4uLy4uL3Jlcy90b2tlbnMvcmVscHJvbnMnXG5pbXBvcnQgc3ViY29uaiBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL3N1YmNvbmonXG5pbXBvcnQgdGhlbiBmcm9tICcuLi8uLi9yZXMvdG9rZW5zL3RoZW4nXG5pbXBvcnQgQXJ0aWNsZSBmcm9tICcuLi9hc3QvdG9rZW5zL0FydGljbGUnXG5pbXBvcnQgQ29wdWxhIGZyb20gJy4uL2FzdC90b2tlbnMvQ29wdWxhJ1xuaW1wb3J0IEhWZXJiIGZyb20gJy4uL2FzdC90b2tlbnMvSFZlcmInXG5pbXBvcnQgSVZlcmIgZnJvbSAnLi4vYXN0L3Rva2Vucy9JVmVyYidcbmltcG9ydCBNVmVyYiBmcm9tICcuLi9hc3QvdG9rZW5zL01WZXJiJ1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gJy4uL2FzdC90b2tlbnMvTmVnYXRpb24nXG5pbXBvcnQgTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gJy4uL2FzdC90b2tlbnMvTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uJ1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gJy4uL2FzdC90b2tlbnMvUHJlcG9zaXRpb24nXG5pbXBvcnQgUXVhbnRpZmllciBmcm9tICcuLi9hc3QvdG9rZW5zL1F1YW50aWZpZXInXG5pbXBvcnQgVGhlbiBmcm9tICcuLi9hc3QvdG9rZW5zL1RoZW4nXG5pbXBvcnQgUmVsYXRpdmVQcm9ub3VuIGZyb20gJy4uL2FzdC90b2tlbnMvUmVsYXRpdmVQcm9ub3VuJ1xuaW1wb3J0IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tICcuLi9hc3QvdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvbidcbmltcG9ydCBOb3VuIGZyb20gJy4uL2FzdC90b2tlbnMvTm91bidcbmltcG9ydCBBZGplY3RpdmUgZnJvbSAnLi4vYXN0L3Rva2Vucy9BZGplY3RpdmUnXG5pbXBvcnQgVG9rZW4gZnJvbSAnLi4vYXN0L2ludGVyZmFjZXMvVG9rZW4nXG5pbXBvcnQgRnVsbFN0b3AgZnJvbSAnLi4vYXN0L3Rva2Vucy9GdWxsU3RvcCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdG9rZW5PZihzdHJpbmc6c3RyaW5nKTpUb2tlbntcbiAgICBcbiAgICBpZiAoaW5kZWZpbml0ZV9hcnRpY2xlcy5jb25jYXQoZGVmaW5pdGVfYXJ0aWNsZXMpLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IEFydGljbGUoc3RyaW5nKVxuICAgIH1lbHNlIGlmIChjb3B1bGFzLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IENvcHVsYShzdHJpbmcpXG4gICAgfWVsc2UgaWYgKGh2ZXJicy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBIVmVyYihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKGl2ZXJicy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBJVmVyYihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKG12ZXJicy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBNVmVyYihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKG5lZ2F0aW9ucy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBOZWdhdGlvbihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKG5vbnN1YmNvbmouaW5jbHVkZXMoc3RyaW5nKSl7XG4gICAgICAgIHJldHVybiBuZXcgTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uKHN0cmluZylcbiAgICB9ZWxzZSBpZiAocHJlcG9zaXRpb25zLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IFByZXBvc2l0aW9uKHN0cmluZylcbiAgICB9ZWxzZSBpZiAoZXhpc3RxdWFudC5jb25jYXQodW5pcXVhbnQpLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IFF1YW50aWZpZXIoc3RyaW5nKVxuICAgIH1lbHNlIGlmICh0aGVuLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IFRoZW4oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChyZWxwcm9ucy5pbmNsdWRlcyhzdHJpbmcpKXtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWxhdGl2ZVByb25vdW4oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChzdWJjb25qLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbihzdHJpbmcpXG4gICAgfWVsc2UgaWYgKG5vdW5zLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IE5vdW4oc3RyaW5nKVxuICAgIH1lbHNlIGlmIChhZGplY3RpdmVzLmluY2x1ZGVzKHN0cmluZykpe1xuICAgICAgICByZXR1cm4gbmV3IEFkamVjdGl2ZShzdHJpbmcpXG4gICAgfWVsc2UgaWYgKCcuJyA9PT0gc3RyaW5nKXtcbiAgICAgICAgcmV0dXJuIG5ldyBGdWxsU3RvcCgnLicpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBBZGplY3RpdmUoc3RyaW5nKVxufSIsImltcG9ydCBBc3QgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0FzdFwiO1xuaW1wb3J0IEJpbmFyeVF1ZXN0aW9uIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9CaW5hcnlRdWVzdGlvblwiO1xuaW1wb3J0IENvbXBvdW5kU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0NvbXBvdW5kU2VudGVuY2VcIjtcbmltcG9ydCBEZWNsYXJhdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvRGVjbGFyYXRpb25cIjtcbmltcG9ydCBRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvUXVlc3Rpb25cIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvU2ltcGxlU2VudGVuY2VcIjtcbmltcG9ydCBWZXJiU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1ZlcmJTZW50ZW5jZVwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4uL2FzdC9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgQ29tcGxleFNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvbXBsZXhTZW50ZW5jZVwiO1xuaW1wb3J0IENvbmp1bmN0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29uanVuY3RpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IENvcHVsYVF1ZXN0aW9uIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvcHVsYVF1ZXN0aW9uXCI7XG5pbXBvcnQgQ29wdWxhU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29wdWxhU2VudGVuY2VcIjtcbmltcG9ydCBJbnRyYW5zaXRpdmVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9JbnRyYW5zaXRpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IE1vbm90cmFuc2l0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvTW9ub3RyYW5zaXRpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BZGplY3RpdmVcIjtcbmltcG9ydCBBcnRpY2xlIGZyb20gXCIuLi9hc3QvdG9rZW5zL0FydGljbGVcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL2FzdC90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgSVZlcmIgZnJvbSBcIi4uL2FzdC90b2tlbnMvSVZlcmJcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9NVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL05lZ2F0aW9uXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vYXN0L3Rva2Vucy9Ob3VuXCI7XG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi9hc3QvdG9rZW5zL1F1YW50aWZpZXJcIjtcbmltcG9ydCBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uXCI7XG5pbXBvcnQgVGhlbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9UaGVuXCI7XG5pbXBvcnQgTGV4ZXIsIHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIjtcbmltcG9ydCBQYXJzZXIgZnJvbSBcIi4vUGFyc2VyXCI7XG5pbXBvcnQgQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2FzdC9waHJhc2VzL0NvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgUmVsYXRpdmVQcm9ub3VuIGZyb20gXCIuLi9hc3QvdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IENvbnN0aXR1ZW50IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY1BhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBwcm90ZWN0ZWQgbHg6IExleGVyXG5cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VDb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5seCA9IGdldExleGVyKHNvdXJjZUNvZGUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRyeTxUIGV4dGVuZHMgQXN0PihtZXRob2Q6ICgpID0+IFQpIHtcblxuICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5seC5wb3NcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZCgpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKChlcnJvciBhcyBFcnJvcikubWVzc2FnZSlcbiAgICAgICAgICAgIHRoaXMubHguYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBlcnJvck91dChlcnJvck1zZzogc3RyaW5nKTogQ29uc3RpdHVlbnQge1xuICAgICAgICB0aGlzLmx4LmNyb2FrKGVycm9yTXNnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNc2cpXG4gICAgfVxuXG4gICAgcGFyc2UoKTogQ29uc3RpdHVlbnQge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZURlY2xhcmF0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZVF1ZXN0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZU5vdW5QaHJhc2UpIC8vIGZvciBxdWljayB0b3BpYyByZWZlcmVuY2VcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZURlY2xhcmF0aW9uID0gKCk6IERlY2xhcmF0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb21wb3VuZClcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VTaW1wbGUpIFxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VEZWNsYXJhdGlvbigpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VRdWVzdGlvbiA9ICgpOiBRdWVzdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQmluYXJ5UXVlc3Rpb24pXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVF1ZXN0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVNpbXBsZSA9ICgpOiBTaW1wbGVTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlVmVyYlNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VTaW1wbGUoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG91bmQgPSAoKTogQ29tcG91bmRTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29tcGxleClcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VDb25qdW5jdGl2ZSlcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlQ29tcG91bmQoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlVmVyYlNlbnRlbmNlID0gKCk6IFZlcmJTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlVmVyYlNlbnRlbmNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVNlbnRlbmNlID0gKCk6IENvcHVsYVNlbnRlbmNlID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7IGVycm9yTXNnOiAncGFyc2VDb3B1bGFTZW50ZW5jZSgpLCBleHBlY3RlZCBjb3B1bGEnIH0pXG4gICAgICAgIGNvbnN0IG5lZ2F0aW9uID0gdGhpcy5seC5hc3NlcnQoTmVnYXRpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFTZW50ZW5jZShzdWJqZWN0LCBjb3B1bGEgYXMgQ29wdWxhLCBwcmVkaWNhdGUsIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBsZXggPSAoKTogQ29tcGxleFNlbnRlbmNlID0+IHtcblxuICAgICAgICBjb25zdCBzdWJjb25qID0gdGhpcy5seC5hc3NlcnQoU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuXG4gICAgICAgIGlmIChzdWJjb25qKSB7XG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHRoaXMubHguYXNzZXJ0KFRoZW4sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgICAgICBjb25zdCBvdXRjb21lID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbXBsZXhTZW50ZW5jZShjb25kaXRpb24sIG91dGNvbWUsIHN1YmNvbmopXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBvdXRjb21lID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICBjb25zdCBzdWJjb25qID0gdGhpcy5seC5hc3NlcnQoU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLCB7IGVycm9yT3V0OiB0cnVlLCBlcnJvck1zZzogJ2V4cGVjdGVkIHN1Ym9yZGluYXRpbmcgY29uanVuY3Rpb24nIH0pXG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29tcGxleFNlbnRlbmNlKGNvbmRpdGlvbiwgb3V0Y29tZSwgc3ViY29uaiBhcyBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUludHJhbnNpdGl2ZVNlbnRlbmNlID0gKCk6IEludHJhbnNpdGl2ZVNlbnRlbmNlID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgbmVnYXRpb24gPSB0aGlzLmx4LmFzc2VydChOZWdhdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgaXZlcmIgPSB0aGlzLmx4LmFzc2VydChJVmVyYiwgeyBlcnJvck1zZzogJ3BhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UoKSwgZXhwZWN0ZWQgaS12ZXJiJyB9KVxuICAgICAgICBjb25zdCBjb21wbGVtZW50cyA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG4gICAgICAgIHJldHVybiBuZXcgSW50cmFuc2l0aXZlU2VudGVuY2Uoc3ViamVjdCwgaXZlcmIgYXMgSVZlcmIsIGNvbXBsZW1lbnRzLCBuZWdhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlID0gKCk6IE1vbm90cmFuc2l0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBuZWdhdGlvbiA9IHRoaXMubHguYXNzZXJ0KE5lZ2F0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBtdmVyYiA9IHRoaXMubHguYXNzZXJ0KE1WZXJiLCB7IGVycm9yTXNnOiAncGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlKCksIGV4cGVjdGVkIGktdmVyYicgfSlcbiAgICAgICAgY29uc3QgY3MxID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBjczIgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKVxuICAgICAgICByZXR1cm4gbmV3IE1vbm90cmFuc2l0aXZlU2VudGVuY2Uoc3ViamVjdCwgbXZlcmIgYXMgTVZlcmIsIG9iamVjdCwgY3MxLmNvbmNhdChjczIpLCBuZWdhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VCaW5hcnlRdWVzdGlvbiA9ICgpOiBCaW5hcnlRdWVzdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhUXVlc3Rpb24pXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZUJpbmFyeVF1ZXN0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVF1ZXN0aW9uID0gKCk6IENvcHVsYVF1ZXN0aW9uID0+IHtcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7IGVycm9yTXNnOiAncGFyc2VDb3B1bGFRdWVzdGlvbigpLCBleHBlY3RlZCBjb3B1bGEnIH0pXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFRdWVzdGlvbihzdWJqZWN0LCBwcmVkaWNhdGUsIGNvcHVsYSBhcyBDb3B1bGEpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTm91blBocmFzZSA9ICgpOiBOb3VuUGhyYXNlID0+IHtcbiAgICAgICAgY29uc3QgcXVhbnRpZmllciA9IHRoaXMubHguYXNzZXJ0KFF1YW50aWZpZXIsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IGFydGljbGUgPSB0aGlzLmx4LmFzc2VydChBcnRpY2xlLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuXG4gICAgICAgIGxldCBhZGplY3RpdmVzID0gW11cbiAgICAgICAgbGV0IGFkalxuXG4gICAgICAgIHdoaWxlIChhZGogPSB0aGlzLmx4LmFzc2VydChBZGplY3RpdmUsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pKSB7XG4gICAgICAgICAgICBhZGplY3RpdmVzLnB1c2goYWRqKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgbm91biA9IHRoaXMubHguYXNzZXJ0KE5vdW4sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IHN1Ym9yZGluYXRlQ2xhdXNlID0gdGhpcy50cnkodGhpcy5wYXJzZVN1Ym9yZGluYXRlQ2xhdXNlKVxuICAgICAgICBjb25zdCBjb21wbGVtZW50cyA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpIFxuXG4gICAgICAgIHJldHVybiBuZXcgTm91blBocmFzZShhZGplY3RpdmVzLCBjb21wbGVtZW50cywgbm91biwgcXVhbnRpZmllciwgYXJ0aWNsZSwgc3Vib3JkaW5hdGVDbGF1c2UpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcGxlbWVudHMgPSAoKTogQ29tcGxlbWVudFtdID0+IHtcblxuICAgICAgICBjb25zdCBjb21wbGVtZW50cyA9IFtdXG4gICAgICAgIGxldCBjb21wXG5cbiAgICAgICAgd2hpbGUgKGNvbXAgPSB0aGlzLnRyeSh0aGlzLnBhcnNlQ29tcGxlbWVudCkpIHtcbiAgICAgICAgICAgIGNvbXBsZW1lbnRzLnB1c2goY29tcClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb21wbGVtZW50c1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBsZW1lbnQgPSAoKTogQ29tcGxlbWVudCA9PiB7XG4gICAgICAgIGNvbnN0IHByZXBvc2l0aW9uID0gdGhpcy5seC5hc3NlcnQoUHJlcG9zaXRpb24sIHsgZXJyb3JNc2c6ICdwYXJzZUNvbXBsZW1lbnQoKSBleHBlY3RlZCBwcmVwb3NpdGlvbicgfSlcbiAgICAgICAgY29uc3Qgbm91blBocmFzZSA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb21wbGVtZW50KHByZXBvc2l0aW9uIGFzIFByZXBvc2l0aW9uLCBub3VuUGhyYXNlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVN1Ym9yZGluYXRlQ2xhdXNlID0gKCk6IFN1Ym9yZGluYXRlQ2xhdXNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSkgXG4gICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlU3Vib3JkaW5hdGVDbGF1c2UoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UgPSAoKTpDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSA9PntcbiAgICAgICAgY29uc3QgcmVscHJvbiA9IHRoaXMubHguYXNzZXJ0KFJlbGF0aXZlUHJvbm91biwge2Vycm9yTXNnOidwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKCkgZXhwZWN0ZWQgcmVsYXRpdmUgcHJvbm91bid9KVxuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHtlcnJvck1zZzoncGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSgpIGV4cGVjdGVkIGNvcHVsYSd9KVxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKHJlbHByb24gYXMgUmVsYXRpdmVQcm9ub3VuLCBzdWJqZWN0LCBjb3B1bGEgYXMgQ29wdWxhKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbmp1bmN0aXZlID0gKCk6IENvbmp1bmN0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05PVCBJTVBMRU1FTlRFRCEgVE9ETyEnKVxuICAgIH1cblxufSIsImltcG9ydCBBc3QgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0FzdFwiO1xuaW1wb3J0IEJhc2ljUGFyc2VyIGZyb20gXCIuL0Jhc2ljUGFyc2VyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBQYXJzZXJ7XG4gICAgcGFyc2UoKTpBc3QgICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOnN0cmluZyl7XG4gICAgcmV0dXJuIG5ldyBCYXNpY1BhcnNlcihzb3VyY2VDb2RlKVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgcGwgZnJvbSAndGF1LXByb2xvZydcbmltcG9ydCBBcnRpY2xlIGZyb20gJy4vYXN0L3Rva2Vucy9BcnRpY2xlJztcbmltcG9ydCBDb3B1bGEgZnJvbSAnLi9hc3QvdG9rZW5zL0NvcHVsYSc7XG5pbXBvcnQgTm91biBmcm9tICcuL2FzdC90b2tlbnMvTm91bic7XG5pbXBvcnQgeyBnZXRMZXhlciB9IGZyb20gJy4vbGV4ZXIvTGV4ZXInO1xuaW1wb3J0IHsgZ2V0UGFyc2VyIH0gZnJvbSAnLi9wYXJzZXIvUGFyc2VyJztcbmltcG9ydCBQcm9sb2csIHsgZ2V0UHJvbG9nIH0gZnJvbSAnLi9wcm9sb2cvUHJvbG9nJztcbmltcG9ydCBUYXVQcm9sb2cgZnJvbSAnLi9wcm9sb2cvVGF1UHJvbG9nJztcblxuXG4vLyBQUk9MT0cgVEVTVCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIGNvbnN0IHBybyA9IGdldFByb2xvZygpO1xuLy8gKHdpbmRvdyBhcyBhbnkpLnBybyA9IHBybztcbi8vIChhc3luYyAoKSA9PiB7XG4vLyAgICAgYXdhaXQgcHJvLmFzc2VydCgnY2FwcmEoc2NlbW8pJylcbi8vICAgICBhd2FpdCBwcm8uYXNzZXJ0KCdtYW1tYWwocGVsb3NvKScpXG4vLyAgICAgYXdhaXQgcHJvLmFzc2VydCgnbWFtbWFsKGZpZG8pJylcbi8vICAgICBhd2FpdCBwcm8uYXNzZXJ0KCdtYW1tYWwoWCkgOi0gY2FwcmEoWCknKVxuLy8gICAgIGNvbnNvbGUubG9nKGF3YWl0IHByby5xdWVyeSgnbWFtbWFsKFgpLicpKVxuLy8gICAgIGF3YWl0IHByby5yZXRyYWN0KCdjYXByYShzY2VtbyknKVxuLy8gICAgIGNvbnNvbGUubG9nKGF3YWl0IHByby5xdWVyeSgnbWFtbWFsKFgpLicpKVxuLy8gfSkoKTtcbi8vIC8vICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIGNvbnNvbGUubG9nKCh0b2tlbk9mKCdhJykgYXMgQXJ0aWNsZSkuaXNEZWZpbml0ZSgpKVxuLy8gY29uc29sZS5sb2codG9rZW5PZignYScpICBpbnN0YW5jZW9mIEFydGljbGUpXG4vLyBjb25zb2xlLmxvZyh0b2tlbk9mKCdhJykgIGluc3RhbmNlb2YgUXVhbnRpZmllcilcbi8vIGNvbnNvbGUubG9nKHRva2VuT2YoJ2V2ZXJ5JykgIGluc3RhbmNlb2YgUXVhbnRpZmllcilcbi8vIGNvbnNvbGUubG9nKHRva2VuT2YoJ2EnKS50b1N0cmluZygpKVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gY29uc3QgbGV4ZXIgPSBnZXRMZXhlcigndGhlIGNhdCBpcyBhIGNhdC4nKVxuLy8gY29uc29sZS5sb2cobGV4ZXIpXG4vLyBjb25zb2xlLmxvZygnaXMgaXQgYSBub3VuPycsIGxleGVyLmFzc2VydChOb3VuLCB7ZXJyb3JPdXQ6ZmFsc2V9KSApXG4vLyBjb25zb2xlLmxvZyhsZXhlci5wZWVrKVxuLy8gY29uc29sZS5sb2coJ2lzIGl0IGEgY29wdWxhPycsIGxleGVyLmFzc2VydChDb3B1bGEsIHtlcnJvck91dDpmYWxzZX0pIClcbi8vIGNvbnNvbGUubG9nKGxleGVyLnBlZWspXG4vLyBjb25zb2xlLmxvZygnaXMgaXQgYW4gYXJ0aWNsZT8nLCBsZXhlci5hc3NlcnQoQXJ0aWNsZSwge2Vycm9yT3V0OmZhbHNlfSkgKVxuLy8gY29uc29sZS5sb2cobGV4ZXIucGVlaylcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBjYXQgaXMgYmlnJykucGFyc2UoKSlcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGJpZyBjYXQnKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcigndGhlIGJpZyBjYXQgb24gdGhlIHRhYmxlIGlzIGVhdGluZyB0dW5hJykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ3RoZSBiaWcgY2F0IG9uIHRoZSBtYXQnKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcignZXZlcnkgZG9nIGlzIHN0dXBpZCcpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgY2F0IHRoYXQgaXMgc21hcnQnKS5wYXJzZSgpIClcbi8vIGNvbnNvbGUubG9nKGdldFBhcnNlcignbm9kZWpzIGlzIG5vdCBoZWxwZnVsJykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZyhnZXRQYXJzZXIoJ2lmIHRoZSBkb2cgaXMgc3R1cGlkIHRoZW4gdGhlIGNhdCBpcyBoYXBweScpLnBhcnNlKCkgKVxuLy8gY29uc29sZS5sb2coZ2V0UGFyc2VyKCd0aGUgY2F0IGlzIGhhcHB5IGlmIHRoZSBkb2cgaXMgc3R1cGlkJykucGFyc2UoKSApXG4vLyBjb25zb2xlLmxvZygod2luZG93IGFzIGFueSkuYXN0ID0gZ2V0UGFyc2VyKCd0aGUgY29sb3Igb2YgdGhlIGJ1dHRvbiBpcyByZWQnKS5wYXJzZSgpKVxuLy8gY29uc29sZS5sb2coKHdpbmRvdyBhcyBhbnkpLmFzdCA9IGdldFBhcnNlcigndGhlIGNvbG9yIG9mIHRoZSBidXR0b24gb24gdGhlIGJsYWNrIGRpdiBpcyByZWQnKS5wYXJzZSgpKVxuXG5mdW5jdGlvbiB0ZXN0KHN0cmluZzpzdHJpbmcpe1xuICAgIGNvbnNvbGUubG9nKHN0cmluZylcbiAgICBjb25zdCBjbGF1c2UgPSBnZXRQYXJzZXIoc3RyaW5nKS5wYXJzZSgpLnRvUHJvbG9nKCkuY29weSh7bWFwOnsnaWQxJyA6IDEwMDAsICdpZDInOjIwMDB9fSlcbiAgICBjb25zb2xlLmxvZyhjbGF1c2UuZmxhdExpc3QoKS5tYXAoYz0+Yy50b1N0cmluZygpKSlcbiAgICBjb25zb2xlLmxvZyhjbGF1c2UpXG4gICAgY29uc29sZS5sb2coJ2VudGl0aWVzJywgY2xhdXNlLmVudGl0aWVzKVxuICAgIGNvbnNvbGUubG9nKCd0aGVtZScsIGNsYXVzZS50aGVtZSlcbiAgICBjb25zb2xlLmxvZygncmhlbWUnLCBjbGF1c2UucmhlbWUpXG4gICAgY29uc29sZS5sb2coY2xhdXNlLmFib3V0KCdpZDAnKSlcbn1cblxudGVzdCgndGhlIGNhdCBpcyBvbiB0aGUgbWF0JylcbnRlc3QoJ3RoZSBjYXQgdGhhdCBpcyByZWQgaXMgb24gdGhlIG1hdCcpXG50ZXN0KCd0aGUgYmlnIGNhdCB0aGF0IGlzIG9uIHRoZSBtYXQgaXMgYmxhY2snKVxudGVzdCgnZXZlcnkgY2F0IGlzIHJlZCcpXG50ZXN0KCdldmVyeSByZWQgY2F0IGlzIG9uIHRoZSBtYXQnKVxudGVzdCgndGhlIGNhdCBleGlzdHMgb24gdGhlIG1hdCcpXG50ZXN0KCdpZiB0aGUgY2F0IGlzIG9uIHRoZSBtYXQgdGhlbiB0aGUgY2F0IGlzIHJlZCcpXG50ZXN0KCd0aGUgY2F0IGlzIG5vdCByZWQnKVxudGVzdCgnZXZlcnkgY2F0IGlzIG5vdCByZWQnKVxudGVzdCgndHJ1bXAgaXMgbm90IGEgZ3JlYXQgcHJlc2lkZW50JykgLy8gcHJvYmFibHkgbmVlZCBhbiBhbmQgcHJlZGljYXRlXG5cblxuLy8gY29uc3QgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKVxuLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKT8uYXBwZW5kQ2hpbGQocClcblxuLy8gY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4vLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpPy5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcblxuLy8gdGV4dGFyZWEub25pbnB1dCA9IChlKT0+e1xuLy8gICAgIHAuaW5uZXJIVE1MID0gZ2V0UGFyc2VyKHRleHRhcmVhLnZhbHVlKS5wYXJzZSgpLnRvUHJvbG9nKCkuY2xhdXNlcy5yZWR1Y2UoKGMxLGMyKT0+YCR7YzF9PGJyPiR7YzJ9YClcbi8vIH1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==