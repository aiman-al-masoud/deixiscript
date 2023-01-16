/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/src/Anaphora.ts":
/*!*****************************!*\
  !*** ./app/src/Anaphora.ts ***!
  \*****************************/
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
exports.getAnaphora = void 0;
const Enviro_1 = __importDefault(__webpack_require__(/*! ./enviro/Enviro */ "./app/src/enviro/Enviro.ts"));
function getAnaphora() {
    return new EnviroAnaphora();
}
exports.getAnaphora = getAnaphora;
class EnviroAnaphora {
    constructor(enviro = (0, Enviro_1.default)()) {
        this.enviro = enviro;
    }
    assert(clause) {
        return __awaiter(this, void 0, void 0, function* () {
            const clauses = clause
                .flatList()
                .map(c => c);
            for (const c of clauses) {
                if (c.args.length == 1) {
                    this.enviro.setPlaceholder(c.args[0]);
                    const x = yield this.enviro.get(c.args[0]);
                    // console.log(c.args[0], ' is a ', c.predicate)
                    x.set(c.predicate);
                }
            }
        });
    }
    query(clause) {
        return __awaiter(this, void 0, void 0, function* () {
            return [yield this.enviro.query(clause)];
        });
    }
}


/***/ }),

/***/ "./app/src/actuator/Actuator.ts":
/*!**************************************!*\
  !*** ./app/src/actuator/Actuator.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getActuator = void 0;
const BaseActuator_1 = __importDefault(__webpack_require__(/*! ./BaseActuator */ "./app/src/actuator/BaseActuator.ts"));
function getActuator() {
    return new BaseActuator_1.default();
}
exports.getActuator = getActuator;


/***/ }),

/***/ "./app/src/actuator/BaseActuator.ts":
/*!******************************************!*\
  !*** ./app/src/actuator/BaseActuator.ts ***!
  \******************************************/
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
const Id_1 = __webpack_require__(/*! ../clauses/Id */ "./app/src/clauses/Id.ts");
const Create_1 = __importDefault(__webpack_require__(/*! ./Create */ "./app/src/actuator/Create.ts"));
const Edit_1 = __importDefault(__webpack_require__(/*! ./Edit */ "./app/src/actuator/Edit.ts"));
class BaseActuator {
    takeAction(clause, enviro) {
        return __awaiter(this, void 0, void 0, function* () {
            const ownershipChain = clause.getOwnershipChain(clause.topLevel()[0]);
            //1 get the top-level object's ID from an Enviro, if none create it
            let id = (yield enviro.query(clause))[ownershipChain[0]];
            if (!id) {
                enviro.setPlaceholder(id = (0, Id_1.getRandomId)());
            }
            const props = // inner props of top level entity
             ownershipChain
                .slice(1)
                .map(e => clause.theme.describe(e)[0])
                .filter(x => x !== undefined);
            //2 determine kind of action (creator or non-creator)
            //3 distribute the id to every action (one action per predicate)
            const actions = clause
                .flatList()
                .map(c => c)
                .map(c => isCreatorAction(c.predicate) ? new Create_1.default(id, c.predicate) : new Edit_1.default(id, c.predicate, props));
            //4 creator actions create the object if it doesn't exist yet
            //5 non-creator actions WAIT if the object doesn't exist yet.
            for (const a of actions) {
                yield a.run(enviro); // TODO: make this async-safe
            }
        });
    }
}
exports["default"] = BaseActuator;
function isCreatorAction(predicate) {
    return predicate === 'button';
}


/***/ }),

/***/ "./app/src/actuator/Create.ts":
/*!************************************!*\
  !*** ./app/src/actuator/Create.ts ***!
  \************************************/
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
const Wrapper_1 = __webpack_require__(/*! ../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
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

/***/ "./app/src/actuator/Edit.ts":
/*!**********************************!*\
  !*** ./app/src/actuator/Edit.ts ***!
  \**********************************/
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
            const maybeId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)();
            const subjectId = this.isUniQuant() ? (0, Id_1.toVar)(maybeId) : maybeId;
            const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
            const res = this
                .adjectives
                .map(a => a.string)
                .concat(this.noun ? [this.noun.string] : [])
                .map(p => (0, Clause_1.clauseOf)(p, subjectId))
                .reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)())
                .and((yield Promise.all(this.complements.map(c => c.toClause(newArgs)))).reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)()))
                .and((_d = yield ((_c = this.subordClause) === null || _c === void 0 ? void 0 : _c.toClause(newArgs))) !== null && _d !== void 0 ? _d : (0, Clause_1.emptyClause)())
                .copy({ sideEffecty: false });
            const x = res.entities // assume ids are case insensitive, assume if IDX is var all idx are var
                .filter(x => (0, Id_1.isVar)(x))
                .map(e => ({ [(0, Id_1.toConst)(e)]: e }))
                .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
            return res.copy({ map: x });
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
const Clause_1 = __webpack_require__(/*! ../../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Id_1 = __webpack_require__(/*! ../../clauses/Id */ "./app/src/clauses/Id.ts");
const Anaphora_1 = __webpack_require__(/*! ../../Anaphora */ "./app/src/Anaphora.ts");
class CopulaSentence {
    constructor(subject, copula, predicate, negation) {
        this.subject = subject;
        this.copula = copula;
        this.predicate = predicate;
        this.negation = negation;
    }
    toClause(args) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: resolve them in noun phrases, maybe recycle code from Enviro but avoid too much coupling
            const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)({ asVar: this.subject.isUniQuant() });
            const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
            const subject = yield this.subject.toClause(newArgs);
            const newArgs2 = Object.assign(Object.assign({}, newArgs), { anaphora: ((_c = newArgs.anaphora) !== null && _c !== void 0 ? _c : (0, Clause_1.emptyClause)()).and(subject) });
            const predicate = (yield this.predicate.toClause(newArgs2)).copy({ negate: !!this.negation });
            const entities = subject.entities.concat(predicate.entities);
            const result = entities.some(e => (0, Id_1.isVar)(e)) ? // assume any sentence with any var is an implication
                subject.implies(predicate) :
                subject.and(predicate, { asRheme: true });
            const x = entities // assume anything owned by a variable is also a variable
                .filter(e => (0, Id_1.isVar)(e))
                .flatMap(e => subject.and(predicate).ownedBy(e))
                .map(e => ({ [e]: (0, Id_1.toVar)(e) }))
                .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
            const a = (0, Anaphora_1.getAnaphora)();
            yield a.assert(subject);
            const m = yield a.query(predicate);
            // console.log({m})
            return result.copy({ sideEffecty: true, map: x });
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
const Parser_1 = __webpack_require__(/*! ../parser/Parser */ "./app/src/parser/Parser.ts");
const Enviro_1 = __importDefault(__webpack_require__(/*! ../enviro/Enviro */ "./app/src/enviro/Enviro.ts"));
const Wrapper_1 = __webpack_require__(/*! ../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
const Actuator_1 = __webpack_require__(/*! ../actuator/Actuator */ "./app/src/actuator/Actuator.ts");
class BasicBrain {
    constructor(enviro = (0, Enviro_1.default)(), actuator = (0, Actuator_1.getActuator)()) {
        this.enviro = enviro;
        this.actuator = actuator;
        (0, Wrapper_1.wrap)(HTMLButtonElement.prototype).setAlias('color', ['style', 'background']);
        // wrap(HTMLButtonElement.prototype).setAlias('width', ['style', 'width'])
    }
    execute(natlang) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = [];
            for (const ast of (0, Parser_1.getParser)(natlang).parseAll()) {
                const clause = yield ast.toClause();
                // console.log(clause.toString(), 'side-effetcs:', clause.isSideEffecty)
                if (clause.isSideEffecty) {
                    yield this.actuator.takeAction(clause, this.enviro); // TODO: make this async-safe
                }
                else {
                    const ids = Object.values(yield this.enviro.query(clause))
                        .filter(e => e !== undefined)
                        .map(e => e);
                    const objects = yield Promise.all(ids.map(e => this.enviro.get(e)));
                    this.enviro.values.forEach(o => o.pointOut({ turnOff: true }));
                    objects.forEach(o => o.pointOut());
                    results = [...results, ...objects.map(o => o.object)];
                }
            }
            return results;
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
const getOwnershipChain_1 = __webpack_require__(/*! ./getOwnershipChain */ "./app/src/clauses/getOwnershipChain.ts");
const hashString_1 = __webpack_require__(/*! ./hashString */ "./app/src/clauses/hashString.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/clauses/Imply.ts"));
const topLevel_1 = __webpack_require__(/*! ./topLevel */ "./app/src/clauses/topLevel.ts");
class And {
    constructor(clauses, negated = false, noAnaphora = false, isSideEffecty = false, isImply = false, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments)), theme = clauses[0]) {
        this.clauses = clauses;
        this.negated = negated;
        this.noAnaphora = noAnaphora;
        this.isSideEffecty = isSideEffecty;
        this.isImply = isImply;
        this.hashCode = hashCode;
        this.theme = theme;
    }
    and(other, opts) {
        return (opts === null || opts === void 0 ? void 0 : opts.asRheme) ?
            new And([this, other]) :
            new And([...this.flatList(), ...other.flatList(), (0, Clause_1.emptyClause)()]);
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
    topLevel() {
        return (0, topLevel_1.topLevel)(this);
    }
    getOwnershipChain(entity) {
        return (0, getOwnershipChain_1.getOwnershipChain)(this, entity);
    }
    get rheme() {
        return this.clauses.slice(1).reduce((a, b) => a.and(b), (0, Clause_1.emptyClause)());
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
const hashString_1 = __webpack_require__(/*! ./hashString */ "./app/src/clauses/hashString.ts");
const Imply_1 = __importDefault(__webpack_require__(/*! ./Imply */ "./app/src/clauses/Imply.ts"));
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/clauses/And.ts"));
const topLevel_1 = __webpack_require__(/*! ./topLevel */ "./app/src/clauses/topLevel.ts");
const getOwnershipChain_1 = __webpack_require__(/*! ./getOwnershipChain */ "./app/src/clauses/getOwnershipChain.ts");
class BasicClause {
    constructor(predicate, args, negated = false, noAnaphora = false, isSideEffecty = false, isImply = false, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments)), rheme = (0, Clause_1.emptyClause)()) {
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
        // console.log( 'As rheme?', opts?.asRheme, 'I am the problem', 'theme will be:', this.toString(), 'rheme will be:',other.toString())
        if (opts === null || opts === void 0 ? void 0 : opts.asRheme) {
            return new And_1.default([this, ...other.flatList()]);
        }
        else {
            const a = new And_1.default([new And_1.default([this, other])]);
            // console.log('NO RHEME', a.theme.toString() === a.toString())
            return a;
        }
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
        // return Array.from(new Set(this.args.filter(a => !isVar(a)))) // variable ids are NOT entities
        return Array.from(new Set(this.args));
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
    topLevel() {
        return (0, topLevel_1.topLevel)(this);
    }
    getOwnershipChain(entity) {
        return (0, getOwnershipChain_1.getOwnershipChain)(this, entity);
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
exports.emptyClause = exports.clauseOf = void 0;
const BasicClause_1 = __webpack_require__(/*! ./BasicClause */ "./app/src/clauses/BasicClause.ts");
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/clauses/And.ts"));
function clauseOf(predicate, ...args) {
    return new BasicClause_1.BasicClause(predicate, args);
}
exports.clauseOf = clauseOf;
const emptyClause = () => new And_1.default([]);
exports.emptyClause = emptyClause;


/***/ }),

/***/ "./app/src/clauses/Id.ts":
/*!*******************************!*\
  !*** ./app/src/clauses/Id.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toConst = exports.isVar = exports.toVar = exports.getRandomId = void 0;
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
function toConst(id) {
    return (!Number.isNaN(Number(id)) ? `id${id}` : id + '').toLowerCase();
}
exports.toConst = toConst;


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
const hashString_1 = __webpack_require__(/*! ./hashString */ "./app/src/clauses/hashString.ts");
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/clauses/And.ts"));
const topLevel_1 = __webpack_require__(/*! ./topLevel */ "./app/src/clauses/topLevel.ts");
const getOwnershipChain_1 = __webpack_require__(/*! ./getOwnershipChain */ "./app/src/clauses/getOwnershipChain.ts");
class Imply {
    constructor(condition, conclusion, negated = false, noAnaphora = false, isSideEffecty = false, isImply = true, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments)), theme = condition.theme) {
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
    topLevel() {
        return (0, topLevel_1.topLevel)(this);
    }
    getOwnershipChain(entity) {
        return (0, getOwnershipChain_1.getOwnershipChain)(this, entity);
    }
}
exports["default"] = Imply;


/***/ }),

