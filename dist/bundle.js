/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
                yield a.run(enviro);
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
        return __awaiter(this, void 0, void 0, function* () {
            if (this.clause.args.length > 1) { // not handling relations yet
                return;
            }
            if (this.clause.exactIds) {
                return yield new Edit_1.default(this.clause.args[0], this.clause.predicate.root, []).run(enviro);
            }
            if (this.topLevel.topLevel().includes(this.clause.args[0])) {
                yield this.forTopLevel(enviro);
            }
            else {
                yield this.forNonTopLevel(enviro);
            }
        });
    }
    getProps(topLevelEntity) {
        return this.topLevel
            .getOwnershipChain(topLevelEntity)
            .slice(1)
            .map(e => this.topLevel.theme.describe(e)[0]);
    }
    forTopLevel(enviro) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const q = this.topLevel.theme.about(this.clause.args[0]);
            const maps = yield enviro.query(q);
            const id = (_b = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[this.clause.args[0]]) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)();
            if (!(yield enviro.get(id))) {
                enviro.setPlaceholder(id);
            }
            if (isCreatorAction(this.clause.predicate.root)) {
                new Create_1.default(id, this.clause.predicate.root).run(enviro);
            }
            else {
                new Edit_1.default(id, this.clause.predicate.root, this.getProps(this.clause.args[0])).run(enviro);
            }
        });
    }
    forNonTopLevel(enviro) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // assuming max x.y.z nesting
            const owners = this.topLevel.ownersOf(this.clause.args[0]);
            const hasTopLevel = owners.filter(x => this.topLevel.topLevel().includes(x))[0];
            const topLevelOwner = hasTopLevel ? hasTopLevel : this.topLevel.ownersOf(owners[0])[0];
            if (topLevelOwner === undefined) {
                return;
            }
            const nameOfThis = this.topLevel.theme.describe(this.clause.args[0]);
            if (this.clause.predicate.root === nameOfThis[0]) {
                return;
            }
            const q = this.topLevel.theme.about(topLevelOwner);
            const maps = yield enviro.query(q);
            const id = (_a = maps === null || maps === void 0 ? void 0 : maps[0]) === null || _a === void 0 ? void 0 : _a[topLevelOwner]; //?? getRandomId()
            return new Edit_1.default(id, this.clause.predicate.root, this.getProps(topLevelOwner)).run(enviro);
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

/***/ "./app/src/actuator/ImplyAction.ts":
/*!*****************************************!*\
  !*** ./app/src/actuator/ImplyAction.ts ***!
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
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Wrapper_1 = __webpack_require__(/*! ../enviro/Wrapper */ "./app/src/enviro/Wrapper.ts");
const Edit_1 = __importDefault(__webpack_require__(/*! ./Edit */ "./app/src/actuator/Edit.ts"));
class ImplyAction {
    constructor(condition, conclusion) {
        this.condition = condition;
        this.conclusion = conclusion;
    }
    run(enviro) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('ImplyAction.run()', this.condition.toString(), '--->', this.conclusion.toString())
            const isSetAliasCall = // assume if at least one owned entity that it's a set alias call
             this.condition.getOwnershipChain(this.condition.topLevel()[0]).slice(1).length
                || this.conclusion.getOwnershipChain(this.conclusion.topLevel()[0]).slice(1).length;
            if (isSetAliasCall) {
                this.setAliasCall();
            }
            else {
                this.other(enviro);
            }
        });
    }
    setAliasCall() {
        const top = this.condition.topLevel()[0]; //TODO (!ASSUME!) same as top in conclusion
        const alias = this.condition.getOwnershipChain(top).slice(1);
        const props = this.conclusion.getOwnershipChain(top).slice(1);
        const conceptName = alias.map(x => this.condition.describe(x)[0]); // assume at least one name
        const propsNames = props.map(x => this.conclusion.describe(x)[0]); // same ...
        const protoName = this.condition.describe(top)[0]; // assume one 
        const proto = getProto(protoName);
        (0, Wrapper_1.wrap)(proto).setAlias(conceptName[0], propsNames);
        // console.log(`wrap(${proto}).setAlias(${conceptName[0]}, [${propsNames}])`)
    }
    other(enviro) {
        return __awaiter(this, void 0, void 0, function* () {
            const top = this.condition.topLevel()[0];
            const protoName = this.condition.describe(top)[0]; // assume one 
            const predicate = this.conclusion.describe(top)[0];
            const y = yield enviro.query((0, Clause_1.clauseOf)({ type: 'noun', root: protoName }, 'X'));
            const ids = y.map(m => m['X']);
            ids.forEach(id => new Edit_1.default(id, predicate).run(enviro));
        });
    }
}
exports["default"] = ImplyAction;
const getProto = (name) => ({
    'button': HTMLButtonElement.prototype
}[name]);


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
const Actuator_1 = __webpack_require__(/*! ../actuator/Actuator */ "./app/src/actuator/Actuator.ts");
const toClause_1 = __webpack_require__(/*! ../parser/toClause */ "./app/src/parser/toClause.ts");
class BasicBrain {
    constructor(config, enviro = (0, Enviro_1.default)({ root: document.body }), actuator = (0, Actuator_1.getActuator)()) {
        this.config = config;
        this.enviro = enviro;
        this.actuator = actuator;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const s of this.config.startupCommands) {
                yield this.execute(s);
            }
        });
    }
    execute(natlang) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (const ast of (0, Parser_1.getParser)(natlang, this.config).parseAll()) {
                if (!ast) {
                    continue;
                }
                const clause = yield (0, toClause_1.toClause)(ast);
                if (clause.isSideEffecty) {
                    yield this.actuator.takeAction(clause, this.enviro);
                }
                else {
                    const maps = yield this.enviro.query(clause);
                    const ids = maps.flatMap(m => Object.values(m));
                    const objects = yield Promise.all(ids.map(id => this.enviro.get(id)));
                    this.enviro.values.forEach(o => o.pointOut({ turnOff: true }));
                    objects.forEach(o => o === null || o === void 0 ? void 0 : o.pointOut());
                    objects.map(o => o === null || o === void 0 ? void 0 : o.object).forEach(o => results.push(o));
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
const Config_1 = __webpack_require__(/*! ../config/Config */ "./app/src/config/Config.ts");
const BasicBrain_1 = __importDefault(__webpack_require__(/*! ./BasicBrain */ "./app/src/brain/BasicBrain.ts"));
function getBrain(config = (0, Config_1.getConfig)()) {
    return __awaiter(this, void 0, void 0, function* () {
        const b = new BasicBrain_1.default(config);
        yield b.init();
        return b;
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
    constructor(clause1, clause2, clause2IsRheme, negated = false, exactIds = false, isSideEffecty = false, isImply = false, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments))) {
        this.clause1 = clause1;
        this.clause2 = clause2;
        this.clause2IsRheme = clause2IsRheme;
        this.negated = negated;
        this.exactIds = exactIds;
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
        return new And(this.clause1.copy(opts), this.clause2.copy(opts), this.clause2IsRheme, (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _a !== void 0 ? _a : this.exactIds, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
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
    constructor(predicate, args, negated = false, exactIds = false, isSideEffecty = false, isImply = false, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments)), rheme = (0, Clause_1.emptyClause)()) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
        this.exactIds = exactIds;
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
        return new BasicClause(this.predicate, this.args.map(a => { var _a; return (opts === null || opts === void 0 ? void 0 : opts.map) ? (_a = opts === null || opts === void 0 ? void 0 : opts.map[a]) !== null && _a !== void 0 ? _a : a : a; }), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _a !== void 0 ? _a : this.exactIds, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
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
    ownedBy(id) {
        return this.predicate.root === 'of' && this.args[1] === id ? [this.args[0]] : [];
    }
    ownersOf(id) {
        return this.predicate.root === 'of' && this.args[0] === id ? [this.args[1]] : [];
    }
    toString() {
        const yes = `${this.predicate.root}(${this.args})`;
        return this.negated ? `not(${yes})` : yes;
    }
    describe(id) {
        return this.entities.includes(id) && this.args.length === 1 ? [this.predicate.root] : [];
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
    get theme() {
        return this;
    }
    get entities() {
        return Array.from(new Set(this.args));
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
    constructor(negated = false, isImply = false, hashCode = 99999999, entities = [], isSideEffecty = false, exactIds = false) {
        this.negated = negated;
        this.isImply = isImply;
        this.hashCode = hashCode;
        this.entities = entities;
        this.isSideEffecty = isSideEffecty;
        this.exactIds = exactIds;
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
const ImplyAction_1 = __importDefault(__webpack_require__(/*! ../actuator/ImplyAction */ "./app/src/actuator/ImplyAction.ts"));
class Imply {
    constructor(condition, conclusion, negated = false, exactIds = false, isSideEffecty = false, isImply = true, hashCode = (0, hashString_1.hashString)(JSON.stringify(arguments)), theme = condition.theme) {
        this.condition = condition;
        this.conclusion = conclusion;
        this.negated = negated;
        this.exactIds = exactIds;
        this.isSideEffecty = isSideEffecty;
        this.isImply = isImply;
        this.hashCode = hashCode;
        this.theme = theme;
    }
    and(other, opts) {
        var _a;
        return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b;
        return new Imply(this.condition.copy(opts), this.conclusion.copy(opts), (opts === null || opts === void 0 ? void 0 : opts.negate) ? !this.negated : this.negated, (_a = opts === null || opts === void 0 ? void 0 : opts.exactIds) !== null && _a !== void 0 ? _a : this.exactIds, (_b = opts === null || opts === void 0 ? void 0 : opts.sideEffecty) !== null && _b !== void 0 ? _b : this.isSideEffecty);
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
            return [new ImplyAction_1.default(this.condition, this.conclusion)];
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

/***/ "./app/src/config/Config.ts":
/*!**********************************!*\
  !*** ./app/src/config/Config.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConfig = void 0;
const lexemes_1 = __webpack_require__(/*! ./lexemes */ "./app/src/config/lexemes.ts");
const syntaxes_1 = __webpack_require__(/*! ./syntaxes */ "./app/src/config/syntaxes.ts");
const startupCommands_1 = __webpack_require__(/*! ./startupCommands */ "./app/src/config/startupCommands.ts");
function getConfig() {
    return {
        lexemes: lexemes_1.lexemes,
        getSyntax: syntaxes_1.getSyntax,
        startupCommands: startupCommands_1.startupCommands
    };
}
exports.getConfig = getConfig;


/***/ }),

/***/ "./app/src/config/lexemes.ts":
/*!***********************************!*\
  !*** ./app/src/config/lexemes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemes = void 0;
exports.lexemes = [
    {
        root: 'have',
        type: 'mverb',
        forms: ['have', 'has'],
        regular: false
    },
    {
        root: 'button',
        type: 'noun',
        regular: true
    },
    {
        root: 'click',
        type: 'mverb',
        forms: ['click'],
        regular: true
    },
    {
        root: 'clicked',
        type: 'adj',
        derivedFrom: 'click'
    },
    {
        root: 'pressed',
        type: 'adj',
        aliasFor: 'clicked'
    },
    {
        root: 'cat',
        type: 'noun'
    },
    {
        root: 'be',
        type: 'copula',
        forms: ['is', 'are'],
        regular: false
    },
    {
        root: "isn't",
        type: 'contraction',
        contractionFor: ['is', 'not']
    },
    {
        root: "red",
        type: "adj"
    },
    {
        root: "green",
        type: "adj"
    },
    {
        root: "exist",
        type: "iverb",
        regular: true
    },
    {
        root: 'do',
        type: 'hverb',
        regular: false,
        forms: ['do', 'does']
    },
    {
        root: 'some',
        type: 'existquant'
    },
    {
        root: 'every',
        type: 'uniquant'
    },
    {
        root: 'all',
        type: 'uniquant'
    },
    {
        root: 'any',
        type: 'uniquant'
    },
    {
        root: 'to',
        type: 'preposition'
    },
    {
        root: 'with',
        type: 'preposition'
    },
    {
        root: 'from',
        type: 'preposition'
    },
    {
        root: 'of',
        type: 'preposition'
    },
    {
        root: 'over',
        type: 'preposition'
    },
    {
        root: 'on',
        type: 'preposition'
    },
    {
        root: 'at',
        type: 'preposition'
    },
    {
        root: 'then',
        type: 'then' // filler word
    },
    {
        root: 'if',
        type: 'subconj'
    },
    {
        root: 'when',
        type: 'subconj'
    },
    {
        root: 'because',
        type: 'subconj'
    },
    {
        root: 'while',
        type: 'subconj'
    },
    {
        root: 'that',
        type: 'relpron'
    },
    {
        root: 'not',
        type: 'negation'
    },
    {
        root: 'the',
        type: 'defart'
    },
    {
        root: 'a',
        type: 'indefart'
    },
    {
        root: 'an',
        type: 'indefart'
    },
    {
        root: '.',
        type: 'fullstop'
    },
    {
        root: 'and',
        type: 'nonsubconj'
    },
    {
        root: 'black',
        type: 'adj'
    }
];


/***/ }),

/***/ "./app/src/config/startupCommands.ts":
/*!*******************************************!*\
  !*** ./app/src/config/startupCommands.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.startupCommands = void 0;
exports.startupCommands = [
    'color of any button is background of style of button',
    'text of any button is textContent of button'
];


/***/ }),

/***/ "./app/src/config/syntaxes.ts":
/*!************************************!*\
  !*** ./app/src/config/syntaxes.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isNecessary = exports.isAtom = exports.getSyntax = void 0;
function stringLiterals(...args) { return args; }
const values = stringLiterals('nounphrase', 'complement', 'copulasubclause', 'complexsentence1', 'complexsentence2', 'copulasentence', 'iverbsentence', 'mverbsentence', 'lexemelist');
const syntaxes = {
    'nounphrase': [
        { type: ['uniquant', 'existquant'], number: '1|0' },
        { type: ['indefart', 'defart'], number: '1|0' },
        { type: ['adj'], number: '*' },
        { type: ['noun'], number: '1|0' },
        { type: ['copulasubclause', /*'iverbsubclause', 'mverbsubclause1', 'mverbsubclause2'*/], number: '*' },
        { type: ['complement'], number: '*' },
    ],
    'complement': [
        { type: ['preposition'], number: 1 },
        { type: ['nounphrase'], number: 1 }
    ],
    'copulasubclause': [
        { type: ['relpron'], number: 1 },
        { type: ['copula'], number: 1 },
        { type: ['nounphrase'], number: 1 }
    ],
    'copulasentence': [
        { type: ['nounphrase'], number: 1, role: 'subject' },
        { type: ['copula'], number: 1 },
        { type: ['negation'], number: '1|0' },
        { type: ['nounphrase'], number: 1, role: 'predicate' }
    ],
    'iverbsentence': [
        { type: ['nounphrase'], number: 1, role: 'subject' },
        { type: ['negation'], number: '1|0' },
        { type: ['iverb'], number: 1 },
        { type: ['complement'], number: '*' }
    ],
    'complexsentence1': [
        { type: ['subconj'], number: 1 },
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'condition' },
        { type: ['then'], number: '1|0' },
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'consequence' }
    ],
    'complexsentence2': [
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'consequence' },
        { type: ['subconj'], number: 1 },
        { type: ['copulasentence', 'mverbsentence', 'iverbsentence'], number: 1, role: 'condition' }
    ],
    'mverbsentence': [
        { type: ['nounphrase'], number: 1, role: 'subject' },
        { type: ['negation'], number: '1|0' },
        { type: ['mverb'], number: 1 },
        { type: ['complement'], number: '*' },
        { type: ['nounphrase'], number: 1, role: 'object' },
        { type: ['complement'], number: '*' },
    ],
    'lexemelist': [
        { type: ['adj', 'noun'], number: '*' }
    ]
};
const getSyntax = (name) => {
    var _a;
    return (_a = syntaxes[name]) !== null && _a !== void 0 ? _a : [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
};
exports.getSyntax = getSyntax;
const isAtom = (name) => {
    const lexemeTypes = ['adj', 'contraction', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'iverb', 'mverb', 'negation', 'nonsubconj', 'existquant', 'uniquant', 'then', 'relpron', 'negation', 'noun', 'preposition', 'subconj'];
    return lexemeTypes.includes(name);
};
exports.isAtom = isAtom;
const isNecessary = (m) => {
    return m.number === 1;
};
exports.isNecessary = isNecessary;


/***/ }),

/***/ "./app/src/enviro/Anaphora.ts":
/*!************************************!*\
  !*** ./app/src/enviro/Anaphora.ts ***!
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAnaphora = void 0;
const Actuator_1 = __webpack_require__(/*! ../actuator/Actuator */ "./app/src/actuator/Actuator.ts");
const Enviro_1 = __importDefault(__webpack_require__(/*! ./Enviro */ "./app/src/enviro/Enviro.ts"));
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
            yield (0, Actuator_1.getActuator)().takeAction(clause.copy({ exactIds: true }), this.enviro);
        });
    }
    query(clause) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.enviro.query(clause);
        });
    }
}


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
        this.lastReferenced = id;
    }
    query(clause) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const universe = Object
                .entries(this.dictionary)
                .map(x => ({ e: x[0], w: x[1] }));
            const query = clause // described entities
                .entities
                .map(e => ({ e, desc: clause.theme.describe(e) }));
            const getIt = () => this.lastReferenced ? [{ e: this.lastReferenced, w: this.dictionary[this.lastReferenced] }] : [];
            const res = query
                .flatMap(q => {
                const to = universe
                    .filter(u => q.desc.every(d => u.w.is(d)))
                    .concat(q.desc.includes('it') ? getIt() : []); //TODO: hardcoded bad
                //TODO: after "every ..." sentence, "it" should be undefined
                return { from: q.e, to: to };
            });
            const resSize = Math.max(...res.map(q => q.to.length));
            const fromToTo = (from) => res.filter(x => x.from === from)[0].to.map(x => x.e);
            const range = (n) => [...new Array(n).keys()];
            const res2 = range(resSize).map(i => clause
                .entities
                .filter(from => fromToTo(from).length > 0)
                .map(from => { var _a; return ({ [from]: (_a = fromToTo(from)[i]) !== null && _a !== void 0 ? _a : fromToTo(from)[0] }); })
                .reduce((a, b) => (Object.assign(Object.assign({}, a), b))));
            this.lastReferenced = (_a = res2.flatMap(x => Object.values(x)).at(-1)) !== null && _a !== void 0 ? _a : this.lastReferenced;
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
        if (props && props.length > 1) { // assume > 1 props are a path
            this.setNested(props, predicate);
        }
        else if (props && props.length === 1) { // single prop
            if (Object.keys(this.simpleConcepts).includes(props[0])) { // is concept 
                this.setNested(this.simpleConcepts[props[0]], predicate);
            }
            else { // ... not concept, just prop
                this.setNested(props, predicate);
            }
        }
        else if (!props || props.length === 0) { // no props
            const concepts = (0, getConcepts_1.getConcepts)(predicate);
            if (concepts.length === 0) {
                this.object[predicate] = true;
            }
            else {
                this.setNested(this.simpleConcepts[concepts[0]], predicate);
            }
        }
    }
    is(predicate, ...args) {
        const concept = (0, getConcepts_1.getConcepts)(predicate).at(0);
        return concept ?
            this.getNested(this.simpleConcepts[concept]) === predicate :
            this.object[predicate] !== undefined;
    }
    setAlias(conceptName, propPath) {
        this.simpleConcepts[conceptName] = propPath;
    }
    setNested(path, value) {
        if (path.length === 1) {
            this.object[path[0]] = value;
            return;
        }
        let x = this.object[path[0]];
        path.slice(1, -2).forEach(p => {
            x = x[p];
        });
        x[path.at(-1)] = value;
    }
    getNested(path) {
        let x = this.object[path[0]]; // assume at least one
        path.slice(1).forEach(p => {
            x = x[p];
        });
        return x;
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
    setAlias(conceptName, propPath) { }
    pointOut(opts) { }
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
const main_1 = __importDefault(__webpack_require__(/*! ./main/main */ "./app/src/main/main.ts"));
// import testNewXParser from "./tests/testNewXParser";
// import { toclausetests } from "./tests/toclausetests";
// import testNewXParser from "./tests/xnounphrase";
// import xparsertest from "./tests/xparsertest";
// await toclausetests()
// (async ()=>{
//     await autotester()
// })()
// testNewXParser()
(0, main_1.default)();


/***/ }),

