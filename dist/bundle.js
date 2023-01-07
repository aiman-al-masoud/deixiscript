/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/src/action/Action.ts":
/*!**********************************!*\
  !*** ./app/src/action/Action.ts ***!
  \**********************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAction = void 0;
const Id_1 = __webpack_require__(/*! ../clauses/Id */ "./app/src/clauses/Id.ts");
const Create_1 = __importDefault(__webpack_require__(/*! ./Create */ "./app/src/action/Create.ts"));
const Edit_1 = __importDefault(__webpack_require__(/*! ./Edit */ "./app/src/action/Edit.ts"));
function getAction(clause, enviro) {
    return __awaiter(this, void 0, void 0, function* () {
        const ownershipChain = getOwnershipChain(clause);
        // console.log({ ownershipChain })
        //TODO ??? DON'T do any of the following immediately, just prepare code for later! ???
        //1 get the top-level object's ID from an Enviro, if none create it
        let id = (yield enviro.query(clause))[ownershipChain[0]];
        if (!id) {
            enviro.setPlaceholder(id = (0, Id_1.getRandomId)());
        }
        //2 determine kind of action (creator or non-creator)
        //3 distribute the id to every action (one action per predicate)
        const actions = clause
            .flatList()
            .map(c => c)
            .map(c => isCreatorAction(c.predicate) ? new Create_1.default(id, c.predicate) : new Edit_1.default(id, c.predicate));
        //4 creator actions create the object if it doesn't exist yet
        //5 non-creator actions WAIT if the object doesn't exist yet.
        // (wait is handled by Enviro's get())
        actions.forEach(a => {
            a.run(enviro);
        });
    });
}
exports.getAction = getAction;
function getOwnershipChain(clause) {
    const topLevel = clause.entities
        .map(x => ({ x, owners: clause.ownersOf(x) }))
        .filter(x => x.owners.length === 0)
        .map(x => x.x);
    const secondLevelEntities = clause.ownedBy(topLevel[0]);
    const thridLevelEntities = clause.ownedBy(secondLevelEntities[0]);
    // const descs = clause.entities.map(e => clause.describe(e))
    // console.log({ descs })
    return [topLevel[0], secondLevelEntities[0], thridLevelEntities[0]];
}
function isCreatorAction(predicate) {
    return predicate === 'button';
}


/***/ }),

/***/ "./app/src/action/Create.ts":
/*!**********************************!*\
  !*** ./app/src/action/Create.ts ***!
  \**********************************/
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
const Wrapper_1 = __webpack_require__(/*! ../concepts/Wrapper */ "./app/src/concepts/Wrapper.ts");
class Create {
    constructor(id, predicate, ...args) {
        this.id = id;
        this.predicate = predicate;
    }
    run(enviro) {
        return __awaiter(this, void 0, void 0, function* () {
            if (enviro.exists(this.id)) { //  existence check prior to creating
                return;
            }
            if (isDomElem(this.predicate)) {
                const o = document.createElement(this.predicate);
                document.body.appendChild(o);
                o.id = this.id + '';
                o.textContent = 'default';
                const newObj = (0, Wrapper_1.wrap)(o);
                newObj.set(this.predicate);
                enviro.set(this.id, newObj);
            }
        });
    }
}
exports["default"] = Create;
function isDomElem(predicate) {
    return ['button'].includes(predicate);
}


/***/ }),

/***/ "./app/src/action/Edit.ts":
/*!********************************!*\
  !*** ./app/src/action/Edit.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports) {


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
class Edit {
    constructor(id, predicate, ...args) {
        this.id = id;
        this.predicate = predicate;
    }
    run(enviro) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield enviro.get(this.id);
            obj.set(this.predicate);
        });
    }
}
exports["default"] = Edit;


/***/ }),

/***/ "./app/src/ast/interfaces/Token.ts":
/*!*****************************************!*\
  !*** ./app/src/ast/interfaces/Token.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTokenCons = void 0;
const Adjective_1 = __importDefault(__webpack_require__(/*! ../tokens/Adjective */ "./app/src/ast/tokens/Adjective.ts"));
const Article_1 = __importDefault(__webpack_require__(/*! ../tokens/Article */ "./app/src/ast/tokens/Article.ts"));
const Copula_1 = __importDefault(__webpack_require__(/*! ../tokens/Copula */ "./app/src/ast/tokens/Copula.ts"));
const FullStop_1 = __importDefault(__webpack_require__(/*! ../tokens/FullStop */ "./app/src/ast/tokens/FullStop.ts"));
const HVerb_1 = __importDefault(__webpack_require__(/*! ../tokens/HVerb */ "./app/src/ast/tokens/HVerb.ts"));
const IVerb_1 = __importDefault(__webpack_require__(/*! ../tokens/IVerb */ "./app/src/ast/tokens/IVerb.ts"));
const MVerb_1 = __importDefault(__webpack_require__(/*! ../tokens/MVerb */ "./app/src/ast/tokens/MVerb.ts"));
const Negation_1 = __importDefault(__webpack_require__(/*! ../tokens/Negation */ "./app/src/ast/tokens/Negation.ts"));
const NonSubordinatingConjunction_1 = __importDefault(__webpack_require__(/*! ../tokens/NonSubordinatingConjunction */ "./app/src/ast/tokens/NonSubordinatingConjunction.ts"));
const Noun_1 = __importDefault(__webpack_require__(/*! ../tokens/Noun */ "./app/src/ast/tokens/Noun.ts"));
const Preposition_1 = __importDefault(__webpack_require__(/*! ../tokens/Preposition */ "./app/src/ast/tokens/Preposition.ts"));
const Quantifier_1 = __importDefault(__webpack_require__(/*! ../tokens/Quantifier */ "./app/src/ast/tokens/Quantifier.ts"));
const RelativePronoun_1 = __importDefault(__webpack_require__(/*! ../tokens/RelativePronoun */ "./app/src/ast/tokens/RelativePronoun.ts"));
const SubordinatingConjunction_1 = __importDefault(__webpack_require__(/*! ../tokens/SubordinatingConjunction */ "./app/src/ast/tokens/SubordinatingConjunction.ts"));
const Then_1 = __importDefault(__webpack_require__(/*! ../tokens/Then */ "./app/src/ast/tokens/Then.ts"));
function getTokenCons(type) {
    return constructors[type];
}
exports.getTokenCons = getTokenCons;
const constructors = {
    'noun': Noun_1.default,
    'iverb': IVerb_1.default,
    'mverb': MVerb_1.default,
    'hverb': HVerb_1.default,
    'copula': Copula_1.default,
    'then': Then_1.default,
    'adj': Adjective_1.default,
    'existquant': Quantifier_1.default,
    'uniquant': Quantifier_1.default,
    'preposition': Preposition_1.default,
    'subconj': SubordinatingConjunction_1.default,
    'relpron': RelativePronoun_1.default,
    'defart': Article_1.default,
    'indefart': Article_1.default,
    'fullstop': FullStop_1.default,
    'nonsubconj': NonSubordinatingConjunction_1.default,
    'negation': Negation_1.default,
    'contraction': Negation_1.default //TODO: fix this crap  
};


/***/ }),

/***/ "./app/src/ast/phrases/Complement.ts":
/*!*******************************************!*\
  !*** ./app/src/ast/phrases/Complement.ts ***!
  \*******************************************/
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
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
class Complement {
    constructor(preposition, nounPhrase) {
        this.preposition = preposition;
        this.nounPhrase = nounPhrase;
    }
    toClause(args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const subjId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (() => { throw new Error('undefined subject id'); })();
            const newId = (0, Id_1.getRandomId)();
            return (0, Clause_1.clauseOf)(this.preposition.string, subjId, newId)
                .and(yield this.nounPhrase.toClause(Object.assign(Object.assign({}, args), { roles: { subject: newId } })))
                .copy({ sideEffecty: false });
        });
    }
}
exports["default"] = Complement;


/***/ }),

/***/ "./app/src/ast/phrases/CopulaSubordinateClause.ts":
/*!********************************************************!*\
  !*** ./app/src/ast/phrases/CopulaSubordinateClause.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
class CopulaSubordinateClause {
    constructor(relpron, predicate, copula) {
        this.relpron = relpron;
        this.predicate = predicate;
        this.copula = copula;
    }
    toClause(args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.predicate.toClause(Object.assign(Object.assign({}, args), { roles: { subject: (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject } })))
                .copy({ sideEffecty: false });
        });
    }
}
exports["default"] = CopulaSubordinateClause;


/***/ }),

/***/ "./app/src/ast/phrases/NounPhrase.ts":
/*!*******************************************!*\
  !*** ./app/src/ast/phrases/NounPhrase.ts ***!
  \*******************************************/
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
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
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
        return __awaiter(this, void 0, void 0, function* () {
            const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)();
            const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
            return this
                .adjectives
                .map(a => a.string)
                .concat(this.noun ? [this.noun.string] : [])
                .map(p => (0, Clause_1.clauseOf)(p, subjectId))
                .reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)())
                .and((yield Promise.all(this.complements.map(c => c.toClause(newArgs)))).reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)()))
                .and((_d = yield ((_c = this.subordClause) === null || _c === void 0 ? void 0 : _c.toClause(newArgs))) !== null && _d !== void 0 ? _d : (0, Clause_1.emptyClause)())
                .copy({ sideEffecty: false });
        });
    }
}
exports["default"] = NounPhrase;


/***/ }),

/***/ "./app/src/ast/sentences/ComplexSentence.ts":
/*!**************************************************!*\
  !*** ./app/src/ast/sentences/ComplexSentence.ts ***!
  \**************************************************/
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
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
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
        return __awaiter(this, void 0, void 0, function* () {
            const newArgs1 = Object.assign(Object.assign({}, args), { roles: { subject: (0, Id_1.getRandomId)() } });
            const condition = yield this.condition.toClause(newArgs1);
            const outcome = yield this.outcome.toClause(Object.assign(Object.assign({}, args), { anaphora: condition }));
            return condition.implies(outcome).copy({ sideEffecty: true });
        });
    }
}
exports["default"] = ComplexSentence;


/***/ }),

/***/ "./app/src/ast/sentences/CopulaQuestion.ts":
/*!*************************************************!*\
  !*** ./app/src/ast/sentences/CopulaQuestion.ts ***!
  \*************************************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
const CopulaSentence_1 = __importDefault(__webpack_require__(/*! ./CopulaSentence */ "./app/src/ast/sentences/CopulaSentence.ts"));
class CopulaQuestion {
    constructor(subject, predicate, copula) {
        this.subject = subject;
        this.predicate = predicate;
        this.copula = copula;
    }
    toClause(args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)({ asVar: this.subject.isUniQuant() });
            const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
            //TODO: in case of a universally quantified question eg: "are all cats smart?" the prolog
            // produced should NOT be an implication, but rather a check that all cats are smart.
            const clause = yield new CopulaSentence_1.default(this.subject, this.copula, this.predicate).toClause(newArgs);
            return clause.copy({ sideEffecty: false });
        });
    }
}
exports["default"] = CopulaQuestion;


/***/ }),

/***/ "./app/src/ast/sentences/CopulaSentence.ts":
/*!*************************************************!*\
  !*** ./app/src/ast/sentences/CopulaSentence.ts ***!
  \*************************************************/
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
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
// import { getAnaphora } from "../../brain/Anaphora";
class CopulaSentence {
    constructor(subject, copula, predicate, negation) {
        this.subject = subject;
        this.copula = copula;
        this.predicate = predicate;
        this.negation = negation;
    }
    toClause(args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)({ asVar: this.subject.isUniQuant() });
            const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
            const subject = yield this.subject.toClause(newArgs);
            const predicate = (yield this.predicate.toClause(newArgs)).copy({ negate: !!this.negation });
            const result = this.subject.isUniQuant() ?
                subject.implies(predicate) :
                subject.and(predicate, { asRheme: true });
            // const resolvedAnaphora = await getAnaphora(result).mapToClause(args?.anaphora ?? emptyClause())
            // return result.copy({map: resolvedAnaphora, sideEffecty : true})
            return result.copy({ sideEffecty: true });
        });
    }
}
exports["default"] = CopulaSentence;


/***/ }),

/***/ "./app/src/ast/sentences/IntransitiveSentence.ts":
/*!*******************************************************!*\
  !*** ./app/src/ast/sentences/IntransitiveSentence.ts ***!
  \*******************************************************/
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
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
class IntransitiveSentence {
    constructor(subject, iverb, complements, negation) {
        this.subject = subject;
        this.iverb = iverb;
        this.complements = complements;
        this.negation = negation;
    }
    toClause(args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)({ asVar: this.subject.isUniQuant() });
            const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
            const theme = yield this.subject.toClause(newArgs);
            const rheme = (0, Clause_1.clauseOf)(this.iverb.string, subjectId).and((yield Promise.all(this.complements.map(c => c.toClause(newArgs)))).reduce((c1, c2) => c1.and(c2)));
            return theme.and(rheme, { asRheme: true }).copy({ sideEffecty: true });
        });
    }
}
exports["default"] = IntransitiveSentence;