/***/ "./app/src/clauses/getOwnershipChain.ts":
/*!**********************************************!*\
  !*** ./app/src/clauses/getOwnershipChain.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOwnershipChain = void 0;
function getOwnershipChain(clause, entity) {
    const ownedEntities = clause.ownedBy(entity);
    return ownedEntities.length === 0 ?
        [entity] :
        [entity].concat(getOwnershipChain(clause, ownedEntities[0]));
}
exports.getOwnershipChain = getOwnershipChain;


/***/ }),

/***/ "./app/src/clauses/hashString.ts":
/*!***************************************!*\
  !*** ./app/src/clauses/hashString.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hashString = void 0;
function hashString(string) {
    return string.split('').map(c => c.charCodeAt(0)).reduce((hash, cc) => {
        const h1 = ((hash << 5) - hash) + cc;
        return h1 & h1; // Convert to 32bit integer
    });
}
exports.hashString = hashString;


/***/ }),

/***/ "./app/src/clauses/topLevel.ts":
/*!*************************************!*\
  !*** ./app/src/clauses/topLevel.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.topLevel = void 0;
function topLevel(clause) {
    return clause
        .entities
        .map(x => ({ x, owners: clause.ownersOf(x) }))
        .filter(x => x.owners.length === 0)
        .map(x => x.x);
}
exports.topLevel = topLevel;


/***/ }),

/***/ "./app/src/enviro/BaseEnviro.ts":
/*!**************************************!*\
  !*** ./app/src/enviro/BaseEnviro.ts ***!
  \**************************************/
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
const Placeholder_1 = __webpack_require__(/*! ./Placeholder */ "./app/src/enviro/Placeholder.ts");
class BaseEnviro {
    constructor(dictionary = {}) {
        this.dictionary = dictionary;
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dictionary[id]; //TODO: could be undefined!
        });
    }
    set(id, object) {
        const placeholder = this.dictionary[id];
        if (placeholder && placeholder instanceof Placeholder_1.Placeholder) {
            placeholder.predicates.forEach(p => {
                object.set(p);
            });
            this.dictionary[id] = object;
        }
    }
    query(clause) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO this is a tmp solution, for anaphora resolution, but just with descriptions, without taking (multi-entity) relationships into account
            const universe = Object
                .entries(this.dictionary)
                .map(x => ({ e: x[0], w: x[1] }));
            // console.log('clause.toString()', clause.toString())
            // console.log('clause.theme.toString()', clause.theme.toString())
            // console.log('clause.rheme.toString()', clause.rheme.toString())
            const query = clause
                .entities
                .map(e => ({ e, desc: clause.theme.describe(e) }));
            // console.log({query})
            const res = query
                .map(q => ({ from: q.e, to: universe.find(u => q.desc.every(d => u.w.is(d))) }))
                .filter(x => x.to !== undefined)
                .map(x => { var _a; return ({ [x.from]: (_a = x.to) === null || _a === void 0 ? void 0 : _a.e }); })
                .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
            return res;
        });
    }
    setPlaceholder(id) {
        this.dictionary[id] = new Placeholder_1.Placeholder();
    }
    exists(id) {
        return this.dictionary[id] && !(this.dictionary[id] instanceof Placeholder_1.Placeholder);
    }
    get values() {
        return Object.values(this.dictionary);
    }
}
exports["default"] = BaseEnviro;


/***/ }),

/***/ "./app/src/enviro/ConcreteWrapper.ts":
/*!*******************************************!*\
  !*** ./app/src/enviro/ConcreteWrapper.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const getConcepts_1 = __webpack_require__(/*! ./getConcepts */ "./app/src/enviro/getConcepts.ts");
class ConcreteWrapper {
    constructor(object, simpleConcepts) {
        var _a;
        if (simpleConcepts === void 0) { simpleConcepts = (_a = object.simpleConcepts) !== null && _a !== void 0 ? _a : {}; }
        this.object = object;
        this.simpleConcepts = simpleConcepts;
        object.simpleConcepts = simpleConcepts;
    }
    set(predicate, props) {
        this.object[predicate] = true; // TODO: remove
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
        return this.object[predicate] !== undefined; // TODO: remove
    }
    setAlias(conceptName, propPath) {
        this.simpleConcepts[conceptName] = propPath;
    }
    setNested(path, value) {
        let x = this.object[path[0]];
        path.slice(1, -2).forEach(p => {
            x = this.object[p];
        });
        x[path[path.length - 1]] = value;
    }
    pointOut(opts) {
        if (this.object instanceof HTMLElement) {
            this.object.style.outline = (opts === null || opts === void 0 ? void 0 : opts.turnOff) ? '' : '#f00 solid 2px';
        }
    }
}
exports["default"] = ConcreteWrapper;


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

/***/ "./app/src/enviro/Placeholder.ts":
/*!***************************************!*\
  !*** ./app/src/enviro/Placeholder.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Placeholder = void 0;
class Placeholder {
    constructor(predicates = [], object = {}) {
        this.predicates = predicates;
        this.object = object;
    }
    set(predicate, props) {
        this.predicates.push(predicate);
    }
    is(predicate, ...args) {
        return this.predicates.includes(predicate);
    }
    setAlias(conceptName, propOrSynonConcept) {
    }
    pointOut(opts) {
    }
}
exports.Placeholder = Placeholder;


/***/ }),

/***/ "./app/src/enviro/Wrapper.ts":
/*!***********************************!*\
  !*** ./app/src/enviro/Wrapper.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wrap = void 0;
const ConcreteWrapper_1 = __importDefault(__webpack_require__(/*! ./ConcreteWrapper */ "./app/src/enviro/ConcreteWrapper.ts"));
function wrap(o) {
    return new ConcreteWrapper_1.default(o);
}
exports.wrap = wrap;


/***/ }),

/***/ "./app/src/enviro/getConcepts.ts":
/*!***************************************!*\
  !*** ./app/src/enviro/getConcepts.ts ***!
  \***************************************/
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

/***/ "./app/src/index.ts":
/*!**************************!*\
  !*** ./app/src/index.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const autotester_1 = __importDefault(__webpack_require__(/*! ./tests/autotester */ "./app/src/tests/autotester.ts"));
(0, autotester_1.default)();
// main()
// toclausetests()


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


/***/ }),

/***/ "./app/src/tests/autotester.ts":
/*!*************************************!*\
  !*** ./app/src/tests/autotester.ts ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Brain_1 = __webpack_require__(/*! ../brain/Brain */ "./app/src/brain/Brain.ts");