/***/ "./app/src/lexer/EagerLexer.ts":
/*!*************************************!*\
  !*** ./app/src/lexer/EagerLexer.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Lexeme_1 = __webpack_require__(/*! ./Lexeme */ "./app/src/lexer/Lexeme.ts");
class EagerLexer {
    constructor(sourceCode, config) {
        this.sourceCode = sourceCode;
        this.config = config;
        this.tokens = sourceCode
            // .toLowerCase()
            .trim()
            .split(/\s+|\./)
            .map(s => !s ? '.' : s)
            .flatMap(s => (0, Lexeme_1.getLexemes)(s, config.lexemes));
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
    assert(type, args) {
        var _a, _b;
        const current = this.peek;
        if (current && current.type === type) {
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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLexemes = exports.formsOf = void 0;
function formsOf(lexeme) {
    var _a;
    return [lexeme.root].concat((_a = lexeme === null || lexeme === void 0 ? void 0 : lexeme.forms) !== null && _a !== void 0 ? _a : [])
        .concat(lexeme.regular ? [`${lexeme.root}s`] : []);
}
exports.formsOf = formsOf;
function getLexemes(word, lexemes) {
    var _a;
    const lexeme = (_a = lexemes.filter(x => formsOf(x).includes(word)).at(0)) !== null && _a !== void 0 ? _a : { root: word, type: 'noun' };
    const lexeme2 = Object.assign(Object.assign({}, lexeme), { token: word });
    return lexeme2.contractionFor ?
        lexeme2.contractionFor.flatMap(x => getLexemes(x, lexemes)) :
        [lexeme2];
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
function getLexer(sourceCode, config) {
    return new EagerLexer_1.default(sourceCode, config);
}
exports.getLexer = getLexer;


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

/***/ "./app/src/parser/KoolParser.ts":
/*!**************************************!*\
  !*** ./app/src/parser/KoolParser.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KoolParser = void 0;
const syntaxes_1 = __webpack_require__(/*! ../config/syntaxes */ "./app/src/config/syntaxes.ts");
const Lexer_1 = __webpack_require__(/*! ../lexer/Lexer */ "./app/src/lexer/Lexer.ts");
class KoolParser {
    constructor(sourceCode, config, lexer = (0, Lexer_1.getLexer)(sourceCode, config)) {
        this.sourceCode = sourceCode;
        this.config = config;
        this.lexer = lexer;
        this.topParse = (name, number, role) => {
            const members = this.config.getSyntax(name);
            if (members.length === 1 && members[0].type.every(t => (0, syntaxes_1.isAtom)(t))) {
                return this.parseAtom(members[0], number);
            }
            else {
                return this.parseComposite(name, number, role);
            }
        };
        this.parseAtom = (m, number) => {
            const atoms = [];
            while (!this.lexer.isEnd && m.type.includes(this.lexer.peek.type)) {
                if (number !== '*' && atoms.length >= 1) {
                    break;
                }
                const x = this.lexer.peek;
                this.lexer.next();
                atoms.push({ type: x.type, lexeme: x });
            }
            return number === '*' ? ({
                type: 'lexemelist',
                links: atoms //TODO!!!!
            }) : atoms[0];
        };
        this.parseComposite = (name, number, role) => {
            var _a;
            const links = {};
            for (const m of this.config.getSyntax(name)) {
                const ast = this.parseMember(m);
                if (!ast && (0, syntaxes_1.isNecessary)(m)) {
                    return undefined;
                }
                if (ast) {
                    links[(_a = m.role) !== null && _a !== void 0 ? _a : ast.type] = ast;
                }
            }
            return {
                type: name,
                role: role,
                links: links
            };
        };
        this.parseMember = (m, role) => {
            let x;
            for (const t of m.type) {
                x = this.topParse(t, m.number, m.role);
                if (x) {
                    break;
                }
            }
            return x;
        };
    }
    try(method, ...args) {
        const memento = this.lexer.pos;
        const x = method(args);
        if (!x) {
            this.lexer.backTo(memento);
        }
        return x;
    }
    parseAll() {
        const results = [];
        while (!this.lexer.isEnd) {
            results.push(this.parse());
            this.lexer.assert('fullstop', { errorOut: false });
        }
        return results;
    }
    parse() {
        var _a, _b, _c, _d, _e;
        return (_e = (_d = (_c = (_b = (_a = this.try(this.topParse, 'complexsentence1')) !== null && _a !== void 0 ? _a : this.try(this.topParse, 'complexsentence2')) !== null && _b !== void 0 ? _b : this.try(this.topParse, 'copulasentence')) !== null && _c !== void 0 ? _c : this.try(this.topParse, 'iverbsentence')) !== null && _d !== void 0 ? _d : this.try(this.topParse, 'mverbsentence')) !== null && _e !== void 0 ? _e : this.try(this.topParse, 'nounphrase');
    }
}
exports.KoolParser = KoolParser;


/***/ }),

/***/ "./app/src/parser/Parser.ts":
/*!**********************************!*\
  !*** ./app/src/parser/Parser.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getParser = void 0;
// import { LexemeType } from "../../ast/interfaces/LexemeType";
const KoolParser_1 = __webpack_require__(/*! ./KoolParser */ "./app/src/parser/KoolParser.ts");
function getParser(sourceCode, config) {
    return new KoolParser_1.KoolParser(sourceCode, config);
}
exports.getParser = getParser;


/***/ }),