/***/ }),

/***/ "./app/src/ast/sentences/MonotransitiveSentence.ts":
/*!*********************************************************!*\
  !*** ./app/src/ast/sentences/MonotransitiveSentence.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports) {


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
class MonotransitiveSentence {
    constructor(subject, mverb, object, complements, negation) {
        this.subject = subject;
        this.mverb = mverb;
        this.object = object;
        this.complements = complements;
        this.negation = negation;
    }
    toClause(args) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
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
const Lexeme_1 = __webpack_require__(/*! ../../lexer/Lexeme */ "./app/src/lexer/Lexeme.ts");
const lexemes_1 = __webpack_require__(/*! ../../lexer/lexemes */ "./app/src/lexer/lexemes.ts");
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class Article extends AbstractToken_1.default {
    isDefinite() {
        return lexemes_1.lexemes
            .filter(x => x.type === 'defart')
            .flatMap(x => (0, Lexeme_1.formsOf)(x))
            .includes(this.string);
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
const Lexeme_1 = __webpack_require__(/*! ../../lexer/Lexeme */ "./app/src/lexer/Lexeme.ts");
const lexemes_1 = __webpack_require__(/*! ../../lexer/lexemes */ "./app/src/lexer/lexemes.ts");
const AbstractToken_1 = __importDefault(__webpack_require__(/*! ./AbstractToken */ "./app/src/ast/tokens/AbstractToken.ts"));
class Quantifier extends AbstractToken_1.default {
    isUniversal() {
        return lexemes_1.lexemes
            .filter(x => x.type === 'uniquant')
            .flatMap(x => (0, Lexeme_1.formsOf)(x))
            .includes(this.string);
    }
    isExistential() {
        return lexemes_1.lexemes
            .filter(x => x.type === 'existquant')
            .flatMap(x => (0, Lexeme_1.formsOf)(x))
            .includes(this.string);
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

/***/ "./app/src/brain/BasicBrain.ts":
/*!*************************************!*\
  !*** ./app/src/brain/BasicBrain.ts ***!
  \*************************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Action_1 = __webpack_require__(/*! ../action/Action */ "./app/src/action/Action.ts");
const Parser_1 = __webpack_require__(/*! ../parser/Parser */ "./app/src/parser/Parser.ts");
const Enviro_1 = __importDefault(__webpack_require__(/*! ../enviro/Enviro */ "./app/src/enviro/Enviro.ts"));
class BasicBrain {
    constructor(enviro = (0, Enviro_1.default)()) {
        this.enviro = enviro;
    }
    execute(natlang) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const ast of (0, Parser_1.getParser)(natlang).parseAll()) {
                const clause = yield ast.toClause();
                console.log(clause.toString(), 'side-effetcs:', clause.isSideEffecty);
                (0, Action_1.getAction)(clause, this.enviro);
            }
            return [];
        });
    }
}
exports["default"] = BasicBrain;


/***/ }),

/***/ "./app/src/brain/Brain.ts":
/*!********************************!*\
  !*** ./app/src/brain/Brain.ts ***!
  \********************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBrain = void 0;
const BasicBrain_1 = __importDefault(__webpack_require__(/*! ./BasicBrain */ "./app/src/brain/BasicBrain.ts"));
//TODO: where to put pointOut(id[])? (formerly in Actuator)
function getBrain(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return new BasicBrain_1.default();
    });
}
exports.getBrain = getBrain;


/***/ }),

/***/ "./app/src/clauses/And.ts":
/*!********************************!*\
  !*** ./app/src/clauses/And.ts ***!
  \********************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/clauses/Clause.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/clauses/Imply.ts"));
class And {
    constructor(clauses, negated = false, noAnaphora = false, isSideEffecty = false, isImply = false, hashCode = (0, Clause_1.hashString)(JSON.stringify(arguments)), theme = clauses[0], rheme = clauses[1]) {
        this.clauses = clauses;
        this.negated = negated;
        this.noAnaphora = noAnaphora;
        this.isSideEffecty = isSideEffecty;
        this.isImply = isImply;
        this.hashCode = hashCode;
        this.theme = theme;
        this.rheme = rheme;
    }
    and(other, opts) {
        return (opts === null || opts === void 0 ? void 0 : opts.asRheme) ?
            new And([this, other]) :
            new And([...this.flatList(), ...other.flatList()]);
    }
    copy(opts) {
        var _a, _b;
        return new And(this.clauses.map(c => c.copy(Object.assign(Object.assign({}, opts), { negate: false }))), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.noAnaphora) !== null && _a !== void 0 ? _a : this.noAnaphora, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
    }
    flatList() {
        return this.negated ? [this] : this.clauses.flatMap(c => c.flatList());
    }
    get entities() {
        return Array.from(new Set(this.clauses.flatMap(c => c.entities)));
    }
    implies(conclusion) {
        return new Imply_1.default(this, conclusion);
    }
    about(id) {
        if (this.negated) {
            return (0, Clause_1.emptyClause)(); // TODO!!!!!!!!!
        }
        else {
            return this.clauses.flatMap(c => c.about(id)).reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)());
        }
    }
    toAction() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('unimplemented!');
        });
    }
    toString() {
        const yes = this.clauses.map(x => x.toString()).toString();
        return this.negated ? `not(${yes})` : yes;
    }
    ownedBy(id) {
        return this.clauses.flatMap(x => x.ownedBy(id));
    }
    ownersOf(id) {
        return this.clauses.flatMap(x => x.ownersOf(id));
    }
    describe(id) {
        return this.clauses.flatMap(x => x.describe(id));
    }
}
exports["default"] = And;


/***/ }),

/***/ "./app/src/clauses/BasicClause.ts":
/*!****************************************!*\
  !*** ./app/src/clauses/BasicClause.ts ***!
  \****************************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicClause = void 0;
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/clauses/Clause.ts");
const Id_1 = __webpack_require__(/*! ./Id */ "./app/src/clauses/Id.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/clauses/Imply.ts"));
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/clauses/And.ts"));
class BasicClause {
    constructor(predicate, args, negated = false, noAnaphora = false, isSideEffecty = false, isImply = false, hashCode = (0, Clause_1.hashString)(JSON.stringify(arguments)), rheme = (0, Clause_1.emptyClause)()) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
        this.noAnaphora = noAnaphora;
        this.isSideEffecty = isSideEffecty;
        this.isImply = isImply;
        this.hashCode = hashCode;
        this.rheme = rheme;
    }
    and(other, opts) {
        return new And_1.default([this, ...other.flatList()]);
    }
    copy(opts) {
        var _a, _b;
        return new BasicClause(this.predicate, this.args.map(a => { var _a; return (opts === null || opts === void 0 ? void 0 : opts.map) ? (_a = opts === null || opts === void 0 ? void 0 : opts.map[a]) !== null && _a !== void 0 ? _a : a : a; }), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.noAnaphora) !== null && _a !== void 0 ? _a : this.noAnaphora, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
    }
    flatList() {
        return [this];
    }
    implies(conclusion) {
        return new Imply_1.default(this, conclusion);
    }
    about(id) {
        return this.entities.includes(id) ? this : (0, Clause_1.emptyClause)();
    }
    get theme() {
        return this;
    }
    get entities() {
        return Array.from(new Set(this.args.filter(a => !(0, Id_1.isVar)(a)))); // variable ids are NOT entities
    }
    toAction() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('unimplemented!');
        });
    }
    ownedBy(id) {
        return this.predicate === 'of' && this.args[1] === id ? [this.args[0]] : [];
    }
    ownersOf(id) {
        return this.predicate === 'of' && this.args[0] === id ? [this.args[1]] : [];
    }
    toString() {
        const yes = `${this.predicate}(${this.args})`;
        return this.negated ? `not(${yes})` : yes;
    }
    describe(id) {
        return this.entities.includes(id) && this.args.length === 1 ? [this.predicate] : [];
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
exports.hashString = exports.emptyClause = exports.clauseOf = void 0;
const BasicClause_1 = __webpack_require__(/*! ./BasicClause */ "./app/src/clauses/BasicClause.ts");
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/clauses/And.ts"));
function clauseOf(predicate, ...args) {
    return new BasicClause_1.BasicClause(predicate, args);
}
exports.clauseOf = clauseOf;
const emptyClause = () => new And_1.default([]);
exports.emptyClause = emptyClause;
function hashString(string) {
    return string.split('').map(c => c.charCodeAt(0)).reduce((hash, cc) => {
        const h1 = ((hash << 5) - hash) + cc;
        return h1 & h1; // Convert to 32bit integer
    });
}
exports.hashString = hashString;


/***/ }),

/***/ "./app/src/clauses/Id.ts":
/*!*******************************!*\
  !*** ./app/src/clauses/Id.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isVar = exports.toVar = exports.getRandomId = void 0;
function* getIdGenerator() {
    let x = 0;
    while (true) {
        x++;
        yield x;
    }
}
const idGenerator = getIdGenerator();
function getRandomId(opts) {
    // const newId = `id${parseInt(1000 * Math.random() + '')}`
    const newId = `id${idGenerator.next().value}`;
    return (opts === null || opts === void 0 ? void 0 : opts.asVar) ? toVar(newId) : newId;
}
exports.getRandomId = getRandomId;
function toVar(id) {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toUpperCase();
}
exports.toVar = toVar;
function isVar(e) {
    return Number.isNaN(Number(e)) && (e.toString()[0] === e.toString()[0].toUpperCase());
}
exports.isVar = isVar;


/***/ }),

/***/ "./app/src/clauses/Imply.ts":
/*!**********************************!*\
  !*** ./app/src/clauses/Imply.ts ***!
  \**********************************/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/clauses/Clause.ts");
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/clauses/And.ts"));
class Imply {
    constructor(condition, conclusion, negated = false, noAnaphora = false, isSideEffecty = false, isImply = true, hashCode = (0, Clause_1.hashString)(JSON.stringify(arguments)), theme = condition.theme) {
        this.condition = condition;
        this.conclusion = conclusion;
        this.negated = negated;
        this.noAnaphora = noAnaphora;
        this.isSideEffecty = isSideEffecty;
        this.isImply = isImply;
        this.hashCode = hashCode;
        this.theme = theme;
    }
    and(other, opts) {
        return new And_1.default([this, other]);
    }
    copy(opts) {
        var _a, _b;
        return new Imply(this.condition.copy(opts), this.conclusion.copy(opts), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.noAnaphora) !== null && _a !== void 0 ? _a : this.noAnaphora, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
    }
    flatList() {
        return [this];
    }
    get entities() {
        return this.condition.entities.concat(this.conclusion.entities);
    }
    get rheme() {
        return this; // dunno what I'm doin'
    }
    implies(conclusion) {
        throw new Error('not implemented!');
    }
    about(id) {
        return (0, Clause_1.emptyClause)(); ///TODO!!!!!!!!
    }
    toAction() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('unimplemented!');
        });
    }
    toString() {
        const yes = `${this.condition.toString()} ---> ${this.conclusion.toString()}`;
        return this.negated ? `not(${yes})` : yes;
    }
    ownedBy(id) {
        return this.condition.ownedBy(id).concat(this.conclusion.ownedBy(id));
    }
    ownersOf(id) {
        return this.condition.ownersOf(id).concat(this.conclusion.ownersOf(id));
    }
    describe(id) {
        return this.conclusion.describe(id).concat(this.condition.describe(id));
    }
}
exports["default"] = Imply;


/***/ }),

/***/ "./app/src/concepts/ConcreteWrapper.ts":
/*!*********************************************!*\
  !*** ./app/src/concepts/ConcreteWrapper.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class ConcreteWrapper {
    constructor(o) {
        this.o = o;
    }
    set(predicate, ...args) {
        this.o[predicate] = true;
        if (this.o instanceof HTMLElement) {
            this.o.style.background = predicate;
        }
    }
    is(predicate, ...args) {
        return this.o[predicate] !== undefined;
    }
}
exports["default"] = ConcreteWrapper;


/***/ }),

/***/ "./app/src/concepts/Wrapper.ts":
/*!*************************************!*\
  !*** ./app/src/concepts/Wrapper.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrap = void 0;
const ConcreteWrapper_1 = __importDefault(__webpack_require__(/*! ./ConcreteWrapper */ "./app/src/concepts/ConcreteWrapper.ts"));
function wrap(o) {
    return new ConcreteWrapper_1.default(o);
}
exports.wrap = wrap;


/***/ }),

