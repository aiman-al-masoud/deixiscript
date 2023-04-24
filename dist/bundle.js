/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/index.ts":
/*!**********************!*\
  !*** ./app/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const main_1 = __importDefault(__webpack_require__(/*! ./src/main/main */ "./app/src/main/main.ts"));
(0, main_1.default)();


/***/ }),

/***/ "./app/src/backend/BaseThing.ts":
/*!**************************************!*\
  !*** ./app/src/backend/BaseThing.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseThing = void 0;
const Lexeme_1 = __webpack_require__(/*! ../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const Clause_1 = __webpack_require__(/*! ../middle/clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const uniq_1 = __webpack_require__(/*! ../utils/uniq */ "./app/src/utils/uniq.ts");
class BaseThing {
    constructor(id, bases = [], children = {}, lexemes = []) {
        this.id = id;
        this.bases = bases;
        this.children = children;
        this.lexemes = lexemes;
        this.extends = (thing) => {
            this.unextends(thing); // or avoid?
            this.bases.push(thing.clone());
        };
        this.get = (id) => {
            var _a;
            const parts = id.split('.');
            const p1 = parts[0];
            const child = (_a = this.children[p1]) !== null && _a !== void 0 ? _a : this.children[id];
            const res = /* parts.length > 1 */ child.getId() !== id ? child.get(id /* parts.slice(1).join('.') */) : child;
            return res !== null && res !== void 0 ? res : this.bases.find(x => x.get(id));
        };
        this.toClause = (query) => {
            const x = this.lexemes
                .flatMap(x => x.referents.map(r => (0, Clause_1.clauseOf)(x, r.getId())))
                .reduce((a, b) => a.and(b), Clause_1.emptyClause);
            const y = Object
                .keys(this.children)
                .map(x => (0, Clause_1.clauseOf)({ root: 'of', type: 'preposition', referents: [] }, x, this.id)) // hardcoded english!
                .reduce((a, b) => a.and(b), Clause_1.emptyClause);
            const z = Object
                .values(this.children)
                .map(x => x.toClause(query))
                .reduce((a, b) => a.and(b), Clause_1.emptyClause);
            return x.and(y).and(z).simple;
        };
        this.setLexeme = (lexeme) => {
            const old = this.lexemes.filter(x => x.root === lexeme.root);
            const updated = old.map(x => (Object.assign(Object.assign(Object.assign({}, x), lexeme), { referents: [...x.referents, ...lexeme.referents] })));
            this.lexemes = this.lexemes.filter(x => x.root !== lexeme.root);
            const toBeAdded = updated.length ? updated : [lexeme];
            this.lexemes.push(...toBeAdded);
            const extrapolated = toBeAdded.flatMap(x => (0, Lexeme_1.extrapolate)(x, this));
            this.lexemes.push(...extrapolated);
        };
        this.getLexemes = (rootOrToken) => {
            return this.lexemes
                .filter(x => rootOrToken === x.token || rootOrToken === x.root);
        };
    }
    getId() {
        return this.id;
    }
    clone(opts) {
        var _a;
        return new BaseThing((_a = opts === null || opts === void 0 ? void 0 : opts.id) !== null && _a !== void 0 ? _a : this.id, // clones have same id
        this.bases.map(x => x.clone()), Object.entries(this.children).map(e => ({ [e[0]]: e[1].clone() })).reduce((a, b) => (Object.assign(Object.assign({}, a), b))));
    }
    unextends(thing) {
        this.bases = this.bases.filter(x => x.getId() !== thing.getId());
    }
    set(id, thing) {
        this.children[id] = thing;
        this.setLexeme({ root: 'thing', type: 'noun', referents: [thing] }); // every thing is a thing
        //TODO
        if (typeof thing.toJs() === 'string') { //TODO make this polymorphic
            this.setLexeme({ root: 'string', type: 'noun', referents: [thing] });
        }
        else if (typeof thing.toJs() === 'number') {
            this.setLexeme({ root: 'number', type: 'noun', referents: [thing] });
        }
    }
    toJs() {
        return this; //TODOooooooooOO!
    }
    query(query) {
        return (0, uniq_1.uniq)(this.toClause(query).query(query, { /* it: this.lastReferenced  */}));
    }
    removeLexeme(rootOrToken) {
        const garbage = this.getLexemes(rootOrToken).flatMap(x => x.referents);
        garbage.forEach(x => delete this.children[x.getId()]);
        this.lexemes = this.lexemes.filter(x => rootOrToken !== x.token && rootOrToken !== x.root);
    }
    equals(other) {
        return this.toJs() === (other === null || other === void 0 ? void 0 : other.toJs());
    }
}
exports.BaseThing = BaseThing;


/***/ }),

/***/ "./app/src/backend/BasicContext.ts":
/*!*****************************************!*\
  !*** ./app/src/backend/BasicContext.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasicContext = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/BaseThing.ts");
const Config_1 = __webpack_require__(/*! ../config/Config */ "./app/src/config/Config.ts");
const Lexeme_1 = __webpack_require__(/*! ../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const macroToSyntax_1 = __webpack_require__(/*! ../frontend/parser/macroToSyntax */ "./app/src/frontend/parser/macroToSyntax.ts");
const maxPrecedence_1 = __webpack_require__(/*! ../frontend/parser/maxPrecedence */ "./app/src/frontend/parser/maxPrecedence.ts");
class BasicContext extends BaseThing_1.BaseThing {
    constructor(id, config = (0, Config_1.getConfig)(), staticDescPrecedence = config.staticDescPrecedence, syntaxMap = config.syntaxes, lexemes = config.lexemes.flatMap(l => [l, ...(0, Lexeme_1.extrapolate)(l)]), bases = [], children = {}) {
        super(id, bases, children, lexemes);
        this.id = id;
        this.config = config;
        this.staticDescPrecedence = staticDescPrecedence;
        this.syntaxMap = syntaxMap;
        this.lexemes = lexemes;
        this.bases = bases;
        this.children = children;
        this.syntaxList = this.refreshSyntaxList();
        this.setSyntax = (macro) => {
            const syntax = (0, macroToSyntax_1.macroToSyntax)(macro);
            this.setLexeme((0, Lexeme_1.makeLexeme)({ type: 'noun', root: syntax.name, referents: [] }));
            this.syntaxMap[syntax.name] = syntax.syntax;
            this.syntaxList = this.refreshSyntaxList();
        };
        this.getSyntax = (name) => {
            var _a;
            return (_a = this.syntaxMap[name]) !== null && _a !== void 0 ? _a : [{ type: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
        };
        this.astTypes.forEach(g => {
            this.setLexeme((0, Lexeme_1.makeLexeme)({
                root: g,
                type: 'noun',
                referents: [],
            }));
        });
    }
    getLexemeTypes() {
        return this.config.lexemeTypes;
    }
    getPrelude() {
        return this.config.prelude;
    }
    refreshSyntaxList() {
        const x = Object.keys(this.syntaxMap);
        const y = x.filter(e => !this.config.staticDescPrecedence.includes(e));
        const z = y.sort((a, b) => (0, maxPrecedence_1.maxPrecedence)(b, a, this.syntaxMap));
        return this.config.staticDescPrecedence.concat(z);
    }
    getSyntaxList() {
        return this.syntaxList;
    }
    get astTypes() {
        const res = this.config.lexemeTypes;
        res.push(...this.staticDescPrecedence);
        return res;
    }
    clone() {
        return new BasicContext(this.id, this.config, this.staticDescPrecedence, this.syntaxMap, this.lexemes, this.bases, this.children);
    }
}
exports.BasicContext = BasicContext;


/***/ }),

/***/ "./app/src/backend/Context.ts":
/*!************************************!*\
  !*** ./app/src/backend/Context.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getContext = void 0;
const BasicContext_1 = __webpack_require__(/*! ./BasicContext */ "./app/src/backend/BasicContext.ts");
function getContext(opts) {
    return new BasicContext_1.BasicContext(opts.id);
}
exports.getContext = getContext;


/***/ }),

/***/ "./app/src/backend/InstructionThing.ts":
/*!*********************************************!*\
  !*** ./app/src/backend/InstructionThing.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InstructionThing = void 0;
const getIncrementalId_1 = __webpack_require__(/*! ../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/BaseThing.ts");
class InstructionThing extends BaseThing_1.BaseThing {
    constructor(value) {
        super((0, getIncrementalId_1.getIncrementalId)());
        this.value = value;
    }
    toJs() {
        return this.value;
    }
}
exports.InstructionThing = InstructionThing;


/***/ }),

/***/ "./app/src/backend/NumberThing.ts":
/*!****************************************!*\
  !*** ./app/src/backend/NumberThing.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NumberThing = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/BaseThing.ts");
class NumberThing extends BaseThing_1.BaseThing {
    constructor(value) {
        super(value + '');
        this.value = value;
    }
    toJs() {
        return this.value;
    }
}
exports.NumberThing = NumberThing;


/***/ }),

/***/ "./app/src/backend/StringThing.ts":
/*!****************************************!*\
  !*** ./app/src/backend/StringThing.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringThing = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/BaseThing.ts");
class StringThing extends BaseThing_1.BaseThing {
    constructor(value, id = value) {
        super(id);
        this.value = value;
    }
    toJs() {
        return this.value; //js sucks
    }
    clone(opts) {
        // const x = super.clone(opts)
        return new StringThing(this.value, opts === null || opts === void 0 ? void 0 : opts.id);
    }
}
exports.StringThing = StringThing;


/***/ }),

/***/ "./app/src/backend/Thing.ts":
/*!**********************************!*\
  !*** ./app/src/backend/Thing.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getThing = void 0;
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/BaseThing.ts");
function getThing(args) {
    return new BaseThing_1.BaseThing(args.id, args.bases);
}
exports.getThing = getThing;


/***/ }),

/***/ "./app/src/backend/VerbThing.ts":
/*!**************************************!*\
  !*** ./app/src/backend/VerbThing.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.logVerb = exports.VerbThing = void 0;
const evalAst_1 = __webpack_require__(/*! ./evalAst */ "./app/src/backend/evalAst.ts");
const BaseThing_1 = __webpack_require__(/*! ./BaseThing */ "./app/src/backend/BaseThing.ts");
class VerbThing extends BaseThing_1.BaseThing {
    constructor(id, instructions) {
        super(id);
        this.id = id;
        this.instructions = instructions;
    }
    run(context, args) {
        const clonedContext = context.clone();
        // inject args, remove harcoded english!
        //TOO I guess setting context on context subject results in an inf loop/max too much recursion error
        // clonedContext.set(args.subject.getId(), args.subject)
        clonedContext.set(args.object.getId(), args.object);
        clonedContext.setLexeme({ root: 'subject', type: 'adjective', referents: [args.subject] });
        clonedContext.setLexeme({ root: 'object', type: 'adjective', referents: [args.object] });
        let results = [];
        this.instructions.forEach(istruction => {
            results = (0, evalAst_1.evalAst)(clonedContext, istruction.value);
        });
        return results;
    }
}
exports.VerbThing = VerbThing;
// x is "ciao"
// y is "mondo"
// you log x and y
// you log "capra!"
// stupidize is the previous "2" instructions
// you stupidize
exports.logVerb = new (class extends VerbThing {
    run(context, args) {
        console.log(args.object.toJs());
        return [];
    }
})('log', []);


/***/ }),

/***/ "./app/src/backend/evalAst.ts":
/*!************************************!*\
  !*** ./app/src/backend/evalAst.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.evalAst = void 0;
const InstructionThing_1 = __webpack_require__(/*! ./InstructionThing */ "./app/src/backend/InstructionThing.ts");
const NumberThing_1 = __webpack_require__(/*! ./NumberThing */ "./app/src/backend/NumberThing.ts");
const StringThing_1 = __webpack_require__(/*! ./StringThing */ "./app/src/backend/StringThing.ts");
const Thing_1 = __webpack_require__(/*! ./Thing */ "./app/src/backend/Thing.ts");
const VerbThing_1 = __webpack_require__(/*! ./VerbThing */ "./app/src/backend/VerbThing.ts");
const Lexeme_1 = __webpack_require__(/*! ../frontend/lexer/Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
const parseNumber_1 = __webpack_require__(/*! ../utils/parseNumber */ "./app/src/utils/parseNumber.ts");
const Clause_1 = __webpack_require__(/*! ../middle/clauses/Clause */ "./app/src/middle/clauses/Clause.ts");
const getOwnershipChain_1 = __webpack_require__(/*! ../middle/clauses/functions/getOwnershipChain */ "./app/src/middle/clauses/functions/getOwnershipChain.ts");
const getIncrementalId_1 = __webpack_require__(/*! ../middle/id/functions/getIncrementalId */ "./app/src/middle/id/functions/getIncrementalId.ts");
function evalAst(context, ast, args = {}) {
    var _a, _b, _c, _d, _e;
    (_a = args.sideEffects) !== null && _a !== void 0 ? _a : (args.sideEffects = couldHaveSideEffects(ast));
    if (args.sideEffects) { // only cache instructions with side effects
        const instruction = new InstructionThing_1.InstructionThing(ast);
        context.set(instruction.getId(), instruction);
        context.setLexeme((0, Lexeme_1.makeLexeme)({ root: 'instruction', type: 'noun', referents: [instruction] }));
    }
    if (ast.type === 'macro') {
        context.setSyntax(ast);
        return [];
    }
    else if ((_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.copula) {
        return evalCopulaSentence(context, ast, args);
    }
    else if ((_c = ast === null || ast === void 0 ? void 0 : ast.links) === null || _c === void 0 ? void 0 : _c.verb) {
        return evalVerbSentence(context, ast, args);
    }
    else if ((_d = ast === null || ast === void 0 ? void 0 : ast.links) === null || _d === void 0 ? void 0 : _d.subconj) {
        return evalComplexSentence(context, ast, args);
    }
    else if ((_e = ast === null || ast === void 0 ? void 0 : ast.links) === null || _e === void 0 ? void 0 : _e.nonsubconj) {
        return evalCompoundSentence(context, ast, args);
    }
    else {
        return evalNounPhrase(context, ast, args);
    }
}
exports.evalAst = evalAst;
function evalCopulaSentence(context, ast, args) {
    var _a, _b, _c, _d, _e, _f;
    if (args === null || args === void 0 ? void 0 : args.sideEffects) { // assign the right value to the left value
        const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
        const subject = nounPhraseToClause((_b = ast.links) === null || _b === void 0 ? void 0 : _b.subject, { subject: subjectId }).simple;
        const rVal = evalAst(context, (_c = ast.links) === null || _c === void 0 ? void 0 : _c.predicate, { subject: subjectId });
        const ownerChain = (0, getOwnershipChain_1.getOwnershipChain)(subject);
        const maps = context.query(subject);
        const lexemes = subject.flatList().map(x => x.predicate).filter(x => x);
        const lexemesWithReferent = lexemes.map(x => (Object.assign(Object.assign({}, x), { referents: rVal })));
        if (rVal.every(x => x instanceof InstructionThing_1.InstructionThing)) {
            // console.log('making verb!')
            const verb = new VerbThing_1.VerbThing((0, getIncrementalId_1.getIncrementalId)(), rVal);
            context.set(verb.getId(), verb);
            const lexemesWithReferent = lexemes.map(x => (Object.assign(Object.assign({}, x), { referents: [verb], type: 'verb' })));
            lexemesWithReferent.forEach(x => context.setLexeme(x));
            return [verb];
        }
        // console.log('subject=', subject.toString(), 'rVal=', rVal, 'ownerChain=', ownerChain, 'maps=', maps)
        if (!maps.length && ownerChain.length <= 1) { // lVal is completely new
            lexemesWithReferent.forEach(x => context.setLexeme(x));
            rVal.forEach(x => context.set(x.getId(), x));
            return rVal;
        }
        if (maps.length && ownerChain.length <= 1) { // reassignment
            lexemes.forEach(x => context.removeLexeme(x.root));
            lexemesWithReferent.forEach(x => context.setLexeme(x));
            rVal.forEach(x => context.set(x.getId(), x));
            return rVal;
        }
        if (ownerChain.length > 1) { // lVal is property of existing object
            const aboutOwner = about(subject, ownerChain.at(-2));
            const owners = getInterestingIds(context.query(aboutOwner), aboutOwner).map(id => context.get(id)).filter(x => x);
            const owner = owners.at(0);
            const rValClone = rVal.map(x => x.clone({ id: (owner === null || owner === void 0 ? void 0 : owner.getId()) + '.' + x.getId() }));
            const lexemesWithCloneReferent = lexemes.map(x => (Object.assign(Object.assign({}, x), { referents: rValClone })));
            lexemesWithCloneReferent.forEach(x => context.setLexeme(x));
            rValClone.forEach(x => owner === null || owner === void 0 ? void 0 : owner.set(x.getId(), x));
            return rValClone;
        }
    }
    else { // compare the right and left values
        const subject = evalAst(context, (_d = ast.links) === null || _d === void 0 ? void 0 : _d.subject, args).at(0);
        const predicate = evalAst(context, (_e = ast.links) === null || _e === void 0 ? void 0 : _e.predicate, args).at(0);
        return (subject === null || subject === void 0 ? void 0 : subject.equals(predicate)) && (!((_f = ast.links) === null || _f === void 0 ? void 0 : _f.negation)) ? [new NumberThing_1.NumberThing(1)] : [];
    }
    console.log('problem with copula sentence!');
    return [];
}
function about(clause, entity) {
    return clause.flatList().filter(x => x.entities.includes(entity) && x.entities.length <= 1).reduce((a, b) => a.and(b), Clause_1.emptyClause).simple;
}
function evalVerbSentence(context, ast, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const verb = (_c = (_b = (_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.verb) === null || _b === void 0 ? void 0 : _b.lexeme) === null || _c === void 0 ? void 0 : _c.referents.at(0);
    const complements = (_e = (_d = ast.links) === null || _d === void 0 ? void 0 : _d['complement']) !== null && _e !== void 0 ? _e : [];
    const subject = ((_f = ast.links) === null || _f === void 0 ? void 0 : _f.subject) ? evalAst(context, (_g = ast.links) === null || _g === void 0 ? void 0 : _g.subject).at(0) : undefined;
    const object = ((_h = ast.links) === null || _h === void 0 ? void 0 : _h.object) ? evalAst(context, (_j = ast.links) === null || _j === void 0 ? void 0 : _j.object).at(0) : undefined;
    // console.log('verb=', verb)
    // console.log('subject=', subject)
    // console.log('object=', object)
    // console.log('complements=', complements)
    if (!verb) {
        throw new Error('no such verb ' + ((_m = (_l = (_k = ast === null || ast === void 0 ? void 0 : ast.links) === null || _k === void 0 ? void 0 : _k.verb) === null || _l === void 0 ? void 0 : _l.lexeme) === null || _m === void 0 ? void 0 : _m.root));
    }
    return verb.run(context, { subject: subject !== null && subject !== void 0 ? subject : context, object: object !== null && object !== void 0 ? object : context });
    // return object.flatMap(o => verb?.run(context, { object: o, subject: {} as Thing }) ?? [])
    // objects.forEach(o => verb?.run(context, { object: o, subject: {} as Thing }))
    // return []
}
function evalComplexSentence(context, ast, args) {
    var _a, _b, _c;
    if (((_c = (_b = (_a = ast.links) === null || _a === void 0 ? void 0 : _a.subconj) === null || _b === void 0 ? void 0 : _b.lexeme) === null || _c === void 0 ? void 0 : _c.root) === 'if') {
        if (evalAst(context, ast.links.condition, Object.assign(Object.assign({}, args), { sideEffects: false })).length) {
            evalAst(context, ast.links.consequence, Object.assign(Object.assign({}, args), { sideEffects: true }));
        }
    }
    return [];
}
function evalCompoundSentence(context, ast, args) {
    throw new Error('compound sentence!');
}
function evalNounPhrase(context, ast, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const np = nounPhraseToClause(ast, args);
    const maps = context.query(np); // TODO: intra-sentence anaphora resolution
    const interestingIds = getInterestingIds(maps, np);
    let things;
    if ((_c = (_b = (_a = ast.links) === null || _a === void 0 ? void 0 : _a.subject) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.some(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.quote; })) {
        things = evalString(context, (_e = (_d = ast.links) === null || _d === void 0 ? void 0 : _d.subject) === null || _e === void 0 ? void 0 : _e.list[0], args);
    }
    else {
        things = interestingIds.map(id => context.get(id)).filter(x => x).map(x => x); // TODO sort by id
    }
    const mathExpression = ast.links['math-expression'];
    if (mathExpression) {
        const left = things;
        const op = (_g = (_f = mathExpression.links) === null || _f === void 0 ? void 0 : _f.operator) === null || _g === void 0 ? void 0 : _g.lexeme;
        const right = evalAst(context, mathExpression.links['noun-phrase']);
        return evalOperation(left, right, op);
    }
    if (isAstPlural(ast) || getAndPhrase(ast)) { // if universal quantified, I don't care if there's no match
        const limit = (_h = ast.links['limit-phrase']) === null || _h === void 0 ? void 0 : _h.links.string; //TODO!
        const limitNum = (_j = evalString(context, limit, args).at(0)) === null || _j === void 0 ? void 0 : _j.toJs();
        return things.slice(0, limitNum !== null && limitNum !== void 0 ? limitNum : things.length);
    }
    if (things.length) { // non-plural, return single existing Thing
        return things.slice(0, 1);
    }
    // or else create and returns the Thing
    return (args === null || args === void 0 ? void 0 : args.autovivification) ? [createThing(np)] : [];
}
function evalOperation(left, right, op) {
    const sums = left.map(x => { var _a; return x.toJs() + ((_a = right.at(0)) === null || _a === void 0 ? void 0 : _a.toJs()); });
    return sums.map(x => new NumberThing_1.NumberThing(x));
}
function nounPhraseToClause(ast, args) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const adjectives = ((_d = (_c = (_b = ast === null || ast === void 0 ? void 0 : ast.links) === null || _b === void 0 ? void 0 : _b.adjective) === null || _c === void 0 ? void 0 : _c.list) !== null && _d !== void 0 ? _d : []).map(x => x.lexeme).filter(x => x).map(x => (0, Clause_1.clauseOf)(x, subjectId)).reduce((a, b) => a.and(b), Clause_1.emptyClause);
    const nouns = ((_g = (_f = (_e = ast === null || ast === void 0 ? void 0 : ast.links) === null || _e === void 0 ? void 0 : _e.subject) === null || _f === void 0 ? void 0 : _f.list) !== null && _g !== void 0 ? _g : []).map(x => x.lexeme).filter(x => x).map(x => (0, Clause_1.clauseOf)(x, subjectId)).reduce((a, b) => a.and(b), Clause_1.emptyClause);
    const genitiveComplement = Object.values((_h = ast === null || ast === void 0 ? void 0 : ast.links) !== null && _h !== void 0 ? _h : {}).filter(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.owner; }).at(0);
    const genitiveComplementClause = genitiveToClause(genitiveComplement, { subject: subjectId, autovivification: false, sideEffects: false });
    const andPhrase = evalAndPhrase(getAndPhrase(ast), args);
    //TODO: relative clauses
    return adjectives.and(nouns).and(genitiveComplementClause).and(andPhrase);
}
function getAndPhrase(np) {
    var _a;
    return (_a = np === null || np === void 0 ? void 0 : np.links) === null || _a === void 0 ? void 0 : _a['and-phrase']; //TODO!
}
function evalAndPhrase(andPhrase, args) {
    var _a;
    if (!andPhrase) {
        return Clause_1.emptyClause;
    }
    return nounPhraseToClause((_a = andPhrase === null || andPhrase === void 0 ? void 0 : andPhrase.links) === null || _a === void 0 ? void 0 : _a['noun-phrase'] /* TODO! */); // maybe problem if multiple things have same id, query is not gonna find them
}
function genitiveToClause(ast, args) {
    var _a, _b, _c;
    if (!ast) {
        return Clause_1.emptyClause;
    }
    const ownedId = args === null || args === void 0 ? void 0 : args.subject;
    const ownerId = (0, getIncrementalId_1.getIncrementalId)();
    const genitiveParticle = (_b = (_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a["genitive-particle"]) === null || _b === void 0 ? void 0 : _b.lexeme;
    const owner = nounPhraseToClause((_c = ast === null || ast === void 0 ? void 0 : ast.links) === null || _c === void 0 ? void 0 : _c.owner, { subject: ownerId, autovivification: false, sideEffects: false });
    return (0, Clause_1.clauseOf)(genitiveParticle, ownedId, ownerId).and(owner);
}
function relativeClauseToClause(ast, args) {
    return Clause_1.emptyClause; //TODO!
}
function isAstPlural(ast) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const x = ((_c = (_b = (_a = ast === null || ast === void 0 ? void 0 : ast.links) === null || _a === void 0 ? void 0 : _a.noun) === null || _b === void 0 ? void 0 : _b.list) === null || _c === void 0 ? void 0 : _c.some(x => x.lexeme && (0, Lexeme_1.isPlural)(x.lexeme)))
        || ((_f = (_e = (_d = ast === null || ast === void 0 ? void 0 : ast.links) === null || _d === void 0 ? void 0 : _d.adjective) === null || _e === void 0 ? void 0 : _e.list) === null || _f === void 0 ? void 0 : _f.some(x => x.lexeme && (0, Lexeme_1.isPlural)(x.lexeme)))
        || ((_j = (_h = (_g = ast === null || ast === void 0 ? void 0 : ast.links) === null || _g === void 0 ? void 0 : _g.subject) === null || _h === void 0 ? void 0 : _h.list) === null || _j === void 0 ? void 0 : _j.some(x => x.lexeme && (0, Lexeme_1.isPlural)(x.lexeme)))
        || ((_k = ast === null || ast === void 0 ? void 0 : ast.links) === null || _k === void 0 ? void 0 : _k.uniquant);
    if (x) {
        return true;
    }
    return Object.values((_l = ast === null || ast === void 0 ? void 0 : ast.links) !== null && _l !== void 0 ? _l : {}).concat((_m = ast === null || ast === void 0 ? void 0 : ast.list) !== null && _m !== void 0 ? _m : []).some(x => isAstPlural(x));
}
function getInterestingIds(maps, clause) {
    // the ones with most dots, because "color of style of button" 
    // has buttonId.style.color and that's the object the sentence should resolve to
    // possible problem if "color of button AND button"
    // const ids = maps.flatMap(x => Object.values(x))
    // const maxLen = Math.max(...ids.map(x => getNumberOfDots(x)))
    // return ids.filter(x => getNumberOfDots(x) === maxLen)
    const oc = (0, getOwnershipChain_1.getOwnershipChain)(clause);
    if (oc.length <= 1) {
        return maps.flatMap(x => Object.values(x)); //all
    }
    // TODO: problem not returning everything because of getOwnershipChain()
    return maps.flatMap(m => m[oc.at(-1)]); // owned leaf
}
const getNumberOfDots = (id) => id.split('.').length; //-1
function createThing(clause) {
    const bases = clause.flatList().map(x => { var _a, _b; return (_b = (_a = x.predicate) === null || _a === void 0 ? void 0 : _a.referents) === null || _b === void 0 ? void 0 : _b[0]; }) /* ONLY FIRST? */.filter(x => x);
    const id = (0, getIncrementalId_1.getIncrementalId)();
    return (0, Thing_1.getThing)({ id, bases });
}
function evalString(context, ast, args) {
    var _a, _b, _c;
    const x = (_c = (_b = (_a = Object.values(Object.assign(Object.assign({}, ast === null || ast === void 0 ? void 0 : ast.links), { 'quote': undefined })).filter(x => x).at(0)) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.map(x => { var _a; return (_a = x.lexeme) === null || _a === void 0 ? void 0 : _a.token; })) !== null && _c !== void 0 ? _c : [];
    const y = x.join(' ');
    const z = (0, parseNumber_1.parseNumber)(y);
    if (z) {
        return [new NumberThing_1.NumberThing(z)];
    }
    if (!y.length) {
        return [];
    }
    return [new StringThing_1.StringThing(y)];
}
function couldHaveSideEffects(ast) {
    var _a, _b, _c;
    if (ast.type === 'macro') { // this is not ok, it's here just for performance reasons (saving all of the macros is currently expensive) 
        return false;
    }
    return !!(((_a = ast.links) === null || _a === void 0 ? void 0 : _a.copula) || ((_b = ast.links) === null || _b === void 0 ? void 0 : _b.verb) || ((_c = ast.links) === null || _c === void 0 ? void 0 : _c.subconj));
}


/***/ }),