const tests = [test1, test2, test3, test4];
/**
 * Integration tests
*/
function autotester() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const test of tests) {
            console.log((yield test()) ? 'success' : 'fail', test.name);
            yield wait(200);
            clearDom();
        }
    });
}
exports["default"] = autotester;
function test1() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('x is red. x is a button. y is a green button.');
        const assert1 = (yield brain.execute('a green button'))[0].style.background === 'green';
        const assert2 = (yield brain.execute('a red button'))[0].style.background === 'red';
        return assert1 && assert2;
    });
}
function test2() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('x is red. x is a button. x is a button. x is a button. x is red.');
        const assert1 = brain.enviro.values.length === 1;
        return assert1;
    });
}
function test3() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('y is a button. x is red. y is a green button. x is a button. z is a black button.');
        const assert1 = (yield brain.execute('a red button'))[0].style.background === 'red';
        const assert2 = (yield brain.execute('a green button'))[0].style.background === 'green';
        const assert3 = (yield brain.execute('a black button'))[0].style.background === 'black';
        return assert1 && assert2 && assert3;
    });
}
function test4() {
    return __awaiter(this, void 0, void 0, function* () {
        const brain = yield (0, Brain_1.getBrain)();
        yield brain.execute('a button is a button.');
        const button = yield brain.execute('button');
        return button !== undefined;
    });
}
function wait(millisecs) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((ok, err) => {
            setTimeout(() => ok(true), millisecs);
        });
    });
}
function clearDom() {
    document.body.innerHTML = '';
    document.body.style.background = 'white';
}


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UUFDakMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUMzQixVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQztRQUN6QyxDQUFDLENBQUM7SUFDTixDQUFDO0NBQUE7QUFFRCxTQUFTLFFBQVE7SUFDYixRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFO0lBQzVCLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxPQUFPO0FBQzVDLENBQUM7Ozs7Ozs7VUMxREQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvQW5hcGhvcmEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hY3R1YXRvci9BY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FjdHVhdG9yL0Jhc2VBY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FjdHVhdG9yL0NyZWF0ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FjdHVhdG9yL0VkaXQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvaW50ZXJmYWNlcy9Ub2tlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9waHJhc2VzL0NvbXBsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Db3B1bGFTdWJvcmRpbmF0ZUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9waHJhc2VzL05vdW5QaHJhc2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvbXBsZXhTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvQ29wdWxhUXVlc3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvcHVsYVNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9JbnRyYW5zaXRpdmVTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvTW9ub3RyYW5zaXRpdmVTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQWJzdHJhY3RUb2tlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQWRqZWN0aXZlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9BcnRpY2xlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9Db3B1bGEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0Z1bGxTdG9wLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9IVmVyYi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvSVZlcmIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL01WZXJiLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9OZWdhdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9Ob3VuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9QcmVwb3NpdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUXVhbnRpZmllci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUmVsYXRpdmVQcm9ub3VuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1RoZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9icmFpbi9CYXNpY0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYnJhaW4vQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvSWQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0ltcGx5LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9nZXRPd25lcnNoaXBDaGFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvaGFzaFN0cmluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvdG9wTGV2ZWwudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9lbnZpcm8vQmFzZUVudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2Vudmlyby9Db25jcmV0ZVdyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9lbnZpcm8vRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvZW52aXJvL1BsYWNlaG9sZGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvZW52aXJvL1dyYXBwZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9lbnZpcm8vZ2V0Q29uY2VwdHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL0VhZ2VyTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9sZXhlci9MZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9sZXhlci9MZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL2xleGVtZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9wYXJzZXIvQmFzaWNQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9wYXJzZXIvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvdGVzdHMvYXV0b3Rlc3Rlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vY2xhdXNlcy9CYXNpY0NsYXVzZVwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkLCBNYXAgfSBmcm9tIFwiLi9jbGF1c2VzL0lkXCJcbmltcG9ydCBnZXRFbnZpcm8gZnJvbSBcIi4vZW52aXJvL0Vudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFuYXBob3JhIHtcbiAgICBhc3NlcnQoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPHZvaWQ+XG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QW5hcGhvcmEoKSB7XG4gICAgcmV0dXJuIG5ldyBFbnZpcm9BbmFwaG9yYSgpXG59XG5cbmNsYXNzIEVudmlyb0FuYXBob3JhIGltcGxlbWVudHMgQW5hcGhvcmEge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGVudmlybyA9IGdldEVudmlybygpKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBhc3NlcnQoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgICAgICBjb25zdCBjbGF1c2VzID0gY2xhdXNlXG4gICAgICAgICAgICAuZmxhdExpc3QoKVxuICAgICAgICAgICAgLm1hcChjID0+IGMgYXMgQmFzaWNDbGF1c2UpXG5cbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGNsYXVzZXMpIHtcblxuICAgICAgICAgICAgaWYgKGMuYXJncy5sZW5ndGggPT0gMSkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5lbnZpcm8uc2V0UGxhY2Vob2xkZXIoYy5hcmdzWzBdKVxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBhd2FpdCB0aGlzLmVudmlyby5nZXQoYy5hcmdzWzBdKVxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGMuYXJnc1swXSwgJyBpcyBhICcsIGMucHJlZGljYXRlKVxuICAgICAgICAgICAgICAgIHguc2V0KGMucHJlZGljYXRlKVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgYXN5bmMgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPiB7XG4gICAgICAgIHJldHVybiBbYXdhaXQgdGhpcy5lbnZpcm8ucXVlcnkoY2xhdXNlKV1cbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEJhc2VBY3R1YXRvciBmcm9tIFwiLi9CYXNlQWN0dWF0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBY3R1YXRvciB7XG4gICAgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPHZvaWQ+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3R1YXRvcigpOiBBY3R1YXRvciB7XG4gICAgcmV0dXJuIG5ldyBCYXNlQWN0dWF0b3IoKVxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQmFzaWNDbGF1c2VcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQsIElkIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgeyBBY3R1YXRvciB9IGZyb20gXCIuL0FjdHVhdG9yXCI7XG5pbXBvcnQgQ3JlYXRlIGZyb20gXCIuL0NyZWF0ZVwiO1xuaW1wb3J0IEVkaXQgZnJvbSBcIi4vRWRpdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQWN0dWF0b3IgaW1wbGVtZW50cyBBY3R1YXRvciB7XG5cblxuICAgIGFzeW5jIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGVudmlybzogRW52aXJvKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICAgICAgY29uc3Qgb3duZXJzaGlwQ2hhaW4gPSBjbGF1c2UuZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlLnRvcExldmVsKClbMF0pXG5cbiAgICAgICAgLy8xIGdldCB0aGUgdG9wLWxldmVsIG9iamVjdCdzIElEIGZyb20gYW4gRW52aXJvLCBpZiBub25lIGNyZWF0ZSBpdFxuICAgICAgICBsZXQgaWQgPSAoYXdhaXQgZW52aXJvLnF1ZXJ5KGNsYXVzZSkpW293bmVyc2hpcENoYWluWzBdXVxuXG4gICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgIGVudmlyby5zZXRQbGFjZWhvbGRlcihpZCA9IGdldFJhbmRvbUlkKCkpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9wcyA9ICAvLyBpbm5lciBwcm9wcyBvZiB0b3AgbGV2ZWwgZW50aXR5XG4gICAgICAgICAgICBvd25lcnNoaXBDaGFpblxuICAgICAgICAgICAgICAgIC5zbGljZSgxKVxuICAgICAgICAgICAgICAgIC5tYXAoZSA9PiBjbGF1c2UudGhlbWUuZGVzY3JpYmUoZSlbMF0pXG4gICAgICAgICAgICAgICAgLmZpbHRlcih4ID0+IHggIT09IHVuZGVmaW5lZClcblxuICAgICAgICAvLzIgZGV0ZXJtaW5lIGtpbmQgb2YgYWN0aW9uIChjcmVhdG9yIG9yIG5vbi1jcmVhdG9yKVxuICAgICAgICAvLzMgZGlzdHJpYnV0ZSB0aGUgaWQgdG8gZXZlcnkgYWN0aW9uIChvbmUgYWN0aW9uIHBlciBwcmVkaWNhdGUpXG5cbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGNsYXVzZVxuICAgICAgICAgICAgLmZsYXRMaXN0KClcbiAgICAgICAgICAgIC5tYXAoYyA9PiAoYyBhcyBCYXNpY0NsYXVzZSkpXG4gICAgICAgICAgICAubWFwKGMgPT4gaXNDcmVhdG9yQWN0aW9uKGMucHJlZGljYXRlKSA/IG5ldyBDcmVhdGUoaWQgYXMgSWQsIGMucHJlZGljYXRlKSA6IG5ldyBFZGl0KGlkIGFzIElkLCBjLnByZWRpY2F0ZSwgcHJvcHMpKVxuXG4gICAgICAgIC8vNCBjcmVhdG9yIGFjdGlvbnMgY3JlYXRlIHRoZSBvYmplY3QgaWYgaXQgZG9lc24ndCBleGlzdCB5ZXRcbiAgICAgICAgLy81IG5vbi1jcmVhdG9yIGFjdGlvbnMgV0FJVCBpZiB0aGUgb2JqZWN0IGRvZXNuJ3QgZXhpc3QgeWV0LlxuXG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhY3Rpb25zKSB7XG4gICAgICAgICAgICBhd2FpdCBhLnJ1bihlbnZpcm8pIC8vIFRPRE86IG1ha2UgdGhpcyBhc3luYy1zYWZlXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gaXNDcmVhdG9yQWN0aW9uKHByZWRpY2F0ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHByZWRpY2F0ZSA9PT0gJ2J1dHRvbidcbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uL2Vudmlyby9XcmFwcGVyXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGlkOiBJZCwgcmVhZG9ubHkgcHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBydW4oZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPGFueT4ge1xuXG4gICAgICAgIGlmIChlbnZpcm8uZXhpc3RzKHRoaXMuaWQpKSB7IC8vICBleGlzdGVuY2UgY2hlY2sgcHJpb3IgdG8gY3JlYXRpbmdcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRG9tRWxlbSh0aGlzLnByZWRpY2F0ZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5wcmVkaWNhdGUpXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG8pXG4gICAgICAgICAgICBvLmlkID0gdGhpcy5pZCArICcnXG4gICAgICAgICAgICBvLnRleHRDb250ZW50ID0gJ2RlZmF1bHQnXG4gICAgICAgICAgICBjb25zdCBuZXdPYmogPSB3cmFwKG8pXG4gICAgICAgICAgICBuZXdPYmouc2V0KHRoaXMucHJlZGljYXRlKVxuICAgICAgICAgICAgZW52aXJvLnNldCh0aGlzLmlkLCBuZXdPYmopXG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGlzRG9tRWxlbShwcmVkaWNhdGU6IHN0cmluZykge1xuXG4gICAgcmV0dXJuIFsnYnV0dG9uJ10uaW5jbHVkZXMocHJlZGljYXRlKVxuXG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXQgaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IElkLCByZWFkb25seSBwcmVkaWNhdGU6IHN0cmluZywgcmVhZG9ubHkgcHJvcHM/OiBzdHJpbmdbXSkge1xuICAgICAgICBcbiAgICB9XG5cbiAgICBhc3luYyBydW4oZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBvYmogPSBhd2FpdCBlbnZpcm8uZ2V0KHRoaXMuaWQpXG4gICAgICAgIG9iai5zZXQodGhpcy5wcmVkaWNhdGUsIHRoaXMucHJvcHMpXG4gICAgfVxuXG5cbn0iLCJpbXBvcnQgeyBDb25zdHJ1Y3RvciB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlclwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vdG9rZW5zL0FkamVjdGl2ZVwiO1xuaW1wb3J0IEFydGljbGUgZnJvbSBcIi4uL3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgRnVsbFN0b3AgZnJvbSBcIi4uL3Rva2Vucy9GdWxsU3RvcFwiO1xuaW1wb3J0IEhWZXJiIGZyb20gXCIuLi90b2tlbnMvSFZlcmJcIjtcbmltcG9ydCBJVmVyYiBmcm9tIFwiLi4vdG9rZW5zL0lWZXJiXCI7XG5pbXBvcnQgTVZlcmIgZnJvbSBcIi4uL3Rva2Vucy9NVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcbmltcG9ydCBOb25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSBcIi4uL3Rva2Vucy9Ob25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25cIjtcbmltcG9ydCBOb3VuIGZyb20gXCIuLi90b2tlbnMvTm91blwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi90b2tlbnMvUXVhbnRpZmllclwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tIFwiLi4vdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuaW1wb3J0IFRoZW4gZnJvbSBcIi4uL3Rva2Vucy9UaGVuXCI7XG5pbXBvcnQgQXN0IGZyb20gXCIuL0FzdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgVG9rZW4gZXh0ZW5kcyBBc3Qge1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb2tlbkNvbnModHlwZTogVG9rZW5UeXBlKTogQ29uc3RydWN0b3I8VG9rZW4+IHtcbiAgICByZXR1cm4gY29uc3RydWN0b3JzW3R5cGVdXG59XG5cbmV4cG9ydCB0eXBlIFRva2VuVHlwZSA9XG4gICAgJ25vdW4nXG4gICAgfCAnaXZlcmInXG4gICAgfCAnbXZlcmInXG4gICAgfCAnaHZlcmInXG4gICAgfCAnY29wdWxhJ1xuICAgIHwgJ3RoZW4nXG4gICAgfCAnYWRqJ1xuICAgIHwgJ2V4aXN0cXVhbnQnXG4gICAgfCAndW5pcXVhbnQnXG4gICAgfCAncHJlcG9zaXRpb24nXG4gICAgfCAnc3ViY29uaidcbiAgICB8ICdyZWxwcm9uJ1xuICAgIHwgJ2RlZmFydCdcbiAgICB8ICdpbmRlZmFydCdcbiAgICB8ICdmdWxsc3RvcCdcbiAgICB8ICdub25zdWJjb25qJ1xuICAgIHwgJ25lZ2F0aW9uJ1xuICAgIHwgJ2NvbnRyYWN0aW9uJ1xuXG5jb25zdCBjb25zdHJ1Y3RvcnM6IHsgW3ggaW4gVG9rZW5UeXBlXTogQ29uc3RydWN0b3I8VG9rZW4+IH0gPSB7XG4gICAgJ25vdW4nOiBOb3VuLFxuICAgICdpdmVyYic6IElWZXJiLFxuICAgICdtdmVyYic6IE1WZXJiLFxuICAgICdodmVyYic6IEhWZXJiLFxuICAgICdjb3B1bGEnOiBDb3B1bGEsXG4gICAgJ3RoZW4nOiBUaGVuLFxuICAgICdhZGonOiBBZGplY3RpdmUsXG4gICAgJ2V4aXN0cXVhbnQnOiBRdWFudGlmaWVyLFxuICAgICd1bmlxdWFudCc6IFF1YW50aWZpZXIsXG4gICAgJ3ByZXBvc2l0aW9uJzogUHJlcG9zaXRpb24sXG4gICAgJ3N1YmNvbmonOiBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sXG4gICAgJ3JlbHByb24nOiBSZWxhdGl2ZVByb25vdW4sXG4gICAgJ2RlZmFydCc6IEFydGljbGUsXG4gICAgJ2luZGVmYXJ0JzogQXJ0aWNsZSxcbiAgICAnZnVsbHN0b3AnOiBGdWxsU3RvcCxcbiAgICAnbm9uc3ViY29uaic6IE5vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbixcbiAgICAnbmVnYXRpb24nOiBOZWdhdGlvbixcbiAgICAnY29udHJhY3Rpb24nOiBOZWdhdGlvbiAvL1RPRE86IGZpeCB0aGlzIGNyYXAgIFxufSIsImltcG9ydCB7IFRvQ2xhdXNlT3B0cyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRSYW5kb21JZCwgSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFBocmFzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9QaHJhc2VcIjtcbmltcG9ydCBQcmVwb3NpdGlvbiBmcm9tIFwiLi4vdG9rZW5zL1ByZXBvc2l0aW9uXCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi9Ob3VuUGhyYXNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBsZW1lbnQgaW1wbGVtZW50cyBQaHJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlcG9zaXRpb246IFByZXBvc2l0aW9uLCByZWFkb25seSBub3VuUGhyYXNlOiBOb3VuUGhyYXNlKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHsgLy8gcHJlcG9zaXRpb24oYXJncy5zdWJqZWN0LCBZKSArIG5vdW5waHJhc2UudG9Qcm9sb2coc3ViamVjdD1ZKVxuXG4gICAgICAgIGNvbnN0IHN1YmpJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/ICgoKTogSWQgPT4geyB0aHJvdyBuZXcgRXJyb3IoJ3VuZGVmaW5lZCBzdWJqZWN0IGlkJykgfSkoKVxuICAgICAgICBjb25zdCBuZXdJZCA9IGdldFJhbmRvbUlkKClcblxuICAgICAgICByZXR1cm4gY2xhdXNlT2YodGhpcy5wcmVwb3NpdGlvbi5zdHJpbmcsIHN1YmpJZCwgbmV3SWQpXG4gICAgICAgICAgICAuYW5kKGF3YWl0IHRoaXMubm91blBocmFzZS50b0NsYXVzZSh7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IG5ld0lkIH0gfSkpXG4gICAgICAgICAgICAuY29weSh7c2lkZUVmZmVjdHkgOiBmYWxzZX0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU3Vib3JkaW5hdGVDbGF1c2VcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBSZWxhdGl2ZVByb25vdW4gZnJvbSBcIi4uL3Rva2Vucy9SZWxhdGl2ZVByb25vdW5cIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuL05vdW5QaHJhc2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UgaW1wbGVtZW50cyBTdWJvcmRpbmF0ZUNsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSByZWxwcm9uOiBSZWxhdGl2ZVByb25vdW4sIHJlYWRvbmx5IHByZWRpY2F0ZTogTm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOiBDb3B1bGEpIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IHRoaXMucHJlZGljYXRlLnRvQ2xhdXNlKHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogYXJncz8ucm9sZXM/LnN1YmplY3QgfSB9KSlcbiAgICAgICAgLmNvcHkoe3NpZGVFZmZlY3R5IDogZmFsc2V9KVxuICAgIH1cblxufSIsImltcG9ydCBQaHJhc2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvUGhyYXNlXCI7XG5pbXBvcnQgQWRqZWN0aXZlIGZyb20gXCIuLi90b2tlbnMvQWRqZWN0aXZlXCI7XG5pbXBvcnQgQXJ0aWNsZSBmcm9tIFwiLi4vdG9rZW5zL0FydGljbGVcIjtcbmltcG9ydCBOb3VuIGZyb20gXCIuLi90b2tlbnMvTm91blwiO1xuaW1wb3J0IFF1YW50aWZpZXIgZnJvbSBcIi4uL3Rva2Vucy9RdWFudGlmaWVyXCI7XG5pbXBvcnQgQ29tcGxlbWVudCBmcm9tIFwiLi9Db21wbGVtZW50XCI7XG5pbXBvcnQgU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU3Vib3JkaW5hdGVDbGF1c2VcIjtcbmltcG9ydCB7IFRvQ2xhdXNlT3B0cyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQsIElkLCBpc1ZhciwgdG9WYXIsIHRvQ29uc3QgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3VuUGhyYXNlIGltcGxlbWVudHMgUGhyYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGFkamVjdGl2ZXM6IEFkamVjdGl2ZVtdLFxuICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICByZWFkb25seSBub3VuPzogTm91bixcbiAgICAgICAgcmVhZG9ubHkgcXVhbnRpZmllcj86IFF1YW50aWZpZXIsXG4gICAgICAgIHJlYWRvbmx5IGFydGljbGU/OiBBcnRpY2xlLFxuICAgICAgICByZWFkb25seSBzdWJvcmRDbGF1c2U/OiBTdWJvcmRpbmF0ZUNsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgaXNVbmlRdWFudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVhbnRpZmllcj8uaXNVbml2ZXJzYWwoKSA/PyBmYWxzZVxuICAgIH1cblxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4ge1xuXG4gICAgICAgIGNvbnN0IG1heWJlSWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IHRoaXMuaXNVbmlRdWFudCgpID8gdG9WYXIobWF5YmVJZCkgOiBtYXliZUlkXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICBjb25zdCByZXMgPSB0aGlzXG4gICAgICAgICAgICAuYWRqZWN0aXZlc1xuICAgICAgICAgICAgLm1hcChhID0+IGEuc3RyaW5nKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLm5vdW4gPyBbdGhpcy5ub3VuLnN0cmluZ10gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihwLCBzdWJqZWN0SWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmFuZCgoYXdhaXQgUHJvbWlzZS5hbGwodGhpcy5jb21wbGVtZW50cy5tYXAoYyA9PiBjLnRvQ2xhdXNlKG5ld0FyZ3MpKSkpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKSlcbiAgICAgICAgICAgIC5hbmQoYXdhaXQgdGhpcy5zdWJvcmRDbGF1c2U/LnRvQ2xhdXNlKG5ld0FyZ3MpID8/IGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG4gICAgICAgIGNvbnN0IHggPSByZXMuZW50aXRpZXMgLy8gYXNzdW1lIGlkcyBhcmUgY2FzZSBpbnNlbnNpdGl2ZSwgYXNzdW1lIGlmIElEWCBpcyB2YXIgYWxsIGlkeCBhcmUgdmFyXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gaXNWYXIoeCkpXG4gICAgICAgICAgICAubWFwKGUgPT4gKHsgW3RvQ29uc3QoZSldOiBlIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICAgICAgcmV0dXJuIHJlcy5jb3B5KHsgbWFwOiB4IH0pXG4gICAgfVxuXG59IiwiaW1wb3J0IENvbXBvdW5kU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29tcG91bmRTZW50ZW5jZVwiO1xuaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFNpbXBsZVNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1NpbXBsZVNlbnRlbmNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gXCIuLi90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uXCI7XG5cbi8qKlxuICogQSBzZW50ZW5jZSB0aGF0IHJlbGF0ZXMgdHdvIHNpbXBsZSBzZW50ZW5jZXMgaHlwb3RhY3RpY2FsbHksIGluIGEgXG4gKiBjb25kaXRpb24tb3V0Y29tZSByZWxhdGlvbnNoaXAuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBsZXhTZW50ZW5jZSBpbXBsZW1lbnRzIENvbXBvdW5kU2VudGVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY29uZGl0aW9uOiBTaW1wbGVTZW50ZW5jZSxcbiAgICAgICAgcmVhZG9ubHkgb3V0Y29tZTogU2ltcGxlU2VudGVuY2UsXG4gICAgICAgIHJlYWRvbmx5IHN1YmNvbmo6IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbikge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cbiAgICAgICAgY29uc3QgbmV3QXJnczEgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IGdldFJhbmRvbUlkKCkgfSB9XG5cbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gYXdhaXQgdGhpcy5jb25kaXRpb24udG9DbGF1c2UobmV3QXJnczEpXG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSBhd2FpdCB0aGlzLm91dGNvbWUudG9DbGF1c2UoeyAuLi5hcmdzLCBhbmFwaG9yYTogY29uZGl0aW9uIH0pXG4gICAgICAgIHJldHVybiBjb25kaXRpb24uaW1wbGllcyhvdXRjb21lKS5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUgfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgQmluYXJ5UXVlc3Rpb24gZnJvbSBcIi4uL2ludGVyZmFjZXMvQmluYXJ5UXVlc3Rpb25cIjtcbmltcG9ydCB7IFRvQ2xhdXNlT3B0cyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBDb3B1bGFTZW50ZW5jZSBmcm9tIFwiLi9Db3B1bGFTZW50ZW5jZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFRdWVzdGlvbiBpbXBsZW1lbnRzIEJpbmFyeVF1ZXN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsIHJlYWRvbmx5IHByZWRpY2F0ZTogTm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOiBDb3B1bGEpIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4ge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKHsgYXNWYXI6IHRoaXMuc3ViamVjdC5pc1VuaVF1YW50KCkgfSlcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIC8vVE9ETzogaW4gY2FzZSBvZiBhIHVuaXZlcnNhbGx5IHF1YW50aWZpZWQgcXVlc3Rpb24gZWc6IFwiYXJlIGFsbCBjYXRzIHNtYXJ0P1wiIHRoZSBwcm9sb2dcbiAgICAgICAgLy8gcHJvZHVjZWQgc2hvdWxkIE5PVCBiZSBhbiBpbXBsaWNhdGlvbiwgYnV0IHJhdGhlciBhIGNoZWNrIHRoYXQgYWxsIGNhdHMgYXJlIHNtYXJ0LlxuXG4gICAgICAgIGNvbnN0IGNsYXVzZSA9IGF3YWl0IG5ldyBDb3B1bGFTZW50ZW5jZSh0aGlzLnN1YmplY3QsIHRoaXMuY29wdWxhLCB0aGlzLnByZWRpY2F0ZSkudG9DbGF1c2UobmV3QXJncylcblxuICAgICAgICByZXR1cm4gY2xhdXNlLmNvcHkoe3NpZGVFZmZlY3R5IDogZmFsc2V9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkLCBpc1ZhciwgdG9WYXIgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFNpbXBsZVNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1NpbXBsZVNlbnRlbmNlXCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuaW1wb3J0IHsgZ2V0QW5hcGhvcmEgfSBmcm9tIFwiLi4vLi4vQW5hcGhvcmFcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhU2VudGVuY2UgaW1wbGVtZW50cyBTaW1wbGVTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBuZWdhdGlvbj86IE5lZ2F0aW9uKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcbiAgICAgICAgLy8gVE9ETzogcmVzb2x2ZSB0aGVtIGluIG5vdW4gcGhyYXNlcywgbWF5YmUgcmVjeWNsZSBjb2RlIGZyb20gRW52aXJvIGJ1dCBhdm9pZCB0b28gbXVjaCBjb3VwbGluZ1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKHsgYXNWYXI6IHRoaXMuc3ViamVjdC5pc1VuaVF1YW50KCkgfSlcblxuICAgICAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBhd2FpdCB0aGlzLnN1YmplY3QudG9DbGF1c2UobmV3QXJncylcbiAgICAgICAgY29uc3QgbmV3QXJnczIgPSB7Li4ubmV3QXJncywgYW5hcGhvcmE6IChuZXdBcmdzLmFuYXBob3JhPz9lbXB0eUNsYXVzZSgpKS5hbmQoc3ViamVjdCkgIH1cbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gKGF3YWl0IHRoaXMucHJlZGljYXRlLnRvQ2xhdXNlKG5ld0FyZ3MyKSkuY29weSh7IG5lZ2F0ZTogISF0aGlzLm5lZ2F0aW9uIH0pXG5cbiAgICAgICAgY29uc3QgZW50aXRpZXMgPSBzdWJqZWN0LmVudGl0aWVzLmNvbmNhdChwcmVkaWNhdGUuZW50aXRpZXMpXG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZW50aXRpZXMuc29tZShlID0+IGlzVmFyKGUpKSA/IC8vIGFzc3VtZSBhbnkgc2VudGVuY2Ugd2l0aCBhbnkgdmFyIGlzIGFuIGltcGxpY2F0aW9uXG4gICAgICAgICAgICBzdWJqZWN0LmltcGxpZXMocHJlZGljYXRlKSA6XG4gICAgICAgICAgICBzdWJqZWN0LmFuZChwcmVkaWNhdGUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuXG4gICAgICAgIGNvbnN0IHggPSBlbnRpdGllcyAvLyBhc3N1bWUgYW55dGhpbmcgb3duZWQgYnkgYSB2YXJpYWJsZSBpcyBhbHNvIGEgdmFyaWFibGVcbiAgICAgICAgICAgIC5maWx0ZXIoZSA9PiBpc1ZhcihlKSlcbiAgICAgICAgICAgIC5mbGF0TWFwKGUgPT4gc3ViamVjdC5hbmQocHJlZGljYXRlKS5vd25lZEJ5KGUpKVxuICAgICAgICAgICAgLm1hcChlID0+ICh7IFtlXTogdG9WYXIoZSkgfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuXG4gICAgICAgIGNvbnN0IGEgPSBnZXRBbmFwaG9yYSgpXG4gICAgICAgIGF3YWl0IGEuYXNzZXJ0KHN1YmplY3QpXG4gICAgICAgIGNvbnN0IG0gPSBhd2FpdCBhLnF1ZXJ5KHByZWRpY2F0ZSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coe219KVxuXG4gICAgICAgIHJldHVybiByZXN1bHQuY29weSh7IHNpZGVFZmZlY3R5OiB0cnVlLCBtYXA6IHggfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBJVmVyYiBmcm9tIFwiLi4vdG9rZW5zL0lWZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRyYW5zaXRpdmVTZW50ZW5jZSBpbXBsZW1lbnRzIFZlcmJTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLFxuICAgICAgICByZWFkb25seSBpdmVyYjogSVZlcmIsXG4gICAgICAgIHJlYWRvbmx5IGNvbXBsZW1lbnRzOiBDb21wbGVtZW50W10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cbiAgICBcbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCh7IGFzVmFyOiB0aGlzLnN1YmplY3QuaXNVbmlRdWFudCgpIH0pXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICBjb25zdCB0aGVtZSA9IGF3YWl0IHRoaXMuc3ViamVjdC50b0NsYXVzZShuZXdBcmdzKVxuICAgICAgICBcbiAgICAgICAgY29uc3QgcmhlbWUgPSBjbGF1c2VPZih0aGlzLml2ZXJiLnN0cmluZywgc3ViamVjdElkKS5hbmQoKGF3YWl0IFByb21pc2UuYWxsKHRoaXMuY29tcGxlbWVudHMubWFwKCBjID0+IGMudG9DbGF1c2UobmV3QXJncykpKSkucmVkdWNlKCAoYzEsIGMyKSA9PiBjMS5hbmQoYzIpKSlcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGVtZS5hbmQocmhlbWUsIHsgYXNSaGVtZTogdHJ1ZSB9KS5jb3B5KHtzaWRlRWZmZWN0eTp0cnVlfSlcbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vdG9rZW5zL01WZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlIGltcGxlbWVudHMgVmVyYlNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgbXZlcmI6IE1WZXJiLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG9iamVjdDogTm91blBocmFzZSxcbiAgICAgICAgICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cbiAgICBcbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBBYnN0cmFjdFRva2VuIGltcGxlbWVudHMgVG9rZW57XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdHJpbmc6c3RyaW5nKXtcblxuICAgIH0gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkamVjdGl2ZSBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IHsgZm9ybXNPZiB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvbGV4ZW1lc1wiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnRpY2xlIGV4dGVuZHMgQWJzdHJhY3RUb2tlbiB7XG5cbiAgICBpc0RlZmluaXRlKCkge1xuXG4gICAgICAgIHJldHVybiBsZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC50eXBlID09PSAnZGVmYXJ0JylcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4gZm9ybXNPZih4KSlcbiAgICAgICAgICAgIC5pbmNsdWRlcyh0aGlzLnN0cmluZylcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGBBcnRpY2xlKCR7dGhpcy5zdHJpbmd9LCBpc0RlZmluaXRlPSR7dGhpcy5pc0RlZmluaXRlKCl9KWBcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnVsbFN0b3AgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIVmVyYiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElWZXJiIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTVZlcmIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZWdhdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdW4gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVwb3NpdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgICAgXG59IiwiaW1wb3J0IHsgZm9ybXNPZiB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvbGV4ZW1lc1wiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWFudGlmaWVyIGV4dGVuZHMgQWJzdHJhY3RUb2tlbiB7XG5cbiAgICBpc1VuaXZlcnNhbCgpIHtcblxuICAgICAgICByZXR1cm4gbGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHgudHlwZSA9PT0gJ3VuaXF1YW50JylcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4gZm9ybXNPZih4KSlcbiAgICAgICAgICAgIC5pbmNsdWRlcyh0aGlzLnN0cmluZylcblxuICAgIH1cblxuICAgIGlzRXhpc3RlbnRpYWwoKSB7XG5cbiAgICAgICAgcmV0dXJuIGxleGVtZXNcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LnR5cGUgPT09ICdleGlzdHF1YW50JylcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4gZm9ybXNPZih4KSlcbiAgICAgICAgICAgIC5pbmNsdWRlcyh0aGlzLnN0cmluZylcblxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWxhdGl2ZVByb25vdW4gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaGVuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICAgXG59IiwiaW1wb3J0IHsgZ2V0UGFyc2VyIH0gZnJvbSBcIi4uL3BhcnNlci9QYXJzZXJcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuaW1wb3J0IGdldEVudmlybyBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIsIHsgd3JhcCB9IGZyb20gXCIuLi9lbnZpcm8vV3JhcHBlclwiO1xuaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0dWF0b3JcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZW52aXJvID0gZ2V0RW52aXJvKCksIHJlYWRvbmx5IGFjdHVhdG9yID0gZ2V0QWN0dWF0b3IoKSkge1xuXG4gICAgICAgIHdyYXAoSFRNTEJ1dHRvbkVsZW1lbnQucHJvdG90eXBlKS5zZXRBbGlhcygnY29sb3InLCBbJ3N0eWxlJywgJ2JhY2tncm91bmQnXSlcbiAgICAgICAgLy8gd3JhcChIVE1MQnV0dG9uRWxlbWVudC5wcm90b3R5cGUpLnNldEFsaWFzKCd3aWR0aCcsIFsnc3R5bGUnLCAnd2lkdGgnXSlcblxuICAgIH1cblxuICAgIGFzeW5jIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogUHJvbWlzZTxhbnlbXT4ge1xuXG4gICAgICAgIGxldCByZXN1bHRzOiBhbnlbXSA9IFtdXG5cbiAgICAgICAgZm9yIChjb25zdCBhc3Qgb2YgZ2V0UGFyc2VyKG5hdGxhbmcpLnBhcnNlQWxsKCkpIHtcblxuICAgICAgICAgICAgY29uc3QgY2xhdXNlID0gYXdhaXQgYXN0LnRvQ2xhdXNlKClcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNsYXVzZS50b1N0cmluZygpLCAnc2lkZS1lZmZldGNzOicsIGNsYXVzZS5pc1NpZGVFZmZlY3R5KVxuXG4gICAgICAgICAgICBpZiAoY2xhdXNlLmlzU2lkZUVmZmVjdHkpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFjdHVhdG9yLnRha2VBY3Rpb24oY2xhdXNlLCB0aGlzLmVudmlybykgLy8gVE9ETzogbWFrZSB0aGlzIGFzeW5jLXNhZmVcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpZHMgPSBPYmplY3QudmFsdWVzKGF3YWl0IHRoaXMuZW52aXJvLnF1ZXJ5KGNsYXVzZSkpXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZSA9PiBlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZSA9PiBlIGFzIElkKVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqZWN0cyA9IGF3YWl0IFByb21pc2UuYWxsKGlkcy5tYXAoZSA9PiB0aGlzLmVudmlyby5nZXQoZSkpKVxuICAgICAgICAgICAgICAgIHRoaXMuZW52aXJvLnZhbHVlcy5mb3JFYWNoKG8gPT4gby5wb2ludE91dCh7IHR1cm5PZmY6IHRydWUgfSkpXG4gICAgICAgICAgICAgICAgb2JqZWN0cy5mb3JFYWNoKG8gPT4gby5wb2ludE91dCgpKVxuICAgICAgICAgICAgICAgIHJlc3VsdHMgPSBbLi4ucmVzdWx0cywgLi4ub2JqZWN0cy5tYXAobyA9PiBvLm9iamVjdCldXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG59IiwiaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4vQmFzaWNCcmFpblwiXG5cbi8qKlxuICogVGhlIG1haW4gZmFjYWRlIGNvbnRyb2xsZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBQcm9taXNlPGFueVtdPlxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QnJhaW4oKTogUHJvbWlzZTxCcmFpbj4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbigpXG59XG4iLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9BY3Rpb25cIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4vaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgeyB0b3BMZXZlbCB9IGZyb20gXCIuL3RvcExldmVsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2VzOiBDbGF1c2VbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBub0FuYXBob3JhID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNJbXBseSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSksXG4gICAgICAgIHJlYWRvbmx5IHRoZW1lID0gY2xhdXNlc1swXSkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcblxuICAgICAgICByZXR1cm4gb3B0cz8uYXNSaGVtZSA/XG4gICAgICAgICAgICBuZXcgQW5kKFt0aGlzLCBvdGhlcl0pIDpcbiAgICAgICAgICAgIG5ldyBBbmQoWy4uLnRoaXMuZmxhdExpc3QoKSwgLi4ub3RoZXIuZmxhdExpc3QoKSwgZW1wdHlDbGF1c2UoKV0pXG5cbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEFuZCB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMuY2xhdXNlcy5tYXAoYyA9PiBjLmNvcHkoeyAuLi5vcHRzLCBuZWdhdGU6IGZhbHNlIH0pKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5ub0FuYXBob3JhID8/IHRoaXMubm9BbmFwaG9yYSxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBbdGhpc10gOiB0aGlzLmNsYXVzZXMuZmxhdE1hcChjID0+IGMuZmxhdExpc3QoKSlcbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQodGhpcy5jbGF1c2VzLmZsYXRNYXAoYyA9PiBjLmVudGl0aWVzKSkpXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcblxuICAgICAgICBpZiAodGhpcy5uZWdhdGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2UoKSAvLyBUT0RPISEhISEhISEhXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2VzLmZsYXRNYXAoYyA9PiBjLmFib3V0KGlkKSkucmVkdWNlKChjMSwgYzIpID0+IGMxLmFuZChjMiksIGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGFzeW5jIHRvQWN0aW9uKCk6IFByb21pc2U8QWN0aW9uPiB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5pbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSB0aGlzLmNsYXVzZXMubWFwKHggPT4geC50b1N0cmluZygpKS50b1N0cmluZygpXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlcy5mbGF0TWFwKHg9Pngub3duZWRCeShpZCkpXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZXMuZmxhdE1hcCh4PT54Lm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZXMuZmxhdE1hcCh4PT54LmRlc2NyaWJlKGlkKSlcbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRvcExldmVsKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcywgZW50aXR5KVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2VzLnNsaWNlKDEpLnJlZHVjZSgoYSxiKT0+YS5hbmQoYiksIGVtcHR5Q2xhdXNlKCkpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCwgaXNWYXIgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0aW9uXCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgeyB0b3BMZXZlbCB9IGZyb20gXCIuL3RvcExldmVsXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVkaWNhdGU6IHN0cmluZyxcbiAgICAgICAgcmVhZG9ubHkgYXJnczogSWRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBub0FuYXBob3JhID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNJbXBseSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSksXG4gICAgICAgIHJlYWRvbmx5IHJoZW1lID0gZW1wdHlDbGF1c2UoKSkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdBcyByaGVtZT8nLCBvcHRzPy5hc1JoZW1lLCAnSSBhbSB0aGUgcHJvYmxlbScsICd0aGVtZSB3aWxsIGJlOicsIHRoaXMudG9TdHJpbmcoKSwgJ3JoZW1lIHdpbGwgYmU6JyxvdGhlci50b1N0cmluZygpKVxuICAgICAgICBpZiAob3B0cz8uYXNSaGVtZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmQoW3RoaXMsIC4uLm90aGVyLmZsYXRMaXN0KCldKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgYSA9IG5ldyBBbmQoW25ldyBBbmQoW3RoaXMsIG90aGVyXSldKVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ05PIFJIRU1FJywgYS50aGVtZS50b1N0cmluZygpID09PSBhLnRvU3RyaW5nKCkpXG4gICAgICAgICAgICByZXR1cm4gYVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBCYXNpY0NsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UodGhpcy5wcmVkaWNhdGUsXG4gICAgICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwID8gb3B0cz8ubWFwW2FdID8/IGEgOiBhKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5ub0FuYXBob3JhID8/IHRoaXMubm9BbmFwaG9yYSxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgPyB0aGlzIDogZW1wdHlDbGF1c2UoKVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgLy8gcmV0dXJuIEFycmF5LmZyb20obmV3IFNldCh0aGlzLmFyZ3MuZmlsdGVyKGEgPT4gIWlzVmFyKGEpKSkpIC8vIHZhcmlhYmxlIGlkcyBhcmUgTk9UIGVudGl0aWVzXG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQodGhpcy5hcmdzKSlcbiAgICB9XG5cbiAgICBhc3luYyB0b0FjdGlvbigpOiBQcm9taXNlPEFjdGlvbj4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZSA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUgPT09ICdvZicgJiYgdGhpcy5hcmdzWzBdID09PSBpZCA/IFt0aGlzLmFyZ3NbMV1dIDogW11cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5wcmVkaWNhdGV9KCR7dGhpcy5hcmdzfSlgXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgJiYgdGhpcy5hcmdzLmxlbmd0aCA9PT0gMSA/IFt0aGlzLnByZWRpY2F0ZV0gOiBbXVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdG9wTGV2ZWwodGhpcylcbiAgICB9XG5cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBnZXRPd25lcnNoaXBDaGFpbih0aGlzLCBlbnRpdHkpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQmFzaWNDbGF1c2UgfSBmcm9tIFwiLi9CYXNpY0NsYXVzZVwiXG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiXG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4vSWRcIlxuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0aW9uXCJcblxuLyoqXG4gKiBBICdsYW5ndWFnZS1hZ25vc3RpYycgZmlyc3Qgb3JkZXIgbG9naWMgcmVwcmVzZW50YXRpb24uXG4qL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc0ltcGx5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgbm9BbmFwaG9yYTogYm9vbGVhblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZVxuICAgIHRvQWN0aW9uKCk6IFByb21pc2U8QWN0aW9uPlxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXVxuICAgIHRvcExldmVsKCk6IElkW11cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UocHJlZGljYXRlLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgZW1wdHlDbGF1c2UgPSAoKTogQ2xhdXNlID0+IG5ldyBBbmQoW10pXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG5lZ2F0ZT86IGJvb2xlYW5cbiAgICBtYXA/OiBNYXBcbiAgICBub0FuYXBob3JhPzogYm9vbGVhbiAvLyBpbnRlcnByZXQgZXZlcnkgaWQgYXMgZXhhY3RcbiAgICBzaWRlRWZmZWN0eT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufSIsIi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IG51bWJlciB8IHN0cmluZ1xuXG4vKipcbiAqIElkIHRvIElkIG1hcHBpbmcsIGZyb20gb25lIFwidW5pdmVyc2VcIiB0byBhbm90aGVyLlxuICovXG5leHBvcnQgdHlwZSBNYXAgPSB7IFthOiBJZF06IElkIH1cblxuXG5mdW5jdGlvbiogZ2V0SWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgeCsrXG4gICAgICAgIHlpZWxkIHhcbiAgICB9XG59XG5cbmNvbnN0IGlkR2VuZXJhdG9yID0gZ2V0SWRHZW5lcmF0b3IoKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tSWQob3B0cz86IEdldFJhbmRvbUlkT3B0cyk6IElkIHtcbiAgICBcbiAgICAvLyBjb25zdCBuZXdJZCA9IGBpZCR7cGFyc2VJbnQoMTAwMCAqIE1hdGgucmFuZG9tKCkgKyAnJyl9YFxuXG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gXG5cbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFJhbmRvbUlkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhcihlOiBJZCkge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oTnVtYmVyKGUpKSAmJiAoZS50b1N0cmluZygpWzBdID09PSBlLnRvU3RyaW5nKClbMF0udG9VcHBlckNhc2UoKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29uc3QoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvTG93ZXJDYXNlKClcbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9BY3Rpb25cIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCB7IHRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4vZ2V0T3duZXJzaGlwQ2hhaW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wbHkgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY29uZGl0aW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNvbmNsdXNpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBub0FuYXBob3JhID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNJbXBseSA9IHRydWUsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSxcbiAgICAgICAgcmVhZG9ubHkgdGhlbWUgPSBjb25kaXRpb24udGhlbWUpIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKFt0aGlzLCBvdGhlcl0pXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcy5jb25kaXRpb24uY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY29uY2x1c2lvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8ubmVnYXRlID8gIXRoaXMubmVnYXRlZCA6IHRoaXMubmVnYXRlZCxcbiAgICAgICAgICAgIG9wdHM/Lm5vQW5hcGhvcmEgPz8gdGhpcy5ub0FuYXBob3JhLFxuICAgICAgICAgICAgb3B0cz8uc2lkZUVmZmVjdHkgPz8gdGhpcy5pc1NpZGVFZmZlY3R5KVxuXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24uZW50aXRpZXMuY29uY2F0KHRoaXMuY29uY2x1c2lvbi5lbnRpdGllcylcbiAgICB9XG5cbiAgICBnZXQgcmhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMgLy8gZHVubm8gd2hhdCBJJ20gZG9pbidcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlKCkgLy8vVE9ETyEhISEhISEhXG4gICAgfVxuXG4gICAgYXN5bmMgdG9BY3Rpb24oKTogUHJvbWlzZTxBY3Rpb24+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMuY29uZGl0aW9uLnRvU3RyaW5nKCl9IC0tLT4gJHt0aGlzLmNvbmNsdXNpb24udG9TdHJpbmcoKX1gXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNvbmNsdXNpb24ub3duZWRCeShpZCkpXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5vd25lcnNPZihpZCkuY29uY2F0KHRoaXMuY29uY2x1c2lvbi5vd25lcnNPZihpZCkpXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25jbHVzaW9uLmRlc2NyaWJlKGlkKS5jb25jYXQodGhpcy5jb25kaXRpb24uZGVzY3JpYmUoaWQpKVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdG9wTGV2ZWwodGhpcylcbiAgICB9XG5cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBnZXRPd25lcnNoaXBDaGFpbih0aGlzLCBlbnRpdHkpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQpOiBJZFtdIHtcblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2M7XG4gICAgICAgIHJldHVybiBoMSAmIGgxOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuL0Vudmlyb1wiO1xuaW1wb3J0IHsgUGxhY2Vob2xkZXIgfSBmcm9tIFwiLi9QbGFjZWhvbGRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRW52aXJvIGltcGxlbWVudHMgRW52aXJvIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGRpY3Rpb25hcnk6IHsgW2lkOiBJZF06IFdyYXBwZXIgfSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBnZXQoaWQ6IElkKTogUHJvbWlzZTxXcmFwcGVyPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdIC8vVE9ETzogY291bGQgYmUgdW5kZWZpbmVkIVxuICAgIH1cblxuICAgIHNldChpZDogSWQsIG9iamVjdDogV3JhcHBlcik6IHZvaWQge1xuXG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuXG4gICAgICAgIGlmIChwbGFjZWhvbGRlciAmJiBwbGFjZWhvbGRlciBpbnN0YW5jZW9mIFBsYWNlaG9sZGVyKSB7XG5cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyLnByZWRpY2F0ZXMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICBvYmplY3Quc2V0KHApXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0aGlzLmRpY3Rpb25hcnlbaWRdID0gb2JqZWN0XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGFzeW5jIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogUHJvbWlzZTxNYXA+IHtcblxuICAgICAgICAvL1RPRE8gdGhpcyBpcyBhIHRtcCBzb2x1dGlvbiwgZm9yIGFuYXBob3JhIHJlc29sdXRpb24sIGJ1dCBqdXN0IHdpdGggZGVzY3JpcHRpb25zLCB3aXRob3V0IHRha2luZyAobXVsdGktZW50aXR5KSByZWxhdGlvbnNoaXBzIGludG8gYWNjb3VudFxuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlID0gT2JqZWN0XG4gICAgICAgICAgICAuZW50cmllcyh0aGlzLmRpY3Rpb25hcnkpXG4gICAgICAgICAgICAubWFwKHggPT4gKHsgZTogeFswXSwgdzogeFsxXSB9KSlcbiAgICBcblxuICAgICAgICAvLyBjb25zb2xlLmxvZygnY2xhdXNlLnRvU3RyaW5nKCknLCBjbGF1c2UudG9TdHJpbmcoKSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NsYXVzZS50aGVtZS50b1N0cmluZygpJywgY2xhdXNlLnRoZW1lLnRvU3RyaW5nKCkpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdjbGF1c2UucmhlbWUudG9TdHJpbmcoKScsIGNsYXVzZS5yaGVtZS50b1N0cmluZygpKVxuXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKGUgPT4gKHsgZSwgZGVzYzogY2xhdXNlLnRoZW1lLmRlc2NyaWJlKGUpIH0pKVxuICAgICAgICBcbiAgICAgICAgLy8gY29uc29sZS5sb2coe3F1ZXJ5fSlcblxuICAgICAgICBjb25zdCByZXMgPSBxdWVyeVxuICAgICAgICAgICAgLm1hcChxID0+ICh7IGZyb206IHEuZSwgdG86IHVuaXZlcnNlLmZpbmQodSA9PiBxLmRlc2MuZXZlcnkoZCA9PiB1LncuaXMoZCkpKSB9KSlcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LnRvICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAubWFwKHggPT4gKHsgW3guZnJvbV06IHgudG8/LmUgfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuXG4gICAgICAgIHJldHVybiByZXMgYXMgTWFwXG4gICAgfVxuXG4gICAgc2V0UGxhY2Vob2xkZXIoaWQ6IElkKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBuZXcgUGxhY2Vob2xkZXIoKVxuICAgIH1cblxuICAgIGV4aXN0cyhpZDogSWQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF0gJiYgISh0aGlzLmRpY3Rpb25hcnlbaWRdIGluc3RhbmNlb2YgUGxhY2Vob2xkZXIpXG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlcygpOiBXcmFwcGVyW10ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3Rpb25hcnkpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgZ2V0Q29uY2VwdHMgfSBmcm9tIFwiLi9nZXRDb25jZXB0c1wiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25jcmV0ZVdyYXBwZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG9iamVjdDogYW55LFxuICAgICAgICByZWFkb25seSBzaW1wbGVDb25jZXB0czogeyBbY29uY2VwdE5hbWU6IHN0cmluZ106IHN0cmluZ1tdIH0gPSBvYmplY3Quc2ltcGxlQ29uY2VwdHMgPz8ge30pIHtcblxuICAgICAgICBvYmplY3Quc2ltcGxlQ29uY2VwdHMgPSBzaW1wbGVDb25jZXB0c1xuICAgIH1cblxuICAgIHNldChwcmVkaWNhdGU6IHN0cmluZywgcHJvcHM/OiBzdHJpbmdbXSk6IHZvaWQge1xuXG4gICAgICAgICh0aGlzLm9iamVjdCBhcyBhbnkpW3ByZWRpY2F0ZV0gPSB0cnVlIC8vIFRPRE86IHJlbW92ZVxuXG4gICAgICAgIGlmIChwcm9wcyAmJiBwcm9wcy5sZW5ndGggPiAxKSB7IC8vIHNldCB0aGUgcGVkaWNhdGUgb24gdGhlIHBhdGhcbiAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHByb3BzLCBwcmVkaWNhdGUpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vMSBpZiBsZW4ocHJvcHMpID09IDEgdXNlIGl0IGFzIGEgY29uY2VwdFxuICAgICAgICBpZiAocHJvcHMgJiYgcHJvcHMubGVuZ3RoID09PSAxKSB7XG5cbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnNpbXBsZUNvbmNlcHRzKS5pbmNsdWRlcyhwcm9wc1swXSkpIHsgLy8gaXMgY29uY2VwdFxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHRoaXMuc2ltcGxlQ29uY2VwdHNbcHJvcHNbMF1dLCBwcmVkaWNhdGUpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmVzdGVkKHByb3BzLCBwcmVkaWNhdGUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8yIGlmIGxlbihwcm9wcykgPT0gMCBnZXQgdGhlIGNvbmNlcHQgZnJvbSB0aGUgcHJlZGljYXRlIChlZzogcmVkIGlzIGEgJ2NvbG9yJylcbiAgICAgICAgY29uc3QgY29uY2VwdHMgPSBnZXRDb25jZXB0cyhwcmVkaWNhdGUpXG5cbiAgICAgICAgaWYgKGNvbmNlcHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldE5lc3RlZCh0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHRzWzBdXSwgcHJlZGljYXRlKVxuXG4gICAgfVxuXG4gICAgaXMocHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IFdyYXBwZXJbXSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKHRoaXMub2JqZWN0IGFzIGFueSlbcHJlZGljYXRlXSAhPT0gdW5kZWZpbmVkIC8vIFRPRE86IHJlbW92ZVxuICAgIH1cblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBzdHJpbmcsIHByb3BQYXRoOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHROYW1lXSA9IHByb3BQYXRoXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHNldE5lc3RlZChwYXRoOiBzdHJpbmdbXSwgdmFsdWU6IHN0cmluZykge1xuXG4gICAgICAgIGxldCB4ID0gdGhpcy5vYmplY3RbcGF0aFswXV1cblxuICAgICAgICBwYXRoLnNsaWNlKDEsIC0yKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgeCA9IHRoaXMub2JqZWN0W3BdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHhbcGF0aFtwYXRoLmxlbmd0aCAtIDFdXSA9IHZhbHVlXG5cbiAgICB9XG5cbiAgICBwb2ludE91dChvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuOyB9KTogdm9pZCB7XG5cbiAgICAgICAgaWYgKHRoaXMub2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LnN0eWxlLm91dGxpbmUgPSBvcHRzPy50dXJuT2ZmID8gJycgOiAnI2YwMCBzb2xpZCAycHgnXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCI7XG5pbXBvcnQgQmFzZUVudmlybyBmcm9tIFwiLi9CYXNlRW52aXJvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvIHtcbiAgICBnZXQoaWQ6IElkKTogUHJvbWlzZTxXcmFwcGVyPlxuICAgIHNldChpZDogSWQsIG9iamVjdDogV3JhcHBlcik6IHZvaWRcbiAgICBzZXRQbGFjZWhvbGRlcihpZDogSWQpOiB2b2lkXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcD4gLy9UT0RPOiByZXR1cm4gYSBsaXN0IG9mIG1hcHMsIE1hcFtdLCB3aGVuIG11dGxpcGxlIGVsZW1lbnRzIG1hdGNoIHF1ZXJ5IVxuICAgIGV4aXN0cyhpZDogSWQpOiBib29sZWFuXG4gICAgZ2V0IHZhbHVlcygpOiBXcmFwcGVyW11cbiAgICAvLyBnZXQga2V5cygpOiBJZFtdXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEVudmlybygpOiBFbnZpcm8ge1xuICAgIHJldHVybiBuZXcgQmFzZUVudmlybygpXG59IiwiaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuXG5leHBvcnQgY2xhc3MgUGxhY2Vob2xkZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHByZWRpY2F0ZXM6IHN0cmluZ1tdID0gW10sIHJlYWRvbmx5IG9iamVjdDogYW55ID0ge30pIHtcbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBzdHJpbmcsIHByb3BzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnByZWRpY2F0ZXMucHVzaChwcmVkaWNhdGUpO1xuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogc3RyaW5nLCAuLi5hcmdzOiBXcmFwcGVyW10pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlcy5pbmNsdWRlcyhwcmVkaWNhdGUpO1xuICAgIH1cblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBzdHJpbmcsIHByb3BPclN5bm9uQ29uY2VwdDogc3RyaW5nIHwgc3RyaW5nW10pOiB2b2lkIHtcbiAgICB9XG5cbiAgICBwb2ludE91dChvcHRzOiB7IHR1cm5PZmY6IGJvb2xlYW47IH0pOiB2b2lkIHtcblxuICAgIH1cbn1cbiIsImltcG9ydCBDb25jcmV0ZVdyYXBwZXIgZnJvbSBcIi4vQ29uY3JldGVXcmFwcGVyXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFdyYXBwZXIge1xuXG4gICAgc2V0KHByZWRpY2F0ZTogc3RyaW5nLCBwcm9wcz86IHN0cmluZ1tdKTogdm9pZCAvLyBvYmouc2V0KCdyZWQnKSwgb2JqLnNldCgnb24nLCBvYmoyKSAuLi5cbiAgICBpcyhwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogYm9vbGVhblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBzdHJpbmcsIHByb3BQYXRoOiBzdHJpbmdbXSk6IHZvaWRcbiAgICByZWFkb25seSBvYmplY3Q6IGFueVxuICAgIHBvaW50T3V0KG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW4gfSk6IHZvaWRcbiAgICAvLyBnZXQocHJlZGljYXRlOiBzdHJpbmcpOiBhbnlcbiAgICAvLyBnZXRQcm9wKHBhdGg6IHN0cmluZ1tdKTogYW55XG4gICAgLy8gc2V0UHJvcChwYXRoOiBzdHJpbmdbXSwgdmFsdWU6IGFueSk6IHZvaWRcbiAgICAvLyBkZXNjcmliZSgpOiBzdHJpbmdbXSAvLyBbJ2J1dHRvbicsICdyZWQnLCAnYmlnJywgLi4uXVxuICAgIC8vIHNldEFsaWFzKG5hbWU6IHN0cmluZywgcGF0aDogc3RyaW5nW10pOiB2b2lkIC8vIC5zZXRBbGlhcygnd2lkdGgnLCBbJ3N0eWxlJywgJ3dpZHRoJ10pXG4gICAgLy8gYWRkQ29uY2VwdChjb25jZXB0OnN0cmluZywgc2V0dGVyOigpPT52b2lkLCBpczooKT0+KTp2b2lkXG4gICAgLy8gZG9Tb21ldGhpbmcoY2xhdXNlOkNsYXVzZSk6YW55IC8vIGdldCBvd25lcnNoaXAgY2hhaW4gYW5kIGRvIHNvbWV0aGluZyB3aXRoIHRoZSBjbGF1c2UsIGNsYXVzZSBoYXMgZXZlcnl0aGluZywgaXQgaGFzIGluZm8gb24gc2lkZS1lZmZlY3RzLCBwcmVkaWNhdGUgZXRjLi4uPz8/XG5cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcChvOiBhbnkpIHtcbiAgICByZXR1cm4gbmV3IENvbmNyZXRlV3JhcHBlcihvKVxufSIsImV4cG9ydCBjb25zdCBzZXR0ZXJQcmVmaXggPSAnc2V0J1xuZXhwb3J0IGNvbnN0IGlzUHJlZml4ID0gJ2lzJ1xuZXhwb3J0IGNvbnN0IGdldHRlclByZWZpeCA9ICdnZXQnXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25jZXB0cyhvYmplY3Q6IGFueSk6IHN0cmluZ1tdIHtcblxuICAgIC8vIFRPRE86IHRyeSBnZXR0aW5nIGEgY29uY2VwdCBmcm9tIGEgc3RyaW5nIG9iamVjdCB3aXRoIGEgXG4gICAgLy8gc3BlY2lhbCBkaWN0aW9uYXJ5LCBsaWtlIHtyZWQ6Y29sb3IsIGdyZWVuOmNvbG9yLCBibHVlOmNvbG9yfVxuICAgIGNvbnN0IHN0cmluZ0NvbmNlcHRzOiB7IFt4OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICAgJ2dyZWVuJzogJ2NvbG9yJyxcbiAgICAgICAgJ3JlZCc6ICdjb2xvcicsXG4gICAgICAgICdibHVlJzogJ2NvbG9yJyxcbiAgICAgICAgJ2JsYWNrJzogJ2NvbG9yJyxcbiAgICAgICAgJ2JpZyc6ICdzaXplJ1xuICAgIH1cbiAgICBjb25zdCBtYXliZUNvbmNlcHQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHN0cmluZ0NvbmNlcHRzW29iamVjdC50b1N0cmluZygpXVxuXG4gICAgaWYgKG1heWJlQ29uY2VwdCkge1xuICAgICAgICByZXR1cm4gW21heWJlQ29uY2VwdF1cbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0XG4gICAgICAgIC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdClcbiAgICAgICAgLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QuX19wcm90b19fKSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHguaW5jbHVkZXMoc2V0dGVyUHJlZml4KSB8fCB4LmluY2x1ZGVzKGlzUHJlZml4KSlcbiAgICAgICAgLm1hcCh4ID0+IGdldENvbmNlcHROYW1lKHgpKVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0ZXJOYW1lKGNvbmNlcHQ6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtzZXR0ZXJQcmVmaXh9XyR7Y29uY2VwdH1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJc05hbWUoY29uY2VwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke2lzUHJlZml4fV8ke2NvbmNlcHR9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2V0dGVyTmFtZShjb25jZXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7Z2V0dGVyUHJlZml4fV8ke2NvbmNlcHR9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uY2VwdE5hbWUobWV0aG9kOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbWV0aG9kXG4gICAgICAgIC5yZXBsYWNlKGlzUHJlZml4LCAnJylcbiAgICAgICAgLnJlcGxhY2Uoc2V0dGVyUHJlZml4LCAnJylcbiAgICAgICAgLnJlcGxhY2UoZ2V0dGVyUHJlZml4LCAnJylcbiAgICAgICAgLnJlcGxhY2UoJ18nLCAnJylcbn1cbiIsImltcG9ydCBtYWluIGZyb20gXCIuL21haW4vbWFpblwiO1xuaW1wb3J0IGF1dG90ZXN0ZXIgZnJvbSBcIi4vdGVzdHMvYXV0b3Rlc3RlclwiO1xuaW1wb3J0IHsgdG9jbGF1c2V0ZXN0cyB9IGZyb20gXCIuL3Rlc3RzL3RvY2xhdXNldGVzdHNcIjtcblxuXG5hdXRvdGVzdGVyKClcbi8vIG1haW4oKVxuLy8gdG9jbGF1c2V0ZXN0cygpIiwiaW1wb3J0IFRva2VuLCB7IGdldFRva2VuQ29ucyB9IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IHsgZ2V0TGV4ZW1lcyB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IExleGVyLCB7IEFzc2VydEFyZ3MsIENvbnN0cnVjdG9yIH0gZnJvbSBcIi4vTGV4ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSB0b2tlbnM6IFRva2VuW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcpIHtcblxuICAgICAgICB0aGlzLnRva2VucyA9IHNvdXJjZUNvZGVcbiAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgLm1hcChlID0+ICFlID8gJy4nIDogZSlcbiAgICAgICAgICAgIC5mbGF0TWFwKHN0cmluZyA9PiBnZXRMZXhlbWVzKHN0cmluZylcbiAgICAgICAgICAgICAgICAubWFwKGwgPT4gbmV3IChnZXRUb2tlbkNvbnMobC50eXBlKSkobC5uYW1lKSkpXG5cbiAgICAgICAgY29uc29sZS5kZWJ1ZygndG9rZW5zJywgdGhpcy50b2tlbnMpXG4gICAgICAgIHRoaXMuX3BvcyA9IDBcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBUb2tlbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBjdXJyZW50IHRva2VuIGlmZiBvZiBnaXZlbiB0eXBlIGFuZCBtb3ZlIHRvIG5leHQ7IFxuICAgICAqIGVsc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgZG9uJ3QgbW92ZS5cbiAgICAgKiBAcGFyYW0gYXJncyBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBhc3NlcnQ8VD4oY2xheno6IENvbnN0cnVjdG9yPFQ+LCBhcmdzOiBBc3NlcnRBcmdzKTogVCB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMucGVla1xuXG4gICAgICAgIGlmIChjdXJyZW50IGluc3RhbmNlb2YgY2xhenopIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MuZXJyb3JPdXQgPz8gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcm9hayhhcmdzLmVycm9yTXNnID8/ICcnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIlxuaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZSB7XG4gICAgLyoqdXN1YWxseSByb290IGZvcm0qLyByZWFkb25seSBuYW1lOiBzdHJpbmdcbiAgICAvKip0b2tlbiB0eXBlKi8gcmVhZG9ubHkgdHlwZTogVG9rZW5UeXBlXG4gICAgLyoqdXNlZnVsIGZvciBpcnJlZ3VsYXIgc3R1ZmYqLyByZWFkb25seSBmb3Jtcz86IHN0cmluZ1tdXG4gICAgLyoqcmVmZXJzIHRvIHZlcmIgY29uanVnYXRpb25zIG9yIHBsdXJhbCBmb3JtcyovIHJlYWRvbmx5IHJlZ3VsYXI/OiBib29sZWFuXG4gICAgLyoqc2VtYW50aWNhbCBkZXBlbmRlY2UqLyByZWFkb25seSBkZXJpdmVkRnJvbT86IHN0cmluZ1xuICAgIC8qKnNlbWFudGljYWwgZXF1aXZhbGVuY2UqLyByZWFkb25seSBhbGlhc0Zvcj86IHN0cmluZ1xuICAgIC8qKm1hZGUgdXAgb2YgbW9yZSBsZXhlbWVzKi8gcmVhZG9ubHkgY29udHJhY3Rpb25Gb3I/OiBzdHJpbmdbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybXNPZihsZXhlbWU6IExleGVtZSkge1xuXG4gICAgcmV0dXJuIFtsZXhlbWUubmFtZV0uY29uY2F0KGxleGVtZT8uZm9ybXMgPz8gW10pXG4gICAgICAgIC5jb25jYXQobGV4ZW1lLnJlZ3VsYXIgPyBbYCR7bGV4ZW1lLm5hbWV9c2BdIDogW10pXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVtZXMod29yZDogc3RyaW5nKTogTGV4ZW1lW10ge1xuXG4gICAgY29uc3QgbGV4ZW1lID0gbGV4ZW1lcy5maWx0ZXIoeCA9PiBmb3Jtc09mKHgpLmluY2x1ZGVzKHdvcmQpKVswXVxuICAgICAgICA/PyB7IG5hbWU6IHdvcmQsIHR5cGU6ICdhZGonIH1cblxuICAgIHJldHVybiBsZXhlbWUuY29udHJhY3Rpb25Gb3IgP1xuICAgICAgICBsZXhlbWUuY29udHJhY3Rpb25Gb3IuZmxhdE1hcCh4ID0+IGdldExleGVtZXMoeCkpIDpcbiAgICAgICAgW2xleGVtZV1cblxufSIsImltcG9ydCBUb2tlbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlcntcbiAgICBnZXQgcGVlaygpOlRva2VuXG4gICAgZ2V0IHBvcygpOm51bWJlclxuICAgIGdldCBpc0VuZCgpOmJvb2xlYW5cbiAgICBuZXh0KCk6dm9pZFxuICAgIGJhY2tUbyhwb3M6bnVtYmVyKTp2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6c3RyaW5nKTp2b2lkICAgXG4gICAgYXNzZXJ0IDxUPihjbGF6ejpDb25zdHJ1Y3RvcjxUPiwgYXJnczpBc3NlcnRBcmdzKTogVHx1bmRlZmluZWQgXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXJ0QXJnc3tcbiAgICBlcnJvck1zZz86c3RyaW5nXG4gICAgZXJyb3JPdXQ/OmJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6c3RyaW5nKTpMZXhlcntcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSlcbn1cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcblxuXG5leHBvcnQgY29uc3QgbGV4ZW1lczogTGV4ZW1lW10gPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnaGF2ZScsXG4gICAgICAgIHR5cGU6ICdtdmVyYicsXG4gICAgICAgIGZvcm1zOiBbJ2hhdmUnLCAnaGFzJ10sXG4gICAgICAgIHJlZ3VsYXI6IGZhbHNlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2J1dHRvbicsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgcmVndWxhciA6IHRydWVcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnY2xpY2snLFxuICAgICAgICB0eXBlOiAnbXZlcmInLFxuICAgICAgICBmb3JtczogWydjbGljayddLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2NsaWNrZWQnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgZGVyaXZlZEZyb206ICdjbGljaydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAncHJlc3NlZCcsXG4gICAgICAgIHR5cGU6ICdhZGonLFxuICAgICAgICBhbGlhc0ZvcjogJ2NsaWNrZWQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2NhdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdiZScsXG4gICAgICAgIHR5cGU6ICdjb3B1bGEnLFxuICAgICAgICBmb3JtczogWydpcycsICdhcmUnXSxcbiAgICAgICAgcmVndWxhcjogZmFsc2VcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiBcImlzbid0XCIsXG4gICAgICAgIHR5cGU6ICdjb250cmFjdGlvbicsXG4gICAgICAgIGNvbnRyYWN0aW9uRm9yOiBbJ2lzJywgJ25vdCddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogXCJyZWRcIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6IFwiZ3JlZW5cIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6IFwiZXhpc3RcIixcbiAgICAgICAgdHlwZTogXCJpdmVyYlwiLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2RvJyxcbiAgICAgICAgdHlwZTogJ2h2ZXJiJyxcbiAgICAgICAgcmVndWxhcjogZmFsc2UsXG4gICAgICAgIGZvcm1zOiBbJ2RvJywgJ2RvZXMnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdzb21lJyxcbiAgICAgICAgdHlwZTogJ2V4aXN0cXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2V2ZXJ5JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhbGwnLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2FueScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAndG8nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3dpdGgnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2Zyb20nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ29mJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdvdmVyJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdvbicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYXQnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3RoZW4nLFxuICAgICAgICB0eXBlOiAndGhlbicgLy8gZmlsbGVyIHdvcmRcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnaWYnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnd2hlbicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdiZWNhdXNlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3doaWxlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3RoYXQnLFxuICAgICAgICB0eXBlOiAncmVscHJvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnbm90JyxcbiAgICAgICAgdHlwZTogJ25lZ2F0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICd0aGUnLFxuICAgICAgICB0eXBlOiAnZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhbicsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYW5kJyxcbiAgICAgICAgdHlwZTogJ25vbnN1YmNvbmonXG4gICAgfVxuXSIsImltcG9ydCBBc3QgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0FzdFwiO1xuaW1wb3J0IEJpbmFyeVF1ZXN0aW9uIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9CaW5hcnlRdWVzdGlvblwiO1xuaW1wb3J0IENvbXBvdW5kU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0NvbXBvdW5kU2VudGVuY2VcIjtcbmltcG9ydCBEZWNsYXJhdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvRGVjbGFyYXRpb25cIjtcbmltcG9ydCBRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvUXVlc3Rpb25cIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvU2ltcGxlU2VudGVuY2VcIjtcbmltcG9ydCBWZXJiU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1ZlcmJTZW50ZW5jZVwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4uL2FzdC9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgQ29tcGxleFNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvbXBsZXhTZW50ZW5jZVwiO1xuaW1wb3J0IENvbmp1bmN0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29uanVuY3RpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IENvcHVsYVF1ZXN0aW9uIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvcHVsYVF1ZXN0aW9uXCI7XG5pbXBvcnQgQ29wdWxhU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29wdWxhU2VudGVuY2VcIjtcbmltcG9ydCBJbnRyYW5zaXRpdmVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9JbnRyYW5zaXRpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IE1vbm90cmFuc2l0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvTW9ub3RyYW5zaXRpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BZGplY3RpdmVcIjtcbmltcG9ydCBBcnRpY2xlIGZyb20gXCIuLi9hc3QvdG9rZW5zL0FydGljbGVcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL2FzdC90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgSVZlcmIgZnJvbSBcIi4uL2FzdC90b2tlbnMvSVZlcmJcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9NVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL05lZ2F0aW9uXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vYXN0L3Rva2Vucy9Ob3VuXCI7XG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi9hc3QvdG9rZW5zL1F1YW50aWZpZXJcIjtcbmltcG9ydCBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uXCI7XG5pbXBvcnQgVGhlbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9UaGVuXCI7XG5pbXBvcnQgTGV4ZXIsIHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIjtcbmltcG9ydCBQYXJzZXIgZnJvbSBcIi4vUGFyc2VyXCI7XG5pbXBvcnQgQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2FzdC9waHJhc2VzL0NvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgUmVsYXRpdmVQcm9ub3VuIGZyb20gXCIuLi9hc3QvdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IENvbnN0aXR1ZW50IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IEZ1bGxTdG9wIGZyb20gXCIuLi9hc3QvdG9rZW5zL0Z1bGxTdG9wXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIHByb3RlY3RlZCBseDogTGV4ZXJcblxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZUNvZGU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmx4ID0gZ2V0TGV4ZXIoc291cmNlQ29kZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdHJ5PFQgZXh0ZW5kcyBBc3Q+KG1ldGhvZDogKCkgPT4gVCkge1xuXG4gICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmx4LnBvc1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kKClcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZGVidWcoKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKVxuICAgICAgICAgICAgdGhpcy5seC5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGVycm9yT3V0KGVycm9yTXNnOiBzdHJpbmcpOiBDb25zdGl0dWVudCB7XG4gICAgICAgIHRoaXMubHguY3JvYWsoZXJyb3JNc2cpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1zZylcbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpOiBDb25zdGl0dWVudFtdIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBDb25zdGl0dWVudFtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubHguaXNFbmQpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnBhcnNlKCkpXG4gICAgICAgICAgICB0aGlzLmx4LmFzc2VydChGdWxsU3RvcCwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG4gICAgcGFyc2UoKTogQ29uc3RpdHVlbnQge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZVF1ZXN0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZURlY2xhcmF0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZU5vdW5QaHJhc2UpIC8vIGZvciBxdWljayB0b3BpYyByZWZlcmVuY2VcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZURlY2xhcmF0aW9uID0gKCk6IERlY2xhcmF0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb21wb3VuZClcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VTaW1wbGUpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZURlY2xhcmF0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVF1ZXN0aW9uID0gKCk6IFF1ZXN0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VCaW5hcnlRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlUXVlc3Rpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlU2ltcGxlID0gKCk6IFNpbXBsZVNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VWZXJiU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVNpbXBsZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3VuZCA9ICgpOiBDb21wb3VuZFNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb21wbGV4KVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZUNvbmp1bmN0aXZlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VDb21wb3VuZCgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VWZXJiU2VudGVuY2UgPSAoKTogVmVyYlNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VWZXJiU2VudGVuY2UoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhU2VudGVuY2UgPSAoKTogQ29wdWxhU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVNlbnRlbmNlKCksIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3QgbmVnYXRpb24gPSB0aGlzLmx4LmFzc2VydChOZWdhdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVNlbnRlbmNlKHN1YmplY3QsIGNvcHVsYSBhcyBDb3B1bGEsIHByZWRpY2F0ZSwgbmVnYXRpb24pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcGxleCA9ICgpOiBDb21wbGV4U2VudGVuY2UgPT4ge1xuXG4gICAgICAgIGNvbnN0IHN1YmNvbmogPSB0aGlzLmx4LmFzc2VydChTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG5cbiAgICAgICAgaWYgKHN1YmNvbmopIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgdGhpcy5seC5hc3NlcnQoVGhlbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29tcGxleFNlbnRlbmNlKGNvbmRpdGlvbiwgb3V0Y29tZSwgc3ViY29uailcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIGNvbnN0IHN1YmNvbmogPSB0aGlzLmx4LmFzc2VydChTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sIHsgZXJyb3JPdXQ6IHRydWUsIGVycm9yTXNnOiAnZXhwZWN0ZWQgc3Vib3JkaW5hdGluZyBjb25qdW5jdGlvbicgfSlcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb21wbGV4U2VudGVuY2UoY29uZGl0aW9uLCBvdXRjb21lLCBzdWJjb25qIGFzIFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbilcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UgPSAoKTogSW50cmFuc2l0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBuZWdhdGlvbiA9IHRoaXMubHguYXNzZXJ0KE5lZ2F0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBpdmVyYiA9IHRoaXMubHguYXNzZXJ0KElWZXJiLCB7IGVycm9yTXNnOiAncGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSgpLCBleHBlY3RlZCBpLXZlcmInIH0pXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRyYW5zaXRpdmVTZW50ZW5jZShzdWJqZWN0LCBpdmVyYiBhcyBJVmVyYiwgY29tcGxlbWVudHMsIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UgPSAoKTogTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IG5lZ2F0aW9uID0gdGhpcy5seC5hc3NlcnQoTmVnYXRpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IG12ZXJiID0gdGhpcy5seC5hc3NlcnQoTVZlcmIsIHsgZXJyb3JNc2c6ICdwYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UoKSwgZXhwZWN0ZWQgaS12ZXJiJyB9KVxuICAgICAgICBjb25zdCBjczEgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKVxuICAgICAgICBjb25zdCBvYmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IGNzMiA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG4gICAgICAgIHJldHVybiBuZXcgTW9ub3RyYW5zaXRpdmVTZW50ZW5jZShzdWJqZWN0LCBtdmVyYiBhcyBNVmVyYiwgb2JqZWN0LCBjczEuY29uY2F0KGNzMiksIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUJpbmFyeVF1ZXN0aW9uID0gKCk6IEJpbmFyeVF1ZXN0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlQmluYXJ5UXVlc3Rpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhUXVlc3Rpb24gPSAoKTogQ29wdWxhUXVlc3Rpb24gPT4ge1xuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVF1ZXN0aW9uKCksIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVF1ZXN0aW9uKHN1YmplY3QsIHByZWRpY2F0ZSwgY29wdWxhIGFzIENvcHVsYSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VOb3VuUGhyYXNlID0gKCk6IE5vdW5QaHJhc2UgPT4ge1xuICAgICAgICBjb25zdCBxdWFudGlmaWVyID0gdGhpcy5seC5hc3NlcnQoUXVhbnRpZmllciwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgYXJ0aWNsZSA9IHRoaXMubHguYXNzZXJ0KEFydGljbGUsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG5cbiAgICAgICAgbGV0IGFkamVjdGl2ZXMgPSBbXVxuICAgICAgICBsZXQgYWRqXG5cbiAgICAgICAgd2hpbGUgKGFkaiA9IHRoaXMubHguYXNzZXJ0KEFkamVjdGl2ZSwgeyBlcnJvck91dDogZmFsc2UgfSkpIHtcbiAgICAgICAgICAgIGFkamVjdGl2ZXMucHVzaChhZGopXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3VuID0gdGhpcy5seC5hc3NlcnQoTm91biwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3Qgc3Vib3JkaW5hdGVDbGF1c2UgPSB0aGlzLnRyeSh0aGlzLnBhcnNlU3Vib3JkaW5hdGVDbGF1c2UpXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcblxuICAgICAgICByZXR1cm4gbmV3IE5vdW5QaHJhc2UoYWRqZWN0aXZlcywgY29tcGxlbWVudHMsIG5vdW4sIHF1YW50aWZpZXIsIGFydGljbGUsIHN1Ym9yZGluYXRlQ2xhdXNlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBsZW1lbnRzID0gKCk6IENvbXBsZW1lbnRbXSA9PiB7XG5cbiAgICAgICAgY29uc3QgY29tcGxlbWVudHMgPSBbXVxuICAgICAgICBsZXQgY29tcFxuXG4gICAgICAgIHdoaWxlIChjb21wID0gdGhpcy50cnkodGhpcy5wYXJzZUNvbXBsZW1lbnQpKSB7XG4gICAgICAgICAgICBjb21wbGVtZW50cy5wdXNoKGNvbXApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcGxlbWVudHNcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wbGVtZW50ID0gKCk6IENvbXBsZW1lbnQgPT4ge1xuICAgICAgICBjb25zdCBwcmVwb3NpdGlvbiA9IHRoaXMubHguYXNzZXJ0KFByZXBvc2l0aW9uLCB7IGVycm9yTXNnOiAncGFyc2VDb21wbGVtZW50KCkgZXhwZWN0ZWQgcHJlcG9zaXRpb24nIH0pXG4gICAgICAgIGNvbnN0IG5vdW5QaHJhc2UgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIHJldHVybiBuZXcgQ29tcGxlbWVudChwcmVwb3NpdGlvbiBhcyBQcmVwb3NpdGlvbiwgbm91blBocmFzZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VTdWJvcmRpbmF0ZUNsYXVzZSA9ICgpOiBTdWJvcmRpbmF0ZUNsYXVzZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVN1Ym9yZGluYXRlQ2xhdXNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlID0gKCk6IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlID0+IHtcbiAgICAgICAgY29uc3QgcmVscHJvbiA9IHRoaXMubHguYXNzZXJ0KFJlbGF0aXZlUHJvbm91biwgeyBlcnJvck1zZzogJ3BhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UoKSBleHBlY3RlZCByZWxhdGl2ZSBwcm9ub3VuJyB9KVxuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKCkgZXhwZWN0ZWQgY29wdWxhJyB9KVxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKHJlbHByb24gYXMgUmVsYXRpdmVQcm9ub3VuLCBzdWJqZWN0LCBjb3B1bGEgYXMgQ29wdWxhKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbmp1bmN0aXZlID0gKCk6IENvbmp1bmN0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05PVCBJTVBMRU1FTlRFRCEgVE9ETyEnKVxuICAgIH1cblxufSIsImltcG9ydCBDb25zdGl0dWVudCBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCBCYXNpY1BhcnNlciBmcm9tIFwiLi9CYXNpY1BhcnNlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgUGFyc2Vye1xuICAgIHBhcnNlKCk6Q29uc3RpdHVlbnQgICBcbiAgICBwYXJzZUFsbCgpOkNvbnN0aXR1ZW50W11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOnN0cmluZyk6UGFyc2Vye1xuICAgIHJldHVybiBuZXcgQmFzaWNQYXJzZXIoc291cmNlQ29kZSlcbn0iLCJpbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi4vYnJhaW4vQmFzaWNCcmFpblwiO1xuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vYnJhaW4vQnJhaW5cIjtcblxuY29uc3QgdGVzdHMgPSBbdGVzdDEsIHRlc3QyLCB0ZXN0MywgdGVzdDRdXG5cbi8qKlxuICogSW50ZWdyYXRpb24gdGVzdHNcbiovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhdXRvdGVzdGVyKCkge1xuXG4gICAgZm9yIChjb25zdCB0ZXN0IG9mIHRlc3RzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGF3YWl0IHRlc3QoKSA/ICdzdWNjZXNzJyA6ICdmYWlsJywgdGVzdC5uYW1lKVxuICAgICAgICBhd2FpdCB3YWl0KDIwMClcbiAgICAgICAgY2xlYXJEb20oKVxuICAgIH1cblxufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0MSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgZ3JlZW4gYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQyID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdDIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBhd2FpdCBnZXRCcmFpbigpXG4gICAgYXdhaXQgYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQuIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4gYXMgQmFzaWNCcmFpbikuZW52aXJvLnZhbHVlcy5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0MygpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCd5IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geiBpcyBhIGJsYWNrIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDIgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIGNvbnN0IGFzc2VydDMgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYSBibGFjayBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0NCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCdhIGJ1dHRvbiBpcyBhIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBidXR0b24gPSBhd2FpdCBicmFpbi5leGVjdXRlKCdidXR0b24nKVxuICAgIHJldHVybiBidXR0b24gIT09IHVuZGVmaW5lZFxufVxuXG5hc3luYyBmdW5jdGlvbiB3YWl0KG1pbGxpc2VjczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChvaywgZXJyKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb2sodHJ1ZSksIG1pbGxpc2VjcylcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBjbGVhckRvbSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICcnXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJ3doaXRlJ1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2FwcC9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=