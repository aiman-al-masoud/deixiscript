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
const Actuator_1 = __webpack_require__(/*! ./actuator/Actuator */ "./app/src/actuator/Actuator.ts");
const Enviro_1 = __importDefault(__webpack_require__(/*! ./enviro/Enviro */ "./app/src/enviro/Enviro.ts"));
function getAnaphora() {
    return new EnviroAnaphora();
}
exports.getAnaphora = getAnaphora;
class EnviroAnaphora {
    constructor(enviro = (0, Enviro_1.default)({ root: undefined })) {
        this.enviro = enviro;
    }
    assert(clause) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, Actuator_1.getActuator)().takeAction(clause.copy({ noAnaphora: true }), this.enviro);
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
class BaseActuator {
    takeAction(clause, enviro) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const a of yield clause.toAction(clause)) {
                yield a.run(enviro); // TODO: make this async-safe
            }
        });
    }
}
exports["default"] = BaseActuator;


/***/ }),

/***/ "./app/src/actuator/BasicAction.ts":
/*!*****************************************!*\
  !*** ./app/src/actuator/BasicAction.ts ***!
  \*****************************************/
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
class BasicAction {
    constructor(clause, topLevel) {
        this.clause = clause;
        this.topLevel = topLevel;
    }
    run(enviro) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.clause.noAnaphora) {
                return yield new Edit_1.default(this.clause.args[0], this.clause.predicate, []).run(enviro);
            }
            if (!this.topLevel.topLevel().includes(this.clause.args[0])) { // avoid NON top-level entities
                return;
            }
            const q = this.topLevel.theme.about(this.clause.args[0]);
            const maps = yield enviro.query(q);
            const id = (_b = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[this.clause.args[0]]) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)();
            if (!(yield enviro.get(id))) {
                enviro.setPlaceholder(id);
            }
            if (isCreatorAction(this.clause.predicate)) {
                new Create_1.default(id, this.clause.predicate).run(enviro);
            }
            else { // Edit Action
                const props = this.topLevel
                    .getOwnershipChain(this.clause.args[0])
                    .slice(1)
                    .map(e => this.topLevel.theme.describe(e)[0]);
                new Edit_1.default(id, this.clause.predicate, props).run(enviro);
            }
        });
    }
}
exports["default"] = BasicAction;
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (enviro.exists(this.id)) { //  existence check prior to creating
                return;
            }
            if (isDomElem(this.predicate)) {
                const o = document.createElement(this.predicate);
                o.id = this.id + '';
                o.textContent = 'default';
                const newObj = (0, Wrapper_1.wrap)(o);
                newObj.set(this.predicate);
                enviro.set(this.id, newObj);
                (_a = enviro.root) === null || _a === void 0 ? void 0 : _a.appendChild(o);
                // console.log('Create runs!')
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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const obj = (_a = yield enviro.get(this.id)) !== null && _a !== void 0 ? _a : enviro.setPlaceholder(this.id);
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
    constructor(enviro = (0, Enviro_1.default)({ root: document.body }), actuator = (0, Actuator_1.getActuator)()) {
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
                    objects.forEach(o => o === null || o === void 0 ? void 0 : o.pointOut());
                    results = [...results, ...objects.map(o => o === null || o === void 0 ? void 0 : o.object)];
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
        return new And(this.clause1.copy(opts), //{ map: opts?.map }
        this.clause2.copy(opts), //{ map: opts?.map }
        this.clause2IsRheme, (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.noAnaphora) !== null && _a !== void 0 ? _a : this.noAnaphora, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
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
    toAction(topLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.clause1.toAction(topLevel)).concat(yield this.clause2.toAction(topLevel));
        });
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
const BasicAction_1 = __importDefault(__webpack_require__(/*! ../actuator/BasicAction */ "./app/src/actuator/BasicAction.ts"));
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
    toAction(topLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            return [new BasicAction_1.default(this, topLevel)];
        });
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
const emptyClause = () => new EmptyClause_1.EmptyClause();
exports.emptyClause = emptyClause;


/***/ }),