/***/ "./app/src/config/Config.ts":
/*!**********************************!*\
  !*** ./app/src/config/Config.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getConfig = void 0;
const lexemes_1 = __webpack_require__(/*! ./lexemes */ "./app/src/config/lexemes.ts");
const LexemeType_1 = __webpack_require__(/*! ./LexemeType */ "./app/src/config/LexemeType.ts");
const prelude_1 = __webpack_require__(/*! ./prelude */ "./app/src/config/prelude.ts");
const syntaxes_1 = __webpack_require__(/*! ./syntaxes */ "./app/src/config/syntaxes.ts");
function getConfig() {
    return {
        lexemeTypes: LexemeType_1.lexemeTypes,
        lexemes: lexemes_1.lexemes,
        syntaxes: syntaxes_1.syntaxes,
        prelude: prelude_1.prelude,
        staticDescPrecedence: syntaxes_1.staticDescPrecedence,
        // things,
    };
}
exports.getConfig = getConfig;


/***/ }),

/***/ "./app/src/config/LexemeType.ts":
/*!**************************************!*\
  !*** ./app/src/config/LexemeType.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemeTypes = void 0;
const stringLiterals_1 = __webpack_require__(/*! ../utils/stringLiterals */ "./app/src/utils/stringLiterals.ts");
exports.lexemeTypes = (0, stringLiterals_1.stringLiterals)('adjective', 'copula', 'defart', 'indefart', 'fullstop', 'hverb', 'verb', 'negation', 'existquant', 'uniquant', 'relpron', 'negation', 'noun', 'preposition', 'subconj', 'nonsubconj', // and
'disjunc', // or
'pronoun', 'quote', 'makro-keyword', 'except-keyword', 'then-keyword', 'end-keyword', 'genitive-particle', 'dative-particle', 'ablative-particle', 'locative-particle', 'instrumental-particle', 'comitative-particle', 'next-keyword', 'previous-keyword', 'plus-operator');


/***/ }),

/***/ "./app/src/config/lexemes.ts":
/*!***********************************!*\
  !*** ./app/src/config/lexemes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lexemes = void 0;
exports.lexemes = [
    { root: 'be', type: 'copula', referents: [] },
    { root: 'be', type: 'copula', token: 'is', cardinality: 1, referents: [] },
    { root: 'be', type: 'copula', token: 'are', cardinality: '*', referents: [] },
    { root: 'do', type: 'hverb', referents: [] },
    { root: 'do', type: 'hverb', token: 'does', cardinality: 1, referents: [] },
    { root: 'have', type: 'verb', referents: [] },
    { root: 'not', type: 'negation', referents: [] },
    // logical roles of a constituent to abstract away word order
    { root: 'subject', type: 'adjective', referents: [] },
    { root: 'predicate', type: 'adjective', referents: [] },
    { root: 'object', type: 'adjective', referents: [] },
    { root: 'condition', type: 'adjective', referents: [] },
    { root: 'consequence', type: 'adjective', referents: [] },
    { root: 'owner', type: 'adjective', referents: [] },
    { root: 'receiver', type: 'adjective', referents: [] },
    { root: 'origin', type: 'adjective', referents: [] },
    { root: 'location', type: 'adjective', referents: [] },
    { root: 'instrument', type: 'adjective', referents: [] },
    { root: 'companion', type: 'adjective', referents: [] },
    // role of math operator
    { root: 'operator', type: 'adjective', referents: [] },
    // number of times a constituent can appear
    { root: 'optional', type: 'adjective', cardinality: '1|0', referents: [] },
    { root: 'one-or-more', type: 'adjective', cardinality: '+', referents: [] },
    { root: 'zero-or-more', type: 'adjective', cardinality: '*', referents: [] },
    // for use in a part of noun-phrase
    { root: 'next', type: 'next-keyword', referents: [] },
    { root: 'previous', type: 'previous-keyword', referents: [] },
    { root: 'or', type: 'disjunc', referents: [] },
    { root: 'and', type: 'nonsubconj', referents: [] },
    { root: 'a', type: 'indefart', referents: [] },
    { root: 'an', type: 'indefart', referents: [] },
    { root: 'the', type: 'defart', referents: [] },
    { root: 'if', type: 'subconj', referents: [] },
    { root: 'when', type: 'subconj', referents: [] },
    { root: 'every', type: 'uniquant', referents: [] },
    { root: 'any', type: 'uniquant', referents: [] },
    { root: 'that', type: 'relpron', referents: [] },
    { root: 'it', type: 'pronoun', referents: [] },
    { root: '"', type: 'quote', referents: [] },
    { root: '.', type: 'fullstop', referents: [] },
    { root: 'then', type: 'then-keyword', referents: [] },
    { root: 'except', type: 'except-keyword', referents: [] },
    { root: 'makro', type: 'makro-keyword', referents: [] },
    { root: 'end', type: 'end-keyword', referents: [] },
    { root: 'of', type: 'genitive-particle', referents: [] },
    { root: 'to', type: 'dative-particle', referents: [] },
    { root: 'from', type: 'ablative-particle', referents: [] },
    { root: 'on', type: 'locative-particle', referents: [] },
    { root: 'in', type: 'locative-particle', referents: [] },
    { root: 'at', type: 'locative-particle', referents: [] },
    { root: 'by', type: 'instrumental-particle', referents: [] },
    { root: 'with', type: 'comitative-particle', referents: [] },
    { root: '+', type: 'plus-operator', referents: [] },
];


/***/ }),

/***/ "./app/src/config/prelude.ts":
/*!***********************************!*\
  !*** ./app/src/config/prelude.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prelude = void 0;
exports.prelude = `
  makro 
    any-lexeme is adjective 
            or copula 
            or defart 
            or indefart 
            or fullstop 
            or hverb 
            or verb 
            or negation 
            or existquant 
            or uniquant 
            or relpron 
            or negation 
            or noun 
            or preposition 
            or subconj 
            or nonsubconj 
            or disjunc 
            or pronoun 
            or then-keyword
            or makro-keyword 
            or except-keyword 
            or quote
  end.
  
  makro 
    quantifier is uniquant or existquant 
  end.

  makro 
    article is indefart or defart 
  end.

  makro
    genitive-complement is genitive-particle then owner noun-phrase
  end.

  makro
    dative-complement is dative-particle then receiver noun-phrase
  end.

  makro
    ablative-complement is ablative-particle then origin noun-phrase
  end.

  makro
    locative-complement is locative-particle then location noun-phrase
  end.

  makro
    instrumental-complement is instrumental-particle then instrument noun-phrase
  end.

  makro
    comitative-complement is comitative-particle then companion noun-phrase
  end.

  makro 
    complement is 
    genitive-complement or 
    dative-complement or
    ablative-complement or
    locative-complement or
    instrumental-complement or
    comitative-complement
  end.

  makro 
    copula-sentence is subject noun-phrase 
      then copula 
      then optional negation 
      then predicate noun-phrase 
  end.

  makro
    and-phrase is nonsubconj then noun-phrase
  end.

  makro
    limit-phrase is next-keyword or previous-keyword then optional string
  end.

  makro
    math-expression is operator plus-operator then noun-phrase
  end.

  makro 
    noun-phrase is optional quantifier 
      then optional article 
      then zero-or-more adjectives
      then optional limit-phrase 
      then zero-or-more subject noun or pronoun or string
      then optional math-expression
      then optional subclause
      then optional genitive-complement
      then optional and-phrase
  end.

  makro 
    copulasubclause is relpron then copula then predicate noun-phrase 
  end.

  makro 
    mverbsubclause is relpron then verb then object noun-phrase 
  end.

  makro 
    subclause is copulasubclause or mverbsubclause 
  end.

  makro 
    verb-sentence is subject noun-phrase 
      then optional hverb 
      then optional negation 
      then verb 
      then optional object noun-phrase
      then zero-or-more complements
  end.

  makro 
    simple-sentence is copula-sentence or verb-sentence 
  end.

  makro 
  complex-sentence-1 is subconj 
      then condition simple-sentence 
      then then-keyword
      then consequence simple-sentence
  end.

  makro 
    complex-sentence-2 is consequence simple-sentence 
      then subconj 
      then condition simple-sentence
  end.

  makro 
    string is quote then one-or-more any-lexeme except quote then quote 
  end.

  `;


/***/ }),

/***/ "./app/src/config/syntaxes.ts":
/*!************************************!*\
  !*** ./app/src/config/syntaxes.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.syntaxes = exports.staticDescPrecedence = exports.constituentTypes = void 0;
const stringLiterals_1 = __webpack_require__(/*! ../utils/stringLiterals */ "./app/src/utils/stringLiterals.ts");
exports.constituentTypes = (0, stringLiterals_1.stringLiterals)('macro', 'macropart', 'taggedunion', 'exceptunion');
exports.staticDescPrecedence = ['macro'];
exports.syntaxes = {
    'macro': [
        { type: ['makro-keyword'], number: 1 },
        { type: ['noun'], number: 1, role: 'subject' },
        { type: ['copula'], number: 1 },
        { type: ['macropart'], number: '+' },
        { type: ['end-keyword'], number: 1 },
    ],
    'macropart': [
        { type: ['adjective'], number: '*' },
        { type: ['taggedunion'], number: '+' },
        { type: ['exceptunion'], number: '1|0' },
        { type: ['then-keyword'], number: '1|0' },
    ],
    'taggedunion': [
        { type: ['noun'], number: 1 },
        { type: ['disjunc'], number: '1|0' },
    ],
    'exceptunion': [
        { type: ['except-keyword'], number: 1 },
        { type: ['taggedunion'], number: '+' },
    ]
};


/***/ }),

/***/ "./app/src/draw-ast/AstCanvas.ts":
/*!***************************************!*\
  !*** ./app/src/draw-ast/AstCanvas.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AstCanvas = void 0;
const plotAst_1 = __webpack_require__(/*! ./plotAst */ "./app/src/draw-ast/plotAst.ts");
class AstCanvas {
    constructor() {
        this.div = document.createElement('div');
        this.canvas = document.createElement('canvas');
        this.cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.replot = () => {
            window.requestAnimationFrame(() => {
                var _a, _b, _c;
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                (_a = this.context) === null || _a === void 0 ? void 0 : _a.translate(window.innerWidth / 2, window.innerHeight / 2);
                (_b = this.context) === null || _b === void 0 ? void 0 : _b.translate(-window.innerWidth / 2 + this.cameraOffset.x, -window.innerHeight / 2 + this.cameraOffset.y);
                (_c = this.context) === null || _c === void 0 ? void 0 : _c.clearRect(0, 0, window.innerWidth, window.innerHeight);
                if (!this.context) {
                    throw new Error('Canvas context is undefined!');
                }
                if (!this.ast) {
                    throw new Error('Ast is is undefined!');
                }
                (0, plotAst_1.plotAst)(this.context, this.ast);
            });
        };
        this.div.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', e => {
            this.isDragging = true;
            this.dragStart.x = e.x - this.cameraOffset.x;
            this.dragStart.y = e.y - this.cameraOffset.y;
        });
        this.canvas.addEventListener('mouseup', e => this.isDragging = false);
        this.canvas.addEventListener('mousemove', e => {
            if (this.isDragging) {
                this.cameraOffset.x = e.clientX - this.dragStart.x;
                this.cameraOffset.y = e.clientY - this.dragStart.y;
                this.replot();
            }
        });
    }
    onUpdate(ast, results) {
        this.ast = ast;
        this.replot();
    }
}
exports.AstCanvas = AstCanvas;


/***/ }),

/***/ "./app/src/draw-ast/astToEdgeList.ts":
/*!*******************************************!*\
  !*** ./app/src/draw-ast/astToEdgeList.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.astToEdgeList = void 0;
function astToEdgeList(ast, parentName, edges = []) {
    var _a, _b, _c;
    const astName = ((_c = (_a = ast.role) !== null && _a !== void 0 ? _a : (_b = ast.lexeme) === null || _b === void 0 ? void 0 : _b.root) !== null && _c !== void 0 ? _c : ast.type) + random();
    const additions = [];
    if (parentName) {
        additions.push([parentName, astName]);
    }
    if (!ast.links && !ast.list) { // leaf!
        return [...edges, ...additions];
    }
    if (ast.links) {
        return Object
            .entries(ast.links)
            .flatMap(e => {
            const ezero = e[0] + random();
            return [...additions, [astName, ezero], ...astToEdgeList(e[1], ezero, edges)];
        });
    }
    if (ast.list) {
        const list = ast.list.flatMap(x => astToEdgeList(x, astName, edges));
        return [...additions, ...edges, ...list];
    }
    return [];
}
exports.astToEdgeList = astToEdgeList;
function random() {
    return parseInt(100000 * Math.random() + '');
}


/***/ }),

/***/ "./app/src/draw-ast/drawLine.ts":
/*!**************************************!*\
  !*** ./app/src/draw-ast/drawLine.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.drawLine = void 0;
function drawLine(context, from, to) {
    context.beginPath();
    // context.strokeStyle = fromNode.strokeStyle
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
}
exports.drawLine = drawLine;


/***/ }),

/***/ "./app/src/draw-ast/drawNode.ts":
/*!**************************************!*\
  !*** ./app/src/draw-ast/drawNode.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.drawNode = void 0;
function drawNode(context, node) {
    context.beginPath();
    context.fillStyle = node.fillStyle;
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
    context.strokeStyle = node.strokeStyle;
    context.fillStyle = node.fillStyle;
    context.stroke();
    context.fill();
    context.fillStyle = "#FF0000";
    context.font = "10px Arial"; //20px
    const textOffset = 10 * node.label.length / 2; //some magic in here!
    context.fillText(node.label, node.x - textOffset, node.y);
}
exports.drawNode = drawNode;


/***/ }),

/***/ "./app/src/draw-ast/getCoords.ts":
/*!***************************************!*\
  !*** ./app/src/draw-ast/getCoords.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCoords = void 0;
const uniq_1 = __webpack_require__(/*! ../utils/uniq */ "./app/src/utils/uniq.ts");
function getCoords(initialPos, data, oldCoords = {}, nestingFactor = 1) {
    var _a;
    const root = getRoot(data); // node w/out a parent
    if (!root) {
        return oldCoords;
    }
    const children = getChildrenOf(root, data);
    const rootPos = (_a = oldCoords[root]) !== null && _a !== void 0 ? _a : initialPos;
    const yOffset = 50;
    const xOffset = 200;
    const childCoords = children
        .map((c, i) => ({ [c]: { x: rootPos.x + i * nestingFactor * xOffset * (i % 2 == 0 ? 1 : -1), y: rootPos.y + yOffset * (nestingFactor + 1) } }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
    const remainingData = data.filter(x => !x.includes(root));
    const partialResult = Object.assign(Object.assign(Object.assign({}, oldCoords), childCoords), { [root]: rootPos });
    return getCoords(initialPos, remainingData, partialResult, 0.9 * nestingFactor);
}
exports.getCoords = getCoords;
function getRoot(edges) {
    return edges
        .flat() // the nodes
        .filter(n => !edges.some(e => e[1] === n))[0];
}
function getChildrenOf(parent, edges) {
    return (0, uniq_1.uniq)(edges.filter(x => x[0] === parent).map(x => x[1])); //TODO duplicate children aren't plotted twice, but still make the graph uglier because they add "i" indeces in childCoords computation and make single child display NOT straight down.
}


/***/ }),

/***/ "./app/src/draw-ast/plotAst.ts":
/*!*************************************!*\
  !*** ./app/src/draw-ast/plotAst.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.plotAst = void 0;
const astToEdgeList_1 = __webpack_require__(/*! ./astToEdgeList */ "./app/src/draw-ast/astToEdgeList.ts");
const drawLine_1 = __webpack_require__(/*! ./drawLine */ "./app/src/draw-ast/drawLine.ts");
const drawNode_1 = __webpack_require__(/*! ./drawNode */ "./app/src/draw-ast/drawNode.ts");
const getCoords_1 = __webpack_require__(/*! ./getCoords */ "./app/src/draw-ast/getCoords.ts");
function plotAst(context, ast) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const rect = context.canvas.getBoundingClientRect();
    const edges = (0, astToEdgeList_1.astToEdgeList)(ast);
    const coords = (0, getCoords_1.getCoords)({ x: rect.x - rect.width / 2, y: rect.y }, edges);
    Object.entries(coords).forEach(c => {
        const name = c[0];
        const pos = c[1];
        (0, drawNode_1.drawNode)(context, {
            x: pos.x,
            y: pos.y,
            radius: 2,
            fillStyle: '#22cccc',
            strokeStyle: '#009999',
            label: name.replaceAll(/\d+/g, '')
        });
    });
    edges.forEach(e => {
        const from = coords[e[0]];
        const to = coords[e[1]];
        if (from && to) {
            (0, drawLine_1.drawLine)(context, from, to);
        }
    });
}
exports.plotAst = plotAst;


/***/ }),

/***/ "./app/src/facade/BasicBrain.ts":
/*!**************************************!*\
  !*** ./app/src/facade/BasicBrain.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Context_1 = __webpack_require__(/*! ../backend/Context */ "./app/src/backend/Context.ts");
const VerbThing_1 = __webpack_require__(/*! ../backend/VerbThing */ "./app/src/backend/VerbThing.ts");
const Parser_1 = __webpack_require__(/*! ../frontend/parser/interfaces/Parser */ "./app/src/frontend/parser/interfaces/Parser.ts");
const evalAst_1 = __webpack_require__(/*! ../backend/evalAst */ "./app/src/backend/evalAst.ts");
class BasicBrain {
    constructor() {
        this.context = (0, Context_1.getContext)({ id: 'global' });
        this.listeners = [];
        this.execute(this.context.getPrelude());
        this.context.set(VerbThing_1.logVerb.getId(), VerbThing_1.logVerb);
        this.context.setLexeme({ root: 'log', type: 'verb', referents: [VerbThing_1.logVerb] });
    }
    execute(natlang) {
        return natlang.split('.').flatMap(x => {
            return (0, Parser_1.getParser)(x, this.context).parseAll().flatMap(ast => {
                let results = [];
                try {
                    results = (0, evalAst_1.evalAst)(this.context, ast);
                }
                catch (e) {
                    console.warn(e);
                }
                this.listeners.forEach(l => {
                    l.onUpdate(ast, results);
                });
                return results;
            });
        });
    }
    executeUnwrapped(natlang) {
        return this.execute(natlang).map(x => x.toJs());
    }
    addListener(listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener);
        }
    }
}
exports["default"] = BasicBrain;


/***/ }),

/***/ "./app/src/facade/Brain.ts":
/*!*********************************!*\
  !*** ./app/src/facade/Brain.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBrain = void 0;
const BasicBrain_1 = __importDefault(__webpack_require__(/*! ./BasicBrain */ "./app/src/facade/BasicBrain.ts"));
function getBrain() {
    return new BasicBrain_1.default();
}
exports.getBrain = getBrain;


/***/ }),

/***/ "./app/src/frontend/lexer/EagerLexer.ts":
/*!**********************************************!*\
  !*** ./app/src/frontend/lexer/EagerLexer.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Lexeme_1 = __webpack_require__(/*! ./Lexeme */ "./app/src/frontend/lexer/Lexeme.ts");
class EagerLexer {
    constructor(sourceCode, context) {
        this.sourceCode = sourceCode;
        this.context = context;
        this.tokens = [];
        this._pos = 0;
        this.words =
            spaceOut(sourceCode, ['"', '.'])
                .trim()
                .split(/\s+/);
        this.refreshTokens();
    }
    refreshTokens() {
        this.tokens = this.words.map(w => { var _a; return (_a = this.context.getLexemes(w).at(0)) !== null && _a !== void 0 ? _a : (0, Lexeme_1.makeLexeme)({ root: w, token: w, type: 'noun', referents: [] }); });
    }
    next() {
        this.refreshTokens();
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
    get isEnd() {
        return this.pos >= this.tokens.length;
    }
}
exports["default"] = EagerLexer;
function spaceOut(sourceCode, specialChars) {
    return sourceCode
        .split('')
        .reduce((a, c) => a + (specialChars.includes(c) ? ' ' + c + ' ' : c), '');
}


/***/ }),

/***/ "./app/src/frontend/lexer/Lexeme.ts":
/*!******************************************!*\
  !*** ./app/src/frontend/lexer/Lexeme.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extrapolate = exports.isPlural = exports.makeLexeme = void 0;
const Cardinality_1 = __webpack_require__(/*! ../parser/interfaces/Cardinality */ "./app/src/frontend/parser/interfaces/Cardinality.ts");
const pluralize_1 = __webpack_require__(/*! ./functions/pluralize */ "./app/src/frontend/lexer/functions/pluralize.ts");
const conjugate_1 = __webpack_require__(/*! ./functions/conjugate */ "./app/src/frontend/lexer/functions/conjugate.ts");
function makeLexeme(data) {
    return data;
}
exports.makeLexeme = makeLexeme;
function isPlural(lexeme) {
    return (0, Cardinality_1.isRepeatable)(lexeme.cardinality);
}
exports.isPlural = isPlural;
function extrapolate(lexeme, context) {
    if (lexeme.type === 'noun' && !isPlural(lexeme)) {
        return [makeLexeme({
                root: lexeme.root,
                type: lexeme.type,
                token: (0, pluralize_1.pluralize)(lexeme.root),
                cardinality: '*',
                referents: lexeme.referents
            })];
    }
    if (lexeme.type === 'verb') {
        return (0, conjugate_1.conjugate)(lexeme.root).map(x => makeLexeme({
            root: lexeme.root,
            type: lexeme.type,
            token: x,
            referents: lexeme.referents
        }));
    }
    return [];
}
exports.extrapolate = extrapolate;


/***/ }),

/***/ "./app/src/frontend/lexer/Lexer.ts":
/*!*****************************************!*\
  !*** ./app/src/frontend/lexer/Lexer.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getLexer = void 0;
const EagerLexer_1 = __importDefault(__webpack_require__(/*! ./EagerLexer */ "./app/src/frontend/lexer/EagerLexer.ts"));
function getLexer(sourceCode, context) {
    return new EagerLexer_1.default(sourceCode, context);
}
exports.getLexer = getLexer;


/***/ }),

/***/ "./app/src/frontend/lexer/functions/conjugate.ts":
/*!*******************************************************!*\
  !*** ./app/src/frontend/lexer/functions/conjugate.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.conjugate = void 0;
function conjugate(verb) {
    return [verb + 's'];
}
exports.conjugate = conjugate;


/***/ }),

/***/ "./app/src/frontend/lexer/functions/pluralize.ts":
/*!*******************************************************!*\
  !*** ./app/src/frontend/lexer/functions/pluralize.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pluralize = void 0;
function pluralize(root) {
    return root + 's';
}
exports.pluralize = pluralize;


/***/ }),

/***/ "./app/src/frontend/parser/KoolParser.ts":
/*!***********************************************!*\
  !*** ./app/src/frontend/parser/KoolParser.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KoolParser = void 0;
const Cardinality_1 = __webpack_require__(/*! ./interfaces/Cardinality */ "./app/src/frontend/parser/interfaces/Cardinality.ts");
const Lexer_1 = __webpack_require__(/*! ../lexer/Lexer */ "./app/src/frontend/lexer/Lexer.ts");
class KoolParser {
    constructor(sourceCode, context, lexer = (0, Lexer_1.getLexer)(sourceCode, context)) {
        this.sourceCode = sourceCode;
        this.context = context;
        this.lexer = lexer;
        this.knownParse = (name, role) => {
            const members = this.context.getSyntax(name);
            if (members.length === 1 && members[0].type.every(t => this.isLeaf(t))) {
                return this.parseLeaf(members[0]);
            }
            else {
                return this.parseComposite(name, role);
            }
        };
        this.parseLeaf = (m) => {
            if (m.type.includes(this.lexer.peek.type)) {
                const x = this.lexer.peek;
                this.lexer.next();
                return { type: x.type, lexeme: x };
            }
        };
        this.parseComposite = (name, role) => {
            var _a;
            const links = {};
            for (const m of this.context.getSyntax(name)) {
                const ast = this.parseMember(m);
                if (!ast && (0, Cardinality_1.isNecessary)(m.number)) {
                    return undefined;
                }
                if (!ast) {
                    continue;
                }
                links[(_a = m.role) !== null && _a !== void 0 ? _a : ast.type] = ast;
            }
            if (Object.keys(links).length <= 0) {
                return undefined;
            }
            return {
                type: name,
                role: role,
                links: links
            };
        };
        this.parseMember = (m, role) => {
            const list = [];
            while (!this.lexer.isEnd) {
                if (!(0, Cardinality_1.isRepeatable)(m.number) && list.length >= 1) {
                    break;
                }
                const x = this.tryParse(m.type, m.role, m.exceptType);
                if (!x) {
                    break;
                }
                list.push(x);
            }
            if (list.length === 0) {
                return undefined;
            }
            return (0, Cardinality_1.isRepeatable)(m.number) ? ({
                type: list[0].type,
                list: list
            }) : list[0];
        };
        this.isLeaf = (t) => {
            return this.context.getLexemeTypes().includes(t);
        };
    }
    parseAll() {
        var _a;
        const results = [];
        while (!this.lexer.isEnd) {
            const ast = this.tryParse(this.context.getSyntaxList());
            if (!ast) {
                break;
            }
            const simpleAst = this.simplify(ast);
            results.push(simpleAst);
            if (((_a = this.lexer.peek) === null || _a === void 0 ? void 0 : _a.type) === 'fullstop') {
                this.lexer.next();
            }
        }
        return results;
    }
    tryParse(types, role, exceptTypes) {
        for (const t of types) {
            const memento = this.lexer.pos;
            const x = this.knownParse(t, role);
            if (x && !(exceptTypes === null || exceptTypes === void 0 ? void 0 : exceptTypes.includes(x.type))) {
                return x;
            }
            this.lexer.backTo(memento);
        }
    }
    simplify(ast) {
        if (!ast.links) {
            return ast;
        }
        const syntax = this.context.getSyntax(ast.type);
        if (syntax.length === 1 && Object.values(ast.links).length === 1) {
            return this.simplify(Object.values(ast.links)[0]);
        }
        const simpleLinks = Object
            .entries(ast.links)
            .map(l => ({ [l[0]]: this.simplify(l[1]) }))
            .reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
        return Object.assign(Object.assign({}, ast), { links: simpleLinks });
    }
}
exports.KoolParser = KoolParser;