/***/ "./app/src/parser/toClause.ts":
/*!************************************!*\
  !*** ./app/src/parser/toClause.ts ***!
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
exports.toClause = void 0;
// import { LexemeType } from "../../ast/interfaces/LexemeType";
const Clause_1 = __webpack_require__(/*! ../clauses/Clause */ "./app/src/clauses/Clause.ts");
const Id_1 = __webpack_require__(/*! ../clauses/Id */ "./app/src/clauses/Id.ts");
const Anaphora_1 = __webpack_require__(/*! ../enviro/Anaphora */ "./app/src/enviro/Anaphora.ts");
function toClause(ast, args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ast.type == 'nounphrase') {
            return nounPhraseToClause(ast, args);
        }
        else if (ast.type == 'copulasubclause') {
            return copulaSubClauseToClause(ast, args);
        }
        else if (ast.type == 'complement') {
            return complementToClause(ast, args);
        }
        else if (ast.type == 'copulasentence') {
            return copulaSentenceToClause(ast, args);
        }
        throw new Error(`Idk what to do with ${ast.type}!`);
    });
}
exports.toClause = toClause;
function copulaSentenceToClause(copulaSentence, args) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const subjectAst = copulaSentence.links.subject;
        const predicateAst = copulaSentence.links.predicate;
        const subjectId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)({ asVar: subjectAst.links.uniquant !== undefined });
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        const subject = yield toClause(subjectAst, newArgs);
        const predicate = (yield toClause(predicateAst, newArgs)).copy({ negate: !!copulaSentence.links.negation });
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
function copulaSubClauseToClause(copulaSubClause, args) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const predicate = copulaSubClause.links.predicate;
        return (yield toClause(predicate, Object.assign(Object.assign({}, args), { roles: { subject: (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject } })))
            .copy({ sideEffecty: false });
    });
}
function complementToClause(complement, args) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const subjId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (() => { throw new Error('undefined subject id'); })();
        const newId = (0, Id_1.getRandomId)();
        const preposition = complement.links.preposition;
        const nounPhrase = complement.links.nounphrase;
        return (0, Clause_1.clauseOf)(preposition.lexeme, subjId, newId)
            .and(yield toClause(nounPhrase, Object.assign(Object.assign({}, args), { roles: { subject: newId } })))
            .copy({ sideEffecty: false });
    });
}
function nounPhraseToClause(nounPhrase, args) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const maybeId = (_b = (_a = args === null || args === void 0 ? void 0 : args.roles) === null || _a === void 0 ? void 0 : _a.subject) !== null && _b !== void 0 ? _b : (0, Id_1.getRandomId)();
        const subjectId = nounPhrase.links.uniquant ? (0, Id_1.toVar)(maybeId) : maybeId;
        const newArgs = Object.assign(Object.assign({}, args), { roles: { subject: subjectId } });
        const adjectives = nounPhrase.links.lexemelist.links;
        const noun = nounPhrase.links.noun;
        const complements = [nounPhrase.links.complement]; //TODO: in parser MORE than one complement !!!!
        const subClause = nounPhrase.links.copulasubclause;
        const res = adjectives.map(a => a.lexeme)
            .concat((noun === null || noun === void 0 ? void 0 : noun.lexeme) ? [noun.lexeme] : [])
            .map(p => (0, Clause_1.clauseOf)(p, subjectId))
            .reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)())
            .and((yield Promise.all(complements.map(c => c ? toClause(c, newArgs) : (0, Clause_1.emptyClause)()))).reduce((c1, c2) => c1.and(c2), (0, Clause_1.emptyClause)()))
            .and(subClause ? yield toClause(subClause, newArgs) : (0, Clause_1.emptyClause)())
            .copy({ sideEffecty: false });
        return res;
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSx3SEFBMEM7QUFNMUMsU0FBZ0IsV0FBVztJQUN2QixPQUFPLElBQUksc0JBQVksRUFBRTtBQUM3QixDQUFDO0FBRkQsa0NBRUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNORCxNQUFxQixZQUFZO0lBRXZCLFVBQVUsQ0FBQyxNQUFjLEVBQUUsTUFBYzs7WUFFM0MsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzNDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7YUFDdEI7UUFFTCxDQUFDO0tBQUE7Q0FFSjtBQVZELGtDQVVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDWkQsaUZBQWdEO0FBR2hELHNHQUE4QjtBQUM5QixnR0FBMEI7QUFFMUIsTUFBcUIsV0FBVztJQUU1QixZQUFxQixNQUFtQixFQUFXLFFBQWdCO1FBQTlDLFdBQU0sR0FBTixNQUFNLENBQWE7UUFBVyxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBRW5FLENBQUM7SUFFSyxHQUFHLENBQUMsTUFBYzs7WUFFcEIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsNkJBQTZCO2dCQUM1RCxPQUFNO2FBQ1Q7WUFFRCxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUN0QixPQUFPLE1BQU0sSUFBSSxjQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7YUFDekY7WUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3hELE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7YUFDakM7aUJBQU07Z0JBQ0gsTUFBTSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQzthQUNwQztRQUVMLENBQUM7S0FBQTtJQUVTLFFBQVEsQ0FBQyxjQUFrQjtRQUNqQyxPQUFPLElBQUksQ0FBQyxRQUFRO2FBQ2YsaUJBQWlCLENBQUMsY0FBYyxDQUFDO2FBQ2pDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDUixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVlLFdBQVcsQ0FBQyxNQUFjOzs7WUFFdEMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbEMsTUFBTSxFQUFFLEdBQUcsZ0JBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRyxDQUFDLENBQUMsMENBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsbUNBQUksb0JBQVcsR0FBRTtZQUU1RCxJQUFJLENBQUMsT0FBTSxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFFO2dCQUN2QixNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQzthQUM1QjtZQUVELElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM3QyxJQUFJLGdCQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7YUFDekQ7aUJBQU07Z0JBQ0gsSUFBSSxjQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2FBQzNGOztLQUNKO0lBRWUsY0FBYyxDQUFDLE1BQWM7OztZQUV6Qyw2QkFBNkI7WUFDN0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9FLE1BQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEYsSUFBSSxhQUFhLEtBQUssU0FBUyxFQUFFO2dCQUM3QixPQUFNO2FBQ1Q7WUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFcEUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUM5QyxPQUFNO2FBQ1Q7WUFFRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDO1lBQ2xELE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbEMsTUFBTSxFQUFFLEdBQUcsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFHLENBQUMsQ0FBQywwQ0FBRyxhQUFhLENBQUMsRUFBQyxrQkFBa0I7WUFFeEQsT0FBTyxJQUFJLGNBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDOztLQUM1RjtDQUVKO0FBeEVELGlDQXdFQztBQUVELFNBQVMsZUFBZSxDQUFDLFNBQWlCO0lBQ3RDLE9BQU8sU0FBUyxLQUFLLFFBQVE7QUFDakMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25GRCw4RkFBeUM7QUFJekMsTUFBcUIsTUFBTTtJQUV2QixZQUFxQixFQUFNLEVBQVcsU0FBaUIsRUFBRSxHQUFHLElBQVc7UUFBbEQsT0FBRSxHQUFGLEVBQUUsQ0FBSTtRQUFXLGNBQVMsR0FBVCxTQUFTLENBQVE7SUFFdkQsQ0FBQztJQUVLLEdBQUcsQ0FBQyxNQUFjOzs7WUFFcEIsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLHFDQUFxQztnQkFDL0QsT0FBTTthQUNUO1lBRUQsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUUzQixNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2hELENBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFO2dCQUNuQixDQUFDLENBQUMsV0FBVyxHQUFHLFNBQVM7Z0JBQ3pCLE1BQU0sTUFBTSxHQUFHLGtCQUFJLEVBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7Z0JBQzNCLFlBQU0sQ0FBQyxJQUFJLDBDQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLDhCQUE4QjthQUVqQzs7S0FFSjtDQUVKO0FBM0JELDRCQTJCQztBQUVELFNBQVMsU0FBUyxDQUFDLFNBQWlCO0lBRWhDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO0FBRXpDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQ0QsTUFBcUIsSUFBSTtJQUVyQixZQUFxQixFQUFNLEVBQVcsU0FBaUIsRUFBVyxLQUFnQjtRQUE3RCxPQUFFLEdBQUYsRUFBRSxDQUFJO1FBQVcsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUFXLFVBQUssR0FBTCxLQUFLLENBQVc7SUFFbEYsQ0FBQztJQUVLLEdBQUcsQ0FBQyxNQUFjOzs7WUFDcEIsTUFBTSxHQUFHLEdBQUcsWUFBTSxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsbUNBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ3ZFLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDOztLQUN0QztDQUdKO0FBWkQsMEJBWUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNmRCw2RkFBcUQ7QUFFckQsOEZBQXlDO0FBRXpDLGdHQUEwQjtBQUUxQixNQUFxQixXQUFXO0lBRTVCLFlBQXFCLFNBQWlCLEVBQVcsVUFBa0I7UUFBOUMsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUFXLGVBQVUsR0FBVixVQUFVLENBQVE7SUFFbkUsQ0FBQztJQUVLLEdBQUcsQ0FBQyxNQUFjOztZQUVwQixrR0FBa0c7WUFFbEcsTUFBTSxjQUFjLEdBQUksaUVBQWlFO2FBQ3JGLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNO21CQUMzRSxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTTtZQUV2RixJQUFJLGNBQWMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLFlBQVksRUFBRTthQUN0QjtpQkFBTTtnQkFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQzthQUNyQjtRQUdMLENBQUM7S0FBQTtJQUVELFlBQVk7UUFFUixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFDLDJDQUEyQztRQUNwRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDNUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLDJCQUEyQjtRQUM3RixNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxXQUFXO1FBQzdFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLGNBQWM7UUFDaEUsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxrQkFBSSxFQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDO1FBQ2hELDZFQUE2RTtJQUNqRixDQUFDO0lBRUssS0FBSyxDQUFDLE1BQWM7O1lBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLGNBQWM7WUFDaEUsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELE1BQU0sQ0FBQyxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQyxxQkFBUSxFQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDOUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QixHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxjQUFJLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxRCxDQUFDO0tBQUE7Q0FFSjtBQTdDRCxpQ0E2Q0M7QUFHRCxNQUFNLFFBQVEsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFLENBQ2xDLENBQUM7SUFDRyxRQUFRLEVBQUUsaUJBQWlCLENBQUMsU0FBUztDQUN4QyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMURSLDJGQUE2QztBQUU3Qyw0R0FBeUM7QUFDekMscUdBQW1EO0FBQ25ELGlHQUE4QztBQUk5QyxNQUFxQixVQUFVO0lBRTNCLFlBQXFCLE1BQWMsRUFBVyxTQUFTLG9CQUFTLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQVcsV0FBVywwQkFBVyxHQUFFO1FBQXZHLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVyxXQUFNLEdBQU4sTUFBTSxDQUFxQztRQUFXLGFBQVEsR0FBUixRQUFRLENBQWdCO0lBRTVILENBQUM7SUFFSyxJQUFJOztZQUNOLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUU7Z0JBQ3pDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDeEI7UUFDTCxDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsT0FBZTs7WUFFekIsTUFBTSxPQUFPLEdBQVUsRUFBRTtZQUV6QixLQUFLLE1BQU0sR0FBRyxJQUFJLHNCQUFTLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtnQkFFMUQsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDTixTQUFRO2lCQUNYO2dCQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sdUJBQVEsRUFBQyxHQUFHLENBQUM7Z0JBRWxDLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRTtvQkFFdEIsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFFdEQ7cUJBQU07b0JBRUgsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7b0JBQzVDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMvQyxNQUFNLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRXJFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDOUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBRCxDQUFDLHVCQUFELENBQUMsQ0FBRSxRQUFRLEVBQUUsQ0FBQztvQkFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBRCxDQUFDLHVCQUFELENBQUMsQ0FBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUU1RDthQUVKO1lBRUQsT0FBTyxPQUFPO1FBQ2xCLENBQUM7S0FBQTtDQUVKO0FBN0NELGdDQTZDQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyREQsMkZBQTRDO0FBQzVDLCtHQUFxQztBQVNyQyxTQUFzQixRQUFRLENBQUMsTUFBTSxHQUFHLHNCQUFTLEdBQUU7O1FBRS9DLE1BQU0sQ0FBQyxHQUFHLElBQUksb0JBQVUsQ0FBQyxNQUFNLENBQUM7UUFDaEMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFO1FBQ2QsT0FBTyxDQUFDO0lBQ1osQ0FBQztDQUFBO0FBTEQsNEJBS0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkRCxvRkFBa0U7QUFDbEUscUhBQXdEO0FBQ3hELGdHQUEwQztBQUUxQyxrR0FBNEI7QUFDNUIsMEZBQXNDO0FBRXRDLE1BQXFCLEdBQUc7SUFFcEIsWUFBcUIsT0FBZSxFQUN2QixPQUFlLEVBQ2YsY0FBdUIsRUFDdkIsVUFBVSxLQUFLLEVBQ2YsV0FBVyxLQUFLLEVBQ2hCLGdCQUFnQixLQUFLLEVBQ3JCLFVBQVUsS0FBSyxFQUNmLFdBQVcsMkJBQVUsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBUHhDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDdkIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLG1CQUFjLEdBQWQsY0FBYyxDQUFTO1FBQ3ZCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLGtCQUFhLEdBQWIsYUFBYSxDQUFRO1FBQ3JCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixhQUFRLEdBQVIsUUFBUSxDQUF3QztJQUU3RCxDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQWEsRUFBRSxJQUFjOztRQUM3QixPQUFPLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE9BQU8sbUNBQUksS0FBSyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxJQUFJLENBQUMsSUFBZTs7UUFFaEIsT0FBTyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQ3ZCLElBQUksQ0FBQyxjQUFjLEVBQ25CLEtBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFDM0MsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFFBQVEsbUNBQUksSUFBSSxDQUFDLFFBQVEsRUFDL0IsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFdBQVcsbUNBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUVoRCxDQUFDO0lBRUQsUUFBUTtRQUVKLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzFCLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUVoRSxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBRVIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUNiLElBQUksR0FBRyxDQUNILElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUN0RCxDQUNKO0lBRUwsQ0FBQztJQUVELE9BQU8sQ0FBQyxVQUFrQjtRQUN0QixPQUFPLElBQUksZUFBSyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUM7SUFDdEMsQ0FBQztJQUVELEtBQUssQ0FBQyxFQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELFFBQVE7UUFDSixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtRQUNuRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7SUFDN0MsQ0FBQztJQUVELE9BQU8sQ0FBQyxFQUFNO1FBQ1YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVELFFBQVEsQ0FBQyxFQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELFFBQVEsQ0FBQyxFQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLHVCQUFRLEVBQUMsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxNQUFVO1FBQ3hCLE9BQU8seUNBQWlCLEVBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztJQUMxQyxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJO0lBQ3BELENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLHdCQUFXLEdBQUU7SUFDN0QsQ0FBQztJQUVLLFFBQVEsQ0FBQyxRQUFnQjs7WUFDM0IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRyxDQUFDO0tBQUE7Q0FFSjtBQTFGRCx5QkEwRkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEdELG9GQUFrRTtBQUNsRSxnR0FBMEM7QUFFMUMsa0dBQTRCO0FBQzVCLDRGQUF3QjtBQUV4QiwwRkFBc0M7QUFDdEMscUhBQXdEO0FBQ3hELCtIQUFrRDtBQUlsRCxNQUFhLFdBQVc7SUFFcEIsWUFBcUIsU0FBNkIsRUFDckMsSUFBVSxFQUNWLFVBQVUsS0FBSyxFQUNmLFdBQVcsS0FBSyxFQUNoQixnQkFBZ0IsS0FBSyxFQUNyQixVQUFVLEtBQUssRUFDZixXQUFXLDJCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUNoRCxRQUFRLHdCQUFXLEdBQUU7UUFQYixjQUFTLEdBQVQsU0FBUyxDQUFvQjtRQUNyQyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1YsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsa0JBQWEsR0FBYixhQUFhLENBQVE7UUFDckIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGFBQVEsR0FBUixRQUFRLENBQXdDO1FBQ2hELFVBQUssR0FBTCxLQUFLLENBQWdCO0lBRWxDLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWM7O1FBQzdCLE9BQU8sSUFBSSxhQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxLQUFLLENBQUM7SUFDdkQsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFlOztRQUNoQixPQUFPLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQUMsWUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsVUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsbUNBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUMsRUFDckQsS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUMzQyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsUUFBUSxtQ0FBSSxJQUFJLENBQUMsUUFBUSxFQUMvQixVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsV0FBVyxtQ0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQ2hELENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLElBQUksQ0FBQztJQUNqQixDQUFDO0lBRUQsT0FBTyxDQUFDLFVBQWtCO1FBQ3RCLE9BQU8sSUFBSSxlQUFLLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztJQUN0QyxDQUFDO0lBRUQsS0FBSyxDQUFDLEVBQU07UUFDUixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLHdCQUFXLEdBQUU7SUFDNUQsQ0FBQztJQUVELE9BQU8sQ0FBQyxFQUFNO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ3BGLENBQUM7SUFFRCxRQUFRLENBQUMsRUFBTTtRQUNYLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUNwRixDQUFDO0lBRUQsUUFBUTtRQUNKLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksR0FBRztRQUNsRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUc7SUFDN0MsQ0FBQztJQUVELFFBQVEsQ0FBQyxFQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUM1RixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sdUJBQVEsRUFBQyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVELGlCQUFpQixDQUFDLE1BQVU7UUFDeEIsT0FBTyx5Q0FBaUIsRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0lBQzFDLENBQUM7SUFFSyxRQUFRLENBQUMsUUFBZ0I7O1lBQzNCLE9BQU8sQ0FBQyxJQUFJLHFCQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLENBQUM7S0FBQTtJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSTtJQUNmLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Q0FFSjtBQTFFRCxrQ0EwRUM7Ozs7Ozs7Ozs7Ozs7O0FDdEZELG1HQUEyQztBQUczQyxtR0FBMkM7QUE4QjNDLFNBQWdCLFFBQVEsQ0FBQyxTQUE2QixFQUFFLEdBQUcsSUFBVTtJQUNqRSxPQUFPLElBQUkseUJBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO0FBQzNDLENBQUM7QUFGRCw0QkFFQztBQUVNLE1BQU0sV0FBVyxHQUFHLEdBQVcsRUFBRSxDQUFDLElBQUkseUJBQVcsRUFBRTtBQUE3QyxtQkFBVyxlQUFrQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQzFELE1BQWEsV0FBVztJQUVwQixZQUFxQixVQUFVLEtBQUssRUFDdkIsVUFBVSxLQUFLLEVBQ2YsV0FBVyxRQUFRLEVBQ25CLFdBQVcsRUFBRSxFQUNiLGdCQUFnQixLQUFLLEVBQ3JCLFdBQVcsS0FBSztRQUxSLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDdkIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQUNiLGtCQUFhLEdBQWIsYUFBYSxDQUFRO1FBQ3JCLGFBQVEsR0FBUixRQUFRLENBQVE7SUFFN0IsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFlO1FBQ2hCLE9BQU8sSUFBSTtJQUNmLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTCxPQUFPLElBQUk7SUFDZixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsT0FBTyxJQUFJO0lBQ2YsQ0FBQztJQUVELEdBQUcsQ0FBQyxLQUFhLEVBQUUsSUFBYztRQUM3QixPQUFPLEtBQUs7SUFDaEIsQ0FBQztJQUVELE9BQU8sQ0FBQyxVQUFrQjtRQUN0QixPQUFPLFVBQVU7SUFDckIsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLEVBQUU7SUFDYixDQUFDO0lBRUQsS0FBSyxDQUFDLEVBQU07UUFDUixPQUFPLElBQUk7SUFDZixDQUFDO0lBRUQsT0FBTyxDQUFDLEVBQU07UUFDVixPQUFPLEVBQUU7SUFDYixDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQU07UUFDWCxPQUFPLEVBQUU7SUFDYixDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQU07UUFDWCxPQUFPLEVBQUU7SUFDYixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sRUFBRTtJQUNiLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxNQUFVO1FBQ3hCLE9BQU8sRUFBRTtJQUNiLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxFQUFFO0lBQ2IsQ0FBQztJQUVLLFFBQVEsQ0FBQyxRQUFnQjs7WUFDM0IsOENBQThDO1lBQzlDLE9BQU8sRUFBRTtRQUNiLENBQUM7S0FBQTtDQUVKO0FBbkVELGtDQW1FQzs7Ozs7Ozs7Ozs7Ozs7QUM1REQsUUFBUSxDQUFDLENBQUMsY0FBYztJQUNwQixJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ1QsT0FBTyxJQUFJLEVBQUU7UUFDVCxDQUFDLEVBQUU7UUFDSCxNQUFNLENBQUM7S0FDVjtBQUNMLENBQUM7QUFFRCxNQUFNLFdBQVcsR0FBRyxjQUFjLEVBQUU7QUFFcEMsU0FBZ0IsV0FBVyxDQUFDLElBQXNCO0lBRTlDLDJEQUEyRDtJQUUzRCxNQUFNLEtBQUssR0FBRyxLQUFLLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUU7SUFFN0MsT0FBTyxLQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUs7QUFDN0MsQ0FBQztBQVBELGtDQU9DO0FBTUQsU0FBZ0IsS0FBSyxDQUFDLEVBQU07SUFDeEIsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRTtBQUMxRSxDQUFDO0FBRkQsc0JBRUM7QUFFRCxTQUFnQixLQUFLLENBQUMsQ0FBSztJQUN2QixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3pGLENBQUM7QUFGRCxzQkFFQztBQUVELFNBQWdCLE9BQU8sQ0FBQyxFQUFNO0lBQzFCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUU7QUFDMUUsQ0FBQztBQUZELDBCQUVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUNELG9GQUFrRTtBQUNsRSxnR0FBMEM7QUFFMUMsNEZBQXdCO0FBRXhCLDBGQUFzQztBQUN0QyxxSEFBd0Q7QUFDeEQsK0hBQWtEO0FBRWxELE1BQXFCLEtBQUs7SUFFdEIsWUFBcUIsU0FBaUIsRUFDekIsVUFBa0IsRUFDbEIsVUFBVSxLQUFLLEVBQ2YsV0FBVyxLQUFLLEVBQ2hCLGdCQUFnQixLQUFLLEVBQ3JCLFVBQVUsSUFBSSxFQUNkLFdBQVcsMkJBQVUsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQ2hELFFBQVEsU0FBUyxDQUFDLEtBQUs7UUFQZixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ3pCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsa0JBQWEsR0FBYixhQUFhLENBQVE7UUFDckIsWUFBTyxHQUFQLE9BQU8sQ0FBTztRQUNkLGFBQVEsR0FBUixRQUFRLENBQXdDO1FBQ2hELFVBQUssR0FBTCxLQUFLLENBQWtCO0lBRXBDLENBQUM7SUFFRCxHQUFHLENBQUMsS0FBYSxFQUFFLElBQWM7O1FBQzdCLE9BQU8sSUFBSSxhQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxLQUFLLENBQUM7SUFDdkQsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFlOztRQUVoQixPQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUN0QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDMUIsS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUMzQyxVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsUUFBUSxtQ0FBSSxJQUFJLENBQUMsUUFBUSxFQUMvQixVQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsV0FBVyxtQ0FBSSxJQUFJLENBQUMsYUFBYSxDQUFDO0lBRWhELENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLElBQUksQ0FBQztJQUNqQixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7SUFDbkUsQ0FBQztJQUVELElBQUksS0FBSztRQUNMLE9BQU8sSUFBSSxFQUFDLHVCQUF1QjtJQUN2QyxDQUFDO0lBRUQsT0FBTyxDQUFDLFVBQWtCO1FBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUM7SUFDdkMsQ0FBQztJQUVELEtBQUssQ0FBQyxFQUFNO1FBQ1IsT0FBTyx3QkFBVyxHQUFFLEVBQUMsZUFBZTtJQUN4QyxDQUFDO0lBRUQsUUFBUTtRQUNKLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQzdFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRztJQUM3QyxDQUFDO0lBRUQsT0FBTyxDQUFDLEVBQU07UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQU07UUFDWCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQU07UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sdUJBQVEsRUFBQyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVELGlCQUFpQixDQUFDLE1BQVU7UUFDeEIsT0FBTyx5Q0FBaUIsRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0lBQzFDLENBQUM7SUFFSyxRQUFRLENBQUMsUUFBZ0I7O1lBQzNCLE9BQU8sQ0FBQyxJQUFJLHFCQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0QsQ0FBQztLQUFBO0NBRUo7QUE1RUQsMkJBNEVDOzs7Ozs7Ozs7Ozs7OztBQ2xGRCxTQUFnQixpQkFBaUIsQ0FBQyxNQUFjLEVBQUUsTUFBVTtJQUV4RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUU1QyxPQUFPLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ1YsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXBFLENBQUM7QUFSRCw4Q0FRQzs7Ozs7Ozs7Ozs7Ozs7QUNWRCxTQUFnQixVQUFVLENBQUMsTUFBYztJQUNyQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUNsRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNyQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQywyQkFBMkI7SUFDL0MsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBTEQsZ0NBS0M7Ozs7Ozs7Ozs7Ozs7O0FDSkQsU0FBZ0IsUUFBUSxDQUFDLE1BQWM7SUFDbkMsT0FBTyxNQUFNO1NBQ1IsUUFBUTtTQUNSLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzdDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztTQUNsQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLENBQUM7QUFORCw0QkFNQzs7Ozs7Ozs7Ozs7Ozs7QUNMRCxzRkFBbUM7QUFDbkMseUZBQXNDO0FBQ3RDLDhHQUFtRDtBQVFuRCxTQUFnQixTQUFTO0lBQ3JCLE9BQU87UUFDSCxPQUFPLEVBQVAsaUJBQU87UUFDUCxTQUFTLEVBQVQsb0JBQVM7UUFDVCxlQUFlLEVBQWYsaUNBQWU7S0FDbEI7QUFDTCxDQUFDO0FBTkQsOEJBTUM7Ozs7Ozs7Ozs7Ozs7O0FDaEJZLGVBQU8sR0FBeUI7SUFDekM7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQztRQUN0QixPQUFPLEVBQUUsS0FBSztLQUNqQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLFFBQVE7UUFDZCxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxJQUFJO0tBQ2hCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsT0FBTztRQUNiLElBQUksRUFBRSxPQUFPO1FBQ2IsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDO1FBQ2hCLE9BQU8sRUFBRSxJQUFJO0tBQ2hCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsU0FBUztRQUNmLElBQUksRUFBRSxLQUFLO1FBQ1gsV0FBVyxFQUFFLE9BQU87S0FDdkI7SUFFRDtRQUNJLElBQUksRUFBRSxTQUFTO1FBQ2YsSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUUsU0FBUztLQUN0QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLEtBQUs7UUFDWCxJQUFJLEVBQUUsTUFBTTtLQUNmO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxRQUFRO1FBQ2QsS0FBSyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztRQUNwQixPQUFPLEVBQUUsS0FBSztLQUNqQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsYUFBYTtRQUNuQixjQUFjLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO0tBQ2hDO0lBRUQ7UUFDSSxJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxLQUFLO0tBQ2Q7SUFFRDtRQUNJLElBQUksRUFBRSxPQUFPO1FBQ2IsSUFBSSxFQUFFLEtBQUs7S0FDZDtJQUVEO1FBQ0ksSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxJQUFJO0tBQ2hCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFLEtBQUs7UUFDZCxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO0tBQ3hCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxZQUFZO0tBQ3JCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsT0FBTztRQUNiLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBRUQ7UUFDSSxJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBRUQ7UUFDSSxJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxVQUFVO0tBQ25CO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxhQUFhO0tBQ3RCO0lBRUQ7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLElBQUksRUFBRSxNQUFNLENBQUMsY0FBYztLQUM5QjtJQUVEO1FBQ0ksSUFBSSxFQUFFLElBQUk7UUFDVixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLFNBQVM7UUFDZixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsU0FBUztLQUNsQjtJQUVEO1FBQ0ksSUFB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QUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2FjdHVhdG9yL0FjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvQmFzZUFjdHVhdG9yLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvQmFzaWNBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9DcmVhdGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9hY3R1YXRvci9FZGl0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYWN0dWF0b3IvSW1wbHlBY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9icmFpbi9CYXNpY0JyYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYnJhaW4vQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0FuZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvQmFzaWNDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY2xhdXNlcy9JbXBseS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NsYXVzZXMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL2hhc2hTdHJpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jbGF1c2VzL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0NvbmZpZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N0YXJ0dXBDb21tYW5kcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9zeW50YXhlcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9BbmFwaG9yYS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9CYXNlRW52aXJvLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZW52aXJvL0NvbmNyZXRlV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9FbnZpcm8udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vUGxhY2Vob2xkZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9lbnZpcm8vV3JhcHBlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Vudmlyby9nZXRDb25jZXB0cy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2luZGV4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbGV4ZXIvRWFnZXJMZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL0xleGVtZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2xleGVyL0xleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWFpbi9tYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL0tvb2xQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9wYXJzZXIvUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvcGFyc2VyL3RvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEJhc2VBY3R1YXRvciBmcm9tIFwiLi9CYXNlQWN0dWF0b3JcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBY3R1YXRvciB7XG4gICAgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPHZvaWQ+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBY3R1YXRvcigpOiBBY3R1YXRvciB7XG4gICAgcmV0dXJuIG5ldyBCYXNlQWN0dWF0b3IoKVxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCB7IEFjdHVhdG9yIH0gZnJvbSBcIi4vQWN0dWF0b3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUFjdHVhdG9yIGltcGxlbWVudHMgQWN0dWF0b3Ige1xuXG4gICAgYXN5bmMgdGFrZUFjdGlvbihjbGF1c2U6IENsYXVzZSwgZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgICAgICBmb3IgKGNvbnN0IGEgb2YgYXdhaXQgY2xhdXNlLnRvQWN0aW9uKGNsYXVzZSkpIHtcbiAgICAgICAgICAgIGF3YWl0IGEucnVuKGVudmlybylcbiAgICAgICAgfVxuXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQmFzaWNDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9CYXNpY0NsYXVzZVwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBnZXRSYW5kb21JZCwgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgQ3JlYXRlIGZyb20gXCIuL0NyZWF0ZVwiO1xuaW1wb3J0IEVkaXQgZnJvbSBcIi4vRWRpdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0FjdGlvbiBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBjbGF1c2U6IEJhc2ljQ2xhdXNlLCByZWFkb25seSB0b3BMZXZlbDogQ2xhdXNlKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBydW4oZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPGFueT4ge1xuXG4gICAgICAgIGlmICh0aGlzLmNsYXVzZS5hcmdzLmxlbmd0aCA+IDEpIHsgLy8gbm90IGhhbmRsaW5nIHJlbGF0aW9ucyB5ZXRcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY2xhdXNlLmV4YWN0SWRzKSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbmV3IEVkaXQodGhpcy5jbGF1c2UuYXJnc1swXSwgdGhpcy5jbGF1c2UucHJlZGljYXRlLnJvb3QsIFtdKS5ydW4oZW52aXJvKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudG9wTGV2ZWwudG9wTGV2ZWwoKS5pbmNsdWRlcyh0aGlzLmNsYXVzZS5hcmdzWzBdKSkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5mb3JUb3BMZXZlbChlbnZpcm8pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmZvck5vblRvcExldmVsKGVudmlybylcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGdldFByb3BzKHRvcExldmVsRW50aXR5OiBJZCkge1xuICAgICAgICByZXR1cm4gdGhpcy50b3BMZXZlbFxuICAgICAgICAgICAgLmdldE93bmVyc2hpcENoYWluKHRvcExldmVsRW50aXR5KVxuICAgICAgICAgICAgLnNsaWNlKDEpXG4gICAgICAgICAgICAubWFwKGUgPT4gdGhpcy50b3BMZXZlbC50aGVtZS5kZXNjcmliZShlKVswXSlcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYXN5bmMgZm9yVG9wTGV2ZWwoZW52aXJvOiBFbnZpcm8pIHtcblxuICAgICAgICBjb25zdCBxID0gdGhpcy50b3BMZXZlbC50aGVtZS5hYm91dCh0aGlzLmNsYXVzZS5hcmdzWzBdKVxuICAgICAgICBjb25zdCBtYXBzID0gYXdhaXQgZW52aXJvLnF1ZXJ5KHEpXG4gICAgICAgIGNvbnN0IGlkID0gbWFwcz8uWzBdPy5bdGhpcy5jbGF1c2UuYXJnc1swXV0gPz8gZ2V0UmFuZG9tSWQoKVxuXG4gICAgICAgIGlmICghYXdhaXQgZW52aXJvLmdldChpZCkpIHtcbiAgICAgICAgICAgIGVudmlyby5zZXRQbGFjZWhvbGRlcihpZClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0NyZWF0b3JBY3Rpb24odGhpcy5jbGF1c2UucHJlZGljYXRlLnJvb3QpKSB7XG4gICAgICAgICAgICBuZXcgQ3JlYXRlKGlkLCB0aGlzLmNsYXVzZS5wcmVkaWNhdGUucm9vdCkucnVuKGVudmlybylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5ldyBFZGl0KGlkLCB0aGlzLmNsYXVzZS5wcmVkaWNhdGUucm9vdCwgdGhpcy5nZXRQcm9wcyh0aGlzLmNsYXVzZS5hcmdzWzBdKSkucnVuKGVudmlybylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBhc3luYyBmb3JOb25Ub3BMZXZlbChlbnZpcm86IEVudmlybykge1xuXG4gICAgICAgIC8vIGFzc3VtaW5nIG1heCB4LnkueiBuZXN0aW5nXG4gICAgICAgIGNvbnN0IG93bmVycyA9IHRoaXMudG9wTGV2ZWwub3duZXJzT2YodGhpcy5jbGF1c2UuYXJnc1swXSlcbiAgICAgICAgY29uc3QgaGFzVG9wTGV2ZWwgPSBvd25lcnMuZmlsdGVyKHggPT4gdGhpcy50b3BMZXZlbC50b3BMZXZlbCgpLmluY2x1ZGVzKHgpKVswXVxuICAgICAgICBjb25zdCB0b3BMZXZlbE93bmVyID0gaGFzVG9wTGV2ZWwgPyBoYXNUb3BMZXZlbCA6IHRoaXMudG9wTGV2ZWwub3duZXJzT2Yob3duZXJzWzBdKVswXVxuXG4gICAgICAgIGlmICh0b3BMZXZlbE93bmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmFtZU9mVGhpcyA9IHRoaXMudG9wTGV2ZWwudGhlbWUuZGVzY3JpYmUodGhpcy5jbGF1c2UuYXJnc1swXSlcblxuICAgICAgICBpZiAodGhpcy5jbGF1c2UucHJlZGljYXRlLnJvb3QgPT09IG5hbWVPZlRoaXNbMF0pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcSA9IHRoaXMudG9wTGV2ZWwudGhlbWUuYWJvdXQodG9wTGV2ZWxPd25lcilcbiAgICAgICAgY29uc3QgbWFwcyA9IGF3YWl0IGVudmlyby5xdWVyeShxKVxuICAgICAgICBjb25zdCBpZCA9IG1hcHM/LlswXT8uW3RvcExldmVsT3duZXJdIC8vPz8gZ2V0UmFuZG9tSWQoKVxuXG4gICAgICAgIHJldHVybiBuZXcgRWRpdChpZCwgdGhpcy5jbGF1c2UucHJlZGljYXRlLnJvb3QsIHRoaXMuZ2V0UHJvcHModG9wTGV2ZWxPd25lcikpLnJ1bihlbnZpcm8pXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIGlzQ3JlYXRvckFjdGlvbihwcmVkaWNhdGU6IHN0cmluZykge1xuICAgIHJldHVybiBwcmVkaWNhdGUgPT09ICdidXR0b24nXG59IiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgd3JhcCB9IGZyb20gXCIuLi9lbnZpcm8vV3JhcHBlclwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENyZWF0ZSBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBpZDogSWQsIHJlYWRvbmx5IHByZWRpY2F0ZTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgcnVuKGVudmlybzogRW52aXJvKTogUHJvbWlzZTxhbnk+IHtcblxuICAgICAgICBpZiAoZW52aXJvLmV4aXN0cyh0aGlzLmlkKSkgeyAvLyAgZXhpc3RlbmNlIGNoZWNrIHByaW9yIHRvIGNyZWF0aW5nXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0RvbUVsZW0odGhpcy5wcmVkaWNhdGUpKSB7XG5cbiAgICAgICAgICAgIGNvbnN0IG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMucHJlZGljYXRlKVxuICAgICAgICAgICAgby5pZCA9IHRoaXMuaWQgKyAnJ1xuICAgICAgICAgICAgby50ZXh0Q29udGVudCA9ICdkZWZhdWx0J1xuICAgICAgICAgICAgY29uc3QgbmV3T2JqID0gd3JhcChvKVxuICAgICAgICAgICAgbmV3T2JqLnNldCh0aGlzLnByZWRpY2F0ZSlcbiAgICAgICAgICAgIGVudmlyby5zZXQodGhpcy5pZCwgbmV3T2JqKVxuICAgICAgICAgICAgZW52aXJvLnJvb3Q/LmFwcGVuZENoaWxkKG8pXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnQ3JlYXRlIHJ1bnMhJylcblxuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuZnVuY3Rpb24gaXNEb21FbGVtKHByZWRpY2F0ZTogc3RyaW5nKSB7XG5cbiAgICByZXR1cm4gWydidXR0b24nXS5pbmNsdWRlcyhwcmVkaWNhdGUpXG5cbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgeyBFbnZpcm8gfSBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWRpdCBpbXBsZW1lbnRzIEFjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBpZDogSWQsIHJlYWRvbmx5IHByZWRpY2F0ZTogc3RyaW5nLCByZWFkb25seSBwcm9wcz86IHN0cmluZ1tdKSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBydW4oZW52aXJvOiBFbnZpcm8pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBvYmogPSBhd2FpdCBlbnZpcm8uZ2V0KHRoaXMuaWQpID8/IGVudmlyby5zZXRQbGFjZWhvbGRlcih0aGlzLmlkKVxuICAgICAgICBvYmouc2V0KHRoaXMucHJlZGljYXRlLCB0aGlzLnByb3BzKVxuICAgIH1cblxuXG59IiwiaW1wb3J0IHsgQmFzaWNDbGF1c2UgfSBmcm9tIFwiLi4vY2xhdXNlcy9CYXNpY0NsYXVzZVwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgRW52aXJvIH0gZnJvbSBcIi4uL2Vudmlyby9FbnZpcm9cIjtcbmltcG9ydCB7IHdyYXAgfSBmcm9tIFwiLi4vZW52aXJvL1dyYXBwZXJcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5pbXBvcnQgRWRpdCBmcm9tIFwiLi9FZGl0XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcGx5QWN0aW9uIGltcGxlbWVudHMgQWN0aW9uIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmRpdGlvbjogQ2xhdXNlLCByZWFkb25seSBjb25jbHVzaW9uOiBDbGF1c2UpIHtcblxuICAgIH1cblxuICAgIGFzeW5jIHJ1bihlbnZpcm86IEVudmlybyk6IFByb21pc2U8YW55PiB7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0ltcGx5QWN0aW9uLnJ1bigpJywgdGhpcy5jb25kaXRpb24udG9TdHJpbmcoKSwgJy0tLT4nLCB0aGlzLmNvbmNsdXNpb24udG9TdHJpbmcoKSlcblxuICAgICAgICBjb25zdCBpc1NldEFsaWFzQ2FsbCA9ICAvLyBhc3N1bWUgaWYgYXQgbGVhc3Qgb25lIG93bmVkIGVudGl0eSB0aGF0IGl0J3MgYSBzZXQgYWxpYXMgY2FsbFxuICAgICAgICAgICAgdGhpcy5jb25kaXRpb24uZ2V0T3duZXJzaGlwQ2hhaW4odGhpcy5jb25kaXRpb24udG9wTGV2ZWwoKVswXSkuc2xpY2UoMSkubGVuZ3RoXG4gICAgICAgICAgICB8fCB0aGlzLmNvbmNsdXNpb24uZ2V0T3duZXJzaGlwQ2hhaW4odGhpcy5jb25jbHVzaW9uLnRvcExldmVsKClbMF0pLnNsaWNlKDEpLmxlbmd0aFxuXG4gICAgICAgIGlmIChpc1NldEFsaWFzQ2FsbCkge1xuICAgICAgICAgICAgdGhpcy5zZXRBbGlhc0NhbGwoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vdGhlcihlbnZpcm8pXG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgc2V0QWxpYXNDYWxsKCkge1xuXG4gICAgICAgIGNvbnN0IHRvcCA9IHRoaXMuY29uZGl0aW9uLnRvcExldmVsKClbMF0gLy9UT0RPICghQVNTVU1FISkgc2FtZSBhcyB0b3AgaW4gY29uY2x1c2lvblxuICAgICAgICBjb25zdCBhbGlhcyA9IHRoaXMuY29uZGl0aW9uLmdldE93bmVyc2hpcENoYWluKHRvcCkuc2xpY2UoMSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLmNvbmNsdXNpb24uZ2V0T3duZXJzaGlwQ2hhaW4odG9wKS5zbGljZSgxKVxuICAgICAgICBjb25zdCBjb25jZXB0TmFtZSA9IGFsaWFzLm1hcCh4ID0+IHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKHgpWzBdKSAvLyBhc3N1bWUgYXQgbGVhc3Qgb25lIG5hbWVcbiAgICAgICAgY29uc3QgcHJvcHNOYW1lcyA9IHByb3BzLm1hcCh4ID0+IHRoaXMuY29uY2x1c2lvbi5kZXNjcmliZSh4KVswXSkgLy8gc2FtZSAuLi5cbiAgICAgICAgY29uc3QgcHJvdG9OYW1lID0gdGhpcy5jb25kaXRpb24uZGVzY3JpYmUodG9wKVswXSAvLyBhc3N1bWUgb25lIFxuICAgICAgICBjb25zdCBwcm90byA9IGdldFByb3RvKHByb3RvTmFtZSlcbiAgICAgICAgd3JhcChwcm90bykuc2V0QWxpYXMoY29uY2VwdE5hbWVbMF0sIHByb3BzTmFtZXMpXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGB3cmFwKCR7cHJvdG99KS5zZXRBbGlhcygke2NvbmNlcHROYW1lWzBdfSwgWyR7cHJvcHNOYW1lc31dKWApXG4gICAgfVxuXG4gICAgYXN5bmMgb3RoZXIoZW52aXJvOiBFbnZpcm8pIHtcbiAgICAgICAgY29uc3QgdG9wID0gdGhpcy5jb25kaXRpb24udG9wTGV2ZWwoKVswXVxuICAgICAgICBjb25zdCBwcm90b05hbWUgPSB0aGlzLmNvbmRpdGlvbi5kZXNjcmliZSh0b3ApWzBdIC8vIGFzc3VtZSBvbmUgXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IHRoaXMuY29uY2x1c2lvbi5kZXNjcmliZSh0b3ApWzBdXG4gICAgICAgIGNvbnN0IHkgPSBhd2FpdCBlbnZpcm8ucXVlcnkoY2xhdXNlT2YoeyB0eXBlOiAnbm91bicsIHJvb3Q6IHByb3RvTmFtZSB9LCAnWCcpKVxuICAgICAgICBjb25zdCBpZHMgPSB5Lm1hcChtID0+IG1bJ1gnXSlcbiAgICAgICAgaWRzLmZvckVhY2goaWQgPT4gbmV3IEVkaXQoaWQsIHByZWRpY2F0ZSkucnVuKGVudmlybykpXG4gICAgfVxuXG59XG5cblxuY29uc3QgZ2V0UHJvdG8gPSAobmFtZTogc3RyaW5nKSA9PlxuKHtcbiAgICAnYnV0dG9uJzogSFRNTEJ1dHRvbkVsZW1lbnQucHJvdG90eXBlXG59W25hbWVdKVxuIiwiaW1wb3J0IHsgZ2V0UGFyc2VyIH0gZnJvbSBcIi4uL3BhcnNlci9QYXJzZXJcIjtcbmltcG9ydCBCcmFpbiBmcm9tIFwiLi9CcmFpblwiO1xuaW1wb3J0IGdldEVudmlybyBmcm9tIFwiLi4vZW52aXJvL0Vudmlyb1wiO1xuaW1wb3J0IHsgZ2V0QWN0dWF0b3IgfSBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0dWF0b3JcIjtcbmltcG9ydCB7IHRvQ2xhdXNlIH0gZnJvbSBcIi4uL3BhcnNlci90b0NsYXVzZVwiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNpY0JyYWluIGltcGxlbWVudHMgQnJhaW4ge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY29uZmlnOiBDb25maWcsIHJlYWRvbmx5IGVudmlybyA9IGdldEVudmlybyh7IHJvb3Q6IGRvY3VtZW50LmJvZHkgfSksIHJlYWRvbmx5IGFjdHVhdG9yID0gZ2V0QWN0dWF0b3IoKSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgaW5pdCgpIHtcbiAgICAgICAgZm9yIChjb25zdCBzIG9mIHRoaXMuY29uZmlnLnN0YXJ0dXBDb21tYW5kcykge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5leGVjdXRlKHMpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFByb21pc2U8YW55W10+IHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiBhbnlbXSA9IFtdXG5cbiAgICAgICAgZm9yIChjb25zdCBhc3Qgb2YgZ2V0UGFyc2VyKG5hdGxhbmcsIHRoaXMuY29uZmlnKS5wYXJzZUFsbCgpKSB7XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY2xhdXNlID0gYXdhaXQgdG9DbGF1c2UoYXN0KVxuXG4gICAgICAgICAgICBpZiAoY2xhdXNlLmlzU2lkZUVmZmVjdHkpIHtcblxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuYWN0dWF0b3IudGFrZUFjdGlvbihjbGF1c2UsIHRoaXMuZW52aXJvKVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgbWFwcyA9IGF3YWl0IHRoaXMuZW52aXJvLnF1ZXJ5KGNsYXVzZSlcbiAgICAgICAgICAgICAgICBjb25zdCBpZHMgPSBtYXBzLmZsYXRNYXAobSA9PiBPYmplY3QudmFsdWVzKG0pKVxuICAgICAgICAgICAgICAgIGNvbnN0IG9iamVjdHMgPSBhd2FpdCBQcm9taXNlLmFsbChpZHMubWFwKGlkID0+IHRoaXMuZW52aXJvLmdldChpZCkpKVxuXG4gICAgICAgICAgICAgICAgdGhpcy5lbnZpcm8udmFsdWVzLmZvckVhY2gobyA9PiBvLnBvaW50T3V0KHsgdHVybk9mZjogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgICBvYmplY3RzLmZvckVhY2gobyA9PiBvPy5wb2ludE91dCgpKVxuICAgICAgICAgICAgICAgIG9iamVjdHMubWFwKG8gPT4gbz8ub2JqZWN0KS5mb3JFYWNoKG8gPT4gcmVzdWx0cy5wdXNoKG8pKVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIlxuaW1wb3J0IEJhc2ljQnJhaW4gZnJvbSBcIi4vQmFzaWNCcmFpblwiXG5cbi8qKlxuICogVGhlIG1haW4gZmFjYWRlIGNvbnRyb2xsZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBQcm9taXNlPGFueVtdPlxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QnJhaW4oY29uZmlnID0gZ2V0Q29uZmlnKCkpOiBQcm9taXNlPEJyYWluPiB7XG5cbiAgICBjb25zdCBiID0gbmV3IEJhc2ljQnJhaW4oY29uZmlnKVxuICAgIGF3YWl0IGIuaW5pdCgpXG4gICAgcmV0dXJuIGJcbn1cbiIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0FjdGlvblwiO1xuaW1wb3J0IHsgQ2xhdXNlLCBBbmRPcHRzLCBDb3B5T3B0cywgZW1wdHlDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4vZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5pbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcbmltcG9ydCB7IHRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5kIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNsYXVzZTE6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMjogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UySXNSaGVtZTogYm9vbGVhbixcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IEFuZCB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDpcbiAgICAgICAgICAgIFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG5cbiAgICB9XG5cbiAgICBnZXQgZW50aXRpZXMoKTogSWRbXSB7XG5cbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKVxuICAgICAgICAgICAgKVxuICAgICAgICApXG5cbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2UgeyAvL1RPRE86IGlmIHRoaXMgaXMgbmVnYXRlZCFcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5hYm91dChpZCkuYW5kKHRoaXMuY2xhdXNlMi5hYm91dChpZCkpXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3QoJHt5ZXN9KWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5KGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMS5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY2xhdXNlMi5kZXNjcmliZShpZCkpXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0b3BMZXZlbCh0aGlzKVxuICAgIH1cblxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIGdldE93bmVyc2hpcENoYWluKHRoaXMsIGVudGl0eSlcbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2xhdXNlMklzUmhlbWUgPyB0aGlzLmNsYXVzZTEgOiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IGVtcHR5Q2xhdXNlKClcbiAgICB9XG5cbiAgICBhc3luYyB0b0FjdGlvbih0b3BMZXZlbDogQ2xhdXNlKTogUHJvbWlzZTxBY3Rpb25bXT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IHRoaXMuY2xhdXNlMS50b0FjdGlvbih0b3BMZXZlbCkpLmNvbmNhdChhd2FpdCB0aGlzLmNsYXVzZTIudG9BY3Rpb24odG9wTGV2ZWwpKVxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4vaGFzaFN0cmluZ1wiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi9JZFwiO1xuaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5pbXBvcnQgQW5kIGZyb20gXCIuL0FuZFwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0aW9uXCI7XG5pbXBvcnQgeyB0b3BMZXZlbCB9IGZyb20gXCIuL3RvcExldmVsXCI7XG5pbXBvcnQgeyBnZXRPd25lcnNoaXBDaGFpbiB9IGZyb20gXCIuL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgQmFzaWNBY3Rpb24gZnJvbSBcIi4uL2FjdHVhdG9yL0Jhc2ljQWN0aW9uXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCI7XG5cbmV4cG9ydCBjbGFzcyBCYXNpY0NsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVkaWNhdGU6IExleGVtZTxMZXhlbWVUeXBlPixcbiAgICAgICAgcmVhZG9ubHkgYXJnczogSWRbXSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKEpTT04uc3RyaW5naWZ5KGFyZ3VtZW50cykpLFxuICAgICAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlKCkpIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQmFzaWNDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEJhc2ljQ2xhdXNlKHRoaXMucHJlZGljYXRlLFxuICAgICAgICAgICAgdGhpcy5hcmdzLm1hcChhID0+IG9wdHM/Lm1hcCA/IG9wdHM/Lm1hcFthXSA/PyBhIDogYSksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcbiAgICB9XG5cbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXSB7XG4gICAgICAgIHJldHVybiBbdGhpc11cbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgPyB0aGlzIDogZW1wdHlDbGF1c2UoKVxuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1sxXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzBdXSA6IFtdXG4gICAgfVxuXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1swXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzFdXSA6IFtdXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMucHJlZGljYXRlLnJvb3R9KCR7dGhpcy5hcmdzfSlgXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoaWQ6IElkKTogc3RyaW5nW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5lbnRpdGllcy5pbmNsdWRlcyhpZCkgJiYgdGhpcy5hcmdzLmxlbmd0aCA9PT0gMSA/IFt0aGlzLnByZWRpY2F0ZS5yb290XSA6IFtdXG4gICAgfVxuXG4gICAgdG9wTGV2ZWwoKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0b3BMZXZlbCh0aGlzKVxuICAgIH1cblxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIGdldE93bmVyc2hpcENoYWluKHRoaXMsIGVudGl0eSlcbiAgICB9XG5cbiAgICBhc3luYyB0b0FjdGlvbih0b3BMZXZlbDogQ2xhdXNlKTogUHJvbWlzZTxBY3Rpb25bXT4ge1xuICAgICAgICByZXR1cm4gW25ldyBCYXNpY0FjdGlvbih0aGlzLCB0b3BMZXZlbCldXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0IGVudGl0aWVzKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KHRoaXMuYXJncykpXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgQmFzaWNDbGF1c2UgfSBmcm9tIFwiLi9CYXNpY0NsYXVzZVwiXG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4vSWRcIlxuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0aW9uXCJcbmltcG9ydCB7IEVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiXG4vLyBpbXBvcnQgeyBsZXhlbWVzIH0gZnJvbSBcIi4uL2xleGVyL2xleGVtZXNcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5cbi8qKlxuICogQSAnbGFuZ3VhZ2UtYWdub3N0aWMnIGZpcnN0IG9yZGVyIGxvZ2ljIHJlcHJlc2VudGF0aW9uLlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcbiAgICByZWFkb25seSBuZWdhdGVkOiBib29sZWFuXG4gICAgcmVhZG9ubHkgaXNJbXBseTogYm9vbGVhblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlOiBudW1iZXJcbiAgICByZWFkb25seSBlbnRpdGllczogSWRbXVxuICAgIHJlYWRvbmx5IHRoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSByaGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eTogYm9vbGVhblxuICAgIHJlYWRvbmx5IGV4YWN0SWRzOiBib29sZWFuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2VcbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2VcbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZVxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdXG4gICAgYWJvdXQoaWQ6IElkKTogQ2xhdXNlXG4gICAgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IFByb21pc2U8QWN0aW9uW10+XG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXVxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdXG4gICAgdG9wTGV2ZWwoKTogSWRbXVxuICAgIGdldE93bmVyc2hpcENoYWluKGVudGl0eTogSWQpOiBJZFtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGF1c2VPZihwcmVkaWNhdGU6IExleGVtZTxMZXhlbWVUeXBlPiwgLi4uYXJnczogSWRbXSk6IENsYXVzZSB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0NsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZSA9ICgpOiBDbGF1c2UgPT4gbmV3IEVtcHR5Q2xhdXNlKClcblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIGV4YWN0SWRzPzogYm9vbGVhblxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuZE9wdHMge1xuICAgIGFzUmhlbWU/OiBib29sZWFuXG59IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvQWN0aW9uXCI7XG5pbXBvcnQgeyBBbmRPcHRzLCBDbGF1c2UsIENvcHlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCI7XG5cbmV4cG9ydCBjbGFzcyBFbXB0eUNsYXVzZSBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgaGFzaENvZGUgPSA5OTk5OTk5OSxcbiAgICAgICAgcmVhZG9ubHkgZW50aXRpZXMgPSBbXSxcbiAgICAgICAgcmVhZG9ubHkgaXNTaWRlRWZmZWN0eSA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIGdldCByaGVtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gb3RoZXJcbiAgICB9XG5cbiAgICBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBjb25jbHVzaW9uXG4gICAgfVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBhYm91dChpZDogSWQpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBkZXNjcmliZShpZDogSWQpOiBzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHRvcExldmVsKCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuICcnXG4gICAgfVxuXG4gICAgYXN5bmMgdG9BY3Rpb24odG9wTGV2ZWw6IENsYXVzZSk6IFByb21pc2U8QWN0aW9uW10+IHtcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKFwiTWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIik7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxufSIsIi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IG51bWJlciB8IHN0cmluZ1xuXG4vKipcbiAqIElkIHRvIElkIG1hcHBpbmcsIGZyb20gb25lIFwidW5pdmVyc2VcIiB0byBhbm90aGVyLlxuICovXG5leHBvcnQgdHlwZSBNYXAgPSB7IFthOiBJZF06IElkIH1cblxuXG5mdW5jdGlvbiogZ2V0SWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgeCsrXG4gICAgICAgIHlpZWxkIHhcbiAgICB9XG59XG5cbmNvbnN0IGlkR2VuZXJhdG9yID0gZ2V0SWRHZW5lcmF0b3IoKVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tSWQob3B0cz86IEdldFJhbmRvbUlkT3B0cyk6IElkIHtcbiAgICBcbiAgICAvLyBjb25zdCBuZXdJZCA9IGBpZCR7cGFyc2VJbnQoMTAwMCAqIE1hdGgucmFuZG9tKCkgKyAnJyl9YFxuXG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gXG5cbiAgICByZXR1cm4gb3B0cz8uYXNWYXIgPyB0b1ZhcihuZXdJZCkgOiBuZXdJZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdldFJhbmRvbUlkT3B0cyB7XG4gICAgYXNWYXI6IGJvb2xlYW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyKGlkOiBJZCk6IElkIHtcbiAgICByZXR1cm4gKCFOdW1iZXIuaXNOYU4oTnVtYmVyKGlkKSkgPyBgaWQke2lkfWAgOiBpZCArICcnKS50b1VwcGVyQ2FzZSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhcihlOiBJZCkge1xuICAgIHJldHVybiBOdW1iZXIuaXNOYU4oTnVtYmVyKGUpKSAmJiAoZS50b1N0cmluZygpWzBdID09PSBlLnRvU3RyaW5nKClbMF0udG9VcHBlckNhc2UoKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29uc3QoaWQ6IElkKTogSWQge1xuICAgIHJldHVybiAoIU51bWJlci5pc05hTihOdW1iZXIoaWQpKSA/IGBpZCR7aWR9YCA6IGlkICsgJycpLnRvTG93ZXJDYXNlKClcbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4vSWRcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9hY3R1YXRvci9BY3Rpb25cIjtcbmltcG9ydCB7IHRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIjtcbmltcG9ydCB7IGdldE93bmVyc2hpcENoYWluIH0gZnJvbSBcIi4vZ2V0T3duZXJzaGlwQ2hhaW5cIjtcbmltcG9ydCBJbXBseUFjdGlvbiBmcm9tIFwiLi4vYWN0dWF0b3IvSW1wbHlBY3Rpb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1wbHkgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgY29uZGl0aW9uOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNvbmNsdXNpb246IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBleGFjdElkcyA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBpc1NpZGVFZmZlY3R5ID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IGlzSW1wbHkgPSB0cnVlLFxuICAgICAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzKSksXG4gICAgICAgIHJlYWRvbmx5IHRoZW1lID0gY29uZGl0aW9uLnRoZW1lKSB7XG5cbiAgICB9XG5cbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICB9XG5cbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJbXBseSh0aGlzLmNvbmRpdGlvbi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jb25jbHVzaW9uLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPyAhdGhpcy5uZWdhdGVkIDogdGhpcy5uZWdhdGVkLFxuICAgICAgICAgICAgb3B0cz8uZXhhY3RJZHMgPz8gdGhpcy5leGFjdElkcyxcbiAgICAgICAgICAgIG9wdHM/LnNpZGVFZmZlY3R5ID8/IHRoaXMuaXNTaWRlRWZmZWN0eSlcblxuICAgIH1cblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzXVxuICAgIH1cblxuICAgIGdldCBlbnRpdGllcygpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZGl0aW9uLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNvbmNsdXNpb24uZW50aXRpZXMpXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzIC8vIGR1bm5vIHdoYXQgSSdtIGRvaW4nXG4gICAgfVxuXG4gICAgaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCEnKVxuICAgIH1cblxuICAgIGFib3V0KGlkOiBJZCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBlbXB0eUNsYXVzZSgpIC8vL1RPRE8hISEhISEhIVxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLmNvbmRpdGlvbi50b1N0cmluZygpfSAtLS0+ICR7dGhpcy5jb25jbHVzaW9uLnRvU3RyaW5nKCl9YFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbi5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jb25jbHVzaW9uLm93bmVkQnkoaWQpKVxuICAgIH1cblxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb24ub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNvbmNsdXNpb24ub3duZXJzT2YoaWQpKVxuICAgIH1cblxuICAgIGRlc2NyaWJlKGlkOiBJZCk6IHN0cmluZ1tdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uY2x1c2lvbi5kZXNjcmliZShpZCkuY29uY2F0KHRoaXMuY29uZGl0aW9uLmRlc2NyaWJlKGlkKSlcbiAgICB9XG5cbiAgICB0b3BMZXZlbCgpOiBJZFtdIHtcbiAgICAgICAgcmV0dXJuIHRvcExldmVsKHRoaXMpXG4gICAgfVxuXG4gICAgZ2V0T3duZXJzaGlwQ2hhaW4oZW50aXR5OiBJZCk6IElkW10ge1xuICAgICAgICByZXR1cm4gZ2V0T3duZXJzaGlwQ2hhaW4odGhpcywgZW50aXR5KVxuICAgIH1cblxuICAgIGFzeW5jIHRvQWN0aW9uKHRvcExldmVsOiBDbGF1c2UpOiBQcm9taXNlPEFjdGlvbltdPiB7XG4gICAgICAgIHJldHVybiBbbmV3IEltcGx5QWN0aW9uKHRoaXMuY29uZGl0aW9uLCB0aGlzLmNvbmNsdXNpb24pXVxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuL0lkXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldE93bmVyc2hpcENoYWluKGNsYXVzZTogQ2xhdXNlLCBlbnRpdHk6IElkKTogSWRbXSB7XG5cbiAgICBjb25zdCBvd25lZEVudGl0aWVzID0gY2xhdXNlLm93bmVkQnkoZW50aXR5KVxuXG4gICAgcmV0dXJuIG93bmVkRW50aXRpZXMubGVuZ3RoID09PSAwID9cbiAgICAgICAgW2VudGl0eV0gOlxuICAgICAgICBbZW50aXR5XS5jb25jYXQoZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlLCBvd25lZEVudGl0aWVzWzBdKSlcblxufSIsIlxuZXhwb3J0IGZ1bmN0aW9uIGhhc2hTdHJpbmcoc3RyaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnNwbGl0KCcnKS5tYXAoYyA9PiBjLmNoYXJDb2RlQXQoMCkpLnJlZHVjZSgoaGFzaCwgY2MpID0+IHtcbiAgICAgICAgY29uc3QgaDEgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNjO1xuICAgICAgICByZXR1cm4gaDEgJiBoMTsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi9DbGF1c2VcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvcExldmVsKGNsYXVzZTogQ2xhdXNlKSB7XG4gICAgcmV0dXJuIGNsYXVzZVxuICAgICAgICAuZW50aXRpZXNcbiAgICAgICAgLm1hcCh4ID0+ICh7IHgsIG93bmVyczogY2xhdXNlLm93bmVyc09mKHgpIH0pKVxuICAgICAgICAuZmlsdGVyKHggPT4geC5vd25lcnMubGVuZ3RoID09PSAwKVxuICAgICAgICAubWFwKHggPT4geC54KVxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQXN0VHlwZSwgTWVtYmVyIH0gZnJvbSBcIi4uL3BhcnNlci9hc3QtdHlwZXNcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuL0xleGVtZVR5cGVcIlxuaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuaW1wb3J0IHsgZ2V0U3ludGF4IH0gZnJvbSBcIi4vc3ludGF4ZXNcIlxuaW1wb3J0IHsgc3RhcnR1cENvbW1hbmRzIH0gZnJvbSBcIi4vc3RhcnR1cENvbW1hbmRzXCJcblxuZXhwb3J0IGludGVyZmFjZSBDb25maWcge1xuICAgIHJlYWRvbmx5IGxleGVtZXM6IExleGVtZTxMZXhlbWVUeXBlPltdXG4gICAgZ2V0U3ludGF4KG5hbWU6IEFzdFR5cGUpOiBNZW1iZXJbXVxuICAgIHJlYWRvbmx5IHN0YXJ0dXBDb21tYW5kczogc3RyaW5nW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmZpZygpOiBDb25maWcge1xuICAgIHJldHVybiB7XG4gICAgICAgIGxleGVtZXMsXG4gICAgICAgIGdldFN5bnRheCxcbiAgICAgICAgc3RhcnR1cENvbW1hbmRzXG4gICAgfVxufSIsImltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vbGV4ZXIvTGV4ZW1lXCI7XG5cbmV4cG9ydCBjb25zdCBsZXhlbWVzOiBMZXhlbWU8TGV4ZW1lVHlwZT5bXSA9IFtcbiAgICB7XG4gICAgICAgIHJvb3Q6ICdoYXZlJyxcbiAgICAgICAgdHlwZTogJ212ZXJiJyxcbiAgICAgICAgZm9ybXM6IFsnaGF2ZScsICdoYXMnXSxcbiAgICAgICAgcmVndWxhcjogZmFsc2VcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYnV0dG9uJyxcbiAgICAgICAgdHlwZTogJ25vdW4nLFxuICAgICAgICByZWd1bGFyOiB0cnVlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2NsaWNrJyxcbiAgICAgICAgdHlwZTogJ212ZXJiJyxcbiAgICAgICAgZm9ybXM6IFsnY2xpY2snXSxcbiAgICAgICAgcmVndWxhcjogdHJ1ZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjbGlja2VkJyxcbiAgICAgICAgdHlwZTogJ2FkaicsXG4gICAgICAgIGRlcml2ZWRGcm9tOiAnY2xpY2snXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3ByZXNzZWQnLFxuICAgICAgICB0eXBlOiAnYWRqJyxcbiAgICAgICAgYWxpYXNGb3I6ICdjbGlja2VkJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdjYXQnLFxuICAgICAgICB0eXBlOiAnbm91bidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYmUnLFxuICAgICAgICB0eXBlOiAnY29wdWxhJyxcbiAgICAgICAgZm9ybXM6IFsnaXMnLCAnYXJlJ10sXG4gICAgICAgIHJlZ3VsYXI6IGZhbHNlXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogXCJpc24ndFwiLFxuICAgICAgICB0eXBlOiAnY29udHJhY3Rpb24nLFxuICAgICAgICBjb250cmFjdGlvbkZvcjogWydpcycsICdub3QnXVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6IFwicmVkXCIsXG4gICAgICAgIHR5cGU6IFwiYWRqXCJcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImdyZWVuXCIsXG4gICAgICAgIHR5cGU6IFwiYWRqXCJcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiBcImV4aXN0XCIsXG4gICAgICAgIHR5cGU6IFwiaXZlcmJcIixcbiAgICAgICAgcmVndWxhcjogdHJ1ZVxuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdkbycsXG4gICAgICAgIHR5cGU6ICdodmVyYicsXG4gICAgICAgIHJlZ3VsYXI6IGZhbHNlLFxuICAgICAgICBmb3JtczogWydkbycsICdkb2VzJ11cbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnc29tZScsXG4gICAgICAgIHR5cGU6ICdleGlzdHF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdldmVyeScsXG4gICAgICAgIHR5cGU6ICd1bmlxdWFudCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYWxsJyxcbiAgICAgICAgdHlwZTogJ3VuaXF1YW50J1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdhbnknLFxuICAgICAgICB0eXBlOiAndW5pcXVhbnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3RvJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aXRoJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdmcm9tJyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICdvZicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb3ZlcicsXG4gICAgICAgIHR5cGU6ICdwcmVwb3NpdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnb24nLFxuICAgICAgICB0eXBlOiAncHJlcG9zaXRpb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2F0JyxcbiAgICAgICAgdHlwZTogJ3ByZXBvc2l0aW9uJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGVuJyxcbiAgICAgICAgdHlwZTogJ3RoZW4nIC8vIGZpbGxlciB3b3JkXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2lmJyxcbiAgICAgICAgdHlwZTogJ3N1YmNvbmonXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ3doZW4nLFxuICAgICAgICB0eXBlOiAnc3ViY29uaidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYmVjYXVzZScsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd3aGlsZScsXG4gICAgICAgIHR5cGU6ICdzdWJjb25qJ1xuICAgIH0sXG5cbiAgICB7XG4gICAgICAgIHJvb3Q6ICd0aGF0JyxcbiAgICAgICAgdHlwZTogJ3JlbHByb24nXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ25vdCcsXG4gICAgICAgIHR5cGU6ICduZWdhdGlvbidcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAndGhlJyxcbiAgICAgICAgdHlwZTogJ2RlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYScsXG4gICAgICAgIHR5cGU6ICdpbmRlZmFydCdcbiAgICB9LFxuXG4gICAge1xuICAgICAgICByb290OiAnYW4nLFxuICAgICAgICB0eXBlOiAnaW5kZWZhcnQnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJy4nLFxuICAgICAgICB0eXBlOiAnZnVsbHN0b3AnXG4gICAgfSxcblxuICAgIHtcbiAgICAgICAgcm9vdDogJ2FuZCcsXG4gICAgICAgIHR5cGU6ICdub25zdWJjb25qJ1xuICAgIH0sXG4gICAge1xuICAgICAgICByb290OiAnYmxhY2snLFxuICAgICAgICB0eXBlOiAnYWRqJ1xuICAgIH1cbl0iLCJleHBvcnQgY29uc3Qgc3RhcnR1cENvbW1hbmRzOiBzdHJpbmdbXSA9IFtcbiAgICAnY29sb3Igb2YgYW55IGJ1dHRvbiBpcyBiYWNrZ3JvdW5kIG9mIHN0eWxlIG9mIGJ1dHRvbicsXG4gICAgJ3RleHQgb2YgYW55IGJ1dHRvbiBpcyB0ZXh0Q29udGVudCBvZiBidXR0b24nXG5dIiwiaW1wb3J0IHsgTWVtYmVyLCBBc3RUeXBlIH0gZnJvbSBcIi4uL3BhcnNlci9hc3QtdHlwZXNcIjtcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCI7XG5cbmZ1bmN0aW9uIHN0cmluZ0xpdGVyYWxzPFQgZXh0ZW5kcyBzdHJpbmc+KC4uLmFyZ3M6IFRbXSk6IFRbXSB7IHJldHVybiBhcmdzOyB9XG50eXBlIEVsZW1lbnRUeXBlPFQgZXh0ZW5kcyBSZWFkb25seUFycmF5PHVua25vd24+PiA9IFQgZXh0ZW5kcyBSZWFkb25seUFycmF5PGluZmVyIEVsZW1lbnRUeXBlPiA/IEVsZW1lbnRUeXBlIDogbmV2ZXI7XG5cbmNvbnN0IHZhbHVlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdub3VucGhyYXNlJyxcbiAgICAnY29tcGxlbWVudCcsXG4gICAgJ2NvcHVsYXN1YmNsYXVzZScsXG4gICAgJ2NvbXBsZXhzZW50ZW5jZTEnLFxuICAgICdjb21wbGV4c2VudGVuY2UyJyxcbiAgICAnY29wdWxhc2VudGVuY2UnLFxuICAgICdpdmVyYnNlbnRlbmNlJyxcbiAgICAnbXZlcmJzZW50ZW5jZScsXG4gICAgJ2xleGVtZWxpc3QnKVxuLy8gfCAnaXZlcmJzdWJjbGF1c2UnXG4vLyB8ICdtdmVyYnN1YmNsYXVzZTEnXG4vLyB8ICdtdmVyYnN1YmNsYXVzZTInXG4vLyB8ICdjb25qc2VudGVjZSdcbi8vIHwgJ2NvcHVsYXF1ZXN0aW9uJ1xuXG5leHBvcnQgdHlwZSBDb25zdGl0dWVudFR5cGUgPSBFbGVtZW50VHlwZTx0eXBlb2YgdmFsdWVzPjtcblxuY29uc3Qgc3ludGF4ZXM6IHsgW25hbWUgaW4gQ29uc3RpdHVlbnRUeXBlXTogTWVtYmVyW10gfSA9IHtcbiAgICAnbm91bnBocmFzZSc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ3VuaXF1YW50JywgJ2V4aXN0cXVhbnQnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGU6IFsnaW5kZWZhcnQnLCAnZGVmYXJ0J10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2FkaiddLCBudW1iZXI6ICcqJyB9LFxuICAgICAgICB7IHR5cGU6IFsnbm91biddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGFzdWJjbGF1c2UnLCAvKidpdmVyYnN1YmNsYXVzZScsICdtdmVyYnN1YmNsYXVzZTEnLCAnbXZlcmJzdWJjbGF1c2UyJyovXSwgbnVtYmVyOiAnKicgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvbXBsZW1lbnQnXSwgbnVtYmVyOiAnKicgfSxcbiAgICBdLFxuICAgICdjb21wbGVtZW50JzogW1xuICAgICAgICB7IHR5cGU6IFsncHJlcG9zaXRpb24nXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydub3VucGhyYXNlJ10sIG51bWJlcjogMSB9XG4gICAgXSxcbiAgICAnY29wdWxhc3ViY2xhdXNlJzogW1xuICAgICAgICB7IHR5cGU6IFsncmVscHJvbiddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxIH1cbiAgICBdLFxuICAgICdjb3B1bGFzZW50ZW5jZSc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25lZ2F0aW9uJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAncHJlZGljYXRlJyB9XG4gICAgXSxcbiAgICAnaXZlcmJzZW50ZW5jZSc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW5waHJhc2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25lZ2F0aW9uJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2l2ZXJiJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsnY29tcGxlbWVudCddLCBudW1iZXI6ICcqJyB9XG4gICAgXSxcbiAgICAnY29tcGxleHNlbnRlbmNlMSc6IFtcbiAgICAgICAgeyB0eXBlOiBbJ3N1YmNvbmonXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGFzZW50ZW5jZScsICdtdmVyYnNlbnRlbmNlJywgJ2l2ZXJic2VudGVuY2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnY29uZGl0aW9uJyB9LFxuICAgICAgICB7IHR5cGU6IFsndGhlbiddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZTogWydjb3B1bGFzZW50ZW5jZScsICdtdmVyYnNlbnRlbmNlJywgJ2l2ZXJic2VudGVuY2UnXSwgbnVtYmVyOiAxLCByb2xlOiAnY29uc2VxdWVuY2UnIH1cbiAgICBdLFxuICAgICdjb21wbGV4c2VudGVuY2UyJzogW1xuICAgICAgICB7IHR5cGU6IFsnY29wdWxhc2VudGVuY2UnLCAnbXZlcmJzZW50ZW5jZScsICdpdmVyYnNlbnRlbmNlJ10sIG51bWJlcjogMSwgcm9sZTogJ2NvbnNlcXVlbmNlJyB9LFxuICAgICAgICB7IHR5cGU6IFsnc3ViY29uaiddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYXNlbnRlbmNlJywgJ212ZXJic2VudGVuY2UnLCAnaXZlcmJzZW50ZW5jZSddLCBudW1iZXI6IDEsIHJvbGU6ICdjb25kaXRpb24nIH1cbiAgICBdLFxuICAgICdtdmVyYnNlbnRlbmNlJzogW1xuICAgICAgICB7IHR5cGU6IFsnbm91bnBocmFzZSddLCBudW1iZXI6IDEsIHJvbGU6ICdzdWJqZWN0JyB9LFxuICAgICAgICB7IHR5cGU6IFsnbmVnYXRpb24nXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGU6IFsnbXZlcmInXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydjb21wbGVtZW50J10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWydub3VucGhyYXNlJ10sIG51bWJlcjogMSwgcm9sZTogJ29iamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvbXBsZW1lbnQnXSwgbnVtYmVyOiAnKicgfSxcbiAgICBdLFxuICAgICdsZXhlbWVsaXN0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqJywgJ25vdW4nXSwgbnVtYmVyOiAnKicgfVxuICAgIF1cbn1cblxuZXhwb3J0IGNvbnN0IGdldFN5bnRheCA9IChuYW1lOiBBc3RUeXBlKTogTWVtYmVyW10gPT4ge1xuICAgIHJldHVybiBzeW50YXhlc1tuYW1lIGFzIENvbnN0aXR1ZW50VHlwZV0gPz8gW3sgdHlwZTogW25hbWVdLCBudW1iZXI6IDEgfV07IC8vIFRPRE86IHByb2JsZW0sIGFkaiBpcyBub3QgYWx3YXlzIDEgISEhISEhXG59XG5cbmV4cG9ydCBjb25zdCBpc0F0b20gPSAobmFtZTogQXN0VHlwZSkgPT4ge1xuICAgIGNvbnN0IGxleGVtZVR5cGVzOiBMZXhlbWVUeXBlW10gPSBbJ2FkaicsICdjb250cmFjdGlvbicsICdjb3B1bGEnLCAnZGVmYXJ0JywgJ2luZGVmYXJ0JywgJ2Z1bGxzdG9wJywgJ2h2ZXJiJywgJ2l2ZXJiJywgJ212ZXJiJywgJ25lZ2F0aW9uJywgJ25vbnN1YmNvbmonLCAnZXhpc3RxdWFudCcsICd1bmlxdWFudCcsICd0aGVuJywgJ3JlbHByb24nLCAnbmVnYXRpb24nLCAnbm91bicsICdwcmVwb3NpdGlvbicsICdzdWJjb25qJ107XG4gICAgcmV0dXJuIGxleGVtZVR5cGVzLmluY2x1ZGVzKG5hbWUgYXMgTGV4ZW1lVHlwZSk7XG59XG5cbmV4cG9ydCBjb25zdCBpc05lY2Vzc2FyeSA9IChtOiBNZW1iZXIpID0+IHtcbiAgICByZXR1cm4gbS5udW1iZXIgPT09IDE7XG59XG4iLCJpbXBvcnQgeyBnZXRBY3R1YXRvciB9IGZyb20gXCIuLi9hY3R1YXRvci9BY3R1YXRvclwiO1xuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiXG5pbXBvcnQgZ2V0RW52aXJvIGZyb20gXCIuL0Vudmlyb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEFuYXBob3JhIHtcbiAgICBhc3NlcnQoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPHZvaWQ+XG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QW5hcGhvcmEoKSB7XG4gICAgcmV0dXJuIG5ldyBFbnZpcm9BbmFwaG9yYSgpXG59XG5cbmNsYXNzIEVudmlyb0FuYXBob3JhIGltcGxlbWVudHMgQW5hcGhvcmEge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGVudmlybyA9IGdldEVudmlybyh7IHJvb3Q6IHVuZGVmaW5lZCB9KSkge1xuXG4gICAgfVxuXG4gICAgYXN5bmMgYXNzZXJ0KGNsYXVzZTogQ2xhdXNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IGdldEFjdHVhdG9yKCkudGFrZUFjdGlvbihjbGF1c2UuY29weSh7IGV4YWN0SWRzOiB0cnVlIH0pLCB0aGlzLmVudmlybylcbiAgICB9XG5cbiAgICBhc3luYyBxdWVyeShjbGF1c2U6IENsYXVzZSk6IFByb21pc2U8TWFwW10+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW52aXJvLnF1ZXJ5KGNsYXVzZSlcbiAgICB9XG5cbn1cblxuIiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL2NsYXVzZXMvQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCwgTWFwIH0gZnJvbSBcIi4uL2NsYXVzZXMvSWRcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcbmltcG9ydCB7IEVudmlybyB9IGZyb20gXCIuL0Vudmlyb1wiO1xuaW1wb3J0IHsgUGxhY2Vob2xkZXIgfSBmcm9tIFwiLi9QbGFjZWhvbGRlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlRW52aXJvIGltcGxlbWVudHMgRW52aXJvIHtcblxuICAgIHByb3RlY3RlZCBsYXN0UmVmZXJlbmNlZD86IElkXG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSByb290PzogSFRNTEVsZW1lbnQsIHJlYWRvbmx5IGRpY3Rpb25hcnk6IHsgW2lkOiBJZF06IFdyYXBwZXIgfSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBhc3luYyBnZXQoaWQ6IElkKTogUHJvbWlzZTxXcmFwcGVyIHwgdW5kZWZpbmVkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRpY3Rpb25hcnlbaWRdXG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlcygpOiBXcmFwcGVyW10ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLmRpY3Rpb25hcnkpXG4gICAgfVxuXG4gICAgc2V0UGxhY2Vob2xkZXIoaWQ6IElkKTogV3JhcHBlciB7XG4gICAgICAgIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBuZXcgUGxhY2Vob2xkZXIoKVxuICAgICAgICByZXR1cm4gdGhpcy5kaWN0aW9uYXJ5W2lkXVxuICAgIH1cblxuICAgIGV4aXN0cyhpZDogSWQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGljdGlvbmFyeVtpZF0gJiYgISh0aGlzLmRpY3Rpb25hcnlbaWRdIGluc3RhbmNlb2YgUGxhY2Vob2xkZXIpXG4gICAgfVxuXG4gICAgc2V0KGlkOiBJZCwgb2JqZWN0OiBXcmFwcGVyKTogdm9pZCB7XG5cbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSB0aGlzLmRpY3Rpb25hcnlbaWRdXG5cbiAgICAgICAgaWYgKHBsYWNlaG9sZGVyICYmIHBsYWNlaG9sZGVyIGluc3RhbmNlb2YgUGxhY2Vob2xkZXIpIHtcblxuICAgICAgICAgICAgcGxhY2Vob2xkZXIucHJlZGljYXRlcy5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgICAgIG9iamVjdC5zZXQocClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHRoaXMuZGljdGlvbmFyeVtpZF0gPSBvYmplY3RcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSBpZFxuXG4gICAgfVxuXG4gICAgYXN5bmMgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPiB7IC8vVE9ETyB0aGlzIGlzIGEgdG1wIHNvbHV0aW9uLCBmb3IgYW5hcGhvcmEgcmVzb2x1dGlvbiwgYnV0IGp1c3Qgd2l0aCBkZXNjcmlwdGlvbnMsIHdpdGhvdXQgdGFraW5nIChtdWx0aS1lbnRpdHkpIHJlbGF0aW9uc2hpcHMgaW50byBhY2NvdW50XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSBPYmplY3RcbiAgICAgICAgICAgIC5lbnRyaWVzKHRoaXMuZGljdGlvbmFyeSlcbiAgICAgICAgICAgIC5tYXAoeCA9PiAoeyBlOiB4WzBdLCB3OiB4WzFdIH0pKVxuXG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gY2xhdXNlIC8vIGRlc2NyaWJlZCBlbnRpdGllc1xuICAgICAgICAgICAgLmVudGl0aWVzXG4gICAgICAgICAgICAubWFwKGUgPT4gKHsgZSwgZGVzYzogY2xhdXNlLnRoZW1lLmRlc2NyaWJlKGUpIH0pKVxuXG4gICAgICAgIGNvbnN0IGdldEl0ID0gKCkgPT4gdGhpcy5sYXN0UmVmZXJlbmNlZCA/IFt7IGU6IHRoaXMubGFzdFJlZmVyZW5jZWQgYXMgc3RyaW5nLCB3OiB0aGlzLmRpY3Rpb25hcnlbdGhpcy5sYXN0UmVmZXJlbmNlZF0gfV0gOiBbXVxuXG4gICAgICAgIGNvbnN0IHJlcyA9IHF1ZXJ5XG4gICAgICAgICAgICAuZmxhdE1hcChxID0+IHtcblxuICAgICAgICAgICAgICAgIGNvbnN0IHRvID0gdW5pdmVyc2VcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcih1ID0+IHEuZGVzYy5ldmVyeShkID0+IHUudy5pcyhkKSkpXG4gICAgICAgICAgICAgICAgICAgIC5jb25jYXQocS5kZXNjLmluY2x1ZGVzKCdpdCcpID8gZ2V0SXQoKSA6IFtdKSAvL1RPRE86IGhhcmRjb2RlZCBiYWRcbiAgICAgICAgICAgICAgICAvL1RPRE86IGFmdGVyIFwiZXZlcnkgLi4uXCIgc2VudGVuY2UsIFwiaXRcIiBzaG91bGQgYmUgdW5kZWZpbmVkXG5cbiAgICAgICAgICAgICAgICByZXR1cm4geyBmcm9tOiBxLmUsIHRvOiB0byB9XG5cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgcmVzU2l6ZSA9IE1hdGgubWF4KC4uLnJlcy5tYXAocSA9PiBxLnRvLmxlbmd0aCkpO1xuICAgICAgICBjb25zdCBmcm9tVG9UbyA9IChmcm9tOiBJZCkgPT4gcmVzLmZpbHRlcih4ID0+IHguZnJvbSA9PT0gZnJvbSlbMF0udG8ubWFwKHggPT4geC5lKTtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSAobjogbnVtYmVyKSA9PiBbLi4ubmV3IEFycmF5KG4pLmtleXMoKV1cblxuICAgICAgICBjb25zdCByZXMyID0gcmFuZ2UocmVzU2l6ZSkubWFwKGkgPT5cbiAgICAgICAgICAgIGNsYXVzZVxuICAgICAgICAgICAgICAgIC5lbnRpdGllc1xuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnJvbSA9PiBmcm9tVG9Ubyhmcm9tKS5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgIC5tYXAoZnJvbSA9PiAoeyBbZnJvbV06IGZyb21Ub1RvKGZyb20pW2ldID8/IGZyb21Ub1RvKGZyb20pWzBdIH0pKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpKVxuXG4gICAgICAgIHRoaXMubGFzdFJlZmVyZW5jZWQgPSByZXMyLmZsYXRNYXAoeCA9PiBPYmplY3QudmFsdWVzKHgpKS5hdCgtMSkgPz8gdGhpcy5sYXN0UmVmZXJlbmNlZFxuXG4gICAgICAgIHJldHVybiByZXMyIC8vIHJldHVybiBsaXN0IG9mIG1hcHMsIHdoZXJlIGVhY2ggbWFwIHNob3VsZCBzaG91bGQgaGF2ZSBBTEwgaWRzIGZyb20gY2xhdXNlIGluIGl0cyBrZXlzLCBlZzogW3tpZDI6aWQxLCBpZDQ6aWQzfSwge2lkMjoxLCBpZDQ6M31dLlxuICAgIH1cblxufSIsImltcG9ydCB7IGdldENvbmNlcHRzIH0gZnJvbSBcIi4vZ2V0Q29uY2VwdHNcIjtcbmltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uY3JldGVXcmFwcGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBvYmplY3Q6IGFueSxcbiAgICAgICAgcmVhZG9ubHkgc2ltcGxlQ29uY2VwdHM6IHsgW2NvbmNlcHROYW1lOiBzdHJpbmddOiBzdHJpbmdbXSB9ID0gb2JqZWN0LnNpbXBsZUNvbmNlcHRzID8/IHt9KSB7XG5cbiAgICAgICAgb2JqZWN0LnNpbXBsZUNvbmNlcHRzID0gc2ltcGxlQ29uY2VwdHNcbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBzdHJpbmcsIHByb3BzPzogc3RyaW5nW10pOiB2b2lkIHtcblxuICAgICAgICBpZiAocHJvcHMgJiYgcHJvcHMubGVuZ3RoID4gMSkgeyAvLyBhc3N1bWUgPiAxIHByb3BzIGFyZSBhIHBhdGhcblxuICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocHJvcHMsIHByZWRpY2F0ZSlcblxuICAgICAgICB9IGVsc2UgaWYgKHByb3BzICYmIHByb3BzLmxlbmd0aCA9PT0gMSkgeyAvLyBzaW5nbGUgcHJvcFxuXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5zaW1wbGVDb25jZXB0cykuaW5jbHVkZXMocHJvcHNbMF0pKSB7IC8vIGlzIGNvbmNlcHQgXG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQodGhpcy5zaW1wbGVDb25jZXB0c1twcm9wc1swXV0sIHByZWRpY2F0ZSlcbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIC4uLiBub3QgY29uY2VwdCwganVzdCBwcm9wXG4gICAgICAgICAgICAgICAgdGhpcy5zZXROZXN0ZWQocHJvcHMsIHByZWRpY2F0ZSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKCFwcm9wcyB8fCBwcm9wcy5sZW5ndGggPT09IDApIHsgLy8gbm8gcHJvcHNcblxuICAgICAgICAgICAgY29uc3QgY29uY2VwdHMgPSBnZXRDb25jZXB0cyhwcmVkaWNhdGUpXG5cbiAgICAgICAgICAgIGlmIChjb25jZXB0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAodGhpcy5vYmplY3QgYXMgYW55KVtwcmVkaWNhdGVdID0gdHJ1ZVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldE5lc3RlZCh0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHRzWzBdXSwgcHJlZGljYXRlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBpcyhwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogYm9vbGVhbiB7XG5cbiAgICAgICAgY29uc3QgY29uY2VwdCA9IGdldENvbmNlcHRzKHByZWRpY2F0ZSkuYXQoMClcblxuICAgICAgICByZXR1cm4gY29uY2VwdCA/XG4gICAgICAgICAgICB0aGlzLmdldE5lc3RlZCh0aGlzLnNpbXBsZUNvbmNlcHRzW2NvbmNlcHRdKSA9PT0gcHJlZGljYXRlIDpcbiAgICAgICAgICAgICh0aGlzLm9iamVjdCBhcyBhbnkpW3ByZWRpY2F0ZV0gIT09IHVuZGVmaW5lZFxuXG4gICAgfVxuXG4gICAgc2V0QWxpYXMoY29uY2VwdE5hbWU6IHN0cmluZywgcHJvcFBhdGg6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2ltcGxlQ29uY2VwdHNbY29uY2VwdE5hbWVdID0gcHJvcFBhdGhcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgc2V0TmVzdGVkKHBhdGg6IHN0cmluZ1tdLCB2YWx1ZTogc3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdFtwYXRoWzBdXSA9IHZhbHVlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB4ID0gdGhpcy5vYmplY3RbcGF0aFswXV1cblxuICAgICAgICBwYXRoLnNsaWNlKDEsIC0yKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgeCA9IHhbcF1cbiAgICAgICAgfSlcblxuICAgICAgICB4W3BhdGguYXQoLTEpIGFzIHN0cmluZ10gPSB2YWx1ZVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBnZXROZXN0ZWQocGF0aDogc3RyaW5nW10pIHtcblxuICAgICAgICBsZXQgeCA9IHRoaXMub2JqZWN0W3BhdGhbMF1dIC8vIGFzc3VtZSBhdCBsZWFzdCBvbmVcblxuICAgICAgICBwYXRoLnNsaWNlKDEpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB4ID0geFtwXVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiB4XG5cbiAgICB9XG5cbiAgICBwb2ludE91dChvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuOyB9KTogdm9pZCB7XG5cbiAgICAgICAgaWYgKHRoaXMub2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0LnN0eWxlLm91dGxpbmUgPSBvcHRzPy50dXJuT2ZmID8gJycgOiAnI2YwMCBzb2xpZCAycHgnXG4gICAgICAgIH1cblxuICAgIH1cblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQsIE1hcCB9IGZyb20gXCIuLi9jbGF1c2VzL0lkXCI7XG5pbXBvcnQgV3JhcHBlciBmcm9tIFwiLi9XcmFwcGVyXCI7XG5pbXBvcnQgQmFzZUVudmlybyBmcm9tIFwiLi9CYXNlRW52aXJvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvIHtcbiAgICBnZXQoaWQ6IElkKTogUHJvbWlzZTxXcmFwcGVyIHwgdW5kZWZpbmVkPlxuICAgIHNldChpZDogSWQsIG9iamVjdDogV3JhcHBlcik6IHZvaWRcbiAgICBzZXRQbGFjZWhvbGRlcihpZDogSWQpOiBXcmFwcGVyXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBQcm9taXNlPE1hcFtdPlxuICAgIGV4aXN0cyhpZDogSWQpOiBib29sZWFuXG4gICAgZ2V0IHZhbHVlcygpOiBXcmFwcGVyW11cbiAgICByZWFkb25seSByb290PzogSFRNTEVsZW1lbnRcbiAgICAvLyBnZXQga2V5cygpOiBJZFtdXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEVudmlybyhvcHRzPzogR2V0RW52aXJvT3BzKTogRW52aXJvIHtcbiAgICByZXR1cm4gbmV3IEJhc2VFbnZpcm8ob3B0cz8ucm9vdClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRFbnZpcm9PcHMge1xuICAgIHJvb3Q/OiBIVE1MRWxlbWVudFxufSIsImltcG9ydCBXcmFwcGVyIGZyb20gXCIuL1dyYXBwZXJcIjtcblxuZXhwb3J0IGNsYXNzIFBsYWNlaG9sZGVyIGltcGxlbWVudHMgV3JhcHBlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwcmVkaWNhdGVzOiBzdHJpbmdbXSA9IFtdLCByZWFkb25seSBvYmplY3Q6IGFueSA9IHt9KSB7XG5cbiAgICB9XG5cbiAgICBzZXQocHJlZGljYXRlOiBzdHJpbmcsIHByb3BzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnByZWRpY2F0ZXMucHVzaChwcmVkaWNhdGUpO1xuICAgIH1cblxuICAgIGlzKHByZWRpY2F0ZTogc3RyaW5nLCAuLi5hcmdzOiBXcmFwcGVyW10pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJlZGljYXRlcy5pbmNsdWRlcyhwcmVkaWNhdGUpO1xuICAgIH1cblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBzdHJpbmcsIHByb3BQYXRoOiBzdHJpbmdbXSk6IHZvaWQgeyB9XG4gICAgcG9pbnRPdXQob3B0cz86IHsgdHVybk9mZjogYm9vbGVhbiB9KTogdm9pZCB7IH1cblxufVxuIiwiaW1wb3J0IENvbmNyZXRlV3JhcHBlciBmcm9tIFwiLi9Db25jcmV0ZVdyYXBwZXJcIlxuXG5leHBvcnQgZGVmYXVsdCBpbnRlcmZhY2UgV3JhcHBlciB7XG5cbiAgICByZWFkb25seSBvYmplY3Q6IGFueVxuICAgIHNldChwcmVkaWNhdGU6IHN0cmluZywgcHJvcHM/OiBzdHJpbmdbXSk6IHZvaWRcbiAgICBpcyhwcmVkaWNhdGU6IHN0cmluZywgLi4uYXJnczogV3JhcHBlcltdKTogYm9vbGVhblxuICAgIHNldEFsaWFzKGNvbmNlcHROYW1lOiBzdHJpbmcsIHByb3BQYXRoOiBzdHJpbmdbXSk6IHZvaWRcbiAgICBwb2ludE91dChvcHRzPzogeyB0dXJuT2ZmOiBib29sZWFuIH0pOiB2b2lkXG4gICAgLy8gZ2V0KHByZWRpY2F0ZTogc3RyaW5nKTogYW55XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXAobzogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBDb25jcmV0ZVdyYXBwZXIobylcbn0iLCJleHBvcnQgY29uc3Qgc2V0dGVyUHJlZml4ID0gJ3NldCdcbmV4cG9ydCBjb25zdCBpc1ByZWZpeCA9ICdpcydcbmV4cG9ydCBjb25zdCBnZXR0ZXJQcmVmaXggPSAnZ2V0J1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uY2VwdHMob2JqZWN0OiBhbnkpOiBzdHJpbmdbXSB7XG5cbiAgICAvLyBUT0RPOiB0cnkgZ2V0dGluZyBhIGNvbmNlcHQgZnJvbSBhIHN0cmluZyBvYmplY3Qgd2l0aCBhIFxuICAgIC8vIHNwZWNpYWwgZGljdGlvbmFyeSwgbGlrZSB7cmVkOmNvbG9yLCBncmVlbjpjb2xvciwgYmx1ZTpjb2xvcn1cbiAgICBjb25zdCBzdHJpbmdDb25jZXB0czogeyBbeDogc3RyaW5nXTogc3RyaW5nIH0gPSB7XG4gICAgICAgICdncmVlbic6ICdjb2xvcicsXG4gICAgICAgICdyZWQnOiAnY29sb3InLFxuICAgICAgICAnYmx1ZSc6ICdjb2xvcicsXG4gICAgICAgICdibGFjayc6ICdjb2xvcicsXG4gICAgICAgICdiaWcnOiAnc2l6ZSdcbiAgICB9XG4gICAgY29uc3QgbWF5YmVDb25jZXB0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSBzdHJpbmdDb25jZXB0c1tvYmplY3QudG9TdHJpbmcoKV1cblxuICAgIGlmIChtYXliZUNvbmNlcHQpIHtcbiAgICAgICAgcmV0dXJuIFttYXliZUNvbmNlcHRdXG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdFxuICAgICAgICAuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpXG4gICAgICAgIC5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqZWN0Ll9fcHJvdG9fXykpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4LmluY2x1ZGVzKHNldHRlclByZWZpeCkgfHwgeC5pbmNsdWRlcyhpc1ByZWZpeCkpXG4gICAgICAgIC5tYXAoeCA9PiBnZXRDb25jZXB0TmFtZSh4KSlcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2V0dGVyTmFtZShjb25jZXB0OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYCR7c2V0dGVyUHJlZml4fV8ke2NvbmNlcHR9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SXNOYW1lKGNvbmNlcHQ6IHN0cmluZykge1xuICAgIHJldHVybiBgJHtpc1ByZWZpeH1fJHtjb25jZXB0fWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEdldHRlck5hbWUoY29uY2VwdDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGAke2dldHRlclByZWZpeH1fJHtjb25jZXB0fWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbmNlcHROYW1lKG1ldGhvZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG1ldGhvZFxuICAgICAgICAucmVwbGFjZShpc1ByZWZpeCwgJycpXG4gICAgICAgIC5yZXBsYWNlKHNldHRlclByZWZpeCwgJycpXG4gICAgICAgIC5yZXBsYWNlKGdldHRlclByZWZpeCwgJycpXG4gICAgICAgIC5yZXBsYWNlKCdfJywgJycpXG59XG4iLCJpbXBvcnQgbWFpbiBmcm9tIFwiLi9tYWluL21haW5cIjtcbmltcG9ydCBhdXRvdGVzdGVyIGZyb20gXCIuL3Rlc3RzL2F1dG90ZXN0ZXJcIjtcbi8vIGltcG9ydCB0ZXN0TmV3WFBhcnNlciBmcm9tIFwiLi90ZXN0cy90ZXN0TmV3WFBhcnNlclwiO1xuLy8gaW1wb3J0IHsgdG9jbGF1c2V0ZXN0cyB9IGZyb20gXCIuL3Rlc3RzL3RvY2xhdXNldGVzdHNcIjtcbi8vIGltcG9ydCB0ZXN0TmV3WFBhcnNlciBmcm9tIFwiLi90ZXN0cy94bm91bnBocmFzZVwiO1xuLy8gaW1wb3J0IHhwYXJzZXJ0ZXN0IGZyb20gXCIuL3Rlc3RzL3hwYXJzZXJ0ZXN0XCI7XG4vLyBhd2FpdCB0b2NsYXVzZXRlc3RzKClcblxuLy8gKGFzeW5jICgpPT57XG4vLyAgICAgYXdhaXQgYXV0b3Rlc3RlcigpXG4vLyB9KSgpXG5cbi8vIHRlc3ROZXdYUGFyc2VyKClcblxubWFpbigpXG5cbiIsImltcG9ydCB7IGdldExleGVtZXMsIExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IExleGVyLCB7IEFzc2VydEFyZ3MgfSBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCByZWFkb25seSB0b2tlbnM6IExleGVtZTxMZXhlbWVUeXBlPltdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlclxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLCByZWFkb25seSBjb25maWc6IENvbmZpZykge1xuXG4gICAgICAgIHRoaXMudG9rZW5zID0gc291cmNlQ29kZVxuICAgICAgICAgICAgLy8gLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgIC5zcGxpdCgvXFxzK3xcXC4vKVxuICAgICAgICAgICAgLm1hcChzID0+ICFzID8gJy4nIDogcylcbiAgICAgICAgICAgIC5mbGF0TWFwKHMgPT4gZ2V0TGV4ZW1lcyhzLCBjb25maWcubGV4ZW1lcykpXG5cbiAgICAgICAgdGhpcy5fcG9zID0gMFxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IExleGVtZTxMZXhlbWVUeXBlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybiBjdXJyZW50IHRva2VuIGlmZiBvZiBnaXZlbiB0eXBlIGFuZCBtb3ZlIHRvIG5leHQ7IFxuICAgICAqIGVsc2UgcmV0dXJuIHVuZGVmaW5lZCBhbmQgZG9uJ3QgbW92ZS5cbiAgICAgKiBAcGFyYW0gYXJncyBcbiAgICAgKiBAcmV0dXJucyBcbiAgICAgKi9cbiAgICBhc3NlcnQ8VCBleHRlbmRzIExleGVtZVR5cGU+KHR5cGU6IFQsIGFyZ3M6IEFzc2VydEFyZ3MpOiBMZXhlbWU8VD4gfCB1bmRlZmluZWQge1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLnBlZWtcblxuICAgICAgICBpZiAoY3VycmVudCAmJiBjdXJyZW50LnR5cGUgPT09IHR5cGUpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudCBhcyBMZXhlbWU8VD5cbiAgICAgICAgfSBlbHNlIGlmIChhcmdzLmVycm9yT3V0ID8/IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuY3JvYWsoYXJncy5lcnJvck1zZyA/PyAnJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gICAgfVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5cblxuZXhwb3J0IGludGVyZmFjZSBMZXhlbWU8VCBleHRlbmRzIExleGVtZVR5cGU+IHtcbiAgICAvKipjYW5vbmljYWwgZm9ybSovIHJlYWRvbmx5IHJvb3Q6IHN0cmluZ1xuICAgIC8qKnRva2VuIHR5cGUqLyByZWFkb25seSB0eXBlOiBUXG4gICAgLyoqdXNlZnVsIGZvciBpcnJlZ3VsYXIgc3R1ZmYqLyByZWFkb25seSBmb3Jtcz86IHN0cmluZ1tdXG4gICAgLyoqcmVmZXJzIHRvIHZlcmIgY29uanVnYXRpb25zIG9yIHBsdXJhbCBmb3JtcyovIHJlYWRvbmx5IHJlZ3VsYXI/OiBib29sZWFuXG4gICAgLyoqc2VtYW50aWNhbCBkZXBlbmRlY2UqLyByZWFkb25seSBkZXJpdmVkRnJvbT86IHN0cmluZ1xuICAgIC8qKnNlbWFudGljYWwgZXF1aXZhbGVuY2UqLyByZWFkb25seSBhbGlhc0Zvcj86IHN0cmluZ1xuICAgIC8qKm1hZGUgdXAgb2YgbW9yZSBsZXhlbWVzKi8gcmVhZG9ubHkgY29udHJhY3Rpb25Gb3I/OiBzdHJpbmdbXVxuICAgIC8qKmZvcm0gb2YgdGhpcyBpbnN0YW5jZSovcmVhZG9ubHkgdG9rZW4/OiBzdHJpbmdcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1zT2YobGV4ZW1lOiBMZXhlbWU8TGV4ZW1lVHlwZT4pIHtcblxuICAgIHJldHVybiBbbGV4ZW1lLnJvb3RdLmNvbmNhdChsZXhlbWU/LmZvcm1zID8/IFtdKVxuICAgICAgICAuY29uY2F0KGxleGVtZS5yZWd1bGFyID8gW2Ake2xleGVtZS5yb290fXNgXSA6IFtdKVxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlbWVzKHdvcmQ6IHN0cmluZywgbGV4ZW1lczogTGV4ZW1lPExleGVtZVR5cGU+W10pOiBMZXhlbWU8TGV4ZW1lVHlwZT5bXSB7XG5cbiAgICBjb25zdCBsZXhlbWU6IExleGVtZTxMZXhlbWVUeXBlPiA9XG4gICAgICAgIGxleGVtZXMuZmlsdGVyKHggPT4gZm9ybXNPZih4KS5pbmNsdWRlcyh3b3JkKSkuYXQoMClcbiAgICAgICAgPz8geyByb290OiB3b3JkLCB0eXBlOiAnbm91bicgfVxuXG4gICAgY29uc3QgbGV4ZW1lMjogTGV4ZW1lPExleGVtZVR5cGU+ID0geyAuLi5sZXhlbWUsIHRva2VuOiB3b3JkIH1cblxuICAgIHJldHVybiBsZXhlbWUyLmNvbnRyYWN0aW9uRm9yID9cbiAgICAgICAgbGV4ZW1lMi5jb250cmFjdGlvbkZvci5mbGF0TWFwKHggPT4gZ2V0TGV4ZW1lcyh4LCBsZXhlbWVzKSkgOlxuICAgICAgICBbbGV4ZW1lMl1cblxufVxuIiwiaW1wb3J0IEVhZ2VyTGV4ZXIgZnJvbSBcIi4vRWFnZXJMZXhlclwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi9MZXhlbWVcIlxuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlciB7XG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lPExleGVtZVR5cGU+XG4gICAgZ2V0IHBvcygpOiBudW1iZXJcbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhblxuICAgIG5leHQoKTogdm9pZFxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZFxuICAgIGFzc2VydDxUIGV4dGVuZHMgTGV4ZW1lVHlwZT4odHlwZTogVCwgYXJnczogQXNzZXJ0QXJncyk6IExleGVtZTxUPiB8IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzc2VydEFyZ3Mge1xuICAgIGVycm9yTXNnPzogc3RyaW5nXG4gICAgZXJyb3JPdXQ/OiBib29sZWFuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbmZpZzpDb25maWcpOiBMZXhlciB7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUsIGNvbmZpZylcbn1cblxuZXhwb3J0IHR5cGUgQ29uc3RydWN0b3I8VD4gPSBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBUXG4iLCJpbXBvcnQgeyBnZXRCcmFpbiB9IGZyb20gXCIuLi9icmFpbi9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgICAgYnJhaW46IGF3YWl0IGdldEJyYWluKCksXG4gICAgICAgIHByb21wdFZpc2libGU6IGZhbHNlXG4gICAgfTtcblxuICAgICh3aW5kb3cgYXMgYW55KS5icmFpbiA9IHN0YXRlLmJyYWluXG5cbiAgICBjb25zdCB1cGRhdGUgPSAoKSA9PiB7XG4gICAgICAgIHRleHRhcmVhLmhpZGRlbiA9ICFzdGF0ZS5wcm9tcHRWaXNpYmxlXG4gICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPyB0ZXh0YXJlYS5mb2N1cygpIDogMFxuICAgIH1cblxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzUwdncnXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzFlbSdcbiAgICB0ZXh0YXJlYS5oaWRkZW4gPSB0cnVlXG4gICAgdGV4dGFyZWEuc3R5bGUucG9zaXRpb24gPSAnc3RpY2t5J1xuICAgIHRleHRhcmVhLnN0eWxlLnRvcCA9ICcwJ1xuICAgIHRleHRhcmVhLnN0eWxlLnpJbmRleCA9ICcxMDAwJ1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGV4dGFyZWEpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdicicpKVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnInKSlcblxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYXN5bmMgZSA9PiB7XG5cbiAgICAgICAgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdTcGFjZScpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb21wdFZpc2libGUgPSAhc3RhdGUucHJvbXB0VmlzaWJsZVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdFbnRlcicpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN0YXRlLmJyYWluLmV4ZWN1dGUodGV4dGFyZWEudmFsdWUpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGUoKVxuICAgIH0pXG5cbn0iLCJpbXBvcnQgeyBBc3ROb2RlLCBBc3RUeXBlLCBDYXJkaW5hbGl0eSwgUm9sZSwgTWVtYmVyLCBBdG9tTm9kZSwgQ29tcG9zaXRlTm9kZSB9IGZyb20gXCIuL2FzdC10eXBlc1wiO1xuaW1wb3J0IHsgQ29uc3RpdHVlbnRUeXBlLCBpc0F0b20sIGlzTmVjZXNzYXJ5IH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiO1xuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcIi4vUGFyc2VyXCI7XG5pbXBvcnQgeyBnZXRMZXhlciB9IGZyb20gXCIuLi9sZXhlci9MZXhlclwiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSBcIi4uL2NvbmZpZy9Db25maWdcIjtcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBzb3VyY2VDb2RlOiBzdHJpbmcsIHJlYWRvbmx5IGNvbmZpZzogQ29uZmlnLCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbmZpZykpIHtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdHJ5KG1ldGhvZDogKGFyZ3M6IGFueSkgPT4gQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZCwgLi4uYXJnczogQXN0VHlwZVtdKSB7XG5cbiAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zO1xuICAgICAgICBjb25zdCB4ID0gbWV0aG9kKGFyZ3MpO1xuXG4gICAgICAgIGlmICgheCkge1xuICAgICAgICAgICAgdGhpcy5sZXhlci5iYWNrVG8obWVtZW50byk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG5cbiAgICBwYXJzZUFsbCgpIHtcblxuICAgICAgICBjb25zdCByZXN1bHRzOiAoQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZClbXSA9IFtdO1xuXG4gICAgICAgIHdoaWxlICghdGhpcy5sZXhlci5pc0VuZCkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHRoaXMucGFyc2UoKSk7XG4gICAgICAgICAgICB0aGlzLmxleGVyLmFzc2VydCgnZnVsbHN0b3AnLCB7IGVycm9yT3V0OiBmYWxzZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH1cblxuICAgIHBhcnNlKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRyeSh0aGlzLnRvcFBhcnNlLCAnY29tcGxleHNlbnRlbmNlMScpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnRvcFBhcnNlLCAnY29tcGxleHNlbnRlbmNlMicpXG4gICAgICAgICAgICA/PyB0aGlzLnRyeSh0aGlzLnRvcFBhcnNlLCAnY29wdWxhc2VudGVuY2UnKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy50b3BQYXJzZSwgJ2l2ZXJic2VudGVuY2UnKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy50b3BQYXJzZSwgJ212ZXJic2VudGVuY2UnKVxuICAgICAgICAgICAgPz8gdGhpcy50cnkodGhpcy50b3BQYXJzZSwgJ25vdW5waHJhc2UnKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdG9wUGFyc2UgPSAobmFtZTogQXN0VHlwZSwgbnVtYmVyPzogQ2FyZGluYWxpdHksIHJvbGU/OiBSb2xlKTogQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZCA9PiB7XG5cblxuXG4gICAgICAgIGNvbnN0IG1lbWJlcnMgPSB0aGlzLmNvbmZpZy5nZXRTeW50YXgobmFtZSk7XG5cbiAgICAgICAgaWYgKG1lbWJlcnMubGVuZ3RoID09PSAxICYmIG1lbWJlcnNbMF0udHlwZS5ldmVyeSh0ID0+IGlzQXRvbSh0KSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQXRvbShtZW1iZXJzWzBdLCBudW1iZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb25zdGl0dWVudFR5cGUsIG51bWJlciwgcm9sZSk7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VBdG9tID0gKG06IE1lbWJlciwgbnVtYmVyPzogQ2FyZGluYWxpdHkpOiBBdG9tTm9kZTxMZXhlbWVUeXBlPiB8IENvbXBvc2l0ZU5vZGU8Q29uc3RpdHVlbnRUeXBlPiB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgYXRvbXM6IEF0b21Ob2RlPExleGVtZVR5cGU+W10gPSBbXTtcblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQgJiYgbS50eXBlLmluY2x1ZGVzKHRoaXMubGV4ZXIucGVlay50eXBlKSkge1xuXG4gICAgICAgICAgICBpZiAobnVtYmVyICE9PSAnKicgJiYgYXRvbXMubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZXIucGVlaztcbiAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpO1xuICAgICAgICAgICAgYXRvbXMucHVzaCh7IHR5cGU6IHgudHlwZSwgbGV4ZW1lOiB4IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bWJlciA9PT0gJyonID8gKHtcbiAgICAgICAgICAgIHR5cGU6ICdsZXhlbWVsaXN0JyxcbiAgICAgICAgICAgIGxpbmtzOiAoYXRvbXMgYXMgYW55KSAvL1RPRE8hISEhXG4gICAgICAgIH0pIDogYXRvbXNbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUNvbXBvc2l0ZSA9IChuYW1lOiBDb25zdGl0dWVudFR5cGUsIG51bWJlcj86IENhcmRpbmFsaXR5LCByb2xlPzogUm9sZSk6IENvbXBvc2l0ZU5vZGU8Q29uc3RpdHVlbnRUeXBlPiB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IGFueSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHRoaXMuY29uZmlnLmdldFN5bnRheChuYW1lKSkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pO1xuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhc3QpIHtcbiAgICAgICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIGxpbmtzOiBsaW5rc1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VNZW1iZXIgPSAobTogTWVtYmVyLCByb2xlPzogUm9sZSk6IEFzdE5vZGU8QXN0VHlwZT4gfCB1bmRlZmluZWQgPT4ge1xuXG4gICAgICAgIGxldCB4O1xuXG4gICAgICAgIGZvciAoY29uc3QgdCBvZiBtLnR5cGUpIHtcblxuICAgICAgICAgICAgeCA9IHRoaXMudG9wUGFyc2UodCwgbS5udW1iZXIsIG0ucm9sZSk7XG5cbiAgICAgICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB4O1xuICAgIH07XG59XG4iLCIvLyBpbXBvcnQgeyBnZXRMZXhlciB9IGZyb20gXCIuLi9sZXhlci9MZXhlclwiO1xuLy8gaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9hc3QvaW50ZXJmYWNlcy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2xleGVyL0xleGVtZVwiO1xuaW1wb3J0IHsgQXN0Tm9kZSwgQXN0VHlwZSB9IGZyb20gXCIuL2FzdC10eXBlc1wiO1xuLy8gaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9hc3QvaW50ZXJmYWNlcy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBLb29sUGFyc2VyIH0gZnJvbSBcIi4vS29vbFBhcnNlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlciB7XG4gICAgcGFyc2UoKTogQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZDtcbiAgICBwYXJzZUFsbCgpOiAoQXN0Tm9kZTxBc3RUeXBlPiB8IHVuZGVmaW5lZClbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyc2VyKHNvdXJjZUNvZGU6IHN0cmluZywgY29uZmlnOkNvbmZpZyk6IFBhcnNlciB7XG4gICAgcmV0dXJuIG5ldyBLb29sUGFyc2VyKHNvdXJjZUNvZGUsIGNvbmZpZyk7XG59XG5cblxuIiwiLy8gaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9hc3QvaW50ZXJmYWNlcy9MZXhlbWVUeXBlXCI7XG5pbXBvcnQgeyBDbGF1c2UsIGNsYXVzZU9mLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuLi9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0UmFuZG9tSWQsIElkLCBpc1ZhciwgdG9Db25zdCwgdG9WYXIgfSBmcm9tIFwiLi4vY2xhdXNlcy9JZFwiO1xuaW1wb3J0IHsgZ2V0QW5hcGhvcmEgfSBmcm9tIFwiLi4vZW52aXJvL0FuYXBob3JhXCI7XG5pbXBvcnQgeyBBc3ROb2RlLCBBc3RUeXBlLCBBdG9tTm9kZSwgQ29tcG9zaXRlTm9kZSB9IGZyb20gXCIuL2FzdC10eXBlc1wiO1xuaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi9jb25maWcvTGV4ZW1lVHlwZVwiO1xuXG4vLyBzdGFydCBzaW1wbGUgYnkgYXNzdW1pbmcgaGFyZGNvZGVkIHR5cGVzLCB0aGVuIHRyeSB0byBkZXBlbmQgc29sZWx5IG9uIHJvbGUgKHNlbWFudGljIHJvbGUpXG5cblxuZXhwb3J0IGludGVyZmFjZSBSb2xlcyB7XG4gICAgc3ViamVjdD86IElkXG4gICAgb2JqZWN0PzogSWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUb0NsYXVzZU9wdHMge1xuICAgIHJvbGVzPzogUm9sZXMsXG4gICAgYW5hcGhvcmE/OiBDbGF1c2Vcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRvQ2xhdXNlKGFzdDogQXN0Tm9kZTxBc3RUeXBlPiwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cbiAgICBpZiAoYXN0LnR5cGUgPT0gJ25vdW5waHJhc2UnKSB7XG4gICAgICAgIHJldHVybiBub3VuUGhyYXNlVG9DbGF1c2UoYXN0IGFzIGFueSwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC50eXBlID09ICdjb3B1bGFzdWJjbGF1c2UnKSB7XG4gICAgICAgIHJldHVybiBjb3B1bGFTdWJDbGF1c2VUb0NsYXVzZShhc3QgYXMgYW55LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT0gJ2NvbXBsZW1lbnQnKSB7XG4gICAgICAgIHJldHVybiBjb21wbGVtZW50VG9DbGF1c2UoYXN0IGFzIGFueSwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdC50eXBlID09ICdjb3B1bGFzZW50ZW5jZScpIHtcbiAgICAgICAgcmV0dXJuIGNvcHVsYVNlbnRlbmNlVG9DbGF1c2UoYXN0IGFzIGFueSwgYXJncylcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYElkayB3aGF0IHRvIGRvIHdpdGggJHthc3QudHlwZX0hYClcblxufVxuXG5hc3luYyBmdW5jdGlvbiBjb3B1bGFTZW50ZW5jZVRvQ2xhdXNlKGNvcHVsYVNlbnRlbmNlOiBDb21wb3NpdGVOb2RlPCdjb3B1bGFzZW50ZW5jZSc+LCBhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuXG4gICAgY29uc3Qgc3ViamVjdEFzdCA9IGNvcHVsYVNlbnRlbmNlLmxpbmtzLnN1YmplY3QgYXMgQ29tcG9zaXRlTm9kZTwnbm91bnBocmFzZSc+XG4gICAgY29uc3QgcHJlZGljYXRlQXN0ID0gY29wdWxhU2VudGVuY2UubGlua3MucHJlZGljYXRlIGFzIENvbXBvc2l0ZU5vZGU8J25vdW5waHJhc2UnPlxuXG4gICAgY29uc3Qgc3ViamVjdElkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gZ2V0UmFuZG9tSWQoeyBhc1Zhcjogc3ViamVjdEFzdC5saW5rcy51bmlxdWFudCAhPT0gdW5kZWZpbmVkIH0pXG4gICAgY29uc3QgbmV3QXJncyA9IHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogc3ViamVjdElkIH0gfVxuXG5cbiAgICBjb25zdCBzdWJqZWN0ID0gYXdhaXQgdG9DbGF1c2Uoc3ViamVjdEFzdCwgbmV3QXJncylcbiAgICBjb25zdCBwcmVkaWNhdGUgPSAoYXdhaXQgdG9DbGF1c2UocHJlZGljYXRlQXN0LCBuZXdBcmdzKSkuY29weSh7IG5lZ2F0ZTogISFjb3B1bGFTZW50ZW5jZS5saW5rcy5uZWdhdGlvbiB9KVxuXG4gICAgY29uc3QgZW50aXRpZXMgPSBzdWJqZWN0LmVudGl0aWVzLmNvbmNhdChwcmVkaWNhdGUuZW50aXRpZXMpXG5cbiAgICBjb25zdCByZXN1bHQgPSBlbnRpdGllcy8vIGFzc3VtZSBhbnkgc2VudGVuY2Ugd2l0aCBhbnkgdmFyIGlzIGFuIGltcGxpY2F0aW9uXG4gICAgICAgIC5zb21lKGUgPT4gaXNWYXIoZSkpID9cbiAgICAgICAgc3ViamVjdC5pbXBsaWVzKHByZWRpY2F0ZSkgOlxuICAgICAgICBzdWJqZWN0LmFuZChwcmVkaWNhdGUsIHsgYXNSaGVtZTogdHJ1ZSB9KVxuXG4gICAgY29uc3QgbTAgPSByZXN1bHQuZW50aXRpZXMgLy8gYXNzdW1lIGlkcyBhcmUgY2FzZSBpbnNlbnNpdGl2ZSwgYXNzdW1lIGlmIElEWCBpcyB2YXIgYWxsIGlkeCBhcmUgdmFyXG4gICAgICAgIC5maWx0ZXIoeCA9PiBpc1Zhcih4KSlcbiAgICAgICAgLm1hcChlID0+ICh7IFt0b0NvbnN0KGUpXTogZSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICBjb25zdCBhID0gZ2V0QW5hcGhvcmEoKSAvLyBnZXQgYW5hcGhvcmFcbiAgICBhd2FpdCBhLmFzc2VydChzdWJqZWN0KVxuICAgIGNvbnN0IG0xID0gKGF3YWl0IGEucXVlcnkocHJlZGljYXRlKSlbMF0gPz8ge31cbiAgICAvLyBjb25zb2xlLmxvZyh7bTF9KVxuXG4gICAgY29uc3QgcmVzdWx0MiA9IHJlc3VsdC5jb3B5KHsgbWFwOiBtMCB9KS5jb3B5KHsgc2lkZUVmZmVjdHk6IHRydWUsIG1hcDogbTEgfSlcblxuICAgIGNvbnN0IG0yID0gcmVzdWx0Mi5lbnRpdGllcyAvLyBhc3N1bWUgYW55dGhpbmcgb3duZWQgYnkgYSB2YXJpYWJsZSBpcyBhbHNvIGEgdmFyaWFibGVcbiAgICAgICAgLmZpbHRlcihlID0+IGlzVmFyKGUpKVxuICAgICAgICAuZmxhdE1hcChlID0+IHJlc3VsdDIub3duZWRCeShlKSlcbiAgICAgICAgLm1hcChlID0+ICh7IFtlXTogdG9WYXIoZSkgfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuXG4gICAgcmV0dXJuIHJlc3VsdDIuY29weSh7IG1hcDogbTIgfSlcblxuXG5cbn1cblxuYXN5bmMgZnVuY3Rpb24gY29wdWxhU3ViQ2xhdXNlVG9DbGF1c2UoY29wdWxhU3ViQ2xhdXNlOiBDb21wb3NpdGVOb2RlPCdjb3B1bGFzdWJjbGF1c2UnPiwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG5cbiAgICBjb25zdCBwcmVkaWNhdGUgPSBjb3B1bGFTdWJDbGF1c2UubGlua3MucHJlZGljYXRlIGFzIENvbXBvc2l0ZU5vZGU8J25vdW5waHJhc2UnPlxuXG4gICAgcmV0dXJuIChhd2FpdCB0b0NsYXVzZShwcmVkaWNhdGUsIHsgLi4uYXJncywgcm9sZXM6IHsgc3ViamVjdDogYXJncz8ucm9sZXM/LnN1YmplY3QgfSB9KSlcbiAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcbn1cblxuYXN5bmMgZnVuY3Rpb24gY29tcGxlbWVudFRvQ2xhdXNlKGNvbXBsZW1lbnQ6IENvbXBvc2l0ZU5vZGU8J2NvbXBsZW1lbnQnPiwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFByb21pc2U8Q2xhdXNlPiB7XG4gICAgY29uc3Qgc3ViaklkID0gYXJncz8ucm9sZXM/LnN1YmplY3QgPz8gKCgpOiBJZCA9PiB7IHRocm93IG5ldyBFcnJvcigndW5kZWZpbmVkIHN1YmplY3QgaWQnKSB9KSgpXG4gICAgY29uc3QgbmV3SWQgPSBnZXRSYW5kb21JZCgpXG5cbiAgICBjb25zdCBwcmVwb3NpdGlvbiA9IGNvbXBsZW1lbnQubGlua3MucHJlcG9zaXRpb24gYXMgQXRvbU5vZGU8J3ByZXBvc2l0aW9uJz5cbiAgICBjb25zdCBub3VuUGhyYXNlID0gY29tcGxlbWVudC5saW5rcy5ub3VucGhyYXNlIGFzIENvbXBvc2l0ZU5vZGU8J25vdW5waHJhc2UnPlxuXG4gICAgcmV0dXJuIGNsYXVzZU9mKHByZXBvc2l0aW9uLmxleGVtZSwgc3ViaklkLCBuZXdJZClcbiAgICAgICAgLmFuZChhd2FpdCB0b0NsYXVzZShub3VuUGhyYXNlLCB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IG5ld0lkIH0gfSkpXG4gICAgICAgIC5jb3B5KHsgc2lkZUVmZmVjdHk6IGZhbHNlIH0pXG5cbn1cblxuXG5hc3luYyBmdW5jdGlvbiBub3VuUGhyYXNlVG9DbGF1c2Uobm91blBocmFzZTogQ29tcG9zaXRlTm9kZTwnbm91bnBocmFzZSc+LCBhcmdzPzogVG9DbGF1c2VPcHRzKTogUHJvbWlzZTxDbGF1c2U+IHtcblxuICAgIGNvbnN0IG1heWJlSWQgPSBhcmdzPy5yb2xlcz8uc3ViamVjdCA/PyBnZXRSYW5kb21JZCgpXG4gICAgY29uc3Qgc3ViamVjdElkID0gbm91blBocmFzZS5saW5rcy51bmlxdWFudCA/IHRvVmFyKG1heWJlSWQpIDogbWF5YmVJZFxuICAgIGNvbnN0IG5ld0FyZ3MgPSB7IC4uLmFyZ3MsIHJvbGVzOiB7IHN1YmplY3Q6IHN1YmplY3RJZCB9IH07XG5cbiAgICBjb25zdCBhZGplY3RpdmVzOiBBdG9tTm9kZTxMZXhlbWVUeXBlPltdID0gKG5vdW5QaHJhc2UubGlua3MubGV4ZW1lbGlzdCBhcyBhbnkpLmxpbmtzXG4gICAgY29uc3Qgbm91biA9IG5vdW5QaHJhc2UubGlua3Mubm91biBhcyBBdG9tTm9kZTxMZXhlbWVUeXBlPiB8IHVuZGVmaW5lZFxuICAgIGNvbnN0IGNvbXBsZW1lbnRzID0gW25vdW5QaHJhc2UubGlua3MuY29tcGxlbWVudF0gLy9UT0RPOiBpbiBwYXJzZXIgTU9SRSB0aGFuIG9uZSBjb21wbGVtZW50ICEhISFcbiAgICBjb25zdCBzdWJDbGF1c2UgPSBub3VuUGhyYXNlLmxpbmtzLmNvcHVsYXN1YmNsYXVzZVxuXG4gICAgY29uc3QgcmVzID1cbiAgICAgICAgYWRqZWN0aXZlcy5tYXAoYT0+YS5sZXhlbWUpXG4gICAgICAgICAgICAuY29uY2F0KG5vdW4/LmxleGVtZSA/IFtub3VuLmxleGVtZV0gOiBbXSlcbiAgICAgICAgICAgIC5tYXAocCA9PiBjbGF1c2VPZihwLCBzdWJqZWN0SWQpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYzEsIGMyKSA9PiBjMS5hbmQoYzIpLCBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmFuZCgoYXdhaXQgUHJvbWlzZS5hbGwoY29tcGxlbWVudHMubWFwKGMgPT4gYyA/IHRvQ2xhdXNlKGMsIG5ld0FyZ3MpIDogZW1wdHlDbGF1c2UoKSkpKS5yZWR1Y2UoKGMxLCBjMikgPT4gYzEuYW5kKGMyKSwgZW1wdHlDbGF1c2UoKSkpXG4gICAgICAgICAgICAuYW5kKHN1YkNsYXVzZSA/IGF3YWl0IHRvQ2xhdXNlKHN1YkNsYXVzZSwgbmV3QXJncykgOiBlbXB0eUNsYXVzZSgpKVxuICAgICAgICAgICAgLmNvcHkoeyBzaWRlRWZmZWN0eTogZmFsc2UgfSlcblxuICAgIHJldHVybiByZXNcbn1cblxuXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hcHAvc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9