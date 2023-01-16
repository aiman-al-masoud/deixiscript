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
            return this.enviro.query(clause);
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            //1 get the top-level object's ID from an Enviro, if none create it
            const map = (_a = (yield enviro.query(clause))[0]) !== null && _a !== void 0 ? _a : {};
            const ownershipChain = clause.getOwnershipChain(clause.topLevel()[0]);
            let id = map[ownershipChain[0]];
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
            return res;
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
            const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)({ asVar: this.subject.isUniQuant() });
            const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
            const subject = yield this.subject.toClause(newArgs);
            const predicate = (yield this.predicate.toClause(newArgs)).copy({ negate: !!this.negation });
            const entities = subject.entities.concat(predicate.entities);
            const result = entities // assume any sentence with any var is an implication
                .some(e => (0, Id_1.isVar)(e)) ?
                subject.implies(predicate) :
                subject.and(predicate, { asRheme: true });
            const m0 = result.entities // assume ids are case insensitive, assume if IDX is var all idx are var
                .filter(x => (0, Id_1.isVar)(x))
                .map(e => ({ [(0, Id_1.toConst)(e)]: e }))
                .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
            const a = (0, Anaphora_1.getAnaphora)(); // get anaphora
            yield a.assert(subject);
            const m1 = (_c = (yield a.query(predicate))[0]) !== null && _c !== void 0 ? _c : {};
            // console.log({m1})
            const result2 = result.copy({ map: m0 }).copy({ sideEffecty: true, map: m1 });
            const m2 = result2.entities // assume anything owned by a variable is also a variable
                .filter(e => (0, Id_1.isVar)(e))
                .flatMap(e => result2.ownedBy(e))
                .map(e => ({ [e]: (0, Id_1.toVar)(e) }))
                .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
            return result2.copy({ map: m2 });
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let results = [];
            for (const ast of (0, Parser_1.getParser)(natlang).parseAll()) {
                const clause = yield ast.toClause();
                // console.log(clause.toString(), 'side-effetcs:', clause.isSideEffecty)
                if (clause.isSideEffecty) {
                    yield this.actuator.takeAction(clause, this.enviro); // TODO: make this async-safe
                }
                else {
                    const ids = Object.values((_a = (yield this.enviro.query(clause))[0]) !== null && _a !== void 0 ? _a : {})
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
    constructor(clause1, clause2, clause2IsRheme, negated = false, noAnaphora = false, isSideEffecty = false, isImply = false, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments))) {
        this.clause1 = clause1;
        this.clause2 = clause2;
        this.clause2IsRheme = clause2IsRheme;
        this.negated = negated;
        this.noAnaphora = noAnaphora;
        this.isSideEffecty = isSideEffecty;
        this.isImply = isImply;
        this.hashCode = hashCode;
    }
    and(other, opts) {
        var _a;
        return new And(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b;
        return new And(this.clause1.copy({ map: opts === null || opts === void 0 ? void 0 : opts.map }), this.clause2.copy({ map: opts === null || opts === void 0 ? void 0 : opts.map }), this.clause2IsRheme, (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.noAnaphora) !== null && _a !== void 0 ? _a : this.noAnaphora, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
    }
    flatList() {
        return this.negated ? [this] :
            [...this.clause1.flatList(), ...this.clause2.flatList()];
    }
    get entities() {
        return Array.from(new Set(this.clause1.entities.concat(this.clause2.entities)));
    }
    implies(conclusion) {
        return new Imply_1.default(this, conclusion);
    }
    about(id) {
        return this.clause1.about(id).and(this.clause2.about(id));
    }
    toAction() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('unimplemented!');
        });
    }
    toString() {
        const yes = this.clause1.toString() + ',' + this.clause2.toString();
        return this.negated ? `not(${yes})` : yes;
    }
    ownedBy(id) {
        return this.clause1.ownedBy(id).concat(this.clause2.ownedBy(id));
    }
    ownersOf(id) {
        return this.clause1.ownersOf(id).concat(this.clause2.ownersOf(id));
    }
    describe(id) {
        return this.clause1.describe(id).concat(this.clause2.describe(id));
    }
    topLevel() {
        return (0, topLevel_1.topLevel)(this);
    }
    getOwnershipChain(entity) {
        return (0, getOwnershipChain_1.getOwnershipChain)(this, entity);
    }
    get theme() {
        return this.clause2IsRheme ? this.clause1 : this;
    }
    get rheme() {
        return this.clause2IsRheme ? this.clause2 : (0, Clause_1.emptyClause)();
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
        var _a;
        return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.emptyClause = exports.clauseOf = void 0;
const BasicClause_1 = __webpack_require__(/*! ./BasicClause */ "./app/src/clauses/BasicClause.ts");
const EmptyClause_1 = __webpack_require__(/*! ./EmptyClause */ "./app/src/clauses/EmptyClause.ts");
function clauseOf(predicate, ...args) {
    return new BasicClause_1.BasicClause(predicate, args);
}
exports.clauseOf = clauseOf;
// export const emptyClause = (): Clause => new And([])
const emptyClause = () => new EmptyClause_1.EmptyClause();
exports.emptyClause = emptyClause;


/***/ }),

/***/ "./app/src/clauses/EmptyClause.ts":
/*!****************************************!*\
  !*** ./app/src/clauses/EmptyClause.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmptyClause = void 0;
class EmptyClause {
    constructor(negated = false, isImply = false, hashCode = 99999999, entities = [], isSideEffecty = false, noAnaphora = false) {
        this.negated = negated;
        this.isImply = isImply;
        this.hashCode = hashCode;
        this.entities = entities;
        this.isSideEffecty = isSideEffecty;
        this.noAnaphora = noAnaphora;
    }
    copy(opts) {
        return this;
    }
    get theme() {
        return this;
    }
    get rheme() {
        return this;
    }
    and(other, opts) {
        return other;
    }
    implies(conclusion) {
        return conclusion;
    }
    flatList() {
        return [];
    }
    about(id) {
        return this;
    }
    toAction() {
        throw new Error("Method not implemented.");
    }
    ownedBy(id) {
        return [];
    }
    ownersOf(id) {
        return [];
    }
    describe(id) {
        return [];
    }
    topLevel() {
        return [];
    }
    getOwnershipChain(entity) {
        return [];
    }
    toString() {
        // return '(empty clause)'
        return '';
    }
}
exports.EmptyClause = EmptyClause;


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
        var _a;
        // return new And([this, other])
        return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
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
            const universe = Object
                .entries(this.dictionary)
                .map(x => ({ e: x[0], w: x[1] }));
            const query = clause // described entities
                .entities
                .map(e => ({ e, desc: clause.theme.describe(e) }));
            const res = query
                .flatMap(q => ({ from: q.e, to: universe.filter(u => q.desc.every(d => u.w.is(d))) }));
            const resSize = Math.max(...res.map(q => q.to.length));
            const fromToTo = (from) => res.filter(x => x.from === from)[0].to.map(x => x.e);
            const range = (n) => [...new Array(n).keys()];
            const res2 = range(resSize).map(i => clause
                .entities
                .filter(from => fromToTo(from).length > 0)
                .map(from => { var _a; return ({ [from]: (_a = fromToTo(from)[i]) !== null && _a !== void 0 ? _a : fromToTo(from)[0] }); })
                .reduce((a, b) => (Object.assign(Object.assign({}, a), b))));
            return res2; // return list of maps, where each map should should have ALL ids from clause in its keys, eg: [{id2:id1, id4:id3}, {id2:1, id4:3}].
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
const autotester_1 = __importDefault(__webpack_require__(/*! ./tests/autotester */ "./app/src/tests/autotester.ts"));
const toclausetests_1 = __webpack_require__(/*! ./tests/toclausetests */ "./app/src/tests/toclausetests.ts");
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, toclausetests_1.toclausetests)();
    (0, autotester_1.default)();
}))();
// main()


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


/***/ }),