/***/ }),

/***/ "./app/src/frontend/parser/interfaces/Cardinality.ts":
/*!***********************************************************!*\
  !*** ./app/src/frontend/parser/interfaces/Cardinality.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isRepeatable = exports.isNecessary = void 0;
const isNecessary = (c) => c === undefined // necessary by default
    || c == '+'
    || +c >= 1;
exports.isNecessary = isNecessary;
const isRepeatable = (c) => c == '+'
    || c == '*';
exports.isRepeatable = isRepeatable;


/***/ }),

/***/ "./app/src/frontend/parser/interfaces/Parser.ts":
/*!******************************************************!*\
  !*** ./app/src/frontend/parser/interfaces/Parser.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getParser = void 0;
const KoolParser_1 = __webpack_require__(/*! ../KoolParser */ "./app/src/frontend/parser/KoolParser.ts");
function getParser(sourceCode, context) {
    return new KoolParser_1.KoolParser(sourceCode, context);
}
exports.getParser = getParser;


/***/ }),

/***/ "./app/src/frontend/parser/macroToSyntax.ts":
/*!**************************************************!*\
  !*** ./app/src/frontend/parser/macroToSyntax.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.macroToSyntax = void 0;
function macroToSyntax(macro) {
    var _a, _b, _c, _d, _e, _f;
    const macroparts = (_c = (_b = (_a = macro === null || macro === void 0 ? void 0 : macro.links) === null || _a === void 0 ? void 0 : _a.macropart) === null || _b === void 0 ? void 0 : _b.list) !== null && _c !== void 0 ? _c : [];
    const syntax = macroparts.map(m => macroPartToMember(m));
    const name = (_f = (_e = (_d = macro === null || macro === void 0 ? void 0 : macro.links) === null || _d === void 0 ? void 0 : _d.subject) === null || _e === void 0 ? void 0 : _e.lexeme) === null || _f === void 0 ? void 0 : _f.root;
    if (!name) {
        throw new Error('Anonymous syntax!');
    }
    return { name, syntax };
}
exports.macroToSyntax = macroToSyntax;
function macroPartToMember(macroPart) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const adjectiveNodes = (_c = (_b = (_a = macroPart.links) === null || _a === void 0 ? void 0 : _a.adjective) === null || _b === void 0 ? void 0 : _b.list) !== null && _c !== void 0 ? _c : [];
    const adjectives = adjectiveNodes.flatMap(a => { var _a; return (_a = a.lexeme) !== null && _a !== void 0 ? _a : []; });
    const taggedUnions = (_f = (_e = (_d = macroPart.links) === null || _d === void 0 ? void 0 : _d.taggedunion) === null || _e === void 0 ? void 0 : _e.list) !== null && _f !== void 0 ? _f : [];
    const grammars = taggedUnions.map(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.noun; });
    const quantadjs = adjectives.filter(a => a.cardinality);
    const qualadjs = adjectives.filter(a => !a.cardinality);
    const exceptUnions = (_l = (_k = (_j = (_h = (_g = macroPart.links) === null || _g === void 0 ? void 0 : _g.exceptunion) === null || _h === void 0 ? void 0 : _h.links) === null || _j === void 0 ? void 0 : _j.taggedunion) === null || _k === void 0 ? void 0 : _k.list) !== null && _l !== void 0 ? _l : [];
    const notGrammars = exceptUnions.map(x => { var _a; return (_a = x.links) === null || _a === void 0 ? void 0 : _a.noun; });
    return {
        type: grammars.flatMap(g => { var _a, _b; return (_b = (_a = g === null || g === void 0 ? void 0 : g.lexeme) === null || _a === void 0 ? void 0 : _a.root) !== null && _b !== void 0 ? _b : []; }),
        role: (_m = qualadjs.at(0)) === null || _m === void 0 ? void 0 : _m.root,
        number: (_o = quantadjs.at(0)) === null || _o === void 0 ? void 0 : _o.cardinality,
        exceptType: notGrammars.flatMap(g => { var _a, _b; return (_b = (_a = g === null || g === void 0 ? void 0 : g.lexeme) === null || _a === void 0 ? void 0 : _a.root) !== null && _b !== void 0 ? _b : []; }),
    };
}


/***/ }),

/***/ "./app/src/frontend/parser/maxPrecedence.ts":
/*!**************************************************!*\
  !*** ./app/src/frontend/parser/maxPrecedence.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.dependencies = exports.maxPrecedence = void 0;
const maxPrecedence = (a, b, syntaxes) => {
    var _a, _b;
    return (_b = (_a = idCompare(a, b)) !== null && _a !== void 0 ? _a : dependencyCompare(a, b, syntaxes)) !== null && _b !== void 0 ? _b : lenCompare(a, b, syntaxes);
};
exports.maxPrecedence = maxPrecedence;
const idCompare = (a, b) => {
    return a == b ? 0 : undefined;
};
const dependencyCompare = (a, b, syntaxes) => {
    const aDependsOnB = dependencies(a, syntaxes).includes(b);
    const bDependsOnA = dependencies(b, syntaxes).includes(a);
    if (aDependsOnB === bDependsOnA) {
        return undefined;
    }
    return aDependsOnB ? 1 : -1;
};
function dependencies(a, syntaxes, visited = []) {
    var _a;
    const members = (_a = syntaxes[a]) !== null && _a !== void 0 ? _a : [];
    return members.flatMap(m => m.type).flatMap(t => {
        if (visited.includes(t)) {
            return [];
        }
        else {
            return [...visited, ...dependencies(t, syntaxes, [...visited, t])];
        }
    });
}
exports.dependencies = dependencies;
const lenCompare = (a, b, syntaxes) => {
    return dependencies(a, syntaxes).length - dependencies(b, syntaxes).length;
};


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
const AstCanvas_1 = __webpack_require__(/*! ../draw-ast/AstCanvas */ "./app/src/draw-ast/AstCanvas.ts");
const Brain_1 = __webpack_require__(/*! ../facade/Brain */ "./app/src/facade/Brain.ts");
function main() {
    const brain = (0, Brain_1.getBrain)();
    window.brain = brain;
    const astCanvas = new AstCanvas_1.AstCanvas();
    brain.addListener(astCanvas);
    const leftDiv = document.createElement('div');
    const rightDiv = document.createElement('div');
    const split = 'height: 100%; width: 50%; position: fixed; z-index: 1; top: 0;  padding-top: 20px;';
    const left = 'left: 0; background-color: #111;';
    const right = 'right: 0; background-color: #000;';
    leftDiv.style.cssText = split + left;
    rightDiv.style.cssText = split + right + 'overflow:scroll;' + 'overflow-x:scroll;' + 'overflow-y:scroll;';
    document.body.appendChild(leftDiv);
    document.body.appendChild(rightDiv);
    rightDiv.appendChild(astCanvas.div);
    const textarea = document.createElement('textarea');
    textarea.style.width = '40vw';
    textarea.style.height = '40vh';
    leftDiv.appendChild(textarea);
    const consoleOutput = document.createElement('textarea');
    consoleOutput.style.width = '40vw';
    consoleOutput.style.height = '40vh';
    leftDiv.appendChild(consoleOutput);
    document.body.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
        if (e.ctrlKey && e.code === 'Enter') {
            const result = brain.executeUnwrapped(textarea.value);
            consoleOutput.value = result.toString();
            console.log(result);
        }
        else if (e.ctrlKey && e.code === 'KeyY') {
            main();
        }
    }));
}
exports["default"] = main;


/***/ }),

/***/ "./app/src/middle/clauses/And.ts":
/*!***************************************!*\
  !*** ./app/src/middle/clauses/And.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/middle/clauses/Clause.ts");
const sortIds_1 = __webpack_require__(/*! ../id/functions/sortIds */ "./app/src/middle/id/functions/sortIds.ts");
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
const solveMaps_1 = __webpack_require__(/*! ./functions/solveMaps */ "./app/src/middle/clauses/functions/solveMaps.ts");
// import Imply from "./Imply";
class And {
    constructor(clause1, clause2, clause2IsRheme = false, negated = false) {
        this.clause1 = clause1;
        this.clause2 = clause2;
        this.clause2IsRheme = clause2IsRheme;
        this.negated = negated;
        this.hashCode = (0, hashString_1.hashString)(this.clause1.toString() + this.clause2.toString() + this.negated);
        this.entities = (0, uniq_1.uniq)(this.clause1.entities.concat(this.clause2.entities));
        this.hasSideEffects = this.rheme !== Clause_1.emptyClause;
        this.ownedBy = (id) => this.clause1.ownedBy(id).concat(this.clause2.ownedBy(id));
        this.ownersOf = (id) => this.clause1.ownersOf(id).concat(this.clause2.ownersOf(id));
    }
    and(other, opts) {
        var _a;
        return new And(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false);
    }
    copy(opts) {
        var _a, _b, _c;
        return new And((_a = opts === null || opts === void 0 ? void 0 : opts.clause1) !== null && _a !== void 0 ? _a : this.clause1.copy(opts), (_b = opts === null || opts === void 0 ? void 0 : opts.clause2) !== null && _b !== void 0 ? _b : this.clause2.copy(opts), this.clause2IsRheme, (_c = opts === null || opts === void 0 ? void 0 : opts.negate) !== null && _c !== void 0 ? _c : this.negated);
    }
    toString() {
        const yes = this.clause1.toString() + ',' + this.clause2.toString();
        return this.negated ? `not${yes}` : yes;
    }
    flatList() {
        return this.negated ? [this] : [...this.clause1.flatList(), ...this.clause2.flatList()];
    }
    get theme() {
        return this.clause2IsRheme ? this.clause1 : this.clause1.theme.and(this.clause2.theme);
    }
    get rheme() {
        return this.clause2IsRheme ? this.clause2 : this.clause1.rheme.and(this.clause2.rheme);
    }
    query(query, opts) {
        var _a;
        const universe = this.clause1.and(this.clause2);
        const it = (_a = opts === null || opts === void 0 ? void 0 : opts.it) !== null && _a !== void 0 ? _a : (0, sortIds_1.sortIds)(universe.entities).at(-1); //TODO!
        const universeList = universe.flatList();
        const queryList = query.flatList();
        const maps = (0, solveMaps_1.solveMaps)(queryList, universeList);
        const pronMap = queryList.filter(c => { var _a; return ((_a = c.predicate) === null || _a === void 0 ? void 0 : _a.type) === 'pronoun'; }).map(c => { var _a; return ({ [(_a = c.args) === null || _a === void 0 ? void 0 : _a.at(0)]: it }); }).reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
        const res = maps.concat(pronMap).filter(m => Object.keys(m).length); // empty maps cause problems all around the code!
        return res;
    }
    get simple() {
        const c1 = this.clause1.simple;
        const c2 = this.clause2.simple;
        if (c2.hashCode === Clause_1.emptyClause.hashCode) {
            return c1;
        }
        if (c1.hashCode === Clause_1.emptyClause.hashCode) {
            return c2;
        }
        return this.copy({ clause1: c1, clause2: c2 });
    }
}
exports["default"] = And;


/***/ }),

/***/ "./app/src/middle/clauses/AtomClause.ts":
/*!**********************************************!*\
  !*** ./app/src/middle/clauses/AtomClause.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AtomClause = void 0;
const Clause_1 = __webpack_require__(/*! ./Clause */ "./app/src/middle/clauses/Clause.ts");
const And_1 = __importDefault(__webpack_require__(/*! ./And */ "./app/src/middle/clauses/And.ts"));
const uniq_1 = __webpack_require__(/*! ../../utils/uniq */ "./app/src/utils/uniq.ts");
const hashString_1 = __webpack_require__(/*! ../../utils/hashString */ "./app/src/utils/hashString.ts");
// import Imply from "./Imply";
class AtomClause {
    constructor(predicate, args, negated = false) {
        this.predicate = predicate;
        this.args = args;
        this.negated = negated;
        this.simple = this;
        this.theme = this;
        this.rheme = Clause_1.emptyClause;
        this.entities = (0, uniq_1.uniq)(this.args);
        this.hashCode = (0, hashString_1.hashString)(JSON.stringify({ predicate: this.predicate.root, args: this.args, negated: this.negated }));
        this.hasSideEffects = this.rheme !== Clause_1.emptyClause;
        this.copy = (opts) => {
            var _a;
            return new AtomClause(this.predicate, this.args.map(a => { var _a, _b; return (_b = (_a = opts === null || opts === void 0 ? void 0 : opts.map) === null || _a === void 0 ? void 0 : _a[a]) !== null && _b !== void 0 ? _b : a; }), (_a = opts === null || opts === void 0 ? void 0 : opts.negate) !== null && _a !== void 0 ? _a : this.negated);
        };
        this.and = (other, opts) => { var _a; return new And_1.default(this, other, (_a = opts === null || opts === void 0 ? void 0 : opts.asRheme) !== null && _a !== void 0 ? _a : false); };
        this.flatList = () => [this];
        this.ownedBy = (id) => this.predicate.root === 'of' && this.args[1] === id ? [this.args[0]] : [];
        this.ownersOf = (id) => this.predicate.root === 'of' && this.args[0] === id ? [this.args[1]] : [];
    }
    toString() {
        const yes = `${this.predicate.root}(${this.args})`;
        return this.negated ? `not(${yes})` : yes;
    }
    query(query) {
        if (!(query instanceof AtomClause)) {
            return [];
        }
        if (this.predicate.root !== query.predicate.root) {
            return [];
        }
        const map = query.args
            .map((x, i) => ({ [x]: this.args[i] }))
            .reduce((a, b) => (Object.assign(Object.assign({}, a), b)));
        return [map];
    }
}
exports.AtomClause = AtomClause;


/***/ }),

/***/ "./app/src/middle/clauses/Clause.ts":
/*!******************************************!*\
  !*** ./app/src/middle/clauses/Clause.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.emptyClause = exports.clauseOf = void 0;
const AtomClause_1 = __webpack_require__(/*! ./AtomClause */ "./app/src/middle/clauses/AtomClause.ts");
const EmptyClause_1 = __importDefault(__webpack_require__(/*! ./EmptyClause */ "./app/src/middle/clauses/EmptyClause.ts"));
function clauseOf(predicate, ...args) {
    return new AtomClause_1.AtomClause(predicate, args);
}
exports.clauseOf = clauseOf;
exports.emptyClause = new EmptyClause_1.default();


/***/ }),

/***/ "./app/src/middle/clauses/EmptyClause.ts":
/*!***********************************************!*\
  !*** ./app/src/middle/clauses/EmptyClause.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class EmptyClause {
    constructor() {
        this.hashCode = 0;
        this.entities = [];
        this.theme = this;
        this.rheme = this;
        this.simple = this;
        this.hasSideEffects = false;
        this.copy = (opts) => this;
        this.and = (other, opts) => other;
        this.implies = (conclusion) => conclusion;
        this.flatList = () => [];
        this.ownedBy = (id) => [];
        this.ownersOf = (id) => [];
        this.query = (clause) => [];
        this.toString = () => '';
    }
}
exports["default"] = EmptyClause;


/***/ }),

/***/ "./app/src/middle/clauses/functions/getOwnershipChain.ts":
/*!***************************************************************!*\
  !*** ./app/src/middle/clauses/functions/getOwnershipChain.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOwnershipChain = void 0;
const topLevel_1 = __webpack_require__(/*! ./topLevel */ "./app/src/middle/clauses/functions/topLevel.ts");
function getOwnershipChain(clause, entity = (0, topLevel_1.getTopLevel)(clause)[0]) {
    // const ownedEntities = clause.ownedBy(entity)
    // const topLevel = getTopLevel(clause)[0]
    if (!entity) {
        return [];
    }
    const ownedEntities = clause.ownedBy(entity);
    return ownedEntities.length === 0 ?
        [entity] :
        [entity].concat(getOwnershipChain(clause, ownedEntities[0]));
}
exports.getOwnershipChain = getOwnershipChain;


/***/ }),

/***/ "./app/src/middle/clauses/functions/solveMaps.ts":
/*!*******************************************************!*\
  !*** ./app/src/middle/clauses/functions/solveMaps.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.solveMaps = void 0;
const uniq_1 = __webpack_require__(/*! ../../../utils/uniq */ "./app/src/utils/uniq.ts");
const intersection_1 = __webpack_require__(/*! ../../../utils/intersection */ "./app/src/utils/intersection.ts");
const Id_1 = __webpack_require__(/*! ../../id/Id */ "./app/src/middle/id/Id.ts");
/**
 * Finds possible Map-ings from queryList to universeList
 * {@link "file://./../../../../../docs/notes/unification-algo.md"}
 */
function solveMaps(queryList, universeList) {
    const candidates = findCandidates(queryList, universeList);
    candidates.forEach((ml1, i) => {
        candidates.forEach((ml2, j) => {
            if (ml1.length && ml2.length && i !== j) {
                const merged = merge(ml1, ml2);
                candidates[i] = [];
                candidates[j] = merged;
            }
        });
    });
    return candidates.flat().filter(x => !isImposible(x));
}
exports.solveMaps = solveMaps;
function findCandidates(queryList, universeList) {
    return queryList.map(q => {
        const res = universeList.flatMap(u => u.query(q));
        return res.length ? res : [makeImpossible(q)];
    });
}
function merge(ml1, ml2) {
    const merged = [];
    ml1.forEach(m1 => {
        ml2.forEach(m2 => {
            if (mapsAgree(m1, m2)) {
                merged.push(Object.assign(Object.assign({}, m1), m2));
            }
        });
    });
    return (0, uniq_1.uniq)(merged);
}
function mapsAgree(m1, m2) {
    const commonKeys = (0, intersection_1.intersection)(Object.keys(m1), Object.keys(m2));
    return commonKeys.every(k => m1[k] === m2[k]);
}
function makeImpossible(q) {
    return q.entities
        .map(x => ({ [x]: Id_1.SpecialIds.IMPOSSIBLE }))
        .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
}
function isImposible(map) {
    return Object.values(map).includes(Id_1.SpecialIds.IMPOSSIBLE);
}


/***/ }),

/***/ "./app/src/middle/clauses/functions/topLevel.ts":
/*!******************************************************!*\
  !*** ./app/src/middle/clauses/functions/topLevel.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTopLevel = void 0;
function getTopLevel(clause) {
    return clause
        .entities
        .map(x => ({ x, owners: clause.ownersOf(x) }))
        .filter(x => x.owners.length === 0)
        .map(x => x.x);
}
exports.getTopLevel = getTopLevel;


/***/ }),

/***/ "./app/src/middle/id/Id.ts":
/*!*********************************!*\
  !*** ./app/src/middle/id/Id.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpecialIds = void 0;
/**
 * Some special Ids
 */
exports.SpecialIds = {
    IMPOSSIBLE: 'IMPOSSIBLE'
};


/***/ }),

/***/ "./app/src/middle/id/functions/getIncrementalId.ts":
/*!*********************************************************!*\
  !*** ./app/src/middle/id/functions/getIncrementalId.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIncrementalId = void 0;
function getIncrementalId() {
    const newId = `id${idGenerator.next().value}`;
    return newId;
}
exports.getIncrementalId = getIncrementalId;
const idGenerator = getIncrementalIdGenerator();
function* getIncrementalIdGenerator() {
    let x = 0;
    while (true) {
        x++;
        yield x;
    }
}


/***/ }),

/***/ "./app/src/middle/id/functions/idToNum.ts":
/*!************************************************!*\
  !*** ./app/src/middle/id/functions/idToNum.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.idToNum = void 0;
function idToNum(id) {
    return parseInt(id.toString().replaceAll(/\D+/g, ''));
}
exports.idToNum = idToNum;


/***/ }),

/***/ "./app/src/middle/id/functions/sortIds.ts":
/*!************************************************!*\
  !*** ./app/src/middle/id/functions/sortIds.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sortIds = void 0;
const idToNum_1 = __webpack_require__(/*! ./idToNum */ "./app/src/middle/id/functions/idToNum.ts");
/**
 * Sort ids in ascending order.
 */
function sortIds(ids) {
    return ids.sort((a, b) => (0, idToNum_1.idToNum)(a) - (0, idToNum_1.idToNum)(b));
}
exports.sortIds = sortIds;


/***/ }),

/***/ "./app/src/utils/hashString.ts":
/*!*************************************!*\
  !*** ./app/src/utils/hashString.ts ***!
  \*************************************/
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

/***/ "./app/src/utils/intersection.ts":
/*!***************************************!*\
  !*** ./app/src/utils/intersection.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.intersection = void 0;
const uniq_1 = __webpack_require__(/*! ./uniq */ "./app/src/utils/uniq.ts");
/**
 * Intersection between two lists of strings.
 */
function intersection(xs, ys) {
    return (0, uniq_1.uniq)(xs.filter(x => ys.includes(x))
        .concat(ys.filter(y => xs.includes(y))));
}
exports.intersection = intersection;


/***/ }),

/***/ "./app/src/utils/parseNumber.ts":
/*!**************************************!*\
  !*** ./app/src/utils/parseNumber.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseNumber = void 0;
/**
 * Checks if string has any non-digit char (except for ".") before
 * converting to number.
 */
function parseNumber(string) {
    var _a;
    const nonDig = (_a = string.match(/\D/g)) === null || _a === void 0 ? void 0 : _a.at(0);
    if (nonDig && nonDig !== '.') {
        return undefined;
    }
    return parseFloat(string);
}
exports.parseNumber = parseNumber;


/***/ }),

/***/ "./app/src/utils/stringLiterals.ts":
/*!*****************************************!*\
  !*** ./app/src/utils/stringLiterals.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stringLiterals = void 0;
function stringLiterals(...args) { return args; }
exports.stringLiterals = stringLiterals;


/***/ }),

/***/ "./app/src/utils/uniq.ts":
/*!*******************************!*\
  !*** ./app/src/utils/uniq.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uniq = void 0;
/**
 * Remove duplicates from an array. Equality by JSON.stringify.
 */