/***/ "./app/src/enviro/BaseEnviro.ts":
/*!**************************************!*\
  !*** ./app/src/enviro/BaseEnviro.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports) {


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
class BaseEnviro {
    constructor(dictionary = {}) {
        this.dictionary = dictionary;
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // return this.dictionary[id] // TODO: could be undefined!
            return new Promise((ok, err) => {
                const interval = setInterval(() => {
                    if (this.dictionary[id]) {
                        clearInterval(interval);
                        ok(this.dictionary[id]);
                    }
                }, 100);
            });
        });
    }
    set(id, object) {
        // this.dictionary[id] = object
        const placeholder = this.dictionary[id];
        if (placeholder && placeholder instanceof Placeholder) {
            placeholder.predicates.forEach(p => {
                object.set(p);
            });
            this.dictionary[id] = object;
        }
    }
    query(clause) {
        return __awaiter(this, void 0, void 0, function* () {
            // for each entity in the clause, get the entities that match its description in the dictionary
            //TODO tmp solution, for anaphora resolution, but without taking (multi-entity) relationships into account
            const universe = Object
                .entries(this.dictionary);
            console.log({ universe });
            const query = clause
                .entities
                .map(e => ({ e, d: clause.theme.describe(e) }));
            console.log({ query });
            const res = query
                .map(q => { var _a; return ({ [q.e]: (_a = universe.find(u => q.d.every(s => { var _a; return (_a = u[1]) === null || _a === void 0 ? void 0 : _a.is(s); }))) === null || _a === void 0 ? void 0 : _a[0] }); })
                .reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
            console.log({ res });
            return res;
        });
    }
    setPlaceholder(id) {
        this.dictionary[id] = new Placeholder();
    }
    exists(id) {
        return this.dictionary[id] && !(this.dictionary[id] instanceof Placeholder);
    }
}
exports["default"] = BaseEnviro;
class Placeholder {
    constructor(predicates = []) {
        this.predicates = predicates;
    }
    set(predicate, ...args) {
        this.predicates.push(predicate);
    }
    is(predicate, ...args) {
        return this.predicates.includes(predicate);
    }
}


/***/ }),

/***/ "./app/src/enviro/Enviro.ts":
/*!**********************************!*\
  !*** ./app/src/enviro/Enviro.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const BaseEnviro_1 = __importDefault(__webpack_require__(/*! ./BaseEnviro */ "./app/src/enviro/BaseEnviro.ts"));
function getEnviro() {
    return new BaseEnviro_1.default();
}
exports["default"] = getEnviro;


/***/ }),

/***/ "./app/src/index.ts":
/*!**************************!*\
  !*** ./app/src/index.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const main_1 = __importDefault(__webpack_require__(/*! ./main/main */ "./app/src/main/main.ts"));
// testConcepts()
// wrapperTest()
(0, main_1.default)();


/***/ }),

/***/ "./app/src/lexer/EagerLexer.ts":
/*!*************************************!*\
  !*** ./app/src/lexer/EagerLexer.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Token_1 = __webpack_require__(/*! ../ast/interfaces/Token */ "./app/src/ast/interfaces/Token.ts");
const Lexeme_1 = __webpack_require__(/*! ./Lexeme */ "./app/src/lexer/Lexeme.ts");
class EagerLexer {
    constructor(sourceCode) {
        this.sourceCode = sourceCode;
        this.tokens = sourceCode
            .trim()
            .split(/\s+|\./)
            .map(e => !e ? '.' : e)
            .flatMap(string => (0, Lexeme_1.getLexemes)(string)
            .map(l => new ((0, Token_1.getTokenCons)(l.type))(l.name)));
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
    return [lexeme.name].concat((_a = lexeme === null || lexeme === void 0 ? void 0 : lexeme.forms) !== null && _a !== void 0 ? _a : [])
        .concat(lexeme.regular ? [`${lexeme.name}s`] : []);
}
exports.formsOf = formsOf;
function getLexemes(word) {
    var _a;
    const lexeme = (_a = lexemes_1.lexemes.filter(x => formsOf(x).includes(word))[0]) !== null && _a !== void 0 ? _a : { name: word, type: 'adj' };
    return lexeme.contractionFor ?
        lexeme.contractionFor.flatMap(x => getLexemes(x)) :
        [lexeme];
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
        name: 'have',
        type: 'mverb',
        forms: ['have', 'has'],
        regular: false
    },
    {
        name: 'button',
        type: 'noun',
        regular: true
    },
    {
        name: 'click',
        type: 'mverb',
        forms: ['click'],
        regular: true
    },
    {
        name: 'clicked',
        type: 'adj',
        derivedFrom: 'click'
    },
    {
        name: 'pressed',
        type: 'adj',
        aliasFor: 'clicked'
    },
    {
        name: 'cat',
        type: 'noun'
    },
    {
        name: 'be',
        type: 'copula',
        forms: ['is', 'are'],
        regular: false
    },
    {
        name: "isn't",
        type: 'contraction',
        contractionFor: ['is', 'not']
    },
    {
        name: "red",
        type: "adj"
    },
    {
        name: "green",
        type: "adj"
    },
    {
        name: "exist",
        type: "iverb",
        regular: true
    },
    {
        name: 'do',
        type: 'hverb',
        regular: false,
        forms: ['do', 'does']
    },
    {
        name: 'some',
        type: 'existquant'
    },
    {
        name: 'every',
        type: 'uniquant'
    },
    {
        name: 'all',
        type: 'uniquant'
    },
    {
        name: 'any',
        type: 'uniquant'
    },
    {
        name: 'to',
        type: 'preposition'
    },
    {
        name: 'with',
        type: 'preposition'
    },
    {
        name: 'from',
        type: 'preposition'
    },
    {
        name: 'of',
        type: 'preposition'
    },
    {
        name: 'over',
        type: 'preposition'
    },
    {
        name: 'on',
        type: 'preposition'
    },
    {
        name: 'at',
        type: 'preposition'
    },
    {
        name: 'then',
        type: 'then' // filler word
    },
    {
        name: 'if',
        type: 'subconj'
    },
    {
        name: 'when',
        type: 'subconj'
    },
    {
        name: 'because',
        type: 'subconj'
    },
    {
        name: 'while',
        type: 'subconj'
    },
    {
        name: 'that',
        type: 'relpron'
    },
    {
        name: 'not',
        type: 'negation'
    },
    {
        name: 'the',
        type: 'defart'
    },
    {
        name: 'a',
        type: 'indefart'
    },
    {
        name: 'an',
        type: 'indefart'
    },
    {
        name: '.',
        type: 'fullstop'
    },
    {
        name: 'and',
        type: 'nonsubconj'
    }
];


/***/ }),