/***/ "./app/src/clauses/EmptyClause.ts":
/*!****************************************!*\
  !*** ./app/src/clauses/EmptyClause.ts ***!
  \****************************************/
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
        return '';
    }
    toAction(topLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            // throw new Error("Method not implemented.");
            return [];
        });
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
    toAction(topLevel) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
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
    constructor(root, dictionary = {}) {
        this.root = root;
        this.dictionary = dictionary;
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dictionary[id];
        });
    }
    get values() {
        return Object.values(this.dictionary);
    }
    setPlaceholder(id) {
        this.dictionary[id] = new Placeholder_1.Placeholder();
        return this.dictionary[id];
    }
    exists(id) {
        return this.dictionary[id] && !(this.dictionary[id] instanceof Placeholder_1.Placeholder);
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
function getEnviro(opts) {
    return new BaseEnviro_1.default(opts === null || opts === void 0 ? void 0 : opts.root);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Qy9DO0lBRUwsQ0FBQztDQUFBO0FBdkJELHNDQXVCQzs7Ozs7OztVQ3pCRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9BbmFwaG9yYS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FjdHVhdG9yL0FjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYWN0dWF0b3IvQmFzZUFjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYWN0dWF0b3IvQmFzaWNBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hY3R1YXRvci9DcmVhdGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hY3R1YXRvci9FZGl0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L2ludGVyZmFjZXMvVG9rZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Db21wbGVtZW50LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3BocmFzZXMvQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvcGhyYXNlcy9Ob3VuUGhyYXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Db21wbGV4U2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL0NvcHVsYVF1ZXN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3NlbnRlbmNlcy9Db3B1bGFTZW50ZW5jZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC9zZW50ZW5jZXMvSW50cmFuc2l0aXZlU2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3Qvc2VudGVuY2VzL01vbm90cmFuc2l0aXZlU2VudGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0Fic3RyYWN0VG9rZW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0FkamVjdGl2ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQXJ0aWNsZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvQ29wdWxhLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9GdWxsU3RvcC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvSFZlcmIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL0lWZXJiLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9NVmVyYi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTmVnYXRpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL05vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvTm91bi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvUHJlcG9zaXRpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1F1YW50aWZpZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9hc3QvdG9rZW5zL1JlbGF0aXZlUHJvbm91bi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2FzdC90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYXN0L3Rva2Vucy9UaGVuLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvYnJhaW4vQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2JyYWluL0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0Jhc2ljQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9DbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL0VtcHR5Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9JZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2NsYXVzZXMvSW1wbHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9jbGF1c2VzL2dldE93bmVyc2hpcENoYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy9oYXNoU3RyaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvY2xhdXNlcy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2Vudmlyby9CYXNlRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvZW52aXJvL0NvbmNyZXRlV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2Vudmlyby9FbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9lbnZpcm8vUGxhY2Vob2xkZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy9lbnZpcm8vV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2Vudmlyby9nZXRDb25jZXB0cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvbGV4ZXIvbGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9CYXNpY1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvLi9hcHAvc3JjL3BhcnNlci9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4Ly4vYXBwL3NyYy90ZXN0cy9hdXRvdGVzdGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3h4eC8uL2FwcC9zcmMvdGVzdHMvdG9jbGF1c2V0ZXN0cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMveHh4L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy94eHgvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldEFjdHVhdG9yIH0gZnJvbSBcIi4vYWN0dWF0b3IvQWN0dWF0b3JcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi9jbGF1c2VzL0lkXCJcbmltcG9ydCBnZXRFbnZpcm8gZnJvbSBcIi4vZW52aXJvL0Vudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFuYXBob3JhIHtcbiAgICBhc3NlcnQoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPHZvaWQ+XG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QW5hcGhvcmEoKSB7XG4gICAgcmV0dXJuIG5ldyBFbnZpcm9BbmFwaG9yYSgpXG59XG5cbmNsYXNzIEVudmlyb0FuYXBob3JhIGltcGxlbWVudHMgQW5hcGhvcmEge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGVudmlybyA9IGdldEVudmlybyh7IHJvb3Q6IHVuZGVmaW5lZCB9KSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgYXNzZXJ0KGNsYXVzZTogQ2xhdXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IGdldEFjdHVhdG9yKCkudGFrZUFjdGlvbihjbGF1c2UuY29weSh7IG5vQW5hcGhvcmE6IHRydWUgfSksIHRoaXMuZW52aXJvKVxuICAgIH1cblxuICAgIGFzeW5jIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogUHJvbWlzZTxNYXBbXT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnZpcm8ucXVlcnkoY2xhdXNlKVxuICAgIH1cblxufVxuXG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgQmFzZUFjdHVhdG9yIGZyb20gXCIuL0Jhc2VBY3R1YXRvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFjdHVhdG9yIHtcbiAgICB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBlbnZpcm86IEVudmlybyk6IFByb21pc2U8dm9pZD5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdHVhdG9yKCk6IEFjdHVhdG9yIHtcbiAgICByZXR1cm4gbmV3IEJhc2VBY3R1YXRvcigpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgQWN0dWF0b3IgfSBmcm9tIFwiLi9BY3R1YXRvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQWN0dWF0b3IgaW1wbGVtZW50cyBBY3R1YXRvciB7XG5cbiAgICBhc3luYyB0YWtlQWN0aW9uKGNsYXVzZTogQ2xhdXNlLCBlbnZpcm86IEVudmlybyk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgICAgIGZvciAoY29uc3QgYSBvZiBhd2FpdCBjbGF1c2UudG9BY3Rpb24oY2xhdXNlKSkge1xuICAgICAgICAgICAgYXdhaXQgYS5ydW4oZW52aXJvKSAvLyBUT0RPOiBtYWtlIHRoaXMgYXN5bmMtc2FmZVxuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCYXNpY0NsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0Jhc2ljQ2xhdXNlXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuaW1wb3J0IENyZWF0ZSBmcm9tIFwiLi9DcmVhdGVcIjtcbmltcG9ydCBFZGl0IGZyb20gXCIuL0VkaXRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNBY3Rpb24gaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY2xhdXNlOiBCYXNpY0NsYXVzZSwgcmVhZG9ubHkgdG9wTGV2ZWw6IENsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcnVuKGVudmlybzogRW52aXJvKTogUHJvbWlzZTxhbnk+IHtcblxuICAgICAgICBpZiAodGhpcy5jbGF1c2Uubm9BbmFwaG9yYSkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IG5ldyBFZGl0KHRoaXMuY2xhdXNlLmFyZ3NbMF0sIHRoaXMuY2xhdXNlLnByZWRpY2F0ZSwgW10pLnJ1bihlbnZpcm8pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMudG9wTGV2ZWwudG9wTGV2ZWwoKS5pbmNsdWRlcyh0aGlzLmNsYXVzZS5hcmdzWzBdKSkgeyAvLyBhdm9pZCBOT04gdG9wLWxldmVsIGVudGl0aWVzXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHEgPSB0aGlzLnRvcExldmVsLnRoZW1lLmFib3V0KHRoaXMuY2xhdXNlLmFyZ3NbMF0pXG4gICAgICAgIGNvbnN0IG1hcHMgPSBhd2FpdCBlbnZpcm8ucXVlcnkocSlcbiAgICAgICAgY29uc3QgaWQgPSBtYXBzPy5bMF0/Llt0aGlzLmNsYXVzZS5hcmdzWzBdXSA/PyBnZXRSYW5kb21JZCgpXG5cbiAgICAgICAgaWYgKCFhd2FpdCBlbnZpcm8uZ2V0KGlkKSkge1xuICAgICAgICAgICAgZW52aXJvLnNldFBsYWNlaG9sZGVyKGlkKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzQ3JlYXRvckFjdGlvbih0aGlzLmNsYXVzZS5wcmVkaWNhdGUpKSB7XG5cbiAgICAgICAgICAgIG5ldyBDcmVhdGUoaWQsIHRoaXMuY2xhdXNlLnByZWRpY2F0ZSkucnVuKGVudmlybylcblxuICAgICAgICB9IGVsc2UgeyAvLyBFZGl0IEFjdGlvblxuXG4gICAgICAgICAgICBjb25zdCBwcm9wcyA9IHRoaXMudG9wTGV2ZWxcbiAgICAgICAgICAgICAgICAuZ2V0T3duZXJzaGlwQ2hhaW4odGhpcy5jbGF1c2UuYXJnc1swXSlcbiAgICAgICAgICAgICAgICAuc2xpY2UoMSlcbiAgICAgICAgICAgICAgICAubWFwKGUgPT4gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZShlKVswXSlcblxuICAgICAgICAgICAgbmV3IEVkaXQoaWQsIHRoaXMuY2xhdXNlLnByZWRpY2F0ZSwgcHJvcHMpLnJ1bihlbnZpcm8pXG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBpc0NyZWF0b3JBY3Rpb24ocHJlZGljYXRlOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcHJlZGljYXRlID09PSAnYnV0dG9uJ1xufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCB7IHdyYXAgfSBmcm9tIFwiLi4vZW52aXJvL1dyYXBwZXJcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDcmVhdGUgaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IElkLCByZWFkb25seSBwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogYW55W10pIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHJ1bihlbnZpcm86IEVudmlybyk6IFByb21pc2U8YW55PiB7XG5cbiAgICAgICAgaWYgKGVudmlyby5leGlzdHModGhpcy5pZCkpIHsgLy8gIGV4aXN0ZW5jZSBjaGVjayBwcmlvciB0byBjcmVhdGluZ1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNEb21FbGVtKHRoaXMucHJlZGljYXRlKSkge1xuXG4gICAgICAgICAgICBjb25zdCBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLnByZWRpY2F0ZSlcbiAgICAgICAgICAgIG8uaWQgPSB0aGlzLmlkICsgJydcbiAgICAgICAgICAgIG8udGV4dENvbnRlbnQgPSAnZGVmYXVsdCdcbiAgICAgICAgICAgIGNvbnN0IG5ld09iaiA9IHdyYXAobylcbiAgICAgICAgICAgIG5ld09iai5zZXQodGhpcy5wcmVkaWNhdGUpXG4gICAgICAgICAgICBlbnZpcm8uc2V0KHRoaXMuaWQsIG5ld09iailcbiAgICAgICAgICAgIGVudmlyby5yb290Py5hcHBlbmRDaGlsZChvKVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ0NyZWF0ZSBydW5zIScpXG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGlzRG9tRWxlbShwcmVkaWNhdGU6IHN0cmluZykge1xuXG4gICAgcmV0dXJuIFsnYnV0dG9uJ10uaW5jbHVkZXMocHJlZGljYXRlKVxuXG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXQgaW1wbGVtZW50cyBBY3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IElkLCByZWFkb25seSBwcmVkaWNhdGU6IHN0cmluZywgcmVhZG9ubHkgcHJvcHM/OiBzdHJpbmdbXSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcnVuKGVudmlybzogRW52aXJvKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gYXdhaXQgZW52aXJvLmdldCh0aGlzLmlkKSA/PyBlbnZpcm8uc2V0UGxhY2Vob2xkZXIodGhpcy5pZClcbiAgICAgICAgb2JqLnNldCh0aGlzLnByZWRpY2F0ZSwgdGhpcy5wcm9wcylcbiAgICB9XG5cblxufSIsImltcG9ydCB7IENvbnN0cnVjdG9yIH0gZnJvbSBcIi4uLy4uL2xleGVyL0xleGVyXCI7XG5pbXBvcnQgQWRqZWN0aXZlIGZyb20gXCIuLi90b2tlbnMvQWRqZWN0aXZlXCI7XG5pbXBvcnQgQXJ0aWNsZSBmcm9tIFwiLi4vdG9rZW5zL0FydGljbGVcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL3Rva2Vucy9Db3B1bGFcIjtcbmltcG9ydCBGdWxsU3RvcCBmcm9tIFwiLi4vdG9rZW5zL0Z1bGxTdG9wXCI7XG5pbXBvcnQgSFZlcmIgZnJvbSBcIi4uL3Rva2Vucy9IVmVyYlwiO1xuaW1wb3J0IElWZXJiIGZyb20gXCIuLi90b2tlbnMvSVZlcmJcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vdG9rZW5zL01WZXJiXCI7XG5pbXBvcnQgTmVnYXRpb24gZnJvbSBcIi4uL3Rva2Vucy9OZWdhdGlvblwiO1xuaW1wb3J0IE5vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBmcm9tIFwiLi4vdG9rZW5zL05vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvblwiO1xuaW1wb3J0IE5vdW4gZnJvbSBcIi4uL3Rva2Vucy9Ob3VuXCI7XG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSBcIi4uL3Rva2Vucy9QcmVwb3NpdGlvblwiO1xuaW1wb3J0IFF1YW50aWZpZXIgZnJvbSBcIi4uL3Rva2Vucy9RdWFudGlmaWVyXCI7XG5pbXBvcnQgUmVsYXRpdmVQcm9ub3VuIGZyb20gXCIuLi90b2tlbnMvUmVsYXRpdmVQcm9ub3VuXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uIGZyb20gXCIuLi90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uXCI7XG5pbXBvcnQgVGhlbiBmcm9tIFwiLi4vdG9rZW5zL1RoZW5cIjtcbmltcG9ydCBBc3QgZnJvbSBcIi4vQXN0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBUb2tlbiBleHRlbmRzIEFzdCB7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2VuQ29ucyh0eXBlOiBUb2tlblR5cGUpOiBDb25zdHJ1Y3RvcjxUb2tlbj4ge1xuICAgIHJldHVybiBjb25zdHJ1Y3RvcnNbdHlwZV1cbn1cblxuZXhwb3J0IHR5cGUgVG9rZW5UeXBlID1cbiAgICAnbm91bidcbiAgICB8ICdpdmVyYidcbiAgICB8ICdtdmVyYidcbiAgICB8ICdodmVyYidcbiAgICB8ICdjb3B1bGEnXG4gICAgfCAndGhlbidcbiAgICB8ICdhZGonXG4gICAgfCAnZXhpc3RxdWFudCdcbiAgICB8ICd1bmlxdWFudCdcbiAgICB8ICdwcmVwb3NpdGlvbidcbiAgICB8ICdzdWJjb25qJ1xuICAgIHwgJ3JlbHByb24nXG4gICAgfCAnZGVmYXJ0J1xuICAgIHwgJ2luZGVmYXJ0J1xuICAgIHwgJ2Z1bGxzdG9wJ1xuICAgIHwgJ25vbnN1YmNvbmonXG4gICAgfCAnbmVnYXRpb24nXG4gICAgfCAnY29udHJhY3Rpb24nXG5cbmNvbnN0IGNvbnN0cnVjdG9yczogeyBbeCBpbiBUb2tlblR5cGVdOiBDb25zdHJ1Y3RvcjxUb2tlbj4gfSA9IHtcbiAgICAnbm91bic6IE5vdW4sXG4gICAgJ2l2ZXJiJzogSVZlcmIsXG4gICAgJ212ZXJiJzogTVZlcmIsXG4gICAgJ2h2ZXJiJzogSFZlcmIsXG4gICAgJ2NvcHVsYSc6IENvcHVsYSxcbiAgICAndGhlbic6IFRoZW4sXG4gICAgJ2Fkaic6IEFkamVjdGl2ZSxcbiAgICAnZXhpc3RxdWFudCc6IFF1YW50aWZpZXIsXG4gICAgJ3VuaXF1YW50JzogUXVhbnRpZmllcixcbiAgICAncHJlcG9zaXRpb24nOiBQcmVwb3NpdGlvbixcbiAgICAnc3ViY29uaic6IFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbixcbiAgICAncmVscHJvbic6IFJlbGF0aXZlUHJvbm91bixcbiAgICAnZGVmYXJ0JzogQXJ0aWNsZSxcbiAgICAnaW5kZWZhcnQnOiBBcnRpY2xlLFxuICAgICdmdWxsc3RvcCc6IEZ1bGxTdG9wLFxuICAgICdub25zdWJjb25qJzogTm9uU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uLFxuICAgICduZWdhdGlvbic6IE5lZ2F0aW9uLFxuICAgICdjb250cmFjdGlvbic6IE5lZ2F0aW9uIC8vVE9ETzogZml4IHRoaXMgY3JhcCAgXG59IiwiaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IGdldFJhbmRvbUlkLCBJZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgUGhyYXNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1BocmFzZVwiO1xuaW1wb3J0IFByZXBvc2l0aW9uIGZyb20gXCIuLi90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuL05vdW5QaHJhc2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGxlbWVudCBpbXBsZW1lbnRzIFBocmFzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVwb3NpdGlvbjogUHJlcG9zaXRpb24sIHJlYWRvbmx5IG5vdW5QaHJhc2U6IE5vdW5QaHJhc2UpIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4geyAvLyBwcmVwb3NpdGlvbihhcmdzLnN1YmplY3QsIFkpICsgbm91bnBocmFzZS50b1Byb2xvZyhzdWJqZWN0PVkpXG5cbiAgICAgICAgY29uc3Qgc3ViaklkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gKCgpOiBJZCA9PiB7IHRocm93IG5ldyBFcnJvcigndW5kZWZpbmVkIHN1YmplY3QgaWQnKSB9KSgpXG4gICAgICAgIGNvbnN0IG5ld0lkID0gZ2V0UmFuZG9tSWQoKVxuXG4gICAgICAgIHJldHVybiBjbGF1c2VPZih0aGlzLnByZXBvc2l0aW9uLnN0cmluZywgc3ViaklkLCBuZXdJZClcbiAgICAgICAgICAgIC5hbmQoYXdhaXQgdGhpcy5ub3VuUGhyYXNlLnRvQ2xhdXNlKHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogbmV3SWQgfSB9KSlcbiAgICAgICAgICAgIC5jb3B5KHtzaWRlRWZmZWN0eSA6IGZhbHNlfSlcblxuICAgIH1cblxufSIsImltcG9ydCB7IFRvQ2xhdXNlT3B0cyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCBTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IFJlbGF0aXZlUHJvbm91biBmcm9tIFwiLi4vdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4vTm91blBocmFzZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGFTdWJvcmRpbmF0ZUNsYXVzZSBpbXBsZW1lbnRzIFN1Ym9yZGluYXRlQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJlbHByb246IFJlbGF0aXZlUHJvbm91biwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG4gICAgICAgIHJldHVybiAoYXdhaXQgdGhpcy5wcmVkaWNhdGUudG9DbGF1c2UoeyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBhcmdzPy5yb2xlcz8uc3ViamVjdCB9IH0pKVxuICAgICAgICAuY29weSh7c2lkZUVmZmVjdHkgOiBmYWxzZX0pXG4gICAgfVxuXG59IiwiaW1wb3J0IFBocmFzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9QaHJhc2VcIjtcbmltcG9ydCBBZGplY3RpdmUgZnJvbSBcIi4uL3Rva2Vucy9BZGplY3RpdmVcIjtcbmltcG9ydCBBcnRpY2xlIGZyb20gXCIuLi90b2tlbnMvQXJ0aWNsZVwiO1xuaW1wb3J0IE5vdW4gZnJvbSBcIi4uL3Rva2Vucy9Ob3VuXCI7XG5pbXBvcnQgUXVhbnRpZmllciBmcm9tIFwiLi4vdG9rZW5zL1F1YW50aWZpZXJcIjtcbmltcG9ydCBDb21wbGVtZW50IGZyb20gXCIuL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBTdWJvcmRpbmF0ZUNsYXVzZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TdWJvcmRpbmF0ZUNsYXVzZVwiO1xuaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRSYW5kb21JZCwgdG9WYXIgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3VuUGhyYXNlIGltcGxlbWVudHMgUGhyYXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGFkamVjdGl2ZXM6IEFkamVjdGl2ZVtdLFxuICAgICAgICByZWFkb25seSBjb21wbGVtZW50czogQ29tcGxlbWVudFtdLFxuICAgICAgICByZWFkb25seSBub3VuPzogTm91bixcbiAgICAgICAgcmVhZG9ubHkgcXVhbnRpZmllcj86IFF1YW50aWZpZXIsXG4gICAgICAgIHJlYWRvbmx5IGFydGljbGU/OiBBcnRpY2xlLFxuICAgICAgICByZWFkb25seSBzdWJvcmRDbGF1c2U/OiBTdWJvcmRpbmF0ZUNsYXVzZSkge1xuXG4gICAgfVxuXG4gICAgaXNVbmlRdWFudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucXVhbnRpZmllcj8uaXNVbml2ZXJzYWwoKSA/PyBmYWxzZVxuICAgIH1cblxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4ge1xuXG4gICAgICAgIGNvbnN0IG1heWJlSWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IHRoaXMuaXNVbmlRdWFudCgpID8gdG9WYXIobWF5YmVJZCkgOiBtYXliZUlkXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cblxuICAgICAgICBjb25zdCByZXMgPSB0aGlzXG4gICAgICAgICAgICAuYWRqZWN0aXZlc1xuICAgICAgICAgICAgLm1hcChhID0+IGEuc3RyaW5nKVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLm5vdW4gPyBbdGhpcy5ub3VuLnN0cmluZ10gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihwLCBzdWJqZWN0SWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmFuZCgoYXdhaXQgUHJvbWlzZS5hbGwodGhpcy5jb21wbGVtZW50cy5tYXAoYyA9PiBjLnRvQ2xhdXNlKG5ld0FyZ3MpKSkpLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKSlcbiAgICAgICAgICAgIC5hbmQoYXdhaXQgdGhpcy5zdWJvcmRDbGF1c2U/LnRvQ2xhdXNlKG5ld0FyZ3MpID8/IGVtcHR5Q2xhdXNlKCkpXG4gICAgICAgICAgICAuY29weSh7IHNpZGVFZmZlY3R5OiBmYWxzZSB9KVxuXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbn0iLCJpbXBvcnQgQ29tcG91bmRTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db21wb3VuZFNlbnRlbmNlXCI7XG5pbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRSYW5kb21JZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgU2ltcGxlU2VudGVuY2UgZnJvbSBcIi4uL2ludGVyZmFjZXMvU2ltcGxlU2VudGVuY2VcIjtcbmltcG9ydCBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSBcIi4uL3Rva2Vucy9TdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25cIjtcblxuLyoqXG4gKiBBIHNlbnRlbmNlIHRoYXQgcmVsYXRlcyB0d28gc2ltcGxlIHNlbnRlbmNlcyBoeXBvdGFjdGljYWxseSwgaW4gYSBcbiAqIGNvbmRpdGlvbi1vdXRjb21lIHJlbGF0aW9uc2hpcC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tcGxleFNlbnRlbmNlIGltcGxlbWVudHMgQ29tcG91bmRTZW50ZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25kaXRpb246IFNpbXBsZVNlbnRlbmNlLFxuICAgICAgICByZWFkb25seSBvdXRjb21lOiBTaW1wbGVTZW50ZW5jZSxcbiAgICAgICAgcmVhZG9ubHkgc3ViY29uajogU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyB0b0NsYXVzZShhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuICAgICAgICBjb25zdCBuZXdBcmdzMSA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogZ2V0UmFuZG9tSWQoKSB9IH1cblxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSBhd2FpdCB0aGlzLmNvbmRpdGlvbi50b0NsYXVzZShuZXdBcmdzMSlcbiAgICAgICAgY29uc3Qgb3V0Y29tZSA9IGF3YWl0IHRoaXMub3V0Y29tZS50b0NsYXVzZSh7IC4uLmFyZ3MsIGFuYXBob3JhOiBjb25kaXRpb24gfSlcbiAgICAgICAgcmV0dXJuIGNvbmRpdGlvbi5pbXBsaWVzKG91dGNvbWUpLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSB9KVxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBCaW5hcnlRdWVzdGlvbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9CaW5hcnlRdWVzdGlvblwiO1xuaW1wb3J0IHsgVG9DbGF1c2VPcHRzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQgfSBmcm9tIFwiLi4vLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IENvcHVsYVNlbnRlbmNlIGZyb20gXCIuL0NvcHVsYVNlbnRlbmNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYVF1ZXN0aW9uIGltcGxlbWVudHMgQmluYXJ5UXVlc3Rpb24ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDogTm91blBocmFzZSwgcmVhZG9ubHkgcHJlZGljYXRlOiBOb3VuUGhyYXNlLCByZWFkb25seSBjb3B1bGE6IENvcHVsYSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoeyBhc1ZhcjogdGhpcy5zdWJqZWN0LmlzVW5pUXVhbnQoKSB9KVxuICAgICAgICBjb25zdCBuZXdBcmdzID0geyAuLi5hcmdzLCByb2xlczogeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSB9XG5cbiAgICAgICAgLy9UT0RPOiBpbiBjYXNlIG9mIGEgdW5pdmVyc2FsbHkgcXVhbnRpZmllZCBxdWVzdGlvbiBlZzogXCJhcmUgYWxsIGNhdHMgc21hcnQ/XCIgdGhlIHByb2xvZ1xuICAgICAgICAvLyBwcm9kdWNlZCBzaG91bGQgTk9UIGJlIGFuIGltcGxpY2F0aW9uLCBidXQgcmF0aGVyIGEgY2hlY2sgdGhhdCBhbGwgY2F0cyBhcmUgc21hcnQuXG5cbiAgICAgICAgY29uc3QgY2xhdXNlID0gYXdhaXQgbmV3IENvcHVsYVNlbnRlbmNlKHRoaXMuc3ViamVjdCwgdGhpcy5jb3B1bGEsIHRoaXMucHJlZGljYXRlKS50b0NsYXVzZShuZXdBcmdzKVxuXG4gICAgICAgIHJldHVybiBjbGF1c2UuY29weSh7c2lkZUVmZmVjdHkgOiBmYWxzZX0pXG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRSYW5kb21JZCwgaXNWYXIsIHRvQ29uc3QsIHRvVmFyIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9TaW1wbGVTZW50ZW5jZVwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IENvcHVsYSBmcm9tIFwiLi4vdG9rZW5zL0NvcHVsYVwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi90b2tlbnMvTmVnYXRpb25cIjtcbmltcG9ydCB7IGdldEFuYXBob3JhIH0gZnJvbSBcIi4uLy4uL0FuYXBob3JhXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcHVsYVNlbnRlbmNlIGltcGxlbWVudHMgU2ltcGxlU2VudGVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDogTm91blBocmFzZSwgcmVhZG9ubHkgY29wdWxhOiBDb3B1bGEsIHJlYWRvbmx5IHByZWRpY2F0ZTogTm91blBocmFzZSwgcmVhZG9ubHkgbmVnYXRpb24/OiBOZWdhdGlvbikge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgdG9DbGF1c2UoYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cbiAgICAgICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoeyBhc1ZhcjogdGhpcy5zdWJqZWN0LmlzVW5pUXVhbnQoKSB9KVxuXG4gICAgICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH1cbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IGF3YWl0IHRoaXMuc3ViamVjdC50b0NsYXVzZShuZXdBcmdzKVxuICAgICAgICBjb25zdCBwcmVkaWNhdGUgPSAoYXdhaXQgdGhpcy5wcmVkaWNhdGUudG9DbGF1c2UobmV3QXJncykpLmNvcHkoeyBuZWdhdGU6ICEhdGhpcy5uZWdhdGlvbiB9KVxuXG4gICAgICAgIGNvbnN0IGVudGl0aWVzID0gc3ViamVjdC5lbnRpdGllcy5jb25jYXQocHJlZGljYXRlLmVudGl0aWVzKVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGVudGl0aWVzLy8gYXNzdW1lIGFueSBzZW50ZW5jZSB3aXRoIGFueSB2YXIgaXMgYW4gaW1wbGljYXRpb25cbiAgICAgICAgICAgIC5zb21lKGUgPT4gaXNWYXIoZSkpID9cbiAgICAgICAgICAgIHN1YmplY3QuaW1wbGllcyhwcmVkaWNhdGUpIDpcbiAgICAgICAgICAgIHN1YmplY3QuYW5kKHByZWRpY2F0ZSwgeyBhc1JoZW1lOiB0cnVlIH0pXG5cbiAgICAgICAgY29uc3QgbTAgPSByZXN1bHQuZW50aXRpZXMgLy8gYXNzdW1lIGlkcyBhcmUgY2FzZSBpbnNlbnNpdGl2ZSwgYXNzdW1lIGlmIElEWCBpcyB2YXIgYWxsIGlkeCBhcmUgdmFyXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gaXNWYXIoeCkpXG4gICAgICAgICAgICAubWFwKGUgPT4gKHsgW3RvQ29uc3QoZSldOiBlIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICAgICAgY29uc3QgYSA9IGdldEFuYXBob3JhKCkgLy8gZ2V0IGFuYXBob3JhXG4gICAgICAgIGF3YWl0IGEuYXNzZXJ0KHN1YmplY3QpXG4gICAgICAgIGNvbnN0IG0xID0gKGF3YWl0IGEucXVlcnkocHJlZGljYXRlKSlbMF0gPz8ge31cbiAgICAgICAgLy8gY29uc29sZS5sb2coe20xfSlcblxuICAgICAgICBjb25zdCByZXN1bHQyID0gcmVzdWx0LmNvcHkoeyBtYXA6IG0wIH0pLmNvcHkoeyBzaWRlRWZmZWN0eTogdHJ1ZSwgbWFwOiBtMSB9KVxuXG4gICAgICAgIGNvbnN0IG0yID0gcmVzdWx0Mi5lbnRpdGllcyAvLyBhc3N1bWUgYW55dGhpbmcgb3duZWQgYnkgYSB2YXJpYWJsZSBpcyBhbHNvIGEgdmFyaWFibGVcbiAgICAgICAgICAgIC5maWx0ZXIoZSA9PiBpc1ZhcihlKSlcbiAgICAgICAgICAgIC5mbGF0TWFwKGUgPT4gcmVzdWx0Mi5vd25lZEJ5KGUpKVxuICAgICAgICAgICAgLm1hcChlID0+ICh7IFtlXTogdG9WYXIoZSkgfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgICAgICByZXR1cm4gcmVzdWx0Mi5jb3B5KHsgbWFwOiBtMiB9KVxuICAgIH1cblxufSIsImltcG9ydCB7IFRvQ2xhdXNlT3B0cyB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL0NvbnN0aXR1ZW50XCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRSYW5kb21JZCB9IGZyb20gXCIuLi8uLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgVmVyYlNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1ZlcmJTZW50ZW5jZVwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4uL3BocmFzZXMvQ29tcGxlbWVudFwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IElWZXJiIGZyb20gXCIuLi90b2tlbnMvSVZlcmJcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vdG9rZW5zL05lZ2F0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludHJhbnNpdGl2ZVNlbnRlbmNlIGltcGxlbWVudHMgVmVyYlNlbnRlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN1YmplY3Q6IE5vdW5QaHJhc2UsXG4gICAgICAgIHJlYWRvbmx5IGl2ZXJiOiBJVmVyYixcbiAgICAgICAgcmVhZG9ubHkgY29tcGxlbWVudHM6IENvbXBsZW1lbnRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRpb24/OiBOZWdhdGlvbikge1xuXG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4ge1xuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnJvbGVzPy5zdWJqZWN0ID8/IGdldFJhbmRvbUlkKHsgYXNWYXI6IHRoaXMuc3ViamVjdC5pc1VuaVF1YW50KCkgfSlcbiAgICAgICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG4gICAgICAgIGNvbnN0IHRoZW1lID0gYXdhaXQgdGhpcy5zdWJqZWN0LnRvQ2xhdXNlKG5ld0FyZ3MpXG4gICAgICAgIFxuICAgICAgICBjb25zdCByaGVtZSA9IGNsYXVzZU9mKHRoaXMuaXZlcmIuc3RyaW5nLCBzdWJqZWN0SWQpLmFuZCgoYXdhaXQgUHJvbWlzZS5hbGwodGhpcy5jb21wbGVtZW50cy5tYXAoIGMgPT4gYy50b0NsYXVzZShuZXdBcmdzKSkpKS5yZWR1Y2UoIChjMSwgYzIpID0+IGMxLmFuZChjMikpKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoZW1lLmFuZChyaGVtZSwgeyBhc1JoZW1lOiB0cnVlIH0pLmNvcHkoe3NpZGVFZmZlY3R5OnRydWV9KVxuICAgIH1cblxufVxuXG4iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgeyBUb0NsYXVzZU9wdHMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uLy4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgVmVyYlNlbnRlbmNlIGZyb20gXCIuLi9pbnRlcmZhY2VzL1ZlcmJTZW50ZW5jZVwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4uL3BocmFzZXMvQ29tcGxlbWVudFwiO1xuaW1wb3J0IE5vdW5QaHJhc2UgZnJvbSBcIi4uL3BocmFzZXMvTm91blBocmFzZVwiO1xuaW1wb3J0IE1WZXJiIGZyb20gXCIuLi90b2tlbnMvTVZlcmJcIjtcbmltcG9ydCBOZWdhdGlvbiBmcm9tIFwiLi4vdG9rZW5zL05lZ2F0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vbm90cmFuc2l0aXZlU2VudGVuY2UgaW1wbGVtZW50cyBWZXJiU2VudGVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc3ViamVjdDogTm91blBocmFzZSxcbiAgICAgICAgICAgICAgICByZWFkb25seSBtdmVyYjogTVZlcmIsXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgb2JqZWN0OiBOb3VuUGhyYXNlLFxuICAgICAgICAgICAgICAgIHJlYWRvbmx5IGNvbXBsZW1lbnRzOiBDb21wbGVtZW50W10sXG4gICAgICAgICAgICAgICAgcmVhZG9ubHkgbmVnYXRpb24/OiBOZWdhdGlvbikge1xuXG4gICAgfVxuICAgIFxuICAgIGFzeW5jIHRvQ2xhdXNlKGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBQcm9taXNlPENsYXVzZT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbiAgICB9XG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0VG9rZW4gaW1wbGVtZW50cyBUb2tlbntcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHN0cmluZzpzdHJpbmcpe1xuXG4gICAgfSAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWRqZWN0aXZlIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgeyBmb3Jtc09mIH0gZnJvbSBcIi4uLy4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuLi8uLi9sZXhlci9sZXhlbWVzXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFydGljbGUgZXh0ZW5kcyBBYnN0cmFjdFRva2VuIHtcblxuICAgIGlzRGVmaW5pdGUoKSB7XG5cbiAgICAgICAgcmV0dXJuIGxleGVtZXNcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LnR5cGUgPT09ICdkZWZhcnQnKVxuICAgICAgICAgICAgLmZsYXRNYXAoeCA9PiBmb3Jtc09mKHgpKVxuICAgICAgICAgICAgLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gYEFydGljbGUoJHt0aGlzLnN0cmluZ30sIGlzRGVmaW5pdGU9JHt0aGlzLmlzRGVmaW5pdGUoKX0pYFxuICAgIH1cblxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3B1bGEgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGdWxsU3RvcCBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhWZXJiIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSVZlcmIgZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgIFxufSIsImltcG9ydCBCcmFpbiBmcm9tIFwiLi4vLi4vYnJhaW4vQnJhaW5cIjtcbmltcG9ydCBUb2tlbiBmcm9tIFwiLi4vaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IEFic3RyYWN0VG9rZW4gZnJvbSBcIi4vQWJzdHJhY3RUb2tlblwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNVmVyYiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5lZ2F0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICBcbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5vblN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG5cbn0iLCJpbXBvcnQgQnJhaW4gZnJvbSBcIi4uLy4uL2JyYWluL0JyYWluXCI7XG5pbXBvcnQgVG9rZW4gZnJvbSBcIi4uL2ludGVyZmFjZXMvVG9rZW5cIjtcbmltcG9ydCBBYnN0cmFjdFRva2VuIGZyb20gXCIuL0Fic3RyYWN0VG9rZW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm91biBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByZXBvc2l0aW9uIGV4dGVuZHMgQWJzdHJhY3RUb2tlbntcbiAgICAgICBcbn0iLCJpbXBvcnQgeyBmb3Jtc09mIH0gZnJvbSBcIi4uLy4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuLi8uLi9sZXhlci9sZXhlbWVzXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1YW50aWZpZXIgZXh0ZW5kcyBBYnN0cmFjdFRva2VuIHtcblxuICAgIGlzVW5pdmVyc2FsKCkge1xuXG4gICAgICAgIHJldHVybiBsZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC50eXBlID09PSAndW5pcXVhbnQnKVxuICAgICAgICAgICAgLmZsYXRNYXAoeCA9PiBmb3Jtc09mKHgpKVxuICAgICAgICAgICAgLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuXG4gICAgfVxuXG4gICAgaXNFeGlzdGVudGlhbCgpIHtcblxuICAgICAgICByZXR1cm4gbGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHgudHlwZSA9PT0gJ2V4aXN0cXVhbnQnKVxuICAgICAgICAgICAgLmZsYXRNYXAoeCA9PiBmb3Jtc09mKHgpKVxuICAgICAgICAgICAgLmluY2x1ZGVzKHRoaXMuc3RyaW5nKVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbGF0aXZlUHJvbm91biBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbiBleHRlbmRzIEFic3RyYWN0VG9rZW57XG4gICAgXG59IiwiaW1wb3J0IEJyYWluIGZyb20gXCIuLi8uLi9icmFpbi9CcmFpblwiO1xuaW1wb3J0IFRva2VuIGZyb20gXCIuLi9pbnRlcmZhY2VzL1Rva2VuXCI7XG5pbXBvcnQgQWJzdHJhY3RUb2tlbiBmcm9tIFwiLi9BYnN0cmFjdFRva2VuXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRoZW4gZXh0ZW5kcyBBYnN0cmFjdFRva2Vue1xuICAgICBcbn0iLCJpbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi4vcGFyc2VyL1BhcnNlclwiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuL0JyYWluXCI7XG5pbXBvcnQgZ2V0RW52aXJvIGZyb20gXCIuLi9lbnZpcm8vRW52aXJvXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgV3JhcHBlciwgeyB3cmFwIH0gZnJvbSBcIi4uL2Vudmlyby9XcmFwcGVyXCI7XG5pbXBvcnQgeyBnZXRBY3R1YXRvciB9IGZyb20gXCIuLi9hY3R1YXRvci9BY3R1YXRvclwiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljQnJhaW4gaW1wbGVtZW50cyBCcmFpbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBlbnZpcm8gPSBnZXRFbnZpcm8oeyByb290OiBkb2N1bWVudC5ib2R5IH0pLCByZWFkb25seSBhY3R1YXRvciA9IGdldEFjdHVhdG9yKCkpIHtcblxuICAgICAgICB3cmFwKEhUTUxCdXR0b25FbGVtZW50LnByb3RvdHlwZSkuc2V0QWxpYXMoJ2NvbG9yJywgWydzdHlsZScsICdiYWNrZ3JvdW5kJ10pXG4gICAgICAgIC8vIHdyYXAoSFRNTEJ1dHRvbkVsZW1lbnQucHJvdG90eXBlKS5zZXRBbGlhcygnd2lkdGgnLCBbJ3N0eWxlJywgJ3dpZHRoJ10pXG5cbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFByb21pc2U8YW55W10+IHtcblxuICAgICAgICBsZXQgcmVzdWx0czogYW55W10gPSBbXVxuXG4gICAgICAgIGZvciAoY29uc3QgYXN0IG9mIGdldFBhcnNlcihuYXRsYW5nKS5wYXJzZUFsbCgpKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IGNsYXVzZSA9IGF3YWl0IGFzdC50b0NsYXVzZSgpXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhjbGF1c2UudG9TdHJpbmcoKSwgJ3NpZGUtZWZmZXRjczonLCBjbGF1c2UuaXNTaWRlRWZmZWN0eSlcblxuICAgICAgICAgICAgaWYgKGNsYXVzZS5pc1NpZGVFZmZlY3R5KSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5hY3R1YXRvci50YWtlQWN0aW9uKGNsYXVzZSwgdGhpcy5lbnZpcm8pIC8vIFRPRE86IG1ha2UgdGhpcyBhc3luYy1zYWZlXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgaWRzID0gT2JqZWN0LnZhbHVlcygoYXdhaXQgdGhpcy5lbnZpcm8ucXVlcnkoY2xhdXNlKSlbMF0gPz8ge30pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZSA9PiBlICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZSA9PiBlIGFzIElkKVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqZWN0cyA9IGF3YWl0IFByb21pc2UuYWxsKGlkcy5tYXAoZSA9PiB0aGlzLmVudmlyby5nZXQoZSkpKVxuICAgICAgICAgICAgICAgIHRoaXMuZW52aXJvLnZhbHVlcy5mb3JFYWNoKG8gPT4gby5wb2ludE91dCh7IHR1cm5PZmY6IHRydWUgfSkpXG4gICAgICAgICAgICAgICAgb2JqZWN0cy5mb3JFYWNoKG8gPT4gbz8ucG9pbnRPdXQoKSlcbiAgICAgICAgICAgICAgICByZXN1bHRzID0gWy4uLnJlc3VsdHMsIC4uLm9iamVjdHMubWFwKG8gPT4gbz8ub2JqZWN0KV1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG5cbn0iLCJpbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi9CYXNpY0JyYWluXCJcblxuLyoqXG4gKiBUaGUgbWFpbiBmYWNhZGUgY29udHJvbGxlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIEJyYWluIHtcbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFByb21pc2U8YW55W10+XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRCcmFpbigpOiBQcm9taXNlPEJyYWluPiB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0JyYWluKClcbn1cbiIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4vZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCB7IHRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5kIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTE6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UySXNSaGVtZTogYm9vbGVhbixcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBub0FuYXBob3JhID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNJbXBseSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSkpIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQW5kIHtcblxuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLmNsYXVzZTEuY29weShvcHRzKSwgLy97IG1hcDogb3B0cz8ubWFwIH1cbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMi5jb3B5KG9wdHMpLCAvL3sgbWFwOiBvcHRzPy5tYXAgfVxuICAgICAgICAgICAgdGhpcy5jbGF1c2UySXNSaGVtZSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5ub0FuYXBob3JhID8/IHRoaXMubm9BbmFwaG9yYSxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDpcbiAgICAgICAgICAgIFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG5cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG5cbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2UgeyAvL1RPRE86IGlmIHRoaXMgaXMgbmVnYXRlZCFcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5hYm91dChpZCkuYW5kKHRoaXMuY2xhdXNlMi5hYm91dChpZCkpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0b3BMZXZlbCh0aGlzKVxuICAgIH1cblxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIGdldE93bmVyc2hpcENoYWluKHRoaXMsIGVudGl0eSlcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTEgOiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICBhc3luYyB0b0FjdGlvbih0b3BMZXZlbDogQ2xhdXNlKTogUHJvbWlzZTxBY3Rpb25bXT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IHRoaXMuY2xhdXNlMS50b0FjdGlvbih0b3BMZXZlbCkpLmNvbmNhdChhd2FpdCB0aGlzLmNsYXVzZTIudG9BY3Rpb24odG9wTGV2ZWwpKVxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4vaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0aW9uXCI7XG5pbXBvcnQgeyB0b3BMZXZlbCB9IGZyb20gXCIuL3RvcExldmVsXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgQmFzaWNBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0Jhc2ljQWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVkaWNhdGU6IHN0cmluZyxcbiAgICAgICAgcmVhZG9ubHkgYXJnczogSWRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBub0FuYXBob3JhID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNJbXBseSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSksXG4gICAgICAgIHJlYWRvbmx5IHJoZW1lID0gZW1wdHlDbGF1c2UoKSkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBCYXNpY0NsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UodGhpcy5wcmVkaWNhdGUsXG4gICAgICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwID8gb3B0cz8ubWFwW2FdID8/IGEgOiBhKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5ub0FuYXBob3JhID8/IHRoaXMubm9BbmFwaG9yYSxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgPyB0aGlzIDogZW1wdHlDbGF1c2UoKVxuICAgIH1cblxuICAgIGdldCB0aGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldCh0aGlzLmFyZ3MpKVxuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZSA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGUgPT09ICdvZicgJiYgdGhpcy5hcmdzWzBdID09PSBpZCA/IFt0aGlzLmFyZ3NbMV1dIDogW11cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gYCR7dGhpcy5wcmVkaWNhdGV9KCR7dGhpcy5hcmdzfSlgXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgJiYgdGhpcy5hcmdzLmxlbmd0aCA9PT0gMSA/IFt0aGlzLnByZWRpY2F0ZV0gOiBbXVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdG9wTGV2ZWwodGhpcylcbiAgICB9XG5cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBnZXRPd25lcnNoaXBDaGFpbih0aGlzLCBlbnRpdHkpXG4gICAgfVxuXG4gICAgYXN5bmMgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IFByb21pc2U8QWN0aW9uW10+IHtcbiAgICAgICAgcmV0dXJuIFtuZXcgQmFzaWNBY3Rpb24odGhpcywgdG9wTGV2ZWwpXVxuICAgIH1cblxufSIsImltcG9ydCB7IEJhc2ljQ2xhdXNlIH0gZnJvbSBcIi4vQmFzaWNDbGF1c2VcIlxuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuL0lkXCJcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiXG5pbXBvcnQgeyBFbXB0eUNsYXVzZSB9IGZyb20gXCIuL0VtcHR5Q2xhdXNlXCJcblxuLyoqXG4gKiBBICdsYW5ndWFnZS1hZ25vc3RpYycgZmlyc3Qgb3JkZXIgbG9naWMgcmVwcmVzZW50YXRpb24uXG4qL1xuZXhwb3J0IGludGVyZmFjZSBDbGF1c2Uge1xuICAgIHJlYWRvbmx5IG5lZ2F0ZWQ6IGJvb2xlYW5cbiAgICByZWFkb25seSBpc0ltcGx5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgaGFzaENvZGU6IG51bWJlclxuICAgIHJlYWRvbmx5IGVudGl0aWVzOiBJZFtdXG4gICAgcmVhZG9ubHkgdGhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHJoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5OiBib29sZWFuXG4gICAgcmVhZG9ubHkgbm9BbmFwaG9yYTogYm9vbGVhblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZVxuICAgIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBQcm9taXNlPEFjdGlvbltdPlxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXVxuICAgIHRvcExldmVsKCk6IElkW11cbiAgICBnZXRPd25lcnNoaXBDaGFpbihlbnRpdHk6IElkKTogSWRbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQmFzaWNDbGF1c2UocHJlZGljYXRlLCBhcmdzKVxufVxuXG5leHBvcnQgY29uc3QgZW1wdHlDbGF1c2UgPSAoKTogQ2xhdXNlID0+IG5ldyBFbXB0eUNsYXVzZSgpXG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29weU9wdHMge1xuICAgIG5lZ2F0ZT86IGJvb2xlYW5cbiAgICBtYXA/OiBNYXBcbiAgICBub0FuYXBob3JhPzogYm9vbGVhbiAvLyBpbnRlcnByZXQgZXZlcnkgaWQgYXMgZXhhY3RcbiAgICBzaWRlRWZmZWN0eT86IGJvb2xlYW5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufSIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiO1xuaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuXG5leHBvcnQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc0ltcGx5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gOTk5OTk5OTksXG4gICAgICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW10sXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgbm9BbmFwaG9yYSA9IGZhbHNlKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCByaGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gb3RoZXJcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBjb25jbHVzaW9uXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuICcnXG4gICAgfVxuXG4gICAgYXN5bmMgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IFByb21pc2U8QWN0aW9uW10+IHtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxufSIsIi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IG51bWJlciB8IHN0cmluZ1xuXG4vKipcbiAqIElkIHRvIElkIG1hcHBpbmcsIGZyb20gb25lIFwidW5pdmVyc2VcIiB0byBhbm90aGVyLlxuICovXG5leHBvcnQgdHlwZSBNYXAgPSB7IFthOiBJZF06IElkIH1cblxuXG5mdW5jdGlvbiogZ2V0SWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgeCsrXG4gICAgICAgIHlpZWxkIHhcbiAgICB9XG59XG5cbmNvbnN0IGlkR2VuZXJhdG9yID0gZ2V0SWRHZW5lcmF0b3IoKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tSWQob3B0cz86IEdldFJhbmRvbUlkT3B0cyk6IElkIHtcbiAgICBcbiAgICAvLyBjb25zdCBuZXdJZCA9IGBpZCR7cGFyc2VJbnQoMTAwMCAqIE1hdGgucmFuZG9tKCkgKyAnJyl9YFxuXG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gXG5cbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFJhbmRvbUlkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhcihlOiBJZCkge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oTnVtYmVyKGUpKSAmJiAoZS50b1N0cmluZygpWzBdID09PSBlLnRvU3RyaW5nKClbMF0udG9VcHBlckNhc2UoKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29uc3QoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvTG93ZXJDYXNlKClcbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9BY3Rpb25cIjtcbmltcG9ydCB7IHRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4vZ2V0T3duZXJzaGlwQ2hhaW5cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wbHkgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY29uZGl0aW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNvbmNsdXNpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBub0FuYXBob3JhID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzU2lkZUVmZmVjdHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaXNJbXBseSA9IHRydWUsXG4gICAgICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeShhcmd1bWVudHMpKSxcbiAgICAgICAgcmVhZG9ubHkgdGhlbWUgPSBjb25kaXRpb24udGhlbWUpIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIC8vIHJldHVybiBuZXcgQW5kKFt0aGlzLCBvdGhlcl0pXG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcblxuICAgICAgICByZXR1cm4gbmV3IEltcGx5KHRoaXMuY29uZGl0aW9uLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNvbmNsdXNpb24uY29weShvcHRzKSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/ICF0aGlzLm5lZ2F0ZWQgOiB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgICAgICBvcHRzPy5ub0FuYXBob3JhID8/IHRoaXMubm9BbmFwaG9yYSxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzXVxuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNvbmNsdXNpb24uZW50aXRpZXMpXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzIC8vIGR1bm5vIHdoYXQgSSdtIGRvaW4nXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBlbXB0eUNsYXVzZSgpIC8vL1RPRE8hISEhISEhIVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpfSAtLS0+ICR7dGhpcy5jb25jbHVzaW9uLnRvU3RyaW5nKCl9YFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jb25jbHVzaW9uLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNvbmNsdXNpb24ub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uY2x1c2lvbi5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKGlkKSlcbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRvcExldmVsKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcywgZW50aXR5KVxuICAgIH1cblxuICAgIGFzeW5jIHRvQWN0aW9uKHRvcExldmVsOkNsYXVzZSk6IFByb21pc2U8QWN0aW9uW10+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQpOiBJZFtdIHtcblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2M7XG4gICAgICAgIHJldHVybiBoMSAmIGgxOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuL0Vudmlyb1wiO1xuaW1wb3J0IHsgUGxhY2Vob2xkZXIgfSBmcm9tIFwiLi9QbGFjZWhvbGRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRW52aXJvIGltcGxlbWVudHMgRW52aXJvIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHJvb3Q/OiBIVE1MRWxlbWVudCwgcmVhZG9ubHkgZGljdGlvbmFyeTogeyBbaWQ6IElkXTogV3JhcHBlciB9ID0ge30pIHtcblxuICAgIH1cblxuICAgIGFzeW5jIGdldChpZDogSWQpOiBQcm9taXNlPFdyYXBwZXIgfCB1bmRlZmluZWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF1cbiAgICB9XG5cbiAgICBnZXQgdmFsdWVzKCk6IFdyYXBwZXJbXSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuZGljdGlvbmFyeSlcbiAgICB9XG5cbiAgICBzZXRQbGFjZWhvbGRlcihpZDogSWQpOiBXcmFwcGVyIHtcbiAgICAgICAgdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IG5ldyBQbGFjZWhvbGRlcigpXG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdXG4gICAgfVxuXG4gICAgZXhpc3RzKGlkOiBJZCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXSAmJiAhKHRoaXMuZGljdGlvbmFyeVtpZF0gaW5zdGFuY2VvZiBQbGFjZWhvbGRlcilcbiAgICB9XG5cbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q6IFdyYXBwZXIpOiB2b2lkIHtcblxuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IHRoaXMuZGljdGlvbmFyeVtpZF1cblxuICAgICAgICBpZiAocGxhY2Vob2xkZXIgJiYgcGxhY2Vob2xkZXIgaW5zdGFuY2VvZiBQbGFjZWhvbGRlcikge1xuXG4gICAgICAgICAgICBwbGFjZWhvbGRlci5wcmVkaWNhdGVzLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICAgICAgb2JqZWN0LnNldChwKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdGhpcy5kaWN0aW9uYXJ5W2lkXSA9IG9iamVjdFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBhc3luYyBxdWVyeShjbGF1c2U6IENsYXVzZSk6IFByb21pc2U8TWFwW10+IHsgLy9UT0RPIHRoaXMgaXMgYSB0bXAgc29sdXRpb24sIGZvciBhbmFwaG9yYSByZXNvbHV0aW9uLCBidXQganVzdCB3aXRoIGRlc2NyaXB0aW9ucywgd2l0aG91dCB0YWtpbmcgKG11bHRpLWVudGl0eSkgcmVsYXRpb25zaGlwcyBpbnRvIGFjY291bnRcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXModGhpcy5kaWN0aW9uYXJ5KVxuICAgICAgICAgICAgLm1hcCh4ID0+ICh7IGU6IHhbMF0sIHc6IHhbMV0gfSkpXG5cbiAgICAgICAgY29uc3QgcXVlcnkgPSBjbGF1c2UgLy8gZGVzY3JpYmVkIGVudGl0aWVzXG4gICAgICAgICAgICAuZW50aXRpZXNcbiAgICAgICAgICAgIC5tYXAoZSA9PiAoeyBlLCBkZXNjOiBjbGF1c2UudGhlbWUuZGVzY3JpYmUoZSkgfSkpXG5cbiAgICAgICAgY29uc3QgcmVzID0gcXVlcnlcbiAgICAgICAgICAgIC5mbGF0TWFwKHEgPT4gKHsgZnJvbTogcS5lLCB0bzogdW5pdmVyc2UuZmlsdGVyKHUgPT4gcS5kZXNjLmV2ZXJ5KGQgPT4gdS53LmlzKGQpKSkgfSkpXG5cbiAgICAgICAgY29uc3QgcmVzU2l6ZSA9IE1hdGgubWF4KC4uLnJlcy5tYXAocSA9PiBxLnRvLmxlbmd0aCkpO1xuICAgICAgICBjb25zdCBmcm9tVG9UbyA9IChmcm9tOiBJZCkgPT4gcmVzLmZpbHRlcih4ID0+IHguZnJvbSA9PT0gZnJvbSlbMF0udG8ubWFwKHggPT4geC5lKTtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSAobjogbnVtYmVyKSA9PiBbLi4ubmV3IEFycmF5KG4pLmtleXMoKV1cblxuICAgICAgICBjb25zdCByZXMyID0gcmFuZ2UocmVzU2l6ZSkubWFwKGkgPT5cbiAgICAgICAgICAgIGNsYXVzZVxuICAgICAgICAgICAgICAgIC5lbnRpdGllc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnJvbSA9PiBmcm9tVG9Ubyhmcm9tKS5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgIC5tYXAoZnJvbSA9PiAoeyBbZnJvbV06IGZyb21Ub1RvKGZyb20pW2ldID8/IGZyb21Ub1RvKGZyb20pWzBdIH0pKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpKVxuXG4gICAgICAgIHJldHVybiByZXMyIC8vIHJldHVybiBsaXN0IG9mIG1hcHMsIHdoZXJlIGVhY2ggbWFwIHNob3VsZCBzaG91bGQgaGF2ZSBBTEwgaWRzIGZyb20gY2xhdXNlIGluIGl0cyBrZXlzLCBlZzogW3tpZDI6aWQxLCBpZDQ6aWQzfSwge2lkMjoxLCBpZDQ6M31dLlxuICAgIH1cblxufSIsImltcG9ydCB7IGdldENvbmNlcHRzIH0gZnJvbSBcIi4vZ2V0Q29uY2VwdHNcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uY3JldGVXcmFwcGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBvYmplY3Q6IGFueSxcbiAgICAgICAgcmVhZG9ubHkgc2ltcGxlQ29uY2VwdHM6IHsgW2NvbmNlcHROYW1lOiBzdHJpbmddOiBzdHJpbmdbXSB9ID0gb2JqZWN0LnNpbXBsZUNvbmNlcHRzID8/IHt9KSB7XG5cbiAgICAgICAgb2JqZWN0LnNpbXBsZUNvbmNlcHRzID0gc2ltcGxlQ29uY2VwdHNcbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBzdHJpbmcsIHByb3BzPzogc3RyaW5nW10pOiB2b2lkIHtcblxuICAgICAgICAodGhpcy5vYmplY3QgYXMgYW55KVtwcmVkaWNhdGVdID0gdHJ1ZSAvLyBUT0RPOiByZW1vdmVcblxuICAgICAgICBpZiAocHJvcHMgJiYgcHJvcHMubGVuZ3RoID4gMSkgeyAvLyBzZXQgdGhlIHBlZGljYXRlIG9uIHRoZSBwYXRoXG4gICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwcm9wcywgcHJlZGljYXRlKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICAvLzEgaWYgbGVuKHByb3BzKSA9PSAxIHVzZSBpdCBhcyBhIGNvbmNlcHRcbiAgICAgICAgaWYgKHByb3BzICYmIHByb3BzLmxlbmd0aCA9PT0gMSkge1xuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5zaW1wbGVDb25jZXB0cykuaW5jbHVkZXMocHJvcHNbMF0pKSB7IC8vIGlzIGNvbmNlcHRcbiAgICAgICAgICAgICAgICB0aGlzLnNldE5lc3RlZCh0aGlzLnNpbXBsZUNvbmNlcHRzW3Byb3BzWzBdXSwgcHJlZGljYXRlKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldE5lc3RlZChwcm9wcywgcHJlZGljYXRlKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vMiBpZiBsZW4ocHJvcHMpID09IDAgZ2V0IHRoZSBjb25jZXB0IGZyb20gdGhlIHByZWRpY2F0ZSAoZWc6IHJlZCBpcyBhICdjb2xvcicpXG4gICAgICAgIGNvbnN0IGNvbmNlcHRzID0gZ2V0Q29uY2VwdHMocHJlZGljYXRlKVxuXG4gICAgICAgIGlmIChjb25jZXB0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXROZXN0ZWQodGhpcy5zaW1wbGVDb25jZXB0c1tjb25jZXB0c1swXV0sIHByZWRpY2F0ZSlcblxuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogc3RyaW5nLCAuLi5hcmdzOiBXcmFwcGVyW10pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLm9iamVjdCBhcyBhbnkpW3ByZWRpY2F0ZV0gIT09IHVuZGVmaW5lZCAvLyBUT0RPOiByZW1vdmVcbiAgICB9XG5cbiAgICBzZXRBbGlhcyhjb25jZXB0TmFtZTogc3RyaW5nLCBwcm9wUGF0aDogc3RyaW5nW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zaW1wbGVDb25jZXB0c1tjb25jZXB0TmFtZV0gPSBwcm9wUGF0aFxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzZXROZXN0ZWQocGF0aDogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcpIHtcblxuICAgICAgICBsZXQgeCA9IHRoaXMub2JqZWN0W3BhdGhbMF1dXG5cbiAgICAgICAgcGF0aC5zbGljZSgxLCAtMikuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgIHggPSB0aGlzLm9iamVjdFtwXVxuICAgICAgICB9KTtcblxuICAgICAgICB4W3BhdGhbcGF0aC5sZW5ndGggLSAxXV0gPSB2YWx1ZVxuXG4gICAgfVxuXG4gICAgcG9pbnRPdXQob3B0cz86IHsgdHVybk9mZjogYm9vbGVhbjsgfSk6IHZvaWQge1xuXG4gICAgICAgIGlmICh0aGlzLm9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdC5zdHlsZS5vdXRsaW5lID0gb3B0cz8udHVybk9mZiA/ICcnIDogJyNmMDAgc29saWQgMnB4J1xuICAgICAgICB9XG5cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9DbGF1c2VcIjtcbmltcG9ydCB7IElkLCBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IFdyYXBwZXIgZnJvbSBcIi4vV3JhcHBlclwiO1xuaW1wb3J0IEJhc2VFbnZpcm8gZnJvbSBcIi4vQmFzZUVudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVudmlybyB7XG4gICAgZ2V0KGlkOiBJZCk6IFByb21pc2U8V3JhcHBlciB8IHVuZGVmaW5lZD5cbiAgICBzZXQoaWQ6IElkLCBvYmplY3Q6IFdyYXBwZXIpOiB2b2lkXG4gICAgc2V0UGxhY2Vob2xkZXIoaWQ6IElkKTogV3JhcHBlclxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogUHJvbWlzZTxNYXBbXT5cbiAgICBleGlzdHMoaWQ6IElkKTogYm9vbGVhblxuICAgIGdldCB2YWx1ZXMoKTogV3JhcHBlcltdXG4gICAgcmVhZG9ubHkgcm9vdD86IEhUTUxFbGVtZW50XG4gICAgLy8gZ2V0IGtleXMoKTogSWRbXVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRFbnZpcm8ob3B0cz86IEdldEVudmlyb09wcyk6IEVudmlybyB7XG4gICAgcmV0dXJuIG5ldyBCYXNlRW52aXJvKG9wdHM/LnJvb3QpXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0RW52aXJvT3BzIHtcbiAgICByb290PzogSFRNTEVsZW1lbnRcbn0iLCJpbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBQbGFjZWhvbGRlciBpbXBsZW1lbnRzIFdyYXBwZXIge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgcHJlZGljYXRlczogc3RyaW5nW10gPSBbXSwgcmVhZG9ubHkgb2JqZWN0OiBhbnkgPSB7fSkge1xuICAgIH1cblxuICAgIHNldChwcmVkaWNhdGU6IHN0cmluZywgcHJvcHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIHRoaXMucHJlZGljYXRlcy5wdXNoKHByZWRpY2F0ZSk7XG4gICAgfVxuXG4gICAgaXMocHJlZGljYXRlOiBzdHJpbmcsIC4uLmFyZ3M6IFdyYXBwZXJbXSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcmVkaWNhdGVzLmluY2x1ZGVzKHByZWRpY2F0ZSk7XG4gICAgfVxuXG4gICAgc2V0QWxpYXMoY29uY2VwdE5hbWU6IHN0cmluZywgcHJvcE9yU3lub25Db25jZXB0OiBzdHJpbmcgfCBzdHJpbmdbXSk6IHZvaWQge1xuICAgIH1cblxuICAgIHBvaW50T3V0KG9wdHM6IHsgdHVybk9mZjogYm9vbGVhbjsgfSk6IHZvaWQge1xuXG4gICAgfVxufVxuIiwiaW1wb3J0IENvbmNyZXRlV3JhcHBlciBmcm9tIFwiLi9Db25jcmV0ZVdyYXBwZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgV3JhcHBlciB7XG5cbiAgICBzZXQocHJlZGljYXRlOiBzdHJpbmcsIHByb3BzPzogc3RyaW5nW10pOiB2b2lkIC8vIG9iai5zZXQoJ3JlZCcpLCBvYmouc2V0KCdvbicsIG9iajIpIC4uLlxuICAgIGlzKHByZWRpY2F0ZTogc3RyaW5nLCAuLi5hcmdzOiBXcmFwcGVyW10pOiBib29sZWFuXG4gICAgc2V0QWxpYXMoY29uY2VwdE5hbWU6IHN0cmluZywgcHJvcFBhdGg6IHN0cmluZ1tdKTogdm9pZFxuICAgIHJlYWRvbmx5IG9iamVjdDogYW55XG4gICAgcG9pbnRPdXQob3B0cz86IHsgdHVybk9mZjogYm9vbGVhbiB9KTogdm9pZFxuICAgIC8vIGdldChwcmVkaWNhdGU6IHN0cmluZyk6IGFueVxuICAgIC8vIGdldFByb3AocGF0aDogc3RyaW5nW10pOiBhbnlcbiAgICAvLyBzZXRQcm9wKHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogYW55KTogdm9pZFxuICAgIC8vIGRlc2NyaWJlKCk6IHN0cmluZ1tdIC8vIFsnYnV0dG9uJywgJ3JlZCcsICdiaWcnLCAuLi5dXG4gICAgLy8gc2V0QWxpYXMobmFtZTogc3RyaW5nLCBwYXRoOiBzdHJpbmdbXSk6IHZvaWQgLy8gLnNldEFsaWFzKCd3aWR0aCcsIFsnc3R5bGUnLCAnd2lkdGgnXSlcbiAgICAvLyBhZGRDb25jZXB0KGNvbmNlcHQ6c3RyaW5nLCBzZXR0ZXI6KCk9PnZvaWQsIGlzOigpPT4pOnZvaWRcbiAgICAvLyBkb1NvbWV0aGluZyhjbGF1c2U6Q2xhdXNlKTphbnkgLy8gZ2V0IG93bmVyc2hpcCBjaGFpbiBhbmQgZG8gc29tZXRoaW5nIHdpdGggdGhlIGNsYXVzZSwgY2xhdXNlIGhhcyBldmVyeXRoaW5nLCBpdCBoYXMgaW5mbyBvbiBzaWRlLWVmZmVjdHMsIHByZWRpY2F0ZSBldGMuLi4/Pz9cblxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwKG86IGFueSkge1xuICAgIHJldHVybiBuZXcgQ29uY3JldGVXcmFwcGVyKG8pXG59IiwiZXhwb3J0IGNvbnN0IHNldHRlclByZWZpeCA9ICdzZXQnXG5leHBvcnQgY29uc3QgaXNQcmVmaXggPSAnaXMnXG5leHBvcnQgY29uc3QgZ2V0dGVyUHJlZml4ID0gJ2dldCdcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmNlcHRzKG9iamVjdDogYW55KTogc3RyaW5nW10ge1xuXG4gICAgLy8gVE9ETzogdHJ5IGdldHRpbmcgYSBjb25jZXB0IGZyb20gYSBzdHJpbmcgb2JqZWN0IHdpdGggYSBcbiAgICAvLyBzcGVjaWFsIGRpY3Rpb25hcnksIGxpa2Uge3JlZDpjb2xvciwgZ3JlZW46Y29sb3IsIGJsdWU6Y29sb3J9XG4gICAgY29uc3Qgc3RyaW5nQ29uY2VwdHM6IHsgW3g6IHN0cmluZ106IHN0cmluZyB9ID0ge1xuICAgICAgICAnZ3JlZW4nOiAnY29sb3InLFxuICAgICAgICAncmVkJzogJ2NvbG9yJyxcbiAgICAgICAgJ2JsdWUnOiAnY29sb3InLFxuICAgICAgICAnYmxhY2snOiAnY29sb3InLFxuICAgICAgICAnYmlnJzogJ3NpemUnXG4gICAgfVxuICAgIGNvbnN0IG1heWJlQ29uY2VwdDogc3RyaW5nIHwgdW5kZWZpbmVkID0gc3RyaW5nQ29uY2VwdHNbb2JqZWN0LnRvU3RyaW5nKCldXG5cbiAgICBpZiAobWF5YmVDb25jZXB0KSB7XG4gICAgICAgIHJldHVybiBbbWF5YmVDb25jZXB0XVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3RcbiAgICAgICAgLmdldE93blByb3BlcnR5TmFtZXMob2JqZWN0KVxuICAgICAgICAuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdC5fX3Byb3RvX18pKVxuICAgICAgICAuZmlsdGVyKHggPT4geC5pbmNsdWRlcyhzZXR0ZXJQcmVmaXgpIHx8IHguaW5jbHVkZXMoaXNQcmVmaXgpKVxuICAgICAgICAubWFwKHggPT4gZ2V0Q29uY2VwdE5hbWUoeCkpXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRlck5hbWUoY29uY2VwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke3NldHRlclByZWZpeH1fJHtjb25jZXB0fWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldElzTmFtZShjb25jZXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7aXNQcmVmaXh9XyR7Y29uY2VwdH1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRHZXR0ZXJOYW1lKGNvbmNlcHQ6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtnZXR0ZXJQcmVmaXh9XyR7Y29uY2VwdH1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb25jZXB0TmFtZShtZXRob2Q6IHN0cmluZykge1xuICAgIHJldHVybiBtZXRob2RcbiAgICAgICAgLnJlcGxhY2UoaXNQcmVmaXgsICcnKVxuICAgICAgICAucmVwbGFjZShzZXR0ZXJQcmVmaXgsICcnKVxuICAgICAgICAucmVwbGFjZShnZXR0ZXJQcmVmaXgsICcnKVxuICAgICAgICAucmVwbGFjZSgnXycsICcnKVxufVxuIiwiaW1wb3J0IG1haW4gZnJvbSBcIi4vbWFpbi9tYWluXCI7XG5pbXBvcnQgYXV0b3Rlc3RlciBmcm9tIFwiLi90ZXN0cy9hdXRvdGVzdGVyXCI7XG5pbXBvcnQgeyB0b2NsYXVzZXRlc3RzIH0gZnJvbSBcIi4vdGVzdHMvdG9jbGF1c2V0ZXN0c1wiO1xuXG4oYXN5bmMgKCk9PntcbiAgICBhd2FpdCB0b2NsYXVzZXRlc3RzKClcbiAgICBhdXRvdGVzdGVyKClcbn0pKClcblxuLy8gbWFpbigpIiwiaW1wb3J0IFRva2VuLCB7IGdldFRva2VuQ29ucyB9IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Ub2tlblwiO1xuaW1wb3J0IHsgZ2V0TGV4ZW1lcyB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IExleGVyLCB7IEFzc2VydEFyZ3MsIENvbnN0cnVjdG9yIH0gZnJvbSBcIi4vTGV4ZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSB0b2tlbnM6IFRva2VuW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcpIHtcblxuICAgICAgICB0aGlzLnRva2VucyA9IHNvdXJjZUNvZGVcbiAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgLm1hcChlID0+ICFlID8gJy4nIDogZSlcbiAgICAgICAgICAgIC5mbGF0TWFwKHN0cmluZyA9PiBnZXRMZXhlbWVzKHN0cmluZylcbiAgICAgICAgICAgICAgICAubWFwKGwgPT4gbmV3IChnZXRUb2tlbkNvbnMobC50eXBlKSkobC5uYW1lKSkpXG5cbiAgICAgICAgY29uc29sZS5kZWJ1ZygndG9rZW5zJywgdGhpcy50b2tlbnMpXG4gICAgICAgIHRoaXMuX3BvcyA9IDBcbiAgICB9XG5cbiAgICBuZXh0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MrK1xuICAgIH1cblxuICAgIGdldCBwb3MoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc1xuICAgIH1cblxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLl9wb3MgPSBwb3NcbiAgICB9XG5cbiAgICBnZXQgcGVlaygpOiBUb2tlbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBjdXJyZW50IHRva2VuIGlmZiBvZiBnaXZlbiB0eXBlIGFuZCBtb3ZlIHRvIG5leHQ7IFxuICAgICAqIGVsc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgZG9uJ3QgbW92ZS5cbiAgICAgKiBAcGFyYW0gYXJncyBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBhc3NlcnQ8VD4oY2xheno6IENvbnN0cnVjdG9yPFQ+LCBhcmdzOiBBc3NlcnRBcmdzKTogVCB8IHVuZGVmaW5lZCB7XG5cbiAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMucGVla1xuXG4gICAgICAgIGlmIChjdXJyZW50IGluc3RhbmNlb2YgY2xhenopIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFxuICAgICAgICB9IGVsc2UgaWYgKGFyZ3MuZXJyb3JPdXQgPz8gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5jcm9hayhhcmdzLmVycm9yTXNnID8/ICcnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvcyA+PSB0aGlzLnRva2Vucy5sZW5ndGhcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUb2tlblR5cGUgfSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIlxuaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZSB7XG4gICAgLyoqdXN1YWxseSByb290IGZvcm0qLyByZWFkb25seSBuYW1lOiBzdHJpbmdcbiAgICAvKip0b2tlbiB0eXBlKi8gcmVhZG9ubHkgdHlwZTogVG9rZW5UeXBlXG4gICAgLyoqdXNlZnVsIGZvciBpcnJlZ3VsYXIgc3R1ZmYqLyByZWFkb25seSBmb3Jtcz86IHN0cmluZ1tdXG4gICAgLyoqcmVmZXJzIHRvIHZlcmIgY29uanVnYXRpb25zIG9yIHBsdXJhbCBmb3JtcyovIHJlYWRvbmx5IHJlZ3VsYXI/OiBib29sZWFuXG4gICAgLyoqc2VtYW50aWNhbCBkZXBlbmRlY2UqLyByZWFkb25seSBkZXJpdmVkRnJvbT86IHN0cmluZ1xuICAgIC8qKnNlbWFudGljYWwgZXF1aXZhbGVuY2UqLyByZWFkb25seSBhbGlhc0Zvcj86IHN0cmluZ1xuICAgIC8qKm1hZGUgdXAgb2YgbW9yZSBsZXhlbWVzKi8gcmVhZG9ubHkgY29udHJhY3Rpb25Gb3I/OiBzdHJpbmdbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybXNPZihsZXhlbWU6IExleGVtZSkge1xuXG4gICAgcmV0dXJuIFtsZXhlbWUubmFtZV0uY29uY2F0KGxleGVtZT8uZm9ybXMgPz8gW10pXG4gICAgICAgIC5jb25jYXQobGV4ZW1lLnJlZ3VsYXIgPyBbYCR7bGV4ZW1lLm5hbWV9c2BdIDogW10pXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVtZXMod29yZDogc3RyaW5nKTogTGV4ZW1lW10ge1xuXG4gICAgY29uc3QgbGV4ZW1lID0gbGV4ZW1lcy5maWx0ZXIoeCA9PiBmb3Jtc09mKHgpLmluY2x1ZGVzKHdvcmQpKVswXVxuICAgICAgICA/PyB7IG5hbWU6IHdvcmQsIHR5cGU6ICdhZGonIH1cblxuICAgIHJldHVybiBsZXhlbWUuY29udHJhY3Rpb25Gb3IgP1xuICAgICAgICBsZXhlbWUuY29udHJhY3Rpb25Gb3IuZmxhdE1hcCh4ID0+IGdldExleGVtZXMoeCkpIDpcbiAgICAgICAgW2xleGVtZV1cblxufSIsImltcG9ydCBUb2tlbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvVG9rZW5cIlxuaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlcntcbiAgICBnZXQgcGVlaygpOlRva2VuXG4gICAgZ2V0IHBvcygpOm51bWJlclxuICAgIGdldCBpc0VuZCgpOmJvb2xlYW5cbiAgICBuZXh0KCk6dm9pZFxuICAgIGJhY2tUbyhwb3M6bnVtYmVyKTp2b2lkXG4gICAgY3JvYWsoZXJyb3JNc2c6c3RyaW5nKTp2b2lkICAgXG4gICAgYXNzZXJ0IDxUPihjbGF6ejpDb25zdHJ1Y3RvcjxUPiwgYXJnczpBc3NlcnRBcmdzKTogVHx1bmRlZmluZWQgXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXJ0QXJnc3tcbiAgICBlcnJvck1zZz86c3RyaW5nXG4gICAgZXJyb3JPdXQ/OmJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExleGVyKHNvdXJjZUNvZGU6c3RyaW5nKTpMZXhlcntcbiAgICByZXR1cm4gbmV3IEVhZ2VyTGV4ZXIoc291cmNlQ29kZSlcbn1cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUXG4iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIjtcblxuXG5leHBvcnQgY29uc3QgbGV4ZW1lczogTGV4ZW1lW10gPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnaGF2ZScsXG4gICAgICAgIHR5cGU6ICdtdmVyYicsXG4gICAgICAgIGZvcm1zOiBbJ2hhdmUnLCAnaGFzJ10sXG4gICAgICAgIHJlZ3VsYXI6IGZhbHNlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2J1dHRvbicsXG4gICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgcmVndWxhciA6IHRydWVcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnY2xpY2snLFxuICAgICAgICB0eXBlOiAnbXZlcmInLFxuICAgICAgICBmb3JtczogWydjbGljayddLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2NsaWNrZWQnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgZGVyaXZlZEZyb206ICdjbGljaydcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAncHJlc3NlZCcsXG4gICAgICAgIHR5cGU6ICdhZGonLFxuICAgICAgICBhbGlhc0ZvcjogJ2NsaWNrZWQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2NhdCcsXG4gICAgICAgIHR5cGU6ICdub3VuJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdiZScsXG4gICAgICAgIHR5cGU6ICdjb3B1bGEnLFxuICAgICAgICBmb3JtczogWydpcycsICdhcmUnXSxcbiAgICAgICAgcmVndWxhcjogZmFsc2VcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiBcImlzbid0XCIsXG4gICAgICAgIHR5cGU6ICdjb250cmFjdGlvbicsXG4gICAgICAgIGNvbnRyYWN0aW9uRm9yOiBbJ2lzJywgJ25vdCddXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogXCJyZWRcIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6IFwiZ3JlZW5cIixcbiAgICAgICAgdHlwZTogXCJhZGpcIlxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6IFwiZXhpc3RcIixcbiAgICAgICAgdHlwZTogXCJpdmVyYlwiLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2RvJyxcbiAgICAgICAgdHlwZTogJ2h2ZXJiJyxcbiAgICAgICAgcmVndWxhcjogZmFsc2UsXG4gICAgICAgIGZvcm1zOiBbJ2RvJywgJ2RvZXMnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdzb21lJyxcbiAgICAgICAgdHlwZTogJ2V4aXN0cXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2V2ZXJ5JyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhbGwnLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2FueScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAndG8nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3dpdGgnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ2Zyb20nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ29mJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdvdmVyJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdvbicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYXQnLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3RoZW4nLFxuICAgICAgICB0eXBlOiAndGhlbicgLy8gZmlsbGVyIHdvcmRcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnaWYnLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnd2hlbicsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdiZWNhdXNlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3doaWxlJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgbmFtZTogJ3RoYXQnLFxuICAgICAgICB0eXBlOiAncmVscHJvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnbm90JyxcbiAgICAgICAgdHlwZTogJ25lZ2F0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICd0aGUnLFxuICAgICAgICB0eXBlOiAnZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhJyxcbiAgICAgICAgdHlwZTogJ2luZGVmYXJ0J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIG5hbWU6ICdhbicsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnLicsXG4gICAgICAgIHR5cGU6ICdmdWxsc3RvcCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICBuYW1lOiAnYW5kJyxcbiAgICAgICAgdHlwZTogJ25vbnN1YmNvbmonXG4gICAgfVxuXSIsImltcG9ydCBBc3QgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0FzdFwiO1xuaW1wb3J0IEJpbmFyeVF1ZXN0aW9uIGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9CaW5hcnlRdWVzdGlvblwiO1xuaW1wb3J0IENvbXBvdW5kU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL0NvbXBvdW5kU2VudGVuY2VcIjtcbmltcG9ydCBEZWNsYXJhdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvRGVjbGFyYXRpb25cIjtcbmltcG9ydCBRdWVzdGlvbiBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvUXVlc3Rpb25cIjtcbmltcG9ydCBTaW1wbGVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvU2ltcGxlU2VudGVuY2VcIjtcbmltcG9ydCBWZXJiU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1ZlcmJTZW50ZW5jZVwiO1xuaW1wb3J0IENvbXBsZW1lbnQgZnJvbSBcIi4uL2FzdC9waHJhc2VzL0NvbXBsZW1lbnRcIjtcbmltcG9ydCBOb3VuUGhyYXNlIGZyb20gXCIuLi9hc3QvcGhyYXNlcy9Ob3VuUGhyYXNlXCI7XG5pbXBvcnQgU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2FzdC9pbnRlcmZhY2VzL1N1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgQ29tcGxleFNlbnRlbmNlIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvbXBsZXhTZW50ZW5jZVwiO1xuaW1wb3J0IENvbmp1bmN0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29uanVuY3RpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IENvcHVsYVF1ZXN0aW9uIGZyb20gXCIuLi9hc3Qvc2VudGVuY2VzL0NvcHVsYVF1ZXN0aW9uXCI7XG5pbXBvcnQgQ29wdWxhU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvQ29wdWxhU2VudGVuY2VcIjtcbmltcG9ydCBJbnRyYW5zaXRpdmVTZW50ZW5jZSBmcm9tIFwiLi4vYXN0L3NlbnRlbmNlcy9JbnRyYW5zaXRpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IE1vbm90cmFuc2l0aXZlU2VudGVuY2UgZnJvbSBcIi4uL2FzdC9zZW50ZW5jZXMvTW9ub3RyYW5zaXRpdmVTZW50ZW5jZVwiO1xuaW1wb3J0IEFkamVjdGl2ZSBmcm9tIFwiLi4vYXN0L3Rva2Vucy9BZGplY3RpdmVcIjtcbmltcG9ydCBBcnRpY2xlIGZyb20gXCIuLi9hc3QvdG9rZW5zL0FydGljbGVcIjtcbmltcG9ydCBDb3B1bGEgZnJvbSBcIi4uL2FzdC90b2tlbnMvQ29wdWxhXCI7XG5pbXBvcnQgSVZlcmIgZnJvbSBcIi4uL2FzdC90b2tlbnMvSVZlcmJcIjtcbmltcG9ydCBNVmVyYiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9NVmVyYlwiO1xuaW1wb3J0IE5lZ2F0aW9uIGZyb20gXCIuLi9hc3QvdG9rZW5zL05lZ2F0aW9uXCI7XG5pbXBvcnQgTm91biBmcm9tIFwiLi4vYXN0L3Rva2Vucy9Ob3VuXCI7XG5pbXBvcnQgUHJlcG9zaXRpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvUHJlcG9zaXRpb25cIjtcbmltcG9ydCBRdWFudGlmaWVyIGZyb20gXCIuLi9hc3QvdG9rZW5zL1F1YW50aWZpZXJcIjtcbmltcG9ydCBTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24gZnJvbSBcIi4uL2FzdC90b2tlbnMvU3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9uXCI7XG5pbXBvcnQgVGhlbiBmcm9tIFwiLi4vYXN0L3Rva2Vucy9UaGVuXCI7XG5pbXBvcnQgTGV4ZXIsIHsgZ2V0TGV4ZXIgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZXJcIjtcbmltcG9ydCBQYXJzZXIgZnJvbSBcIi4vUGFyc2VyXCI7XG5pbXBvcnQgQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UgZnJvbSBcIi4uL2FzdC9waHJhc2VzL0NvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlXCI7XG5pbXBvcnQgUmVsYXRpdmVQcm9ub3VuIGZyb20gXCIuLi9hc3QvdG9rZW5zL1JlbGF0aXZlUHJvbm91blwiO1xuaW1wb3J0IENvbnN0aXR1ZW50IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9Db25zdGl0dWVudFwiO1xuaW1wb3J0IEZ1bGxTdG9wIGZyb20gXCIuLi9hc3QvdG9rZW5zL0Z1bGxTdG9wXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2ljUGFyc2VyIGltcGxlbWVudHMgUGFyc2VyIHtcblxuICAgIHByb3RlY3RlZCBseDogTGV4ZXJcblxuICAgIGNvbnN0cnVjdG9yKHNvdXJjZUNvZGU6IHN0cmluZykge1xuICAgICAgICB0aGlzLmx4ID0gZ2V0TGV4ZXIoc291cmNlQ29kZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdHJ5PFQgZXh0ZW5kcyBBc3Q+KG1ldGhvZDogKCkgPT4gVCkge1xuXG4gICAgICAgIGNvbnN0IG1lbWVudG8gPSB0aGlzLmx4LnBvc1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kKClcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZGVidWcoKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlKVxuICAgICAgICAgICAgdGhpcy5seC5iYWNrVG8obWVtZW50bylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGVycm9yT3V0KGVycm9yTXNnOiBzdHJpbmcpOiBDb25zdGl0dWVudCB7XG4gICAgICAgIHRoaXMubHguY3JvYWsoZXJyb3JNc2cpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1zZylcbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpOiBDb25zdGl0dWVudFtdIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBDb25zdGl0dWVudFtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubHguaXNFbmQpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnBhcnNlKCkpXG4gICAgICAgICAgICB0aGlzLmx4LmFzc2VydChGdWxsU3RvcCwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG4gICAgcGFyc2UoKTogQ29uc3RpdHVlbnQge1xuICAgICAgICByZXR1cm4gdGhpcy50cnkodGhpcy5wYXJzZVF1ZXN0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZURlY2xhcmF0aW9uKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZU5vdW5QaHJhc2UpIC8vIGZvciBxdWljayB0b3BpYyByZWZlcmVuY2VcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZURlY2xhcmF0aW9uID0gKCk6IERlY2xhcmF0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb21wb3VuZClcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VTaW1wbGUpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZURlY2xhcmF0aW9uKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZVF1ZXN0aW9uID0gKCk6IFF1ZXN0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VCaW5hcnlRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlUXVlc3Rpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlU2ltcGxlID0gKCk6IFNpbXBsZVNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VWZXJiU2VudGVuY2UpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVNpbXBsZSgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3VuZCA9ICgpOiBDb21wb3VuZFNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb21wbGV4KVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy5wYXJzZUNvbmp1bmN0aXZlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VDb21wb3VuZCgpJylcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VWZXJiU2VudGVuY2UgPSAoKTogVmVyYlNlbnRlbmNlID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSlcbiAgICAgICAgICAgID8/IHRoaXMudHJ5KHRoaXMucGFyc2VNb25vdHJhbnNpdGl2ZVNlbnRlbmNlKVxuICAgICAgICAgICAgPz8gdGhpcy5lcnJvck91dCgncGFyc2VWZXJiU2VudGVuY2UoKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhU2VudGVuY2UgPSAoKTogQ29wdWxhU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVNlbnRlbmNlKCksIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3QgbmVnYXRpb24gPSB0aGlzLmx4LmFzc2VydChOZWdhdGlvbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVNlbnRlbmNlKHN1YmplY3QsIGNvcHVsYSBhcyBDb3B1bGEsIHByZWRpY2F0ZSwgbmVnYXRpb24pXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcGxleCA9ICgpOiBDb21wbGV4U2VudGVuY2UgPT4ge1xuXG4gICAgICAgIGNvbnN0IHN1YmNvbmogPSB0aGlzLmx4LmFzc2VydChTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG5cbiAgICAgICAgaWYgKHN1YmNvbmopIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgdGhpcy5seC5hc3NlcnQoVGhlbiwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29tcGxleFNlbnRlbmNlKGNvbmRpdGlvbiwgb3V0Y29tZSwgc3ViY29uailcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG91dGNvbWUgPSB0aGlzLnBhcnNlU2ltcGxlKClcbiAgICAgICAgICAgIGNvbnN0IHN1YmNvbmogPSB0aGlzLmx4LmFzc2VydChTdWJvcmRpbmF0aW5nQ29uanVuY3Rpb24sIHsgZXJyb3JPdXQ6IHRydWUsIGVycm9yTXNnOiAnZXhwZWN0ZWQgc3Vib3JkaW5hdGluZyBjb25qdW5jdGlvbicgfSlcbiAgICAgICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHRoaXMucGFyc2VTaW1wbGUoKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb21wbGV4U2VudGVuY2UoY29uZGl0aW9uLCBvdXRjb21lLCBzdWJjb25qIGFzIFN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbilcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlSW50cmFuc2l0aXZlU2VudGVuY2UgPSAoKTogSW50cmFuc2l0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICBjb25zdCBuZWdhdGlvbiA9IHRoaXMubHguYXNzZXJ0KE5lZ2F0aW9uLCB7IGVycm9yT3V0OiBmYWxzZSB9KVxuICAgICAgICBjb25zdCBpdmVyYiA9IHRoaXMubHguYXNzZXJ0KElWZXJiLCB7IGVycm9yTXNnOiAncGFyc2VJbnRyYW5zaXRpdmVTZW50ZW5jZSgpLCBleHBlY3RlZCBpLXZlcmInIH0pXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRyYW5zaXRpdmVTZW50ZW5jZShzdWJqZWN0LCBpdmVyYiBhcyBJVmVyYiwgY29tcGxlbWVudHMsIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UgPSAoKTogTW9ub3RyYW5zaXRpdmVTZW50ZW5jZSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IG5lZ2F0aW9uID0gdGhpcy5seC5hc3NlcnQoTmVnYXRpb24sIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG4gICAgICAgIGNvbnN0IG12ZXJiID0gdGhpcy5seC5hc3NlcnQoTVZlcmIsIHsgZXJyb3JNc2c6ICdwYXJzZU1vbm90cmFuc2l0aXZlU2VudGVuY2UoKSwgZXhwZWN0ZWQgaS12ZXJiJyB9KVxuICAgICAgICBjb25zdCBjczEgPSB0aGlzLnBhcnNlQ29tcGxlbWVudHMoKVxuICAgICAgICBjb25zdCBvYmplY3QgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIGNvbnN0IGNzMiA9IHRoaXMucGFyc2VDb21wbGVtZW50cygpXG4gICAgICAgIHJldHVybiBuZXcgTW9ub3RyYW5zaXRpdmVTZW50ZW5jZShzdWJqZWN0LCBtdmVyYiBhcyBNVmVyYiwgb2JqZWN0LCBjczEuY29uY2F0KGNzMiksIG5lZ2F0aW9uKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUJpbmFyeVF1ZXN0aW9uID0gKCk6IEJpbmFyeVF1ZXN0aW9uID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJ5KHRoaXMucGFyc2VDb3B1bGFRdWVzdGlvbilcbiAgICAgICAgICAgID8/IHRoaXMuZXJyb3JPdXQoJ3BhcnNlQmluYXJ5UXVlc3Rpb24oKScpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29wdWxhUXVlc3Rpb24gPSAoKTogQ29wdWxhUXVlc3Rpb24gPT4ge1xuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVF1ZXN0aW9uKCksIGV4cGVjdGVkIGNvcHVsYScgfSlcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMucGFyc2VOb3VuUGhyYXNlKClcbiAgICAgICAgY29uc3QgcHJlZGljYXRlID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVF1ZXN0aW9uKHN1YmplY3QsIHByZWRpY2F0ZSwgY29wdWxhIGFzIENvcHVsYSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VOb3VuUGhyYXNlID0gKCk6IE5vdW5QaHJhc2UgPT4ge1xuICAgICAgICBjb25zdCBxdWFudGlmaWVyID0gdGhpcy5seC5hc3NlcnQoUXVhbnRpZmllciwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3QgYXJ0aWNsZSA9IHRoaXMubHguYXNzZXJ0KEFydGljbGUsIHsgZXJyb3JPdXQ6IGZhbHNlIH0pXG5cbiAgICAgICAgbGV0IGFkamVjdGl2ZXMgPSBbXVxuICAgICAgICBsZXQgYWRqXG5cbiAgICAgICAgd2hpbGUgKGFkaiA9IHRoaXMubHguYXNzZXJ0KEFkamVjdGl2ZSwgeyBlcnJvck91dDogZmFsc2UgfSkpIHtcbiAgICAgICAgICAgIGFkamVjdGl2ZXMucHVzaChhZGopXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBub3VuID0gdGhpcy5seC5hc3NlcnQoTm91biwgeyBlcnJvck91dDogZmFsc2UgfSlcbiAgICAgICAgY29uc3Qgc3Vib3JkaW5hdGVDbGF1c2UgPSB0aGlzLnRyeSh0aGlzLnBhcnNlU3Vib3JkaW5hdGVDbGF1c2UpXG4gICAgICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gdGhpcy5wYXJzZUNvbXBsZW1lbnRzKClcblxuICAgICAgICByZXR1cm4gbmV3IE5vdW5QaHJhc2UoYWRqZWN0aXZlcywgY29tcGxlbWVudHMsIG5vdW4sIHF1YW50aWZpZXIsIGFydGljbGUsIHN1Ym9yZGluYXRlQ2xhdXNlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBsZW1lbnRzID0gKCk6IENvbXBsZW1lbnRbXSA9PiB7XG5cbiAgICAgICAgY29uc3QgY29tcGxlbWVudHMgPSBbXVxuICAgICAgICBsZXQgY29tcFxuXG4gICAgICAgIHdoaWxlIChjb21wID0gdGhpcy50cnkodGhpcy5wYXJzZUNvbXBsZW1lbnQpKSB7XG4gICAgICAgICAgICBjb21wbGVtZW50cy5wdXNoKGNvbXApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29tcGxlbWVudHNcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wbGVtZW50ID0gKCk6IENvbXBsZW1lbnQgPT4ge1xuICAgICAgICBjb25zdCBwcmVwb3NpdGlvbiA9IHRoaXMubHguYXNzZXJ0KFByZXBvc2l0aW9uLCB7IGVycm9yTXNnOiAncGFyc2VDb21wbGVtZW50KCkgZXhwZWN0ZWQgcHJlcG9zaXRpb24nIH0pXG4gICAgICAgIGNvbnN0IG5vdW5QaHJhc2UgPSB0aGlzLnBhcnNlTm91blBocmFzZSgpXG4gICAgICAgIHJldHVybiBuZXcgQ29tcGxlbWVudChwcmVwb3NpdGlvbiBhcyBQcmVwb3NpdGlvbiwgbm91blBocmFzZSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VTdWJvcmRpbmF0ZUNsYXVzZSA9ICgpOiBTdWJvcmRpbmF0ZUNsYXVzZSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnBhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UpXG4gICAgICAgICAgICA/PyB0aGlzLmVycm9yT3V0KCdwYXJzZVN1Ym9yZGluYXRlQ2xhdXNlKCknKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlID0gKCk6IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlID0+IHtcbiAgICAgICAgY29uc3QgcmVscHJvbiA9IHRoaXMubHguYXNzZXJ0KFJlbGF0aXZlUHJvbm91biwgeyBlcnJvck1zZzogJ3BhcnNlQ29wdWxhU3Vib3JkaW5hdGVDbGF1c2UoKSBleHBlY3RlZCByZWxhdGl2ZSBwcm9ub3VuJyB9KVxuICAgICAgICBjb25zdCBjb3B1bGEgPSB0aGlzLmx4LmFzc2VydChDb3B1bGEsIHsgZXJyb3JNc2c6ICdwYXJzZUNvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKCkgZXhwZWN0ZWQgY29wdWxhJyB9KVxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gdGhpcy5wYXJzZU5vdW5QaHJhc2UoKVxuICAgICAgICByZXR1cm4gbmV3IENvcHVsYVN1Ym9yZGluYXRlQ2xhdXNlKHJlbHByb24gYXMgUmVsYXRpdmVQcm9ub3VuLCBzdWJqZWN0LCBjb3B1bGEgYXMgQ29wdWxhKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbmp1bmN0aXZlID0gKCk6IENvbmp1bmN0aXZlU2VudGVuY2UgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05PVCBJTVBMRU1FTlRFRCEgVE9ETyEnKVxuICAgIH1cblxufSIsImltcG9ydCBDb25zdGl0dWVudCBmcm9tIFwiLi4vYXN0L2ludGVyZmFjZXMvQ29uc3RpdHVlbnRcIjtcbmltcG9ydCBCYXNpY1BhcnNlciBmcm9tIFwiLi9CYXNpY1BhcnNlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgUGFyc2Vye1xuICAgIHBhcnNlKCk6Q29uc3RpdHVlbnQgICBcbiAgICBwYXJzZUFsbCgpOkNvbnN0aXR1ZW50W11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOnN0cmluZyk6UGFyc2Vye1xuICAgIHJldHVybiBuZXcgQmFzaWNQYXJzZXIoc291cmNlQ29kZSlcbn0iLCJpbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi4vYnJhaW4vQmFzaWNCcmFpblwiO1xuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vYnJhaW4vQnJhaW5cIjtcblxuY29uc3QgdGVzdHMgPSBbdGVzdDEsIHRlc3QyLCB0ZXN0MywgdGVzdDRdXG5cbi8qKlxuICogSW50ZWdyYXRpb24gdGVzdHNcbiovXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBhdXRvdGVzdGVyKCkge1xuXG4gICAgZm9yIChjb25zdCB0ZXN0IG9mIHRlc3RzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGF3YWl0IHRlc3QoKSA/ICdzdWNjZXNzJyA6ICdmYWlsJywgdGVzdC5uYW1lKVxuICAgICAgICBhd2FpdCB3YWl0KDIwMClcbiAgICAgICAgY2xlYXJEb20oKVxuICAgIH1cblxufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0MSgpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCd4IGlzIHJlZC4geCBpcyBhIGJ1dHRvbi4geSBpcyBhIGdyZWVuIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgZ3JlZW4gYnV0dG9uJykpWzBdLnN0eWxlLmJhY2tncm91bmQgPT09ICdncmVlbidcbiAgICBjb25zdCBhc3NlcnQyID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDJcbn1cblxuYXN5bmMgZnVuY3Rpb24gdGVzdDIoKSB7XG4gICAgY29uc3QgYnJhaW4gPSBhd2FpdCBnZXRCcmFpbigpXG4gICAgYXdhaXQgYnJhaW4uZXhlY3V0ZSgneCBpcyByZWQuIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgYSBidXR0b24uIHggaXMgcmVkLicpO1xuICAgIGNvbnN0IGFzc2VydDEgPSAoYnJhaW4gYXMgQmFzaWNCcmFpbikuZW52aXJvLnZhbHVlcy5sZW5ndGggPT09IDFcbiAgICByZXR1cm4gYXNzZXJ0MVxufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0MygpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCd5IGlzIGEgYnV0dG9uLiB4IGlzIHJlZC4geSBpcyBhIGdyZWVuIGJ1dHRvbi4geCBpcyBhIGJ1dHRvbi4geiBpcyBhIGJsYWNrIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBhc3NlcnQxID0gKGF3YWl0IGJyYWluLmV4ZWN1dGUoJ2EgcmVkIGJ1dHRvbicpKVswXS5zdHlsZS5iYWNrZ3JvdW5kID09PSAncmVkJ1xuICAgIGNvbnN0IGFzc2VydDIgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYSBncmVlbiBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2dyZWVuJ1xuICAgIGNvbnN0IGFzc2VydDMgPSAoYXdhaXQgYnJhaW4uZXhlY3V0ZSgnYSBibGFjayBidXR0b24nKSlbMF0uc3R5bGUuYmFja2dyb3VuZCA9PT0gJ2JsYWNrJ1xuICAgIHJldHVybiBhc3NlcnQxICYmIGFzc2VydDIgJiYgYXNzZXJ0M1xufVxuXG5hc3luYyBmdW5jdGlvbiB0ZXN0NCgpIHtcbiAgICBjb25zdCBicmFpbiA9IGF3YWl0IGdldEJyYWluKClcbiAgICBhd2FpdCBicmFpbi5leGVjdXRlKCdhIGJ1dHRvbiBpcyBhIGJ1dHRvbi4nKTtcbiAgICBjb25zdCBidXR0b24gPSBhd2FpdCBicmFpbi5leGVjdXRlKCdidXR0b24nKVxuICAgIHJldHVybiBidXR0b24gIT09IHVuZGVmaW5lZFxufVxuXG5hc3luYyBmdW5jdGlvbiB3YWl0KG1pbGxpc2VjczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChvaywgZXJyKSA9PiB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb2sodHJ1ZSksIG1pbGxpc2VjcylcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBjbGVhckRvbSgpIHtcbiAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICcnXG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kID0gJ3doaXRlJ1xufSIsImltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi9wYXJzZXIvUGFyc2VyXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0b2NsYXVzZXRlc3RzKCkge1xuXG4gICAgY29uc3QgdGVzdHMgPSBbXG4gICAgICAgICd0aGUgY29sb3Igb2YgYW55IGJ1dHRvbiBpcyByZWQnLFxuICAgICAgICAnZXZlcnkgYnV0dG9uIGlzIHJlZCcsXG4gICAgICAgICdldmVyeSBidXR0b24gaXMgYSBidXR0b24nLFxuICAgICAgICAndGhlIGNvbG9yIG9mIGFueSBidXR0b24gaXMgdGhlIGJhY2tncm91bmQgb2YgdGhlIHN0eWxlIG9mIHRoZSBidXR0b24nLFxuICAgICAgICAnd2lkdGggb2YgYW55IGJ1dHRvbiBpcyB3aWR0aCBvZiBzdHlsZSBvZiBidXR0b24nXG4gICAgXVxuXG4gICAgZm9yIChjb25zdCB0IG9mIHRlc3RzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHQpXG4gICAgICAgIGNvbnN0IGNsYXVzZSA9IGF3YWl0IGdldFBhcnNlcih0KS5wYXJzZSgpLnRvQ2xhdXNlKClcbiAgICAgICAgY29uc3Qgc3RyaW5nUmVwciA9IGNsYXVzZS50b1N0cmluZygpXG4gICAgICAgIGNvbnNvbGUubG9nKHsgc3RyaW5nUmVwciB9KVxuICAgICAgICAvLyBjb25zdCB0b3BMZXZlbCA9IGNsYXVzZS50b3BMZXZlbCgpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHsgdG9wTGV2ZWwgfSlcbiAgICAgICAgLy8gY29uc3Qgb3duZXJzaGlwQ2hhaW5zID0gdG9wTGV2ZWwubWFwKGUgPT4gY2xhdXNlLmdldE93bmVyc2hpcENoYWluKGUpKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyh7IG93bmVyc2hpcENoYWlucyB9KVxuICAgICAgICAvLyBjb25zdCBvd25lcnNoaXBDaGFpbnNXaXRoTmFtZXMgPSBvd25lcnNoaXBDaGFpbnMubWFwKGUgPT4gZS5mbGF0TWFwKGUgPT4gY2xhdXNlLmRlc2NyaWJlKGUpWzBdKSlcbiAgICAgICAgLy8gY29uc29sZS5sb2coeyBvd25lcnNoaXBDaGFpbnNXaXRoTmFtZXMgfSlcbiAgICB9XG5cbn1cblxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==