/***/ "./app/src/tests/toclausetests.ts":
/*!****************************************!*\
  !*** ./app/src/tests/toclausetests.ts ***!
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toclausetests = void 0;
const Parser_1 = __webpack_require__(/*! ../parser/Parser */ "./app/src/parser/Parser.ts");
function toclausetests() {
    return __awaiter(this, void 0, void 0, function* () {
        const tests = [
            'the color of any button is red',
            'every button is red',
            'every button is a button',
            'the color of any button is the background of the style of the button',
            'width of any button is width of style of button'
        ];
        for (const t of tests) {
            console.log(t);
            const clause = yield (0, Parser_1.getParser)(t).parse().toClause();
            const stringRepr = clause.toString();
            console.log({ stringRepr });
            // const topLevel = clause.topLevel()
            // console.log({ topLevel })
            // const ownershipChains = topLevel.map(e => clause.getOwnershipChain(e))
            // console.log({ ownershipChains })
            // const ownershipChainsWithNames = ownershipChains.map(e => e.flatMap(e => clause.describe(e)[0]))
            // console.log({ ownershipChainsWithNames })
        }
    });
}
exports.toclausetests = toclausetests;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLElBQUksS0FBSyxFQUFFO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxNQUFNLEdBQUcsTUFBTSxzQkFBUyxFQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRTtZQUNwRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQztZQUMzQixxQ0FBcUM7WUFDckMsNEJBQTRCO1lBQzVCLHlFQUF5RTtZQUN6RSxtQ0FBbUM7WUFDbkMsbUdBQW1HO1lBQ25HLDRDQUE0QztTQUMvQztJQUVMLENBQUM7Q0FBQTtBQXZCRCxzQ0F1QkM7Ozs7Ozs7VUN6QkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvQW5hcGhvcmEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hY3R1YXRvci9BY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FjdHVhdG9yL0Jhc2VBY3R1YXRvci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FjdHVhdG9yL0NyZWF0ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FjdHVhdG9yL0VkaXQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvaW50ZXJmYWNlcy9Ub2tlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9waHJhc2VzL0NvbXBsZW1lbnQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Db3B1bGFTdWJvcmRpbmF0ZUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9waHJhc2VzL05vdW5QaHJhc2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvbXBsZXhTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvQ29wdWxhUXVlc3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvcHVsYVNlbnRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9JbnRyYW5zaXRpdmVTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvTW9ub3RyYW5zaXRpdmVTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQWJzdHJhY3RUb2tlbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQWRqZWN0aXZlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9BcnRpY2xlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9Db3B1bGEudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0Z1bGxTdG9wLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9IVmVyYi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvSVZlcmIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL01WZXJiLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9OZWdhdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9Ob3VuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9QcmVwb3NpdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUXVhbnRpZmllci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUmVsYXRpdmVQcm9ub3VuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1RoZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9icmFpbi9CYXNpY0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYnJhaW4vQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9JbXBseS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL2hhc2hTdHJpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvZW52aXJvL0Jhc2VFbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9lbnZpcm8vQ29uY3JldGVXcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvZW52aXJvL0Vudmlyby50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2Vudmlyby9QbGFjZWhvbGRlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2Vudmlyby9XcmFwcGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvZW52aXJvL2dldENvbmNlcHRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9sZXhlci9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvcGFyc2VyL0Jhc2ljUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvcGFyc2VyL1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3Rlc3RzL2F1dG90ZXN0ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy90ZXN0cy90b2NsYXVzZXRlc3RzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzaWNDbGF1c2UgfSBmcm9tIFwiLi9jbGF1c2VzL0Jhc2ljQ2xhdXNlXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQsIE1hcCB9IGZyb20gXCIuL2NsYXVzZXMvSWRcIlxuaW1wb3J0IGdldEVudmlybyBmcm9tIFwiLi9lbnZpcm8vRW52aXJvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQW5hcGhvcmEge1xuICAgIGFzc2VydChjbGF1c2U6IENsYXVzZSk6IFByb21pc2U8dm9pZD5cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IFByb21pc2U8TWFwW10+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbmFwaG9yYSgpIHtcbiAgICByZXR1cm4gbmV3IEVudmlyb0FuYXBob3JhKClcbn1cblxuY2xhc3MgRW52aXJvQW5hcGhvcmEgaW1wbGVtZW50cyBBbmFwaG9yYSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgcmVhZG9ubHkgZW52aXJvID0gZ2V0RW52aXJvKCkpIHtcblxuICAgIH1cblxuICAgIGFzeW5jIGFzc2VydChjbGF1c2U6IENsYXVzZSk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgICAgIGNvbnN0IGNsYXVzZXMgPSBjbGF1c2VcbiAgICAgICAgICAgIC5mbGF0TGlzdCgpXG4gICAgICAgICAgICAubWFwKGMgPT4gYyBhcyBCYXNpY0NsYXVzZSlcblxuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY2xhdXNlcykge1xuXG4gICAgICAgICAgICBpZiAoYy5hcmdzLmxlbmd0aCA9PSAxKSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVudmlyby5zZXRQbGFjZWhvbGRlcihjLmFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IGF3YWl0IHRoaXMuZW52aXJvLmdldChjLmFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYy5hcmdzWzBdLCAnIGlzIGEgJywgYy5wcmVkaWNhdGUpXG4gICAgICAgICAgICAgICAgeC5zZXQoYy5wcmVkaWNhdGUpXG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBhc3luYyBxdWVyeShjbGF1c2U6IENsYXVzZSk6IFByb21pc2U8TWFwW10+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW52aXJvLnF1ZXJ5KGNsYXVzZSlcbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEJhc2VBY3R1YXRvciBmcm9tIFwiLi9CYXNlQWN0dWF0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBY3R1YXRvciB7XG4gICAgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPHZvaWQ+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3R1YXRvcigpOiBBY3R1YXRvciB7XG4gICAgcmV0dXJuIG5ldyBCYXNlQWN0dWF0b3IoKVxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQmFzaWNDbGF1c2VcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQsIElkIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgeyBBY3R1YXRvciB9IGZyb20gXCIuL0FjdHVhdG9yXCI7XG5pbXBvcnQgQ3JlYXRlIGZyb20gXCIuL0NyZWF0ZVwiO1xuaW1wb3J0IEVkaXQgZnJvbSBcIi4vRWRpdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQWN0dWF0b3IgaW1wbGVtZW50cyBBY3R1YXRvciB7XG5cblxuICAgIGFzeW5jIHRha2VBY3Rpb24oY2xhdXNlOiBDbGF1c2UsIGVudmlybzogRW52aXJvKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICAgICAgLy8xIGdldCB0aGUgdG9wLWxldmVsIG9iamVjdCdzIElEIGZyb20gYW4gRW52aXJvLCBpZiBub25lIGNyZWF0ZSBpdFxuICAgICAgICBcbiAgICAgICAgY29uc3QgbWFwID0gKGF3YWl0IGVudmlyby5xdWVyeShjbGF1c2UpKVswXSA/PyB7fVxuICAgICAgICBjb25zdCBvd25lcnNoaXBDaGFpbiA9IGNsYXVzZS5nZXRPd25lcnNoaXBDaGFpbihjbGF1c2UudG9wTGV2ZWwoKVswXSlcbiAgICAgICAgbGV0IGlkID0gbWFwW293bmVyc2hpcENoYWluWzBdXVxuXG4gICAgICAgIGlmICghaWQpIHtcbiAgICAgICAgICAgIGVudmlyby5zZXRQbGFjZWhvbGRlcihpZCA9IGdldFJhbmRvbUlkKCkpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwcm9wcyA9ICAvLyBpbm5lciBwcm9wcyBvZiB0b3AgbGV2ZWwgZW50aXR5XG4gICAgICAgICAgICBvd25lcnNoaXBDaGFpblxuICAgICAgICAgICAgICAgIC5zbGljZSgxKVxuICAgICAgICAgICAgICAgIC5tYXAoZSA9PiBjbGF1c2UudGhlbWUuZGVzY3JpYmUoZSlbMF0pXG4gICAgICAgICAgICAgICAgLmZpbHRlcih4ID0+IHggIT09IHVuZGVmaW5lZClcblxuICAgICAgICAvLzIgZGV0ZXJtaW5lIGtpbmQgb2YgYWN0aW9uIChjcmVhdG9yIG9yIG5vbi1jcmVhdG9yKVxuICAgICAgICAvLzMgZGlzdHJpYnV0ZSB0aGUgaWQgdG8gZXZlcnkgYWN0aW9uIChvbmUgYWN0aW9uIHBlciBwcmVkaWNhdGUpXG5cbiAgICAgICAgY29uc3QgYWN0aW9ucyA9IGNsYXVzZVxuICAgICAgICAgICAgLmZsYXRMaXN0KClcbiAgICAgICAgICAgIC5tYXAoYyA9PiAoYyBhcyBCYXNpY0NsYXVzZSkpXG4gICAgICAgICAgICAubWFwKGMgPT4gaXNDcmVhdG9yQWN0aW9uKGMucHJlZGljYXRlKSA/IG5ldyBDcmVhdGUoaWQgYXMgSWQsIGMucHJlZGljYXRlKSA6IG5ldyBFZGl0KGlkIGFzIElkLCBjLnByZWRpY2F0ZSwgcHJvcHMpKVxuXG4gICAgICAgIC8vNCBjcmVhdG9yIGFjdGlvbnMgY3JlYXRlIHRoZSBvYmplY3QgaWYgaXQgZG9lc24ndCBleGlzdCB5ZXRcbiAgICAgICAgLy81IG5vbi1jcmVhdG9yIGFjdGlvbnMgV0FJVCBpZiB0aGUgb2JqZWN0IGRvZXNuJ3QgZXhpc3QgeWV0LlxuXG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhY3Rpb25zKSB7XG4gICAgICAgICAgICBhd2FpdCBhLnJ1bihlbnZpcm8pIC8vIFRPRE86IG1ha2UgdGhpcyBhc3luYy1zYWZlXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gaXNDcmVhdG9yQWN0aW9uKHByZWRpY2F0ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHByZWRpY2F0ZSA9PT0gJ2J1dHRvbidcbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyB3cmFwIH0gZnJvbSBcIi4uL2Vudmlyby9XcmFwcGVyXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ3JlYXRlIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGlkOiBJZCwgcmVhZG9ubHkgcHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBydW4oZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPGFueT4ge1xuXG4gICAgICAgIGlmIChlbnZpcm8uZXhpc3RzKHRoaXMuaWQpKSB7IC8vICBleGlzdGVuY2UgY2hlY2sgcHJpb3IgdG8gY3JlYXRpbmdcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRG9tRWxlbSh0aGlzLnByZWRpY2F0ZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5wcmVkaWNhdGUpXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG8pXG4gICAgICAgICAgICBvLmlkID0gdGhpcy5pZCArICcnXG4gICAgICAgICAgICBvLnRleHRDb250ZW50ID0gJ2RlZmF1bHQnXG4gICAgICAgICAgICBjb25zdCBuZXdPYmogPSB3cmFwKG8pXG4gICAgICAgICAgICBuZXdPYmouc2V0KHRoaXMucHJlZGljYXRlKVxuICAgICAgICAgICAgZW52aXJvLnNldCh0aGlzLmlkLCBuZXdPYmopXG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGlzRG9tRWxlbShwcmVkaWNhdGU6IHN0cmluZykge1xuXG4gICAgcmV0dXJuIFsnYnV0dG9uJ10uaW5jbHVkZXMocHJlZGljYXRlKVxuXG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXQgaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IElkLCByZWFkb25seSBwcmVkaWNhdGU6IHN0cmluZywgcmVhZG9ubHkgcHJvcHM/OiBzdHJpbmdbXSkge1xuICAgICAgICBcbiAgICB9XG5cbiAgICBhc3luYyBydW4oZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBvYmogPSBhd2FpdCBlbnZpcm8uZ2V0KHRoaXMuaWQpXG4gICAgICAgIG9iai5zZXQodGhpcy5wcmVkaWNhdGUsIHRoaXMucHJvcHMpXG4gICAgfVxuXG5cbn0iLCJpbXBvcnQgeyBDb25zdHJ1Y3RvciB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlclwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vdG9rZW5zL0FkamVjdGl2ZVwiO1xuaW1wb3J0IEFydGljbGUgZnJvbSBcIi4uL3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgRnVsbFN0b3AgZnJvbSBcIi4uL3Rva2Vucy9GdWxsU3RvcFwiO1xuaW1wb3J0IEhWZXJiIGZyb20gXCIuLi90b2tlbnMvSFZlcmJcIjtcbmltcG9ydCBJVmVyYiBmcm9tIFwiLi4vdG9rZW5zL0lWZXJiXCI7XG5pbXBvcnQgTVZlcmIgZnJvbSBcIi4uL3Rva2Vucy9NVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcbmltcG9ydCBOb25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSBcIi4uL3Rva2Vucy9Ob25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25cIjtcbmltcG9ydCBOb3VuIGZyb20gXCIuLi90b2tlbnMvTm91blwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi90b2tlbnMvUXVhbnRpZmllclwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tIFwiLi4vdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuaW1wb3J0IFRoZW4gZnJvbSBcIi4uL3Rva2Vucy9UaGVuXCI7XG5pbXBvcnQgQXN0IGZyb20gXCIuL0FzdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgVG9rZW4gZXh0ZW5kcyBBc3Qge1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb2tlbkNvbnModHlwZTogVG9rZW5UeXBlKTogQ29uc3RydWN0b3I8VG9rZW4+IHtcbiAgICByZXR1cm4gY29uc3RydWN0b3JzW3R5cGVdXG59XG5cbmV4cG9ydCB0eXBlIFRva2VuVHlwZSA9XG4gICAgJ25vdW4nXG4gICAgfCAnaXZlcmInXG4gICAgfCAnbXZlcmInXG4gICAgfCAnaHZlcmInXG4gICAgfCAnY29wdWxhJ1xuICAgIHwgJ3RoZW4nXG4gICAgfCAnYWRqJ1xuICAgIHwgJ2V4aXN0cXVhbnQnXG4gICAgfCAndW5pcXVhbnQnXG4gICAgfCAncHJlcG9zaXRpb24nXG4gICAgfCAnc3ViY29uaidcbiAgICB8ICdyZWxwcm9uJ1xuICAgIHwgJ2RlZmFydCdcbiAgICB8ICdpbmRlZmFydCdcbiAgICB8ICdmdWxsc3RvcCdcbiAgICB8ICdub25zdWJjb25qJ1xuICAgIHwgJ25lZ2F0aW9uJ1xuICAgIHwgJ2NvbnRyYWN0aW9uJ1xuXG5jb25zdCBjb25zdHJ1Y3RvcnM6IHsgW3ggaW4gVG9rZW5UeXBlXTogQ29uc3RydWN0b3I8VG9rZW4+IH0gPSB7XG4gICAgJ25vdW4nOiBOb3VuLFxuICAgICdpdmVyYic6IElWZXJiLFxuICAgICdtdmVyYic6IE1WZXJiLFxuICAgICdodmVyYic6IEhWZXJiLFxuICAgICdjb3B1bGEnOiBDb3B1bGEsXG4gICAgJ3RoZW4nOiBUaGVuLFxuICAgICdhZGonOiBBZGplY3RpdmUsXG4gICAgJ2V4aXN0cXVhbnQnOiBRdWFudGlmaWVyLFxuICAgICd1bmlxdWFudCc6IFF1YW50aWZpZXIsXG4gICAgJ3ByZXBvc2l0aW9uJzogUHJlcG9zaXRpb24sXG4gICAgJ3N1YmNvbmonOiBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sXG4gICAgJ3JlbHByb24nOiBSZWxhdGl2ZVByb25vdW4sXG4gICAgJ2RlZmFydCc6IEFydGljbGUsXG4gICAgJ2luZGVmYXJ0JzogQXJ0aWNsZSxcbiAgICAnZnVsbHN0b3AnOiBGdWxsU3RvcCxcbiAgICAnbm9uc3ViY29uaic6IE5vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbixcbiAgICAnbmVnYXRpb24nOiBOZWdhdGlvbixcbiAgICAnY29udHJhY3Rpb24nOiBOZWdhdGlvbiAvL1RPRE86IGZpeCB0aGlzIGNyYXAgIFxufSIsImltcG9ydCB7IFRvQ2xhdXNlT3B0cyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRSYW5kb21JZCwgSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFBocmFzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9QaHJhc2VcIjtcbmltcG9ydCBQcmVwb3NpdGlvbiBmcm9tIFwiLi4vdG9rZW5zL1ByZXBvc2l0aW9uXCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi9Ob3VuUGhyYXNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBsZW1lbnQgaW1wbGVtZW50cyBQaHJhc2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlcG9zaXRpb246IFByZXBvc2l0aW9uLCByZWFkb25seSBub3VuUGhyYXNlOiBOb3VuUGhyYXNlKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHsgLy8gcHJlcG9zaXRpb24oYXJncy5zdWJqZWN0LCBZKSArIG5vdW5waHJhc2UudG9Qcm9sb2coc3ViamVjdD1ZKVxuXG4gICAgICAgIGNvbnN0IHN1YmpJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/ICgoKTogSWQgPT4geyB0aHJvdyBuZXcgRXJyb3IoJ3VuZGVmaW5lZCBzdWJqZWN0IGlkJykgfSkoKVxuICAgICAgICBjb25zdCBuZXdJZCA9IGdldFJhbmRvbUlkKClcblxuICAgICAgICByZXR1cm4gY2xhdXNlT2YodGhpcy5wcmVwb3NpdGlvbi5zdHJpbmcsIHN1YmpJZCwgbmV3SWQpXG4gICAgICAgICAgICAuYW5kKGF3YWl0IHRoaXMubm91blBocmFzZS50b0NsYXVzZSh7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IG5ld0lkIH0gfSkpXG4gICAgICAgICAgICAuY29weSh7c2lkZUVmZmVjdHkgOiBmYWxzZX0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU3Vib3JkaW5hdGVDbGF1c2VcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBSZWxhdGl2ZVByb25vdW4gZnJvbSBcIi4uL3Rva2Vucy9SZWxhdGl2ZVByb25vdW5cIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuL05vdW5QaHJhc2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UgaW1wbGVtZW50cyBTdWJvcmRpbmF0ZUNsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSByZWxwcm9uOiBSZWxhdGl2ZVByb25vdW4sIHJlYWRvbmx5IHByZWRpY2F0ZTogTm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOiBDb3B1bGEpIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IHRoaXMucHJlZGljYXRlLnRvQ2xhdXNlKHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogYXJncz8ucm9sZXM/LnN1YmplY3QgfSB9KSlcbiAgICAgICAgLmNvcHkoe3NpZGVFZmZlY3R5IDogZmFsc2V9KVxuICAgIH1cblxufSIsImltcG9ydCBQaHJhc2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvUGhyYXNlXCI7XG5pbXBvcnQgQWRqZWN0aXZlIGZyb20gXCIuLi90b2tlbnMvQWRqZWN0aXZlXCI7XG5pbXBvcnQgQXJ0aWNsZSBmcm9tIFwiLi4vdG9rZW5zL0FydGljbGVcIjtcbmltcG9ydCBOb3VuIGZyb20gXCIuLi90b2tlbnMvTm91blwiO1xuaW1wb3J0IFF1YW50aWZpZXIgZnJvbSBcIi4uL3Rva2Vucy9RdWFudGlmaWVyXCI7XG5pbXBvcnQgQ29tcGxlbWVudCBmcm9tIFwiLi9Db21wbGVtZW50XCI7XG5pbXBvcnQgU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU3Vib3JkaW5hdGVDbGF1c2VcIjtcbmltcG9ydCB7IFRvQ2xhdXNlT3B0cyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQsIHRvVmFyIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm91blBocmFzZSBpbXBsZW1lbnRzIFBocmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBhZGplY3RpdmVzOiBBZGplY3RpdmVbXSxcbiAgICAgICAgcmVhZG9ubHkgY29tcGxlbWVudHM6IENvbXBsZW1lbnRbXSxcbiAgICAgICAgcmVhZG9ubHkgbm91bj86IE5vdW4sXG4gICAgICAgIHJlYWRvbmx5IHF1YW50aWZpZXI/OiBRdWFudGlmaWVyLFxuICAgICAgICByZWFkb25seSBhcnRpY2xlPzogQXJ0aWNsZSxcbiAgICAgICAgcmVhZG9ubHkgc3Vib3JkQ2xhdXNlPzogU3Vib3JkaW5hdGVDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIGlzVW5pUXVhbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnF1YW50aWZpZXI/LmlzVW5pdmVyc2FsKCkgPz8gZmFsc2VcbiAgICB9XG5cbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuICAgICAgICBjb25zdCBtYXliZUlkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoKVxuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSB0aGlzLmlzVW5pUXVhbnQoKSA/IHRvVmFyKG1heWJlSWQpIDogbWF5YmVJZFxuICAgICAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG5cbiAgICAgICAgY29uc3QgcmVzID0gdGhpc1xuICAgICAgICAgICAgLmFkamVjdGl2ZXNcbiAgICAgICAgICAgIC5tYXAoYSA9PiBhLnN0cmluZylcbiAgICAgICAgICAgIC5jb25jYXQodGhpcy5ub3VuID8gW3RoaXMubm91bi5zdHJpbmddIDogW10pXG4gICAgICAgICAgICAubWFwKHAgPT4gY2xhdXNlT2YocCwgc3ViamVjdElkKSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UoKSlcbiAgICAgICAgICAgIC5hbmQoKGF3YWl0IFByb21pc2UuYWxsKHRoaXMuY29tcGxlbWVudHMubWFwKGMgPT4gYy50b0NsYXVzZShuZXdBcmdzKSkpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UoKSkpXG4gICAgICAgICAgICAuYW5kKGF3YWl0IHRoaXMuc3Vib3JkQ2xhdXNlPy50b0NsYXVzZShuZXdBcmdzKSA/PyBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcblxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG59IiwiaW1wb3J0IENvbXBvdW5kU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29tcG91bmRTZW50ZW5jZVwiO1xuaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFNpbXBsZVNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1NpbXBsZVNlbnRlbmNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gXCIuLi90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uXCI7XG5cbi8qKlxuICogQSBzZW50ZW5jZSB0aGF0IHJlbGF0ZXMgdHdvIHNpbXBsZSBzZW50ZW5jZXMgaHlwb3RhY3RpY2FsbHksIGluIGEgXG4gKiBjb25kaXRpb24tb3V0Y29tZSByZWxhdGlvbnNoaXAuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbXBsZXhTZW50ZW5jZSBpbXBsZW1lbnRzIENvbXBvdW5kU2VudGVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY29uZGl0aW9uOiBTaW1wbGVTZW50ZW5jZSxcbiAgICAgICAgcmVhZG9ubHkgb3V0Y29tZTogU2ltcGxlU2VudGVuY2UsXG4gICAgICAgIHJlYWRvbmx5IHN1YmNvbmo6IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbikge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cbiAgICAgICAgY29uc3QgbmV3QXJnczEgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IGdldFJhbmRvbUlkKCkgfSB9XG5cbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gYXdhaXQgdGhpcy5jb25kaXRpb24udG9DbGF1c2UobmV3QXJnczEpXG4gICAgICAgIGNvbnN0IG91dGNvbWUgPSBhd2FpdCB0aGlzLm91dGNvbWUudG9DbGF1c2UoeyAuLi5hcmdzLCBhbmFwaG9yYTogY29uZGl0aW9uIH0pXG4gICAgICAgIHJldHVybiBjb25kaXRpb24uaW1wbGllcyhvdXRjb21lKS5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUgfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgQmluYXJ5UXVlc3Rpb24gZnJvbSBcIi4uL2ludGVyZmFjZXMvQmluYXJ5UXVlc3Rpb25cIjtcbmltcG9ydCB7IFRvQ2xhdXNlT3B0cyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBDb3B1bGFTZW50ZW5jZSBmcm9tIFwiLi9Db3B1bGFTZW50ZW5jZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFRdWVzdGlvbiBpbXBsZW1lbnRzIEJpbmFyeVF1ZXN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsIHJlYWRvbmx5IHByZWRpY2F0ZTogTm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOiBDb3B1bGEpIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4ge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKHsgYXNWYXI6IHRoaXMuc3ViamVjdC5pc1VuaVF1YW50KCkgfSlcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIC8vVE9ETzogaW4gY2FzZSBvZiBhIHVuaXZlcnNhbGx5IHF1YW50aWZpZWQgcXVlc3Rpb24gZWc6IFwiYXJlIGFsbCBjYXRzIHNtYXJ0P1wiIHRoZSBwcm9sb2dcbiAgICAgICAgLy8gcHJvZHVjZWQgc2hvdWxkIE5PVCBiZSBhbiBpbXBsaWNhdGlvbiwgYnV0IHJhdGhlciBhIGNoZWNrIHRoYXQgYWxsIGNhdHMgYXJlIHNtYXJ0LlxuXG4gICAgICAgIGNvbnN0IGNsYXVzZSA9IGF3YWl0IG5ldyBDb3B1bGFTZW50ZW5jZSh0aGlzLnN1YmplY3QsIHRoaXMuY29wdWxhLCB0aGlzLnByZWRpY2F0ZSkudG9DbGF1c2UobmV3QXJncylcblxuICAgICAgICByZXR1cm4gY2xhdXNlLmNvcHkoe3NpZGVFZmZlY3R5IDogZmFsc2V9KVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQsIGlzVmFyLCB0b0NvbnN0LCB0b1ZhciB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgU2ltcGxlU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU2ltcGxlU2VudGVuY2VcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vdG9rZW5zL05lZ2F0aW9uXCI7XG5pbXBvcnQgeyBnZXRBbmFwaG9yYSB9IGZyb20gXCIuLi8uLi9BbmFwaG9yYVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFTZW50ZW5jZSBpbXBsZW1lbnRzIFNpbXBsZVNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsIHJlYWRvbmx5IGNvcHVsYTogQ29wdWxhLCByZWFkb25seSBwcmVkaWNhdGU6IE5vdW5QaHJhc2UsIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4ge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKHsgYXNWYXI6IHRoaXMuc3ViamVjdC5pc1VuaVF1YW50KCkgfSlcblxuICAgICAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBhd2FpdCB0aGlzLnN1YmplY3QudG9DbGF1c2UobmV3QXJncylcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gKGF3YWl0IHRoaXMucHJlZGljYXRlLnRvQ2xhdXNlKG5ld0FyZ3MpKS5jb3B5KHsgbmVnYXRlOiAhIXRoaXMubmVnYXRpb24gfSlcblxuICAgICAgICBjb25zdCBlbnRpdGllcyA9IHN1YmplY3QuZW50aXRpZXMuY29uY2F0KHByZWRpY2F0ZS5lbnRpdGllcylcblxuICAgICAgICBjb25zdCByZXN1bHQgPSBlbnRpdGllcy8vIGFzc3VtZSBhbnkgc2VudGVuY2Ugd2l0aCBhbnkgdmFyIGlzIGFuIGltcGxpY2F0aW9uXG4gICAgICAgICAgICAuc29tZShlID0+IGlzVmFyKGUpKSA/XG4gICAgICAgICAgICBzdWJqZWN0LmltcGxpZXMocHJlZGljYXRlKSA6XG4gICAgICAgICAgICBzdWJqZWN0LmFuZChwcmVkaWNhdGUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuXG4gICAgICAgIGNvbnN0IG0wID0gcmVzdWx0LmVudGl0aWVzIC8vIGFzc3VtZSBpZHMgYXJlIGNhc2UgaW5zZW5zaXRpdmUsIGFzc3VtZSBpZiBJRFggaXMgdmFyIGFsbCBpZHggYXJlIHZhclxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IGlzVmFyKHgpKVxuICAgICAgICAgICAgLm1hcChlID0+ICh7IFt0b0NvbnN0KGUpXTogZSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuXG4gICAgICAgIGNvbnN0IGEgPSBnZXRBbmFwaG9yYSgpIC8vIGdldCBhbmFwaG9yYVxuICAgICAgICBhd2FpdCBhLmFzc2VydChzdWJqZWN0KVxuICAgICAgICBjb25zdCBtMSA9IChhd2FpdCBhLnF1ZXJ5KHByZWRpY2F0ZSkpWzBdID8/IHt9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHttMX0pXG5cbiAgICAgICAgY29uc3QgcmVzdWx0MiA9IHJlc3VsdC5jb3B5KHsgbWFwOiBtMCB9KS5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUsIG1hcDogbTEgfSlcblxuICAgICAgICBjb25zdCBtMiA9IHJlc3VsdDIuZW50aXRpZXMgLy8gYXNzdW1lIGFueXRoaW5nIG93bmVkIGJ5IGEgdmFyaWFibGUgaXMgYWxzbyBhIHZhcmlhYmxlXG4gICAgICAgICAgICAuZmlsdGVyKGUgPT4gaXNWYXIoZSkpXG4gICAgICAgICAgICAuZmxhdE1hcChlID0+IHJlc3VsdDIub3duZWRCeShlKSlcbiAgICAgICAgICAgIC5tYXAoZSA9PiAoeyBbZV06IHRvVmFyKGUpIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDIuY29weSh7IG1hcDogbTIgfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBJVmVyYiBmcm9tIFwiLi4vdG9rZW5zL0lWZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbnRyYW5zaXRpdmVTZW50ZW5jZSBpbXBsZW1lbnRzIFZlcmJTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdWJqZWN0OiBOb3VuUGhyYXNlLFxuICAgICAgICByZWFkb25seSBpdmVyYjogSVZlcmIsXG4gICAgICAgIHJlYWRvbmx5IGNvbXBsZW1lbnRzOiBDb21wbGVtZW50W10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cbiAgICBcbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCh7IGFzVmFyOiB0aGlzLnN1YmplY3QuaXNVbmlRdWFudCgpIH0pXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICBjb25zdCB0aGVtZSA9IGF3YWl0IHRoaXMuc3ViamVjdC50b0NsYXVzZShuZXdBcmdzKVxuICAgICAgICBcbiAgICAgICAgY29uc3QgcmhlbWUgPSBjbGF1c2VPZih0aGlzLml2ZXJiLnN0cmluZywgc3ViamVjdElkKS5hbmQoKGF3YWl0IFByb21pc2UuYWxsKHRoaXMuY29tcGxlbWVudHMubWFwKCBjID0+IGMudG9DbGF1c2UobmV3QXJncykpKSkucmVkdWNlKCAoYzEsIGMyKSA9PiBjMS5hbmQoYzIpKSlcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGVtZS5hbmQocmhlbWUsIHsgYXNSaGVtZTogdHJ1ZSB9KS5jb3B5KHtzaWRlRWZmZWN0eTp0cnVlfSlcbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IFZlcmJTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9waHJhc2VzL05vdW5QaHJhc2VcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vdG9rZW5zL01WZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlIGltcGxlbWVudHMgVmVyYlNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgbXZlcmI6IE1WZXJiLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG9iamVjdDogTm91blBocmFzZSxcbiAgICAgICAgICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IG5lZ2F0aW9uPzogTmVnYXRpb24pIHtcblxuICAgIH1cbiAgICBcbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBBYnN0cmFjdFRva2VuIGltcGxlbWVudHMgVG9rZW57XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzdHJpbmc6c3RyaW5nKXtcblxuICAgIH0gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFkamVjdGl2ZSBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IHsgZm9ybXNPZiB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvbGV4ZW1lc1wiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnRpY2xlIGV4dGVuZHMgQWJzdHJhY3RUb2tlbiB7XG5cbiAgICBpc0RlZmluaXRlKCkge1xuXG4gICAgICAgIHJldHVybiBsZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC50eXBlID09PSAnZGVmYXJ0JylcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4gZm9ybXNPZih4KSlcbiAgICAgICAgICAgIC5pbmNsdWRlcyh0aGlzLnN0cmluZylcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGBBcnRpY2xlKCR7dGhpcy5zdHJpbmd9LCBpc0RlZmluaXRlPSR7dGhpcy5pc0RlZmluaXRlKCl9KWBcbiAgICB9XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29wdWxhIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnVsbFN0b3AgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIVmVyYiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIElWZXJiIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTVZlcmIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOZWdhdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb25TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vdW4gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVwb3NpdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgICAgXG59IiwiaW1wb3J0IHsgZm9ybXNPZiB9IGZyb20gXCIuLi8uLi9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi4vLi4vbGV4ZXIvbGV4ZW1lc1wiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWFudGlmaWVyIGV4dGVuZHMgQWJzdHJhY3RUb2tlbiB7XG5cbiAgICBpc1VuaXZlcnNhbCgpIHtcblxuICAgICAgICByZXR1cm4gbGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHgudHlwZSA9PT0gJ3VuaXF1YW50JylcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4gZm9ybXNPZih4KSlcbiAgICAgICAgICAgIC5pbmNsdWRlcyh0aGlzLnN0cmluZylcblxuICAgIH1cblxuICAgIGlzRXhpc3RlbnRpYWwoKSB7XG5cbiAgICAgICAgcmV0dXJuIGxleGVtZXNcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LnR5cGUgPT09ICdleGlzdHF1YW50JylcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4gZm9ybXNPZih4KSlcbiAgICAgICAgICAgIC5pbmNsdWRlcyh0aGlzLnN0cmluZylcblxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWxhdGl2ZVByb25vdW4gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaGVuIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICAgXG59IiwiaW1wb3J0IHsgZ2V0UGFyc2VyIH0gZnJvbSBcIi4uL3BhcnNlci9QYXJzZXJcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuaW1wb3J0IGdldEVudmlybyBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIsIHsgd3JhcCB9IGZyb20gXCIuLi9lbnZpcm8vV3JhcHBlclwiO1xuaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0dWF0b3JcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZW52aXJvID0gZ2V0RW52aXJvKCksIHJlYWRvbmx5IGFjdHVhdG9yID0gZ2V0QWN0dWF0b3IoKSkge1xuXG4gICAgICAgIHdyYXAoSFRNTEJ1dHRvbkVsZW1lbnQucHJvdG90eXBlKS5zZXRBbGlhcygnY29sb3InLCBbJ3N0eWxlJywgJ2JhY2tncm91bmQnXSlcbiAgICAgICAgLy8gd3JhcChIVE1MQnV0dG9uRWxlbWVudC5wcm90b3R5cGUpLnNldEFsaWFzKCd3aWR0aCcsIFsnc3R5bGUnLCAnd2lkdGgnXSlcblxuICAgIH1cblxuICAgIGFzeW5jIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogUHJvbWlzZTxhbnlbXT4ge1xuXG4gICAgICAgIGxldCByZXN1bHRzOiBhbnlbXSA9IFtdXG5cbiAgICAgICAgZm9yIChjb25zdCBhc3Qgb2YgZ2V0UGFyc2VyKG5hdGxhbmcpLnBhcnNlQWxsKCkpIHtcblxuICAgICAgICAgICAgY29uc3QgY2xhdXNlID0gYXdhaXQgYXN0LnRvQ2xhdXNlKClcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNsYXVzZS50b1N0cmluZygpLCAnc2lkZS1lZmZldGNzOicsIGNsYXVzZS5pc1NpZGVFZmZlY3R5KVxuXG4gICAgICAgICAgICBpZiAoY2xhdXNlLmlzU2lkZUVmZmVjdHkpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmFjdHVhdG9yLnRha2VBY3Rpb24oY2xhdXNlLCB0aGlzLmVudmlybykgLy8gVE9ETzogbWFrZSB0aGlzIGFzeW5jLXNhZmVcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpZHMgPSBPYmplY3QudmFsdWVzKChhd2FpdCB0aGlzLmVudmlyby5xdWVyeShjbGF1c2UpKVswXSA/P3t9KVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGUgPT4gZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAubWFwKGUgPT4gZSBhcyBJZClcblxuICAgICAgICAgICAgICAgIGNvbnN0IG9iamVjdHMgPSBhd2FpdCBQcm9taXNlLmFsbChpZHMubWFwKGUgPT4gdGhpcy5lbnZpcm8uZ2V0KGUpKSlcbiAgICAgICAgICAgICAgICB0aGlzLmVudmlyby52YWx1ZXMuZm9yRWFjaChvID0+IG8ucG9pbnRPdXQoeyB0dXJuT2ZmOiB0cnVlIH0pKVxuICAgICAgICAgICAgICAgIG9iamVjdHMuZm9yRWFjaChvID0+IG8ucG9pbnRPdXQoKSlcbiAgICAgICAgICAgICAgICByZXN1bHRzID0gWy4uLnJlc3VsdHMsIC4uLm9iamVjdHMubWFwKG8gPT4gby5vYmplY3QpXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxufSIsImltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuXG4vKipcbiAqIFRoZSBtYWluIGZhY2FkZSBjb250cm9sbGVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgQnJhaW4ge1xuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogUHJvbWlzZTxhbnlbXT5cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEJyYWluKCk6IFByb21pc2U8QnJhaW4+IHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQnJhaW4oKVxufVxuIiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0aW9uXCI7XG5pbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi9nZXRPd25lcnNoaXBDaGFpblwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmQgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlMTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UyOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTJJc1JoZW1lOiBib29sZWFuLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IG5vQW5hcGhvcmEgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBBbmQge1xuXG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMuY2xhdXNlMS5jb3B5KHsgbWFwOiBvcHRzPy5tYXAgfSksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTIuY29weSh7IG1hcDogb3B0cz8ubWFwIH0pLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UySXNSaGVtZSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5ub0FuYXBob3JhID8/IHRoaXMubm9BbmFwaG9yYSxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDpcbiAgICAgICAgICAgIFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG5cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG5cbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2UgeyAvL1RPRE86IGlmIHRoaXMgaXMgbmVnYXRlZCFcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5hYm91dChpZCkuYW5kKHRoaXMuY2xhdXNlMi5hYm91dChpZCkpXG4gICAgfVxuXG4gICAgYXN5bmMgdG9BY3Rpb24oKTogUHJvbWlzZTxBY3Rpb24+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bmltcGxlbWVudGVkIScpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0b3BMZXZlbCh0aGlzKVxuICAgIH1cblxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIGdldE93bmVyc2hpcENoYWluKHRoaXMsIGVudGl0eSlcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTEgOiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiO1xuaW1wb3J0IHsgdG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi9nZXRPd25lcnNoaXBDaGFpblwiO1xuXG5leHBvcnQgY2xhc3MgQmFzaWNDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlZGljYXRlOiBzdHJpbmcsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgbm9BbmFwaG9yYSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpLFxuICAgICAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlKCkpIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQmFzaWNDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHRoaXMucHJlZGljYXRlLFxuICAgICAgICAgICAgdGhpcy5hcmdzLm1hcChhID0+IG9wdHM/Lm1hcCA/IG9wdHM/Lm1hcFthXSA/PyBhIDogYSksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8ubm9BbmFwaG9yYSA/PyB0aGlzLm5vQW5hcGhvcmEsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW3RoaXNdXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgfVxuXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpID8gdGhpcyA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQodGhpcy5hcmdzKSlcbiAgICB9XG5cbiAgICBhc3luYyB0b0FjdGlvbigpOiBQcm9taXNlPEFjdGlvbj4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUgPT09ICdvZicgJiYgdGhpcy5hcmdzWzFdID09PSBpZCA/IFt0aGlzLmFyZ3NbMF1dIDogW11cbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlID09PSAnb2YnICYmIHRoaXMuYXJnc1swXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzFdXSA6IFtdXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMucHJlZGljYXRlfSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW50aXRpZXMuaW5jbHVkZXMoaWQpICYmIHRoaXMuYXJncy5sZW5ndGggPT09IDEgPyBbdGhpcy5wcmVkaWNhdGVdIDogW11cbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRvcExldmVsKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcywgZW50aXR5KVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIlxuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuL0lkXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiXG5pbXBvcnQgeyBFbXB0eUNsYXVzZSB9IGZyb20gXCIuL0VtcHR5Q2xhdXNlXCJcblxuLyoqXG4gKiBBICdsYW5ndWFnZS1hZ25vc3RpYycgZmlyc3Qgb3JkZXIgbG9naWMgcmVwcmVzZW50YXRpb24uXG4qL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc0ltcGx5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgbm9BbmFwaG9yYTogYm9vbGVhblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZVxuICAgIHRvQWN0aW9uKCk6IFByb21pc2U8QWN0aW9uPlxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXVxuICAgIHRvcExldmVsKCk6IElkW11cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UocHJlZGljYXRlLCBhcmdzKVxufVxuXG4vLyBleHBvcnQgY29uc3QgZW1wdHlDbGF1c2UgPSAoKTogQ2xhdXNlID0+IG5ldyBBbmQoW10pXG5leHBvcnQgY29uc3QgZW1wdHlDbGF1c2UgPSAoKTogQ2xhdXNlID0+IG5ldyBFbXB0eUNsYXVzZSgpXG5cblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIG5vQW5hcGhvcmE/OiBib29sZWFuIC8vIGludGVycHJldCBldmVyeSBpZCBhcyBleGFjdFxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuZE9wdHMge1xuICAgIGFzUmhlbWU/OiBib29sZWFuXG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0aW9uXCI7XG5pbXBvcnQgeyBBbmRPcHRzLCBDbGF1c2UsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5cbmV4cG9ydCBjbGFzcyBFbXB0eUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSA5OTk5OTk5OSxcbiAgICAgICAgcmVhZG9ubHkgZW50aXRpZXMgPSBbXSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBub0FuYXBob3JhID0gZmFsc2UpIHtcblxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBvdGhlclxuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIGNvbmNsdXNpb25cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgdG9BY3Rpb24oKTogUHJvbWlzZTxBY3Rpb24+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuICAgIFxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0b1N0cmluZygpe1xuICAgICAgICAvLyByZXR1cm4gJyhlbXB0eSBjbGF1c2UpJ1xuICAgICAgICByZXR1cm4gJydcbiAgICB9XG5cbn0iLCIvKipcbiAqIElkIG9mIGFuIGVudGl0eS5cbiAqL1xuZXhwb3J0IHR5cGUgSWQgPSBudW1iZXIgfCBzdHJpbmdcblxuLyoqXG4gKiBJZCB0byBJZCBtYXBwaW5nLCBmcm9tIG9uZSBcInVuaXZlcnNlXCIgdG8gYW5vdGhlci5cbiAqL1xuZXhwb3J0IHR5cGUgTWFwID0geyBbYTogSWRdOiBJZCB9XG5cblxuZnVuY3Rpb24qIGdldElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMFxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHgrK1xuICAgICAgICB5aWVsZCB4XG4gICAgfVxufVxuXG5jb25zdCBpZEdlbmVyYXRvciA9IGdldElkR2VuZXJhdG9yKClcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbUlkKG9wdHM/OiBHZXRSYW5kb21JZE9wdHMpOiBJZCB7XG4gICAgXG4gICAgLy8gY29uc3QgbmV3SWQgPSBgaWQke3BhcnNlSW50KDEwMDAgKiBNYXRoLnJhbmRvbSgpICsgJycpfWBcblxuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YFxuXG4gICAgcmV0dXJuIG9wdHM/LmFzVmFyID8gdG9WYXIobmV3SWQpIDogbmV3SWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRSYW5kb21JZE9wdHMge1xuICAgIGFzVmFyOiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1ZhcihpZDogSWQpOiBJZCB7XG4gICAgcmV0dXJuICghTnVtYmVyLmlzTmFOKE51bWJlcihpZCkpID8gYGlkJHtpZH1gIDogaWQgKyAnJykudG9VcHBlckNhc2UoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYXIoZTogSWQpIHtcbiAgICByZXR1cm4gTnVtYmVyLmlzTmFOKE51bWJlcihlKSkgJiYgKGUudG9TdHJpbmcoKVswXSA9PT0gZS50b1N0cmluZygpWzBdLnRvVXBwZXJDYXNlKCkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0NvbnN0KGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b0xvd2VyQ2FzZSgpXG59IiwiaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0aW9uXCI7XG5pbXBvcnQgeyB0b3BMZXZlbCB9IGZyb20gXCIuL3RvcExldmVsXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5IGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjb25jbHVzaW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgbm9BbmFwaG9yYSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSB0cnVlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSksXG4gICAgICAgIHJlYWRvbmx5IHRoZW1lID0gY29uZGl0aW9uLnRoZW1lKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICAvLyByZXR1cm4gbmV3IEFuZChbdGhpcywgb3RoZXJdKVxuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJbXBseSh0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jb25jbHVzaW9uLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8ubm9BbmFwaG9yYSA/PyB0aGlzLm5vQW5hcGhvcmEsXG4gICAgICAgICAgICBvcHRzPy5zaWRlRWZmZWN0eSA/PyB0aGlzLmlzU2lkZUVmZmVjdHkpXG5cbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5lbnRpdGllcy5jb25jYXQodGhpcy5jb25jbHVzaW9uLmVudGl0aWVzKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcyAvLyBkdW5ubyB3aGF0IEknbSBkb2luJ1xuICAgIH1cblxuICAgIGltcGxpZXMoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2UoKSAvLy9UT0RPISEhISEhISFcbiAgICB9XG5cbiAgICBhc3luYyB0b0FjdGlvbigpOiBQcm9taXNlPEFjdGlvbj4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuaW1wbGVtZW50ZWQhJylcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5jb25kaXRpb24udG9TdHJpbmcoKX0gLS0tPiAke3RoaXMuY29uY2x1c2lvbi50b1N0cmluZygpfWBcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZWRCeShpZCkuY29uY2F0KHRoaXMuY29uY2x1c2lvbi5vd25lZEJ5KGlkKSlcbiAgICB9XG5cbiAgICBvd25lcnNPZihpZDogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jb25jbHVzaW9uLm93bmVyc09mKGlkKSlcbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmNsdXNpb24uZGVzY3JpYmUoaWQpLmNvbmNhdCh0aGlzLmNvbmRpdGlvbi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0b3BMZXZlbCh0aGlzKVxuICAgIH1cblxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIGdldE93bmVyc2hpcENoYWluKHRoaXMsIGVudGl0eSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCk6IElkW10ge1xuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjYztcbiAgICAgICAgcmV0dXJuIGgxICYgaDE7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB0b3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4vRW52aXJvXCI7XG5pbXBvcnQgeyBQbGFjZWhvbGRlciB9IGZyb20gXCIuL1BsYWNlaG9sZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VFbnZpcm8gaW1wbGVtZW50cyBFbnZpcm8ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgZGljdGlvbmFyeTogeyBbaWQ6IElkXTogV3JhcHBlciB9ID0ge30pIHtcblxuICAgIH1cblxuICAgIGFzeW5jIGdldChpZDogSWQpOiBQcm9taXNlPFdyYXBwZXI+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF0gLy9UT0RPOiBjb3VsZCBiZSB1bmRlZmluZWQhXG4gICAgfVxuXG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0OiBXcmFwcGVyKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLmRpY3Rpb25hcnlbaWRdXG5cbiAgICAgICAgaWYgKHBsYWNlaG9sZGVyICYmIHBsYWNlaG9sZGVyIGluc3RhbmNlb2YgUGxhY2Vob2xkZXIpIHtcblxuICAgICAgICAgICAgcGxhY2Vob2xkZXIucHJlZGljYXRlcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgICAgIG9iamVjdC5zZXQocClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBvYmplY3RcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgYXN5bmMgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPiB7IC8vVE9ETyB0aGlzIGlzIGEgdG1wIHNvbHV0aW9uLCBmb3IgYW5hcGhvcmEgcmVzb2x1dGlvbiwgYnV0IGp1c3Qgd2l0aCBkZXNjcmlwdGlvbnMsIHdpdGhvdXQgdGFraW5nIChtdWx0aS1lbnRpdHkpIHJlbGF0aW9uc2hpcHMgaW50byBhY2NvdW50XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKHRoaXMuZGljdGlvbmFyeSlcbiAgICAgICAgICAgIC5tYXAoeCA9PiAoeyBlOiB4WzBdLCB3OiB4WzFdIH0pKVxuXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gY2xhdXNlIC8vIGRlc2NyaWJlZCBlbnRpdGllc1xuICAgICAgICAgICAgLmVudGl0aWVzXG4gICAgICAgICAgICAubWFwKGUgPT4gKHsgZSwgZGVzYzogY2xhdXNlLnRoZW1lLmRlc2NyaWJlKGUpIH0pKVxuXG4gICAgICAgIGNvbnN0IHJlcyA9IHF1ZXJ5XG4gICAgICAgICAgICAuZmxhdE1hcChxID0+ICh7IGZyb206IHEuZSwgdG86IHVuaXZlcnNlLmZpbHRlcih1ID0+IHEuZGVzYy5ldmVyeShkID0+IHUudy5pcyhkKSkpIH0pKVxuXG4gICAgICAgIGNvbnN0IHJlc1NpemUgPSBNYXRoLm1heCguLi5yZXMubWFwKHEgPT4gcS50by5sZW5ndGgpKTtcbiAgICAgICAgY29uc3QgZnJvbVRvVG8gPSAoZnJvbTogSWQpID0+IHJlcy5maWx0ZXIoeCA9PiB4LmZyb20gPT09IGZyb20pWzBdLnRvLm1hcCh4ID0+IHguZSk7XG4gICAgICAgIGNvbnN0IHJhbmdlID0gKG46IG51bWJlcikgPT4gWy4uLm5ldyBBcnJheShuKS5rZXlzKCldXG5cbiAgICAgICAgY29uc3QgcmVzMiA9IHJhbmdlKHJlc1NpemUpLm1hcChpID0+XG4gICAgICAgICAgICBjbGF1c2VcbiAgICAgICAgICAgICAgICAuZW50aXRpZXNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGZyb20gPT4gZnJvbVRvVG8oZnJvbSkubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAubWFwKGZyb20gPT4gKHsgW2Zyb21dOiBmcm9tVG9Ubyhmcm9tKVtpXSA/PyBmcm9tVG9Ubyhmcm9tKVswXSB9KSlcbiAgICAgICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKSlcblxuICAgICAgICByZXR1cm4gcmVzMiAvLyByZXR1cm4gbGlzdCBvZiBtYXBzLCB3aGVyZSBlYWNoIG1hcCBzaG91bGQgc2hvdWxkIGhhdmUgQUxMIGlkcyBmcm9tIGNsYXVzZSBpbiBpdHMga2V5cywgZWc6IFt7aWQyOmlkMSwgaWQ0OmlkM30sIHtpZDI6MSwgaWQ0OjN9XS5cbiAgICB9XG5cbiAgICBzZXRQbGFjZWhvbGRlcihpZDogSWQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IG5ldyBQbGFjZWhvbGRlcigpXG4gICAgfVxuXG4gICAgZXhpc3RzKGlkOiBJZCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXSAmJiAhKHRoaXMuZGljdGlvbmFyeVtpZF0gaW5zdGFuY2VvZiBQbGFjZWhvbGRlcilcbiAgICB9XG5cbiAgICBnZXQgdmFsdWVzKCk6IFdyYXBwZXJbXSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdGlvbmFyeSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBnZXRDb25jZXB0cyB9IGZyb20gXCIuL2dldENvbmNlcHRzXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmNyZXRlV3JhcHBlciBpbXBsZW1lbnRzIFdyYXBwZXIge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgb2JqZWN0OiBhbnksXG4gICAgICAgIHJlYWRvbmx5IHNpbXBsZUNvbmNlcHRzOiB7IFtjb25jZXB0TmFtZTogc3RyaW5nXTogc3RyaW5nW10gfSA9IG9iamVjdC5zaW1wbGVDb25jZXB0cyA/PyB7fSkge1xuXG4gICAgICAgIG9iamVjdC5zaW1wbGVDb25jZXB0cyA9IHNpbXBsZUNvbmNlcHRzXG4gICAgfVxuXG4gICAgc2V0KHByZWRpY2F0ZTogc3RyaW5nLCBwcm9wcz86IHN0cmluZ1tdKTogdm9pZCB7XG5cbiAgICAgICAgKHRoaXMub2JqZWN0IGFzIGFueSlbcHJlZGljYXRlXSA9IHRydWUgLy8gVE9ETzogcmVtb3ZlXG5cbiAgICAgICAgaWYgKHByb3BzICYmIHByb3BzLmxlbmd0aCA+IDEpIHsgLy8gc2V0IHRoZSBwZWRpY2F0ZSBvbiB0aGUgcGF0aFxuICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocHJvcHMsIHByZWRpY2F0ZSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgLy8xIGlmIGxlbihwcm9wcykgPT0gMSB1c2UgaXQgYXMgYSBjb25jZXB0XG4gICAgICAgIGlmIChwcm9wcyAmJiBwcm9wcy5sZW5ndGggPT09IDEpIHtcblxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuc2ltcGxlQ29uY2VwdHMpLmluY2x1ZGVzKHByb3BzWzBdKSkgeyAvLyBpcyBjb25jZXB0XG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQodGhpcy5zaW1wbGVDb25jZXB0c1twcm9wc1swXV0sIHByZWRpY2F0ZSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocHJvcHMsIHByZWRpY2F0ZSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLzIgaWYgbGVuKHByb3BzKSA9PSAwIGdldCB0aGUgY29uY2VwdCBmcm9tIHRoZSBwcmVkaWNhdGUgKGVnOiByZWQgaXMgYSAnY29sb3InKVxuICAgICAgICBjb25zdCBjb25jZXB0cyA9IGdldENvbmNlcHRzKHByZWRpY2F0ZSlcblxuICAgICAgICBpZiAoY29uY2VwdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0TmVzdGVkKHRoaXMuc2ltcGxlQ29uY2VwdHNbY29uY2VwdHNbMF1dLCBwcmVkaWNhdGUpXG5cbiAgICB9XG5cbiAgICBpcyhwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy5vYmplY3QgYXMgYW55KVtwcmVkaWNhdGVdICE9PSB1bmRlZmluZWQgLy8gVE9ETzogcmVtb3ZlXG4gICAgfVxuXG4gICAgc2V0QWxpYXMoY29uY2VwdE5hbWU6IHN0cmluZywgcHJvcFBhdGg6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2ltcGxlQ29uY2VwdHNbY29uY2VwdE5hbWVdID0gcHJvcFBhdGhcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0TmVzdGVkKHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogc3RyaW5nKSB7XG5cbiAgICAgICAgbGV0IHggPSB0aGlzLm9iamVjdFtwYXRoWzBdXVxuXG4gICAgICAgIHBhdGguc2xpY2UoMSwgLTIpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0gdGhpcy5vYmplY3RbcF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgeFtwYXRoW3BhdGgubGVuZ3RoIC0gMV1dID0gdmFsdWVcblxuICAgIH1cblxuICAgIHBvaW50T3V0KG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW47IH0pOiB2b2lkIHtcblxuICAgICAgICBpZiAodGhpcy5vYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3Quc3R5bGUub3V0bGluZSA9IG9wdHM/LnR1cm5PZmYgPyAnJyA6ICcjZjAwIHNvbGlkIDJweCdcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCBCYXNlRW52aXJvIGZyb20gXCIuL0Jhc2VFbnZpcm9cIjtcblxuZXhwb3J0IGludGVyZmFjZSBFbnZpcm8ge1xuICAgIGdldChpZDogSWQpOiBQcm9taXNlPFdyYXBwZXI+XG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0OiBXcmFwcGVyKTogdm9pZFxuICAgIHNldFBsYWNlaG9sZGVyKGlkOiBJZCk6IHZvaWRcbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSk6IFByb21pc2U8TWFwW10+IFxuICAgIGV4aXN0cyhpZDogSWQpOiBib29sZWFuXG4gICAgZ2V0IHZhbHVlcygpOiBXcmFwcGVyW11cbiAgICAvLyBnZXQga2V5cygpOiBJZFtdXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEVudmlybygpOiBFbnZpcm8ge1xuICAgIHJldHVybiBuZXcgQmFzZUVudmlybygpXG59IiwiaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuXG5leHBvcnQgY2xhc3MgUGxhY2Vob2xkZXIgaW1wbGVtZW50cyBXcmFwcGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHByZWRpY2F0ZXM6IHN0cmluZ1tdID0gW10sIHJlYWRvbmx5IG9iamVjdDogYW55ID0ge30pIHtcbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBzdHJpbmcsIHByb3BzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnByZWRpY2F0ZXMucHVzaChwcmVkaWNhdGUpO1xuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogc3RyaW5nLCAuLi5hcmdzOiBXcmFwcGVyW10pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlcy5pbmNsdWRlcyhwcmVkaWNhdGUpO1xuICAgIH1cblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBzdHJpbmcsIHByb3BPclN5bm9uQ29uY2VwdDogc3RyaW5nIHwgc3RyaW5nW10pOiB2b2lkIHtcbiAgICB9XG5cbiAgICBwb2ludE91dChvcHRzOiB7IHR1cm5PZmY6IGJvb2xlYW47IH0pOiB2b2lkIHtcblxuICAgIH1cbn1cbiIsImltcG9ydCBDb25jcmV0ZVdyYXBwZXIgZnJvbSBcIi4vQ29uY3JldGVXcmFwcGVyXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFdyYXBwZXIge1xuXG4gICAgc2V0KHByZWRpY2F0ZTogc3RyaW5nLCBwcm9wcz86IHN0cmluZ1tdKTogdm9pZCAvLyBvYmouc2V0KCdyZWQnKSwgb2JqLnNldCgnb24nLCBvYmoyKSAuLi5cbiAgICBpcyhwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogYm9vbGVhblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBzdHJpbmcsIHByb3BQYXRoOiBzdHJpbmdbXSk6IHZvaWRcbiAgICByZWFkb25seSBvYmplY3Q6IGFueVxuICAgIHBvaW50T3V0KG9wdHM/OiB7IHR1cm5PZmY6IGJvb2xlYW4gfSk6IHZvaWRcbiAgICAvLyBnZXQocHJlZGljYXRlOiBzdHJpbmcpOiBhbnlcbiAgICAvLyBnZXRQcm9wKHBhdGg6IHN0cmluZ1tdKTogYW55XG4gICAgLy8gc2V0UHJvcChwYXRoOiBzdHJpbmdbXSwgdmFsdWU6IGFueSk6IHZvaWRcbiAgICAvLyBkZXNjcmliZSgpOiBzdHJpbmdbXSAvLyBbJ2J1dHRvbicsICdyZWQnLCAnYmlnJywgLi4uXVxuICAgIC8vIHNldEFsaWFzKG5hbWU6IHN0cmluZywgcGF0aDogc3RyaW5nW10pOiB2b2lkIC8vIC5zZXRBbGlhcygnd2lkdGgnLCBbJ3N0eWxlJywgJ3dpZHRoJ10pXG4gICAgLy8gYWRkQ29uY2VwdChjb25jZXB0OnN0cmluZywgc2V0dGVyOigpPT52b2lkLCBpczooKT0+KTp2b2lkXG4gICAgLy8gZG9Tb21ldGhpbmcoY2xhdXNlOkNsYXVzZSk6YW55IC8vIGdldCBvd25lcnNoaXAgY2hhaW4gYW5kIGRvIHNvbWV0aGluZyB3aXRoIHRoZSBjbGF1c2UsIGNsYXVzZSBoYXMgZXZlcnl0aGluZywgaXQgaGFzIGluZm8gb24gc2lkZS1lZmZlY3RzLCBwcmVkaWNhdGUgZXRjLi4uPz8/XG5cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gd3JhcChvOiBhbnkpIHtcbiAgICByZXR1cm4gbmV3IENvbmNyZXRlV3JhcHBlcihvKVxufSIsImV4cG9ydCBjb25zdCBzZXR0ZXJQcmVmaXggPSAnc2V0J1xuZXhwb3J0IGNvbnN0IGlzUHJlZml4ID0gJ2lzJ1xuZXhwb3J0IGNvbnN0IGdldHRlclByZWZpeCA9ICdnZXQnXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25jZXB0cyhvYmplY3Q6IGFueSk6IHN0cmluZ1tdIHtcblxuICAgIC8vIFRPRE86IHRyeSBnZXR0aW5nIGEgY29uY2VwdCBmcm9tIGEgc3RyaW5nIG9iamVjdCB3aXRoIGEgXG4gICAgLy8gc3BlY2lhbCBkaWN0aW9uYXJ5LCBsaWtlIHtyZWQ6Y29sb3IsIGdyZWVuOmNvbG9yLCBibHVlOmNvbG9yfVxuICAgIGNvbnN0IHN0cmluZ0NvbmNlcHRzOiB7IFt4OiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcbiAgICAgICAgJ2dyZWVuJzogJ2NvbG9yJyxcbiAgICAgICAgJ3JlZCc6ICdjb2xvcicsXG4gICAgICAgICdibHVlJzogJ2NvbG9yJyxcbiAgICAgICAgJ2JsYWNrJzogJ2NvbG9yJyxcbiAgICAgICAgJ2JpZyc6ICdzaXplJ1xuICAgIH1cbiAgICBjb25zdCBtYXliZUNvbmNlcHQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHN0cmluZ0NvbmNlcHRzW29iamVjdC50b1N0cmluZygpXVxuXG4gICAgaWYgKG1heWJlQ29uY2VwdCkge1xuICAgICAgICByZXR1cm4gW21heWJlQ29uY2VwdF1cbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0XG4gICAgICAgIC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdClcbiAgICAgICAgLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QuX19wcm90b19fKSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHguaW5jbHVkZXMoc2V0dGVyUHJlZml4KSB8fCB4LmluY2x1ZGVzKGlzUHJlZml4KSlcbiAgICAgICAgLm1hcCh4ID0+IGdldENvbmNlcHROYW1lKHgpKVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZXR0ZXJOYW1lKGNvbmNlcHQ6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtzZXR0ZXJQcmVmaXh9XyR7Y29uY2VwdH1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJc05hbWUoY29uY2VwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke2lzUHJlZml4fV8ke2NvbmNlcHR9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0R2V0dGVyTmFtZShjb25jZXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7Z2V0dGVyUHJlZml4fV8ke2NvbmNlcHR9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uY2VwdE5hbWUobWV0aG9kOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbWV0aG9kXG4gICAgICAgIC5yZXBsYWNlKGlzUHJlZml4LCAnJylcbiAgICAgICAgLnJlcGxhY2Uoc2V0dGVyUHJlZml4LCAnJylcbiAgICAgICAgLnJlcGxhY2UoZ2V0dGVyUHJlZml4LCAnJylcbiAgICAgICAgLnJlcGxhY2UoJ18nLCAnJylcbn1cbiIsImltcG9ydCBtYWluIGZyb20gXCIuL21haW4vbWFpblwiO1xuaW1wb3J0IGF1dG90ZXN0ZXIgZnJvbSBcIi4vdGVzdHMvYXV0b3Rlc3RlclwiO1xuaW1wb3J0IHsgdG9jbGF1c2V0ZXN0cyB9IGZyb20gXCIuL3Rlc3RzL3RvY2xhdXNldGVzdHNcIjtcblxuKGFzeW5jICgpPT57XG4gICAgYXdhaXQgdG9jbGF1c2V0ZXN0cygpXG4gICAgYXV0b3Rlc3RlcigpXG59KSgpXG5cbi8vIG1haW4oKSIsImltcG9ydCBUb2tlbiwgeyBnZXRUb2tlbkNvbnMgfSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCB7IGdldExleGVtZXMgfSBmcm9tIFwiLi9MZXhlbWVcIjtcbmltcG9ydCBMZXhlciwgeyBBc3NlcnRBcmdzLCBDb25zdHJ1Y3RvciB9IGZyb20gXCIuL0xleGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVhZ2VyTGV4ZXIgaW1wbGVtZW50cyBMZXhlciB7XG5cbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgdG9rZW5zOiBUb2tlbltdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlclxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nKSB7XG5cbiAgICAgICAgdGhpcy50b2tlbnMgPSBzb3VyY2VDb2RlXG4gICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAuc3BsaXQoL1xccyt8XFwuLylcbiAgICAgICAgICAgIC5tYXAoZSA9PiAhZSA/ICcuJyA6IGUpXG4gICAgICAgICAgICAuZmxhdE1hcChzdHJpbmcgPT4gZ2V0TGV4ZW1lcyhzdHJpbmcpXG4gICAgICAgICAgICAgICAgLm1hcChsID0+IG5ldyAoZ2V0VG9rZW5Db25zKGwudHlwZSkpKGwubmFtZSkpKVxuXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3Rva2VucycsIHRoaXMudG9rZW5zKVxuICAgICAgICB0aGlzLl9wb3MgPSAwXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogVG9rZW4ge1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5fcG9zXVxuICAgIH1cblxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2Vycm9yTXNnfSBhdCAke3RoaXMuX3Bvc31gKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gY3VycmVudCB0b2tlbiBpZmYgb2YgZ2l2ZW4gdHlwZSBhbmQgbW92ZSB0byBuZXh0OyBcbiAgICAgKiBlbHNlIHJldHVybiB1bmRlZmluZWQgYW5kIGRvbid0IG1vdmUuXG4gICAgICogQHBhcmFtIGFyZ3MgXG4gICAgICogQHJldHVybnMgXG4gICAgICovXG4gICAgYXNzZXJ0PFQ+KGNsYXp6OiBDb25zdHJ1Y3RvcjxUPiwgYXJnczogQXNzZXJ0QXJncyk6IFQgfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLnBlZWtcblxuICAgICAgICBpZiAoY3VycmVudCBpbnN0YW5jZW9mIGNsYXp6KSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRcbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmVycm9yT3V0ID8/IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3JvYWsoYXJncy5lcnJvck1zZyA/PyAnJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVG9rZW5UeXBlIH0gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1Rva2VuXCJcbmltcG9ydCB7IGxleGVtZXMgfSBmcm9tIFwiLi9sZXhlbWVzXCJcblxuZXhwb3J0IGludGVyZmFjZSBMZXhlbWUge1xuICAgIC8qKnVzdWFsbHkgcm9vdCBmb3JtKi8gcmVhZG9ubHkgbmFtZTogc3RyaW5nXG4gICAgLyoqdG9rZW4gdHlwZSovIHJlYWRvbmx5IHR5cGU6IFRva2VuVHlwZVxuICAgIC8qKnVzZWZ1bCBmb3IgaXJyZWd1bGFyIHN0dWZmKi8gcmVhZG9ubHkgZm9ybXM/OiBzdHJpbmdbXVxuICAgIC8qKnJlZmVycyB0byB2ZXJiIGNvbmp1Z2F0aW9ucyBvciBwbHVyYWwgZm9ybXMqLyByZWFkb25seSByZWd1bGFyPzogYm9vbGVhblxuICAgIC8qKnNlbWFudGljYWwgZGVwZW5kZWNlKi8gcmVhZG9ubHkgZGVyaXZlZEZyb20/OiBzdHJpbmdcbiAgICAvKipzZW1hbnRpY2FsIGVxdWl2YWxlbmNlKi8gcmVhZG9ubHkgYWxpYXNGb3I/OiBzdHJpbmdcbiAgICAvKiptYWRlIHVwIG9mIG1vcmUgbGV4ZW1lcyovIHJlYWRvbmx5IGNvbnRyYWN0aW9uRm9yPzogc3RyaW5nW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1zT2YobGV4ZW1lOiBMZXhlbWUpIHtcblxuICAgIHJldHVybiBbbGV4ZW1lLm5hbWVdLmNvbmNhdChsZXhlbWU/LmZvcm1zID8/IFtdKVxuICAgICAgICAuY29uY2F0KGxleGVtZS5yZWd1bGFyID8gW2Ake2xleGVtZS5uYW1lfXNgXSA6IFtdKVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlbWVzKHdvcmQ6IHN0cmluZyk6IExleGVtZVtdIHtcblxuICAgIGNvbnN0IGxleGVtZSA9IGxleGVtZXMuZmlsdGVyKHggPT4gZm9ybXNPZih4KS5pbmNsdWRlcyh3b3JkKSlbMF1cbiAgICAgICAgPz8geyBuYW1lOiB3b3JkLCB0eXBlOiAnYWRqJyB9XG5cbiAgICByZXR1cm4gbGV4ZW1lLmNvbnRyYWN0aW9uRm9yID9cbiAgICAgICAgbGV4ZW1lLmNvbnRyYWN0aW9uRm9yLmZsYXRNYXAoeCA9PiBnZXRMZXhlbWVzKHgpKSA6XG4gICAgICAgIFtsZXhlbWVdXG5cbn0iLCJpbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1Rva2VuXCJcbmltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgTGV4ZXJ7XG4gICAgZ2V0IHBlZWsoKTpUb2tlblxuICAgIGdldCBwb3MoKTpudW1iZXJcbiAgICBnZXQgaXNFbmQoKTpib29sZWFuXG4gICAgbmV4dCgpOnZvaWRcbiAgICBiYWNrVG8ocG9zOm51bWJlcik6dm9pZFxuICAgIGNyb2FrKGVycm9yTXNnOnN0cmluZyk6dm9pZCAgIFxuICAgIGFzc2VydCA8VD4oY2xheno6Q29uc3RydWN0b3I8VD4sIGFyZ3M6QXNzZXJ0QXJncyk6IFR8dW5kZWZpbmVkIFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzc2VydEFyZ3N7XG4gICAgZXJyb3JNc2c/OnN0cmluZ1xuICAgIGVycm9yT3V0Pzpib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlcihzb3VyY2VDb2RlOnN0cmluZyk6TGV4ZXJ7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUpXG59XG5cbmV4cG9ydCB0eXBlIENvbnN0cnVjdG9yPFQ+ID0gbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gVFxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCI7XG5cblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IExleGVtZVtdID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ2hhdmUnLFxuICAgICAgICB0eXBlOiAnbXZlcmInLFxuICAgICAgICBmb3JtczogWydoYXZlJywgJ2hhcyddLFxuICAgICAgICByZWd1bGFyOiBmYWxzZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdidXR0b24nLFxuICAgICAgICB0eXBlOiAnbm91bicsXG4gICAgICAgIHJlZ3VsYXIgOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2NsaWNrJyxcbiAgICAgICAgdHlwZTogJ212ZXJiJyxcbiAgICAgICAgZm9ybXM6IFsnY2xpY2snXSxcbiAgICAgICAgcmVndWxhcjogdHJ1ZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdjbGlja2VkJyxcbiAgICAgICAgdHlwZTogJ2FkaicsXG4gICAgICAgIGRlcml2ZWRGcm9tOiAnY2xpY2snXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3ByZXNzZWQnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgYWxpYXNGb3I6ICdjbGlja2VkJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdjYXQnLFxuICAgICAgICB0eXBlOiAnbm91bidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYmUnLFxuICAgICAgICB0eXBlOiAnY29wdWxhJyxcbiAgICAgICAgZm9ybXM6IFsnaXMnLCAnYXJlJ10sXG4gICAgICAgIHJlZ3VsYXI6IGZhbHNlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogXCJpc24ndFwiLFxuICAgICAgICB0eXBlOiAnY29udHJhY3Rpb24nLFxuICAgICAgICBjb250cmFjdGlvbkZvcjogWydpcycsICdub3QnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6IFwicmVkXCIsXG4gICAgICAgIHR5cGU6IFwiYWRqXCJcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiBcImdyZWVuXCIsXG4gICAgICAgIHR5cGU6IFwiYWRqXCJcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiBcImV4aXN0XCIsXG4gICAgICAgIHR5cGU6IFwiaXZlcmJcIixcbiAgICAgICAgcmVndWxhcjogdHJ1ZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdkbycsXG4gICAgICAgIHR5cGU6ICdodmVyYicsXG4gICAgICAgIHJlZ3VsYXI6IGZhbHNlLFxuICAgICAgICBmb3JtczogWydkbycsICdkb2VzJ11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnc29tZScsXG4gICAgICAgIHR5cGU6ICdleGlzdHF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdldmVyeScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYWxsJyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhbnknLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3RvJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICd3aXRoJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdmcm9tJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdvZicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnb3ZlcicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnb24nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2F0JyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICd0aGVuJyxcbiAgICAgICAgdHlwZTogJ3RoZW4nIC8vIGZpbGxlciB3b3JkXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2lmJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3doZW4nLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYmVjYXVzZScsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICd3aGlsZScsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICd0aGF0JyxcbiAgICAgICAgdHlwZTogJ3JlbHByb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ25vdCcsXG4gICAgICAgIHR5cGU6ICduZWdhdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAndGhlJyxcbiAgICAgICAgdHlwZTogJ2RlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYScsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYW4nLFxuICAgICAgICB0eXBlOiAnaW5kZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJy4nLFxuICAgICAgICB0eXBlOiAnZnVsbHN0b3AnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2FuZCcsXG4gICAgICAgIHR5cGU6ICdub25zdWJjb25qJ1xuICAgIH1cbl0iLCJpbXBvcnQgQXN0IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Bc3RcIjtcbmltcG9ydCBCaW5hcnlRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQmluYXJ5UXVlc3Rpb25cIjtcbmltcG9ydCBDb21wb3VuZFNlbnRlbmNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Db21wb3VuZFNlbnRlbmNlXCI7XG5pbXBvcnQgRGVjbGFyYXRpb24gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0RlY2xhcmF0aW9uXCI7XG5pbXBvcnQgUXVlc3Rpb24gZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1F1ZXN0aW9uXCI7XG5pbXBvcnQgU2ltcGxlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1NpbXBsZVNlbnRlbmNlXCI7XG5pbXBvcnQgVmVyYlNlbnRlbmNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9WZXJiU2VudGVuY2VcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Db21wbGVtZW50XCI7XG5pbXBvcnQgTm91blBocmFzZSBmcm9tIFwiLi4vYXN0L3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IFN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IENvbXBsZXhTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db21wbGV4U2VudGVuY2VcIjtcbmltcG9ydCBDb25qdW5jdGl2ZVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0Nvbmp1bmN0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBDb3B1bGFRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9Db3B1bGFRdWVzdGlvblwiO1xuaW1wb3J0IENvcHVsYVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvcHVsYVNlbnRlbmNlXCI7XG5pbXBvcnQgSW50cmFuc2l0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvSW50cmFuc2l0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBNb25vdHJhbnNpdGl2ZVNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL01vbm90cmFuc2l0aXZlU2VudGVuY2VcIjtcbmltcG9ydCBBZGplY3RpdmUgZnJvbSBcIi4uL2FzdC90b2tlbnMvQWRqZWN0aXZlXCI7XG5pbXBvcnQgQXJ0aWNsZSBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BcnRpY2xlXCI7XG5pbXBvcnQgQ29wdWxhIGZyb20gXCIuLi9hc3QvdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IElWZXJiIGZyb20gXCIuLi9hc3QvdG9rZW5zL0lWZXJiXCI7XG5pbXBvcnQgTVZlcmIgZnJvbSBcIi4uL2FzdC90b2tlbnMvTVZlcmJcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9OZWdhdGlvblwiO1xuaW1wb3J0IE5vdW4gZnJvbSBcIi4uL2FzdC90b2tlbnMvTm91blwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL1ByZXBvc2l0aW9uXCI7XG5pbXBvcnQgUXVhbnRpZmllciBmcm9tIFwiLi4vYXN0L3Rva2Vucy9RdWFudGlmaWVyXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL1N1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuaW1wb3J0IFRoZW4gZnJvbSBcIi4uL2FzdC90b2tlbnMvVGhlblwiO1xuaW1wb3J0IExleGVyLCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCI7XG5pbXBvcnQgUGFyc2VyIGZyb20gXCIuL1BhcnNlclwiO1xuaW1wb3J0IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlIGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Db3B1bGFTdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vYXN0L3Rva2Vucy9SZWxhdGl2ZVByb25vdW5cIjtcbmltcG9ydCBDb25zdGl0dWVudCBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCBGdWxsU3RvcCBmcm9tIFwiLi4vYXN0L3Rva2Vucy9GdWxsU3RvcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY1BhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBwcm90ZWN0ZWQgbHg6IExleGVyXG5cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2VDb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5seCA9IGdldExleGVyKHNvdXJjZUNvZGUpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRyeTxUIGV4dGVuZHMgQXN0PihtZXRob2Q6ICgpID0+IFQpIHtcblxuICAgICAgICBjb25zdCBtZW1lbnRvID0gdGhpcy5seC5wb3NcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZCgpXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmRlYnVnKChlcnJvciBhcyBFcnJvcikubWVzc2FnZSlcbiAgICAgICAgICAgIHRoaXMubHguYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBlcnJvck91dChlcnJvck1zZzogc3RyaW5nKTogQ29uc3RpdHVlbnQge1xuICAgICAgICB0aGlzLmx4LmNyb2FrKGVycm9yTXNnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNc2cpXG4gICAgfVxuXG4gICAgcGFyc2VBbGwoKTogQ29uc3RpdHVlbnRbXSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogQ29uc3RpdHVlbnRbXSA9IFtdXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmx4LmlzRW5kKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2godGhpcy5wYXJzZSgpKVxuICAgICAgICAgICAgdGhpcy5seC5hc3NlcnQoRnVsbFN0b3AsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cblxuICAgIHBhcnNlKCk6IENvbnN0aXR1ZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VEZWNsYXJhdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VOb3VuUGhyYXNlKSAvLyBmb3IgcXVpY2sgdG9waWMgcmVmZXJlbmNlXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VEZWNsYXJhdGlvbiA9ICgpOiBEZWNsYXJhdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29tcG91bmQpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlU2ltcGxlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VEZWNsYXJhdGlvbigpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VRdWVzdGlvbiA9ICgpOiBRdWVzdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQmluYXJ5UXVlc3Rpb24pXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVF1ZXN0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVNpbXBsZSA9ICgpOiBTaW1wbGVTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlVmVyYlNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VTaW1wbGUoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG91bmQgPSAoKTogQ29tcG91bmRTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29tcGxleClcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VDb25qdW5jdGl2ZSlcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlQ29tcG91bmQoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlVmVyYlNlbnRlbmNlID0gKCk6IFZlcmJTZW50ZW5jZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnBhcnNlTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlVmVyYlNlbnRlbmNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVNlbnRlbmNlID0gKCk6IENvcHVsYVNlbnRlbmNlID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7IGVycm9yTXNnOiAncGFyc2VDb3B1bGFTZW50ZW5jZSgpLCBleHBlY3RlZCBjb3B1bGEnIH0pXG4gICAgICAgIGNvbnN0IG5lZ2F0aW9uID0gdGhpcy5seC5hc3NlcnQoTmVnYXRpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFTZW50ZW5jZShzdWJqZWN0LCBjb3B1bGEgYXMgQ29wdWxhLCBwcmVkaWNhdGUsIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBsZXggPSAoKTogQ29tcGxleFNlbnRlbmNlID0+IHtcblxuICAgICAgICBjb25zdCBzdWJjb25qID0gdGhpcy5seC5hc3NlcnQoU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuXG4gICAgICAgIGlmIChzdWJjb25qKSB7XG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHRoaXMubHguYXNzZXJ0KFRoZW4sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgICAgICBjb25zdCBvdXRjb21lID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICByZXR1cm4gbmV3IENvbXBsZXhTZW50ZW5jZShjb25kaXRpb24sIG91dGNvbWUsIHN1YmNvbmopXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBvdXRjb21lID0gdGhpcy5wYXJzZVNpbXBsZSgpXG4gICAgICAgICAgICBjb25zdCBzdWJjb25qID0gdGhpcy5seC5hc3NlcnQoU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLCB7IGVycm9yT3V0OiB0cnVlLCBlcnJvck1zZzogJ2V4cGVjdGVkIHN1Ym9yZGluYXRpbmcgY29uanVuY3Rpb24nIH0pXG4gICAgICAgICAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29tcGxleFNlbnRlbmNlKGNvbmRpdGlvbiwgb3V0Y29tZSwgc3ViY29uaiBhcyBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUludHJhbnNpdGl2ZVNlbnRlbmNlID0gKCk6IEludHJhbnNpdGl2ZVNlbnRlbmNlID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgbmVnYXRpb24gPSB0aGlzLmx4LmFzc2VydChOZWdhdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgaXZlcmIgPSB0aGlzLmx4LmFzc2VydChJVmVyYiwgeyBlcnJvck1zZzogJ3BhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UoKSwgZXhwZWN0ZWQgaS12ZXJiJyB9KVxuICAgICAgICBjb25zdCBjb21wbGVtZW50cyA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG4gICAgICAgIHJldHVybiBuZXcgSW50cmFuc2l0aXZlU2VudGVuY2Uoc3ViamVjdCwgaXZlcmIgYXMgSVZlcmIsIGNvbXBsZW1lbnRzLCBuZWdhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlID0gKCk6IE1vbm90cmFuc2l0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBuZWdhdGlvbiA9IHRoaXMubHguYXNzZXJ0KE5lZ2F0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBtdmVyYiA9IHRoaXMubHguYXNzZXJ0KE1WZXJiLCB7IGVycm9yTXNnOiAncGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlKCksIGV4cGVjdGVkIGktdmVyYicgfSlcbiAgICAgICAgY29uc3QgY3MxID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBjczIgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKVxuICAgICAgICByZXR1cm4gbmV3IE1vbm90cmFuc2l0aXZlU2VudGVuY2Uoc3ViamVjdCwgbXZlcmIgYXMgTVZlcmIsIG9iamVjdCwgY3MxLmNvbmNhdChjczIpLCBuZWdhdGlvbilcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VCaW5hcnlRdWVzdGlvbiA9ICgpOiBCaW5hcnlRdWVzdGlvbiA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhUXVlc3Rpb24pXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZUJpbmFyeVF1ZXN0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVF1ZXN0aW9uID0gKCk6IENvcHVsYVF1ZXN0aW9uID0+IHtcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7IGVycm9yTXNnOiAncGFyc2VDb3B1bGFRdWVzdGlvbigpLCBleHBlY3RlZCBjb3B1bGEnIH0pXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFRdWVzdGlvbihzdWJqZWN0LCBwcmVkaWNhdGUsIGNvcHVsYSBhcyBDb3B1bGEpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTm91blBocmFzZSA9ICgpOiBOb3VuUGhyYXNlID0+IHtcbiAgICAgICAgY29uc3QgcXVhbnRpZmllciA9IHRoaXMubHguYXNzZXJ0KFF1YW50aWZpZXIsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IGFydGljbGUgPSB0aGlzLmx4LmFzc2VydChBcnRpY2xlLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuXG4gICAgICAgIGxldCBhZGplY3RpdmVzID0gW11cbiAgICAgICAgbGV0IGFkalxuXG4gICAgICAgIHdoaWxlIChhZGogPSB0aGlzLmx4LmFzc2VydChBZGplY3RpdmUsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pKSB7XG4gICAgICAgICAgICBhZGplY3RpdmVzLnB1c2goYWRqKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgbm91biA9IHRoaXMubHguYXNzZXJ0KE5vdW4sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IHN1Ym9yZGluYXRlQ2xhdXNlID0gdGhpcy50cnkodGhpcy5wYXJzZVN1Ym9yZGluYXRlQ2xhdXNlKVxuICAgICAgICBjb25zdCBjb21wbGVtZW50cyA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG5cbiAgICAgICAgcmV0dXJuIG5ldyBOb3VuUGhyYXNlKGFkamVjdGl2ZXMsIGNvbXBsZW1lbnRzLCBub3VuLCBxdWFudGlmaWVyLCBhcnRpY2xlLCBzdWJvcmRpbmF0ZUNsYXVzZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wbGVtZW50cyA9ICgpOiBDb21wbGVtZW50W10gPT4ge1xuXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gW11cbiAgICAgICAgbGV0IGNvbXBcblxuICAgICAgICB3aGlsZSAoY29tcCA9IHRoaXMudHJ5KHRoaXMucGFyc2VDb21wbGVtZW50KSkge1xuICAgICAgICAgICAgY29tcGxlbWVudHMucHVzaChjb21wKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvbXBsZW1lbnRzXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcGxlbWVudCA9ICgpOiBDb21wbGVtZW50ID0+IHtcbiAgICAgICAgY29uc3QgcHJlcG9zaXRpb24gPSB0aGlzLmx4LmFzc2VydChQcmVwb3NpdGlvbiwgeyBlcnJvck1zZzogJ3BhcnNlQ29tcGxlbWVudCgpIGV4cGVjdGVkIHByZXBvc2l0aW9uJyB9KVxuICAgICAgICBjb25zdCBub3VuUGhyYXNlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvbXBsZW1lbnQocHJlcG9zaXRpb24gYXMgUHJlcG9zaXRpb24sIG5vdW5QaHJhc2UpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlU3Vib3JkaW5hdGVDbGF1c2UgPSAoKTogU3Vib3JkaW5hdGVDbGF1c2UgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VTdWJvcmRpbmF0ZUNsYXVzZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSA9ICgpOiBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbHByb24gPSB0aGlzLmx4LmFzc2VydChSZWxhdGl2ZVByb25vdW4sIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKCkgZXhwZWN0ZWQgcmVsYXRpdmUgcHJvbm91bicgfSlcbiAgICAgICAgY29uc3QgY29wdWxhID0gdGhpcy5seC5hc3NlcnQoQ29wdWxhLCB7IGVycm9yTXNnOiAncGFyc2VDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSgpIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgcmV0dXJuIG5ldyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZShyZWxwcm9uIGFzIFJlbGF0aXZlUHJvbm91biwgc3ViamVjdCwgY29wdWxhIGFzIENvcHVsYSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb25qdW5jdGl2ZSA9ICgpOiBDb25qdW5jdGl2ZVNlbnRlbmNlID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOT1QgSU1QTEVNRU5URUQhIFRPRE8hJylcbiAgICB9XG5cbn0iLCJpbXBvcnQgQ29uc3RpdHVlbnQgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgQmFzaWNQYXJzZXIgZnJvbSBcIi4vQmFzaWNQYXJzZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIFBhcnNlcntcbiAgICBwYXJzZSgpOkNvbnN0aXR1ZW50ICAgXG4gICAgcGFyc2VBbGwoKTpDb25zdGl0dWVudFtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTpzdHJpbmcpOlBhcnNlcntcbiAgICByZXR1cm4gbmV3IEJhc2ljUGFyc2VyKHNvdXJjZUNvZGUpXG59IiwiaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4uL2JyYWluL0Jhc2ljQnJhaW5cIjtcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2JyYWluL0JyYWluXCI7XG5cbmNvbnN0IHRlc3RzID0gW3Rlc3QxLCB0ZXN0MiwgdGVzdDMsIHRlc3Q0XVxuXG4vKipcbiAqIEludGVncmF0aW9uIHRlc3RzXG4qL1xuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gYXV0b3Rlc3RlcigpIHtcblxuICAgIGZvciAoY29uc3QgdGVzdCBvZiB0ZXN0cykge1xuICAgICAgICBjb25zb2xlLmxvZyhhd2FpdCB0ZXN0KCkgPyAnc3VjY2VzcycgOiAnZmFpbCcsIHRlc3QubmFtZSlcbiAgICAgICAgYXdhaXQgd2FpdCgyMDApXG4gICAgICAgIGNsZWFyRG9tKClcbiAgICB9XG5cbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdDEoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBhd2FpdCBnZXRCcmFpbigpXG4gICAgYXdhaXQgYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQuIHggaXMgYSBidXR0b24uIHkgaXMgYSBncmVlbiBidXR0b24uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChhd2FpdCBicmFpbi5leGVjdXRlKCdhIGdyZWVuIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAnZ3JlZW4nXG4gICAgY29uc3QgYXNzZXJ0MiA9IChhd2FpdCBicmFpbi5leGVjdXRlKCdhIHJlZCBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRlc3QyKCkge1xuICAgIGNvbnN0IGJyYWluID0gYXdhaXQgZ2V0QnJhaW4oKVxuICAgIGF3YWl0IGJyYWluLmV4ZWN1dGUoJ3ggaXMgcmVkLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGJyYWluIGFzIEJhc2ljQnJhaW4pLmVudmlyby52YWx1ZXMubGVuZ3RoID09PSAxXG4gICAgcmV0dXJuIGFzc2VydDFcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdDMoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBhd2FpdCBnZXRCcmFpbigpXG4gICAgYXdhaXQgYnJhaW4uZXhlY3V0ZSgneSBpcyBhIGJ1dHRvbi4geCBpcyByZWQuIHkgaXMgYSBncmVlbiBidXR0b24uIHggaXMgYSBidXR0b24uIHogaXMgYSBibGFjayBidXR0b24uJyk7XG4gICAgY29uc3QgYXNzZXJ0MSA9IChhd2FpdCBicmFpbi5leGVjdXRlKCdhIHJlZCBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ3JlZCdcbiAgICBjb25zdCBhc3NlcnQyID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgZ3JlZW4gYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQzID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgYmxhY2sgYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdibGFjaydcbiAgICByZXR1cm4gYXNzZXJ0MSAmJiBhc3NlcnQyICYmIGFzc2VydDNcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdDQoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBhd2FpdCBnZXRCcmFpbigpXG4gICAgYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYSBidXR0b24gaXMgYSBidXR0b24uJyk7XG4gICAgY29uc3QgYnV0dG9uID0gYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYnV0dG9uJylcbiAgICByZXR1cm4gYnV0dG9uICE9PSB1bmRlZmluZWRcbn1cblxuYXN5bmMgZnVuY3Rpb24gd2FpdChtaWxsaXNlY3M6IG51bWJlcikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgob2ssIGVycikgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IG9rKHRydWUpLCBtaWxsaXNlY3MpXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gY2xlYXJEb20oKSB7XG4gICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnJ1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZCA9ICd3aGl0ZSdcbn0iLCJpbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi4vcGFyc2VyL1BhcnNlclwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdG9jbGF1c2V0ZXN0cygpIHtcblxuICAgIGNvbnN0IHRlc3RzID0gW1xuICAgICAgICAndGhlIGNvbG9yIG9mIGFueSBidXR0b24gaXMgcmVkJyxcbiAgICAgICAgJ2V2ZXJ5IGJ1dHRvbiBpcyByZWQnLFxuICAgICAgICAnZXZlcnkgYnV0dG9uIGlzIGEgYnV0dG9uJyxcbiAgICAgICAgJ3RoZSBjb2xvciBvZiBhbnkgYnV0dG9uIGlzIHRoZSBiYWNrZ3JvdW5kIG9mIHRoZSBzdHlsZSBvZiB0aGUgYnV0dG9uJyxcbiAgICAgICAgJ3dpZHRoIG9mIGFueSBidXR0b24gaXMgd2lkdGggb2Ygc3R5bGUgb2YgYnV0dG9uJ1xuICAgIF1cblxuICAgIGZvciAoY29uc3QgdCBvZiB0ZXN0cykge1xuICAgICAgICBjb25zb2xlLmxvZyh0KVxuICAgICAgICBjb25zdCBjbGF1c2UgPSBhd2FpdCBnZXRQYXJzZXIodCkucGFyc2UoKS50b0NsYXVzZSgpXG4gICAgICAgIGNvbnN0IHN0cmluZ1JlcHIgPSBjbGF1c2UudG9TdHJpbmcoKVxuICAgICAgICBjb25zb2xlLmxvZyh7IHN0cmluZ1JlcHIgfSlcbiAgICAgICAgLy8gY29uc3QgdG9wTGV2ZWwgPSBjbGF1c2UudG9wTGV2ZWwoKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyh7IHRvcExldmVsIH0pXG4gICAgICAgIC8vIGNvbnN0IG93bmVyc2hpcENoYWlucyA9IHRvcExldmVsLm1hcChlID0+IGNsYXVzZS5nZXRPd25lcnNoaXBDaGFpbihlKSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coeyBvd25lcnNoaXBDaGFpbnMgfSlcbiAgICAgICAgLy8gY29uc3Qgb3duZXJzaGlwQ2hhaW5zV2l0aE5hbWVzID0gb3duZXJzaGlwQ2hhaW5zLm1hcChlID0+IGUuZmxhdE1hcChlID0+IGNsYXVzZS5kZXNjcmliZShlKVswXSkpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHsgb3duZXJzaGlwQ2hhaW5zV2l0aE5hbWVzIH0pXG4gICAgfVxuXG59XG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL2FwcC9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=