/***/ "./app/src/main/main.ts":
/*!******************************!*\
  !*** ./app/src/main/main.ts ***!
  \******************************/
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
const Brain_1 = __webpack_require__(/*! ../brain/Brain */ "./app/src/brain/Brain.ts");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const state = {
            brain: yield (0, Brain_1.getBrain)({ withActuator: true }),
            promptVisible: false
        };
        window.brain = state.brain;
        const update = () => {
            textarea.hidden = !state.promptVisible;
            state.promptVisible ? textarea.focus() : 0;
        };
        const textarea = document.createElement('textarea');
        textarea.style.width = '50vw';
        textarea.style.height = '1em';
        textarea.hidden = true;
        textarea.style.position = 'sticky';
        textarea.style.top = '0';
        textarea.style.zIndex = '1000';
        document.body.appendChild(textarea);
        document.body.appendChild(document.createElement('br'));
        document.body.appendChild(document.createElement('br'));
        document.body.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
            if (e.ctrlKey && e.code === 'Space') {
                state.promptVisible = !state.promptVisible;
            }
            else if (e.ctrlKey && e.code === 'Enter') {
                const result = yield state.brain.execute(textarea.value);
                console.log(result);
            }
            update();
        }));
    });
}
exports["default"] = main;


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
const FullStop_1 = __importDefault(__webpack_require__(/*! ../ast/tokens/FullStop */ "./app/src/ast/tokens/FullStop.ts"));
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
            // console.debug((error as Error).message)
            this.lx.backTo(memento);
        }
    }
    errorOut(errorMsg) {
        this.lx.croak(errorMsg);
        throw new Error(errorMsg);
    }
    parseAll() {
        const results = [];
        while (!this.lx.isEnd) {
            results.push(this.parse());
            this.lx.assert(FullStop_1.default, { errorOut: false });
        }
        return results;
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./app/src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FjdGlvbi9BY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hY3Rpb24vQ3JlYXRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYWN0aW9uL0VkaXQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvaW50ZXJmYWNlcy9Ub2tlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9waHJhc2VzL0NvbXBsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Db3B1bGFTdWJvcmRpbmF0ZUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9waHJhc2VzL05vdW5QaHJhc2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvbXBsZXhTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvQ29wdWxhUXVlc3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvcHVsYVNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9JbnRyYW5zaXRpdmVTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvTW9ub3RyYW5zaXRpdmVTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQWJzdHJhY3RUb2tlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQWRqZWN0aXZlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9BcnRpY2xlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9Db3B1bGEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0Z1bGxTdG9wLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9IVmVyYi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvSVZlcmIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL01WZXJiLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9OZWdhdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9Ob3VuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9QcmVwb3NpdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUXVhbnRpZmllci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUmVsYXRpdmVQcm9ub3VuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1RoZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9icmFpbi9CYXNpY0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYnJhaW4vQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0ltcGx5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY29uY2VwdHMvQ29uY3JldGVXcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY29uY2VwdHMvV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2Vudmlyby9CYXNlRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvZW52aXJvL0Vudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvbGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9CYXNpY1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0Jhc2ljQ2xhdXNlXCJcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBnZXRSYW5kb21JZCwgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiXG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiXG5pbXBvcnQgQ3JlYXRlIGZyb20gXCIuL0NyZWF0ZVwiXG5pbXBvcnQgRWRpdCBmcm9tIFwiLi9FZGl0XCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIEFjdGlvbiB7XG4gICAgcnVuKGVudmlybzogRW52aXJvKTogUHJvbWlzZTxhbnk+XG59XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFjdGlvbihjbGF1c2U6IENsYXVzZSwgZW52aXJvOiBFbnZpcm8pIHtcblxuICAgIGNvbnN0IG93bmVyc2hpcENoYWluID0gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlKVxuICAgIC8vIGNvbnNvbGUubG9nKHsgb3duZXJzaGlwQ2hhaW4gfSlcblxuICAgIC8vVE9ETyA/Pz8gRE9OJ1QgZG8gYW55IG9mIHRoZSBmb2xsb3dpbmcgaW1tZWRpYXRlbHksIGp1c3QgcHJlcGFyZSBjb2RlIGZvciBsYXRlciEgPz8/XG5cbiAgICAvLzEgZ2V0IHRoZSB0b3AtbGV2ZWwgb2JqZWN0J3MgSUQgZnJvbSBhbiBFbnZpcm8sIGlmIG5vbmUgY3JlYXRlIGl0XG4gICAgbGV0IGlkID0gKGF3YWl0IGVudmlyby5xdWVyeShjbGF1c2UpKVtvd25lcnNoaXBDaGFpblswXV1cbiAgICBcbiAgICBpZiAoIWlkKSB7XG4gICAgICAgIGVudmlyby5zZXRQbGFjZWhvbGRlcihpZCA9IGdldFJhbmRvbUlkKCkpXG4gICAgfVxuXG4gICAgLy8yIGRldGVybWluZSBraW5kIG9mIGFjdGlvbiAoY3JlYXRvciBvciBub24tY3JlYXRvcilcbiAgICAvLzMgZGlzdHJpYnV0ZSB0aGUgaWQgdG8gZXZlcnkgYWN0aW9uIChvbmUgYWN0aW9uIHBlciBwcmVkaWNhdGUpXG5cbiAgICBjb25zdCBhY3Rpb25zID0gY2xhdXNlXG4gICAgICAgIC5mbGF0TGlzdCgpXG4gICAgICAgIC5tYXAoYyA9PiAoYyBhcyBCYXNpY0NsYXVzZSkpXG4gICAgICAgIC5tYXAoYyA9PiBpc0NyZWF0b3JBY3Rpb24oYy5wcmVkaWNhdGUpID8gbmV3IENyZWF0ZShpZCBhcyBJZCwgYy5wcmVkaWNhdGUpIDogbmV3IEVkaXQoaWQgYXMgSWQsIGMucHJlZGljYXRlKSlcblxuXG4gICAgLy80IGNyZWF0b3IgYWN0aW9ucyBjcmVhdGUgdGhlIG9iamVjdCBpZiBpdCBkb2Vzbid0IGV4aXN0IHlldFxuICAgIC8vNSBub24tY3JlYXRvciBhY3Rpb25zIFdBSVQgaWYgdGhlIG9iamVjdCBkb2Vzbid0IGV4aXN0IHlldC5cbiAgICAvLyAod2FpdCBpcyBoYW5kbGVkIGJ5IEVudmlybydzIGdldCgpKVxuXG4gICAgYWN0aW9ucy5mb3JFYWNoKGEgPT4ge1xuICAgICAgICBhLnJ1bihlbnZpcm8pXG4gICAgfSlcblxufVxuXG5cbmZ1bmN0aW9uIGdldE93bmVyc2hpcENoYWluKGNsYXVzZTogQ2xhdXNlKSB7IC8vVE9ETzogZ2VuZXJhbGl6ZVxuXG4gICAgY29uc3QgdG9wTGV2ZWwgPSBjbGF1c2UuZW50aXRpZXNcbiAgICAgICAgLm1hcCh4ID0+ICh7IHgsIG93bmVyczogY2xhdXNlLm93bmVyc09mKHgpIH0pKVxuICAgICAgICAuZmlsdGVyKHggPT4geC5vd25lcnMubGVuZ3RoID09PSAwKVxuICAgICAgICAubWFwKHggPT4geC54KVxuXG4gICAgY29uc3Qgc2Vjb25kTGV2ZWxFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KHRvcExldmVsWzBdKVxuICAgIGNvbnN0IHRocmlkTGV2ZWxFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KHNlY29uZExldmVsRW50aXRpZXNbMF0pXG5cbiAgICAvLyBjb25zdCBkZXNjcyA9IGNsYXVzZS5lbnRpdGllcy5tYXAoZSA9PiBjbGF1c2UuZGVzY3JpYmUoZSkpXG4gICAgLy8gY29uc29sZS5sb2coeyBkZXNjcyB9KVxuXG4gICAgcmV0dXJuIFt0b3BMZXZlbFswXSwgc2Vjb25kTGV2ZWxFbnRpdGllc1swXSwgdGhyaWRMZXZlbEVudGl0aWVzWzBdXVxufVxuXG5cbmZ1bmN0aW9uIGlzQ3JlYXRvckFjdGlvbihwcmVkaWNhdGU6IHN0cmluZykge1xuICAgIHJldHVybiBwcmVkaWNhdGUgPT09ICdidXR0b24nXG59XG5cblxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgd3JhcCB9IGZyb20gXCIuLi9jb25jZXB0cy9XcmFwcGVyXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGlkOiBJZCwgcmVhZG9ubHkgcHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBydW4oZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPGFueT4ge1xuXG4gICAgICAgIGlmKGVudmlyby5leGlzdHModGhpcy5pZCkpeyAvLyAgZXhpc3RlbmNlIGNoZWNrIHByaW9yIHRvIGNyZWF0aW5nXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNEb21FbGVtKHRoaXMucHJlZGljYXRlKSkge1xuXG4gICAgICAgICAgICBjb25zdCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnByZWRpY2F0ZSlcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobylcbiAgICAgICAgICAgIG8uaWQgPSB0aGlzLmlkICsgJydcbiAgICAgICAgICAgIG8udGV4dENvbnRlbnQgPSAnZGVmYXVsdCdcbiAgICAgICAgICAgIGNvbnN0IG5ld09iaiA9IHdyYXAobylcbiAgICAgICAgICAgIG5ld09iai5zZXQodGhpcy5wcmVkaWNhdGUpXG4gICAgICAgICAgICBlbnZpcm8uc2V0KHRoaXMuaWQsIG5ld09iailcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gaXNEb21FbGVtKHByZWRpY2F0ZTogc3RyaW5nKSB7XG5cbiAgICByZXR1cm4gWydidXR0b24nXS5pbmNsdWRlcyhwcmVkaWNhdGUpXG5cbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdCBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBpZDogSWQsIHJlYWRvbmx5IHByZWRpY2F0ZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcnVuKGVudmlybzogRW52aXJvKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gYXdhaXQgZW52aXJvLmdldCh0aGlzLmlkKVxuICAgICAgICBvYmouc2V0KHRoaXMucHJlZGljYXRlKVxuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgQ29uc3RydWN0b3IgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZXJcIjtcbmltcG9ydCBBZGplY3RpdmUgZnJvbSBcIi4uL3Rva2Vucy9BZGplY3RpdmVcIjtcbmltcG9ydCBBcnRpY2xlIGZyb20gXCIuLi90b2tlbnMvQXJ0aWNsZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IEZ1bGxTdG9wIGZyb20gXCIuLi90b2tlbnMvRnVsbFN0b3BcIjtcbmltcG9ydCBIVmVyYiBmcm9tIFwiLi4vdG9rZW5zL0hWZXJiXCI7XG5pbXBvcnQgSVZlcmIgZnJvbSBcIi4uL3Rva2Vucy9JVmVyYlwiO1xuaW1wb3J0IE1WZXJiIGZyb20gXCIuLi90b2tlbnMvTVZlcmJcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vdG9rZW5zL05lZ2F0aW9uXCI7XG5pbXBvcnQgTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gXCIuLi90b2tlbnMvTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vdG9rZW5zL05vdW5cIjtcbmltcG9ydCBQcmVwb3NpdGlvbiBmcm9tIFwiLi4vdG9rZW5zL1ByZXBvc2l0aW9uXCI7XG5pbXBvcnQgUXVhbnRpZmllciBmcm9tIFwiLi4vdG9rZW5zL1F1YW50aWZpZXJcIjtcbmltcG9ydCBSZWxhdGl2ZVByb25vdW4gZnJvbSBcIi4uL3Rva2Vucy9SZWxhdGl2ZVByb25vdW5cIjtcbmltcG9ydCBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSBcIi4uL3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25cIjtcbmltcG9ydCBUaGVuIGZyb20gXCIuLi90b2tlbnMvVGhlblwiO1xuaW1wb3J0IEFzdCBmcm9tIFwiLi9Bc3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFRva2VuIGV4dGVuZHMgQXN0IHtcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9rZW5Db25zKHR5cGU6IFRva2VuVHlwZSk6IENvbnN0cnVjdG9yPFRva2VuPiB7XG4gICAgcmV0dXJuIGNvbnN0cnVjdG9yc1t0eXBlXVxufVxuXG5leHBvcnQgdHlwZSBUb2tlblR5cGUgPVxuICAgICdub3VuJ1xuICAgIHwgJ2l2ZXJiJ1xuICAgIHwgJ212ZXJiJ1xuICAgIHwgJ2h2ZXJiJ1xuICAgIHwgJ2NvcHVsYSdcbiAgICB8ICd0aGVuJ1xuICAgIHwgJ2FkaidcbiAgICB8ICdleGlzdHF1YW50J1xuICAgIHwgJ3VuaXF1YW50J1xuICAgIHwgJ3ByZXBvc2l0aW9uJ1xuICAgIHwgJ3N1YmNvbmonXG4gICAgfCAncmVscHJvbidcbiAgICB8ICdkZWZhcnQnXG4gICAgfCAnaW5kZWZhcnQnXG4gICAgfCAnZnVsbHN0b3AnXG4gICAgfCAnbm9uc3ViY29uaidcbiAgICB8ICduZWdhdGlvbidcbiAgICB8ICdjb250cmFjdGlvbidcblxuY29uc3QgY29uc3RydWN0b3JzOiB7IFt4IGluIFRva2VuVHlwZV06IENvbnN0cnVjdG9yPFRva2VuPiB9ID0ge1xuICAgICdub3VuJzogTm91bixcbiAgICAnaXZlcmInOiBJVmVyYixcbiAgICAnbXZlcmInOiBNVmVyYixcbiAgICAnaHZlcmInOiBIVmVyYixcbiAgICAnY29wdWxhJzogQ29wdWxhLFxuICAgICd0aGVuJzogVGhlbixcbiAgICAnYWRqJzogQWRqZWN0aXZlLFxuICAgICdleGlzdHF1YW50JzogUXVhbnRpZmllcixcbiAgICAndW5pcXVhbnQnOiBRdWFudGlmaWVyLFxuICAgICdwcmVwb3NpdGlvbic6IFByZXBvc2l0aW9uLFxuICAgICdzdWJjb25qJzogU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLFxuICAgICdyZWxwcm9uJzogUmVsYXRpdmVQcm9ub3VuLFxuICAgICdkZWZhcnQnOiBBcnRpY2xlLFxuICAgICdpbmRlZmFydCc6IEFydGljbGUsXG4gICAgJ2Z1bGxzdG9wJzogRnVsbFN0b3AsXG4gICAgJ25vbnN1YmNvbmonOiBOb25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sXG4gICAgJ25lZ2F0aW9uJzogTmVnYXRpb24sXG4gICAgJ2NvbnRyYWN0aW9uJzogTmVnYXRpb24gLy9UT0RPOiBmaXggdGhpcyBjcmFwICBcbn0iLCJpbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQsIElkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBQaHJhc2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvUGhyYXNlXCI7XG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSBcIi4uL3Rva2Vucy9QcmVwb3NpdGlvblwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4vTm91blBocmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wbGVtZW50IGltcGxlbWVudHMgUGhyYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHByZXBvc2l0aW9uOiBQcmVwb3NpdGlvbiwgcmVhZG9ubHkgbm91blBocmFzZTogTm91blBocmFzZSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7IC8vIHByZXBvc2l0aW9uKGFyZ3Muc3ViamVjdCwgWSkgKyBub3VucGhyYXNlLnRvUHJvbG9nKHN1YmplY3Q9WSlcblxuICAgICAgICBjb25zdCBzdWJqSWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyAoKCk6IElkID0+IHsgdGhyb3cgbmV3IEVycm9yKCd1bmRlZmluZWQgc3ViamVjdCBpZCcpIH0pKClcbiAgICAgICAgY29uc3QgbmV3SWQgPSBnZXRSYW5kb21JZCgpXG5cbiAgICAgICAgcmV0dXJuIGNsYXVzZU9mKHRoaXMucHJlcG9zaXRpb24uc3RyaW5nLCBzdWJqSWQsIG5ld0lkKVxuICAgICAgICAgICAgLmFuZChhd2FpdCB0aGlzLm5vdW5QaHJhc2UudG9DbGF1c2UoeyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBuZXdJZCB9IH0pKVxuICAgICAgICAgICAgLmNvcHkoe3NpZGVFZmZlY3R5IDogZmFsc2V9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IFN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgUmVsYXRpdmVQcm9ub3VuIGZyb20gXCIuLi90b2tlbnMvUmVsYXRpdmVQcm9ub3VuXCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi9Ob3VuUGhyYXNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlIGltcGxlbWVudHMgU3Vib3JkaW5hdGVDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcmVscHJvbjogUmVsYXRpdmVQcm9ub3VuLCByZWFkb25seSBwcmVkaWNhdGU6IE5vdW5QaHJhc2UsIHJlYWRvbmx5IGNvcHVsYTogQ29wdWxhKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCB0aGlzLnByZWRpY2F0ZS50b0NsYXVzZSh7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IGFyZ3M/LnJvbGVzPy5zdWJqZWN0IH0gfSkpXG4gICAgICAgIC5jb3B5KHtzaWRlRWZmZWN0eSA6IGZhbHNlfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vdG9rZW5zL0FkamVjdGl2ZVwiO1xuaW1wb3J0IEFydGljbGUgZnJvbSBcIi4uL3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vdG9rZW5zL05vdW5cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi90b2tlbnMvUXVhbnRpZmllclwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4vQ29tcGxlbWVudFwiO1xuaW1wb3J0IFN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm91blBocmFzZSBpbXBsZW1lbnRzIFBocmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBhZGplY3RpdmVzOiBBZGplY3RpdmVbXSxcbiAgICAgICAgcmVhZG9ubHkgY29tcGxlbWVudHM6IENvbXBsZW1lbnRbXSxcbiAgICAgICAgcmVhZG9ubHkgbm91bj86IE5vdW4sXG4gICAgICAgIHJlYWRvbmx5IHF1YW50aWZpZXI/OiBRdWFudGlmaWVyLFxuICAgICAgICByZWFkb25seSBhcnRpY2xlPzogQXJ0aWNsZSxcbiAgICAgICAgcmVhZG9ubHkgc3Vib3JkQ2xhdXNlPzogU3Vib3JkaW5hdGVDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIGlzVW5pUXVhbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1YW50aWZpZXI/LmlzVW5pdmVyc2FsKCkgPz8gZmFsc2VcbiAgICB9XG5cbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICAgICAgICAuYWRqZWN0aXZlc1xuICAgICAgICAgICAgLm1hcChhID0+IGEuc3RyaW5nKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLm5vdW4gPyBbdGhpcy5ub3VuLnN0cmluZ10gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihwLCBzdWJqZWN0SWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmFuZCgoYXdhaXQgUHJvbWlzZS5hbGwodGhpcy5jb21wbGVtZW50cy5tYXAoYyA9PiBjLnRvQ2xhdXNlKG5ld0FyZ3MpKSkpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKSlcbiAgICAgICAgICAgIC5hbmQoYXdhaXQgdGhpcy5zdWJvcmRDbGF1c2U/LnRvQ2xhdXNlKG5ld0FyZ3MpID8/IGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgICAgICAuY29weSh7c2lkZUVmZmVjdHkgOiBmYWxzZX0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgQ29tcG91bmRTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db21wb3VuZFNlbnRlbmNlXCI7XG5pbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRSYW5kb21JZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgU2ltcGxlU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU2ltcGxlU2VudGVuY2VcIjtcbmltcG9ydCBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSBcIi4uL3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25cIjtcblxuLyoqXG4gKiBBIHNlbnRlbmNlIHRoYXQgcmVsYXRlcyB0d28gc2ltcGxlIHNlbnRlbmNlcyBoeXBvdGFjdGljYWxseSwgaW4gYSBcbiAqIGNvbmRpdGlvbi1vdXRjb21lIHJlbGF0aW9uc2hpcC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGxleFNlbnRlbmNlIGltcGxlbWVudHMgQ29tcG91bmRTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25kaXRpb246IFNpbXBsZVNlbnRlbmNlLFxuICAgICAgICByZWFkb25seSBvdXRjb21lOiBTaW1wbGVTZW50ZW5jZSxcbiAgICAgICAgcmVhZG9ubHkgc3ViY29uajogU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuICAgICAgICBjb25zdCBuZXdBcmdzMSA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogZ2V0UmFuZG9tSWQoKSB9IH1cblxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSBhd2FpdCB0aGlzLmNvbmRpdGlvbi50b0NsYXVzZShuZXdBcmdzMSlcbiAgICAgICAgY29uc3Qgb3V0Y29tZSA9IGF3YWl0IHRoaXMub3V0Y29tZS50b0NsYXVzZSh7IC4uLmFyZ3MsIGFuYXBob3JhOiBjb25kaXRpb24gfSlcbiAgICAgICAgcmV0dXJuIGNvbmRpdGlvbi5pbXBsaWVzKG91dGNvbWUpLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBCaW5hcnlRdWVzdGlvbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9CaW5hcnlRdWVzdGlvblwiO1xuaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IENvcHVsYVNlbnRlbmNlIGZyb20gXCIuL0NvcHVsYVNlbnRlbmNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYVF1ZXN0aW9uIGltcGxlbWVudHMgQmluYXJ5UXVlc3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDogTm91blBocmFzZSwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoeyBhc1ZhcjogdGhpcy5zdWJqZWN0LmlzVW5pUXVhbnQoKSB9KVxuICAgICAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG5cbiAgICAgICAgLy9UT0RPOiBpbiBjYXNlIG9mIGEgdW5pdmVyc2FsbHkgcXVhbnRpZmllZCBxdWVzdGlvbiBlZzogXCJhcmUgYWxsIGNhdHMgc21hcnQ/XCIgdGhlIHByb2xvZ1xuICAgICAgICAvLyBwcm9kdWNlZCBzaG91bGQgTk9UIGJlIGFuIGltcGxpY2F0aW9uLCBidXQgcmF0aGVyIGEgY2hlY2sgdGhhdCBhbGwgY2F0cyBhcmUgc21hcnQuXG5cbiAgICAgICAgY29uc3QgY2xhdXNlID0gYXdhaXQgbmV3IENvcHVsYVNlbnRlbmNlKHRoaXMuc3ViamVjdCwgdGhpcy5jb3B1bGEsIHRoaXMucHJlZGljYXRlKS50b0NsYXVzZShuZXdBcmdzKVxuXG4gICAgICAgIHJldHVybiBjbGF1c2UuY29weSh7c2lkZUVmZmVjdHkgOiBmYWxzZX0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFNpbXBsZVNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1NpbXBsZVNlbnRlbmNlXCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuLy8gaW1wb3J0IHsgZ2V0QW5hcGhvcmEgfSBmcm9tIFwiLi4vLi4vYnJhaW4vQW5hcGhvcmFcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhU2VudGVuY2UgaW1wbGVtZW50cyBTaW1wbGVTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBuZWdhdGlvbj86IE5lZ2F0aW9uKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKHsgYXNWYXI6IHRoaXMuc3ViamVjdC5pc1VuaVF1YW50KCkgfSlcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBhd2FpdCB0aGlzLnN1YmplY3QudG9DbGF1c2UobmV3QXJncylcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gKGF3YWl0IHRoaXMucHJlZGljYXRlLnRvQ2xhdXNlKG5ld0FyZ3MpKS5jb3B5KHsgbmVnYXRlOiAhIXRoaXMubmVnYXRpb24gfSlcblxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnN1YmplY3QuaXNVbmlRdWFudCgpID9cbiAgICAgICAgICAgIHN1YmplY3QuaW1wbGllcyhwcmVkaWNhdGUpIDpcbiAgICAgICAgICAgIHN1YmplY3QuYW5kKHByZWRpY2F0ZSwgeyBhc1JoZW1lOiB0cnVlIH0pXG5cbiAgICAgICAgLy8gY29uc3QgcmVzb2x2ZWRBbmFwaG9yYSA9IGF3YWl0IGdldEFuYXBob3JhKHJlc3VsdCkubWFwVG9DbGF1c2UoYXJncz8uYW5hcGhvcmEgPz8gZW1wdHlDbGF1c2UoKSlcbiAgICAgICAgLy8gcmV0dXJuIHJlc3VsdC5jb3B5KHttYXA6IHJlc29sdmVkQW5hcGhvcmEsIHNpZGVFZmZlY3R5IDogdHJ1ZX0pXG4gICAgICAgIHJldHVybiByZXN1bHQuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlIH0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBJVmVyYiBmcm9tIFwiLi4vdG9rZW5zL0lWZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRyYW5zaXRpdmVTZW50ZW5jZSBpbXBsZW1lbnRzIFZlcmJTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLFxuICAgICAgICByZWFkb25seSBpdmVyYjogSVZlcmIsXG4gICAgICAgIHJlYWRvbmx5IGNvbXBsZW1lbnRzOiBDb21wbGVtZW50W10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cbiAgICBcbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCh7IGFzVmFyOiB0aGlzLnN1YmplY3QuaXNVbmlRdWFudCgpIH0pXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICBjb25zdCB0aGVtZSA9IGF3YWl0IHRoaXMuc3ViamVjdC50b0NsYXVzZShuZXdBcmdzKVxuICAgICAgICBcbiAgICAgICAgY29uc3QgcmhlbWUgPSBjbGF1c2VPZih0aGlzLml2ZXJiLnN0cmluZywgc3ViamVjdElkKS5hbmQoKGF3YWl0IFByb21pc2UuYWxsKHRoaXMuY29tcGxlbWVudHMubWFwKCBjID0+IGMudG9DbGF1c2UobmV3QXJncykpKSkucmVkdWNlKCAoYzEsIGMyKSA9PiBjMS5hbmQoYzIpKSlcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGVtZS5hbmQocmhlbWUsIHsgYXNSaGVtZTogdHJ1ZSB9KS5jb3B5KHtzaWRlRWZmZWN0eTp0cnVlfSlcbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vdG9rZW5zL01WZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlIGltcGxlbWVudHMgVmVyYlNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgbXZlcmI6IE1WZXJiLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG9iamVjdDogTm91blBocmFzZSxcbiAgICAgICAgICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cbiAgICBcbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBBYnN0cmFjdFRva2VuIGltcGxlbWVudHMgVG9rZW57XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdHJpbmc6c3RyaW5nKXtcblxuICAgIH0gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkamVjdGl2ZSBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IHsgZm9ybXNPZiB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvbGV4ZW1lc1wiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnRpY2xlIGV4dGVuZHMgQWJzdHJhY3RUb2tlbiB7XG5cbiAgICBpc0RlZmluaXRlKCkge1xuXG4gICAgICAgIHJldHVybiBsZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC50eXBlID09PSAnZGVmYXJ0JylcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4gZm9ybXNPZih4KSlcbiAgICAgICAgICAgIC5pbmNsdWRlcyh0aGlzLnN0cmluZylcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGBBcnRpY2xlKCR7dGhpcy5zdHJpbmd9LCBpc0RlZmluaXRlPSR7dGhpcy5pc0RlZmluaXRlKCl9KWBcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnVsbFN0b3AgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIVmVyYiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElWZXJiIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTVZlcmIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZWdhdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdW4gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVwb3NpdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgICAgXG59IiwiaW1wb3J0IHsgZm9ybXNPZiB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvbGV4ZW1lc1wiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWFudGlmaWVyIGV4dGVuZHMgQWJzdHJhY3RUb2tlbiB7XG5cbiAgICBpc1VuaXZlcnNhbCgpIHtcblxuICAgICAgICByZXR1cm4gbGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHgudHlwZSA9PT0gJ3VuaXF1YW50JylcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4gZm9ybXNPZih4KSlcbiAgICAgICAgICAgIC5pbmNsdWRlcyh0aGlzLnN0cmluZylcblxuICAgIH1cblxuICAgIGlzRXhpc3RlbnRpYWwoKSB7XG5cbiAgICAgICAgcmV0dXJuIGxleGVtZXNcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LnR5cGUgPT09ICdleGlzdHF1YW50JylcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4gZm9ybXNPZih4KSlcbiAgICAgICAgICAgIC5pbmNsdWRlcyh0aGlzLnN0cmluZylcblxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWxhdGl2ZVByb25vdW4gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaGVuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICAgXG59IiwiaW1wb3J0IHsgZ2V0QWN0aW9uIH0gZnJvbSBcIi4uL2FjdGlvbi9BY3Rpb25cIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi9wYXJzZXIvUGFyc2VyXCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCBnZXRFbnZpcm8gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZW52aXJvID0gZ2V0RW52aXJvKCkpIHtcblxuICAgIH1cblxuICAgIGFzeW5jIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogUHJvbWlzZTxhbnlbXT4ge1xuXG4gICAgICAgIGZvciAoY29uc3QgYXN0IG9mIGdldFBhcnNlcihuYXRsYW5nKS5wYXJzZUFsbCgpKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IGF3YWl0IGFzdC50b0NsYXVzZSgpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjbGF1c2UudG9TdHJpbmcoKSwgJ3NpZGUtZWZmZXRjczonLCBjbGF1c2UuaXNTaWRlRWZmZWN0eSlcbiAgICAgICAgICAgIGdldEFjdGlvbihjbGF1c2UsIHRoaXMuZW52aXJvKVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICAvLyBhc3luYyBxdWVyeShxdWVyeTogQ2xhdXNlKTogUHJvbWlzZTxNYXBbXT4ge1xuICAgIC8vICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIC8vIH1cblxuICAgIC8vIGFzeW5jIGFzc2VydChjb2RlOiBDbGF1c2UsIG9wdHM/OiBBc3NlcnRPcHRzKTogUHJvbWlzZTxNYXBbXT4ge1xuICAgIC8vICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIC8vIH1cblxufSIsImltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCJcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiXG5pbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi9CYXNpY0JyYWluXCJcblxuLyoqXG4gKiBUaGUgbWFpbiBmYWNhZGUgY29udHJvbGxlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIEJyYWluIHtcbiAgICByZWFkb25seSBlbnZpcm86IEVudmlyb1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogUHJvbWlzZTxhbnlbXT5cbiAgICAvLyBxdWVyeShxdWVyeTogQ2xhdXNlKTogUHJvbWlzZTxNYXBbXT5cbiAgICAvLyBhc3NlcnQoY29kZTogQ2xhdXNlLCBvcHRzPzogQXNzZXJ0T3B0cyk6IFByb21pc2U8TWFwW10+XG59XG5cbi8vVE9ETzogd2hlcmUgdG8gcHV0IHBvaW50T3V0KGlkW10pPyAoZm9ybWVybHkgaW4gQWN0dWF0b3IpXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRCcmFpbihvcHRzPzogR2V0QnJhaW5PcHRzKTogUHJvbWlzZTxCcmFpbj4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbigpXG59XG5cbi8vIGV4cG9ydCBpbnRlcmZhY2UgQXNzZXJ0T3B0cyB7XG4vLyAgICAgZnJvbUJlbG93OiBib29sZWFuXG4vLyB9XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0QnJhaW5PcHRzIHtcbiAgICB3aXRoQWN0dWF0b3I6IGJvb2xlYW5cbn0iLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3Rpb24vQWN0aW9uXCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBoYXNoU3RyaW5nLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2VzOiBDbGF1c2VbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBub0FuYXBob3JhID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNJbXBseSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSksXG4gICAgICAgIHJlYWRvbmx5IHRoZW1lID0gY2xhdXNlc1swXSxcbiAgICAgICAgcmVhZG9ubHkgcmhlbWUgPSBjbGF1c2VzWzFdKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuXG4gICAgICAgIHJldHVybiBvcHRzPy5hc1JoZW1lID9cbiAgICAgICAgICAgIG5ldyBBbmQoW3RoaXMsIG90aGVyXSkgOlxuICAgICAgICAgICAgbmV3IEFuZChbLi4udGhpcy5mbGF0TGlzdCgpLCAuLi5vdGhlci5mbGF0TGlzdCgpXSlcblxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQW5kIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcy5jbGF1c2VzLm1hcChjID0+IGMuY29weSh7IC4uLm9wdHMsIG5lZ2F0ZTogZmFsc2UgfSkpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/Lm5vQW5hcGhvcmEgPz8gdGhpcy5ub0FuYXBob3JhLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5KVxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6IHRoaXMuY2xhdXNlcy5mbGF0TWFwKGMgPT4gYy5mbGF0TGlzdCgpKVxuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldCh0aGlzLmNsYXVzZXMuZmxhdE1hcChjID0+IGMuZW50aXRpZXMpKSlcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuXG4gICAgICAgIGlmICh0aGlzLm5lZ2F0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBlbXB0eUNsYXVzZSgpIC8vIFRPRE8hISEhISEhISFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsYXVzZXMuZmxhdE1hcChjID0+IGMuYWJvdXQoaWQpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UoKSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgYXN5bmMgdG9BY3Rpb24oKTogUHJvbWlzZTxBY3Rpb24+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlcy5tYXAoeCA9PiB4LnRvU3RyaW5nKCkpLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2VzLmZsYXRNYXAoeD0+eC5vd25lZEJ5KGlkKSlcbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlcy5mbGF0TWFwKHg9Pngub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlcy5mbGF0TWFwKHg9PnguZGVzY3JpYmUoaWQpKVxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlLCBoYXNoU3RyaW5nIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCwgaXNWYXIgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0aW9uL0FjdGlvblwiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuLi9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgY2xhc3MgQmFzaWNDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlZGljYXRlOiBzdHJpbmcsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgbm9BbmFwaG9yYSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpLFxuICAgICAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlKCkpIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKFt0aGlzLCAuLi5vdGhlci5mbGF0TGlzdCgpXSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEJhc2ljQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZSh0aGlzLnByZWRpY2F0ZSxcbiAgICAgICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXAgPyBvcHRzPy5tYXBbYV0gPz8gYSA6IGEpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/Lm5vQW5hcGhvcmEgPz8gdGhpcy5ub0FuYXBob3JhLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5KVxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzXVxuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0aWVzLmluY2x1ZGVzKGlkKSA/IHRoaXMgOiBlbXB0eUNsYXVzZSgpXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KHRoaXMuYXJncy5maWx0ZXIoYSA9PiAhaXNWYXIoYSkpKSkgLy8gdmFyaWFibGUgaWRzIGFyZSBOT1QgZW50aXRpZXNcbiAgICB9XG5cbiAgICBhc3luYyB0b0FjdGlvbigpOiBQcm9taXNlPEFjdGlvbj4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZSA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUgPT09ICdvZicgJiYgdGhpcy5hcmdzWzBdID09PSBpZCA/IFt0aGlzLmFyZ3NbMV1dIDogW11cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5wcmVkaWNhdGV9KCR7dGhpcy5hcmdzfSlgXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgJiYgdGhpcy5hcmdzLmxlbmd0aCA9PT0gMSA/IFt0aGlzLnByZWRpY2F0ZV0gOiBbXVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIlxuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuL0lkXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdGlvbi9BY3Rpb25cIlxuaW1wb3J0IEJyYWluIGZyb20gXCIuLi9icmFpbi9CcmFpblwiXG5cbi8qKlxuICogQSAnbGFuZ3VhZ2UtYWdub3N0aWMnIGZpcnN0IG9yZGVyIGxvZ2ljIHJlcHJlc2VudGF0aW9uLlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcbiAgICByZWFkb25seSBuZWdhdGVkOiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNJbXBseTogYm9vbGVhblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlOiBudW1iZXJcbiAgICByZWFkb25seSBlbnRpdGllczogSWRbXVxuICAgIHJlYWRvbmx5IHRoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSByaGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eTogYm9vbGVhblxuICAgIHJlYWRvbmx5IG5vQW5hcGhvcmE6IGJvb2xlYW5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW11cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2VcbiAgICB0b0FjdGlvbigpOiBQcm9taXNlPEFjdGlvbj5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW11cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdXG4gICAgZGVzY3JpYmUoaWQ6SWQpIDogc3RyaW5nW10gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGF1c2VPZihwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogSWRbXSk6IENsYXVzZSB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZSA9ICgpOiBDbGF1c2UgPT4gbmV3IEFuZChbXSlcblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIG5vQW5hcGhvcmE/OiBib29sZWFuIC8vIGludGVycHJldCBldmVyeSBpZCBhcyBleGFjdFxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuZE9wdHMge1xuICAgIGFzUmhlbWU/OiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjYztcbiAgICAgICAgcmV0dXJuIGgxICYgaDE7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pXG59XG4iLCIvKipcbiAqIElkIG9mIGFuIGVudGl0eS5cbiAqL1xuZXhwb3J0IHR5cGUgSWQgPSBudW1iZXIgfCBzdHJpbmdcblxuLyoqXG4gKiBJZCB0byBJZCBtYXBwaW5nLCBmcm9tIG9uZSBcInVuaXZlcnNlXCIgdG8gYW5vdGhlci5cbiAqL1xuZXhwb3J0IHR5cGUgTWFwID0geyBbYTogSWRdOiBJZCB9XG5cblxuZnVuY3Rpb24qIGdldElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMFxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHgrK1xuICAgICAgICB5aWVsZCB4XG4gICAgfVxufVxuXG5jb25zdCBpZEdlbmVyYXRvciA9IGdldElkR2VuZXJhdG9yKClcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbUlkKG9wdHM/OiBHZXRSYW5kb21JZE9wdHMpOiBJZCB7XG4gICAgXG4gICAgLy8gY29uc3QgbmV3SWQgPSBgaWQke3BhcnNlSW50KDEwMDAgKiBNYXRoLnJhbmRvbSgpICsgJycpfWBcblxuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YFxuXG4gICAgcmV0dXJuIG9wdHM/LmFzVmFyID8gdG9WYXIobmV3SWQpIDogbmV3SWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRSYW5kb21JZE9wdHMge1xuICAgIGFzVmFyOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1ZhcihpZDogSWQpOiBJZCB7XG4gICAgcmV0dXJuICghTnVtYmVyLmlzTmFOKE51bWJlcihpZCkpID8gYGlkJHtpZH1gIDogaWQgKyAnJykudG9VcHBlckNhc2UoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYXIoZTogSWQpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKE51bWJlcihlKSkgJiYgKGUudG9TdHJpbmcoKVswXSA9PT0gZS50b1N0cmluZygpWzBdLnRvVXBwZXJDYXNlKCkpXG59XG5cbiIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGhhc2hTdHJpbmcsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0aW9uL0FjdGlvblwiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuLi9icmFpbi9CcmFpblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbXBseSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25kaXRpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY29uY2x1c2lvbjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IG5vQW5hcGhvcmEgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gdHJ1ZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpLFxuICAgICAgICByZWFkb25seSB0aGVtZSA9IGNvbmRpdGlvbi50aGVtZSkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQoW3RoaXMsIG90aGVyXSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJbXBseSh0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jb25jbHVzaW9uLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8ubm9BbmFwaG9yYSA/PyB0aGlzLm5vQW5hcGhvcmEsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG5cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25jbHVzaW9uLmVudGl0aWVzKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcyAvLyBkdW5ubyB3aGF0IEknbSBkb2luJ1xuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2UoKSAvLy9UT0RPISEhISEhISFcbiAgICB9XG5cbiAgICBhc3luYyB0b0FjdGlvbigpOiBQcm9taXNlPEFjdGlvbj4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uY2x1c2lvbi50b1N0cmluZygpfWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY29uY2x1c2lvbi5vd25lZEJ5KGlkKSlcbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jb25jbHVzaW9uLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUoaWQpLmNvbmNhdCh0aGlzLmNvbmRpdGlvbi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG59IiwiaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25jcmV0ZVdyYXBwZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG86IGFueSkge1xuXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogc3RyaW5nLCAuLi5hcmdzOiBXcmFwcGVyW10pOiB2b2lkIHtcbiAgICAgICAgKHRoaXMubyBhcyBhbnkpW3ByZWRpY2F0ZV0gPSB0cnVlXG5cbiAgICAgICAgaWYgKHRoaXMubyBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLm8uc3R5bGUuYmFja2dyb3VuZCA9IHByZWRpY2F0ZVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBpcyhwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy5vIGFzIGFueSlbcHJlZGljYXRlXSAhPT0gdW5kZWZpbmVkXG4gICAgfVxuXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiXG5pbXBvcnQgQ29uY3JldGVXcmFwcGVyIGZyb20gXCIuL0NvbmNyZXRlV3JhcHBlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBXcmFwcGVyIHtcblxuICAgIHNldChwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogdm9pZCAvLyBvYmouc2V0KCdyZWQnKSwgb2JqLnNldCgnb24nLCBvYmoyKSAuLi5cbiAgICBpcyhwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogYm9vbGVhblxuICAgIC8vIGdldChwcmVkaWNhdGU6IHN0cmluZyk6IGFueVxuICAgIC8vIGdldFByb3AocGF0aDogc3RyaW5nW10pOiBhbnlcbiAgICAvLyBzZXRQcm9wKHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogYW55KTogdm9pZFxuICAgIC8vIGRlc2NyaWJlKCk6IHN0cmluZ1tdIC8vIFsnYnV0dG9uJywgJ3JlZCcsICdiaWcnLCAuLi5dXG4gICAgLy8gc2V0QWxpYXMobmFtZTogc3RyaW5nLCBwYXRoOiBzdHJpbmdbXSk6IHZvaWQgLy8gLnNldEFsaWFzKCd3aWR0aCcsIFsnc3R5bGUnLCAnd2lkdGgnXSlcbiAgICAvLyBhZGRDb25jZXB0KGNvbmNlcHQ6c3RyaW5nLCBzZXR0ZXI6KCk9PnZvaWQsIGlzOigpPT4pOnZvaWRcbiAgICAvLyBkb1NvbWV0aGluZyhjbGF1c2U6Q2xhdXNlKTphbnkgLy8gZ2V0IG93bmVyc2hpcCBjaGFpbiBhbmQgZG8gc29tZXRoaW5nIHdpdGggdGhlIGNsYXVzZSwgY2xhdXNlIGhhcyBldmVyeXRoaW5nLCBpdCBoYXMgaW5mbyBvbiBzaWRlLWVmZmVjdHMsIHByZWRpY2F0ZSBldGMuLi4/Pz9cblxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKG86IGFueSkge1xuICAgIHJldHVybiBuZXcgQ29uY3JldGVXcmFwcGVyKG8pXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi4vY29uY2VwdHMvV3JhcHBlclwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4vRW52aXJvXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VFbnZpcm8gaW1wbGVtZW50cyBFbnZpcm8ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZGljdGlvbmFyeTogeyBbaWQ6IElkXTogV3JhcHBlciB9ID0ge30pIHtcblxuICAgIH1cblxuICAgIGFzeW5jIGdldChpZDogSWQpOiBQcm9taXNlPFdyYXBwZXI+IHtcblxuICAgICAgICAvLyByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXSAvLyBUT0RPOiBjb3VsZCBiZSB1bmRlZmluZWQhXG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChvaywgZXJyKSA9PiB7XG5cbiAgICAgICAgICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGljdGlvbmFyeVtpZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbClcbiAgICAgICAgICAgICAgICAgICAgb2sodGhpcy5kaWN0aW9uYXJ5W2lkXSBhcyBXcmFwcGVyKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSwgMTAwKVxuICAgICAgICB9KVxuXG4gICAgfVxuXG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0OiBXcmFwcGVyKTogdm9pZCB7XG4gICAgICAgIC8vIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBvYmplY3RcblxuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuZGljdGlvbmFyeVtpZF1cblxuICAgICAgICBpZiAocGxhY2Vob2xkZXIgJiYgcGxhY2Vob2xkZXIgaW5zdGFuY2VvZiBQbGFjZWhvbGRlcikge1xuXG4gICAgICAgICAgICBwbGFjZWhvbGRlci5wcmVkaWNhdGVzLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LnNldChwKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IG9iamVjdFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBhc3luYyBxdWVyeShjbGF1c2U6IENsYXVzZSk6IFByb21pc2U8eyBbaWQ6IElkXTogSWQgfCB1bmRlZmluZWQgfT4ge1xuXG4gICAgICAgIC8vIGZvciBlYWNoIGVudGl0eSBpbiB0aGUgY2xhdXNlLCBnZXQgdGhlIGVudGl0aWVzIHRoYXQgbWF0Y2ggaXRzIGRlc2NyaXB0aW9uIGluIHRoZSBkaWN0aW9uYXJ5XG4gICAgICAgIC8vVE9ETyB0bXAgc29sdXRpb24sIGZvciBhbmFwaG9yYSByZXNvbHV0aW9uLCBidXQgd2l0aG91dCB0YWtpbmcgKG11bHRpLWVudGl0eSkgcmVsYXRpb25zaGlwcyBpbnRvIGFjY291bnRcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXModGhpcy5kaWN0aW9uYXJ5KVxuXG4gICAgICAgIGNvbnNvbGUubG9nKHsgdW5pdmVyc2UgfSlcblxuICAgICAgICBjb25zdCBxdWVyeSA9IGNsYXVzZVxuICAgICAgICAgICAgLmVudGl0aWVzXG4gICAgICAgICAgICAubWFwKGUgPT4gKHsgZSwgZDogY2xhdXNlLnRoZW1lLmRlc2NyaWJlKGUpIH0pKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKHsgcXVlcnkgfSlcblxuICAgICAgICBjb25zdCByZXMgPSBxdWVyeVxuICAgICAgICAgICAgLm1hcChxID0+ICh7IFtxLmVdOiB1bml2ZXJzZS5maW5kKHUgPT4gcS5kLmV2ZXJ5KHMgPT4gdVsxXT8uaXMocykpKT8uWzBdIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICBjb25zb2xlLmxvZyh7IHJlcyB9KVxuXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICBzZXRQbGFjZWhvbGRlcihpZDogSWQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IG5ldyBQbGFjZWhvbGRlcigpXG4gICAgfVxuXG4gICAgZXhpc3RzKGlkOiBJZCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXSAmJiAhKHRoaXMuZGljdGlvbmFyeVtpZF0gaW5zdGFuY2VvZiBQbGFjZWhvbGRlcilcbiAgICB9XG5cbn1cblxuY2xhc3MgUGxhY2Vob2xkZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHByZWRpY2F0ZXM6IHN0cmluZ1tdID0gW10pIHtcblxuICAgIH1cblxuICAgIHNldChwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogdm9pZCB7XG4gICAgICAgIHRoaXMucHJlZGljYXRlcy5wdXNoKHByZWRpY2F0ZSlcbiAgICB9XG5cbiAgICBpcyhwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZXMuaW5jbHVkZXMocHJlZGljYXRlKVxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4uL2NvbmNlcHRzL1dyYXBwZXJcIjtcbmltcG9ydCBCYXNlRW52aXJvIGZyb20gXCIuL0Jhc2VFbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm8ge1xuICAgIGdldChpZDogSWQpOiBQcm9taXNlPFdyYXBwZXI+XG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0OiBXcmFwcGVyKTogdm9pZFxuICAgIHNldFBsYWNlaG9sZGVyKGlkOklkKTp2b2lkXG4gICAgLy8gcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPiAvL1RPRE8hISEhISEhISEgICAgXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPHsgW2lkOiBJZF06IElkIHwgdW5kZWZpbmVkIH0+XG4gICAgZXhpc3RzKGlkOklkKTpib29sZWFuXG4gICAgLy8gZ2V0IGtleXMoKTogSWRbXVxuICAgIC8vIGdldCB2YWx1ZXMoKTogYW55W11cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RW52aXJvKCk6IEVudmlybyB7XG4gICAgcmV0dXJuIG5ldyBCYXNlRW52aXJvKClcbn0iLCJpbXBvcnQgbWFpbiBmcm9tIFwiLi9tYWluL21haW5cIjtcbmltcG9ydCB7IHRlc3RDb25jZXB0cyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3RDb25jZXB0c1wiO1xuaW1wb3J0IHsgd3JhcHBlclRlc3QgfSBmcm9tIFwiLi90ZXN0cy93cmFwcGVyVGVzdFwiO1xuXG4vLyB0ZXN0Q29uY2VwdHMoKVxuLy8gd3JhcHBlclRlc3QoKVxubWFpbigpIiwiaW1wb3J0IFRva2VuLCB7IGdldFRva2VuQ29ucyB9IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IHsgZ2V0TGV4ZW1lcyB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IExleGVyLCB7IEFzc2VydEFyZ3MsIENvbnN0cnVjdG9yIH0gZnJvbSBcIi4vTGV4ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSB0b2tlbnM6IFRva2VuW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcpIHtcblxuICAgICAgICB0aGlzLnRva2VucyA9IHNvdXJjZUNvZGVcbiAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgLm1hcChlID0+ICFlID8gJy4nIDogZSlcbiAgICAgICAgICAgIC5mbGF0TWFwKHN0cmluZyA9PiBnZXRMZXhlbWVzKHN0cmluZylcbiAgICAgICAgICAgICAgICAubWFwKGwgPT4gbmV3IChnZXRUb2tlbkNvbnMobC50eXBlKSkobC5uYW1lKSkpXG5cbiAgICAgICAgY29uc29sZS5kZWJ1ZygndG9rZW5zJywgdGhpcy50b2tlbnMpXG4gICAgICAgIHRoaXMuX3BvcyA9IDBcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBUb2tlbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBjdXJyZW50IHRva2VuIGlmZiBvZiBnaXZlbiB0eXBlIGFuZCBtb3ZlIHRvIG5leHQ7IFxuICAgICAqIGVsc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgZG9uJ3QgbW92ZS5cbiAgICAgKiBAcGFyYW0gYXJncyBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBhc3NlcnQ8VD4oY2xheno6IENvbnN0cnVjdG9yPFQ+LCBhcmdzOiBBc3NlcnRBcmdzKTogVCB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMucGVla1xuXG4gICAgICAgIGlmIChjdXJyZW50IGluc3RhbmNlb2YgY2xhenopIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MuZXJyb3JPdXQgPz8gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcm9hayhhcmdzLmVycm9yTXNnID8/ICcnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIlxuaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZSB7XG4gICAgLyoqdXN1YWxseSByb290IGZvcm0qLyByZWFkb25seSBuYW1lOiBzdHJpbmdcbiAgICAvKip0b2tlbiB0eXBlKi8gcmVhZG9ubHkgdHlwZTogVG9rZW5UeXBlXG4gICAgLyoqdXNlZnVsIGZvciBpcnJlZ3VsYXIgc3R1ZmYqLyByZWFkb25seSBmb3Jtcz86IHN0cmluZ1tdXG4gICAgLyoqcmVmZXJzIHRvIHZlcmIgY29uanVnYXRpb25zIG9yIHBsdXJhbCBmb3JtcyovIHJlYWRvbmx5IHJlZ3VsYXI/OiBib29sZWFuXG4gICAgLyoqc2VtYW50aWNhbCBkZXBlbmRlY2UqLyByZWFkb25seSBkZXJpdmVkRnJvbT86IHN0cmluZ1xuICAgIC8qKnNlbWFudGljYWwgZXF1aXZhbGVuY2UqLyByZWFkb25seSBhbGlhc0Zvcj86IHN0cmluZ1xuICAgIC8qKm1hZGUgdXAgb2YgbW9yZSBsZXhlbWVzKi8gcmVhZG9ubHkgY29udHJhY3Rpb25Gb3I/OiBzdHJpbmdbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybXNPZihsZXhlbWU6IExleGVtZSkge1xuXG4gICAgcmV0dXJuIFtsZXhlbWUubmFtZV0uY29uY2F0KGxleGVtZT8uZm9ybXMgPz8gW10pXG4gICAgICAgIC5jb25jYXQobGV4ZW1lLnJlZ3VsYXIgPyBbYCR7bGV4ZW1lLm5hbWV9c2BdIDogW10pXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVtZXMod29yZDogc3RyaW5nKTogTGV4ZW1lW10ge1xuXG4gICAgY29uc3QgbGV4ZW1lID0gbGV4ZW1lcy5maWx0ZXIoeCA9PiBmb3Jtc09mKHgpLmluY2x1ZGVzKHdvcmQpKVswXVxuICAgICAgICA/PyB7IG5hbWU6IHdvcmQsIHR5cGU6ICdhZGonIH1cblxuICAgIHJldHVybiBsZXhlbWUuY29udHJhY3Rpb25Gb3IgP1xuICAgICAgICBsZXhlbWUuY29udHJhY3Rpb25Gb3IuZmxhdE1hcCh4ID0+IGdldExleGVtZXMoeCkpIDpcbiAgICAgICAgW2xleGVtZV1cblxufSIsImltcG9ydCBUb2tlbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlcntcbiAgICBnZXQgcGVlaygpOlRva2VuXG4gICAgZ2V0IHBvcygpOm51bWJlclxuICAgIGdldCBpc0VuZCgpOmJvb2xlYW5cbiAgICBuZXh0KCk6dm9pZFxuICAgIGJhY2tUbyhwb3M6bnVtYmVyKTp2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6c3RyaW5nKTp2b2lkICAgXG4gICAgYXNzZXJ0IDxUPihjbGF6ejpDb25zdHJ1Y3RvcjxUPiwgYXJnczpBc3NlcnRBcmdzKTogVHx1bmRlZmluZWQgXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXJ0QXJnc3tcbiAgICBlcnJvck1zZz86c3RyaW5nXG4gICAgZXJyb3JPdXQ/OmJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6c3RyaW5nKTpMZXhlcntcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSlcbn1cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcblxuXG5leHBvcnQgY29uc3QgbGV4ZW1lczogTGV4ZW1lW10gPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnaGF2ZScsXG4gICAgICAgIHR5cGU6ICdtdmVyYicsXG4gICAgICAgIGZvcm1zOiBbJ2hhdmUnLCAnaGFzJ10sXG4gICAgICAgIHJlZ3VsYXI6IGZhbHNlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2J1dHRvbicsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgcmVndWxhciA6IHRydWVcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnY2xpY2snLFxuICAgICAgICB0eXBlOiAnbXZlcmInLFxuICAgICAgICBmb3JtczogWydjbGljayddLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2NsaWNrZWQnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgZGVyaXZlZEZyb206ICdjbGljaydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAncHJlc3NlZCcsXG4gICAgICAgIHR5cGU6ICdhZGonLFxuICAgICAgICBhbGlhc0ZvcjogJ2NsaWNrZWQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2NhdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdiZScsXG4gICAgICAgIHR5cGU6ICdjb3B1bGEnLFxuICAgICAgICBmb3JtczogWydpcycsICdhcmUnXSxcbiAgICAgICAgcmVndWxhcjogZmFsc2VcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiBcImlzbid0XCIsXG4gICAgICAgIHR5cGU6ICdjb250cmFjdGlvbicsXG4gICAgICAgIGNvbnRyYWN0aW9uRm9yOiBbJ2lzJywgJ25vdCddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogXCJyZWRcIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6IFwiZ3JlZW5cIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6IFwiZXhpc3RcIixcbiAgICAgICAgdHlwZTogXCJpdmVyYlwiLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2RvJyxcbiAgICAgICAgdHlwZTogJ2h2ZXJiJyxcbiAgICAgICAgcmVndWxhcjogZmFsc2UsXG4gICAgICAgIGZvcm1zOiBbJ2RvJywgJ2RvZXMnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdzb21lJyxcbiAgICAgICAgdHlwZTogJ2V4aXN0cXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2V2ZXJ5JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhbGwnLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2FueScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAndG8nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3dpdGgnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2Zyb20nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ29mJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdvdmVyJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdvbicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYXQnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3RoZW4nLFxuICAgICAgICB0eXBlOiAndGhlbicgLy8gZmlsbGVyIHdvcmRcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnaWYnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnd2hlbicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdiZWNhdXNlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3doaWxlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3RoYXQnLFxuICAgICAgICB0eXBlOiAncmVscHJvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnbm90JyxcbiAgICAgICAgdHlwZTogJ25lZ2F0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICd0aGUnLFxuICAgICAgICB0eXBlOiAnZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhbicsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYW5kJyxcbiAgICAgICAgdHlwZTogJ25vbnN1YmNvbmonXG4gICAgfVxuXSIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2JyYWluL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBicmFpbjogYXdhaXQgZ2V0QnJhaW4oeyB3aXRoQWN0dWF0b3I6IHRydWUgfSksXG4gICAgICAgIHByb21wdFZpc2libGU6IGZhbHNlXG4gICAgfTtcblxuICAgICh3aW5kb3cgYXMgYW55KS5icmFpbiA9IHN0YXRlLmJyYWluXG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIHRleHRhcmVhLmhpZGRlbiA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPyB0ZXh0YXJlYS5mb2N1cygpIDogMFxuICAgIH1cblxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzUwdncnXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzFlbSdcbiAgICB0ZXh0YXJlYS5oaWRkZW4gPSB0cnVlXG4gICAgdGV4dGFyZWEuc3R5bGUucG9zaXRpb24gPSAnc3RpY2t5J1xuICAgIHRleHRhcmVhLnN0eWxlLnRvcCA9ICcwJ1xuICAgIHRleHRhcmVhLnN0eWxlLnpJbmRleCA9ICcxMDAwJ1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGV4dGFyZWEpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcblxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgZSA9PiB7XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN0YXRlLmJyYWluLmV4ZWN1dGUodGV4dGFyZWEudmFsdWUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoKVxuICAgIH0pXG5cbn0iLCJpbXBvcnQgQXN0IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Bc3RcIjtcbmltcG9ydCBCaW5hcnlRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQmluYXJ5UXVlc3Rpb25cIjtcbmltcG9ydCBDb21wb3VuZFNlbnRlbmNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Db21wb3VuZFNlbnRlbmNlXCI7XG5pbXBvcnQgRGVjbGFyYXRpb24gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0RlY2xhcmF0aW9uXCI7XG5pbXBvcnQgUXVlc3Rpb24gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1F1ZXN0aW9uXCI7XG5pbXBvcnQgU2ltcGxlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1NpbXBsZVNlbnRlbmNlXCI7XG5pbXBvcnQgVmVyYlNlbnRlbmNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Db21wbGVtZW50XCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vYXN0L3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IFN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IENvbXBsZXhTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db21wbGV4U2VudGVuY2VcIjtcbmltcG9ydCBDb25qdW5jdGl2ZVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0Nvbmp1bmN0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBDb3B1bGFRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db3B1bGFRdWVzdGlvblwiO1xuaW1wb3J0IENvcHVsYVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvcHVsYVNlbnRlbmNlXCI7XG5pbXBvcnQgSW50cmFuc2l0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvSW50cmFuc2l0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL01vbm90cmFuc2l0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBBZGplY3RpdmUgZnJvbSBcIi4uL2FzdC90b2tlbnMvQWRqZWN0aXZlXCI7XG5pbXBvcnQgQXJ0aWNsZSBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi9hc3QvdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IElWZXJiIGZyb20gXCIuLi9hc3QvdG9rZW5zL0lWZXJiXCI7XG5pbXBvcnQgTVZlcmIgZnJvbSBcIi4uL2FzdC90b2tlbnMvTVZlcmJcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9OZWdhdGlvblwiO1xuaW1wb3J0IE5vdW4gZnJvbSBcIi4uL2FzdC90b2tlbnMvTm91blwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL1ByZXBvc2l0aW9uXCI7XG5pbXBvcnQgUXVhbnRpZmllciBmcm9tIFwiLi4vYXN0L3Rva2Vucy9RdWFudGlmaWVyXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuaW1wb3J0IFRoZW4gZnJvbSBcIi4uL2FzdC90b2tlbnMvVGhlblwiO1xuaW1wb3J0IExleGVyLCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCI7XG5pbXBvcnQgUGFyc2VyIGZyb20gXCIuL1BhcnNlclwiO1xuaW1wb3J0IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Db3B1bGFTdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vYXN0L3Rva2Vucy9SZWxhdGl2ZVByb25vdW5cIjtcbmltcG9ydCBDb25zdGl0dWVudCBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCBGdWxsU3RvcCBmcm9tIFwiLi4vYXN0L3Rva2Vucy9GdWxsU3RvcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY1BhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBwcm90ZWN0ZWQgbHg6IExleGVyXG5cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VDb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5seCA9IGdldExleGVyKHNvdXJjZUNvZGUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRyeTxUIGV4dGVuZHMgQXN0PihtZXRob2Q6ICgpID0+IFQpIHtcblxuICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5seC5wb3NcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZCgpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmRlYnVnKChlcnJvciBhcyBFcnJvcikubWVzc2FnZSlcbiAgICAgICAgICAgIHRoaXMubHguYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBlcnJvck91dChlcnJvck1zZzogc3RyaW5nKTogQ29uc3RpdHVlbnQge1xuICAgICAgICB0aGlzLmx4LmNyb2FrKGVycm9yTXNnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNc2cpXG4gICAgfVxuXG4gICAgcGFyc2VBbGwoKTogQ29uc3RpdHVlbnRbXSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogQ29uc3RpdHVlbnRbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmx4LmlzRW5kKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5wYXJzZSgpKVxuICAgICAgICAgICAgdGhpcy5seC5hc3NlcnQoRnVsbFN0b3AsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuICAgIHBhcnNlKCk6IENvbnN0aXR1ZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VEZWNsYXJhdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VOb3VuUGhyYXNlKSAvLyBmb3IgcXVpY2sgdG9waWMgcmVmZXJlbmNlXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VEZWNsYXJhdGlvbiA9ICgpOiBEZWNsYXJhdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29tcG91bmQpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlU2ltcGxlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VEZWNsYXJhdGlvbigpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VRdWVzdGlvbiA9ICgpOiBRdWVzdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQmluYXJ5UXVlc3Rpb24pXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVF1ZXN0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVNpbXBsZSA9ICgpOiBTaW1wbGVTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlVmVyYlNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VTaW1wbGUoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG91bmQgPSAoKTogQ29tcG91bmRTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29tcGxleClcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VDb25qdW5jdGl2ZSlcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlQ29tcG91bmQoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlVmVyYlNlbnRlbmNlID0gKCk6IFZlcmJTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlVmVyYlNlbnRlbmNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVNlbnRlbmNlID0gKCk6IENvcHVsYVNlbnRlbmNlID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7IGVycm9yTXNnOiAncGFyc2VDb3B1bGFTZW50ZW5jZSgpLCBleHBlY3RlZCBjb3B1bGEnIH0pXG4gICAgICAgIGNvbnN0IG5lZ2F0aW9uID0gdGhpcy5seC5hc3NlcnQoTmVnYXRpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFTZW50ZW5jZShzdWJqZWN0LCBjb3B1bGEgYXMgQ29wdWxhLCBwcmVkaWNhdGUsIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBsZXggPSAoKTogQ29tcGxleFNlbnRlbmNlID0+IHtcblxuICAgICAgICBjb25zdCBzdWJjb25qID0gdGhpcy5seC5hc3NlcnQoU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuXG4gICAgICAgIGlmIChzdWJjb25qKSB7XG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHRoaXMubHguYXNzZXJ0KFRoZW4sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgICAgICBjb25zdCBvdXRjb21lID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbXBsZXhTZW50ZW5jZShjb25kaXRpb24sIG91dGNvbWUsIHN1YmNvbmopXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBvdXRjb21lID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICBjb25zdCBzdWJjb25qID0gdGhpcy5seC5hc3NlcnQoU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLCB7IGVycm9yT3V0OiB0cnVlLCBlcnJvck1zZzogJ2V4cGVjdGVkIHN1Ym9yZGluYXRpbmcgY29uanVuY3Rpb24nIH0pXG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29tcGxleFNlbnRlbmNlKGNvbmRpdGlvbiwgb3V0Y29tZSwgc3ViY29uaiBhcyBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUludHJhbnNpdGl2ZVNlbnRlbmNlID0gKCk6IEludHJhbnNpdGl2ZVNlbnRlbmNlID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgbmVnYXRpb24gPSB0aGlzLmx4LmFzc2VydChOZWdhdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgaXZlcmIgPSB0aGlzLmx4LmFzc2VydChJVmVyYiwgeyBlcnJvck1zZzogJ3BhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UoKSwgZXhwZWN0ZWQgaS12ZXJiJyB9KVxuICAgICAgICBjb25zdCBjb21wbGVtZW50cyA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG4gICAgICAgIHJldHVybiBuZXcgSW50cmFuc2l0aXZlU2VudGVuY2Uoc3ViamVjdCwgaXZlcmIgYXMgSVZlcmIsIGNvbXBsZW1lbnRzLCBuZWdhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlID0gKCk6IE1vbm90cmFuc2l0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBuZWdhdGlvbiA9IHRoaXMubHguYXNzZXJ0KE5lZ2F0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBtdmVyYiA9IHRoaXMubHguYXNzZXJ0KE1WZXJiLCB7IGVycm9yTXNnOiAncGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlKCksIGV4cGVjdGVkIGktdmVyYicgfSlcbiAgICAgICAgY29uc3QgY3MxID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBjczIgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKVxuICAgICAgICByZXR1cm4gbmV3IE1vbm90cmFuc2l0aXZlU2VudGVuY2Uoc3ViamVjdCwgbXZlcmIgYXMgTVZlcmIsIG9iamVjdCwgY3MxLmNvbmNhdChjczIpLCBuZWdhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VCaW5hcnlRdWVzdGlvbiA9ICgpOiBCaW5hcnlRdWVzdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhUXVlc3Rpb24pXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZUJpbmFyeVF1ZXN0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVF1ZXN0aW9uID0gKCk6IENvcHVsYVF1ZXN0aW9uID0+IHtcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7IGVycm9yTXNnOiAncGFyc2VDb3B1bGFRdWVzdGlvbigpLCBleHBlY3RlZCBjb3B1bGEnIH0pXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFRdWVzdGlvbihzdWJqZWN0LCBwcmVkaWNhdGUsIGNvcHVsYSBhcyBDb3B1bGEpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTm91blBocmFzZSA9ICgpOiBOb3VuUGhyYXNlID0+IHtcbiAgICAgICAgY29uc3QgcXVhbnRpZmllciA9IHRoaXMubHguYXNzZXJ0KFF1YW50aWZpZXIsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IGFydGljbGUgPSB0aGlzLmx4LmFzc2VydChBcnRpY2xlLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuXG4gICAgICAgIGxldCBhZGplY3RpdmVzID0gW11cbiAgICAgICAgbGV0IGFkalxuXG4gICAgICAgIHdoaWxlIChhZGogPSB0aGlzLmx4LmFzc2VydChBZGplY3RpdmUsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pKSB7XG4gICAgICAgICAgICBhZGplY3RpdmVzLnB1c2goYWRqKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgbm91biA9IHRoaXMubHguYXNzZXJ0KE5vdW4sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IHN1Ym9yZGluYXRlQ2xhdXNlID0gdGhpcy50cnkodGhpcy5wYXJzZVN1Ym9yZGluYXRlQ2xhdXNlKVxuICAgICAgICBjb25zdCBjb21wbGVtZW50cyA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG5cbiAgICAgICAgcmV0dXJuIG5ldyBOb3VuUGhyYXNlKGFkamVjdGl2ZXMsIGNvbXBsZW1lbnRzLCBub3VuLCBxdWFudGlmaWVyLCBhcnRpY2xlLCBzdWJvcmRpbmF0ZUNsYXVzZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wbGVtZW50cyA9ICgpOiBDb21wbGVtZW50W10gPT4ge1xuXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gW11cbiAgICAgICAgbGV0IGNvbXBcblxuICAgICAgICB3aGlsZSAoY29tcCA9IHRoaXMudHJ5KHRoaXMucGFyc2VDb21wbGVtZW50KSkge1xuICAgICAgICAgICAgY29tcGxlbWVudHMucHVzaChjb21wKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbXBsZW1lbnRzXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcGxlbWVudCA9ICgpOiBDb21wbGVtZW50ID0+IHtcbiAgICAgICAgY29uc3QgcHJlcG9zaXRpb24gPSB0aGlzLmx4LmFzc2VydChQcmVwb3NpdGlvbiwgeyBlcnJvck1zZzogJ3BhcnNlQ29tcGxlbWVudCgpIGV4cGVjdGVkIHByZXBvc2l0aW9uJyB9KVxuICAgICAgICBjb25zdCBub3VuUGhyYXNlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvbXBsZW1lbnQocHJlcG9zaXRpb24gYXMgUHJlcG9zaXRpb24sIG5vdW5QaHJhc2UpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlU3Vib3JkaW5hdGVDbGF1c2UgPSAoKTogU3Vib3JkaW5hdGVDbGF1c2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VTdWJvcmRpbmF0ZUNsYXVzZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSA9ICgpOiBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbHByb24gPSB0aGlzLmx4LmFzc2VydChSZWxhdGl2ZVByb25vdW4sIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKCkgZXhwZWN0ZWQgcmVsYXRpdmUgcHJvbm91bicgfSlcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7IGVycm9yTXNnOiAncGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSgpIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZShyZWxwcm9uIGFzIFJlbGF0aXZlUHJvbm91biwgc3ViamVjdCwgY29wdWxhIGFzIENvcHVsYSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb25qdW5jdGl2ZSA9ICgpOiBDb25qdW5jdGl2ZVNlbnRlbmNlID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOT1QgSU1QTEVNRU5URUQhIFRPRE8hJylcbiAgICB9XG5cbn0iLCJpbXBvcnQgQ29uc3RpdHVlbnQgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgQmFzaWNQYXJzZXIgZnJvbSBcIi4vQmFzaWNQYXJzZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFBhcnNlcntcbiAgICBwYXJzZSgpOkNvbnN0aXR1ZW50ICAgXG4gICAgcGFyc2VBbGwoKTpDb25zdGl0dWVudFtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTpzdHJpbmcpOlBhcnNlcntcbiAgICByZXR1cm4gbmV3IEJhc2ljUGFyc2VyKHNvdXJjZUNvZGUpXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==