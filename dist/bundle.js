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
exports.takeAction = void 0;
const Id_1 = __webpack_require__(/*! ../clauses/Id */ "./app/src/clauses/Id.ts");
const Create_1 = __importDefault(__webpack_require__(/*! ./Create */ "./app/src/action/Create.ts"));
const Edit_1 = __importDefault(__webpack_require__(/*! ./Edit */ "./app/src/action/Edit.ts"));
function takeAction(clause, enviro) {
    return __awaiter(this, void 0, void 0, function* () {
        const ownershipChain = getOwnershipChain(clause);
        //1 get the top-level object's ID from an Enviro, if none create it
        let id = (yield enviro.query(clause))[ownershipChain[0]];
        if (!id) {
            enviro.setPlaceholder(id = (0, Id_1.getRandomId)());
        }
        const props = ownershipChain.slice(1).map(e => clause.theme.describe(e)[0]).filter(x => x !== undefined); // inner props of top level entity
        //2 determine kind of action (creator or non-creator)
        //3 distribute the id to every action (one action per predicate)
        const actions = clause
            .flatList()
            .map(c => c)
            .map(c => isCreatorAction(c.predicate) ? new Create_1.default(id, c.predicate) : new Edit_1.default(id, c.predicate, props));
        //4 creator actions create the object if it doesn't exist yet
        //5 non-creator actions WAIT if the object doesn't exist yet.
        actions.forEach(a => {
            a.run(enviro);
        });
    });
}
exports.takeAction = takeAction;
function getOwnershipChain(clause) {
    const topLevel = clause.entities
        .map(x => ({ x, owners: clause.ownersOf(x) }))
        .filter(x => x.owners.length === 0)
        .map(x => x.x);
    const secondLevelEntities = clause.ownedBy(topLevel[0]);
    const thridLevelEntities = clause.ownedBy(secondLevelEntities[0]);
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
    constructor(id, predicate, props) {
        this.id = id;
        this.predicate = predicate;
        this.props = props;
    }
    run(enviro) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield enviro.get(this.id);
            obj.set(this.predicate, this.props);
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
                if (clause.isSideEffecty) {
                    (0, Action_1.takeAction)(clause, this.enviro);
                }
                else {
                    // TODO: highlight ("point out") element(s)
                }
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
function getBrain() {
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getConcepts_1 = __webpack_require__(/*! ./getConcepts */ "./app/src/concepts/getConcepts.ts");
class ConcreteWrapper {
    constructor(o, simpleConcepts = {}) {
        this.o = o;
        this.simpleConcepts = simpleConcepts;
        this.setAlias('color', ['style', 'background']);
        this.setAlias('width', ['style', 'width']);
        //TODO do this only once and only for HTMLElement's prototype
        //TODO put it ON the prototype object so it can be retrieved as "this.o.simpleConcepts" from any instance of the prototype
    }
    set(predicate, props) {
        this.o[predicate] = true; // TODO: remove
        if (props && props.length > 1) { // set the pedicate on the path
            this.setNested(props, predicate);
            return;
        }
        //1 if len(props) == 1 use it as a concept
        if (props && props.length === 1) {
            if (Object.keys(this.simpleConcepts).includes(props[0])) { // is concept
                this.setNested(this.simpleConcepts[props[0]], predicate);
            }
            else {
                this.setNested(props, predicate);
            }
            return;
        }
        //2 if len(props) == 0 get the concept from the predicate (eg: red is a 'color')
        const concepts = (0, getConcepts_1.getConcepts)(predicate);
        if (concepts.length === 0) {
            return;
        }
        this.setNested(this.simpleConcepts[concepts[0]], predicate);
    }
    is(predicate, ...args) {
        return this.o[predicate] !== undefined; // TODO: remove
    }
    setAlias(conceptName, propPath) {
        this.simpleConcepts[conceptName] = propPath;
    }
    setNested(path, value) {
        let x = this.o[path[0]];
        path.slice(1, -2).forEach(p => {
            x = this.o[p];
        });
        x[path[path.length - 1]] = value;
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

/***/ "./app/src/concepts/getConcepts.ts":
/*!*****************************************!*\
  !*** ./app/src/concepts/getConcepts.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConceptName = exports.getGetterName = exports.getIsName = exports.getSetterName = exports.getConcepts = exports.getterPrefix = exports.isPrefix = exports.setterPrefix = void 0;
exports.setterPrefix = 'set';
exports.isPrefix = 'is';
exports.getterPrefix = 'get';
function getConcepts(object) {
    // TODO: try getting a concept from a string object with a 
    // special dictionary, like {red:color, green:color, blue:color}
    const stringConcepts = {
        'green': 'color',
        'red': 'color',
        'blue': 'color',
        'black': 'color',
        'big': 'size'
    };
    const maybeConcept = stringConcepts[object.toString()];
    if (maybeConcept) {
        return [maybeConcept];
    }
    return Object
        .getOwnPropertyNames(object)
        .concat(Object.getOwnPropertyNames(object.__proto__))
        .filter(x => x.includes(exports.setterPrefix) || x.includes(exports.isPrefix))
        .map(x => getConceptName(x));
}
exports.getConcepts = getConcepts;
function getSetterName(concept) {
    return `${exports.setterPrefix}_${concept}`;
}
exports.getSetterName = getSetterName;
function getIsName(concept) {
    return `${exports.isPrefix}_${concept}`;
}
exports.getIsName = getIsName;
function getGetterName(concept) {
    return `${exports.getterPrefix}_${concept}`;
}
exports.getGetterName = getGetterName;
function getConceptName(method) {
    return method
        .replace(exports.isPrefix, '')
        .replace(exports.setterPrefix, '')
        .replace(exports.getterPrefix, '')
        .replace('_', '');
}
exports.getConceptName = getConceptName;


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
            const query = clause
                .entities
                .map(e => ({ e, d: clause.theme.describe(e) }));
            const res = query
                .map(q => { var _a; return ({ [q.e]: (_a = universe.find(u => q.d.every(s => { var _a; return (_a = u[1]) === null || _a === void 0 ? void 0 : _a.is(s); }))) === null || _a === void 0 ? void 0 : _a[0] }); })
                .reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
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
    set(predicate, props) {
        console.log({ props });
        this.predicates.push(predicate);
    }
    is(predicate, ...args) {
        return this.predicates.includes(predicate);
    }
    setAlias(conceptName, propOrSynonConcept) {
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
            brain: yield (0, Brain_1.getBrain)(),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVELFFBQVE7UUFFSixNQUFNLE9BQU8sR0FBa0IsRUFBRTtRQUVqQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUU7WUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsa0JBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUNoRDtRQUVELE9BQU8sT0FBTztJQUNsQixDQUFDO0lBRUQsS0FBSzs7UUFDRCxPQUFPLHNCQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsbUNBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1DQUMvQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyw0QkFBNEI7MkNBQzNELElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO0lBQ25DLENBQUM7Q0EySUo7QUF0TEQsaUNBc0xDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZORCxtSEFBd0M7QUFPeEMsU0FBZ0IsU0FBUyxDQUFDLFVBQWlCO0lBQ3ZDLE9BQU8sSUFBSSxxQkFBVyxDQUFDLFVBQVUsQ0FBQztBQUN0QyxDQUFDO0FBRkQsOEJBRUM7Ozs7Ozs7VUNWRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hY3Rpb24vQWN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYWN0aW9uL0NyZWF0ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FjdGlvbi9FZGl0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L2ludGVyZmFjZXMvVG9rZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Db21wbGVtZW50LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3BocmFzZXMvQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Ob3VuUGhyYXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Db21wbGV4U2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvcHVsYVF1ZXN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Db3B1bGFTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvSW50cmFuc2l0aXZlU2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL01vbm90cmFuc2l0aXZlU2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0Fic3RyYWN0VG9rZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0FkamVjdGl2ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQXJ0aWNsZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQ29wdWxhLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9GdWxsU3RvcC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvSFZlcmIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0lWZXJiLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9NVmVyYi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTmVnYXRpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL05vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTm91bi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUHJlcG9zaXRpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1F1YW50aWZpZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1JlbGF0aXZlUHJvbm91bi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9UaGVuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2JyYWluL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0Jhc2ljQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9JbXBseS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NvbmNlcHRzL0NvbmNyZXRlV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NvbmNlcHRzL1dyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jb25jZXB0cy9nZXRDb25jZXB0cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2Vudmlyby9CYXNlRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvZW52aXJvL0Vudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvbGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9CYXNpY1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0Jhc2ljQ2xhdXNlXCJcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBnZXRSYW5kb21JZCwgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiXG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiXG5pbXBvcnQgQ3JlYXRlIGZyb20gXCIuL0NyZWF0ZVwiXG5pbXBvcnQgRWRpdCBmcm9tIFwiLi9FZGl0XCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIEFjdGlvbiB7XG4gICAgcnVuKGVudmlybzogRW52aXJvKTogUHJvbWlzZTxhbnk+XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBlbnZpcm86IEVudmlybykge1xuXG4gICAgY29uc3Qgb3duZXJzaGlwQ2hhaW4gPSBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UpXG5cbiAgICAvLzEgZ2V0IHRoZSB0b3AtbGV2ZWwgb2JqZWN0J3MgSUQgZnJvbSBhbiBFbnZpcm8sIGlmIG5vbmUgY3JlYXRlIGl0XG4gICAgbGV0IGlkID0gKGF3YWl0IGVudmlyby5xdWVyeShjbGF1c2UpKVtvd25lcnNoaXBDaGFpblswXV1cblxuICAgIGlmICghaWQpIHtcbiAgICAgICAgZW52aXJvLnNldFBsYWNlaG9sZGVyKGlkID0gZ2V0UmFuZG9tSWQoKSlcbiAgICB9XG5cbiAgICBjb25zdCBwcm9wcyA9IG93bmVyc2hpcENoYWluLnNsaWNlKDEpLm1hcChlPT5jbGF1c2UudGhlbWUuZGVzY3JpYmUoZSlbMF0pLmZpbHRlcih4PT54IT09dW5kZWZpbmVkKSAvLyBpbm5lciBwcm9wcyBvZiB0b3AgbGV2ZWwgZW50aXR5XG5cbiAgICAvLzIgZGV0ZXJtaW5lIGtpbmQgb2YgYWN0aW9uIChjcmVhdG9yIG9yIG5vbi1jcmVhdG9yKVxuICAgIC8vMyBkaXN0cmlidXRlIHRoZSBpZCB0byBldmVyeSBhY3Rpb24gKG9uZSBhY3Rpb24gcGVyIHByZWRpY2F0ZSlcblxuICAgIGNvbnN0IGFjdGlvbnMgPSBjbGF1c2VcbiAgICAgICAgLmZsYXRMaXN0KClcbiAgICAgICAgLm1hcChjID0+IChjIGFzIEJhc2ljQ2xhdXNlKSlcbiAgICAgICAgLm1hcChjID0+IGlzQ3JlYXRvckFjdGlvbihjLnByZWRpY2F0ZSkgPyBuZXcgQ3JlYXRlKGlkIGFzIElkLCBjLnByZWRpY2F0ZSkgOiBuZXcgRWRpdChpZCBhcyBJZCwgYy5wcmVkaWNhdGUsIHByb3BzKSlcblxuICAgIC8vNCBjcmVhdG9yIGFjdGlvbnMgY3JlYXRlIHRoZSBvYmplY3QgaWYgaXQgZG9lc24ndCBleGlzdCB5ZXRcbiAgICAvLzUgbm9uLWNyZWF0b3IgYWN0aW9ucyBXQUlUIGlmIHRoZSBvYmplY3QgZG9lc24ndCBleGlzdCB5ZXQuXG5cbiAgICBhY3Rpb25zLmZvckVhY2goYSA9PiB7XG4gICAgICAgIGEucnVuKGVudmlybylcbiAgICB9KVxuXG59XG5cbmZ1bmN0aW9uIGdldE93bmVyc2hpcENoYWluKGNsYXVzZTogQ2xhdXNlKSB7IC8vVE9ETzogZ2VuZXJhbGl6ZVxuXG4gICAgY29uc3QgdG9wTGV2ZWwgPSBjbGF1c2UuZW50aXRpZXNcbiAgICAgICAgLm1hcCh4ID0+ICh7IHgsIG93bmVyczogY2xhdXNlLm93bmVyc09mKHgpIH0pKVxuICAgICAgICAuZmlsdGVyKHggPT4geC5vd25lcnMubGVuZ3RoID09PSAwKVxuICAgICAgICAubWFwKHggPT4geC54KVxuXG4gICAgY29uc3Qgc2Vjb25kTGV2ZWxFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KHRvcExldmVsWzBdKVxuICAgIGNvbnN0IHRocmlkTGV2ZWxFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KHNlY29uZExldmVsRW50aXRpZXNbMF0pXG5cbiAgICByZXR1cm4gW3RvcExldmVsWzBdLCBzZWNvbmRMZXZlbEVudGl0aWVzWzBdLCB0aHJpZExldmVsRW50aXRpZXNbMF1dXG59XG5cbmZ1bmN0aW9uIGlzQ3JlYXRvckFjdGlvbihwcmVkaWNhdGU6IHN0cmluZykge1xuICAgIHJldHVybiBwcmVkaWNhdGUgPT09ICdidXR0b24nXG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgd3JhcCB9IGZyb20gXCIuLi9jb25jZXB0cy9XcmFwcGVyXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGlkOiBJZCwgcmVhZG9ubHkgcHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBydW4oZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPGFueT4ge1xuXG4gICAgICAgIGlmKGVudmlyby5leGlzdHModGhpcy5pZCkpeyAvLyAgZXhpc3RlbmNlIGNoZWNrIHByaW9yIHRvIGNyZWF0aW5nXG4gICAgICAgICAgICByZXR1cm4gXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNEb21FbGVtKHRoaXMucHJlZGljYXRlKSkge1xuXG4gICAgICAgICAgICBjb25zdCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnByZWRpY2F0ZSlcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobylcbiAgICAgICAgICAgIG8uaWQgPSB0aGlzLmlkICsgJydcbiAgICAgICAgICAgIG8udGV4dENvbnRlbnQgPSAnZGVmYXVsdCdcbiAgICAgICAgICAgIGNvbnN0IG5ld09iaiA9IHdyYXAobylcbiAgICAgICAgICAgIG5ld09iai5zZXQodGhpcy5wcmVkaWNhdGUpXG4gICAgICAgICAgICBlbnZpcm8uc2V0KHRoaXMuaWQsIG5ld09iailcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gaXNEb21FbGVtKHByZWRpY2F0ZTogc3RyaW5nKSB7XG5cbiAgICByZXR1cm4gWydidXR0b24nXS5pbmNsdWRlcyhwcmVkaWNhdGUpXG5cbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdCBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBpZDogSWQsIHJlYWRvbmx5IHByZWRpY2F0ZTogc3RyaW5nLCByZWFkb25seSBwcm9wcz86IHN0cmluZ1tdKSB7XG4gICAgICAgIFxuICAgIH1cblxuICAgIGFzeW5jIHJ1bihlbnZpcm86IEVudmlybyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGF3YWl0IGVudmlyby5nZXQodGhpcy5pZClcbiAgICAgICAgb2JqLnNldCh0aGlzLnByZWRpY2F0ZSwgdGhpcy5wcm9wcylcbiAgICB9XG5cblxufSIsImltcG9ydCB7IENvbnN0cnVjdG9yIH0gZnJvbSBcIi4uLy4uL2xleGVyL0xleGVyXCI7XG5pbXBvcnQgQWRqZWN0aXZlIGZyb20gXCIuLi90b2tlbnMvQWRqZWN0aXZlXCI7XG5pbXBvcnQgQXJ0aWNsZSBmcm9tIFwiLi4vdG9rZW5zL0FydGljbGVcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBGdWxsU3RvcCBmcm9tIFwiLi4vdG9rZW5zL0Z1bGxTdG9wXCI7XG5pbXBvcnQgSFZlcmIgZnJvbSBcIi4uL3Rva2Vucy9IVmVyYlwiO1xuaW1wb3J0IElWZXJiIGZyb20gXCIuLi90b2tlbnMvSVZlcmJcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vdG9rZW5zL01WZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuaW1wb3J0IE5vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tIFwiLi4vdG9rZW5zL05vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuaW1wb3J0IE5vdW4gZnJvbSBcIi4uL3Rva2Vucy9Ob3VuXCI7XG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSBcIi4uL3Rva2Vucy9QcmVwb3NpdGlvblwiO1xuaW1wb3J0IFF1YW50aWZpZXIgZnJvbSBcIi4uL3Rva2Vucy9RdWFudGlmaWVyXCI7XG5pbXBvcnQgUmVsYXRpdmVQcm9ub3VuIGZyb20gXCIuLi90b2tlbnMvUmVsYXRpdmVQcm9ub3VuXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gXCIuLi90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uXCI7XG5pbXBvcnQgVGhlbiBmcm9tIFwiLi4vdG9rZW5zL1RoZW5cIjtcbmltcG9ydCBBc3QgZnJvbSBcIi4vQXN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBUb2tlbiBleHRlbmRzIEFzdCB7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2VuQ29ucyh0eXBlOiBUb2tlblR5cGUpOiBDb25zdHJ1Y3RvcjxUb2tlbj4ge1xuICAgIHJldHVybiBjb25zdHJ1Y3RvcnNbdHlwZV1cbn1cblxuZXhwb3J0IHR5cGUgVG9rZW5UeXBlID1cbiAgICAnbm91bidcbiAgICB8ICdpdmVyYidcbiAgICB8ICdtdmVyYidcbiAgICB8ICdodmVyYidcbiAgICB8ICdjb3B1bGEnXG4gICAgfCAndGhlbidcbiAgICB8ICdhZGonXG4gICAgfCAnZXhpc3RxdWFudCdcbiAgICB8ICd1bmlxdWFudCdcbiAgICB8ICdwcmVwb3NpdGlvbidcbiAgICB8ICdzdWJjb25qJ1xuICAgIHwgJ3JlbHByb24nXG4gICAgfCAnZGVmYXJ0J1xuICAgIHwgJ2luZGVmYXJ0J1xuICAgIHwgJ2Z1bGxzdG9wJ1xuICAgIHwgJ25vbnN1YmNvbmonXG4gICAgfCAnbmVnYXRpb24nXG4gICAgfCAnY29udHJhY3Rpb24nXG5cbmNvbnN0IGNvbnN0cnVjdG9yczogeyBbeCBpbiBUb2tlblR5cGVdOiBDb25zdHJ1Y3RvcjxUb2tlbj4gfSA9IHtcbiAgICAnbm91bic6IE5vdW4sXG4gICAgJ2l2ZXJiJzogSVZlcmIsXG4gICAgJ212ZXJiJzogTVZlcmIsXG4gICAgJ2h2ZXJiJzogSFZlcmIsXG4gICAgJ2NvcHVsYSc6IENvcHVsYSxcbiAgICAndGhlbic6IFRoZW4sXG4gICAgJ2Fkaic6IEFkamVjdGl2ZSxcbiAgICAnZXhpc3RxdWFudCc6IFF1YW50aWZpZXIsXG4gICAgJ3VuaXF1YW50JzogUXVhbnRpZmllcixcbiAgICAncHJlcG9zaXRpb24nOiBQcmVwb3NpdGlvbixcbiAgICAnc3ViY29uaic6IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbixcbiAgICAncmVscHJvbic6IFJlbGF0aXZlUHJvbm91bixcbiAgICAnZGVmYXJ0JzogQXJ0aWNsZSxcbiAgICAnaW5kZWZhcnQnOiBBcnRpY2xlLFxuICAgICdmdWxsc3RvcCc6IEZ1bGxTdG9wLFxuICAgICdub25zdWJjb25qJzogTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLFxuICAgICduZWdhdGlvbic6IE5lZ2F0aW9uLFxuICAgICdjb250cmFjdGlvbic6IE5lZ2F0aW9uIC8vVE9ETzogZml4IHRoaXMgY3JhcCAgXG59IiwiaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkLCBJZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuL05vdW5QaHJhc2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGxlbWVudCBpbXBsZW1lbnRzIFBocmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVwb3NpdGlvbjogUHJlcG9zaXRpb24sIHJlYWRvbmx5IG5vdW5QaHJhc2U6IE5vdW5QaHJhc2UpIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4geyAvLyBwcmVwb3NpdGlvbihhcmdzLnN1YmplY3QsIFkpICsgbm91bnBocmFzZS50b1Byb2xvZyhzdWJqZWN0PVkpXG5cbiAgICAgICAgY29uc3Qgc3ViaklkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gKCgpOiBJZCA9PiB7IHRocm93IG5ldyBFcnJvcigndW5kZWZpbmVkIHN1YmplY3QgaWQnKSB9KSgpXG4gICAgICAgIGNvbnN0IG5ld0lkID0gZ2V0UmFuZG9tSWQoKVxuXG4gICAgICAgIHJldHVybiBjbGF1c2VPZih0aGlzLnByZXBvc2l0aW9uLnN0cmluZywgc3ViaklkLCBuZXdJZClcbiAgICAgICAgICAgIC5hbmQoYXdhaXQgdGhpcy5ub3VuUGhyYXNlLnRvQ2xhdXNlKHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogbmV3SWQgfSB9KSlcbiAgICAgICAgICAgIC5jb3B5KHtzaWRlRWZmZWN0eSA6IGZhbHNlfSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IFRvQ2xhdXNlT3B0cyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4vTm91blBocmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSBpbXBsZW1lbnRzIFN1Ym9yZGluYXRlQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJlbHByb246IFJlbGF0aXZlUHJvbm91biwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5wcmVkaWNhdGUudG9DbGF1c2UoeyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBhcmdzPy5yb2xlcz8uc3ViamVjdCB9IH0pKVxuICAgICAgICAuY29weSh7c2lkZUVmZmVjdHkgOiBmYWxzZX0pXG4gICAgfVxuXG59IiwiaW1wb3J0IFBocmFzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9QaHJhc2VcIjtcbmltcG9ydCBBZGplY3RpdmUgZnJvbSBcIi4uL3Rva2Vucy9BZGplY3RpdmVcIjtcbmltcG9ydCBBcnRpY2xlIGZyb20gXCIuLi90b2tlbnMvQXJ0aWNsZVwiO1xuaW1wb3J0IE5vdW4gZnJvbSBcIi4uL3Rva2Vucy9Ob3VuXCI7XG5pbXBvcnQgUXVhbnRpZmllciBmcm9tIFwiLi4vdG9rZW5zL1F1YW50aWZpZXJcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRSYW5kb21JZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdW5QaHJhc2UgaW1wbGVtZW50cyBQaHJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYWRqZWN0aXZlczogQWRqZWN0aXZlW10sXG4gICAgICAgIHJlYWRvbmx5IGNvbXBsZW1lbnRzOiBDb21wbGVtZW50W10sXG4gICAgICAgIHJlYWRvbmx5IG5vdW4/OiBOb3VuLFxuICAgICAgICByZWFkb25seSBxdWFudGlmaWVyPzogUXVhbnRpZmllcixcbiAgICAgICAgcmVhZG9ubHkgYXJ0aWNsZT86IEFydGljbGUsXG4gICAgICAgIHJlYWRvbmx5IHN1Ym9yZENsYXVzZT86IFN1Ym9yZGluYXRlQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBpc1VuaVF1YW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5xdWFudGlmaWVyPy5pc1VuaXZlcnNhbCgpID8/IGZhbHNlXG4gICAgfVxuXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKVxuICAgICAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG5cblxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgLmFkamVjdGl2ZXNcbiAgICAgICAgICAgIC5tYXAoYSA9PiBhLnN0cmluZylcbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5ub3VuID8gW3RoaXMubm91bi5zdHJpbmddIDogW10pXG4gICAgICAgICAgICAubWFwKHAgPT4gY2xhdXNlT2YocCwgc3ViamVjdElkKSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UoKSlcbiAgICAgICAgICAgIC5hbmQoKGF3YWl0IFByb21pc2UuYWxsKHRoaXMuY29tcGxlbWVudHMubWFwKGMgPT4gYy50b0NsYXVzZShuZXdBcmdzKSkpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UoKSkpXG4gICAgICAgICAgICAuYW5kKGF3YWl0IHRoaXMuc3Vib3JkQ2xhdXNlPy50b0NsYXVzZShuZXdBcmdzKSA/PyBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmNvcHkoe3NpZGVFZmZlY3R5IDogZmFsc2V9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IENvbXBvdW5kU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29tcG91bmRTZW50ZW5jZVwiO1xuaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFNpbXBsZVNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1NpbXBsZVNlbnRlbmNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gXCIuLi90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uXCI7XG5cbi8qKlxuICogQSBzZW50ZW5jZSB0aGF0IHJlbGF0ZXMgdHdvIHNpbXBsZSBzZW50ZW5jZXMgaHlwb3RhY3RpY2FsbHksIGluIGEgXG4gKiBjb25kaXRpb24tb3V0Y29tZSByZWxhdGlvbnNoaXAuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBsZXhTZW50ZW5jZSBpbXBsZW1lbnRzIENvbXBvdW5kU2VudGVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY29uZGl0aW9uOiBTaW1wbGVTZW50ZW5jZSxcbiAgICAgICAgcmVhZG9ubHkgb3V0Y29tZTogU2ltcGxlU2VudGVuY2UsXG4gICAgICAgIHJlYWRvbmx5IHN1YmNvbmo6IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbikge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cbiAgICAgICAgY29uc3QgbmV3QXJnczEgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IGdldFJhbmRvbUlkKCkgfSB9XG5cbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gYXdhaXQgdGhpcy5jb25kaXRpb24udG9DbGF1c2UobmV3QXJnczEpXG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSBhd2FpdCB0aGlzLm91dGNvbWUudG9DbGF1c2UoeyAuLi5hcmdzLCBhbmFwaG9yYTogY29uZGl0aW9uIH0pXG4gICAgICAgIHJldHVybiBjb25kaXRpb24uaW1wbGllcyhvdXRjb21lKS5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUgfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgQmluYXJ5UXVlc3Rpb24gZnJvbSBcIi4uL2ludGVyZmFjZXMvQmluYXJ5UXVlc3Rpb25cIjtcbmltcG9ydCB7IFRvQ2xhdXNlT3B0cyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBDb3B1bGFTZW50ZW5jZSBmcm9tIFwiLi9Db3B1bGFTZW50ZW5jZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFRdWVzdGlvbiBpbXBsZW1lbnRzIEJpbmFyeVF1ZXN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsIHJlYWRvbmx5IHByZWRpY2F0ZTogTm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOiBDb3B1bGEpIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4ge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKHsgYXNWYXI6IHRoaXMuc3ViamVjdC5pc1VuaVF1YW50KCkgfSlcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIC8vVE9ETzogaW4gY2FzZSBvZiBhIHVuaXZlcnNhbGx5IHF1YW50aWZpZWQgcXVlc3Rpb24gZWc6IFwiYXJlIGFsbCBjYXRzIHNtYXJ0P1wiIHRoZSBwcm9sb2dcbiAgICAgICAgLy8gcHJvZHVjZWQgc2hvdWxkIE5PVCBiZSBhbiBpbXBsaWNhdGlvbiwgYnV0IHJhdGhlciBhIGNoZWNrIHRoYXQgYWxsIGNhdHMgYXJlIHNtYXJ0LlxuXG4gICAgICAgIGNvbnN0IGNsYXVzZSA9IGF3YWl0IG5ldyBDb3B1bGFTZW50ZW5jZSh0aGlzLnN1YmplY3QsIHRoaXMuY29wdWxhLCB0aGlzLnByZWRpY2F0ZSkudG9DbGF1c2UobmV3QXJncylcblxuICAgICAgICByZXR1cm4gY2xhdXNlLmNvcHkoe3NpZGVFZmZlY3R5IDogZmFsc2V9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TaW1wbGVTZW50ZW5jZVwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcbi8vIGltcG9ydCB7IGdldEFuYXBob3JhIH0gZnJvbSBcIi4uLy4uL2JyYWluL0FuYXBob3JhXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYVNlbnRlbmNlIGltcGxlbWVudHMgU2ltcGxlU2VudGVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDogTm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOiBDb3B1bGEsIHJlYWRvbmx5IHByZWRpY2F0ZTogTm91blBocmFzZSwgcmVhZG9ubHkgbmVnYXRpb24/OiBOZWdhdGlvbikge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cblxuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCh7IGFzVmFyOiB0aGlzLnN1YmplY3QuaXNVbmlRdWFudCgpIH0pXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gYXdhaXQgdGhpcy5zdWJqZWN0LnRvQ2xhdXNlKG5ld0FyZ3MpXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IChhd2FpdCB0aGlzLnByZWRpY2F0ZS50b0NsYXVzZShuZXdBcmdzKSkuY29weSh7IG5lZ2F0ZTogISF0aGlzLm5lZ2F0aW9uIH0pXG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5zdWJqZWN0LmlzVW5pUXVhbnQoKSA/XG4gICAgICAgICAgICBzdWJqZWN0LmltcGxpZXMocHJlZGljYXRlKSA6XG4gICAgICAgICAgICBzdWJqZWN0LmFuZChwcmVkaWNhdGUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIGNvbnN0IHJlc29sdmVkQW5hcGhvcmEgPSBhd2FpdCBnZXRBbmFwaG9yYShyZXN1bHQpLm1hcFRvQ2xhdXNlKGFyZ3M/LmFuYXBob3JhID8/IGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgIC8vIHJldHVybiByZXN1bHQuY29weSh7bWFwOiByZXNvbHZlZEFuYXBob3JhLCBzaWRlRWZmZWN0eSA6IHRydWV9KVxuICAgICAgICByZXR1cm4gcmVzdWx0LmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBWZXJiU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvVmVyYlNlbnRlbmNlXCI7XG5pbXBvcnQgQ29tcGxlbWVudCBmcm9tIFwiLi4vcGhyYXNlcy9Db21wbGVtZW50XCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgSVZlcmIgZnJvbSBcIi4uL3Rva2Vucy9JVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW50cmFuc2l0aXZlU2VudGVuY2UgaW1wbGVtZW50cyBWZXJiU2VudGVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDogTm91blBocmFzZSxcbiAgICAgICAgcmVhZG9ubHkgaXZlcmI6IElWZXJiLFxuICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGlvbj86IE5lZ2F0aW9uKSB7XG5cbiAgICB9XG4gICAgXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoeyBhc1ZhcjogdGhpcy5zdWJqZWN0LmlzVW5pUXVhbnQoKSB9KVxuICAgICAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG5cbiAgICAgICAgY29uc3QgdGhlbWUgPSBhd2FpdCB0aGlzLnN1YmplY3QudG9DbGF1c2UobmV3QXJncylcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHJoZW1lID0gY2xhdXNlT2YodGhpcy5pdmVyYi5zdHJpbmcsIHN1YmplY3RJZCkuYW5kKChhd2FpdCBQcm9taXNlLmFsbCh0aGlzLmNvbXBsZW1lbnRzLm1hcCggYyA9PiBjLnRvQ2xhdXNlKG5ld0FyZ3MpKSkpLnJlZHVjZSggKGMxLCBjMikgPT4gYzEuYW5kKGMyKSkpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhlbWUuYW5kKHJoZW1lLCB7IGFzUmhlbWU6IHRydWUgfSkuY29weSh7c2lkZUVmZmVjdHk6dHJ1ZX0pXG4gICAgfVxuXG59XG5cbiIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCB7IFRvQ2xhdXNlT3B0cyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBWZXJiU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvVmVyYlNlbnRlbmNlXCI7XG5pbXBvcnQgQ29tcGxlbWVudCBmcm9tIFwiLi4vcGhyYXNlcy9Db21wbGVtZW50XCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgTVZlcmIgZnJvbSBcIi4uL3Rva2Vucy9NVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSBpbXBsZW1lbnRzIFZlcmJTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG12ZXJiOiBNVmVyYixcbiAgICAgICAgICAgICAgICByZWFkb25seSBvYmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgY29tcGxlbWVudHM6IENvbXBsZW1lbnRbXSxcbiAgICAgICAgICAgICAgICByZWFkb25seSBuZWdhdGlvbj86IE5lZ2F0aW9uKSB7XG5cbiAgICB9XG4gICAgXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgIH1cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RUb2tlbiBpbXBsZW1lbnRzIFRva2Vue1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3RyaW5nOnN0cmluZyl7XG5cbiAgICB9ICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZGplY3RpdmUgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCB7IGZvcm1zT2YgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4uLy4uL2xleGVyL2xleGVtZXNcIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXJ0aWNsZSBleHRlbmRzIEFic3RyYWN0VG9rZW4ge1xuXG4gICAgaXNEZWZpbml0ZSgpIHtcblxuICAgICAgICByZXR1cm4gbGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHgudHlwZSA9PT0gJ2RlZmFydCcpXG4gICAgICAgICAgICAuZmxhdE1hcCh4ID0+IGZvcm1zT2YoeCkpXG4gICAgICAgICAgICAuaW5jbHVkZXModGhpcy5zdHJpbmcpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBgQXJ0aWNsZSgke3RoaXMuc3RyaW5nfSwgaXNEZWZpbml0ZT0ke3RoaXMuaXNEZWZpbml0ZSgpfSlgXG4gICAgfVxuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYSBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZ1bGxTdG9wIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSFZlcmIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJVmVyYiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1WZXJiIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTmVnYXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3VuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlcG9zaXRpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgICAgIFxufSIsImltcG9ydCB7IGZvcm1zT2YgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4uLy4uL2xleGVyL2xleGVtZXNcIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVhbnRpZmllciBleHRlbmRzIEFic3RyYWN0VG9rZW4ge1xuXG4gICAgaXNVbml2ZXJzYWwoKSB7XG5cbiAgICAgICAgcmV0dXJuIGxleGVtZXNcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LnR5cGUgPT09ICd1bmlxdWFudCcpXG4gICAgICAgICAgICAuZmxhdE1hcCh4ID0+IGZvcm1zT2YoeCkpXG4gICAgICAgICAgICAuaW5jbHVkZXModGhpcy5zdHJpbmcpXG5cbiAgICB9XG5cbiAgICBpc0V4aXN0ZW50aWFsKCkge1xuXG4gICAgICAgIHJldHVybiBsZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC50eXBlID09PSAnZXhpc3RxdWFudCcpXG4gICAgICAgICAgICAuZmxhdE1hcCh4ID0+IGZvcm1zT2YoeCkpXG4gICAgICAgICAgICAuaW5jbHVkZXModGhpcy5zdHJpbmcpXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVsYXRpdmVQcm9ub3VuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGhlbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgIFxufSIsImltcG9ydCB7IHRha2VBY3Rpb24gfSBmcm9tIFwiLi4vYWN0aW9uL0FjdGlvblwiO1xuaW1wb3J0IHsgZ2V0UGFyc2VyIH0gZnJvbSBcIi4uL3BhcnNlci9QYXJzZXJcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuaW1wb3J0IGdldEVudmlybyBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQnJhaW4gaW1wbGVtZW50cyBCcmFpbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBlbnZpcm8gPSBnZXRFbnZpcm8oKSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBQcm9taXNlPGFueVtdPiB7XG5cbiAgICAgICAgZm9yIChjb25zdCBhc3Qgb2YgZ2V0UGFyc2VyKG5hdGxhbmcpLnBhcnNlQWxsKCkpIHtcblxuICAgICAgICAgICAgY29uc3QgY2xhdXNlID0gYXdhaXQgYXN0LnRvQ2xhdXNlKClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGNsYXVzZS50b1N0cmluZygpLCAnc2lkZS1lZmZldGNzOicsIGNsYXVzZS5pc1NpZGVFZmZlY3R5KVxuXG4gICAgICAgICAgICBpZiAoY2xhdXNlLmlzU2lkZUVmZmVjdHkpIHtcbiAgICAgICAgICAgICAgICB0YWtlQWN0aW9uKGNsYXVzZSwgdGhpcy5lbnZpcm8pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IGhpZ2hsaWdodCAoXCJwb2ludCBvdXRcIikgZWxlbWVudChzKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiXG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIlxuaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4vQmFzaWNCcmFpblwiXG5cbi8qKlxuICogVGhlIG1haW4gZmFjYWRlIGNvbnRyb2xsZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgcmVhZG9ubHkgZW52aXJvOiBFbnZpcm9cbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFByb21pc2U8YW55W10+XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRCcmFpbigpOiBQcm9taXNlPEJyYWluPiB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0JyYWluKClcbn1cbiIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdGlvbi9BY3Rpb25cIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGhhc2hTdHJpbmcsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5kIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZXM6IENsYXVzZVtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IG5vQW5hcGhvcmEgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSxcbiAgICAgICAgcmVhZG9ubHkgdGhlbWUgPSBjbGF1c2VzWzBdLFxuICAgICAgICByZWFkb25seSByaGVtZSA9IGNsYXVzZXNbMV0pIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG5cbiAgICAgICAgcmV0dXJuIG9wdHM/LmFzUmhlbWUgP1xuICAgICAgICAgICAgbmV3IEFuZChbdGhpcywgb3RoZXJdKSA6XG4gICAgICAgICAgICBuZXcgQW5kKFsuLi50aGlzLmZsYXRMaXN0KCksIC4uLm90aGVyLmZsYXRMaXN0KCldKVxuXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBBbmQge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLmNsYXVzZXMubWFwKGMgPT4gYy5jb3B5KHsgLi4ub3B0cywgbmVnYXRlOiBmYWxzZSB9KSksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8ubm9BbmFwaG9yYSA/PyB0aGlzLm5vQW5hcGhvcmEsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDogdGhpcy5jbGF1c2VzLmZsYXRNYXAoYyA9PiBjLmZsYXRMaXN0KCkpXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KHRoaXMuY2xhdXNlcy5mbGF0TWFwKGMgPT4gYy5lbnRpdGllcykpKVxuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG5cbiAgICAgICAgaWYgKHRoaXMubmVnYXRlZCkge1xuICAgICAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlKCkgLy8gVE9ETyEhISEhISEhIVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlcy5mbGF0TWFwKGMgPT4gYy5hYm91dChpZCkpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBhc3luYyB0b0FjdGlvbigpOiBQcm9taXNlPEFjdGlvbj4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gdGhpcy5jbGF1c2VzLm1hcCh4ID0+IHgudG9TdHJpbmcoKSkudG9TdHJpbmcoKVxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZXMuZmxhdE1hcCh4PT54Lm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2VzLmZsYXRNYXAoeD0+eC5vd25lcnNPZihpZCkpXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2VzLmZsYXRNYXAoeD0+eC5kZXNjcmliZShpZCkpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UsIGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBpc1ZhciB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3Rpb24vQWN0aW9uXCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4uL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVkaWNhdGU6IHN0cmluZyxcbiAgICAgICAgcmVhZG9ubHkgYXJnczogSWRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBub0FuYXBob3JhID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNJbXBseSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSksXG4gICAgICAgIHJlYWRvbmx5IHJoZW1lID0gZW1wdHlDbGF1c2UoKSkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQoW3RoaXMsIC4uLm90aGVyLmZsYXRMaXN0KCldKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQmFzaWNDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHRoaXMucHJlZGljYXRlLFxuICAgICAgICAgICAgdGhpcy5hcmdzLm1hcChhID0+IG9wdHM/Lm1hcCA/IG9wdHM/Lm1hcFthXSA/PyBhIDogYSksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8ubm9BbmFwaG9yYSA/PyB0aGlzLm5vQW5hcGhvcmEsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQodGhpcy5hcmdzLmZpbHRlcihhID0+ICFpc1ZhcihhKSkpKSAvLyB2YXJpYWJsZSBpZHMgYXJlIE5PVCBlbnRpdGllc1xuICAgIH1cblxuICAgIGFzeW5jIHRvQWN0aW9uKCk6IFByb21pc2U8QWN0aW9uPiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5pbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlID09PSAnb2YnICYmIHRoaXMuYXJnc1sxXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzBdXSA6IFtdXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZSA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZX0oJHt0aGlzLmFyZ3N9KWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVudGl0aWVzLmluY2x1ZGVzKGlkKSAmJiB0aGlzLmFyZ3MubGVuZ3RoID09PSAxID8gW3RoaXMucHJlZGljYXRlXSA6IFtdXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQmFzaWNDbGF1c2UgfSBmcm9tIFwiLi9CYXNpY0NsYXVzZVwiXG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiXG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4vSWRcIlxuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0aW9uL0FjdGlvblwiXG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4uL2JyYWluL0JyYWluXCJcblxuLyoqXG4gKiBBICdsYW5ndWFnZS1hZ25vc3RpYycgZmlyc3Qgb3JkZXIgbG9naWMgcmVwcmVzZW50YXRpb24uXG4qL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc0ltcGx5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgbm9BbmFwaG9yYTogYm9vbGVhblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZVxuICAgIHRvQWN0aW9uKCk6IFByb21pc2U8QWN0aW9uPlxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBkZXNjcmliZShpZDpJZCkgOiBzdHJpbmdbXSBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYXVzZU9mKHByZWRpY2F0ZTogc3RyaW5nLCAuLi5hcmdzOiBJZFtdKTogQ2xhdXNlIHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlID0gKCk6IENsYXVzZSA9PiBuZXcgQW5kKFtdKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgbm9BbmFwaG9yYT86IGJvb2xlYW4gLy8gaW50ZXJwcmV0IGV2ZXJ5IGlkIGFzIGV4YWN0XG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5kT3B0cyB7XG4gICAgYXNSaGVtZT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc2hTdHJpbmcoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnNwbGl0KCcnKS5tYXAoYyA9PiBjLmNoYXJDb2RlQXQoMCkpLnJlZHVjZSgoaGFzaCwgY2MpID0+IHtcbiAgICAgICAgY29uc3QgaDEgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNjO1xuICAgICAgICByZXR1cm4gaDEgJiBoMTsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfSlcbn1cbiIsIi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IG51bWJlciB8IHN0cmluZ1xuXG4vKipcbiAqIElkIHRvIElkIG1hcHBpbmcsIGZyb20gb25lIFwidW5pdmVyc2VcIiB0byBhbm90aGVyLlxuICovXG5leHBvcnQgdHlwZSBNYXAgPSB7IFthOiBJZF06IElkIH1cblxuXG5mdW5jdGlvbiogZ2V0SWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgeCsrXG4gICAgICAgIHlpZWxkIHhcbiAgICB9XG59XG5cbmNvbnN0IGlkR2VuZXJhdG9yID0gZ2V0SWRHZW5lcmF0b3IoKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tSWQob3B0cz86IEdldFJhbmRvbUlkT3B0cyk6IElkIHtcbiAgICBcbiAgICAvLyBjb25zdCBuZXdJZCA9IGBpZCR7cGFyc2VJbnQoMTAwMCAqIE1hdGgucmFuZG9tKCkgKyAnJyl9YFxuXG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gXG5cbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFJhbmRvbUlkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhcihlOiBJZCkge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oTnVtYmVyKGUpKSAmJiAoZS50b1N0cmluZygpWzBdID09PSBlLnRvU3RyaW5nKClbMF0udG9VcHBlckNhc2UoKSlcbn1cblxuIiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgaGFzaFN0cmluZywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3Rpb24vQWN0aW9uXCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4uL2JyYWluL0JyYWluXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5IGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjb25jbHVzaW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgbm9BbmFwaG9yYSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSB0cnVlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSksXG4gICAgICAgIHJlYWRvbmx5IHRoZW1lID0gY29uZGl0aW9uLnRoZW1lKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZChbdGhpcywgb3RoZXJdKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcblxuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMuY29uZGl0aW9uLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNvbmNsdXNpb24uY29weShvcHRzKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5ub0FuYXBob3JhID8/IHRoaXMubm9BbmFwaG9yYSxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzXVxuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNvbmNsdXNpb24uZW50aXRpZXMpXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzIC8vIGR1bm5vIHdoYXQgSSdtIGRvaW4nXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBlbXB0eUNsYXVzZSgpIC8vL1RPRE8hISEhISEhIVxuICAgIH1cblxuICAgIGFzeW5jIHRvQWN0aW9uKCk6IFByb21pc2U8QWN0aW9uPiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5pbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpfSAtLS0+ICR7dGhpcy5jb25jbHVzaW9uLnRvU3RyaW5nKCl9YFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jb25jbHVzaW9uLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNvbmNsdXNpb24ub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uY2x1c2lvbi5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKGlkKSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBnZXRDb25jZXB0cyB9IGZyb20gXCIuL2dldENvbmNlcHRzXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmNyZXRlV3JhcHBlciBpbXBsZW1lbnRzIFdyYXBwZXIge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbzogYW55LFxuICAgICAgICByZWFkb25seSBzaW1wbGVDb25jZXB0czogeyBbY29uY2VwdE5hbWU6IHN0cmluZ106IHN0cmluZ1tdIH0gPSB7fSkge1xuICAgICAgICB0aGlzLnNldEFsaWFzKCdjb2xvcicsIFsnc3R5bGUnLCAnYmFja2dyb3VuZCddKVxuICAgICAgICB0aGlzLnNldEFsaWFzKCd3aWR0aCcsIFsnc3R5bGUnLCAnd2lkdGgnXSlcbiAgICAgICAgLy9UT0RPIGRvIHRoaXMgb25seSBvbmNlIGFuZCBvbmx5IGZvciBIVE1MRWxlbWVudCdzIHByb3RvdHlwZVxuICAgICAgICAvL1RPRE8gcHV0IGl0IE9OIHRoZSBwcm90b3R5cGUgb2JqZWN0IHNvIGl0IGNhbiBiZSByZXRyaWV2ZWQgYXMgXCJ0aGlzLm8uc2ltcGxlQ29uY2VwdHNcIiBmcm9tIGFueSBpbnN0YW5jZSBvZiB0aGUgcHJvdG90eXBlXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogc3RyaW5nLCBwcm9wcz86IHN0cmluZ1tdKTogdm9pZCB7XG5cbiAgICAgICAgKHRoaXMubyBhcyBhbnkpW3ByZWRpY2F0ZV0gPSB0cnVlIC8vIFRPRE86IHJlbW92ZVxuXG4gICAgICAgIGlmIChwcm9wcyAmJiBwcm9wcy5sZW5ndGggPiAxKSB7IC8vIHNldCB0aGUgcGVkaWNhdGUgb24gdGhlIHBhdGhcbiAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHByb3BzLCBwcmVkaWNhdGUpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vMSBpZiBsZW4ocHJvcHMpID09IDEgdXNlIGl0IGFzIGEgY29uY2VwdFxuICAgICAgICBpZiAocHJvcHMgJiYgcHJvcHMubGVuZ3RoID09PSAxKSB7XG5cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnNpbXBsZUNvbmNlcHRzKS5pbmNsdWRlcyhwcm9wc1swXSkpIHsgLy8gaXMgY29uY2VwdFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHRoaXMuc2ltcGxlQ29uY2VwdHNbcHJvcHNbMF1dLCBwcmVkaWNhdGUpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHByb3BzLCBwcmVkaWNhdGUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8yIGlmIGxlbihwcm9wcykgPT0gMCBnZXQgdGhlIGNvbmNlcHQgZnJvbSB0aGUgcHJlZGljYXRlIChlZzogcmVkIGlzIGEgJ2NvbG9yJylcbiAgICAgICAgY29uc3QgY29uY2VwdHMgPSBnZXRDb25jZXB0cyhwcmVkaWNhdGUpXG5cbiAgICAgICAgaWYgKGNvbmNlcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldE5lc3RlZCh0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHRzWzBdXSwgcHJlZGljYXRlKVxuXG4gICAgfVxuXG4gICAgaXMocHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IFdyYXBwZXJbXSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKHRoaXMubyBhcyBhbnkpW3ByZWRpY2F0ZV0gIT09IHVuZGVmaW5lZCAvLyBUT0RPOiByZW1vdmVcbiAgICB9XG5cbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogc3RyaW5nLCBwcm9wUGF0aDogc3RyaW5nW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zaW1wbGVDb25jZXB0c1tjb25jZXB0TmFtZV0gPSBwcm9wUGF0aFxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXROZXN0ZWQocGF0aDogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpIHtcblxuICAgICAgICBsZXQgeCA9IHRoaXMub1twYXRoWzBdXVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSwgLTIpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0gdGhpcy5vW3BdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHhbcGF0aFtwYXRoLmxlbmd0aCAtIDFdXSA9IHZhbHVlXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiXG5pbXBvcnQgQ29uY3JldGVXcmFwcGVyIGZyb20gXCIuL0NvbmNyZXRlV3JhcHBlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBXcmFwcGVyIHtcblxuICAgIHNldChwcmVkaWNhdGU6IHN0cmluZywgcHJvcHM/OiBzdHJpbmdbXSk6IHZvaWQgLy8gb2JqLnNldCgncmVkJyksIG9iai5zZXQoJ29uJywgb2JqMikgLi4uXG4gICAgaXMocHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IFdyYXBwZXJbXSk6IGJvb2xlYW5cbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogc3RyaW5nLCBwcm9wUGF0aDogc3RyaW5nW10pOiB2b2lkXG4gICAgLy8gZ2V0KHByZWRpY2F0ZTogc3RyaW5nKTogYW55XG4gICAgLy8gZ2V0UHJvcChwYXRoOiBzdHJpbmdbXSk6IGFueVxuICAgIC8vIHNldFByb3AocGF0aDogc3RyaW5nW10sIHZhbHVlOiBhbnkpOiB2b2lkXG4gICAgLy8gZGVzY3JpYmUoKTogc3RyaW5nW10gLy8gWydidXR0b24nLCAncmVkJywgJ2JpZycsIC4uLl1cbiAgICAvLyBzZXRBbGlhcyhuYW1lOiBzdHJpbmcsIHBhdGg6IHN0cmluZ1tdKTogdm9pZCAvLyAuc2V0QWxpYXMoJ3dpZHRoJywgWydzdHlsZScsICd3aWR0aCddKVxuICAgIC8vIGFkZENvbmNlcHQoY29uY2VwdDpzdHJpbmcsIHNldHRlcjooKT0+dm9pZCwgaXM6KCk9Pik6dm9pZFxuICAgIC8vIGRvU29tZXRoaW5nKGNsYXVzZTpDbGF1c2UpOmFueSAvLyBnZXQgb3duZXJzaGlwIGNoYWluIGFuZCBkbyBzb21ldGhpbmcgd2l0aCB0aGUgY2xhdXNlLCBjbGF1c2UgaGFzIGV2ZXJ5dGhpbmcsIGl0IGhhcyBpbmZvIG9uIHNpZGUtZWZmZWN0cywgcHJlZGljYXRlIGV0Yy4uLj8/P1xuXG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAobzogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBDb25jcmV0ZVdyYXBwZXIobylcbn0iLCJleHBvcnQgY29uc3Qgc2V0dGVyUHJlZml4ID0gJ3NldCdcbmV4cG9ydCBjb25zdCBpc1ByZWZpeCA9ICdpcydcbmV4cG9ydCBjb25zdCBnZXR0ZXJQcmVmaXggPSAnZ2V0J1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uY2VwdHMob2JqZWN0OiBhbnkpOiBzdHJpbmdbXSB7XG5cbiAgICAvLyBUT0RPOiB0cnkgZ2V0dGluZyBhIGNvbmNlcHQgZnJvbSBhIHN0cmluZyBvYmplY3Qgd2l0aCBhIFxuICAgIC8vIHNwZWNpYWwgZGljdGlvbmFyeSwgbGlrZSB7cmVkOmNvbG9yLCBncmVlbjpjb2xvciwgYmx1ZTpjb2xvcn1cbiAgICBjb25zdCBzdHJpbmdDb25jZXB0czogeyBbeDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAgICdncmVlbic6ICdjb2xvcicsXG4gICAgICAgICdyZWQnOiAnY29sb3InLFxuICAgICAgICAnYmx1ZSc6ICdjb2xvcicsXG4gICAgICAgICdibGFjayc6ICdjb2xvcicsXG4gICAgICAgICdiaWcnOiAnc2l6ZSdcbiAgICB9XG4gICAgY29uc3QgbWF5YmVDb25jZXB0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSBzdHJpbmdDb25jZXB0c1tvYmplY3QudG9TdHJpbmcoKV1cblxuICAgIGlmIChtYXliZUNvbmNlcHQpIHtcbiAgICAgICAgcmV0dXJuIFttYXliZUNvbmNlcHRdXG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdFxuICAgICAgICAuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpXG4gICAgICAgIC5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqZWN0Ll9fcHJvdG9fXykpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4LmluY2x1ZGVzKHNldHRlclByZWZpeCkgfHwgeC5pbmNsdWRlcyhpc1ByZWZpeCkpXG4gICAgICAgIC5tYXAoeCA9PiBnZXRDb25jZXB0TmFtZSh4KSlcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2V0dGVyTmFtZShjb25jZXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7c2V0dGVyUHJlZml4fV8ke2NvbmNlcHR9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SXNOYW1lKGNvbmNlcHQ6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtpc1ByZWZpeH1fJHtjb25jZXB0fWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEdldHRlck5hbWUoY29uY2VwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke2dldHRlclByZWZpeH1fJHtjb25jZXB0fWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmNlcHROYW1lKG1ldGhvZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG1ldGhvZFxuICAgICAgICAucmVwbGFjZShpc1ByZWZpeCwgJycpXG4gICAgICAgIC5yZXBsYWNlKHNldHRlclByZWZpeCwgJycpXG4gICAgICAgIC5yZXBsYWNlKGdldHRlclByZWZpeCwgJycpXG4gICAgICAgIC5yZXBsYWNlKCdfJywgJycpXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuLi9jb25jZXB0cy9XcmFwcGVyXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi9FbnZpcm9cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUVudmlybyBpbXBsZW1lbnRzIEVudmlybyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBkaWN0aW9uYXJ5OiB7IFtpZDogSWRdOiBXcmFwcGVyIH0gPSB7fSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0KGlkOiBJZCk6IFByb21pc2U8V3JhcHBlcj4ge1xuXG4gICAgICAgIC8vIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdIC8vIFRPRE86IGNvdWxkIGJlIHVuZGVmaW5lZCFcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKG9rLCBlcnIpID0+IHtcblxuICAgICAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaWN0aW9uYXJ5W2lkXSkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsKVxuICAgICAgICAgICAgICAgICAgICBvayh0aGlzLmRpY3Rpb25hcnlbaWRdIGFzIFdyYXBwZXIpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LCAxMDApXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q6IFdyYXBwZXIpOiB2b2lkIHtcbiAgICAgICAgLy8gdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IG9iamVjdFxuXG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuXG4gICAgICAgIGlmIChwbGFjZWhvbGRlciAmJiBwbGFjZWhvbGRlciBpbnN0YW5jZW9mIFBsYWNlaG9sZGVyKSB7XG5cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLnByZWRpY2F0ZXMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICBvYmplY3Quc2V0KHApXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0aGlzLmRpY3Rpb25hcnlbaWRdID0gb2JqZWN0XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGFzeW5jIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogUHJvbWlzZTx7IFtpZDogSWRdOiBJZCB8IHVuZGVmaW5lZCB9PiB7XG5cbiAgICAgICAgLy8gZm9yIGVhY2ggZW50aXR5IGluIHRoZSBjbGF1c2UsIGdldCB0aGUgZW50aXRpZXMgdGhhdCBtYXRjaCBpdHMgZGVzY3JpcHRpb24gaW4gdGhlIGRpY3Rpb25hcnlcbiAgICAgICAgLy9UT0RPIHRtcCBzb2x1dGlvbiwgZm9yIGFuYXBob3JhIHJlc29sdXRpb24sIGJ1dCB3aXRob3V0IHRha2luZyAobXVsdGktZW50aXR5KSByZWxhdGlvbnNoaXBzIGludG8gYWNjb3VudFxuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gT2JqZWN0XG4gICAgICAgICAgICAuZW50cmllcyh0aGlzLmRpY3Rpb25hcnkpXG5cbiAgICAgICAgY29uc3QgcXVlcnkgPSBjbGF1c2VcbiAgICAgICAgICAgIC5lbnRpdGllc1xuICAgICAgICAgICAgLm1hcChlID0+ICh7IGUsIGQ6IGNsYXVzZS50aGVtZS5kZXNjcmliZShlKSB9KSlcblxuICAgICAgICBjb25zdCByZXMgPSBxdWVyeVxuICAgICAgICAgICAgLm1hcChxID0+ICh7IFtxLmVdOiB1bml2ZXJzZS5maW5kKHUgPT4gcS5kLmV2ZXJ5KHMgPT4gdVsxXT8uaXMocykpKT8uWzBdIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgc2V0UGxhY2Vob2xkZXIoaWQ6IElkKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBuZXcgUGxhY2Vob2xkZXIoKVxuICAgIH1cblxuICAgIGV4aXN0cyhpZDogSWQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF0gJiYgISh0aGlzLmRpY3Rpb25hcnlbaWRdIGluc3RhbmNlb2YgUGxhY2Vob2xkZXIpXG4gICAgfVxuXG59XG5cbmNsYXNzIFBsYWNlaG9sZGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVkaWNhdGVzOiBzdHJpbmdbXSA9IFtdKSB7XG5cbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBzdHJpbmcsIHByb3BzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyh7cHJvcHN9KVxuICAgICAgICB0aGlzLnByZWRpY2F0ZXMucHVzaChwcmVkaWNhdGUpXG4gICAgfVxuXG4gICAgaXMocHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IFdyYXBwZXJbXSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGVzLmluY2x1ZGVzKHByZWRpY2F0ZSlcbiAgICB9XG5cbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogc3RyaW5nLCBwcm9wT3JTeW5vbkNvbmNlcHQ6IHN0cmluZyB8IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIFxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4uL2NvbmNlcHRzL1dyYXBwZXJcIjtcbmltcG9ydCBCYXNlRW52aXJvIGZyb20gXCIuL0Jhc2VFbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm8ge1xuICAgIGdldChpZDogSWQpOiBQcm9taXNlPFdyYXBwZXI+XG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0OiBXcmFwcGVyKTogdm9pZFxuICAgIHNldFBsYWNlaG9sZGVyKGlkOklkKTp2b2lkXG4gICAgLy8gcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPiAvL1RPRE8hISEhISEhISEgICAgXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPHsgW2lkOiBJZF06IElkIHwgdW5kZWZpbmVkIH0+XG4gICAgZXhpc3RzKGlkOklkKTpib29sZWFuXG4gICAgLy8gZ2V0IGtleXMoKTogSWRbXVxuICAgIC8vIGdldCB2YWx1ZXMoKTogYW55W11cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RW52aXJvKCk6IEVudmlybyB7XG4gICAgcmV0dXJuIG5ldyBCYXNlRW52aXJvKClcbn0iLCJpbXBvcnQgbWFpbiBmcm9tIFwiLi9tYWluL21haW5cIjtcbmltcG9ydCB7IHRlc3RDb25jZXB0cyB9IGZyb20gXCIuL3Rlc3RzL3Rlc3RDb25jZXB0c1wiO1xuaW1wb3J0IHsgd3JhcHBlclRlc3QgfSBmcm9tIFwiLi90ZXN0cy93cmFwcGVyVGVzdFwiO1xuXG4vLyB0ZXN0Q29uY2VwdHMoKVxuLy8gd3JhcHBlclRlc3QoKVxubWFpbigpIiwiaW1wb3J0IFRva2VuLCB7IGdldFRva2VuQ29ucyB9IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IHsgZ2V0TGV4ZW1lcyB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IExleGVyLCB7IEFzc2VydEFyZ3MsIENvbnN0cnVjdG9yIH0gZnJvbSBcIi4vTGV4ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSB0b2tlbnM6IFRva2VuW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcpIHtcblxuICAgICAgICB0aGlzLnRva2VucyA9IHNvdXJjZUNvZGVcbiAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgLm1hcChlID0+ICFlID8gJy4nIDogZSlcbiAgICAgICAgICAgIC5mbGF0TWFwKHN0cmluZyA9PiBnZXRMZXhlbWVzKHN0cmluZylcbiAgICAgICAgICAgICAgICAubWFwKGwgPT4gbmV3IChnZXRUb2tlbkNvbnMobC50eXBlKSkobC5uYW1lKSkpXG5cbiAgICAgICAgY29uc29sZS5kZWJ1ZygndG9rZW5zJywgdGhpcy50b2tlbnMpXG4gICAgICAgIHRoaXMuX3BvcyA9IDBcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBUb2tlbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBjdXJyZW50IHRva2VuIGlmZiBvZiBnaXZlbiB0eXBlIGFuZCBtb3ZlIHRvIG5leHQ7IFxuICAgICAqIGVsc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgZG9uJ3QgbW92ZS5cbiAgICAgKiBAcGFyYW0gYXJncyBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBhc3NlcnQ8VD4oY2xheno6IENvbnN0cnVjdG9yPFQ+LCBhcmdzOiBBc3NlcnRBcmdzKTogVCB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMucGVla1xuXG4gICAgICAgIGlmIChjdXJyZW50IGluc3RhbmNlb2YgY2xhenopIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MuZXJyb3JPdXQgPz8gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcm9hayhhcmdzLmVycm9yTXNnID8/ICcnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIlxuaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZSB7XG4gICAgLyoqdXN1YWxseSByb290IGZvcm0qLyByZWFkb25seSBuYW1lOiBzdHJpbmdcbiAgICAvKip0b2tlbiB0eXBlKi8gcmVhZG9ubHkgdHlwZTogVG9rZW5UeXBlXG4gICAgLyoqdXNlZnVsIGZvciBpcnJlZ3VsYXIgc3R1ZmYqLyByZWFkb25seSBmb3Jtcz86IHN0cmluZ1tdXG4gICAgLyoqcmVmZXJzIHRvIHZlcmIgY29uanVnYXRpb25zIG9yIHBsdXJhbCBmb3JtcyovIHJlYWRvbmx5IHJlZ3VsYXI/OiBib29sZWFuXG4gICAgLyoqc2VtYW50aWNhbCBkZXBlbmRlY2UqLyByZWFkb25seSBkZXJpdmVkRnJvbT86IHN0cmluZ1xuICAgIC8qKnNlbWFudGljYWwgZXF1aXZhbGVuY2UqLyByZWFkb25seSBhbGlhc0Zvcj86IHN0cmluZ1xuICAgIC8qKm1hZGUgdXAgb2YgbW9yZSBsZXhlbWVzKi8gcmVhZG9ubHkgY29udHJhY3Rpb25Gb3I/OiBzdHJpbmdbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybXNPZihsZXhlbWU6IExleGVtZSkge1xuXG4gICAgcmV0dXJuIFtsZXhlbWUubmFtZV0uY29uY2F0KGxleGVtZT8uZm9ybXMgPz8gW10pXG4gICAgICAgIC5jb25jYXQobGV4ZW1lLnJlZ3VsYXIgPyBbYCR7bGV4ZW1lLm5hbWV9c2BdIDogW10pXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVtZXMod29yZDogc3RyaW5nKTogTGV4ZW1lW10ge1xuXG4gICAgY29uc3QgbGV4ZW1lID0gbGV4ZW1lcy5maWx0ZXIoeCA9PiBmb3Jtc09mKHgpLmluY2x1ZGVzKHdvcmQpKVswXVxuICAgICAgICA/PyB7IG5hbWU6IHdvcmQsIHR5cGU6ICdhZGonIH1cblxuICAgIHJldHVybiBsZXhlbWUuY29udHJhY3Rpb25Gb3IgP1xuICAgICAgICBsZXhlbWUuY29udHJhY3Rpb25Gb3IuZmxhdE1hcCh4ID0+IGdldExleGVtZXMoeCkpIDpcbiAgICAgICAgW2xleGVtZV1cblxufSIsImltcG9ydCBUb2tlbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlcntcbiAgICBnZXQgcGVlaygpOlRva2VuXG4gICAgZ2V0IHBvcygpOm51bWJlclxuICAgIGdldCBpc0VuZCgpOmJvb2xlYW5cbiAgICBuZXh0KCk6dm9pZFxuICAgIGJhY2tUbyhwb3M6bnVtYmVyKTp2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6c3RyaW5nKTp2b2lkICAgXG4gICAgYXNzZXJ0IDxUPihjbGF6ejpDb25zdHJ1Y3RvcjxUPiwgYXJnczpBc3NlcnRBcmdzKTogVHx1bmRlZmluZWQgXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXJ0QXJnc3tcbiAgICBlcnJvck1zZz86c3RyaW5nXG4gICAgZXJyb3JPdXQ/OmJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6c3RyaW5nKTpMZXhlcntcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSlcbn1cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcblxuXG5leHBvcnQgY29uc3QgbGV4ZW1lczogTGV4ZW1lW10gPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnaGF2ZScsXG4gICAgICAgIHR5cGU6ICdtdmVyYicsXG4gICAgICAgIGZvcm1zOiBbJ2hhdmUnLCAnaGFzJ10sXG4gICAgICAgIHJlZ3VsYXI6IGZhbHNlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2J1dHRvbicsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgcmVndWxhciA6IHRydWVcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnY2xpY2snLFxuICAgICAgICB0eXBlOiAnbXZlcmInLFxuICAgICAgICBmb3JtczogWydjbGljayddLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2NsaWNrZWQnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgZGVyaXZlZEZyb206ICdjbGljaydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAncHJlc3NlZCcsXG4gICAgICAgIHR5cGU6ICdhZGonLFxuICAgICAgICBhbGlhc0ZvcjogJ2NsaWNrZWQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2NhdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdiZScsXG4gICAgICAgIHR5cGU6ICdjb3B1bGEnLFxuICAgICAgICBmb3JtczogWydpcycsICdhcmUnXSxcbiAgICAgICAgcmVndWxhcjogZmFsc2VcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiBcImlzbid0XCIsXG4gICAgICAgIHR5cGU6ICdjb250cmFjdGlvbicsXG4gICAgICAgIGNvbnRyYWN0aW9uRm9yOiBbJ2lzJywgJ25vdCddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogXCJyZWRcIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6IFwiZ3JlZW5cIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6IFwiZXhpc3RcIixcbiAgICAgICAgdHlwZTogXCJpdmVyYlwiLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2RvJyxcbiAgICAgICAgdHlwZTogJ2h2ZXJiJyxcbiAgICAgICAgcmVndWxhcjogZmFsc2UsXG4gICAgICAgIGZvcm1zOiBbJ2RvJywgJ2RvZXMnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdzb21lJyxcbiAgICAgICAgdHlwZTogJ2V4aXN0cXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2V2ZXJ5JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhbGwnLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2FueScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAndG8nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3dpdGgnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2Zyb20nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ29mJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdvdmVyJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdvbicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYXQnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3RoZW4nLFxuICAgICAgICB0eXBlOiAndGhlbicgLy8gZmlsbGVyIHdvcmRcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnaWYnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnd2hlbicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdiZWNhdXNlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3doaWxlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3RoYXQnLFxuICAgICAgICB0eXBlOiAncmVscHJvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnbm90JyxcbiAgICAgICAgdHlwZTogJ25lZ2F0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICd0aGUnLFxuICAgICAgICB0eXBlOiAnZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhbicsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYW5kJyxcbiAgICAgICAgdHlwZTogJ25vbnN1YmNvbmonXG4gICAgfVxuXSIsImltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2JyYWluL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IHN0YXRlID0ge1xuICAgICAgICBicmFpbjogYXdhaXQgZ2V0QnJhaW4oKSxcbiAgICAgICAgcHJvbXB0VmlzaWJsZTogZmFsc2VcbiAgICB9O1xuXG4gICAgKHdpbmRvdyBhcyBhbnkpLmJyYWluID0gc3RhdGUuYnJhaW5cblxuICAgIGNvbnN0IHVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgdGV4dGFyZWEuaGlkZGVuID0gIXN0YXRlLnByb21wdFZpc2libGVcbiAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA/IHRleHRhcmVhLmZvY3VzKCkgOiAwXG4gICAgfVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNTB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnMWVtJ1xuICAgIHRleHRhcmVhLmhpZGRlbiA9IHRydWVcbiAgICB0ZXh0YXJlYS5zdHlsZS5wb3NpdGlvbiA9ICdzdGlja3knXG4gICAgdGV4dGFyZWEuc3R5bGUudG9wID0gJzAnXG4gICAgdGV4dGFyZWEuc3R5bGUuekluZGV4ID0gJzEwMDAnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2JyJykpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBhc3luYyBlID0+IHtcblxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ1NwYWNlJykge1xuICAgICAgICAgICAgc3RhdGUucHJvbXB0VmlzaWJsZSA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgc3RhdGUuYnJhaW4uZXhlY3V0ZSh0ZXh0YXJlYS52YWx1ZSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdClcbiAgICAgICAgfVxuXG4gICAgICAgIHVwZGF0ZSgpXG4gICAgfSlcblxufSIsImltcG9ydCBBc3QgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0FzdFwiO1xuaW1wb3J0IEJpbmFyeVF1ZXN0aW9uIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9CaW5hcnlRdWVzdGlvblwiO1xuaW1wb3J0IENvbXBvdW5kU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0NvbXBvdW5kU2VudGVuY2VcIjtcbmltcG9ydCBEZWNsYXJhdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvRGVjbGFyYXRpb25cIjtcbmltcG9ydCBRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvUXVlc3Rpb25cIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvU2ltcGxlU2VudGVuY2VcIjtcbmltcG9ydCBWZXJiU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1ZlcmJTZW50ZW5jZVwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4uL2FzdC9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgQ29tcGxleFNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvbXBsZXhTZW50ZW5jZVwiO1xuaW1wb3J0IENvbmp1bmN0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29uanVuY3RpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IENvcHVsYVF1ZXN0aW9uIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvcHVsYVF1ZXN0aW9uXCI7XG5pbXBvcnQgQ29wdWxhU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29wdWxhU2VudGVuY2VcIjtcbmltcG9ydCBJbnRyYW5zaXRpdmVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9JbnRyYW5zaXRpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IE1vbm90cmFuc2l0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvTW9ub3RyYW5zaXRpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BZGplY3RpdmVcIjtcbmltcG9ydCBBcnRpY2xlIGZyb20gXCIuLi9hc3QvdG9rZW5zL0FydGljbGVcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL2FzdC90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgSVZlcmIgZnJvbSBcIi4uL2FzdC90b2tlbnMvSVZlcmJcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9NVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL05lZ2F0aW9uXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vYXN0L3Rva2Vucy9Ob3VuXCI7XG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi9hc3QvdG9rZW5zL1F1YW50aWZpZXJcIjtcbmltcG9ydCBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uXCI7XG5pbXBvcnQgVGhlbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9UaGVuXCI7XG5pbXBvcnQgTGV4ZXIsIHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIjtcbmltcG9ydCBQYXJzZXIgZnJvbSBcIi4vUGFyc2VyXCI7XG5pbXBvcnQgQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2FzdC9waHJhc2VzL0NvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgUmVsYXRpdmVQcm9ub3VuIGZyb20gXCIuLi9hc3QvdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IENvbnN0aXR1ZW50IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IEZ1bGxTdG9wIGZyb20gXCIuLi9hc3QvdG9rZW5zL0Z1bGxTdG9wXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIHByb3RlY3RlZCBseDogTGV4ZXJcblxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZUNvZGU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmx4ID0gZ2V0TGV4ZXIoc291cmNlQ29kZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdHJ5PFQgZXh0ZW5kcyBBc3Q+KG1ldGhvZDogKCkgPT4gVCkge1xuXG4gICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmx4LnBvc1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kKClcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZGVidWcoKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKVxuICAgICAgICAgICAgdGhpcy5seC5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGVycm9yT3V0KGVycm9yTXNnOiBzdHJpbmcpOiBDb25zdGl0dWVudCB7XG4gICAgICAgIHRoaXMubHguY3JvYWsoZXJyb3JNc2cpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1zZylcbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpOiBDb25zdGl0dWVudFtdIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBDb25zdGl0dWVudFtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubHguaXNFbmQpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnBhcnNlKCkpXG4gICAgICAgICAgICB0aGlzLmx4LmFzc2VydChGdWxsU3RvcCwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG4gICAgcGFyc2UoKTogQ29uc3RpdHVlbnQge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZVF1ZXN0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZURlY2xhcmF0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZU5vdW5QaHJhc2UpIC8vIGZvciBxdWljayB0b3BpYyByZWZlcmVuY2VcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZURlY2xhcmF0aW9uID0gKCk6IERlY2xhcmF0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb21wb3VuZClcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VTaW1wbGUpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZURlY2xhcmF0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVF1ZXN0aW9uID0gKCk6IFF1ZXN0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VCaW5hcnlRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlUXVlc3Rpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlU2ltcGxlID0gKCk6IFNpbXBsZVNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VWZXJiU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVNpbXBsZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3VuZCA9ICgpOiBDb21wb3VuZFNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb21wbGV4KVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZUNvbmp1bmN0aXZlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VDb21wb3VuZCgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VWZXJiU2VudGVuY2UgPSAoKTogVmVyYlNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VWZXJiU2VudGVuY2UoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhU2VudGVuY2UgPSAoKTogQ29wdWxhU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVNlbnRlbmNlKCksIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3QgbmVnYXRpb24gPSB0aGlzLmx4LmFzc2VydChOZWdhdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVNlbnRlbmNlKHN1YmplY3QsIGNvcHVsYSBhcyBDb3B1bGEsIHByZWRpY2F0ZSwgbmVnYXRpb24pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcGxleCA9ICgpOiBDb21wbGV4U2VudGVuY2UgPT4ge1xuXG4gICAgICAgIGNvbnN0IHN1YmNvbmogPSB0aGlzLmx4LmFzc2VydChTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG5cbiAgICAgICAgaWYgKHN1YmNvbmopIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgdGhpcy5seC5hc3NlcnQoVGhlbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29tcGxleFNlbnRlbmNlKGNvbmRpdGlvbiwgb3V0Y29tZSwgc3ViY29uailcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIGNvbnN0IHN1YmNvbmogPSB0aGlzLmx4LmFzc2VydChTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sIHsgZXJyb3JPdXQ6IHRydWUsIGVycm9yTXNnOiAnZXhwZWN0ZWQgc3Vib3JkaW5hdGluZyBjb25qdW5jdGlvbicgfSlcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb21wbGV4U2VudGVuY2UoY29uZGl0aW9uLCBvdXRjb21lLCBzdWJjb25qIGFzIFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbilcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UgPSAoKTogSW50cmFuc2l0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBuZWdhdGlvbiA9IHRoaXMubHguYXNzZXJ0KE5lZ2F0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBpdmVyYiA9IHRoaXMubHguYXNzZXJ0KElWZXJiLCB7IGVycm9yTXNnOiAncGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSgpLCBleHBlY3RlZCBpLXZlcmInIH0pXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRyYW5zaXRpdmVTZW50ZW5jZShzdWJqZWN0LCBpdmVyYiBhcyBJVmVyYiwgY29tcGxlbWVudHMsIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UgPSAoKTogTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IG5lZ2F0aW9uID0gdGhpcy5seC5hc3NlcnQoTmVnYXRpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IG12ZXJiID0gdGhpcy5seC5hc3NlcnQoTVZlcmIsIHsgZXJyb3JNc2c6ICdwYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UoKSwgZXhwZWN0ZWQgaS12ZXJiJyB9KVxuICAgICAgICBjb25zdCBjczEgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKVxuICAgICAgICBjb25zdCBvYmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IGNzMiA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG4gICAgICAgIHJldHVybiBuZXcgTW9ub3RyYW5zaXRpdmVTZW50ZW5jZShzdWJqZWN0LCBtdmVyYiBhcyBNVmVyYiwgb2JqZWN0LCBjczEuY29uY2F0KGNzMiksIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUJpbmFyeVF1ZXN0aW9uID0gKCk6IEJpbmFyeVF1ZXN0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlQmluYXJ5UXVlc3Rpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhUXVlc3Rpb24gPSAoKTogQ29wdWxhUXVlc3Rpb24gPT4ge1xuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVF1ZXN0aW9uKCksIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVF1ZXN0aW9uKHN1YmplY3QsIHByZWRpY2F0ZSwgY29wdWxhIGFzIENvcHVsYSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VOb3VuUGhyYXNlID0gKCk6IE5vdW5QaHJhc2UgPT4ge1xuICAgICAgICBjb25zdCBxdWFudGlmaWVyID0gdGhpcy5seC5hc3NlcnQoUXVhbnRpZmllciwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgYXJ0aWNsZSA9IHRoaXMubHguYXNzZXJ0KEFydGljbGUsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG5cbiAgICAgICAgbGV0IGFkamVjdGl2ZXMgPSBbXVxuICAgICAgICBsZXQgYWRqXG5cbiAgICAgICAgd2hpbGUgKGFkaiA9IHRoaXMubHguYXNzZXJ0KEFkamVjdGl2ZSwgeyBlcnJvck91dDogZmFsc2UgfSkpIHtcbiAgICAgICAgICAgIGFkamVjdGl2ZXMucHVzaChhZGopXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3VuID0gdGhpcy5seC5hc3NlcnQoTm91biwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3Qgc3Vib3JkaW5hdGVDbGF1c2UgPSB0aGlzLnRyeSh0aGlzLnBhcnNlU3Vib3JkaW5hdGVDbGF1c2UpXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcblxuICAgICAgICByZXR1cm4gbmV3IE5vdW5QaHJhc2UoYWRqZWN0aXZlcywgY29tcGxlbWVudHMsIG5vdW4sIHF1YW50aWZpZXIsIGFydGljbGUsIHN1Ym9yZGluYXRlQ2xhdXNlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBsZW1lbnRzID0gKCk6IENvbXBsZW1lbnRbXSA9PiB7XG5cbiAgICAgICAgY29uc3QgY29tcGxlbWVudHMgPSBbXVxuICAgICAgICBsZXQgY29tcFxuXG4gICAgICAgIHdoaWxlIChjb21wID0gdGhpcy50cnkodGhpcy5wYXJzZUNvbXBsZW1lbnQpKSB7XG4gICAgICAgICAgICBjb21wbGVtZW50cy5wdXNoKGNvbXApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcGxlbWVudHNcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wbGVtZW50ID0gKCk6IENvbXBsZW1lbnQgPT4ge1xuICAgICAgICBjb25zdCBwcmVwb3NpdGlvbiA9IHRoaXMubHguYXNzZXJ0KFByZXBvc2l0aW9uLCB7IGVycm9yTXNnOiAncGFyc2VDb21wbGVtZW50KCkgZXhwZWN0ZWQgcHJlcG9zaXRpb24nIH0pXG4gICAgICAgIGNvbnN0IG5vdW5QaHJhc2UgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIHJldHVybiBuZXcgQ29tcGxlbWVudChwcmVwb3NpdGlvbiBhcyBQcmVwb3NpdGlvbiwgbm91blBocmFzZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VTdWJvcmRpbmF0ZUNsYXVzZSA9ICgpOiBTdWJvcmRpbmF0ZUNsYXVzZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVN1Ym9yZGluYXRlQ2xhdXNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlID0gKCk6IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlID0+IHtcbiAgICAgICAgY29uc3QgcmVscHJvbiA9IHRoaXMubHguYXNzZXJ0KFJlbGF0aXZlUHJvbm91biwgeyBlcnJvck1zZzogJ3BhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UoKSBleHBlY3RlZCByZWxhdGl2ZSBwcm9ub3VuJyB9KVxuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKCkgZXhwZWN0ZWQgY29wdWxhJyB9KVxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKHJlbHByb24gYXMgUmVsYXRpdmVQcm9ub3VuLCBzdWJqZWN0LCBjb3B1bGEgYXMgQ29wdWxhKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbmp1bmN0aXZlID0gKCk6IENvbmp1bmN0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05PVCBJTVBMRU1FTlRFRCEgVE9ETyEnKVxuICAgIH1cblxufSIsImltcG9ydCBDb25zdGl0dWVudCBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCBCYXNpY1BhcnNlciBmcm9tIFwiLi9CYXNpY1BhcnNlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgUGFyc2Vye1xuICAgIHBhcnNlKCk6Q29uc3RpdHVlbnQgICBcbiAgICBwYXJzZUFsbCgpOkNvbnN0aXR1ZW50W11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOnN0cmluZyk6UGFyc2Vye1xuICAgIHJldHVybiBuZXcgQmFzaWNQYXJzZXIoc291cmNlQ29kZSlcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hcHAvc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9