function uniq(seq) {
    let seen = {};
    return seq.filter(e => {
        const k = JSON.stringify(e);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
}
exports.uniq = uniq;


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
/******/ 	var __webpack_exports__ = __webpack_require__("./app/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM3QyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMxRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM3RSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzVDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDN0MsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUVoRCw2REFBNkQ7SUFDN0QsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNyRCxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3ZELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDcEQsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN2RCxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3pELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDbkQsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN0RCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3BELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDdEQsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN4RCxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRXZELHdCQUF3QjtJQUN4QixFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRXRELDJDQUEyQztJQUMzQyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDMUUsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNFLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUU1RSxtQ0FBbUM7SUFDbkMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNyRCxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFFN0QsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2xELEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDOUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMvQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzlDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDOUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNoRCxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2xELEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDaEQsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNoRCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRTlDLEVBQUUsSUFBSSxF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LElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQzVELENBQUMsQ0FBQztBQUNOLENBQUM7QUFQRCxvQkFPQzs7Ozs7OztVQ1ZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL0Jhc2VUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvQmFzaWNDb250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9Db250ZXh0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9JbnN0cnVjdGlvblRoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9OdW1iZXJUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvU3RyaW5nVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL1RoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9WZXJiVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL2V2YWxBc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvQ29uZmlnLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL0xleGVtZVR5cGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvbGV4ZW1lcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9wcmVsdWRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3N5bnRheGVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvQXN0Q2FudmFzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvYXN0VG9FZGdlTGlzdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L2RyYXdMaW5lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvZHJhd05vZGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9nZXRDb29yZHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9wbG90QXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZmFjYWRlL0Jhc2ljQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvQnJhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9FYWdlckxleGVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvY29uanVnYXRlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvbGV4ZXIvZnVuY3Rpb25zL3BsdXJhbGl6ZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9Lb29sUGFyc2VyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHkudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvbWFjcm9Ub1N5bnRheC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9tYXhQcmVjZWRlbmNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWFpbi9tYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQW5kLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQXRvbUNsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0NsYXVzZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL0VtcHR5Q2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3NvbHZlTWFwcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9jbGF1c2VzL2Z1bmN0aW9ucy90b3BMZXZlbC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9JZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvaWRUb051bS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL21pZGRsZS9pZC9mdW5jdGlvbnMvc29ydElkcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2hhc2hTdHJpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9pbnRlcnNlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy9wYXJzZU51bWJlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3N0cmluZ0xpdGVyYWxzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvdW5pcS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYWluIGZyb20gXCIuL3NyYy9tYWluL21haW5cIjtcblxuXG5tYWluKCkiLCJpbXBvcnQgeyBleHRyYXBvbGF0ZSwgTGV4ZW1lIH0gZnJvbSAnLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lJztcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSAnLi4vbWlkZGxlL2NsYXVzZXMvQ2xhdXNlJztcbmltcG9ydCB7IElkIH0gZnJvbSAnLi4vbWlkZGxlL2lkL0lkJztcbmltcG9ydCB7IE1hcCB9IGZyb20gJy4uL21pZGRsZS9pZC9NYXAnO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gJy4uL3V0aWxzL3VuaXEnO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tICcuL1RoaW5nJztcblxuXG5leHBvcnQgY2xhc3MgQmFzZVRoaW5nIGltcGxlbWVudHMgVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBpZDogSWQsXG4gICAgICAgIHByb3RlY3RlZCBiYXNlczogVGhpbmdbXSA9IFtdLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY2hpbGRyZW46IHsgW2lkOiBJZF06IFRoaW5nIH0gPSB7fSxcbiAgICAgICAgcHJvdGVjdGVkIGxleGVtZXM6IExleGVtZVtdID0gW10sXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBnZXRJZCgpOiBJZCB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkXG4gICAgfVxuXG4gICAgY2xvbmUob3B0cz86IHsgaWQ6IElkIH0pOiBUaGluZyB7XG4gICAgICAgIHJldHVybiBuZXcgQmFzZVRoaW5nKFxuICAgICAgICAgICAgb3B0cz8uaWQgPz8gdGhpcy5pZCwgLy8gY2xvbmVzIGhhdmUgc2FtZSBpZFxuICAgICAgICAgICAgdGhpcy5iYXNlcy5tYXAoeCA9PiB4LmNsb25lKCkpLFxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5jaGlsZHJlbikubWFwKGUgPT4gKHsgW2VbMF1dOiBlWzFdLmNsb25lKCkgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSksXG4gICAgICAgIClcbiAgICB9XG5cbiAgICBleHRlbmRzID0gKHRoaW5nOiBUaGluZykgPT4ge1xuICAgICAgICB0aGlzLnVuZXh0ZW5kcyh0aGluZykgLy8gb3IgYXZvaWQ/XG4gICAgICAgIHRoaXMuYmFzZXMucHVzaCh0aGluZy5jbG9uZSgpKVxuICAgIH1cblxuICAgIHVuZXh0ZW5kcyh0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5iYXNlcyA9IHRoaXMuYmFzZXMuZmlsdGVyKHggPT4geC5nZXRJZCgpICE9PSB0aGluZy5nZXRJZCgpKVxuICAgIH1cblxuICAgIGdldCA9IChpZDogSWQpOiBUaGluZyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJy4nKVxuICAgICAgICBjb25zdCBwMSA9IHBhcnRzWzBdXG4gICAgICAgIGNvbnN0IGNoaWxkID0gdGhpcy5jaGlsZHJlbltwMV0gPz8gdGhpcy5jaGlsZHJlbltpZF1cbiAgICAgICAgY29uc3QgcmVzID0gLyogcGFydHMubGVuZ3RoID4gMSAqLyBjaGlsZC5nZXRJZCgpICE9PSBpZCA/IGNoaWxkLmdldChpZCAvKiBwYXJ0cy5zbGljZSgxKS5qb2luKCcuJykgKi8pIDogY2hpbGRcbiAgICAgICAgcmV0dXJuIHJlcyA/PyB0aGlzLmJhc2VzLmZpbmQoeCA9PiB4LmdldChpZCkpXG4gICAgfVxuXG4gICAgc2V0KGlkOiBJZCwgdGhpbmc6IFRoaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW5baWRdID0gdGhpbmdcbiAgICAgICAgdGhpcy5zZXRMZXhlbWUoeyByb290OiAndGhpbmcnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW3RoaW5nXSB9KSAvLyBldmVyeSB0aGluZyBpcyBhIHRoaW5nXG5cbiAgICAgICAgLy9UT0RPXG4gICAgICAgIGlmICh0eXBlb2YgdGhpbmcudG9KcygpID09PSAnc3RyaW5nJykgeyAvL1RPRE8gbWFrZSB0aGlzIHBvbHltb3JwaGljXG4gICAgICAgICAgICB0aGlzLnNldExleGVtZSh7IHJvb3Q6ICdzdHJpbmcnLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW3RoaW5nXSB9KSBcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpbmcudG9KcygpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdGhpcy5zZXRMZXhlbWUoeyByb290OiAnbnVtYmVyJywgdHlwZTogJ25vdW4nLCByZWZlcmVudHM6IFt0aGluZ10gfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgdG9KcygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcyAvL1RPRE9vb29vb29vb09PIVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG4gICAgICAgIHJldHVybiB1bmlxKHRoaXMudG9DbGF1c2UocXVlcnkpLnF1ZXJ5KHF1ZXJ5LCB7LyogaXQ6IHRoaXMubGFzdFJlZmVyZW5jZWQgICovIH0pKVxuICAgIH1cblxuICAgIHRvQ2xhdXNlID0gKHF1ZXJ5PzogQ2xhdXNlKTogQ2xhdXNlID0+IHtcblxuICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlbWVzXG4gICAgICAgICAgICAuZmxhdE1hcCh4ID0+IHgucmVmZXJlbnRzLm1hcChyID0+IGNsYXVzZU9mKHgsIHIuZ2V0SWQoKSkpKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IHkgPSBPYmplY3RcbiAgICAgICAgICAgIC5rZXlzKHRoaXMuY2hpbGRyZW4pXG4gICAgICAgICAgICAubWFwKHggPT4gY2xhdXNlT2YoeyByb290OiAnb2YnLCB0eXBlOiAncHJlcG9zaXRpb24nLCByZWZlcmVudHM6IFtdIH0sIHgsIHRoaXMuaWQpKSAvLyBoYXJkY29kZWQgZW5nbGlzaCFcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICBjb25zdCB6ID0gT2JqZWN0XG4gICAgICAgICAgICAudmFsdWVzKHRoaXMuY2hpbGRyZW4pXG4gICAgICAgICAgICAubWFwKHggPT4geC50b0NsYXVzZShxdWVyeSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgcmV0dXJuIHguYW5kKHkpLmFuZCh6KS5zaW1wbGVcbiAgICB9XG5cbiAgICBzZXRMZXhlbWUgPSAobGV4ZW1lOiBMZXhlbWUpID0+IHtcblxuICAgICAgICBjb25zdCBvbGQgPSB0aGlzLmxleGVtZXMuZmlsdGVyKHggPT4geC5yb290ID09PSBsZXhlbWUucm9vdClcbiAgICAgICAgY29uc3QgdXBkYXRlZDogTGV4ZW1lW10gPSBvbGQubWFwKHggPT4gKHsgLi4ueCwgLi4ubGV4ZW1lLCByZWZlcmVudHM6IFsuLi54LnJlZmVyZW50cywgLi4ubGV4ZW1lLnJlZmVyZW50c10gfSkpXG4gICAgICAgIHRoaXMubGV4ZW1lcyA9IHRoaXMubGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgIT09IGxleGVtZS5yb290KVxuICAgICAgICBjb25zdCB0b0JlQWRkZWQgPSB1cGRhdGVkLmxlbmd0aCA/IHVwZGF0ZWQgOiBbbGV4ZW1lXVxuICAgICAgICB0aGlzLmxleGVtZXMucHVzaCguLi50b0JlQWRkZWQpXG4gICAgICAgIGNvbnN0IGV4dHJhcG9sYXRlZCA9IHRvQmVBZGRlZC5mbGF0TWFwKHggPT4gZXh0cmFwb2xhdGUoeCwgdGhpcykpXG4gICAgICAgIHRoaXMubGV4ZW1lcy5wdXNoKC4uLmV4dHJhcG9sYXRlZClcblxuICAgIH1cblxuICAgIGdldExleGVtZXMgPSAocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZVtdID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGV4ZW1lc1xuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHJvb3RPclRva2VuID09PSB4LnRva2VuIHx8IHJvb3RPclRva2VuID09PSB4LnJvb3QpXG4gICAgfVxuXG4gICAgcmVtb3ZlTGV4ZW1lKHJvb3RPclRva2VuOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZ2FyYmFnZSA9IHRoaXMuZ2V0TGV4ZW1lcyhyb290T3JUb2tlbikuZmxhdE1hcCh4ID0+IHgucmVmZXJlbnRzKVxuICAgICAgICBnYXJiYWdlLmZvckVhY2goeCA9PiBkZWxldGUgdGhpcy5jaGlsZHJlblt4LmdldElkKCldKVxuICAgICAgICB0aGlzLmxleGVtZXMgPSB0aGlzLmxleGVtZXMuZmlsdGVyKHggPT4gcm9vdE9yVG9rZW4gIT09IHgudG9rZW4gJiYgcm9vdE9yVG9rZW4gIT09IHgucm9vdClcbiAgICB9XG5cbiAgICBlcXVhbHMob3RoZXI6IFRoaW5nKTogYm9vbGVhbiB7IC8vVE9ETzogaW1wbGVtZW50IG5lc3RlZCBzdHJ1Y3R1cmFsIGVxdWFsaXR5XG4gICAgICAgIHJldHVybiB0aGlzLnRvSnMoKSA9PT0gb3RoZXI/LnRvSnMoKVxuICAgIH1cbn1cbiIsImltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuL0Jhc2VUaGluZ1wiXG5pbXBvcnQgeyBnZXRDb25maWcgfSBmcm9tIFwiLi4vY29uZmlnL0NvbmZpZ1wiXG5pbXBvcnQgeyBDb21wb3NpdGVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9zeW50YXhlc1wiXG5pbXBvcnQgeyBleHRyYXBvbGF0ZSwgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQXN0VHlwZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgbWFjcm9Ub1N5bnRheCB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvbWFjcm9Ub1N5bnRheFwiXG5pbXBvcnQgeyBtYXhQcmVjZWRlbmNlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9tYXhQcmVjZWRlbmNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9JZFwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIlxuXG5leHBvcnQgY2xhc3MgQmFzaWNDb250ZXh0IGV4dGVuZHMgQmFzZVRoaW5nIGltcGxlbWVudHMgQ29udGV4dCB7XG5cbiAgICBwcm90ZWN0ZWQgc3ludGF4TGlzdDogQ29tcG9zaXRlVHlwZVtdID0gdGhpcy5yZWZyZXNoU3ludGF4TGlzdCgpXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgaWQ6IElkLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29uZmlnID0gZ2V0Q29uZmlnKCksXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzdGF0aWNEZXNjUHJlY2VkZW5jZSA9IGNvbmZpZy5zdGF0aWNEZXNjUHJlY2VkZW5jZSxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN5bnRheE1hcCA9IGNvbmZpZy5zeW50YXhlcyxcbiAgICAgICAgcHJvdGVjdGVkIGxleGVtZXM6IExleGVtZVtdID0gY29uZmlnLmxleGVtZXMuZmxhdE1hcChsID0+IFtsLCAuLi5leHRyYXBvbGF0ZShsKV0pLFxuICAgICAgICBwcm90ZWN0ZWQgYmFzZXM6IFRoaW5nW10gPSBbXSxcbiAgICAgICAgcHJvdGVjdGVkIGNoaWxkcmVuOiB7IFtpZDogSWRdOiBUaGluZyB9ID0ge30sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGlkLCBiYXNlcywgY2hpbGRyZW4sIGxleGVtZXMpXG5cbiAgICAgICAgdGhpcy5hc3RUeXBlcy5mb3JFYWNoKGcgPT4geyAvL1RPRE8hXG4gICAgICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgICAgICByb290OiBnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgICAgICAgICByZWZlcmVudHM6IFtdLFxuICAgICAgICAgICAgfSkpXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBnZXRMZXhlbWVUeXBlcygpOiBMZXhlbWVUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICB9XG5cbiAgICBnZXRQcmVsdWRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5wcmVsdWRlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlZnJlc2hTeW50YXhMaXN0KCkge1xuICAgICAgICBjb25zdCB4ID0gT2JqZWN0LmtleXModGhpcy5zeW50YXhNYXApIGFzIENvbXBvc2l0ZVR5cGVbXVxuICAgICAgICBjb25zdCB5ID0geC5maWx0ZXIoZSA9PiAhdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuY29uY2F0KHopXG4gICAgfVxuXG4gICAgZ2V0U3ludGF4TGlzdCgpOiBDb21wb3NpdGVUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhMaXN0XG4gICAgfVxuXG4gICAgc2V0U3ludGF4ID0gKG1hY3JvOiBBc3ROb2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvVG9TeW50YXgobWFjcm8pXG4gICAgICAgIHRoaXMuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoeyB0eXBlOiAnbm91bicsIHJvb3Q6IHN5bnRheC5uYW1lLCByZWZlcmVudHM6IFtdIH0pKVxuICAgICAgICB0aGlzLnN5bnRheE1hcFtzeW50YXgubmFtZSBhcyBDb21wb3NpdGVUeXBlXSA9IHN5bnRheC5zeW50YXhcbiAgICAgICAgdGhpcy5zeW50YXhMaXN0ID0gdGhpcy5yZWZyZXNoU3ludGF4TGlzdCgpXG4gICAgfVxuXG4gICAgZ2V0U3ludGF4ID0gKG5hbWU6IEFzdFR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ludGF4TWFwW25hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPz8gW3sgdHlwZTogW25hbWVdLCBudW1iZXI6IDEgfV0gLy8gVE9ETzogcHJvYmxlbSwgYWRqIGlzIG5vdCBhbHdheXMgMSAhISEhISFcbiAgICB9XG5cbiAgICBnZXQgYXN0VHlwZXMoKTogQXN0VHlwZVtdIHtcbiAgICAgICAgY29uc3QgcmVzOiBBc3RUeXBlW10gPSB0aGlzLmNvbmZpZy5sZXhlbWVUeXBlc1xuICAgICAgICByZXMucHVzaCguLi50aGlzLnN0YXRpY0Rlc2NQcmVjZWRlbmNlKVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgY2xvbmUoKTogQ29udGV4dCB7XG4gICAgICAgIHJldHVybiBuZXcgQmFzaWNDb250ZXh0KFxuICAgICAgICAgICAgdGhpcy5pZCxcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgdGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZSxcbiAgICAgICAgICAgIHRoaXMuc3ludGF4TWFwLFxuICAgICAgICAgICAgdGhpcy5sZXhlbWVzLFxuICAgICAgICAgICAgdGhpcy5iYXNlcyxcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4sIC8vc2hhbGxvdyBvciBkZWVwP1xuICAgICAgICApXG4gICAgfVxuXG59XG4iLCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL3N5bnRheGVzXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IEFzdFR5cGUsIFN5bnRheCB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgQmFzaWNDb250ZXh0IH0gZnJvbSBcIi4vQmFzaWNDb250ZXh0XCI7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGV4dCBleHRlbmRzIFRoaW5nIHtcbiAgICBnZXRTeW50YXgobmFtZTogQXN0VHlwZSk6IFN5bnRheFxuICAgIHNldFN5bnRheChtYWNybzogQXN0Tm9kZSk6IHZvaWRcbiAgICBnZXRTeW50YXhMaXN0KCk6IENvbXBvc2l0ZVR5cGVbXVxuICAgIGdldExleGVtZVR5cGVzKCk6IExleGVtZVR5cGVbXVxuICAgIGdldFByZWx1ZGUoKTogc3RyaW5nXG4gICAgY2xvbmUoKTogQ29udGV4dFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udGV4dChvcHRzOiB7IGlkOiBJZCB9KTogQ29udGV4dCB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0NvbnRleHQob3B0cy5pZClcbn0iLCJpbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IGdldEluY3JlbWVudGFsSWQgfSBmcm9tIFwiLi4vbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkXCI7XG5pbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIjtcblxuZXhwb3J0IGNsYXNzIEluc3RydWN0aW9uVGhpbmcgZXh0ZW5kcyBCYXNlVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgdmFsdWU6IEFzdE5vZGUpIHtcbiAgICAgICAgc3VwZXIoZ2V0SW5jcmVtZW50YWxJZCgpKVxuICAgIH1cblxuICAgIHRvSnMoKTogb2JqZWN0IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIjtcblxuZXhwb3J0IGNsYXNzIE51bWJlclRoaW5nIGV4dGVuZHMgQmFzZVRoaW5nIHtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIodmFsdWUgKyAnJylcbiAgICB9XG5cbiAgICB0b0pzKCk6IG9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlIGFzIGFueVxuICAgIH1cblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9JZFwiXG5pbXBvcnQgeyBCYXNlVGhpbmcgfSBmcm9tIFwiLi9CYXNlVGhpbmdcIlxuaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi9UaGluZ1wiXG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdUaGluZyBleHRlbmRzIEJhc2VUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogc3RyaW5nLCBpZDogSWQgPSB2YWx1ZSkge1xuICAgICAgICBzdXBlcihpZClcbiAgICB9XG5cbiAgICB0b0pzKCk6IG9iamVjdCB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlIGFzIGFueSAvL2pzIHN1Y2tzXG4gICAgfVxuXG4gICAgY2xvbmUob3B0cz86IHsgaWQ6IHN0cmluZyB9IHwgdW5kZWZpbmVkKTogVGhpbmcgeyAvL1RPRE8hXG4gICAgICAgIC8vIGNvbnN0IHggPSBzdXBlci5jbG9uZShvcHRzKVxuICAgICAgICByZXR1cm4gbmV3IFN0cmluZ1RoaW5nKHRoaXMudmFsdWUsIG9wdHM/LmlkKVxuICAgIH1cblxufSIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIlxuaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9NYXBcIlxuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCJcblxuXG5leHBvcnQgaW50ZXJmYWNlIFRoaW5nIHtcbiAgICBnZXQoaWQ6IElkKTogVGhpbmcgfCB1bmRlZmluZWRcbiAgICBzZXQoaWQ6IElkLCB0aGluZzogVGhpbmcpOiB2b2lkIC8vdGhpbmcuaWQ/Pz9cbiAgICBjbG9uZShvcHRzPzogeyBpZDogSWQgfSk6IFRoaW5nXG4gICAgdG9KcygpOiBvYmplY3RcbiAgICB0b0NsYXVzZShxdWVyeT86IENsYXVzZSk6IENsYXVzZVxuICAgIGV4dGVuZHModGhpbmc6IFRoaW5nKTogdm9pZFxuICAgIHVuZXh0ZW5kcyh0aGluZzogVGhpbmcpOiB2b2lkXG4gICAgcXVlcnkoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXVxuICAgIGdldExleGVtZXMocm9vdE9yVG9rZW46IHN0cmluZyk6IExleGVtZVtdXG4gICAgcmVtb3ZlTGV4ZW1lKHJvb3RPclRva2VuOiBzdHJpbmcpOiB2b2lkXG4gICAgc2V0TGV4ZW1lKGxleGVtZTogTGV4ZW1lKTogdm9pZFxuICAgIGdldElkKCk6IElkXG4gICAgZXF1YWxzKG90aGVyOiBUaGluZyk6IGJvb2xlYW5cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGhpbmcoYXJnczogeyBpZDogSWQsIGJhc2VzOiBUaGluZ1tdIH0pIHtcbiAgICByZXR1cm4gbmV3IEJhc2VUaGluZyhhcmdzLmlkLCBhcmdzLmJhc2VzKVxufSIsIlxuaW1wb3J0IHsgZXZhbEFzdCB9IGZyb20gXCIuL2V2YWxBc3RcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiO1xuaW1wb3J0IHsgSW5zdHJ1Y3Rpb25UaGluZyB9IGZyb20gXCIuL0luc3RydWN0aW9uVGhpbmdcIjtcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIjtcblxuZXhwb3J0IGludGVyZmFjZSBWZXJiIGV4dGVuZHMgVGhpbmcge1xuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0LCBhcmdzOiB7IFtyb2xlIGluIFZlcmJBcmdzXTogVGhpbmcgfSk6IFRoaW5nW10gLy8gY2FsbGVkIGRpcmVjdGx5IGluIGV2YWxWZXJiU2VudGVuY2UoKVxufVxuXG50eXBlIFZlcmJBcmdzID0gJ3N1YmplY3QnIC8vVE9ET1xuICAgIHwgJ29iamVjdCdcblxuZXhwb3J0IGNsYXNzIFZlcmJUaGluZyBleHRlbmRzIEJhc2VUaGluZyBpbXBsZW1lbnRzIFZlcmIge1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcmVhZG9ubHkgaW5zdHJ1Y3Rpb25zOiBJbnN0cnVjdGlvblRoaW5nW10sIC8vb3IgSW5zdHJ1Y3Rpb25UaGluZz9cbiAgICApIHtcbiAgICAgICAgc3VwZXIoaWQpXG4gICAgfVxuXG4gICAgcnVuKGNvbnRleHQ6IENvbnRleHQsIGFyZ3M6IHsgc3ViamVjdDogVGhpbmcsIG9iamVjdDogVGhpbmcsIH0pOiBUaGluZ1tdIHtcblxuICAgICAgICBjb25zdCBjbG9uZWRDb250ZXh0ID0gY29udGV4dC5jbG9uZSgpXG4gICAgICAgIC8vIGluamVjdCBhcmdzLCByZW1vdmUgaGFyY29kZWQgZW5nbGlzaCFcblxuICAgICAgICAvL1RPTyBJIGd1ZXNzIHNldHRpbmcgY29udGV4dCBvbiBjb250ZXh0IHN1YmplY3QgcmVzdWx0cyBpbiBhbiBpbmYgbG9vcC9tYXggdG9vIG11Y2ggcmVjdXJzaW9uIGVycm9yXG4gICAgICAgIC8vIGNsb25lZENvbnRleHQuc2V0KGFyZ3Muc3ViamVjdC5nZXRJZCgpLCBhcmdzLnN1YmplY3QpXG4gICAgICAgIGNsb25lZENvbnRleHQuc2V0KGFyZ3Mub2JqZWN0LmdldElkKCksIGFyZ3Mub2JqZWN0KVxuXG4gICAgICAgIGNsb25lZENvbnRleHQuc2V0TGV4ZW1lKHsgcm9vdDogJ3N1YmplY3QnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbYXJncy5zdWJqZWN0XSB9KVxuICAgICAgICBjbG9uZWRDb250ZXh0LnNldExleGVtZSh7IHJvb3Q6ICdvYmplY3QnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbYXJncy5vYmplY3RdIH0pXG5cbiAgICAgICAgbGV0IHJlc3VsdHM6IFRoaW5nW10gPSBbXVxuXG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLmZvckVhY2goaXN0cnVjdGlvbiA9PiB7XG4gICAgICAgICAgICByZXN1bHRzID0gZXZhbEFzdChjbG9uZWRDb250ZXh0LCBpc3RydWN0aW9uLnZhbHVlKVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG59XG5cblxuLy8geCBpcyBcImNpYW9cIlxuLy8geSBpcyBcIm1vbmRvXCJcbi8vIHlvdSBsb2cgeCBhbmQgeVxuLy8geW91IGxvZyBcImNhcHJhIVwiXG4vLyBzdHVwaWRpemUgaXMgdGhlIHByZXZpb3VzIFwiMlwiIGluc3RydWN0aW9uc1xuLy8geW91IHN0dXBpZGl6ZVxuZXhwb3J0IGNvbnN0IGxvZ1ZlcmIgPSBuZXcgKGNsYXNzIGV4dGVuZHMgVmVyYlRoaW5nIHsgLy9UT0RPOiB0YWtlIGxvY2F0aW9uIGNvbXBsZW1lbnQsIGVpdGhlciBjb25zb2xlIG9yIFwic3Rkb3V0XCIgIVxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0LCBhcmdzOiB7IHN1YmplY3Q6IFRoaW5nOyBvYmplY3Q6IFRoaW5nOyB9KTogVGhpbmdbXSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3Mub2JqZWN0LnRvSnMoKSlcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxufSkoJ2xvZycsIFtdKVxuXG5cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi9Db250ZXh0XCI7XG5pbXBvcnQgeyBJbnN0cnVjdGlvblRoaW5nIH0gZnJvbSBcIi4vSW5zdHJ1Y3Rpb25UaGluZ1wiO1xuaW1wb3J0IHsgTnVtYmVyVGhpbmcgfSBmcm9tIFwiLi9OdW1iZXJUaGluZ1wiO1xuaW1wb3J0IHsgU3RyaW5nVGhpbmcgfSBmcm9tIFwiLi9TdHJpbmdUaGluZ1wiO1xuaW1wb3J0IHsgVGhpbmcsIGdldFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIjtcbmltcG9ydCB7IFZlcmJUaGluZyB9IGZyb20gXCIuL1ZlcmJUaGluZ1wiO1xuaW1wb3J0IHsgaXNQbHVyYWwsIExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgcGFyc2VOdW1iZXIgfSBmcm9tIFwiLi4vdXRpbHMvcGFyc2VOdW1iZXJcIjtcbmltcG9ydCB7IENsYXVzZSwgY2xhdXNlT2YsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4uL21pZGRsZS9jbGF1c2VzL0NsYXVzZVwiO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tIFwiLi4vbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL2dldE93bmVyc2hpcENoYWluXCI7XG5pbXBvcnQgeyBnZXRJbmNyZW1lbnRhbElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZFwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vbWlkZGxlL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vbWlkZGxlL2lkL01hcFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZXZhbEFzdChjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M6IFRvQ2xhdXNlT3B0cyA9IHt9KTogVGhpbmdbXSB7XG5cbiAgICBhcmdzLnNpZGVFZmZlY3RzID8/PSBjb3VsZEhhdmVTaWRlRWZmZWN0cyhhc3QpXG5cbiAgICBpZiAoYXJncy5zaWRlRWZmZWN0cykgeyAvLyBvbmx5IGNhY2hlIGluc3RydWN0aW9ucyB3aXRoIHNpZGUgZWZmZWN0c1xuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IG5ldyBJbnN0cnVjdGlvblRoaW5nKGFzdClcbiAgICAgICAgY29udGV4dC5zZXQoaW5zdHJ1Y3Rpb24uZ2V0SWQoKSwgaW5zdHJ1Y3Rpb24pXG4gICAgICAgIGNvbnRleHQuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoeyByb290OiAnaW5zdHJ1Y3Rpb24nLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW2luc3RydWN0aW9uXSB9KSlcbiAgICB9XG5cbiAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgY29udGV4dC5zZXRTeW50YXgoYXN0KVxuICAgICAgICByZXR1cm4gW11cbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LmNvcHVsYSkge1xuICAgICAgICByZXR1cm4gZXZhbENvcHVsYVNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKGFzdD8ubGlua3M/LnZlcmIpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxWZXJiU2VudGVuY2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH0gZWxzZSBpZiAoYXN0Py5saW5rcz8uc3ViY29uaikge1xuICAgICAgICByZXR1cm4gZXZhbENvbXBsZXhTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3Q/LmxpbmtzPy5ub25zdWJjb25qKSB7XG4gICAgICAgIHJldHVybiBldmFsQ29tcG91bmRTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGV2YWxOb3VuUGhyYXNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9XG5cbn1cblxuXG5mdW5jdGlvbiBldmFsQ29wdWxhU2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogVGhpbmdbXSB7XG5cbiAgICBpZiAoYXJncz8uc2lkZUVmZmVjdHMpIHsgLy8gYXNzaWduIHRoZSByaWdodCB2YWx1ZSB0byB0aGUgbGVmdCB2YWx1ZVxuXG4gICAgICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0LmxpbmtzPy5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KS5zaW1wbGVcbiAgICAgICAgY29uc3QgclZhbCA9IGV2YWxBc3QoY29udGV4dCwgYXN0LmxpbmtzPy5wcmVkaWNhdGUhLCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KVxuICAgICAgICBjb25zdCBvd25lckNoYWluID0gZ2V0T3duZXJzaGlwQ2hhaW4oc3ViamVjdClcbiAgICAgICAgY29uc3QgbWFwcyA9IGNvbnRleHQucXVlcnkoc3ViamVjdClcbiAgICAgICAgY29uc3QgbGV4ZW1lcyA9IHN1YmplY3QuZmxhdExpc3QoKS5tYXAoeCA9PiB4LnByZWRpY2F0ZSEpLmZpbHRlcih4ID0+IHgpXG4gICAgICAgIGNvbnN0IGxleGVtZXNXaXRoUmVmZXJlbnQgPSBsZXhlbWVzLm1hcCh4ID0+ICh7IC4uLngsIHJlZmVyZW50czogclZhbCB9KSlcblxuICAgICAgICBpZiAoclZhbC5ldmVyeSh4ID0+IHggaW5zdGFuY2VvZiBJbnN0cnVjdGlvblRoaW5nKSkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ21ha2luZyB2ZXJiIScpXG4gICAgICAgICAgICBjb25zdCB2ZXJiID0gbmV3IFZlcmJUaGluZyhnZXRJbmNyZW1lbnRhbElkKCksIHJWYWwgYXMgSW5zdHJ1Y3Rpb25UaGluZ1tdKVxuICAgICAgICAgICAgY29udGV4dC5zZXQodmVyYi5nZXRJZCgpLCB2ZXJiKVxuICAgICAgICAgICAgY29uc3QgbGV4ZW1lc1dpdGhSZWZlcmVudDogTGV4ZW1lW10gPSBsZXhlbWVzLm1hcCh4ID0+ICh7IC4uLngsIHJlZmVyZW50czogW3ZlcmJdLCB0eXBlOiAndmVyYicgfSkpXG4gICAgICAgICAgICBsZXhlbWVzV2l0aFJlZmVyZW50LmZvckVhY2goeCA9PiBjb250ZXh0LnNldExleGVtZSh4KSlcbiAgICAgICAgICAgIHJldHVybiBbdmVyYl1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdWJqZWN0PScsIHN1YmplY3QudG9TdHJpbmcoKSwgJ3JWYWw9JywgclZhbCwgJ293bmVyQ2hhaW49Jywgb3duZXJDaGFpbiwgJ21hcHM9JywgbWFwcylcblxuICAgICAgICBpZiAoIW1hcHMubGVuZ3RoICYmIG93bmVyQ2hhaW4ubGVuZ3RoIDw9IDEpIHsgLy8gbFZhbCBpcyBjb21wbGV0ZWx5IG5ld1xuICAgICAgICAgICAgbGV4ZW1lc1dpdGhSZWZlcmVudC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXRMZXhlbWUoeCkpXG4gICAgICAgICAgICByVmFsLmZvckVhY2goeCA9PiBjb250ZXh0LnNldCh4LmdldElkKCksIHgpKVxuICAgICAgICAgICAgcmV0dXJuIHJWYWxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtYXBzLmxlbmd0aCAmJiBvd25lckNoYWluLmxlbmd0aCA8PSAxKSB7IC8vIHJlYXNzaWdubWVudFxuICAgICAgICAgICAgbGV4ZW1lcy5mb3JFYWNoKHggPT4gY29udGV4dC5yZW1vdmVMZXhlbWUoeC5yb290KSlcbiAgICAgICAgICAgIGxleGVtZXNXaXRoUmVmZXJlbnQuZm9yRWFjaCh4ID0+IGNvbnRleHQuc2V0TGV4ZW1lKHgpKVxuICAgICAgICAgICAgclZhbC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXQoeC5nZXRJZCgpLCB4KSlcbiAgICAgICAgICAgIHJldHVybiByVmFsXG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3duZXJDaGFpbi5sZW5ndGggPiAxKSB7IC8vIGxWYWwgaXMgcHJvcGVydHkgb2YgZXhpc3Rpbmcgb2JqZWN0XG4gICAgICAgICAgICBjb25zdCBhYm91dE93bmVyID0gYWJvdXQoc3ViamVjdCwgb3duZXJDaGFpbi5hdCgtMikhKVxuICAgICAgICAgICAgY29uc3Qgb3duZXJzID0gZ2V0SW50ZXJlc3RpbmdJZHMoY29udGV4dC5xdWVyeShhYm91dE93bmVyKSwgYWJvdXRPd25lcikubWFwKGlkID0+IGNvbnRleHQuZ2V0KGlkKSEpLmZpbHRlcih4ID0+IHgpXG4gICAgICAgICAgICBjb25zdCBvd25lciA9IG93bmVycy5hdCgwKVxuICAgICAgICAgICAgY29uc3QgclZhbENsb25lID0gclZhbC5tYXAoeCA9PiB4LmNsb25lKHsgaWQ6IG93bmVyPy5nZXRJZCgpICsgJy4nICsgeC5nZXRJZCgpIH0pKVxuICAgICAgICAgICAgY29uc3QgbGV4ZW1lc1dpdGhDbG9uZVJlZmVyZW50ID0gbGV4ZW1lcy5tYXAoeCA9PiAoeyAuLi54LCByZWZlcmVudHM6IHJWYWxDbG9uZSB9KSlcbiAgICAgICAgICAgIGxleGVtZXNXaXRoQ2xvbmVSZWZlcmVudC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXRMZXhlbWUoeCkpXG4gICAgICAgICAgICByVmFsQ2xvbmUuZm9yRWFjaCh4ID0+IG93bmVyPy5zZXQoeC5nZXRJZCgpLCB4KSlcbiAgICAgICAgICAgIHJldHVybiByVmFsQ2xvbmVcbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIHsgLy8gY29tcGFyZSB0aGUgcmlnaHQgYW5kIGxlZnQgdmFsdWVzXG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBldmFsQXN0KGNvbnRleHQsIGFzdC5saW5rcz8uc3ViamVjdCEsIGFyZ3MpLmF0KDApXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IGV2YWxBc3QoY29udGV4dCwgYXN0LmxpbmtzPy5wcmVkaWNhdGUhLCBhcmdzKS5hdCgwKVxuICAgICAgICByZXR1cm4gc3ViamVjdD8uZXF1YWxzKHByZWRpY2F0ZSEpICYmICghYXN0LmxpbmtzPy5uZWdhdGlvbikgPyBbbmV3IE51bWJlclRoaW5nKDEpXSA6IFtdXG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ3Byb2JsZW0gd2l0aCBjb3B1bGEgc2VudGVuY2UhJylcbiAgICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gYWJvdXQoY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQpIHtcbiAgICByZXR1cm4gY2xhdXNlLmZsYXRMaXN0KCkuZmlsdGVyKHggPT4geC5lbnRpdGllcy5pbmNsdWRlcyhlbnRpdHkpICYmIHguZW50aXRpZXMubGVuZ3RoIDw9IDEpLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKS5zaW1wbGVcbn1cblxuZnVuY3Rpb24gZXZhbFZlcmJTZW50ZW5jZShjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuICAgIGNvbnN0IHZlcmIgPSBhc3Q/LmxpbmtzPy52ZXJiPy5sZXhlbWU/LnJlZmVyZW50cy5hdCgwKSBhcyBWZXJiVGhpbmcgfCB1bmRlZmluZWRcbiAgICBjb25zdCBjb21wbGVtZW50cyA9IChhc3QubGlua3MgYXMgYW55KT8uWydjb21wbGVtZW50J10gPz8gW10gYXMgQXN0Tm9kZVtdXG4gICAgY29uc3Qgc3ViamVjdCA9IGFzdC5saW5rcz8uc3ViamVjdCA/IGV2YWxBc3QoY29udGV4dCwgYXN0LmxpbmtzPy5zdWJqZWN0KS5hdCgwKSA6IHVuZGVmaW5lZFxuICAgIGNvbnN0IG9iamVjdCA9ICBhc3QubGlua3M/Lm9iamVjdCA/IGV2YWxBc3QoY29udGV4dCwgYXN0LmxpbmtzPy5vYmplY3QpLmF0KDApIDogdW5kZWZpbmVkXG5cbiAgICAvLyBjb25zb2xlLmxvZygndmVyYj0nLCB2ZXJiKVxuICAgIC8vIGNvbnNvbGUubG9nKCdzdWJqZWN0PScsIHN1YmplY3QpXG4gICAgLy8gY29uc29sZS5sb2coJ29iamVjdD0nLCBvYmplY3QpXG4gICAgLy8gY29uc29sZS5sb2coJ2NvbXBsZW1lbnRzPScsIGNvbXBsZW1lbnRzKVxuXG4gICAgaWYgKCF2ZXJiKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdubyBzdWNoIHZlcmIgJysgYXN0Py5saW5rcz8udmVyYj8ubGV4ZW1lPy5yb290KVxuICAgIH1cblxuICAgIHJldHVybiB2ZXJiLnJ1bihjb250ZXh0LCB7IHN1YmplY3QgOiBzdWJqZWN0ID8/IGNvbnRleHQsIG9iamVjdCA6IG9iamVjdCA/PyBjb250ZXh0fSlcblxuICAgIC8vIHJldHVybiBvYmplY3QuZmxhdE1hcChvID0+IHZlcmI/LnJ1bihjb250ZXh0LCB7IG9iamVjdDogbywgc3ViamVjdDoge30gYXMgVGhpbmcgfSkgPz8gW10pXG5cbiAgICAvLyBvYmplY3RzLmZvckVhY2gobyA9PiB2ZXJiPy5ydW4oY29udGV4dCwgeyBvYmplY3Q6IG8sIHN1YmplY3Q6IHt9IGFzIFRoaW5nIH0pKVxuICAgIC8vIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiBldmFsQ29tcGxleFNlbnRlbmNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgaWYgKGFzdC5saW5rcz8uc3ViY29uaj8ubGV4ZW1lPy5yb290ID09PSAnaWYnKSB7XG5cbiAgICAgICAgaWYgKGV2YWxBc3QoY29udGV4dCwgYXN0LmxpbmtzLmNvbmRpdGlvbiEsIHsgLi4uYXJncywgc2lkZUVmZmVjdHM6IGZhbHNlIH0pLmxlbmd0aCkge1xuICAgICAgICAgICAgZXZhbEFzdChjb250ZXh0LCBhc3QubGlua3MuY29uc2VxdWVuY2UhLCB7IC4uLmFyZ3MsIHNpZGVFZmZlY3RzOiB0cnVlIH0pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiBldmFsQ29tcG91bmRTZW50ZW5jZShjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvbXBvdW5kIHNlbnRlbmNlIScpXG59XG5cbmZ1bmN0aW9uIGV2YWxOb3VuUGhyYXNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgY29uc3QgbnAgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuXG4gICAgY29uc3QgbWFwcyA9IGNvbnRleHQucXVlcnkobnApIC8vIFRPRE86IGludHJhLXNlbnRlbmNlIGFuYXBob3JhIHJlc29sdXRpb25cbiAgICBjb25zdCBpbnRlcmVzdGluZ0lkcyA9IGdldEludGVyZXN0aW5nSWRzKG1hcHMsIG5wKVxuXG4gICAgbGV0IHRoaW5nczogVGhpbmdbXVxuXG4gICAgaWYgKGFzdC5saW5rcz8uc3ViamVjdD8ubGlzdD8uc29tZSh4ID0+IHgubGlua3M/LnF1b3RlKSkge1xuICAgICAgICB0aGluZ3MgPSBldmFsU3RyaW5nKGNvbnRleHQsIGFzdC5saW5rcz8uc3ViamVjdD8ubGlzdFswXSwgYXJncylcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGluZ3MgPSBpbnRlcmVzdGluZ0lkcy5tYXAoaWQgPT4gY29udGV4dC5nZXQoaWQpKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiB4ISkgLy8gVE9ETyBzb3J0IGJ5IGlkXG4gICAgfVxuXG4gICAgY29uc3QgbWF0aEV4cHJlc3Npb24gPSAoYXN0LmxpbmtzIGFzIGFueSlbJ21hdGgtZXhwcmVzc2lvbiddIGFzIEFzdE5vZGUgfCB1bmRlZmluZWRcblxuICAgIGlmIChtYXRoRXhwcmVzc2lvbikge1xuICAgICAgICBjb25zdCBsZWZ0ID0gdGhpbmdzXG4gICAgICAgIGNvbnN0IG9wID0gbWF0aEV4cHJlc3Npb24ubGlua3M/Lm9wZXJhdG9yPy5sZXhlbWVcbiAgICAgICAgY29uc3QgcmlnaHQgPSBldmFsQXN0KGNvbnRleHQsIChtYXRoRXhwcmVzc2lvbi5saW5rcyBhcyBhbnkpWydub3VuLXBocmFzZSddKVxuICAgICAgICByZXR1cm4gZXZhbE9wZXJhdGlvbihsZWZ0LCByaWdodCwgb3ApXG4gICAgfVxuXG4gICAgaWYgKGlzQXN0UGx1cmFsKGFzdCkgfHwgZ2V0QW5kUGhyYXNlKGFzdCkpIHsgLy8gaWYgdW5pdmVyc2FsIHF1YW50aWZpZWQsIEkgZG9uJ3QgY2FyZSBpZiB0aGVyZSdzIG5vIG1hdGNoXG5cbiAgICAgICAgY29uc3QgbGltaXQgPSAoYXN0LmxpbmtzIGFzIGFueSlbJ2xpbWl0LXBocmFzZSddPy5saW5rcy5zdHJpbmcvL1RPRE8hXG4gICAgICAgIGNvbnN0IGxpbWl0TnVtOiBudW1iZXIgPSBldmFsU3RyaW5nKGNvbnRleHQsIGxpbWl0LCBhcmdzKS5hdCgwKT8udG9KcygpIGFzIGFueVxuICAgICAgICByZXR1cm4gdGhpbmdzLnNsaWNlKDAsIGxpbWl0TnVtID8/IHRoaW5ncy5sZW5ndGgpXG5cbiAgICB9XG5cbiAgICBpZiAodGhpbmdzLmxlbmd0aCkgeyAvLyBub24tcGx1cmFsLCByZXR1cm4gc2luZ2xlIGV4aXN0aW5nIFRoaW5nXG4gICAgICAgIHJldHVybiB0aGluZ3Muc2xpY2UoMCwgMSlcbiAgICB9XG5cbiAgICAvLyBvciBlbHNlIGNyZWF0ZSBhbmQgcmV0dXJucyB0aGUgVGhpbmdcbiAgICByZXR1cm4gYXJncz8uYXV0b3ZpdmlmaWNhdGlvbiA/IFtjcmVhdGVUaGluZyhucCldIDogW11cblxufVxuXG5cbmZ1bmN0aW9uIGV2YWxPcGVyYXRpb24obGVmdDogVGhpbmdbXSwgcmlnaHQ6IFRoaW5nW10sIG9wPzogTGV4ZW1lKSB7XG4gICAgY29uc3Qgc3VtcyA9IGxlZnQubWFwKHggPT4geC50b0pzKCkgYXMgYW55ICsgcmlnaHQuYXQoMCk/LnRvSnMoKSlcbiAgICByZXR1cm4gc3Vtcy5tYXAoeCA9PiBuZXcgTnVtYmVyVGhpbmcoeCkpXG59XG5cbmZ1bmN0aW9uIG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/OiBBc3ROb2RlLCBhcmdzPzogVG9DbGF1c2VPcHRzKTogQ2xhdXNlIHtcblxuICAgIGNvbnN0IHN1YmplY3RJZCA9IGFyZ3M/LnN1YmplY3QgPz8gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IChhc3Q/LmxpbmtzPy5hZGplY3RpdmU/Lmxpc3QgPz8gW10pLm1hcCh4ID0+IHgubGV4ZW1lISkuZmlsdGVyKHggPT4geCkubWFwKHggPT4gY2xhdXNlT2YoeCwgc3ViamVjdElkKSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG4gICAgY29uc3Qgbm91bnMgPSAoYXN0Py5saW5rcz8uc3ViamVjdD8ubGlzdCA/PyBbXSkubWFwKHggPT4geC5sZXhlbWUhKS5maWx0ZXIoeCA9PiB4KS5tYXAoeCA9PiBjbGF1c2VPZih4LCBzdWJqZWN0SWQpKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcbiAgICBjb25zdCBnZW5pdGl2ZUNvbXBsZW1lbnQgPSBPYmplY3QudmFsdWVzKGFzdD8ubGlua3MgPz8ge30pLmZpbHRlcih4ID0+IHgubGlua3M/Lm93bmVyKS5hdCgwKVxuICAgIGNvbnN0IGdlbml0aXZlQ29tcGxlbWVudENsYXVzZSA9IGdlbml0aXZlVG9DbGF1c2UoZ2VuaXRpdmVDb21wbGVtZW50LCB7IHN1YmplY3Q6IHN1YmplY3RJZCwgYXV0b3ZpdmlmaWNhdGlvbjogZmFsc2UsIHNpZGVFZmZlY3RzOiBmYWxzZSB9KVxuXG4gICAgY29uc3QgYW5kUGhyYXNlID0gZXZhbEFuZFBocmFzZShnZXRBbmRQaHJhc2UoYXN0KSwgYXJncylcbiAgICAvL1RPRE86IHJlbGF0aXZlIGNsYXVzZXNcblxuICAgIHJldHVybiBhZGplY3RpdmVzLmFuZChub3VucykuYW5kKGdlbml0aXZlQ29tcGxlbWVudENsYXVzZSkuYW5kKGFuZFBocmFzZSlcbn1cblxuZnVuY3Rpb24gZ2V0QW5kUGhyYXNlKG5wPzogQXN0Tm9kZSk6IEFzdE5vZGUgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiAobnA/LmxpbmtzIGFzIGFueSk/LlsnYW5kLXBocmFzZSddICAvL1RPRE8hXG59XG5cbmZ1bmN0aW9uIGV2YWxBbmRQaHJhc2UoYW5kUGhyYXNlPzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cykge1xuXG4gICAgaWYgKCFhbmRQaHJhc2UpIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgcmV0dXJuIG5vdW5QaHJhc2VUb0NsYXVzZSgoYW5kUGhyYXNlPy5saW5rcyBhcyBhbnkpPy5bJ25vdW4tcGhyYXNlJ10vKiBUT0RPISAqLywgLyogYXJncyAqLykgLy8gbWF5YmUgcHJvYmxlbSBpZiBtdWx0aXBsZSB0aGluZ3MgaGF2ZSBzYW1lIGlkLCBxdWVyeSBpcyBub3QgZ29ubmEgZmluZCB0aGVtXG59XG5cbmZ1bmN0aW9uIGdlbml0aXZlVG9DbGF1c2UoYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBpZiAoIWFzdCkge1xuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2VcbiAgICB9XG5cbiAgICBjb25zdCBvd25lZElkID0gYXJncz8uc3ViamVjdCFcbiAgICBjb25zdCBvd25lcklkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgY29uc3QgZ2VuaXRpdmVQYXJ0aWNsZSA9IGFzdD8ubGlua3M/LltcImdlbml0aXZlLXBhcnRpY2xlXCJdPy5sZXhlbWVcbiAgICBjb25zdCBvd25lciA9IG5vdW5QaHJhc2VUb0NsYXVzZShhc3Q/LmxpbmtzPy5vd25lciwgeyBzdWJqZWN0OiBvd25lcklkLCBhdXRvdml2aWZpY2F0aW9uOiBmYWxzZSwgc2lkZUVmZmVjdHM6IGZhbHNlIH0pXG4gICAgcmV0dXJuIGNsYXVzZU9mKGdlbml0aXZlUGFydGljbGUhLCBvd25lZElkLCBvd25lcklkKS5hbmQob3duZXIpXG59XG5cbmZ1bmN0aW9uIHJlbGF0aXZlQ2xhdXNlVG9DbGF1c2UoYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG4gICAgcmV0dXJuIGVtcHR5Q2xhdXNlIC8vVE9ETyFcbn1cblxuZnVuY3Rpb24gaXNBc3RQbHVyYWwoYXN0PzogQXN0Tm9kZSk6IGJvb2xlYW4ge1xuXG4gICAgY29uc3QgeCA9XG4gICAgICAgIGFzdD8ubGlua3M/Lm5vdW4/Lmxpc3Q/LnNvbWUoeCA9PiB4LmxleGVtZSAmJiBpc1BsdXJhbCh4LmxleGVtZSkpXG4gICAgICAgIHx8IGFzdD8ubGlua3M/LmFkamVjdGl2ZT8ubGlzdD8uc29tZSh4ID0+IHgubGV4ZW1lICYmIGlzUGx1cmFsKHgubGV4ZW1lKSlcbiAgICAgICAgfHwgYXN0Py5saW5rcz8uc3ViamVjdD8ubGlzdD8uc29tZSh4ID0+IHgubGV4ZW1lICYmIGlzUGx1cmFsKHgubGV4ZW1lKSlcbiAgICAgICAgfHwgYXN0Py5saW5rcz8udW5pcXVhbnRcblxuICAgIGlmICh4KSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYXN0Py5saW5rcyA/PyB7fSkuY29uY2F0KGFzdD8ubGlzdCA/PyBbXSkuc29tZSh4ID0+IGlzQXN0UGx1cmFsKHgpKVxufVxuXG5mdW5jdGlvbiBnZXRJbnRlcmVzdGluZ0lkcyhtYXBzOiBNYXBbXSwgY2xhdXNlOiBDbGF1c2UpOiBJZFtdIHtcblxuICAgIC8vIHRoZSBvbmVzIHdpdGggbW9zdCBkb3RzLCBiZWNhdXNlIFwiY29sb3Igb2Ygc3R5bGUgb2YgYnV0dG9uXCIgXG4gICAgLy8gaGFzIGJ1dHRvbklkLnN0eWxlLmNvbG9yIGFuZCB0aGF0J3MgdGhlIG9iamVjdCB0aGUgc2VudGVuY2Ugc2hvdWxkIHJlc29sdmUgdG9cbiAgICAvLyBwb3NzaWJsZSBwcm9ibGVtIGlmIFwiY29sb3Igb2YgYnV0dG9uIEFORCBidXR0b25cIlxuICAgIC8vIGNvbnN0IGlkcyA9IG1hcHMuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpXG4gICAgLy8gY29uc3QgbWF4TGVuID0gTWF0aC5tYXgoLi4uaWRzLm1hcCh4ID0+IGdldE51bWJlck9mRG90cyh4KSkpXG4gICAgLy8gcmV0dXJuIGlkcy5maWx0ZXIoeCA9PiBnZXROdW1iZXJPZkRvdHMoeCkgPT09IG1heExlbilcblxuICAgIGNvbnN0IG9jID0gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlKVxuXG4gICAgaWYgKG9jLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIHJldHVybiBtYXBzLmZsYXRNYXAoeCA9PiBPYmplY3QudmFsdWVzKHgpKSAvL2FsbFxuICAgIH1cblxuICAgIC8vIFRPRE86IHByb2JsZW0gbm90IHJldHVybmluZyBldmVyeXRoaW5nIGJlY2F1c2Ugb2YgZ2V0T3duZXJzaGlwQ2hhaW4oKVxuICAgIHJldHVybiBtYXBzLmZsYXRNYXAobSA9PiBtW29jLmF0KC0xKSFdKSAvLyBvd25lZCBsZWFmXG5cbn1cblxuY29uc3QgZ2V0TnVtYmVyT2ZEb3RzID0gKGlkOiBJZCkgPT4gaWQuc3BsaXQoJy4nKS5sZW5ndGggLy8tMVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZVRoaW5nKGNsYXVzZTogQ2xhdXNlKTogVGhpbmcge1xuICAgIGNvbnN0IGJhc2VzID0gY2xhdXNlLmZsYXRMaXN0KCkubWFwKHggPT4geC5wcmVkaWNhdGU/LnJlZmVyZW50cz8uWzBdISkvKiBPTkxZIEZJUlNUPyAqLy5maWx0ZXIoeCA9PiB4KVxuICAgIGNvbnN0IGlkID0gZ2V0SW5jcmVtZW50YWxJZCgpXG4gICAgcmV0dXJuIGdldFRoaW5nKHsgaWQsIGJhc2VzIH0pXG59XG5cbmZ1bmN0aW9uIGV2YWxTdHJpbmcoY29udGV4dDogQ29udGV4dCwgYXN0PzogQXN0Tm9kZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgY29uc3QgeCA9IE9iamVjdC52YWx1ZXMoeyAuLi5hc3Q/LmxpbmtzLCAncXVvdGUnOiB1bmRlZmluZWQgfSkuZmlsdGVyKHggPT4geCkuYXQoMCk/Lmxpc3Q/Lm1hcCh4ID0+IHgubGV4ZW1lPy50b2tlbikgPz8gW11cbiAgICBjb25zdCB5ID0geC5qb2luKCcgJylcbiAgICBjb25zdCB6ID0gcGFyc2VOdW1iZXIoeSlcblxuICAgIGlmICh6KSB7XG4gICAgICAgIHJldHVybiBbbmV3IE51bWJlclRoaW5nKHopXVxuICAgIH1cblxuICAgIGlmICgheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgcmV0dXJuIFtuZXcgU3RyaW5nVGhpbmcoeSldXG59XG5cbmZ1bmN0aW9uIGNvdWxkSGF2ZVNpZGVFZmZlY3RzKGFzdDogQXN0Tm9kZSkgeyAvLyBhbnl0aGluZyB0aGF0IGlzIG5vdCBhIG5vdW5waHJhc2UgQ09VTEQgaGF2ZSBzaWRlIGVmZmVjdHNcblxuICAgIGlmIChhc3QudHlwZSA9PT0gJ21hY3JvJykgeyAvLyB0aGlzIGlzIG5vdCBvaywgaXQncyBoZXJlIGp1c3QgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMgKHNhdmluZyBhbGwgb2YgdGhlIG1hY3JvcyBpcyBjdXJyZW50bHkgZXhwZW5zaXZlKSBcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgcmV0dXJuICEhKGFzdC5saW5rcz8uY29wdWxhIHx8IGFzdC5saW5rcz8udmVyYiB8fCBhc3QubGlua3M/LnN1YmNvbmopXG59XG5cbmludGVyZmFjZSBUb0NsYXVzZU9wdHMge1xuICAgIHN1YmplY3Q/OiBJZCxcbiAgICBhdXRvdml2aWZpY2F0aW9uPzogYm9vbGVhbixcbiAgICBzaWRlRWZmZWN0cz86IGJvb2xlYW4sXG59IiwiaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuaW1wb3J0IHsgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IHByZWx1ZGUgfSBmcm9tIFwiLi9wcmVsdWRlXCJcbmltcG9ydCB7IHN5bnRheGVzLCBzdGF0aWNEZXNjUHJlY2VkZW5jZSB9IGZyb20gXCIuL3N5bnRheGVzXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGV4ZW1lVHlwZXMsXG4gICAgICAgIGxleGVtZXMsXG4gICAgICAgIHN5bnRheGVzLFxuICAgICAgICBwcmVsdWRlLFxuICAgICAgICBzdGF0aWNEZXNjUHJlY2VkZW5jZSxcbiAgICAgICAgLy8gdGhpbmdzLFxuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBMZXhlbWVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGxleGVtZVR5cGVzPlxuXG5leHBvcnQgY29uc3QgbGV4ZW1lVHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgJ2FkamVjdGl2ZScsXG4gICdjb3B1bGEnLFxuICAnZGVmYXJ0JyxcbiAgJ2luZGVmYXJ0JyxcbiAgJ2Z1bGxzdG9wJyxcbiAgJ2h2ZXJiJyxcbiAgJ3ZlcmInLFxuICAnbmVnYXRpb24nLFxuICAnZXhpc3RxdWFudCcsXG4gICd1bmlxdWFudCcsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdub25zdWJjb25qJywgLy8gYW5kXG4gICdkaXNqdW5jJywgLy8gb3JcbiAgJ3Byb25vdW4nLFxuICAncXVvdGUnLFxuXG4gICdtYWtyby1rZXl3b3JkJyxcbiAgJ2V4Y2VwdC1rZXl3b3JkJyxcbiAgJ3RoZW4ta2V5d29yZCcsXG4gICdlbmQta2V5d29yZCcsXG5cbiAgJ2dlbml0aXZlLXBhcnRpY2xlJyxcbiAgJ2RhdGl2ZS1wYXJ0aWNsZScsXG4gICdhYmxhdGl2ZS1wYXJ0aWNsZScsXG4gICdsb2NhdGl2ZS1wYXJ0aWNsZScsXG4gICdpbnN0cnVtZW50YWwtcGFydGljbGUnLFxuICAnY29taXRhdGl2ZS1wYXJ0aWNsZScsXG5cbiAgJ25leHQta2V5d29yZCcsXG4gICdwcmV2aW91cy1rZXl3b3JkJyxcblxuICAncGx1cy1vcGVyYXRvcicsXG5cbilcbiIsImltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcblxuZXhwb3J0IGNvbnN0IGxleGVtZXM6IExleGVtZVtdID0gW1xuXG4gICAgeyByb290OiAnYmUnLCB0eXBlOiAnY29wdWxhJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2JlJywgdHlwZTogJ2NvcHVsYScsIHRva2VuOiAnaXMnLCBjYXJkaW5hbGl0eTogMSwgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2JlJywgdHlwZTogJ2NvcHVsYScsIHRva2VuOiAnYXJlJywgY2FyZGluYWxpdHk6ICcqJywgcmVmZXJlbnRzOiBbXSB9LCAvL1RPRE8hIDIrXG4gICAgeyByb290OiAnZG8nLCB0eXBlOiAnaHZlcmInLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZG8nLCB0eXBlOiAnaHZlcmInLCB0b2tlbjogJ2RvZXMnLCBjYXJkaW5hbGl0eTogMSwgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2hhdmUnLCB0eXBlOiAndmVyYicsIHJlZmVyZW50czogW10gfSwvL3Rlc3RcbiAgICB7IHJvb3Q6ICdub3QnLCB0eXBlOiAnbmVnYXRpb24nLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICAvLyBsb2dpY2FsIHJvbGVzIG9mIGEgY29uc3RpdHVlbnQgdG8gYWJzdHJhY3QgYXdheSB3b3JkIG9yZGVyXG4gICAgeyByb290OiAnc3ViamVjdCcsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAncHJlZGljYXRlJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvYmplY3QnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2NvbmRpdGlvbicsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnY29uc2VxdWVuY2UnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ293bmVyJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdyZWNlaXZlcicsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb3JpZ2luJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdsb2NhdGlvbicsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaW5zdHJ1bWVudCcsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sIC8vbWVhbnNcbiAgICB7IHJvb3Q6ICdjb21wYW5pb24nLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgLy8gcm9sZSBvZiBtYXRoIG9wZXJhdG9yXG4gICAgeyByb290OiAnb3BlcmF0b3InLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgLy8gbnVtYmVyIG9mIHRpbWVzIGEgY29uc3RpdHVlbnQgY2FuIGFwcGVhclxuICAgIHsgcm9vdDogJ29wdGlvbmFsJywgdHlwZTogJ2FkamVjdGl2ZScsIGNhcmRpbmFsaXR5OiAnMXwwJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ29uZS1vci1tb3JlJywgdHlwZTogJ2FkamVjdGl2ZScsIGNhcmRpbmFsaXR5OiAnKycsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd6ZXJvLW9yLW1vcmUnLCB0eXBlOiAnYWRqZWN0aXZlJywgY2FyZGluYWxpdHk6ICcqJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgLy8gZm9yIHVzZSBpbiBhIHBhcnQgb2Ygbm91bi1waHJhc2VcbiAgICB7IHJvb3Q6ICduZXh0JywgdHlwZTogJ25leHQta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdwcmV2aW91cycsIHR5cGU6ICdwcmV2aW91cy1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgeyByb290OiAnb3InLCB0eXBlOiAnZGlzanVuYycsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhbmQnLCB0eXBlOiAnbm9uc3ViY29uaicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhJywgdHlwZTogJ2luZGVmYXJ0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2FuJywgdHlwZTogJ2luZGVmYXJ0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3RoZScsIHR5cGU6ICdkZWZhcnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaWYnLCB0eXBlOiAnc3ViY29uaicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd3aGVuJywgdHlwZTogJ3N1YmNvbmonLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZXZlcnknLCB0eXBlOiAndW5pcXVhbnQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYW55JywgdHlwZTogJ3VuaXF1YW50JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3RoYXQnLCB0eXBlOiAncmVscHJvbicsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdpdCcsIHR5cGU6ICdwcm9ub3VuJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgeyByb290OiAnXCInLCB0eXBlOiAncXVvdGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnLicsIHR5cGU6ICdmdWxsc3RvcCcsIHJlZmVyZW50czogW10gfSxcblxuICAgIHsgcm9vdDogJ3RoZW4nLCB0eXBlOiAndGhlbi1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2V4Y2VwdCcsIHR5cGU6ICdleGNlcHQta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdtYWtybycsIHR5cGU6ICdtYWtyby1rZXl3b3JkJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2VuZCcsIHR5cGU6ICdlbmQta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcblxuXG4gICAgeyByb290OiAnb2YnLCB0eXBlOiAnZ2VuaXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAndG8nLCB0eXBlOiAnZGF0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2Zyb20nLCB0eXBlOiAnYWJsYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb24nLCB0eXBlOiAnbG9jYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaW4nLCB0eXBlOiAnbG9jYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYXQnLCB0eXBlOiAnbG9jYXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYnknLCB0eXBlOiAnaW5zdHJ1bWVudGFsLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3dpdGgnLCB0eXBlOiAnY29taXRhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcblxuICAgIHsgcm9vdDogJysnLCB0eXBlOiAncGx1cy1vcGVyYXRvcicsIHJlZmVyZW50czogW10gfSxcblxuXG5dXG5cbiIsImV4cG9ydCBjb25zdCBwcmVsdWRlOiBzdHJpbmcgPVxuXG4gIGBcbiAgbWFrcm8gXG4gICAgYW55LWxleGVtZSBpcyBhZGplY3RpdmUgXG4gICAgICAgICAgICBvciBjb3B1bGEgXG4gICAgICAgICAgICBvciBkZWZhcnQgXG4gICAgICAgICAgICBvciBpbmRlZmFydCBcbiAgICAgICAgICAgIG9yIGZ1bGxzdG9wIFxuICAgICAgICAgICAgb3IgaHZlcmIgXG4gICAgICAgICAgICBvciB2ZXJiIFxuICAgICAgICAgICAgb3IgbmVnYXRpb24gXG4gICAgICAgICAgICBvciBleGlzdHF1YW50IFxuICAgICAgICAgICAgb3IgdW5pcXVhbnQgXG4gICAgICAgICAgICBvciByZWxwcm9uIFxuICAgICAgICAgICAgb3IgbmVnYXRpb24gXG4gICAgICAgICAgICBvciBub3VuIFxuICAgICAgICAgICAgb3IgcHJlcG9zaXRpb24gXG4gICAgICAgICAgICBvciBzdWJjb25qIFxuICAgICAgICAgICAgb3Igbm9uc3ViY29uaiBcbiAgICAgICAgICAgIG9yIGRpc2p1bmMgXG4gICAgICAgICAgICBvciBwcm9ub3VuIFxuICAgICAgICAgICAgb3IgdGhlbi1rZXl3b3JkXG4gICAgICAgICAgICBvciBtYWtyby1rZXl3b3JkIFxuICAgICAgICAgICAgb3IgZXhjZXB0LWtleXdvcmQgXG4gICAgICAgICAgICBvciBxdW90ZVxuICBlbmQuXG4gIFxuICBtYWtybyBcbiAgICBxdWFudGlmaWVyIGlzIHVuaXF1YW50IG9yIGV4aXN0cXVhbnQgXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBhcnRpY2xlIGlzIGluZGVmYXJ0IG9yIGRlZmFydCBcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgZ2VuaXRpdmUtY29tcGxlbWVudCBpcyBnZW5pdGl2ZS1wYXJ0aWNsZSB0aGVuIG93bmVyIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGRhdGl2ZS1jb21wbGVtZW50IGlzIGRhdGl2ZS1wYXJ0aWNsZSB0aGVuIHJlY2VpdmVyIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGFibGF0aXZlLWNvbXBsZW1lbnQgaXMgYWJsYXRpdmUtcGFydGljbGUgdGhlbiBvcmlnaW4gbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgbG9jYXRpdmUtY29tcGxlbWVudCBpcyBsb2NhdGl2ZS1wYXJ0aWNsZSB0aGVuIGxvY2F0aW9uIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGluc3RydW1lbnRhbC1jb21wbGVtZW50IGlzIGluc3RydW1lbnRhbC1wYXJ0aWNsZSB0aGVuIGluc3RydW1lbnQgbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvXG4gICAgY29taXRhdGl2ZS1jb21wbGVtZW50IGlzIGNvbWl0YXRpdmUtcGFydGljbGUgdGhlbiBjb21wYW5pb24gbm91bi1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIGNvbXBsZW1lbnQgaXMgXG4gICAgZ2VuaXRpdmUtY29tcGxlbWVudCBvciBcbiAgICBkYXRpdmUtY29tcGxlbWVudCBvclxuICAgIGFibGF0aXZlLWNvbXBsZW1lbnQgb3JcbiAgICBsb2NhdGl2ZS1jb21wbGVtZW50IG9yXG4gICAgaW5zdHJ1bWVudGFsLWNvbXBsZW1lbnQgb3JcbiAgICBjb21pdGF0aXZlLWNvbXBsZW1lbnRcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIGNvcHVsYS1zZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4tcGhyYXNlIFxuICAgICAgdGhlbiBjb3B1bGEgXG4gICAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgICAgdGhlbiBwcmVkaWNhdGUgbm91bi1waHJhc2UgXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGFuZC1waHJhc2UgaXMgbm9uc3ViY29uaiB0aGVuIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGxpbWl0LXBocmFzZSBpcyBuZXh0LWtleXdvcmQgb3IgcHJldmlvdXMta2V5d29yZCB0aGVuIG9wdGlvbmFsIHN0cmluZ1xuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBtYXRoLWV4cHJlc3Npb24gaXMgb3BlcmF0b3IgcGx1cy1vcGVyYXRvciB0aGVuIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBub3VuLXBocmFzZSBpcyBvcHRpb25hbCBxdWFudGlmaWVyIFxuICAgICAgdGhlbiBvcHRpb25hbCBhcnRpY2xlIFxuICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgYWRqZWN0aXZlc1xuICAgICAgdGhlbiBvcHRpb25hbCBsaW1pdC1waHJhc2UgXG4gICAgICB0aGVuIHplcm8tb3ItbW9yZSBzdWJqZWN0IG5vdW4gb3IgcHJvbm91biBvciBzdHJpbmdcbiAgICAgIHRoZW4gb3B0aW9uYWwgbWF0aC1leHByZXNzaW9uXG4gICAgICB0aGVuIG9wdGlvbmFsIHN1YmNsYXVzZVxuICAgICAgdGhlbiBvcHRpb25hbCBnZW5pdGl2ZS1jb21wbGVtZW50XG4gICAgICB0aGVuIG9wdGlvbmFsIGFuZC1waHJhc2VcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIGNvcHVsYXN1YmNsYXVzZSBpcyByZWxwcm9uIHRoZW4gY29wdWxhIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlIFxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgbXZlcmJzdWJjbGF1c2UgaXMgcmVscHJvbiB0aGVuIHZlcmIgdGhlbiBvYmplY3Qgbm91bi1waHJhc2UgXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBzdWJjbGF1c2UgaXMgY29wdWxhc3ViY2xhdXNlIG9yIG12ZXJic3ViY2xhdXNlIFxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgdmVyYi1zZW50ZW5jZSBpcyBzdWJqZWN0IG5vdW4tcGhyYXNlIFxuICAgICAgdGhlbiBvcHRpb25hbCBodmVyYiBcbiAgICAgIHRoZW4gb3B0aW9uYWwgbmVnYXRpb24gXG4gICAgICB0aGVuIHZlcmIgXG4gICAgICB0aGVuIG9wdGlvbmFsIG9iamVjdCBub3VuLXBocmFzZVxuICAgICAgdGhlbiB6ZXJvLW9yLW1vcmUgY29tcGxlbWVudHNcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICAgIHNpbXBsZS1zZW50ZW5jZSBpcyBjb3B1bGEtc2VudGVuY2Ugb3IgdmVyYi1zZW50ZW5jZSBcbiAgZW5kLlxuXG4gIG1ha3JvIFxuICBjb21wbGV4LXNlbnRlbmNlLTEgaXMgc3ViY29uaiBcbiAgICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZSBcbiAgICAgIHRoZW4gdGhlbi1rZXl3b3JkXG4gICAgICB0aGVuIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgY29tcGxleC1zZW50ZW5jZS0yIGlzIGNvbnNlcXVlbmNlIHNpbXBsZS1zZW50ZW5jZSBcbiAgICAgIHRoZW4gc3ViY29uaiBcbiAgICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgc3RyaW5nIGlzIHF1b3RlIHRoZW4gb25lLW9yLW1vcmUgYW55LWxleGVtZSBleGNlcHQgcXVvdGUgdGhlbiBxdW90ZSBcbiAgZW5kLlxuXG4gIGBcbiIsImltcG9ydCB7IFN5bnRheE1hcCB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBDb21wb3NpdGVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGNvbnN0aXR1ZW50VHlwZXM+XG5cbmV4cG9ydCBjb25zdCBjb25zdGl0dWVudFR5cGVzID0gc3RyaW5nTGl0ZXJhbHMoXG4gICAgJ21hY3JvJyxcbiAgICAnbWFjcm9wYXJ0JyxcbiAgICAndGFnZ2VkdW5pb24nLFxuICAgICdleGNlcHR1bmlvbicsXG4pXG5cbmV4cG9ydCBjb25zdCBzdGF0aWNEZXNjUHJlY2VkZW5jZTogQ29tcG9zaXRlVHlwZVtdID0gWydtYWNybyddXG5cbmV4cG9ydCBjb25zdCBzeW50YXhlczogU3ludGF4TWFwID0ge1xuXG4gICAgJ21hY3JvJzogW1xuICAgICAgICB7IHR5cGU6IFsnbWFrcm8ta2V5d29yZCddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nXSwgbnVtYmVyOiAxLCByb2xlOiAnc3ViamVjdCcgfSxcbiAgICAgICAgeyB0eXBlOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlOiBbJ21hY3JvcGFydCddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsnZW5kLWtleXdvcmQnXSwgbnVtYmVyOiAxIH0sXG4gICAgXSxcbiAgICAnbWFjcm9wYXJ0JzogW1xuICAgICAgICB7IHR5cGU6IFsnYWRqZWN0aXZlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZTogWyd0YWdnZWR1bmlvbiddLCBudW1iZXI6ICcrJyB9LFxuICAgICAgICB7IHR5cGU6IFsnZXhjZXB0dW5pb24nXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgICAgICB7IHR5cGU6IFsndGhlbi1rZXl3b3JkJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICd0YWdnZWR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ25vdW4nXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZTogWydkaXNqdW5jJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICdleGNlcHR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlOiBbJ2V4Y2VwdC1rZXl3b3JkJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGU6IFsndGFnZ2VkdW5pb24nXSwgbnVtYmVyOiAnKycgfSxcbiAgICBdXG5cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL1RoaW5nXCI7XG5pbXBvcnQgeyBCcmFpbkxpc3RlbmVyIH0gZnJvbSBcIi4uL2ZhY2FkZS9CcmFpbkxpc3RlbmVyXCI7XG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcbmltcG9ydCB7IHBsb3RBc3QgfSBmcm9tIFwiLi9wbG90QXN0XCI7XG5cbmV4cG9ydCBjbGFzcyBBc3RDYW52YXMgaW1wbGVtZW50cyBCcmFpbkxpc3RlbmVyIHtcblxuICAgIHJlYWRvbmx5IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgcHJvdGVjdGVkIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgcHJvdGVjdGVkIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGxcbiAgICBwcm90ZWN0ZWQgY2FtZXJhT2Zmc2V0ID0geyB4OiB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHk6IHdpbmRvdy5pbm5lckhlaWdodCAvIDIgfVxuICAgIHByb3RlY3RlZCBpc0RyYWdnaW5nID0gZmFsc2VcbiAgICBwcm90ZWN0ZWQgZHJhZ1N0YXJ0ID0geyB4OiAwLCB5OiAwIH1cbiAgICBwcm90ZWN0ZWQgYXN0PzogQXN0Tm9kZVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuZGl2LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKVxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG5cbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydC54ID0gZS54IC0gdGhpcy5jYW1lcmFPZmZzZXQueFxuICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnQueSA9IGUueSAtIHRoaXMuY2FtZXJhT2Zmc2V0LnlcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZSA9PiB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZSlcblxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBlID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbWVyYU9mZnNldC54ID0gZS5jbGllbnRYIC0gdGhpcy5kcmFnU3RhcnQueFxuICAgICAgICAgICAgICAgIHRoaXMuY2FtZXJhT2Zmc2V0LnkgPSBlLmNsaWVudFkgLSB0aGlzLmRyYWdTdGFydC55XG4gICAgICAgICAgICAgICAgdGhpcy5yZXBsb3QoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIG9uVXBkYXRlKGFzdDogQXN0Tm9kZSwgcmVzdWx0czogVGhpbmdbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmFzdCA9IGFzdFxuICAgICAgICB0aGlzLnJlcGxvdCgpXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlcGxvdCA9ICgpID0+IHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgICAgICAgIHRoaXMuY29udGV4dD8udHJhbnNsYXRlKHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMilcbiAgICAgICAgICAgIHRoaXMuY29udGV4dD8udHJhbnNsYXRlKC13aW5kb3cuaW5uZXJXaWR0aCAvIDIgKyB0aGlzLmNhbWVyYU9mZnNldC54LCAtd2luZG93LmlubmVySGVpZ2h0IC8gMiArIHRoaXMuY2FtZXJhT2Zmc2V0LnkpXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQ/LmNsZWFyUmVjdCgwLCAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuY29udGV4dCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FudmFzIGNvbnRleHQgaXMgdW5kZWZpbmVkIScpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5hc3QpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FzdCBpcyBpcyB1bmRlZmluZWQhJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGxvdEFzdCh0aGlzLmNvbnRleHQsIHRoaXMuYXN0KVxuICAgICAgICB9KVxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3RUb0VkZ2VMaXN0KFxuICAgIGFzdDogQXN0Tm9kZSxcbiAgICBwYXJlbnROYW1lPzogc3RyaW5nLFxuICAgIGVkZ2VzOiBFZGdlTGlzdCA9IFtdLFxuKTogRWRnZUxpc3Qge1xuXG4gICAgY29uc3QgYXN0TmFtZSA9IChhc3Qucm9sZSA/PyBhc3QubGV4ZW1lPy5yb290ID8/IGFzdC50eXBlKSArIHJhbmRvbSgpXG5cbiAgICBjb25zdCBhZGRpdGlvbnM6IEVkZ2VMaXN0ID0gW11cblxuICAgIGlmIChwYXJlbnROYW1lKSB7XG4gICAgICAgIGFkZGl0aW9ucy5wdXNoKFtwYXJlbnROYW1lLCBhc3ROYW1lXSlcbiAgICB9XG5cbiAgICBpZiAoIWFzdC5saW5rcyAmJiAhYXN0Lmxpc3QpIHsgLy8gbGVhZiFcbiAgICAgICAgcmV0dXJuIFsuLi5lZGdlcywgLi4uYWRkaXRpb25zXVxuICAgIH1cblxuICAgIGlmIChhc3QubGlua3MpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXMoYXN0LmxpbmtzKVxuICAgICAgICAgICAgLmZsYXRNYXAoZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXplcm8gPSBlWzBdICsgcmFuZG9tKClcbiAgICAgICAgICAgICAgICByZXR1cm4gWy4uLmFkZGl0aW9ucywgW2FzdE5hbWUsIGV6ZXJvXSwgLi4uYXN0VG9FZGdlTGlzdChlWzFdLCBlemVybywgZWRnZXMpXVxuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoYXN0Lmxpc3QpIHtcbiAgICAgICAgY29uc3QgbGlzdCA9IGFzdC5saXN0LmZsYXRNYXAoeCA9PiBhc3RUb0VkZ2VMaXN0KHgsIGFzdE5hbWUsIGVkZ2VzKSlcbiAgICAgICAgcmV0dXJuIFsuLi5hZGRpdGlvbnMsIC4uLmVkZ2VzLCAuLi5saXN0XVxuICAgIH1cblxuICAgIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiByYW5kb20oKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KDEwMDAwMCAqIE1hdGgucmFuZG9tKCkgKyAnJylcbn0iLCJpbXBvcnQgeyBHcmFwaE5vZGUgfSBmcm9tIFwiLi9Ob2RlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdMaW5lKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZnJvbTogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCB0bzogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9KSB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKVxuICAgIC8vIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBmcm9tTm9kZS5zdHJva2VTdHlsZVxuICAgIGNvbnRleHQubW92ZVRvKGZyb20ueCwgZnJvbS55KVxuICAgIGNvbnRleHQubGluZVRvKHRvLngsIHRvLnkpXG4gICAgY29udGV4dC5zdHJva2UoKVxufSIsImltcG9ydCB7IEdyYXBoTm9kZSB9IGZyb20gXCIuL05vZGVcIlxuXG5leHBvcnQgZnVuY3Rpb24gZHJhd05vZGUoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBub2RlOiBHcmFwaE5vZGUpIHtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBub2RlLmZpbGxTdHlsZVxuICAgIGNvbnRleHQuYXJjKG5vZGUueCwgbm9kZS55LCBub2RlLnJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIHRydWUpXG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IG5vZGUuc3Ryb2tlU3R5bGVcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IG5vZGUuZmlsbFN0eWxlXG4gICAgY29udGV4dC5zdHJva2UoKVxuICAgIGNvbnRleHQuZmlsbCgpXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiNGRjAwMDBcIlxuICAgIGNvbnRleHQuZm9udCA9IFwiMTBweCBBcmlhbFwiLy8yMHB4XG4gICAgY29uc3QgdGV4dE9mZnNldCA9IDEwICogbm9kZS5sYWJlbC5sZW5ndGggLyAyIC8vc29tZSBtYWdpYyBpbiBoZXJlIVxuICAgIGNvbnRleHQuZmlsbFRleHQobm9kZS5sYWJlbCwgbm9kZS54IC0gdGV4dE9mZnNldCwgbm9kZS55KVxufVxuIiwiaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi91dGlscy91bmlxXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb3JkcyhcbiAgICBpbml0aWFsUG9zOiBDb29yZGluYXRlLFxuICAgIGRhdGE6IEVkZ2VMaXN0LFxuICAgIG9sZENvb3JkczogeyBbeDogc3RyaW5nXTogQ29vcmRpbmF0ZSB9ID0ge30sXG4gICAgbmVzdGluZ0ZhY3RvciA9IDEsXG4pOiB7IFt4OiBzdHJpbmddOiBDb29yZGluYXRlIH0ge1xuXG4gICAgY29uc3Qgcm9vdCA9IGdldFJvb3QoZGF0YSkgLy8gbm9kZSB3L291dCBhIHBhcmVudFxuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICAgIHJldHVybiBvbGRDb29yZHNcbiAgICB9XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IGdldENoaWxkcmVuT2Yocm9vdCwgZGF0YSlcbiAgICBjb25zdCByb290UG9zID0gb2xkQ29vcmRzW3Jvb3RdID8/IGluaXRpYWxQb3NcblxuICAgIGNvbnN0IHlPZmZzZXQgPSA1MFxuICAgIGNvbnN0IHhPZmZzZXQgPSAyMDBcblxuICAgIGNvbnN0IGNoaWxkQ29vcmRzID0gY2hpbGRyZW5cbiAgICAgICAgLm1hcCgoYywgaSkgPT4gKHsgW2NdOiB7IHg6IHJvb3RQb3MueCArIGkgKiBuZXN0aW5nRmFjdG9yICogeE9mZnNldCAqIChpICUgMiA9PSAwID8gMSA6IC0xKSwgeTogcm9vdFBvcy55ICsgeU9mZnNldCAqIChuZXN0aW5nRmFjdG9yICsgMSkgfSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG5cbiAgICBjb25zdCByZW1haW5pbmdEYXRhID0gZGF0YS5maWx0ZXIoeCA9PiAheC5pbmNsdWRlcyhyb290KSlcbiAgICBjb25zdCBwYXJ0aWFsUmVzdWx0ID0geyAuLi5vbGRDb29yZHMsIC4uLmNoaWxkQ29vcmRzLCAuLi57IFtyb290XTogcm9vdFBvcyB9IH1cblxuICAgIHJldHVybiBnZXRDb29yZHMoaW5pdGlhbFBvcywgcmVtYWluaW5nRGF0YSwgcGFydGlhbFJlc3VsdCwgMC45ICogbmVzdGluZ0ZhY3Rvcilcbn1cblxuZnVuY3Rpb24gZ2V0Um9vdChlZGdlczogRWRnZUxpc3QpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBlZGdlc1xuICAgICAgICAuZmxhdCgpIC8vIHRoZSBub2Rlc1xuICAgICAgICAuZmlsdGVyKG4gPT4gIWVkZ2VzLnNvbWUoZSA9PiBlWzFdID09PSBuKSlbMF1cbn1cblxuZnVuY3Rpb24gZ2V0Q2hpbGRyZW5PZihwYXJlbnQ6IHN0cmluZywgZWRnZXM6IEVkZ2VMaXN0KSB7XG4gICAgcmV0dXJuIHVuaXEoZWRnZXMuZmlsdGVyKHggPT4geFswXSA9PT0gcGFyZW50KS5tYXAoeCA9PiB4WzFdKSkgLy9UT0RPIGR1cGxpY2F0ZSBjaGlsZHJlbiBhcmVuJ3QgcGxvdHRlZCB0d2ljZSwgYnV0IHN0aWxsIG1ha2UgdGhlIGdyYXBoIHVnbGllciBiZWNhdXNlIHRoZXkgYWRkIFwiaVwiIGluZGVjZXMgaW4gY2hpbGRDb29yZHMgY29tcHV0YXRpb24gYW5kIG1ha2Ugc2luZ2xlIGNoaWxkIGRpc3BsYXkgTk9UIHN0cmFpZ2h0IGRvd24uXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgYXN0VG9FZGdlTGlzdCB9IGZyb20gXCIuL2FzdFRvRWRnZUxpc3RcIlxuaW1wb3J0IHsgZHJhd0xpbmUgfSBmcm9tIFwiLi9kcmF3TGluZVwiXG5pbXBvcnQgeyBkcmF3Tm9kZSB9IGZyb20gXCIuL2RyYXdOb2RlXCJcbmltcG9ydCB7IGdldENvb3JkcyB9IGZyb20gXCIuL2dldENvb3Jkc1wiXG5cbmV4cG9ydCBmdW5jdGlvbiBwbG90QXN0KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgYXN0OiBBc3ROb2RlKSB7XG5cbiAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjb250ZXh0LmNhbnZhcy53aWR0aCwgY29udGV4dC5jYW52YXMuaGVpZ2h0KVxuXG4gICAgY29uc3QgcmVjdCA9IGNvbnRleHQuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBjb25zdCBlZGdlcyA9IGFzdFRvRWRnZUxpc3QoYXN0KVxuICAgIGNvbnN0IGNvb3JkcyA9IGdldENvb3Jkcyh7IHg6IHJlY3QueCAtIHJlY3Qud2lkdGggLyAyLCB5OiByZWN0LnkgfSwgZWRnZXMpXG5cbiAgICBPYmplY3QuZW50cmllcyhjb29yZHMpLmZvckVhY2goYyA9PiB7XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IGNbMF1cbiAgICAgICAgY29uc3QgcG9zID0gY1sxXVxuXG4gICAgICAgIGRyYXdOb2RlKGNvbnRleHQsIHtcbiAgICAgICAgICAgIHg6IHBvcy54LFxuICAgICAgICAgICAgeTogcG9zLnksXG4gICAgICAgICAgICByYWRpdXM6IDIsIC8vMTBcbiAgICAgICAgICAgIGZpbGxTdHlsZTogJyMyMmNjY2MnLFxuICAgICAgICAgICAgc3Ryb2tlU3R5bGU6ICcjMDA5OTk5JyxcbiAgICAgICAgICAgIGxhYmVsOiBuYW1lLnJlcGxhY2VBbGwoL1xcZCsvZywgJycpXG4gICAgICAgIH0pXG5cbiAgICB9KVxuXG4gICAgZWRnZXMuZm9yRWFjaChlID0+IHtcblxuICAgICAgICBjb25zdCBmcm9tID0gY29vcmRzW2VbMF1dXG4gICAgICAgIGNvbnN0IHRvID0gY29vcmRzW2VbMV1dXG5cbiAgICAgICAgaWYgKGZyb20gJiYgdG8pIHtcbiAgICAgICAgICAgIGRyYXdMaW5lKGNvbnRleHQsIGZyb20sIHRvKVxuICAgICAgICB9XG5cbiAgICB9KVxufVxuIiwiaW1wb3J0IHsgZ2V0Q29udGV4dCB9IGZyb20gXCIuLi9iYWNrZW5kL0NvbnRleHRcIjtcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4uL2JhY2tlbmQvVGhpbmdcIjtcbmltcG9ydCB7IGxvZ1ZlcmIgfSBmcm9tIFwiLi4vYmFja2VuZC9WZXJiVGhpbmdcIjtcbmltcG9ydCB7IGdldFBhcnNlciB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9QYXJzZXJcIjtcbmltcG9ydCB7IGV2YWxBc3QgfSBmcm9tIFwiLi4vYmFja2VuZC9ldmFsQXN0XCI7XG5pbXBvcnQgQnJhaW4gZnJvbSBcIi4vQnJhaW5cIjtcbmltcG9ydCB7IEJyYWluTGlzdGVuZXIgfSBmcm9tIFwiLi9CcmFpbkxpc3RlbmVyXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNCcmFpbiBpbXBsZW1lbnRzIEJyYWluIHtcblxuICAgIHJlYWRvbmx5IGNvbnRleHQgPSBnZXRDb250ZXh0KHsgaWQ6ICdnbG9iYWwnIH0pXG4gICAgcHJvdGVjdGVkIGxpc3RlbmVyczogQnJhaW5MaXN0ZW5lcltdID0gW11cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV4ZWN1dGUodGhpcy5jb250ZXh0LmdldFByZWx1ZGUoKSlcbiAgICAgICAgdGhpcy5jb250ZXh0LnNldChsb2dWZXJiLmdldElkKCksIGxvZ1ZlcmIpXG4gICAgICAgIHRoaXMuY29udGV4dC5zZXRMZXhlbWUoeyByb290OiAnbG9nJywgdHlwZTogJ3ZlcmInLCByZWZlcmVudHM6IFtsb2dWZXJiXSB9KVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogVGhpbmdbXSB7XG5cbiAgICAgICAgcmV0dXJuIG5hdGxhbmcuc3BsaXQoJy4nKS5mbGF0TWFwKHggPT4ge1xuXG4gICAgICAgICAgICByZXR1cm4gZ2V0UGFyc2VyKHgsIHRoaXMuY29udGV4dCkucGFyc2VBbGwoKS5mbGF0TWFwKGFzdCA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0czogVGhpbmdbXSA9IFtdXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IGV2YWxBc3QodGhpcy5jb250ZXh0LCBhc3QpXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5mb3JFYWNoKGwgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsLm9uVXBkYXRlKGFzdCwgcmVzdWx0cylcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHNcblxuICAgICAgICAgICAgfSlcblxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGV4ZWN1dGVVbndyYXBwZWQobmF0bGFuZzogc3RyaW5nKTogb2JqZWN0W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5leGVjdXRlKG5hdGxhbmcpLm1hcCh4ID0+IHgudG9KcygpKVxuICAgIH1cblxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBCcmFpbkxpc3RlbmVyKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5saXN0ZW5lcnMuaW5jbHVkZXMobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKVxuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi4vYmFja2VuZC9UaGluZ1wiXG5pbXBvcnQgQmFzaWNCcmFpbiBmcm9tIFwiLi9CYXNpY0JyYWluXCJcbmltcG9ydCB7IEJyYWluTGlzdGVuZXIgfSBmcm9tIFwiLi9CcmFpbkxpc3RlbmVyXCJcblxuLyoqXG4gKiBBIGZhY2FkZSB0byB0aGUgRGVpeGlzY3JpcHQgaW50ZXJwcmV0ZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBCcmFpbiB7XG4gICAgZXhlY3V0ZShuYXRsYW5nOiBzdHJpbmcpOiBUaGluZ1tdXG4gICAgZXhlY3V0ZVVud3JhcHBlZChuYXRsYW5nOiBzdHJpbmcpOiBvYmplY3RbXVxuICAgIGFkZExpc3RlbmVyKGxpc3RlbmVyOiBCcmFpbkxpc3RlbmVyKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJhaW4oKTogQnJhaW4ge1xuICAgIHJldHVybiBuZXcgQmFzaWNCcmFpbigpXG59XG4iLCJpbXBvcnQgTGV4ZXIgZnJvbSBcIi4vTGV4ZXJcIjtcbmltcG9ydCB7IExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL0NvbnRleHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWFnZXJMZXhlciBpbXBsZW1lbnRzIExleGVyIHtcblxuICAgIHByb3RlY3RlZCB0b2tlbnM6IExleGVtZVtdID0gW11cbiAgICBwcm90ZWN0ZWQgd29yZHM6IHN0cmluZ1tdXG4gICAgcHJvdGVjdGVkIF9wb3M6IG51bWJlciA9IDBcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZywgcmVhZG9ubHkgY29udGV4dDogQ29udGV4dCkge1xuXG4gICAgICAgIHRoaXMud29yZHMgPVxuICAgICAgICAgICAgc3BhY2VPdXQoc291cmNlQ29kZSwgWydcIicsICcuJ10pXG4gICAgICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgvXFxzKy8pXG5cbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW5zKClcbiAgICB9XG5cbiAgICByZWZyZXNoVG9rZW5zKCkge1xuICAgICAgICB0aGlzLnRva2VucyA9IHRoaXMud29yZHMubWFwKHcgPT4gdGhpcy5jb250ZXh0LmdldExleGVtZXModykuYXQoMCkgPz8gbWFrZUxleGVtZSh7IHJvb3Q6IHcsIHRva2VuOiB3LCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW10gfSkpXG4gICAgfVxuXG4gICAgbmV4dCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZWZyZXNoVG9rZW5zKClcbiAgICAgICAgdGhpcy5fcG9zKytcbiAgICB9XG5cbiAgICBnZXQgcG9zKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NcbiAgICB9XG5cbiAgICBiYWNrVG8ocG9zOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcG9zID0gcG9zXG4gICAgfVxuXG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMuX3Bvc11cbiAgICB9XG5cbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1zZ30gYXQgJHt0aGlzLl9wb3N9YCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzRW5kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gICAgfVxuXG59XG5cbmZ1bmN0aW9uIHNwYWNlT3V0KHNvdXJjZUNvZGU6IHN0cmluZywgc3BlY2lhbENoYXJzOiBzdHJpbmdbXSkge1xuXG4gICAgcmV0dXJuIHNvdXJjZUNvZGVcbiAgICAgICAgLnNwbGl0KCcnKVxuICAgICAgICAucmVkdWNlKChhLCBjKSA9PiBhICsgKHNwZWNpYWxDaGFycy5pbmNsdWRlcyhjKSA/ICcgJyArIGMgKyAnICcgOiBjKSwgJycpXG5cbn0iLCJpbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENhcmRpbmFsaXR5LCBpc1JlcGVhdGFibGUgfSBmcm9tIFwiLi4vcGFyc2VyL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgcGx1cmFsaXplIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3BsdXJhbGl6ZVwiXG5pbXBvcnQgeyBjb25qdWdhdGUgfSBmcm9tIFwiLi9mdW5jdGlvbnMvY29uanVnYXRlXCJcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvVGhpbmdcIlxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgTGV4ZW1lIHtcbiAgICByZWFkb25seSByb290OiBzdHJpbmdcbiAgICByZWFkb25seSB0eXBlOiBMZXhlbWVUeXBlXG4gICAgcmVhZG9ubHkgdG9rZW4/OiBzdHJpbmdcbiAgICByZWFkb25seSBjYXJkaW5hbGl0eT86IENhcmRpbmFsaXR5XG4gICAgcmVmZXJlbnRzOiBUaGluZ1tdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWtlTGV4ZW1lKGRhdGE6IExleGVtZSk6IExleGVtZSB7XG4gICAgcmV0dXJuIGRhdGFcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGx1cmFsKGxleGVtZTogTGV4ZW1lKSB7XG4gICAgcmV0dXJuIGlzUmVwZWF0YWJsZShsZXhlbWUuY2FyZGluYWxpdHkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYXBvbGF0ZShsZXhlbWU6IExleGVtZSwgY29udGV4dD86IFRoaW5nKTogTGV4ZW1lW10ge1xuXG4gICAgaWYgKGxleGVtZS50eXBlID09PSAnbm91bicgJiYgIWlzUGx1cmFsKGxleGVtZSkpIHtcbiAgICAgICAgcmV0dXJuIFttYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgIHJvb3Q6IGxleGVtZS5yb290LFxuICAgICAgICAgICAgdHlwZTogbGV4ZW1lLnR5cGUsXG4gICAgICAgICAgICB0b2tlbjogcGx1cmFsaXplKGxleGVtZS5yb290KSxcbiAgICAgICAgICAgIGNhcmRpbmFsaXR5OiAnKicsXG4gICAgICAgICAgICByZWZlcmVudHM6IGxleGVtZS5yZWZlcmVudHNcbiAgICAgICAgfSldXG4gICAgfVxuXG4gICAgaWYgKGxleGVtZS50eXBlID09PSAndmVyYicpIHtcbiAgICAgICAgcmV0dXJuIGNvbmp1Z2F0ZShsZXhlbWUucm9vdCkubWFwKHggPT4gbWFrZUxleGVtZSh7XG4gICAgICAgICAgICByb290OiBsZXhlbWUucm9vdCxcbiAgICAgICAgICAgIHR5cGU6IGxleGVtZS50eXBlLFxuICAgICAgICAgICAgdG9rZW46IHgsXG4gICAgICAgICAgICByZWZlcmVudHM6IGxleGVtZS5yZWZlcmVudHNcbiAgICAgICAgfSkpXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG59XG5cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9Db250ZXh0XCJcbmltcG9ydCBFYWdlckxleGVyIGZyb20gXCIuL0VhZ2VyTGV4ZXJcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCJcblxuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIExleGVyIHtcbiAgICBnZXQgcGVlaygpOiBMZXhlbWVcbiAgICBnZXQgcG9zKCk6IG51bWJlclxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuXG4gICAgbmV4dCgpOiB2b2lkXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZFxuICAgIGNyb2FrKGVycm9yTXNnOiBzdHJpbmcpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMZXhlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBMZXhlciB7XG4gICAgcmV0dXJuIG5ldyBFYWdlckxleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpXG59IiwiZXhwb3J0IGZ1bmN0aW9uIGNvbmp1Z2F0ZSh2ZXJiOnN0cmluZyl7XG4gICAgcmV0dXJuIFt2ZXJiKydzJ11cbn0iLCJleHBvcnQgZnVuY3Rpb24gcGx1cmFsaXplKHJvb3Q6IHN0cmluZykge1xuICAgIHJldHVybiByb290ICsgJ3MnXG59IiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBQYXJzZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1BhcnNlclwiXG5pbXBvcnQgeyBpc05lY2Vzc2FyeSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9DYXJkaW5hbGl0eVwiXG5pbXBvcnQgeyBBc3RUeXBlLCBNZW1iZXIgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9Db250ZXh0XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgcGFyc2VBbGwoKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy50cnlQYXJzZSh0aGlzLmNvbnRleHQuZ2V0U3ludGF4TGlzdCgpKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNpbXBsZUFzdCA9IHRoaXMuc2ltcGxpZnkoYXN0KVxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHNpbXBsZUFzdClcblxuICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIucGVlaz8udHlwZSA9PT0gJ2Z1bGxzdG9wJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgdHJ5UGFyc2UodHlwZXM6IEFzdFR5cGVbXSwgcm9sZT86IFJvbGUsIGV4Y2VwdFR5cGVzPzogQXN0VHlwZVtdKSB7IC8vcHJvYmxlbWF0aWNcblxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4ICYmICFleGNlcHRUeXBlcz8uaW5jbHVkZXMoeC50eXBlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBrbm93blBhcnNlID0gKG5hbWU6IEFzdFR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbWVtYmVycyA9IHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSlcblxuICAgICAgICBpZiAobWVtYmVycy5sZW5ndGggPT09IDEgJiYgbWVtYmVyc1swXS50eXBlLmV2ZXJ5KHQgPT4gdGhpcy5pc0xlYWYodCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxlYWYobWVtYmVyc1swXSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlQ29tcG9zaXRlKG5hbWUgYXMgQ29tcG9zaXRlVHlwZSwgcm9sZSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTGVhZiA9IChtOiBNZW1iZXIpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBpZiAobS50eXBlLmluY2x1ZGVzKHRoaXMubGV4ZXIucGVlay50eXBlKSkge1xuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMubGV4ZXIucGVla1xuICAgICAgICAgICAgdGhpcy5sZXhlci5uZXh0KClcbiAgICAgICAgICAgIHJldHVybiB7IHR5cGU6IHgudHlwZSwgbGV4ZW1lOiB4IH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlQ29tcG9zaXRlID0gKG5hbWU6IENvbXBvc2l0ZVR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IHsgW3g6IHN0cmluZ106IEFzdE5vZGUgfSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHRoaXMuY29udGV4dC5nZXRTeW50YXgobmFtZSkpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZU1lbWJlcihtKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCAmJiBpc05lY2Vzc2FyeShtLm51bWJlcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghYXN0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlua3NbbS5yb2xlID8/IGFzdC50eXBlXSA9IGFzdFxuXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoT2JqZWN0LmtleXMobGlua3MpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogbmFtZSxcbiAgICAgICAgICAgIHJvbGU6IHJvbGUsXG4gICAgICAgICAgICBsaW5rczogbGlua3NcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZU1lbWJlciA9IChtOiBNZW1iZXIsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlzdDogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgaWYgKCFpc1JlcGVhdGFibGUobS5udW1iZXIpICYmIGxpc3QubGVuZ3RoID49IDEpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50cnlQYXJzZShtLnR5cGUsIG0ucm9sZSwgbS5leGNlcHRUeXBlKVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogbGlzdFswXS50eXBlLFxuICAgICAgICAgICAgbGlzdDogbGlzdFxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmdldExleGVtZVR5cGVzKCkuaW5jbHVkZXModCBhcyBMZXhlbWVUeXBlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzaW1wbGlmeShhc3Q6IEFzdE5vZGUpOiBBc3ROb2RlIHtcblxuICAgICAgICBpZiAoIWFzdC5saW5rcykge1xuICAgICAgICAgICAgcmV0dXJuIGFzdFxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3ludGF4ID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChhc3QudHlwZSlcblxuICAgICAgICBpZiAoc3ludGF4Lmxlbmd0aCA9PT0gMSAmJiBPYmplY3QudmFsdWVzKGFzdC5saW5rcykubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaW1wbGlmeShPYmplY3QudmFsdWVzKGFzdC5saW5rcylbMF0pXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzaW1wbGVMaW5rcyA9IE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXMoYXN0LmxpbmtzKVxuICAgICAgICAgICAgLm1hcChsID0+ICh7IFtsWzBdXTogdGhpcy5zaW1wbGlmeShsWzFdKSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG5cbiAgICAgICAgcmV0dXJuIHsgLi4uYXN0LCBsaW5rczogc2ltcGxlTGlua3MgfVxuXG4gICAgfVxuXG59XG4iLCJleHBvcnQgdHlwZSBDYXJkaW5hbGl0eSA9ICcqJyAvLyB6ZXJvIG9yIG1vcmVcbiAgICB8ICcxfDAnIC8vIG9uZSBvciB6ZXJvXG4gICAgfCAnKycgLy8gb25lIG9yIG1vcmVcbiAgICB8IG51bWJlciAvLyBjdXJyZW50bHkgb25seSBzdXBwb3J0cyA9MVxuXG5leHBvcnQgY29uc3QgaXNOZWNlc3NhcnkgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09PSB1bmRlZmluZWQgLy8gbmVjZXNzYXJ5IGJ5IGRlZmF1bHRcbiAgICB8fCBjID09ICcrJ1xuICAgIHx8ICtjID49IDFcblxuZXhwb3J0IGNvbnN0IGlzUmVwZWF0YWJsZSA9IChjPzogQ2FyZGluYWxpdHkpID0+IGMgPT0gJysnXG4gICAgfHwgYyA9PSAnKidcbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vLi4vYmFja2VuZC9Db250ZXh0XCJcbmltcG9ydCB7IEtvb2xQYXJzZXIgfSBmcm9tIFwiLi4vS29vbFBhcnNlclwiXG5pbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4vQXN0Tm9kZVwiXG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFyc2VyIHtcbiAgICBwYXJzZUFsbCgpOiBBc3ROb2RlW11cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhcnNlcihzb3VyY2VDb2RlOiBzdHJpbmcsIGNvbnRleHQ6IENvbnRleHQpOiBQYXJzZXIge1xuICAgIHJldHVybiBuZXcgS29vbFBhcnNlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSwgUm9sZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBNZW1iZXIsIEFzdFR5cGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWNyb1RvU3ludGF4KG1hY3JvOiBBc3ROb2RlKSB7XG5cbiAgICBjb25zdCBtYWNyb3BhcnRzID0gbWFjcm8/LmxpbmtzPy5tYWNyb3BhcnQ/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBzeW50YXggPSBtYWNyb3BhcnRzLm1hcChtID0+IG1hY3JvUGFydFRvTWVtYmVyKG0pKVxuICAgIGNvbnN0IG5hbWUgPSBtYWNybz8ubGlua3M/LnN1YmplY3Q/LmxleGVtZT8ucm9vdFxuXG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQW5vbnltb3VzIHN5bnRheCEnKVxuICAgIH1cblxuICAgIHJldHVybiB7IG5hbWUsIHN5bnRheCB9XG59XG5cbmZ1bmN0aW9uIG1hY3JvUGFydFRvTWVtYmVyKG1hY3JvUGFydDogQXN0Tm9kZSk6IE1lbWJlciB7XG5cbiAgICBjb25zdCBhZGplY3RpdmVOb2RlcyA9IG1hY3JvUGFydC5saW5rcz8uYWRqZWN0aXZlPy5saXN0ID8/IFtdXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IGFkamVjdGl2ZU5vZGVzLmZsYXRNYXAoYSA9PiBhLmxleGVtZSA/PyBbXSlcblxuICAgIGNvbnN0IHRhZ2dlZFVuaW9ucyA9IG1hY3JvUGFydC5saW5rcz8udGFnZ2VkdW5pb24/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBncmFtbWFycyA9IHRhZ2dlZFVuaW9ucy5tYXAoeCA9PiB4LmxpbmtzPy5ub3VuKVxuXG4gICAgY29uc3QgcXVhbnRhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiBhLmNhcmRpbmFsaXR5KVxuICAgIGNvbnN0IHF1YWxhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiAhYS5jYXJkaW5hbGl0eSlcblxuICAgIGNvbnN0IGV4Y2VwdFVuaW9ucyA9IG1hY3JvUGFydC5saW5rcz8uZXhjZXB0dW5pb24/LmxpbmtzPy50YWdnZWR1bmlvbj8ubGlzdCA/PyBbXVxuICAgIGNvbnN0IG5vdEdyYW1tYXJzID0gZXhjZXB0VW5pb25zLm1hcCh4ID0+IHgubGlua3M/Lm5vdW4pXG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBncmFtbWFycy5mbGF0TWFwKGcgPT4gKGc/LmxleGVtZT8ucm9vdCBhcyBBc3RUeXBlKSA/PyBbXSksXG4gICAgICAgIHJvbGU6IHF1YWxhZGpzLmF0KDApPy5yb290IGFzIFJvbGUsXG4gICAgICAgIG51bWJlcjogcXVhbnRhZGpzLmF0KDApPy5jYXJkaW5hbGl0eSxcbiAgICAgICAgZXhjZXB0VHlwZTogbm90R3JhbW1hcnMuZmxhdE1hcChnID0+IChnPy5sZXhlbWU/LnJvb3QgYXMgQXN0VHlwZSkgPz8gW10pLFxuICAgIH1cblxufVxuIiwiaW1wb3J0IHsgQ29tcG9zaXRlVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvc3ludGF4ZXNcIlxuaW1wb3J0IHsgU3ludGF4TWFwLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgY29uc3QgbWF4UHJlY2VkZW5jZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG5cbiAgICByZXR1cm4gaWRDb21wYXJlKGEsIGIpID8/XG4gICAgICAgIGRlcGVuZGVuY3lDb21wYXJlKGEsIGIsIHN5bnRheGVzKSA/P1xuICAgICAgICBsZW5Db21wYXJlKGEsIGIsIHN5bnRheGVzKVxuXG59XG5cbmNvbnN0IGlkQ29tcGFyZSA9IChhOiBBc3RUeXBlLCBiOiBBc3RUeXBlKSA9PiB7XG4gICAgcmV0dXJuIGEgPT0gYiA/IDAgOiB1bmRlZmluZWRcbn1cblxuY29uc3QgZGVwZW5kZW5jeUNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgY29uc3QgYURlcGVuZHNPbkIgPSBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmluY2x1ZGVzKGIpXG4gICAgY29uc3QgYkRlcGVuZHNPbkEgPSBkZXBlbmRlbmNpZXMoYiwgc3ludGF4ZXMpLmluY2x1ZGVzKGEpXG5cbiAgICBpZiAoYURlcGVuZHNPbkIgPT09IGJEZXBlbmRzT25BKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gYURlcGVuZHNPbkIgPyAxIDogLTFcblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kZW5jaWVzKGE6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXAsIHZpc2l0ZWQ6IEFzdFR5cGVbXSA9IFtdKTogQXN0VHlwZVtdIHsgLy9ERlNcblxuICAgIGNvbnN0IG1lbWJlcnMgPSBzeW50YXhlc1thXSA/PyBbXVxuXG4gICAgcmV0dXJuIG1lbWJlcnMuZmxhdE1hcChtID0+IG0udHlwZSkuZmxhdE1hcCh0ID0+IHtcblxuICAgICAgICBpZiAodmlzaXRlZC5pbmNsdWRlcyh0KSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gWy4uLnZpc2l0ZWQsIC4uLmRlcGVuZGVuY2llcyh0IGFzIENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzLCBbLi4udmlzaXRlZCwgdF0pXVxuICAgICAgICB9XG5cbiAgICB9KVxuXG59XG5cbmNvbnN0IGxlbkNvbXBhcmUgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuICAgIHJldHVybiBkZXBlbmRlbmNpZXMoYSwgc3ludGF4ZXMpLmxlbmd0aCAtIGRlcGVuZGVuY2llcyhiLCBzeW50YXhlcykubGVuZ3RoXG59XG4iLCJpbXBvcnQgeyBBc3RDYW52YXMgfSBmcm9tIFwiLi4vZHJhdy1hc3QvQXN0Q2FudmFzXCJcbmltcG9ydCB7IGdldEJyYWluIH0gZnJvbSBcIi4uL2ZhY2FkZS9CcmFpblwiXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1haW4oKSB7XG5cbiAgICBjb25zdCBicmFpbiA9IGdldEJyYWluKCk7XG4gICAgKHdpbmRvdyBhcyBhbnkpLmJyYWluID0gYnJhaW5cblxuICAgIGNvbnN0IGFzdENhbnZhcyA9IG5ldyBBc3RDYW52YXMoKVxuICAgIGJyYWluLmFkZExpc3RlbmVyKGFzdENhbnZhcylcblxuICAgIGNvbnN0IGxlZnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IHJpZ2h0RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcblxuICAgIGNvbnN0IHNwbGl0ID0gJ2hlaWdodDogMTAwJTsgd2lkdGg6IDUwJTsgcG9zaXRpb246IGZpeGVkOyB6LWluZGV4OiAxOyB0b3A6IDA7ICBwYWRkaW5nLXRvcDogMjBweDsnXG4gICAgY29uc3QgbGVmdCA9ICdsZWZ0OiAwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExOydcbiAgICBjb25zdCByaWdodCA9ICdyaWdodDogMDsgYmFja2dyb3VuZC1jb2xvcjogIzAwMDsnXG5cbiAgICBsZWZ0RGl2LnN0eWxlLmNzc1RleHQgPSBzcGxpdCArIGxlZnRcbiAgICByaWdodERpdi5zdHlsZS5jc3NUZXh0ID0gc3BsaXQgKyByaWdodCArICdvdmVyZmxvdzpzY3JvbGw7JyArICdvdmVyZmxvdy14OnNjcm9sbDsnICsgJ292ZXJmbG93LXk6c2Nyb2xsOydcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGVmdERpdilcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJpZ2h0RGl2KVxuXG4gICAgcmlnaHREaXYuYXBwZW5kQ2hpbGQoYXN0Q2FudmFzLmRpdilcblxuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKVxuICAgIHRleHRhcmVhLnN0eWxlLndpZHRoID0gJzQwdncnXG4gICAgdGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gJzQwdmgnXG4gICAgbGVmdERpdi5hcHBlbmRDaGlsZCh0ZXh0YXJlYSlcblxuICAgIGNvbnN0IGNvbnNvbGVPdXRwdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgY29uc29sZU91dHB1dC5zdHlsZS53aWR0aCA9ICc0MHZ3J1xuICAgIGNvbnNvbGVPdXRwdXQuc3R5bGUuaGVpZ2h0ID0gJzQwdmgnXG4gICAgbGVmdERpdi5hcHBlbmRDaGlsZChjb25zb2xlT3V0cHV0KVxuXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBhc3luYyBlID0+IHtcblxuICAgICAgICBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYnJhaW4uZXhlY3V0ZVVud3JhcHBlZCh0ZXh0YXJlYS52YWx1ZSlcbiAgICAgICAgICAgIGNvbnNvbGVPdXRwdXQudmFsdWUgPSByZXN1bHQudG9TdHJpbmcoKVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KVxuICAgICAgICB9IGVsc2UgaWYgKGUuY3RybEtleSAmJiBlLmNvZGUgPT09ICdLZXlZJykge1xuICAgICAgICAgICAgbWFpbigpXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSwgUXVlcnlPcHRzIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgc29ydElkcyB9IGZyb20gXCIuLi9pZC9mdW5jdGlvbnMvc29ydElkc1wiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IHNvbHZlTWFwcyB9IGZyb20gXCIuL2Z1bmN0aW9ucy9zb2x2ZU1hcHNcIjtcbi8vIGltcG9ydCBJbXBseSBmcm9tIFwiLi9JbXBseVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBbmQgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSBoYXNoU3RyaW5nKHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKCkgKyB0aGlzLm5lZ2F0ZWQpXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuY2xhdXNlMS5lbnRpdGllcy5jb25jYXQodGhpcy5jbGF1c2UyLmVudGl0aWVzKSlcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IHRoaXMucmhlbWUgIT09IGVtcHR5Q2xhdXNlXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMTogQ2xhdXNlLFxuICAgICAgICByZWFkb25seSBjbGF1c2UyOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTJJc1JoZW1lID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiBuZXcgQW5kKHRoaXMsIG90aGVyLCBvcHRzPy5hc1JoZW1lID8/IGZhbHNlKVxuICAgIH1cblxuICAgIGNvcHkob3B0cz86IENvcHlPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQoXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UxID8/IHRoaXMuY2xhdXNlMS5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgb3B0cz8uY2xhdXNlMiA/PyB0aGlzLmNsYXVzZTIuY29weShvcHRzKSxcbiAgICAgICAgICAgIHRoaXMuY2xhdXNlMklzUmhlbWUsXG4gICAgICAgICAgICBvcHRzPy5uZWdhdGUgPz8gdGhpcy5uZWdhdGVkLFxuICAgICAgICApXG4gICAgfVxuXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IHRoaXMuY2xhdXNlMS50b1N0cmluZygpICsgJywnICsgdGhpcy5jbGF1c2UyLnRvU3RyaW5nKClcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IGBub3Qke3llc31gIDogeWVzXG4gICAgfVxuXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IHRoaXMuY2xhdXNlMS5vd25lZEJ5KGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVkQnkoaWQpKVxuICAgIG93bmVyc09mID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVyc09mKGlkKS5jb25jYXQodGhpcy5jbGF1c2UyLm93bmVyc09mKGlkKSlcblxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmVnYXRlZCA/IFt0aGlzXSA6IFsuLi50aGlzLmNsYXVzZTEuZmxhdExpc3QoKSwgLi4udGhpcy5jbGF1c2UyLmZsYXRMaXN0KCldXG4gICAgfVxuXG4gICAgZ2V0IHRoZW1lKCk6IENsYXVzZSB7IC8vIGNhbid0IGJlIHByb3AsIGJlY2F1c2Ugd291bGQgYmUgY2FsbGVkIGluIEFuZCdzIGNvbnMsIEJhc2ljQ2x1c2UuYW5kKCkgY2FsbHMgQW5kJ3MgY29ucywgXFxpbmYgcmVjdXJzaW9uIGVuc3Vlc1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMSA6IHRoaXMuY2xhdXNlMS50aGVtZS5hbmQodGhpcy5jbGF1c2UyLnRoZW1lKVxuICAgIH1cblxuICAgIGdldCByaGVtZSgpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jbGF1c2UySXNSaGVtZSA/IHRoaXMuY2xhdXNlMiA6IHRoaXMuY2xhdXNlMS5yaGVtZS5hbmQodGhpcy5jbGF1c2UyLnJoZW1lKVxuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UsIG9wdHM/OiBRdWVyeU9wdHMpOiBNYXBbXSB7XG5cbiAgICAgICAgY29uc3QgdW5pdmVyc2UgPSB0aGlzLmNsYXVzZTEuYW5kKHRoaXMuY2xhdXNlMilcbiAgICAgICAgY29uc3QgaXQgPSBvcHRzPy5pdCA/PyBzb3J0SWRzKHVuaXZlcnNlLmVudGl0aWVzKS5hdCgtMSkhIC8vVE9ETyFcblxuICAgICAgICBjb25zdCB1bml2ZXJzZUxpc3QgPSB1bml2ZXJzZS5mbGF0TGlzdCgpXG4gICAgICAgIGNvbnN0IHF1ZXJ5TGlzdCA9IHF1ZXJ5LmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgbWFwcyA9IHNvbHZlTWFwcyhxdWVyeUxpc3QsIHVuaXZlcnNlTGlzdClcblxuICAgICAgICBjb25zdCBwcm9uTWFwOiBNYXAgPSBxdWVyeUxpc3QuZmlsdGVyKGMgPT4gYy5wcmVkaWNhdGU/LnR5cGUgPT09ICdwcm9ub3VuJykubWFwKGMgPT4gKHsgW2MuYXJncz8uYXQoMCkhXTogaXQgfSkpLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG4gICAgICAgIGNvbnN0IHJlcyA9IG1hcHMuY29uY2F0KHByb25NYXApLmZpbHRlcihtID0+IE9iamVjdC5rZXlzKG0pLmxlbmd0aCkgLy8gZW1wdHkgbWFwcyBjYXVzZSBwcm9ibGVtcyBhbGwgYXJvdW5kIHRoZSBjb2RlIVxuXG4gICAgICAgIHJldHVybiByZXNcbiAgICB9XG5cbiAgICBnZXQgc2ltcGxlKCkge1xuXG4gICAgICAgIGNvbnN0IGMxID0gdGhpcy5jbGF1c2UxLnNpbXBsZVxuICAgICAgICBjb25zdCBjMiA9IHRoaXMuY2xhdXNlMi5zaW1wbGVcblxuICAgICAgICBpZiAoYzIuaGFzaENvZGUgPT09IGVtcHR5Q2xhdXNlLmhhc2hDb2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gYzFcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjMS5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29weSh7IGNsYXVzZTE6IGMxLCBjbGF1c2UyOiBjMiB9KVxuICAgIH1cblxuICAgIC8vIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IG5ldyBJbXBseSh0aGlzLCBjb25jbHVzaW9uKVxuXG59XG4iLCJpbXBvcnQgeyBDbGF1c2UsIEFuZE9wdHMsIENvcHlPcHRzLCBlbXB0eUNsYXVzZSB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcbmltcG9ydCBBbmQgZnJvbSBcIi4vQW5kXCI7XG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGhhc2hTdHJpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvaGFzaFN0cmluZ1wiO1xuLy8gaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5cbmV4cG9ydCBjbGFzcyBBdG9tQ2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IGVtcHR5Q2xhdXNlXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSB1bmlxKHRoaXMuYXJncylcbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcoSlNPTi5zdHJpbmdpZnkoeyBwcmVkaWNhdGU6IHRoaXMucHJlZGljYXRlLnJvb3QsIGFyZ3M6IHRoaXMuYXJncywgbmVnYXRlZDogdGhpcy5uZWdhdGVkIH0pKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHByZWRpY2F0ZTogTGV4ZW1lLFxuICAgICAgICByZWFkb25seSBhcmdzOiBJZFtdLFxuICAgICAgICByZWFkb25seSBuZWdhdGVkID0gZmFsc2UsXG4gICAgKSB7XG5cbiAgICB9XG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cykgPT4gbmV3IEF0b21DbGF1c2UoXG4gICAgICAgIHRoaXMucHJlZGljYXRlLFxuICAgICAgICB0aGlzLmFyZ3MubWFwKGEgPT4gb3B0cz8ubWFwPy5bYV0gPz8gYSksXG4gICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgKVxuXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgZmxhdExpc3QgPSAoKSA9PiBbdGhpc11cbiAgICBvd25lZEJ5ID0gKGlkOiBJZCkgPT4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMV0gPT09IGlkID8gW3RoaXMuYXJnc1swXV0gOiBbXVxuICAgIG93bmVyc09mID0gKGlkOiBJZCkgPT4gdGhpcy5wcmVkaWNhdGUucm9vdCA9PT0gJ29mJyAmJiB0aGlzLmFyZ3NbMF0gPT09IGlkID8gW3RoaXMuYXJnc1sxXV0gOiBbXVxuICAgIFxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBjb25zdCB5ZXMgPSBgJHt0aGlzLnByZWRpY2F0ZS5yb290fSgke3RoaXMuYXJnc30pYFxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCgke3llc30pYCA6IHllc1xuICAgIH1cblxuICAgIHF1ZXJ5KHF1ZXJ5OiBDbGF1c2UpOiBNYXBbXSB7XG5cbiAgICAgICAgaWYgKCEocXVlcnkgaW5zdGFuY2VvZiBBdG9tQ2xhdXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wcmVkaWNhdGUucm9vdCAhPT0gcXVlcnkucHJlZGljYXRlLnJvb3QpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWFwID0gcXVlcnkuYXJnc1xuICAgICAgICAubWFwKCh4LCBpKSA9PiAoeyBbeF06IHRoaXMuYXJnc1tpXSB9KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSkpXG5cbiAgICAgICAgcmV0dXJuIFttYXBdXG4gICAgfVxuXG4gICAgLy8gaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG4gICAgXG59IiwiaW1wb3J0IHsgQXRvbUNsYXVzZSB9IGZyb20gXCIuL0F0b21DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIlxuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiXG5pbXBvcnQgRW1wdHlDbGF1c2UgZnJvbSBcIi4vRW1wdHlDbGF1c2VcIlxuaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uLy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiXG5cbi8qKlxuICogQW4gdW5hbWJpZ3VvdXMgcHJlZGljYXRlLWxvZ2ljLWxpa2UgaW50ZXJtZWRpYXRlIHJlcHJlc2VudGF0aW9uXG4gKiBvZiB0aGUgcHJvZ3JhbW1lcidzIGludGVudC5cbiovXG5leHBvcnQgaW50ZXJmYWNlIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZTogbnVtYmVyXG4gICAgcmVhZG9ubHkgZW50aXRpZXM6IElkW11cbiAgICByZWFkb25seSB0aGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgcmhlbWU6IENsYXVzZVxuICAgIHJlYWRvbmx5IHNpbXBsZTogQ2xhdXNlXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2VcbiAgICBhbmQob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2VcbiAgICBmbGF0TGlzdCgpOiBDbGF1c2VbXVxuICAgIG93bmVkQnkoaWQ6IElkKTogSWRbXVxuICAgIG93bmVyc09mKGlkOiBJZCk6IElkW11cbiAgICBxdWVyeShjbGF1c2U6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdXG4gICAgLy8gaW1wbGllcyhjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2VcblxuICAgIHJlYWRvbmx5IHByZWRpY2F0ZT86IExleGVtZVxuICAgIHJlYWRvbmx5IGFyZ3M/OiBJZFtdXG4gICAgcmVhZG9ubHkgbmVnYXRlZD86IGJvb2xlYW5cbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cz86IGJvb2xlYW5cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhdXNlT2YocHJlZGljYXRlOiBMZXhlbWUsIC4uLmFyZ3M6IElkW10pOiBDbGF1c2Uge1xuICAgIHJldHVybiBuZXcgQXRvbUNsYXVzZShwcmVkaWNhdGUsIGFyZ3MpXG59XG5cbmV4cG9ydCBjb25zdCBlbXB0eUNsYXVzZTogQ2xhdXNlID0gbmV3IEVtcHR5Q2xhdXNlKClcblxuZXhwb3J0IGludGVyZmFjZSBDb3B5T3B0cyB7XG4gICAgbmVnYXRlPzogYm9vbGVhblxuICAgIG1hcD86IE1hcFxuICAgIHNpZGVFZmZlY3R5PzogYm9vbGVhblxuICAgIGNsYXVzZTE/OiBDbGF1c2VcbiAgICBjbGF1c2UyPzogQ2xhdXNlXG4gICAgc3ViamNvbmo/OiBMZXhlbWVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBbmRPcHRzIHtcbiAgICBhc1JoZW1lPzogYm9vbGVhblxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5T3B0cyB7XG4gICAgaXQ/OiBJZFxufSIsImltcG9ydCB7IEFuZE9wdHMsIENsYXVzZSwgQ29weU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVtcHR5Q2xhdXNlIGltcGxlbWVudHMgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gMFxuICAgIHJlYWRvbmx5IGVudGl0aWVzID0gW11cbiAgICByZWFkb25seSB0aGVtZSA9IHRoaXNcbiAgICByZWFkb25seSByaGVtZSA9IHRoaXNcbiAgICByZWFkb25seSBzaW1wbGUgPSB0aGlzXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSBmYWxzZVxuXG4gICAgY29weSA9IChvcHRzPzogQ29weU9wdHMpOiBDbGF1c2UgPT4gdGhpc1xuICAgIGFuZCA9IChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZSA9PiBvdGhlclxuICAgIGltcGxpZXMgPSAoY29uY2x1c2lvbjogQ2xhdXNlKTogQ2xhdXNlID0+IGNvbmNsdXNpb25cbiAgICBmbGF0TGlzdCA9ICgpID0+IFtdXG4gICAgb3duZWRCeSA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiBbXVxuICAgIHF1ZXJ5ID0gKGNsYXVzZTogQ2xhdXNlKTogTWFwW10gPT4gW11cbiAgICB0b1N0cmluZyA9ICgpID0+ICcnXG5cbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCJcbmltcG9ydCB7IGdldFRvcExldmVsIH0gZnJvbSBcIi4vdG9wTGV2ZWxcIlxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlOiBDbGF1c2UsIGVudGl0eTogSWQgfHVuZGVmaW5lZCA9IGdldFRvcExldmVsKGNsYXVzZSlbMF0pOiBJZFtdIHtcblxuICAgIC8vIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICAvLyBjb25zdCB0b3BMZXZlbCA9IGdldFRvcExldmVsKGNsYXVzZSlbMF1cblxuICAgIGlmICghZW50aXR5KSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IG93bmVkRW50aXRpZXMgPSBjbGF1c2Uub3duZWRCeShlbnRpdHkpXG5cbiAgICByZXR1cm4gb3duZWRFbnRpdGllcy5sZW5ndGggPT09IDAgP1xuICAgICAgICBbZW50aXR5XSA6XG4gICAgICAgIFtlbnRpdHldLmNvbmNhdChnZXRPd25lcnNoaXBDaGFpbihjbGF1c2UsIG93bmVkRW50aXRpZXNbMF0pKVxuXG59IiwiaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uLy4uL2lkL01hcFwiO1xuaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuLi8uLi8uLi91dGlscy91bmlxXCI7XG5pbXBvcnQgeyBpbnRlcnNlY3Rpb24gfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHMvaW50ZXJzZWN0aW9uXCI7XG5pbXBvcnQgeyBTcGVjaWFsSWRzIH0gZnJvbSBcIi4uLy4uL2lkL0lkXCI7XG5pbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbi8qKlxuICogRmluZHMgcG9zc2libGUgTWFwLWluZ3MgZnJvbSBxdWVyeUxpc3QgdG8gdW5pdmVyc2VMaXN0XG4gKiB7QGxpbmsgXCJmaWxlOi8vLi8uLi8uLi8uLi8uLi8uLi9kb2NzL25vdGVzL3VuaWZpY2F0aW9uLWFsZ28ubWRcIn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNvbHZlTWFwcyhxdWVyeUxpc3Q6IENsYXVzZVtdLCB1bml2ZXJzZUxpc3Q6IENsYXVzZVtdKTogTWFwW10ge1xuXG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdCwgdW5pdmVyc2VMaXN0KVxuXG4gICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDEsIGkpID0+IHtcbiAgICAgICAgY2FuZGlkYXRlcy5mb3JFYWNoKChtbDIsIGopID0+IHtcblxuICAgICAgICAgICAgaWYgKG1sMS5sZW5ndGggJiYgbWwyLmxlbmd0aCAmJiBpICE9PSBqKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2UobWwxLCBtbDIpXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tpXSA9IFtdXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlc1tqXSA9IG1lcmdlZFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiBjYW5kaWRhdGVzLmZsYXQoKS5maWx0ZXIoeCA9PiAhaXNJbXBvc2libGUoeCkpXG59XG5cbmZ1bmN0aW9uIGZpbmRDYW5kaWRhdGVzKHF1ZXJ5TGlzdDogQ2xhdXNlW10sIHVuaXZlcnNlTGlzdDogQ2xhdXNlW10pOiBNYXBbXVtdIHtcbiAgICByZXR1cm4gcXVlcnlMaXN0Lm1hcChxID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gdW5pdmVyc2VMaXN0LmZsYXRNYXAodSA9PiB1LnF1ZXJ5KHEpKVxuICAgICAgICByZXR1cm4gcmVzLmxlbmd0aCA/IHJlcyA6IFttYWtlSW1wb3NzaWJsZShxKV1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBtZXJnZShtbDE6IE1hcFtdLCBtbDI6IE1hcFtdKSB7XG5cbiAgICBjb25zdCBtZXJnZWQ6IE1hcFtdID0gW11cblxuICAgIG1sMS5mb3JFYWNoKG0xID0+IHtcbiAgICAgICAgbWwyLmZvckVhY2gobTIgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWFwc0FncmVlKG0xLCBtMikpIHtcbiAgICAgICAgICAgICAgICBtZXJnZWQucHVzaCh7IC4uLm0xLCAuLi5tMiB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiB1bmlxKG1lcmdlZClcbn1cblxuZnVuY3Rpb24gbWFwc0FncmVlKG0xOiBNYXAsIG0yOiBNYXApIHtcbiAgICBjb25zdCBjb21tb25LZXlzID0gaW50ZXJzZWN0aW9uKE9iamVjdC5rZXlzKG0xKSwgT2JqZWN0LmtleXMobTIpKVxuICAgIHJldHVybiBjb21tb25LZXlzLmV2ZXJ5KGsgPT4gbTFba10gPT09IG0yW2tdKVxufVxuXG5mdW5jdGlvbiBtYWtlSW1wb3NzaWJsZShxOiBDbGF1c2UpOiBNYXAge1xuICAgIHJldHVybiBxLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyBbeF06IFNwZWNpYWxJZHMuSU1QT1NTSUJMRSB9KSlcbiAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSwge30pXG59XG5cbmZ1bmN0aW9uIGlzSW1wb3NpYmxlKG1hcDogTWFwKSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMobWFwKS5pbmNsdWRlcyhTcGVjaWFsSWRzLklNUE9TU0lCTEUpXG59IiwiaW1wb3J0IHsgQ2xhdXNlIH0gZnJvbSBcIi4uL0NsYXVzZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VG9wTGV2ZWwoY2xhdXNlOiBDbGF1c2UpIHtcbiAgICByZXR1cm4gY2xhdXNlXG4gICAgICAgIC5lbnRpdGllc1xuICAgICAgICAubWFwKHggPT4gKHsgeCwgb3duZXJzOiBjbGF1c2Uub3duZXJzT2YoeCkgfSkpXG4gICAgICAgIC5maWx0ZXIoeCA9PiB4Lm93bmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIC5tYXAoeCA9PiB4LngpXG59IiwiXG4vKipcbiAqIElkIG9mIGFuIGVudGl0eS5cbiAqL1xuZXhwb3J0IHR5cGUgSWQgPSBzdHJpbmdcblxuLyoqXG4gKiBTb21lIHNwZWNpYWwgSWRzXG4gKi9cbmV4cG9ydCBjb25zdCBTcGVjaWFsSWRzID0ge1xuICAgIElNUE9TU0lCTEU6ICdJTVBPU1NJQkxFJ1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluY3JlbWVudGFsSWQoKTogSWQge1xuICAgIGNvbnN0IG5ld0lkID0gYGlkJHtpZEdlbmVyYXRvci5uZXh0KCkudmFsdWV9YDtcbiAgICByZXR1cm4gbmV3SWRcbn1cblxuY29uc3QgaWRHZW5lcmF0b3IgPSBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCk7XG5cbmZ1bmN0aW9uKiBnZXRJbmNyZW1lbnRhbElkR2VuZXJhdG9yKCkge1xuICAgIGxldCB4ID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB4Kys7XG4gICAgICAgIHlpZWxkIHg7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcblxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGlkVG9OdW0oaWQ6IElkKSB7XG4gICAgcmV0dXJuIHBhcnNlSW50KGlkLnRvU3RyaW5nKCkucmVwbGFjZUFsbCgvXFxEKy9nLCAnJykpO1xufVxuIiwiaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vSWRcIjtcbmltcG9ydCB7IGlkVG9OdW0gfSBmcm9tIFwiLi9pZFRvTnVtXCI7XG5cbi8qKlxuICogU29ydCBpZHMgaW4gYXNjZW5kaW5nIG9yZGVyLlxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0SWRzKGlkczogSWRbXSkge1xuICAgIHJldHVybiBpZHMuc29ydCgoYSwgYikgPT4gaWRUb051bShhKSAtIGlkVG9OdW0oYikpO1xufVxuIiwiXG5leHBvcnQgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcuc3BsaXQoJycpLm1hcChjID0+IGMuY2hhckNvZGVBdCgwKSkucmVkdWNlKChoYXNoLCBjYykgPT4ge1xuICAgICAgICBjb25zdCBoMSA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2NcbiAgICAgICAgcmV0dXJuIGgxICYgaDEgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi91bmlxXCJcblxuLyoqXG4gKiBJbnRlcnNlY3Rpb24gYmV0d2VlbiB0d28gbGlzdHMgb2Ygc3RyaW5ncy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVyc2VjdGlvbih4czogc3RyaW5nW10sIHlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiB1bmlxKHhzLmZpbHRlcih4ID0+IHlzLmluY2x1ZGVzKHgpKVxuICAgICAgICAuY29uY2F0KHlzLmZpbHRlcih5ID0+IHhzLmluY2x1ZGVzKHkpKSkpXG59XG4iLCJcbi8qKlxuICogQ2hlY2tzIGlmIHN0cmluZyBoYXMgYW55IG5vbi1kaWdpdCBjaGFyIChleGNlcHQgZm9yIFwiLlwiKSBiZWZvcmVcbiAqIGNvbnZlcnRpbmcgdG8gbnVtYmVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VOdW1iZXIoc3RyaW5nOiBzdHJpbmcpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuXG4gICAgY29uc3Qgbm9uRGlnID0gc3RyaW5nLm1hdGNoKC9cXEQvZyk/LmF0KDApXG5cbiAgICBpZiAobm9uRGlnICYmIG5vbkRpZyAhPT0gJy4nKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VGbG9hdChzdHJpbmcpXG5cbn0iLCJleHBvcnQgZnVuY3Rpb24gc3RyaW5nTGl0ZXJhbHM8VCBleHRlbmRzIHN0cmluZz4oLi4uYXJnczogVFtdKTogVFtdIHsgcmV0dXJuIGFyZ3M7IH1cbiIsIi8qKlxuICogUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBhbiBhcnJheS4gRXF1YWxpdHkgYnkgSlNPTi5zdHJpbmdpZnkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmlxPFQ+KHNlcTogVFtdKTogVFtdIHtcbiAgICBsZXQgc2VlbiA9IHt9IGFzIGFueVxuXG4gICAgcmV0dXJuIHNlcS5maWx0ZXIoZSA9PiB7XG4gICAgICAgIGNvbnN0IGsgPSBKU09OLnN0cmluZ2lmeShlKVxuICAgICAgICByZXR1cm4gc2Vlbi5oYXNPd25Qcm9wZXJ0eShrKSA/IGZhbHNlIDogKHNlZW5ba10gPSB0cnVlKVxuICAgIH0pXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vYXBwL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9