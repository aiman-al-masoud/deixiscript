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
            return (_a = this.syntaxMap[name]) !== null && _a !== void 0 ? _a : [{ types: [name], number: 1 }]; // TODO: problem, adj is not always 1 !!!!!!
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
        const res = this.config.lexemeTypes.slice(); //copy!
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
    constructor(value, id = value + '') {
        super(id);
        this.value = value;
    }
    toJs() {
        return this.value;
    }
    clone(opts) {
        return new NumberThing(this.value, opts === null || opts === void 0 ? void 0 : opts.id);
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
    var _a;
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
    else if (ast.type === 'copula-sentence') {
        return evalCopulaSentence(context, ast, args);
    }
    else if (ast.type === 'verb-sentence') {
        return evalVerbSentence(context, ast, args);
    }
    else if (ast.subconj) {
        return evalComplexSentence(context, ast, args);
    }
    else if (ast.type === 'noun-phrase') {
        return evalNounPhrase(context, ast, args);
    }
    throw new Error('evalAst() got unexpected ast type: ' + ast.type);
}
exports.evalAst = evalAst;
function evalCopulaSentence(context, ast, args) {
    var _a;
    if (args === null || args === void 0 ? void 0 : args.sideEffects) { // assign the right value to the left value
        const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
        const subject = nounPhraseToClause(ast.subject, { subject: subjectId }).simple;
        const rVal = evalAst(context, ast.predicate, { subject: subjectId });
        const ownerChain = (0, getOwnershipChain_1.getOwnershipChain)(subject);
        const maps = context.query(subject);
        const lexemes = subject.flatList().map(x => x.predicate).filter(x => x);
        const lexemesWithReferent = lexemes.map(x => (Object.assign(Object.assign({}, x), { referents: rVal })));
        if (rVal.every(x => x instanceof InstructionThing_1.InstructionThing)) { // make verb from instructions
            const verb = new VerbThing_1.VerbThing((0, getIncrementalId_1.getIncrementalId)(), rVal);
            context.set(verb.getId(), verb);
            const lexemesWithReferent = lexemes.map(x => (Object.assign(Object.assign({}, x), { referents: [verb], type: 'verb' })));
            lexemesWithReferent.forEach(x => context.setLexeme(x));
            return [verb];
        }
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
        const subject = evalAst(context, ast.subject, args).at(0);
        const predicate = evalAst(context, ast.predicate, args).at(0);
        return (subject === null || subject === void 0 ? void 0 : subject.equals(predicate)) && (!ast.negation) ? [new NumberThing_1.NumberThing(1)] : [];
    }
    console.warn('problem with copula sentence!');
    return [];
}
function about(clause, entity) {
    return clause.flatList().filter(x => x.entities.includes(entity) && x.entities.length <= 1).reduce((a, b) => a.and(b), Clause_1.emptyClause).simple;
}
function evalVerbSentence(context, ast, args) {
    const verb = ast.verb.lexeme.referents.at(0);
    const subject = evalAst(context, ast.subject).at(0);
    const object = ast.object ? evalAst(context, ast.object).at(0) : undefined;
    // console.log('verb=', verb)
    // console.log('subject=', subject)
    // console.log('object=', object)
    // console.log('complements=', complements)
    if (!verb) {
        throw new Error('no such verb ' + ast.verb.lexeme.root);
    }
    return verb.run(context, { subject: subject !== null && subject !== void 0 ? subject : context, object: object !== null && object !== void 0 ? object : context });
}
function evalComplexSentence(context, ast, args) {
    if (ast.subconj.lexeme.root === 'if') {
        if (evalAst(context, ast.condition, Object.assign(Object.assign({}, args), { sideEffects: false })).length) {
            evalAst(context, ast.consequence, Object.assign(Object.assign({}, args), { sideEffects: true }));
        }
    }
    return [];
}
function evalNounPhrase(context, ast, args) {
    var _a, _b, _c, _d, _e;
    const np = nounPhraseToClause(ast, args);
    const maps = context.query(np); // TODO: intra-sentence anaphora resolution
    const interestingIds = getInterestingIds(maps, np);
    let things;
    const andPhrase = ast['and-phrase'] ? evalAst(context, (_a = ast['and-phrase']) === null || _a === void 0 ? void 0 : _a['noun-phrase'], args) : [];
    if (ast.subject.type === 'number-literal') {
        things = evalNumberLiteral(ast.subject).concat(andPhrase);
    }
    else if (ast.subject.type === 'string') {
        things = evalString(context, ast.subject, args).concat(andPhrase);
    }
    else {
        things = interestingIds.map(id => context.get(id)).filter(x => x).map(x => x); // TODO sort by id
    }
    if (ast['math-expression']) {
        const left = things;
        const op = ast['math-expression'].operator.lexeme;
        const right = evalAst(context, (_b = ast['math-expression']) === null || _b === void 0 ? void 0 : _b['noun-phrase']);
        return evalOperation(left, right, op);
    }
    if (isAstPlural(ast) || ast['and-phrase']) { // if universal quantified, I don't care if there's no match
        const limit = (_c = ast['limit-phrase']) === null || _c === void 0 ? void 0 : _c['number-literal'];
        const limitNum = (_e = (_d = evalNumberLiteral(limit).at(0)) === null || _d === void 0 ? void 0 : _d.toJs()) !== null && _e !== void 0 ? _e : things.length;
        return things.slice(0, limitNum);
    }
    if (things.length) { // non-plural, return single existing Thing
        return things.slice(0, 1);
    }
    // or else create and returns the Thing
    return (args === null || args === void 0 ? void 0 : args.autovivification) ? [createThing(np)] : [];
}
function evalNumberLiteral(ast) {
    var _a, _b, _c;
    if (!ast) {
        return [];
    }
    const fd = ast['first-digit'].lexeme.root;
    const digits = (_c = (_b = (_a = ast.digit) === null || _a === void 0 ? void 0 : _a.list) === null || _b === void 0 ? void 0 : _b.map(x => x.lexeme.root)) !== null && _c !== void 0 ? _c : [];
    const allDigits = [fd].concat(digits);
    const literal = allDigits.reduce((a, b) => a + b, '');
    const z = (0, parseNumber_1.parseNumber)(literal);
    if (z) {
        return [new NumberThing_1.NumberThing(z)];
    }
    return [];
}
function evalOperation(left, right, op) {
    const sums = left.map(x => { var _a; return x.toJs() + ((_a = right.at(0)) === null || _a === void 0 ? void 0 : _a.toJs()); });
    return sums.map(x => new NumberThing_1.NumberThing(x));
}
function nounPhraseToClause(ast, args) {
    var _a, _b, _c;
    const subjectId = (_a = args === null || args === void 0 ? void 0 : args.subject) !== null && _a !== void 0 ? _a : (0, getIncrementalId_1.getIncrementalId)();
    const adjectives = ((_c = (_b = ast === null || ast === void 0 ? void 0 : ast.adjective) === null || _b === void 0 ? void 0 : _b.list) !== null && _c !== void 0 ? _c : []).map(x => x.lexeme).filter(x => x).map(x => (0, Clause_1.clauseOf)(x, subjectId)).reduce((a, b) => a.and(b), Clause_1.emptyClause);
    let noun = Clause_1.emptyClause;
    if ((ast === null || ast === void 0 ? void 0 : ast.subject.type) === 'noun' || (ast === null || ast === void 0 ? void 0 : ast.subject.type) === 'pronoun') {
        noun = (0, Clause_1.clauseOf)(ast.subject.lexeme, subjectId);
    }
    const genitiveComplement = genitiveToClause(ast === null || ast === void 0 ? void 0 : ast['genitive-complement'], { subject: subjectId, autovivification: false, sideEffects: false });
    const andPhrase = evalAndPhrase(ast === null || ast === void 0 ? void 0 : ast['and-phrase'], args);
    return adjectives.and(noun).and(genitiveComplement).and(andPhrase);
}
function evalAndPhrase(andPhrase, args) {
    if (!andPhrase) {
        return Clause_1.emptyClause;
    }
    return nounPhraseToClause(andPhrase['noun-phrase'] /* TODO! args */); // maybe problem if multiple things have same id, query is not gonna find them
}
function genitiveToClause(ast, args) {
    if (!ast) {
        return Clause_1.emptyClause;
    }
    const ownedId = args === null || args === void 0 ? void 0 : args.subject;
    const ownerId = (0, getIncrementalId_1.getIncrementalId)();
    const genitiveParticle = ast['genitive-particle'].lexeme;
    const owner = nounPhraseToClause(ast.owner, { subject: ownerId, autovivification: false, sideEffects: false });
    return (0, Clause_1.clauseOf)(genitiveParticle, ownedId, ownerId).and(owner);
}
function isAstPlural(ast) {
    if (!ast) {
        return false;
    }
    if (ast.type === 'noun-phrase') {
        return ast.uniquant
            || Object.values(ast !== null && ast !== void 0 ? ast : {}).some(x => isAstPlural(x));
    }
    if (ast.type === 'pronoun' || ast.type === 'noun') {
        return (0, Lexeme_1.isPlural)(ast.lexeme);
    }
    return false;
}
function getInterestingIds(maps, clause) {
    // const getNumberOfDots = (id: Id) => id.split('.').length //-1
    // the ones with most dots, because 'color of style of button' 
    // has buttonId.style.color and that's the object the sentence should resolve to
    // possible problem if 'color of button AND button'
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
function createThing(clause) {
    const bases = clause.flatList().map(x => { var _a, _b; return (_b = (_a = x.predicate) === null || _a === void 0 ? void 0 : _a.referents) === null || _b === void 0 ? void 0 : _b[0]; }) /* ONLY FIRST? */.filter(x => x);
    const id = (0, getIncrementalId_1.getIncrementalId)();
    return (0, Thing_1.getThing)({ id, bases });
}
function evalString(context, ast, args) {
    if (!ast) {
        return [];
    }
    const x = ast['string-token'].list.map(x => x.lexeme.token);
    const y = x.join(' ');
    return [new StringThing_1.StringThing(y)];
}
function couldHaveSideEffects(ast) {
    if (ast.type === 'macro') { // this is not ok, it's here just for performance reasons (saving all of the macros is currently expensive) 
        return false;
    }
    return !!(ast.type === 'copula-sentence' || ast.type === 'verb-sentence' || ast.subconj);
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
'pronoun', 'quote', 'makro-keyword', 'except-keyword', 'then-keyword', 'end-keyword', 'genitive-particle', 'dative-particle', 'ablative-particle', 'locative-particle', 'instrumental-particle', 'comitative-particle', 'next-keyword', 'previous-keyword', 'plus-operator', 'digit');


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
    { root: 'be', type: 'copula', token: '=', cardinality: '*', referents: [] },
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
    { root: 'string-token', type: 'adjective', referents: [] },
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
    { root: '0', type: 'digit', referents: [] },
    { root: '1', type: 'digit', referents: [] },
    { root: '2', type: 'digit', referents: [] },
    { root: '3', type: 'digit', referents: [] },
    { root: '4', type: 'digit', referents: [] },
    { root: '5', type: 'digit', referents: [] },
    { root: '6', type: 'digit', referents: [] },
    { root: '7', type: 'digit', referents: [] },
    { root: '8', type: 'digit', referents: [] },
    { root: '9', type: 'digit', referents: [] },
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
    or digit
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
    limit-phrase is next-keyword or previous-keyword then optional number-literal
  end.

  makro
    math-expression is operator plus-operator then noun-phrase
  end.

  makro 
    noun-phrase is 
    optional quantifier 
    then optional article 
    then zero-or-more adjectives
    then optional limit-phrase 
    then subject noun or pronoun or string or number-literal
    then optional math-expression
    then optional subordinate-clause
    then optional genitive-complement
    then optional and-phrase
  end.

  makro 
    verb-sentence is 
    subject noun-phrase 
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
    complex-sentence-one is 
    subconj 
    then condition simple-sentence 
    then then-keyword
    then consequence simple-sentence
  end.

  makro 
    complex-sentence-two is 
    consequence simple-sentence 
    then subconj 
    then condition simple-sentence
  end.

  makro 
    complex-sentence is complex-sentence-one or complex-sentence-two
  end.

  makro 
    string is quote then one-or-more string-token any-lexeme except quote then quote 
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
exports.constituentTypes = (0, stringLiterals_1.stringLiterals)('macro', 'macropart', 'taggedunion', 'exceptunion', 'noun-phrase', 'and-phrase', 'limit-phrase', 'math-expression', 'copula-sentence', 'verb-sentence', 'complex-sentence', 'genitive-complement', 'dative-complement', 'ablative-complement', 'locative-complement', 'instrumental-complement', 'comitative-complement', 'subordinate-clause', 'string', 'number-literal');
exports.staticDescPrecedence = ['macro'];
exports.syntaxes = {
    'macro': [
        { types: ['makro-keyword'], number: 1 },
        { types: ['noun'], number: 1, role: 'subject' },
        { types: ['copula'], number: 1 },
        { types: ['macropart'], number: '+' },
        { types: ['end-keyword'], number: 1 },
    ],
    'macropart': [
        { types: ['adjective'], number: '*' },
        { types: ['taggedunion'], number: '+' },
        { types: ['exceptunion'], number: '1|0' },
        { types: ['then-keyword'], number: '1|0' },
    ],
    'taggedunion': [
        { types: ['noun'], number: 1 },
        { types: ['disjunc'], number: '1|0' },
    ],
    'exceptunion': [
        { types: ['except-keyword'], number: 1 },
        { types: ['taggedunion'], number: '+' },
    ],
    'number-literal': [
        { types: ['digit'], number: 1, role: 'first-digit' },
        { types: ['digit'], number: '*' },
    ],
    'noun-phrase': [],
    'and-phrase': [],
    'limit-phrase': [],
    'math-expression': [],
    'genitive-complement': [],
    'copula-sentence': [],
    'verb-sentence': [],
    'string': [],
    'complex-sentence': [],
    "dative-complement": [],
    "ablative-complement": [],
    "locative-complement": [],
    "instrumental-complement": [],
    "comitative-complement": [],
    'subordinate-clause': [],
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
    const links = Object.entries(ast).filter(e => e[1] && e[1].type);
    const astName = ((_c = (_a = ast.role) !== null && _a !== void 0 ? _a : (_b = ast.lexeme) === null || _b === void 0 ? void 0 : _b.root) !== null && _c !== void 0 ? _c : ast.type) + random();
    const additions = [];
    if (parentName) {
        additions.push([parentName, astName]);
    }
    if (!links.length && !ast.list) { // leaf!
        return [...edges, ...additions];
    }
    if (links.length) {
        return links
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
                // console.log(ast)
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
            spaceOut(sourceCode, ['"', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
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
            const syntax = this.context.getSyntax(name);
            // if the syntax is an "unofficial" AST, aka a CST, get the name of the 
            // actual AST and pass it down to parse composite
            if (syntax.length === 1 && syntax[0].types.every(t => this.isLeaf(t))) {
                return this.parseLeaf(syntax[0]);
            }
            else {
                return this.parseComposite(name, syntax, role);
            }
        };
        this.parseLeaf = (m) => {
            if (m.types.includes(this.lexer.peek.type)) {
                const x = this.lexer.peek;
                this.lexer.next();
                return { type: x.type, lexeme: x };
            }
        };
        this.parseComposite = (name, syntax, role) => {
            var _a;
            const links = {};
            for (const m of syntax) {
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
            return Object.assign({ type: name, role: role }, links); // TODO!
        };
        this.parseMember = (m, role) => {
            const list = []; // TODO!
            while (!this.lexer.isEnd) {
                if (!(0, Cardinality_1.isRepeatable)(m.number) && list.length >= 1) {
                    break;
                }
                const x = this.tryParse(m.types, m.role, m.exceptTypes);
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
        if (this.isLeaf(ast.type) || ast.list) { // if no links return ast
            return ast;
        }
        // const astLinks = Object.values(ast).filter(x => x && x.type).filter(x => x)
        // astLinks.length === 1
        // return astLinks[0]
        const syntax = this.context.getSyntax(ast.type);
        if (syntax.length === 1) {
            const v = Object.values(ast).filter(x => x && x.type).filter(x => x);
            return v[0];
        }
        const simpleLinks = Object
            .entries(ast)
            .filter(x => x.type)
            .map(l => ({ [l[0]]: this.simplify(l[1]) }))
            .reduce((a, b) => (Object.assign(Object.assign({}, a), b)), {});
        return Object.assign(Object.assign({}, ast), simpleLinks);
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
    var _a;
    const macroparts = (_a = macro.macropart.list) !== null && _a !== void 0 ? _a : [];
    const syntax = macroparts.map(m => macroPartToMember(m));
    const name = macro.subject.lexeme.root;
    if (!name) {
        throw new Error('Anonymous syntax!');
    }
    return { name, syntax };
}
exports.macroToSyntax = macroToSyntax;
function macroPartToMember(macroPart) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const adjectiveNodes = (_b = (_a = macroPart === null || macroPart === void 0 ? void 0 : macroPart.adjective) === null || _a === void 0 ? void 0 : _a.list) !== null && _b !== void 0 ? _b : [];
    const adjectives = adjectiveNodes.flatMap(a => { var _a; return (_a = a.lexeme) !== null && _a !== void 0 ? _a : []; });
    const taggedUnions = (_d = (_c = macroPart === null || macroPart === void 0 ? void 0 : macroPart.taggedunion) === null || _c === void 0 ? void 0 : _c.list) !== null && _d !== void 0 ? _d : [];
    const grammars = taggedUnions.map(x => x === null || x === void 0 ? void 0 : x.noun);
    const quantadjs = adjectives.filter(a => a.cardinality);
    const qualadjs = adjectives.filter(a => !a.cardinality);
    const exceptUnions = (_g = (_f = (_e = macroPart === null || macroPart === void 0 ? void 0 : macroPart.exceptunion) === null || _e === void 0 ? void 0 : _e.taggedunion) === null || _f === void 0 ? void 0 : _f.list) !== null && _g !== void 0 ? _g : [];
    const notGrammars = exceptUnions.map(x => x === null || x === void 0 ? void 0 : x.noun);
    return {
        types: grammars.flatMap(g => { var _a, _b; return (_b = (_a = g === null || g === void 0 ? void 0 : g.lexeme) === null || _a === void 0 ? void 0 : _a.root) !== null && _b !== void 0 ? _b : []; }),
        role: (_h = qualadjs.at(0)) === null || _h === void 0 ? void 0 : _h.root,
        number: (_j = quantadjs.at(0)) === null || _j === void 0 ? void 0 : _j.cardinality,
        exceptTypes: notGrammars.flatMap(g => { var _a, _b; return (_b = (_a = g === null || g === void 0 ? void 0 : g.lexeme) === null || _a === void 0 ? void 0 : _a.root) !== null && _b !== void 0 ? _b : []; }),
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
    return members.flatMap(m => m.types).flatMap(t => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM3RSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzVDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDN0MsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUVoRCw2REFBNkQ7SUFDN0QsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNyRCxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3ZELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDcEQsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN2RCxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3pELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDbkQsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN0RCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3BELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDdEQsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN4RCxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRXZELEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFFMUQsd0JBQXdCO0lBQ3hCLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFFdEQsMkNBQTJDO0lBQzNDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMxRSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0UsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRTVFLG1DQUFtQztJQUNuQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3JELEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUU3RCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzlDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDbEQsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQy9DLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDOUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUM5QyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDbEQsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUNoRCxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ2hELEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFFOUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRTlDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDckQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3pELEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDdkQsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUduRCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDeEQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3RELEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMxRCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDeEQsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3hELEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN4RCxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDNUQsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxxQkFBcUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBRTVELEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFHbkQsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0MsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0MsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUMzQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQzNDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDM0MsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtDQUU5Qzs7Ozs7Ozs7Ozs7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QUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDNUQsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQVBELG9CQU9DOzs7Ozs7O1VDVkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9pbmRleC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvQmFzZVRoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9CYXNpY0NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL0NvbnRleHQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL0luc3RydWN0aW9uVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL051bWJlclRoaW5nLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvYmFja2VuZC9TdHJpbmdUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvVGhpbmcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9iYWNrZW5kL1ZlcmJUaGluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2JhY2tlbmQvZXZhbEFzdC50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9Db25maWcudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvTGV4ZW1lVHlwZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2NvbmZpZy9sZXhlbWVzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvY29uZmlnL3ByZWx1ZGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9jb25maWcvc3ludGF4ZXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9Bc3RDYW52YXMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9hc3RUb0VkZ2VMaXN0LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZHJhdy1hc3QvZHJhd0xpbmUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9kcmF3LWFzdC9kcmF3Tm9kZS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L2dldENvb3Jkcy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2RyYXctYXN0L3Bsb3RBc3QudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mYWNhZGUvQmFzaWNCcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2ZhY2FkZS9CcmFpbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL0VhZ2VyTGV4ZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9MZXhlbWUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9MZXhlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL2xleGVyL2Z1bmN0aW9ucy9jb25qdWdhdGUudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9sZXhlci9mdW5jdGlvbnMvcGx1cmFsaXplLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL0tvb2xQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9DYXJkaW5hbGl0eS50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL1BhcnNlci50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL2Zyb250ZW5kL3BhcnNlci9tYWNyb1RvU3ludGF4LnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvZnJvbnRlbmQvcGFyc2VyL21heFByZWNlZGVuY2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9tYWluL21haW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9BbmQudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9BdG9tQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvQ2xhdXNlLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvRW1wdHlDbGF1c2UudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4udHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvc29sdmVNYXBzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2NsYXVzZXMvZnVuY3Rpb25zL3RvcExldmVsLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL0lkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9nZXRJbmNyZW1lbnRhbElkLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9pZFRvTnVtLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvbWlkZGxlL2lkL2Z1bmN0aW9ucy9zb3J0SWRzLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvaGFzaFN0cmluZy50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL2ludGVyc2VjdGlvbi50cyIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvLi9hcHAvc3JjL3V0aWxzL3BhcnNlTnVtYmVyLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy8uL2FwcC9zcmMvdXRpbHMvc3RyaW5nTGl0ZXJhbHMudHMiLCJ3ZWJwYWNrOi8vQGx1eGx1bmFyaXMvdm9pY2VsYW5nLy4vYXBwL3NyYy91dGlscy91bmlxLnRzIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9AbHV4bHVuYXJpcy92b2ljZWxhbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL0BsdXhsdW5hcmlzL3ZvaWNlbGFuZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1haW4gZnJvbSBcIi4vc3JjL21haW4vbWFpblwiO1xuXG5cbm1haW4oKSIsImltcG9ydCB7IGV4dHJhcG9sYXRlLCBMZXhlbWUgfSBmcm9tICcuLi9mcm9udGVuZC9sZXhlci9MZXhlbWUnO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tICcuLi9taWRkbGUvY2xhdXNlcy9DbGF1c2UnO1xuaW1wb3J0IHsgSWQgfSBmcm9tICcuLi9taWRkbGUvaWQvSWQnO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSAnLi4vbWlkZGxlL2lkL01hcCc7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSAnLi4vdXRpbHMvdW5pcSc7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuXG5cbmV4cG9ydCBjbGFzcyBCYXNlVGhpbmcgaW1wbGVtZW50cyBUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGlkOiBJZCxcbiAgICAgICAgcHJvdGVjdGVkIGJhc2VzOiBUaGluZ1tdID0gW10sXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBjaGlsZHJlbjogeyBbaWQ6IElkXTogVGhpbmcgfSA9IHt9LFxuICAgICAgICBwcm90ZWN0ZWQgbGV4ZW1lczogTGV4ZW1lW10gPSBbXSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGdldElkKCk6IElkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWRcbiAgICB9XG5cbiAgICBjbG9uZShvcHRzPzogeyBpZDogSWQgfSk6IFRoaW5nIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCYXNlVGhpbmcoXG4gICAgICAgICAgICBvcHRzPy5pZCA/PyB0aGlzLmlkLCAvLyBjbG9uZXMgaGF2ZSBzYW1lIGlkXG4gICAgICAgICAgICB0aGlzLmJhc2VzLm1hcCh4ID0+IHguY2xvbmUoKSksXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh0aGlzLmNoaWxkcmVuKS5tYXAoZSA9PiAoeyBbZVswXV06IGVbMV0uY2xvbmUoKSB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pKSxcbiAgICAgICAgKVxuICAgIH1cblxuICAgIGV4dGVuZHMgPSAodGhpbmc6IFRoaW5nKSA9PiB7XG4gICAgICAgIHRoaXMudW5leHRlbmRzKHRoaW5nKSAvLyBvciBhdm9pZD9cbiAgICAgICAgdGhpcy5iYXNlcy5wdXNoKHRoaW5nLmNsb25lKCkpXG4gICAgfVxuXG4gICAgdW5leHRlbmRzKHRoaW5nOiBUaGluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmJhc2VzID0gdGhpcy5iYXNlcy5maWx0ZXIoeCA9PiB4LmdldElkKCkgIT09IHRoaW5nLmdldElkKCkpXG4gICAgfVxuXG4gICAgZ2V0ID0gKGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkID0+IHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBpZC5zcGxpdCgnLicpXG4gICAgICAgIGNvbnN0IHAxID0gcGFydHNbMF1cbiAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW3AxXSA/PyB0aGlzLmNoaWxkcmVuW2lkXVxuICAgICAgICBjb25zdCByZXMgPSAvKiBwYXJ0cy5sZW5ndGggPiAxICovIGNoaWxkLmdldElkKCkgIT09IGlkID8gY2hpbGQuZ2V0KGlkIC8qIHBhcnRzLnNsaWNlKDEpLmpvaW4oJy4nKSAqLykgOiBjaGlsZFxuICAgICAgICByZXR1cm4gcmVzID8/IHRoaXMuYmFzZXMuZmluZCh4ID0+IHguZ2V0KGlkKSlcbiAgICB9XG5cbiAgICBzZXQoaWQ6IElkLCB0aGluZzogVGhpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGlsZHJlbltpZF0gPSB0aGluZ1xuICAgICAgICB0aGlzLnNldExleGVtZSh7IHJvb3Q6ICd0aGluZycsIHR5cGU6ICdub3VuJywgcmVmZXJlbnRzOiBbdGhpbmddIH0pIC8vIGV2ZXJ5IHRoaW5nIGlzIGEgdGhpbmdcblxuICAgICAgICAvL1RPRE9cbiAgICAgICAgaWYgKHR5cGVvZiB0aGluZy50b0pzKCkgPT09ICdzdHJpbmcnKSB7IC8vVE9ETyBtYWtlIHRoaXMgcG9seW1vcnBoaWNcbiAgICAgICAgICAgIHRoaXMuc2V0TGV4ZW1lKHsgcm9vdDogJ3N0cmluZycsIHR5cGU6ICdub3VuJywgcmVmZXJlbnRzOiBbdGhpbmddIH0pIFxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGluZy50b0pzKCkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB0aGlzLnNldExleGVtZSh7IHJvb3Q6ICdudW1iZXInLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW3RoaW5nXSB9KVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICB0b0pzKCk6IG9iamVjdCB8IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzIC8vVE9ET29vb29vb29vT08hXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSk6IE1hcFtdIHtcbiAgICAgICAgcmV0dXJuIHVuaXEodGhpcy50b0NsYXVzZShxdWVyeSkucXVlcnkocXVlcnksIHsvKiBpdDogdGhpcy5sYXN0UmVmZXJlbmNlZCAgKi8gfSkpXG4gICAgfVxuXG4gICAgdG9DbGF1c2UgPSAocXVlcnk/OiBDbGF1c2UpOiBDbGF1c2UgPT4ge1xuXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmxleGVtZXNcbiAgICAgICAgICAgIC5mbGF0TWFwKHggPT4geC5yZWZlcmVudHMubWFwKHIgPT4gY2xhdXNlT2YoeCwgci5nZXRJZCgpKSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICAgICAgY29uc3QgeSA9IE9iamVjdFxuICAgICAgICAgICAgLmtleXModGhpcy5jaGlsZHJlbilcbiAgICAgICAgICAgIC5tYXAoeCA9PiBjbGF1c2VPZih7IHJvb3Q6ICdvZicsIHR5cGU6ICdwcmVwb3NpdGlvbicsIHJlZmVyZW50czogW10gfSwgeCwgdGhpcy5pZCkpIC8vIGhhcmRjb2RlZCBlbmdsaXNoIVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYS5hbmQoYiksIGVtcHR5Q2xhdXNlKVxuXG4gICAgICAgIGNvbnN0IHogPSBPYmplY3RcbiAgICAgICAgICAgIC52YWx1ZXModGhpcy5jaGlsZHJlbilcbiAgICAgICAgICAgIC5tYXAoeCA9PiB4LnRvQ2xhdXNlKHF1ZXJ5KSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSlcblxuICAgICAgICByZXR1cm4geC5hbmQoeSkuYW5kKHopLnNpbXBsZVxuICAgIH1cblxuICAgIHNldExleGVtZSA9IChsZXhlbWU6IExleGVtZSkgPT4ge1xuXG4gICAgICAgIGNvbnN0IG9sZCA9IHRoaXMubGV4ZW1lcy5maWx0ZXIoeCA9PiB4LnJvb3QgPT09IGxleGVtZS5yb290KVxuICAgICAgICBjb25zdCB1cGRhdGVkOiBMZXhlbWVbXSA9IG9sZC5tYXAoeCA9PiAoeyAuLi54LCAuLi5sZXhlbWUsIHJlZmVyZW50czogWy4uLngucmVmZXJlbnRzLCAuLi5sZXhlbWUucmVmZXJlbnRzXSB9KSlcbiAgICAgICAgdGhpcy5sZXhlbWVzID0gdGhpcy5sZXhlbWVzLmZpbHRlcih4ID0+IHgucm9vdCAhPT0gbGV4ZW1lLnJvb3QpXG4gICAgICAgIGNvbnN0IHRvQmVBZGRlZCA9IHVwZGF0ZWQubGVuZ3RoID8gdXBkYXRlZCA6IFtsZXhlbWVdXG4gICAgICAgIHRoaXMubGV4ZW1lcy5wdXNoKC4uLnRvQmVBZGRlZClcbiAgICAgICAgY29uc3QgZXh0cmFwb2xhdGVkID0gdG9CZUFkZGVkLmZsYXRNYXAoeCA9PiBleHRyYXBvbGF0ZSh4LCB0aGlzKSlcbiAgICAgICAgdGhpcy5sZXhlbWVzLnB1c2goLi4uZXh0cmFwb2xhdGVkKVxuXG4gICAgfVxuXG4gICAgZ2V0TGV4ZW1lcyA9IChyb290T3JUb2tlbjogc3RyaW5nKTogTGV4ZW1lW10gPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5sZXhlbWVzXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4gcm9vdE9yVG9rZW4gPT09IHgudG9rZW4gfHwgcm9vdE9yVG9rZW4gPT09IHgucm9vdClcbiAgICB9XG5cbiAgICByZW1vdmVMZXhlbWUocm9vdE9yVG9rZW46IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCBnYXJiYWdlID0gdGhpcy5nZXRMZXhlbWVzKHJvb3RPclRva2VuKS5mbGF0TWFwKHggPT4geC5yZWZlcmVudHMpXG4gICAgICAgIGdhcmJhZ2UuZm9yRWFjaCh4ID0+IGRlbGV0ZSB0aGlzLmNoaWxkcmVuW3guZ2V0SWQoKV0pXG4gICAgICAgIHRoaXMubGV4ZW1lcyA9IHRoaXMubGV4ZW1lcy5maWx0ZXIoeCA9PiByb290T3JUb2tlbiAhPT0geC50b2tlbiAmJiByb290T3JUb2tlbiAhPT0geC5yb290KVxuICAgIH1cblxuICAgIGVxdWFscyhvdGhlcjogVGhpbmcpOiBib29sZWFuIHsgLy9UT0RPOiBpbXBsZW1lbnQgbmVzdGVkIHN0cnVjdHVyYWwgZXF1YWxpdHlcbiAgICAgICAgcmV0dXJuIHRoaXMudG9KcygpID09PSBvdGhlcj8udG9KcygpXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCJcbmltcG9ydCB7IGdldENvbmZpZyB9IGZyb20gXCIuLi9jb25maWcvQ29uZmlnXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGV4dHJhcG9sYXRlLCBMZXhlbWUsIG1ha2VMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IE1hY3JvIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgQXN0VHlwZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9TeW50YXhcIlxuaW1wb3J0IHsgbWFjcm9Ub1N5bnRheCB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvbWFjcm9Ub1N5bnRheFwiXG5pbXBvcnQgeyBtYXhQcmVjZWRlbmNlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9tYXhQcmVjZWRlbmNlXCJcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9JZFwiXG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vQ29udGV4dFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIlxuXG5leHBvcnQgY2xhc3MgQmFzaWNDb250ZXh0IGV4dGVuZHMgQmFzZVRoaW5nIGltcGxlbWVudHMgQ29udGV4dCB7XG5cbiAgICBwcm90ZWN0ZWQgc3ludGF4TGlzdDogQ29tcG9zaXRlVHlwZVtdID0gdGhpcy5yZWZyZXNoU3ludGF4TGlzdCgpXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgaWQ6IElkLFxuICAgICAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29uZmlnID0gZ2V0Q29uZmlnKCksXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBzdGF0aWNEZXNjUHJlY2VkZW5jZSA9IGNvbmZpZy5zdGF0aWNEZXNjUHJlY2VkZW5jZSxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHN5bnRheE1hcCA9IGNvbmZpZy5zeW50YXhlcyxcbiAgICAgICAgcHJvdGVjdGVkIGxleGVtZXM6IExleGVtZVtdID0gY29uZmlnLmxleGVtZXMuZmxhdE1hcChsID0+IFtsLCAuLi5leHRyYXBvbGF0ZShsKV0pLFxuICAgICAgICBwcm90ZWN0ZWQgYmFzZXM6IFRoaW5nW10gPSBbXSxcbiAgICAgICAgcHJvdGVjdGVkIGNoaWxkcmVuOiB7IFtpZDogSWRdOiBUaGluZyB9ID0ge30sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGlkLCBiYXNlcywgY2hpbGRyZW4sIGxleGVtZXMpXG5cbiAgICAgICAgdGhpcy5hc3RUeXBlcy5mb3JFYWNoKGcgPT4geyAvL1RPRE8hXG4gICAgICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHtcbiAgICAgICAgICAgICAgICByb290OiBnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdub3VuJyxcbiAgICAgICAgICAgICAgICByZWZlcmVudHM6IFtdLFxuICAgICAgICAgICAgfSkpXG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBnZXRMZXhlbWVUeXBlcygpOiBMZXhlbWVUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcubGV4ZW1lVHlwZXNcbiAgICB9XG5cbiAgICBnZXRQcmVsdWRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5wcmVsdWRlXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlZnJlc2hTeW50YXhMaXN0KCkge1xuICAgICAgICBjb25zdCB4ID0gT2JqZWN0LmtleXModGhpcy5zeW50YXhNYXApIGFzIENvbXBvc2l0ZVR5cGVbXVxuICAgICAgICBjb25zdCB5ID0geC5maWx0ZXIoZSA9PiAhdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuaW5jbHVkZXMoZSkpXG4gICAgICAgIGNvbnN0IHogPSB5LnNvcnQoKGEsIGIpID0+IG1heFByZWNlZGVuY2UoYiwgYSwgdGhpcy5zeW50YXhNYXApKVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuc3RhdGljRGVzY1ByZWNlZGVuY2UuY29uY2F0KHopXG4gICAgfVxuXG4gICAgZ2V0U3ludGF4TGlzdCgpOiBDb21wb3NpdGVUeXBlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5zeW50YXhMaXN0XG4gICAgfVxuXG4gICAgc2V0U3ludGF4ID0gKG1hY3JvOiBNYWNybykgPT4ge1xuICAgICAgICBjb25zdCBzeW50YXggPSBtYWNyb1RvU3ludGF4KG1hY3JvKVxuICAgICAgICB0aGlzLnNldExleGVtZShtYWtlTGV4ZW1lKHsgdHlwZTogJ25vdW4nLCByb290OiBzeW50YXgubmFtZSwgcmVmZXJlbnRzOiBbXSB9KSlcbiAgICAgICAgdGhpcy5zeW50YXhNYXBbc3ludGF4Lm5hbWUgYXMgQ29tcG9zaXRlVHlwZV0gPSBzeW50YXguc3ludGF4XG4gICAgICAgIHRoaXMuc3ludGF4TGlzdCA9IHRoaXMucmVmcmVzaFN5bnRheExpc3QoKVxuICAgIH1cblxuICAgIGdldFN5bnRheCA9IChuYW1lOiBBc3RUeXBlKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN5bnRheE1hcFtuYW1lIGFzIENvbXBvc2l0ZVR5cGVdID8/IFt7IHR5cGVzOiBbbmFtZV0sIG51bWJlcjogMSB9XSAvLyBUT0RPOiBwcm9ibGVtLCBhZGogaXMgbm90IGFsd2F5cyAxICEhISEhIVxuICAgIH1cblxuICAgIGdldCBhc3RUeXBlcygpOiBBc3RUeXBlW10ge1xuICAgICAgICBjb25zdCByZXM6IEFzdFR5cGVbXSA9IHRoaXMuY29uZmlnLmxleGVtZVR5cGVzLnNsaWNlKCkgLy9jb3B5IVxuICAgICAgICByZXMucHVzaCguLi50aGlzLnN0YXRpY0Rlc2NQcmVjZWRlbmNlKVxuICAgICAgICByZXR1cm4gcmVzXG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgY2xvbmUoKTogQ29udGV4dCB7XG4gICAgICAgIHJldHVybiBuZXcgQmFzaWNDb250ZXh0KFxuICAgICAgICAgICAgdGhpcy5pZCxcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgdGhpcy5zdGF0aWNEZXNjUHJlY2VkZW5jZSxcbiAgICAgICAgICAgIHRoaXMuc3ludGF4TWFwLFxuICAgICAgICAgICAgdGhpcy5sZXhlbWVzLFxuICAgICAgICAgICAgdGhpcy5iYXNlcyxcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4sIC8vc2hhbGxvdyBvciBkZWVwP1xuICAgICAgICApXG4gICAgfVxuXG59XG4iLCJcbmltcG9ydCB7IExleGVtZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL0xleGVtZVR5cGVcIjtcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vY29uZmlnL3N5bnRheGVzXCI7XG5pbXBvcnQgeyBNYWNybyB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5pbXBvcnQgeyBBc3RUeXBlLCBTeW50YXggfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IEJhc2ljQ29udGV4dCB9IGZyb20gXCIuL0Jhc2ljQ29udGV4dFwiO1xuaW1wb3J0IHsgVGhpbmcgfSBmcm9tIFwiLi9UaGluZ1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRleHQgZXh0ZW5kcyBUaGluZyB7XG4gICAgZ2V0U3ludGF4KG5hbWU6IEFzdFR5cGUpOiBTeW50YXhcbiAgICBzZXRTeW50YXgobWFjcm86IE1hY3JvKTogdm9pZFxuICAgIGdldFN5bnRheExpc3QoKTogQ29tcG9zaXRlVHlwZVtdXG4gICAgZ2V0TGV4ZW1lVHlwZXMoKTogTGV4ZW1lVHlwZVtdXG4gICAgZ2V0UHJlbHVkZSgpOiBzdHJpbmdcbiAgICBjbG9uZSgpOiBDb250ZXh0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250ZXh0KG9wdHM6IHsgaWQ6IElkIH0pOiBDb250ZXh0IHtcbiAgICByZXR1cm4gbmV3IEJhc2ljQ29udGV4dChvcHRzLmlkKVxufSIsImltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvZnVuY3Rpb25zL2dldEluY3JlbWVudGFsSWRcIjtcbmltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuL0Jhc2VUaGluZ1wiO1xuXG5leHBvcnQgY2xhc3MgSW5zdHJ1Y3Rpb25UaGluZyBleHRlbmRzIEJhc2VUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogQXN0Tm9kZSkge1xuICAgICAgICBzdXBlcihnZXRJbmNyZW1lbnRhbElkKCkpXG4gICAgfVxuXG4gICAgdG9KcygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVxuICAgIH1cblxufSIsImltcG9ydCB7IElkIH0gZnJvbSBcIi4uL21pZGRsZS9pZC9JZFwiO1xuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCI7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCI7XG5cbmV4cG9ydCBjbGFzcyBOdW1iZXJUaGluZyBleHRlbmRzIEJhc2VUaGluZyB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB2YWx1ZTogbnVtYmVyLCBpZDogSWQgPSB2YWx1ZSArICcnKSB7XG4gICAgICAgIHN1cGVyKGlkKVxuICAgIH1cblxuICAgIHRvSnMoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgICB9XG5cbiAgICBjbG9uZShvcHRzPzogeyBpZDogc3RyaW5nIH0gfCB1bmRlZmluZWQpOiBUaGluZyB7IC8vVE9ETyFcbiAgICAgICAgcmV0dXJuIG5ldyBOdW1iZXJUaGluZyh0aGlzLnZhbHVlLCBvcHRzPy5pZClcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvSWRcIlxuaW1wb3J0IHsgQmFzZVRoaW5nIH0gZnJvbSBcIi4vQmFzZVRoaW5nXCJcbmltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4vVGhpbmdcIlxuXG5leHBvcnQgY2xhc3MgU3RyaW5nVGhpbmcgZXh0ZW5kcyBCYXNlVGhpbmcge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgdmFsdWU6IHN0cmluZywgaWQ6IElkID0gdmFsdWUpIHtcbiAgICAgICAgc3VwZXIoaWQpXG4gICAgfVxuXG4gICAgdG9KcygpOiBvYmplY3Qge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSBhcyBhbnkgLy9qcyBzdWNrc1xuICAgIH1cblxuICAgIGNsb25lKG9wdHM/OiB7IGlkOiBzdHJpbmcgfSB8IHVuZGVmaW5lZCk6IFRoaW5nIHsgLy9UT0RPIVxuICAgICAgICAvLyBjb25zdCB4ID0gc3VwZXIuY2xvbmUob3B0cylcbiAgICAgICAgcmV0dXJuIG5ldyBTdHJpbmdUaGluZyh0aGlzLnZhbHVlLCBvcHRzPy5pZClcbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9taWRkbGUvY2xhdXNlcy9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vbWlkZGxlL2lkL0lkXCJcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9taWRkbGUvaWQvTWFwXCJcbmltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuL0Jhc2VUaGluZ1wiXG5cblxuZXhwb3J0IGludGVyZmFjZSBUaGluZyB7XG4gICAgZ2V0KGlkOiBJZCk6IFRoaW5nIHwgdW5kZWZpbmVkXG4gICAgc2V0KGlkOiBJZCwgdGhpbmc6IFRoaW5nKTogdm9pZCAvL3RoaW5nLmlkPz8/XG4gICAgY2xvbmUob3B0cz86IHsgaWQ6IElkIH0pOiBUaGluZ1xuICAgIHRvSnMoKTogb2JqZWN0IHwgbnVtYmVyXG4gICAgdG9DbGF1c2UocXVlcnk/OiBDbGF1c2UpOiBDbGF1c2VcbiAgICBleHRlbmRzKHRoaW5nOiBUaGluZyk6IHZvaWRcbiAgICB1bmV4dGVuZHModGhpbmc6IFRoaW5nKTogdm9pZFxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlKTogTWFwW11cbiAgICBnZXRMZXhlbWVzKHJvb3RPclRva2VuOiBzdHJpbmcpOiBMZXhlbWVbXVxuICAgIHJlbW92ZUxleGVtZShyb290T3JUb2tlbjogc3RyaW5nKTogdm9pZFxuICAgIHNldExleGVtZShsZXhlbWU6IExleGVtZSk6IHZvaWRcbiAgICBnZXRJZCgpOiBJZFxuICAgIGVxdWFscyhvdGhlcjogVGhpbmcpOiBib29sZWFuXG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRoaW5nKGFyZ3M6IHsgaWQ6IElkLCBiYXNlczogVGhpbmdbXSB9KSB7XG4gICAgcmV0dXJuIG5ldyBCYXNlVGhpbmcoYXJncy5pZCwgYXJncy5iYXNlcylcbn0iLCJcbmltcG9ydCB7IGV2YWxBc3QgfSBmcm9tIFwiLi9ldmFsQXN0XCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9taWRkbGUvaWQvSWRcIjtcbmltcG9ydCB7IEJhc2VUaGluZyB9IGZyb20gXCIuL0Jhc2VUaGluZ1wiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuL0NvbnRleHRcIjtcbmltcG9ydCB7IEluc3RydWN0aW9uVGhpbmcgfSBmcm9tIFwiLi9JbnN0cnVjdGlvblRoaW5nXCI7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuL1RoaW5nXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmVyYiBleHRlbmRzIFRoaW5nIHtcbiAgICBydW4oY29udGV4dDogQ29udGV4dCwgYXJnczogeyBbcm9sZSBpbiBWZXJiQXJnc106IFRoaW5nIH0pOiBUaGluZ1tdIC8vIGNhbGxlZCBkaXJlY3RseSBpbiBldmFsVmVyYlNlbnRlbmNlKClcbn1cblxudHlwZSBWZXJiQXJncyA9ICdzdWJqZWN0JyAvL1RPRE9cbiAgICB8ICdvYmplY3QnXG5cbmV4cG9ydCBjbGFzcyBWZXJiVGhpbmcgZXh0ZW5kcyBCYXNlVGhpbmcgaW1wbGVtZW50cyBWZXJiIHtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBpZDogSWQsXG4gICAgICAgIHJlYWRvbmx5IGluc3RydWN0aW9uczogSW5zdHJ1Y3Rpb25UaGluZ1tdLCAvL29yIEluc3RydWN0aW9uVGhpbmc/XG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGlkKVxuICAgIH1cblxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0LCBhcmdzOiB7IHN1YmplY3Q6IFRoaW5nLCBvYmplY3Q6IFRoaW5nLCB9KTogVGhpbmdbXSB7XG5cbiAgICAgICAgY29uc3QgY2xvbmVkQ29udGV4dCA9IGNvbnRleHQuY2xvbmUoKVxuICAgICAgICAvLyBpbmplY3QgYXJncywgcmVtb3ZlIGhhcmNvZGVkIGVuZ2xpc2ghXG4gICAgICAgIC8vVE9PIEkgZ3Vlc3Mgc2V0dGluZyBjb250ZXh0IG9uIGNvbnRleHQgc3ViamVjdCByZXN1bHRzIGluIGFuIGluZiBsb29wL21heCB0b28gbXVjaCByZWN1cnNpb24gZXJyb3JcbiAgICAgICAgLy8gY2xvbmVkQ29udGV4dC5zZXQoYXJncy5zdWJqZWN0LmdldElkKCksIGFyZ3Muc3ViamVjdClcbiAgICAgICAgY2xvbmVkQ29udGV4dC5zZXQoYXJncy5vYmplY3QuZ2V0SWQoKSwgYXJncy5vYmplY3QpXG4gICAgICAgIGNsb25lZENvbnRleHQuc2V0TGV4ZW1lKHsgcm9vdDogJ3N1YmplY3QnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbYXJncy5zdWJqZWN0XSB9KVxuICAgICAgICBjbG9uZWRDb250ZXh0LnNldExleGVtZSh7IHJvb3Q6ICdvYmplY3QnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbYXJncy5vYmplY3RdIH0pXG5cbiAgICAgICAgbGV0IHJlc3VsdHM6IFRoaW5nW10gPSBbXVxuXG4gICAgICAgIHRoaXMuaW5zdHJ1Y3Rpb25zLmZvckVhY2goaXN0cnVjdGlvbiA9PiB7XG4gICAgICAgICAgICByZXN1bHRzID0gZXZhbEFzdChjbG9uZWRDb250ZXh0LCBpc3RydWN0aW9uLnZhbHVlKVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG59XG5cblxuLy8geCBpcyBcImNpYW9cIlxuLy8geSBpcyBcIm1vbmRvXCJcbi8vIHlvdSBsb2cgeCBhbmQgeVxuLy8geW91IGxvZyBcImNhcHJhIVwiXG4vLyBzdHVwaWRpemUgaXMgdGhlIHByZXZpb3VzIFwiMlwiIGluc3RydWN0aW9uc1xuLy8geW91IHN0dXBpZGl6ZVxuZXhwb3J0IGNvbnN0IGxvZ1ZlcmIgPSBuZXcgKGNsYXNzIGV4dGVuZHMgVmVyYlRoaW5nIHsgLy9UT0RPOiB0YWtlIGxvY2F0aW9uIGNvbXBsZW1lbnQsIGVpdGhlciBjb25zb2xlIG9yIFwic3Rkb3V0XCIgIVxuICAgIHJ1bihjb250ZXh0OiBDb250ZXh0LCBhcmdzOiB7IHN1YmplY3Q6IFRoaW5nOyBvYmplY3Q6IFRoaW5nOyB9KTogVGhpbmdbXSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGFyZ3Mub2JqZWN0LnRvSnMoKSlcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxufSkoJ2xvZycsIFtdKVxuXG5cbiIsImltcG9ydCB7IENvbnRleHQgfSBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IHsgSW5zdHJ1Y3Rpb25UaGluZyB9IGZyb20gJy4vSW5zdHJ1Y3Rpb25UaGluZyc7XG5pbXBvcnQgeyBOdW1iZXJUaGluZyB9IGZyb20gJy4vTnVtYmVyVGhpbmcnO1xuaW1wb3J0IHsgU3RyaW5nVGhpbmcgfSBmcm9tICcuL1N0cmluZ1RoaW5nJztcbmltcG9ydCB7IFRoaW5nLCBnZXRUaGluZyB9IGZyb20gJy4vVGhpbmcnO1xuaW1wb3J0IHsgVmVyYlRoaW5nIH0gZnJvbSAnLi9WZXJiVGhpbmcnO1xuaW1wb3J0IHsgaXNQbHVyYWwsIExleGVtZSwgbWFrZUxleGVtZSB9IGZyb20gJy4uL2Zyb250ZW5kL2xleGVyL0xleGVtZSc7XG5pbXBvcnQgeyBBbmRQaHJhc2UsIEFzdE5vZGUsIENvbXBsZXhTZW50ZW5jZSwgQ29wdWxhU2VudGVuY2UsIEdlbml0aXZlQ29tcGxlbWVudCwgTm91blBocmFzZSwgTnVtYmVyTGl0ZXJhbCwgU3RyaW5nQXN0LCBWZXJiU2VudGVuY2UgfSBmcm9tICcuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlJztcbmltcG9ydCB7IHBhcnNlTnVtYmVyIH0gZnJvbSAnLi4vdXRpbHMvcGFyc2VOdW1iZXInO1xuaW1wb3J0IHsgQ2xhdXNlLCBjbGF1c2VPZiwgZW1wdHlDbGF1c2UgfSBmcm9tICcuLi9taWRkbGUvY2xhdXNlcy9DbGF1c2UnO1xuaW1wb3J0IHsgZ2V0T3duZXJzaGlwQ2hhaW4gfSBmcm9tICcuLi9taWRkbGUvY2xhdXNlcy9mdW5jdGlvbnMvZ2V0T3duZXJzaGlwQ2hhaW4nO1xuaW1wb3J0IHsgZ2V0SW5jcmVtZW50YWxJZCB9IGZyb20gJy4uL21pZGRsZS9pZC9mdW5jdGlvbnMvZ2V0SW5jcmVtZW50YWxJZCc7XG5pbXBvcnQgeyBJZCB9IGZyb20gJy4uL21pZGRsZS9pZC9JZCc7XG5pbXBvcnQgeyBNYXAgfSBmcm9tICcuLi9taWRkbGUvaWQvTWFwJztcblxuXG5leHBvcnQgZnVuY3Rpb24gZXZhbEFzdChjb250ZXh0OiBDb250ZXh0LCBhc3Q6IEFzdE5vZGUsIGFyZ3M6IFRvQ2xhdXNlT3B0cyA9IHt9KTogVGhpbmdbXSB7XG5cbiAgICBhcmdzLnNpZGVFZmZlY3RzID8/PSBjb3VsZEhhdmVTaWRlRWZmZWN0cyhhc3QpXG5cbiAgICBpZiAoYXJncy5zaWRlRWZmZWN0cykgeyAvLyBvbmx5IGNhY2hlIGluc3RydWN0aW9ucyB3aXRoIHNpZGUgZWZmZWN0c1xuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbiA9IG5ldyBJbnN0cnVjdGlvblRoaW5nKGFzdClcbiAgICAgICAgY29udGV4dC5zZXQoaW5zdHJ1Y3Rpb24uZ2V0SWQoKSwgaW5zdHJ1Y3Rpb24pXG4gICAgICAgIGNvbnRleHQuc2V0TGV4ZW1lKG1ha2VMZXhlbWUoeyByb290OiAnaW5zdHJ1Y3Rpb24nLCB0eXBlOiAnbm91bicsIHJlZmVyZW50czogW2luc3RydWN0aW9uXSB9KSlcbiAgICB9XG5cbiAgICBpZiAoYXN0LnR5cGUgPT09ICdtYWNybycpIHtcbiAgICAgICAgY29udGV4dC5zZXRTeW50YXgoYXN0KTsgcmV0dXJuIFtdXG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PT0gJ2NvcHVsYS1zZW50ZW5jZScpIHtcbiAgICAgICAgcmV0dXJuIGV2YWxDb3B1bGFTZW50ZW5jZShjb250ZXh0LCBhc3QsIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PT0gJ3ZlcmItc2VudGVuY2UnKSB7XG4gICAgICAgIHJldHVybiBldmFsVmVyYlNlbnRlbmNlKGNvbnRleHQsIGFzdCwgYXJncylcbiAgICB9IGVsc2UgaWYgKChhc3QgYXMgYW55KS5zdWJjb25qKSB7XG4gICAgICAgIHJldHVybiBldmFsQ29tcGxleFNlbnRlbmNlKGNvbnRleHQsIGFzdCBhcyBhbnksIGFyZ3MpXG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PT0gJ25vdW4tcGhyYXNlJykge1xuICAgICAgICByZXR1cm4gZXZhbE5vdW5QaHJhc2UoY29udGV4dCwgYXN0LCBhcmdzKVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignZXZhbEFzdCgpIGdvdCB1bmV4cGVjdGVkIGFzdCB0eXBlOiAnICsgYXN0LnR5cGUpXG5cbn1cblxuXG5mdW5jdGlvbiBldmFsQ29wdWxhU2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBDb3B1bGFTZW50ZW5jZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgaWYgKGFyZ3M/LnNpZGVFZmZlY3RzKSB7IC8vIGFzc2lnbiB0aGUgcmlnaHQgdmFsdWUgdG8gdGhlIGxlZnQgdmFsdWVcblxuICAgICAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgICAgICBjb25zdCBzdWJqZWN0ID0gbm91blBocmFzZVRvQ2xhdXNlKGFzdC5zdWJqZWN0LCB7IHN1YmplY3Q6IHN1YmplY3RJZCB9KS5zaW1wbGVcbiAgICAgICAgY29uc3QgclZhbCA9IGV2YWxBc3QoY29udGV4dCwgYXN0LnByZWRpY2F0ZSwgeyBzdWJqZWN0OiBzdWJqZWN0SWQgfSlcbiAgICAgICAgY29uc3Qgb3duZXJDaGFpbiA9IGdldE93bmVyc2hpcENoYWluKHN1YmplY3QpXG4gICAgICAgIGNvbnN0IG1hcHMgPSBjb250ZXh0LnF1ZXJ5KHN1YmplY3QpXG4gICAgICAgIGNvbnN0IGxleGVtZXMgPSBzdWJqZWN0LmZsYXRMaXN0KCkubWFwKHggPT4geC5wcmVkaWNhdGUhKS5maWx0ZXIoeCA9PiB4KVxuICAgICAgICBjb25zdCBsZXhlbWVzV2l0aFJlZmVyZW50ID0gbGV4ZW1lcy5tYXAoeCA9PiAoeyAuLi54LCByZWZlcmVudHM6IHJWYWwgfSkpXG5cbiAgICAgICAgaWYgKHJWYWwuZXZlcnkoeCA9PiB4IGluc3RhbmNlb2YgSW5zdHJ1Y3Rpb25UaGluZykpIHsgLy8gbWFrZSB2ZXJiIGZyb20gaW5zdHJ1Y3Rpb25zXG4gICAgICAgICAgICBjb25zdCB2ZXJiID0gbmV3IFZlcmJUaGluZyhnZXRJbmNyZW1lbnRhbElkKCksIHJWYWwgYXMgSW5zdHJ1Y3Rpb25UaGluZ1tdKVxuICAgICAgICAgICAgY29udGV4dC5zZXQodmVyYi5nZXRJZCgpLCB2ZXJiKVxuICAgICAgICAgICAgY29uc3QgbGV4ZW1lc1dpdGhSZWZlcmVudDogTGV4ZW1lW10gPSBsZXhlbWVzLm1hcCh4ID0+ICh7IC4uLngsIHJlZmVyZW50czogW3ZlcmJdLCB0eXBlOiAndmVyYicgfSkpXG4gICAgICAgICAgICBsZXhlbWVzV2l0aFJlZmVyZW50LmZvckVhY2goeCA9PiBjb250ZXh0LnNldExleGVtZSh4KSlcbiAgICAgICAgICAgIHJldHVybiBbdmVyYl1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbWFwcy5sZW5ndGggJiYgb3duZXJDaGFpbi5sZW5ndGggPD0gMSkgeyAvLyBsVmFsIGlzIGNvbXBsZXRlbHkgbmV3XG4gICAgICAgICAgICBsZXhlbWVzV2l0aFJlZmVyZW50LmZvckVhY2goeCA9PiBjb250ZXh0LnNldExleGVtZSh4KSlcbiAgICAgICAgICAgIHJWYWwuZm9yRWFjaCh4ID0+IGNvbnRleHQuc2V0KHguZ2V0SWQoKSwgeCkpXG4gICAgICAgICAgICByZXR1cm4gclZhbFxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1hcHMubGVuZ3RoICYmIG93bmVyQ2hhaW4ubGVuZ3RoIDw9IDEpIHsgLy8gcmVhc3NpZ25tZW50XG4gICAgICAgICAgICBsZXhlbWVzLmZvckVhY2goeCA9PiBjb250ZXh0LnJlbW92ZUxleGVtZSh4LnJvb3QpKVxuICAgICAgICAgICAgbGV4ZW1lc1dpdGhSZWZlcmVudC5mb3JFYWNoKHggPT4gY29udGV4dC5zZXRMZXhlbWUoeCkpXG4gICAgICAgICAgICByVmFsLmZvckVhY2goeCA9PiBjb250ZXh0LnNldCh4LmdldElkKCksIHgpKVxuICAgICAgICAgICAgcmV0dXJuIHJWYWxcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvd25lckNoYWluLmxlbmd0aCA+IDEpIHsgLy8gbFZhbCBpcyBwcm9wZXJ0eSBvZiBleGlzdGluZyBvYmplY3RcbiAgICAgICAgICAgIGNvbnN0IGFib3V0T3duZXIgPSBhYm91dChzdWJqZWN0LCBvd25lckNoYWluLmF0KC0yKSEpXG4gICAgICAgICAgICBjb25zdCBvd25lcnMgPSBnZXRJbnRlcmVzdGluZ0lkcyhjb250ZXh0LnF1ZXJ5KGFib3V0T3duZXIpLCBhYm91dE93bmVyKS5tYXAoaWQgPT4gY29udGV4dC5nZXQoaWQpISkuZmlsdGVyKHggPT4geClcbiAgICAgICAgICAgIGNvbnN0IG93bmVyID0gb3duZXJzLmF0KDApXG4gICAgICAgICAgICBjb25zdCByVmFsQ2xvbmUgPSByVmFsLm1hcCh4ID0+IHguY2xvbmUoeyBpZDogb3duZXI/LmdldElkKCkgKyAnLicgKyB4LmdldElkKCkgfSkpXG4gICAgICAgICAgICBjb25zdCBsZXhlbWVzV2l0aENsb25lUmVmZXJlbnQgPSBsZXhlbWVzLm1hcCh4ID0+ICh7IC4uLngsIHJlZmVyZW50czogclZhbENsb25lIH0pKVxuICAgICAgICAgICAgbGV4ZW1lc1dpdGhDbG9uZVJlZmVyZW50LmZvckVhY2goeCA9PiBjb250ZXh0LnNldExleGVtZSh4KSlcbiAgICAgICAgICAgIHJWYWxDbG9uZS5mb3JFYWNoKHggPT4gb3duZXI/LnNldCh4LmdldElkKCksIHgpKVxuICAgICAgICAgICAgcmV0dXJuIHJWYWxDbG9uZVxuICAgICAgICB9XG5cbiAgICB9IGVsc2UgeyAvLyBjb21wYXJlIHRoZSByaWdodCBhbmQgbGVmdCB2YWx1ZXNcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IGV2YWxBc3QoY29udGV4dCwgYXN0LnN1YmplY3QsIGFyZ3MpLmF0KDApXG4gICAgICAgIGNvbnN0IHByZWRpY2F0ZSA9IGV2YWxBc3QoY29udGV4dCwgYXN0LnByZWRpY2F0ZSwgYXJncykuYXQoMClcbiAgICAgICAgcmV0dXJuIHN1YmplY3Q/LmVxdWFscyhwcmVkaWNhdGUhKSAmJiAoIWFzdC5uZWdhdGlvbikgPyBbbmV3IE51bWJlclRoaW5nKDEpXSA6IFtdXG4gICAgfVxuXG4gICAgY29uc29sZS53YXJuKCdwcm9ibGVtIHdpdGggY29wdWxhIHNlbnRlbmNlIScpXG4gICAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIGFib3V0KGNsYXVzZTogQ2xhdXNlLCBlbnRpdHk6IElkKSB7XG4gICAgcmV0dXJuIGNsYXVzZS5mbGF0TGlzdCgpLmZpbHRlcih4ID0+IHguZW50aXRpZXMuaW5jbHVkZXMoZW50aXR5KSAmJiB4LmVudGl0aWVzLmxlbmd0aCA8PSAxKS5yZWR1Y2UoKGEsIGIpID0+IGEuYW5kKGIpLCBlbXB0eUNsYXVzZSkuc2ltcGxlXG59XG5cbmZ1bmN0aW9uIGV2YWxWZXJiU2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBWZXJiU2VudGVuY2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHsgLy9UT0RPOiBtdWx0aXBsZSBzdWJqZWN0cy9vYmplY3RzXG5cbiAgICBjb25zdCB2ZXJiID0gYXN0LnZlcmIubGV4ZW1lLnJlZmVyZW50cy5hdCgwKSBhcyBWZXJiVGhpbmcgfCB1bmRlZmluZWRcbiAgICBjb25zdCBzdWJqZWN0ID0gZXZhbEFzdChjb250ZXh0LCBhc3Quc3ViamVjdCkuYXQoMClcbiAgICBjb25zdCBvYmplY3QgPSBhc3Qub2JqZWN0ID8gZXZhbEFzdChjb250ZXh0LCBhc3Qub2JqZWN0KS5hdCgwKSA6IHVuZGVmaW5lZFxuXG4gICAgLy8gY29uc29sZS5sb2coJ3ZlcmI9JywgdmVyYilcbiAgICAvLyBjb25zb2xlLmxvZygnc3ViamVjdD0nLCBzdWJqZWN0KVxuICAgIC8vIGNvbnNvbGUubG9nKCdvYmplY3Q9Jywgb2JqZWN0KVxuICAgIC8vIGNvbnNvbGUubG9nKCdjb21wbGVtZW50cz0nLCBjb21wbGVtZW50cylcblxuICAgIGlmICghdmVyYikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHN1Y2ggdmVyYiAnICsgYXN0LnZlcmIubGV4ZW1lLnJvb3QpXG4gICAgfVxuXG4gICAgcmV0dXJuIHZlcmIucnVuKGNvbnRleHQsIHsgc3ViamVjdDogc3ViamVjdCA/PyBjb250ZXh0LCBvYmplY3Q6IG9iamVjdCA/PyBjb250ZXh0IH0pXG59XG5cbmZ1bmN0aW9uIGV2YWxDb21wbGV4U2VudGVuY2UoY29udGV4dDogQ29udGV4dCwgYXN0OiBDb21wbGV4U2VudGVuY2UsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBUaGluZ1tdIHtcblxuICAgIGlmIChhc3Quc3ViY29uai5sZXhlbWUucm9vdCA9PT0gJ2lmJykge1xuXG4gICAgICAgIGlmIChldmFsQXN0KGNvbnRleHQsIGFzdC5jb25kaXRpb24sIHsgLi4uYXJncywgc2lkZUVmZmVjdHM6IGZhbHNlIH0pLmxlbmd0aCkge1xuICAgICAgICAgICAgZXZhbEFzdChjb250ZXh0LCBhc3QuY29uc2VxdWVuY2UsIHsgLi4uYXJncywgc2lkZUVmZmVjdHM6IHRydWUgfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG59XG5cbmZ1bmN0aW9uIGV2YWxOb3VuUGhyYXNlKGNvbnRleHQ6IENvbnRleHQsIGFzdDogTm91blBocmFzZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgY29uc3QgbnAgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0LCBhcmdzKVxuICAgIGNvbnN0IG1hcHMgPSBjb250ZXh0LnF1ZXJ5KG5wKSAvLyBUT0RPOiBpbnRyYS1zZW50ZW5jZSBhbmFwaG9yYSByZXNvbHV0aW9uXG4gICAgY29uc3QgaW50ZXJlc3RpbmdJZHMgPSBnZXRJbnRlcmVzdGluZ0lkcyhtYXBzLCBucClcbiAgICBsZXQgdGhpbmdzOiBUaGluZ1tdXG4gICAgY29uc3QgYW5kUGhyYXNlID0gYXN0WydhbmQtcGhyYXNlJ10gPyBldmFsQXN0KGNvbnRleHQsIGFzdFsnYW5kLXBocmFzZSddPy5bJ25vdW4tcGhyYXNlJ10sIGFyZ3MpIDogW11cblxuICAgIGlmIChhc3Quc3ViamVjdC50eXBlID09PSAnbnVtYmVyLWxpdGVyYWwnKSB7XG4gICAgICAgIHRoaW5ncyA9IGV2YWxOdW1iZXJMaXRlcmFsKGFzdC5zdWJqZWN0KS5jb25jYXQoYW5kUGhyYXNlIGFzIGFueSlcbiAgICB9IGVsc2UgaWYgKGFzdC5zdWJqZWN0LnR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaW5ncyA9IGV2YWxTdHJpbmcoY29udGV4dCwgYXN0LnN1YmplY3QsIGFyZ3MpLmNvbmNhdChhbmRQaHJhc2UpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpbmdzID0gaW50ZXJlc3RpbmdJZHMubWFwKGlkID0+IGNvbnRleHQuZ2V0KGlkKSkuZmlsdGVyKHggPT4geCkubWFwKHggPT4geCEpIC8vIFRPRE8gc29ydCBieSBpZFxuICAgIH1cblxuICAgIGlmIChhc3RbJ21hdGgtZXhwcmVzc2lvbiddKSB7XG4gICAgICAgIGNvbnN0IGxlZnQgPSB0aGluZ3NcbiAgICAgICAgY29uc3Qgb3AgPSBhc3RbJ21hdGgtZXhwcmVzc2lvbiddLm9wZXJhdG9yLmxleGVtZVxuICAgICAgICBjb25zdCByaWdodCA9IGV2YWxBc3QoY29udGV4dCwgYXN0WydtYXRoLWV4cHJlc3Npb24nXT8uWydub3VuLXBocmFzZSddKVxuICAgICAgICByZXR1cm4gZXZhbE9wZXJhdGlvbihsZWZ0LCByaWdodCwgb3ApXG4gICAgfVxuXG4gICAgaWYgKGlzQXN0UGx1cmFsKGFzdCkgfHwgYXN0WydhbmQtcGhyYXNlJ10pIHsgLy8gaWYgdW5pdmVyc2FsIHF1YW50aWZpZWQsIEkgZG9uJ3QgY2FyZSBpZiB0aGVyZSdzIG5vIG1hdGNoXG4gICAgICAgIGNvbnN0IGxpbWl0ID0gYXN0WydsaW1pdC1waHJhc2UnXT8uWydudW1iZXItbGl0ZXJhbCddXG4gICAgICAgIGNvbnN0IGxpbWl0TnVtID0gZXZhbE51bWJlckxpdGVyYWwobGltaXQpLmF0KDApPy50b0pzKCkgPz8gdGhpbmdzLmxlbmd0aFxuICAgICAgICByZXR1cm4gdGhpbmdzLnNsaWNlKDAsIGxpbWl0TnVtKVxuICAgIH1cblxuICAgIGlmICh0aGluZ3MubGVuZ3RoKSB7IC8vIG5vbi1wbHVyYWwsIHJldHVybiBzaW5nbGUgZXhpc3RpbmcgVGhpbmdcbiAgICAgICAgcmV0dXJuIHRoaW5ncy5zbGljZSgwLCAxKVxuICAgIH1cblxuICAgIC8vIG9yIGVsc2UgY3JlYXRlIGFuZCByZXR1cm5zIHRoZSBUaGluZ1xuICAgIHJldHVybiBhcmdzPy5hdXRvdml2aWZpY2F0aW9uID8gW2NyZWF0ZVRoaW5nKG5wKV0gOiBbXVxuXG59XG5cbmZ1bmN0aW9uIGV2YWxOdW1iZXJMaXRlcmFsKGFzdD86IE51bWJlckxpdGVyYWwpOiBOdW1iZXJUaGluZ1tdIHtcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIGNvbnN0IGZkID0gYXN0WydmaXJzdC1kaWdpdCddLmxleGVtZS5yb290XG4gICAgY29uc3QgZGlnaXRzID0gYXN0LmRpZ2l0Py5saXN0Py5tYXAoeCA9PiB4LmxleGVtZS5yb290KSA/PyBbXVxuICAgIGNvbnN0IGFsbERpZ2l0cyA9IFtmZF0uY29uY2F0KGRpZ2l0cylcbiAgICBjb25zdCBsaXRlcmFsID0gYWxsRGlnaXRzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsICcnKVxuXG4gICAgY29uc3QgeiA9IHBhcnNlTnVtYmVyKGxpdGVyYWwpXG5cbiAgICBpZiAoeikge1xuICAgICAgICByZXR1cm4gW25ldyBOdW1iZXJUaGluZyh6KV1cbiAgICB9XG5cbiAgICByZXR1cm4gW11cbn1cblxuXG5mdW5jdGlvbiBldmFsT3BlcmF0aW9uKGxlZnQ6IFRoaW5nW10sIHJpZ2h0OiBUaGluZ1tdLCBvcD86IExleGVtZSkge1xuICAgIGNvbnN0IHN1bXMgPSBsZWZ0Lm1hcCh4ID0+IHgudG9KcygpIGFzIGFueSArIHJpZ2h0LmF0KDApPy50b0pzKCkpXG4gICAgcmV0dXJuIHN1bXMubWFwKHggPT4gbmV3IE51bWJlclRoaW5nKHgpKVxufVxuXG5mdW5jdGlvbiBub3VuUGhyYXNlVG9DbGF1c2UoYXN0PzogTm91blBocmFzZSwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IENsYXVzZSB7XG5cbiAgICBjb25zdCBzdWJqZWN0SWQgPSBhcmdzPy5zdWJqZWN0ID8/IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IGFkamVjdGl2ZXMgPSAoYXN0Py5hZGplY3RpdmU/Lmxpc3QgPz8gW10pLm1hcCh4ID0+IHgubGV4ZW1lISkuZmlsdGVyKHggPT4geCkubWFwKHggPT4gY2xhdXNlT2YoeCwgc3ViamVjdElkKSkucmVkdWNlKChhLCBiKSA9PiBhLmFuZChiKSwgZW1wdHlDbGF1c2UpXG5cbiAgICBsZXQgbm91biA9IGVtcHR5Q2xhdXNlXG5cbiAgICBpZiAoYXN0Py5zdWJqZWN0LnR5cGUgPT09ICdub3VuJyB8fCBhc3Q/LnN1YmplY3QudHlwZSA9PT0gJ3Byb25vdW4nKSB7XG4gICAgICAgIG5vdW4gPSBjbGF1c2VPZihhc3Quc3ViamVjdC5sZXhlbWUsIHN1YmplY3RJZClcbiAgICB9XG5cbiAgICBjb25zdCBnZW5pdGl2ZUNvbXBsZW1lbnQgPSBnZW5pdGl2ZVRvQ2xhdXNlKGFzdD8uWydnZW5pdGl2ZS1jb21wbGVtZW50J10sIHsgc3ViamVjdDogc3ViamVjdElkLCBhdXRvdml2aWZpY2F0aW9uOiBmYWxzZSwgc2lkZUVmZmVjdHM6IGZhbHNlIH0pXG4gICAgY29uc3QgYW5kUGhyYXNlID0gZXZhbEFuZFBocmFzZShhc3Q/LlsnYW5kLXBocmFzZSddLCBhcmdzKVxuXG4gICAgcmV0dXJuIGFkamVjdGl2ZXMuYW5kKG5vdW4pLmFuZChnZW5pdGl2ZUNvbXBsZW1lbnQpLmFuZChhbmRQaHJhc2UpXG59XG5cbmZ1bmN0aW9uIGV2YWxBbmRQaHJhc2UoYW5kUGhyYXNlPzogQW5kUGhyYXNlLCBhcmdzPzogVG9DbGF1c2VPcHRzKSB7XG5cbiAgICBpZiAoIWFuZFBocmFzZSkge1xuICAgICAgICByZXR1cm4gZW1wdHlDbGF1c2VcbiAgICB9XG5cbiAgICByZXR1cm4gbm91blBocmFzZVRvQ2xhdXNlKGFuZFBocmFzZVsnbm91bi1waHJhc2UnXSAvKiBUT0RPISBhcmdzICovKSAvLyBtYXliZSBwcm9ibGVtIGlmIG11bHRpcGxlIHRoaW5ncyBoYXZlIHNhbWUgaWQsIHF1ZXJ5IGlzIG5vdCBnb25uYSBmaW5kIHRoZW1cbn1cblxuZnVuY3Rpb24gZ2VuaXRpdmVUb0NsYXVzZShhc3Q/OiBHZW5pdGl2ZUNvbXBsZW1lbnQsIGFyZ3M/OiBUb0NsYXVzZU9wdHMpOiBDbGF1c2Uge1xuXG4gICAgaWYgKCFhc3QpIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5Q2xhdXNlXG4gICAgfVxuXG4gICAgY29uc3Qgb3duZWRJZCA9IGFyZ3M/LnN1YmplY3QhXG4gICAgY29uc3Qgb3duZXJJZCA9IGdldEluY3JlbWVudGFsSWQoKVxuICAgIGNvbnN0IGdlbml0aXZlUGFydGljbGUgPSBhc3RbJ2dlbml0aXZlLXBhcnRpY2xlJ10ubGV4ZW1lXG4gICAgY29uc3Qgb3duZXIgPSBub3VuUGhyYXNlVG9DbGF1c2UoYXN0Lm93bmVyLCB7IHN1YmplY3Q6IG93bmVySWQsIGF1dG92aXZpZmljYXRpb246IGZhbHNlLCBzaWRlRWZmZWN0czogZmFsc2UgfSlcbiAgICByZXR1cm4gY2xhdXNlT2YoZ2VuaXRpdmVQYXJ0aWNsZSwgb3duZWRJZCwgb3duZXJJZCkuYW5kKG93bmVyKVxufVxuXG5mdW5jdGlvbiBpc0FzdFBsdXJhbChhc3Q6IEFzdE5vZGUpOiBib29sZWFuIHtcblxuICAgIGlmICghYXN0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmIChhc3QudHlwZSA9PT0gJ25vdW4tcGhyYXNlJykge1xuICAgICAgICByZXR1cm4gKGFzdCBhcyBhbnkpLnVuaXF1YW50XG4gICAgICAgICAgICB8fCBPYmplY3QudmFsdWVzKGFzdCA/PyB7fSkuc29tZSh4ID0+IGlzQXN0UGx1cmFsKHggYXMgYW55KSlcbiAgICB9XG5cbiAgICBpZiAoYXN0LnR5cGUgPT09ICdwcm9ub3VuJyB8fCBhc3QudHlwZSA9PT0gJ25vdW4nKSB7XG4gICAgICAgIHJldHVybiBpc1BsdXJhbChhc3QubGV4ZW1lKVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBnZXRJbnRlcmVzdGluZ0lkcyhtYXBzOiBNYXBbXSwgY2xhdXNlOiBDbGF1c2UpOiBJZFtdIHtcblxuICAgIC8vIGNvbnN0IGdldE51bWJlck9mRG90cyA9IChpZDogSWQpID0+IGlkLnNwbGl0KCcuJykubGVuZ3RoIC8vLTFcbiAgICAvLyB0aGUgb25lcyB3aXRoIG1vc3QgZG90cywgYmVjYXVzZSAnY29sb3Igb2Ygc3R5bGUgb2YgYnV0dG9uJyBcbiAgICAvLyBoYXMgYnV0dG9uSWQuc3R5bGUuY29sb3IgYW5kIHRoYXQncyB0aGUgb2JqZWN0IHRoZSBzZW50ZW5jZSBzaG91bGQgcmVzb2x2ZSB0b1xuICAgIC8vIHBvc3NpYmxlIHByb2JsZW0gaWYgJ2NvbG9yIG9mIGJ1dHRvbiBBTkQgYnV0dG9uJ1xuICAgIC8vIGNvbnN0IGlkcyA9IG1hcHMuZmxhdE1hcCh4ID0+IE9iamVjdC52YWx1ZXMoeCkpXG4gICAgLy8gY29uc3QgbWF4TGVuID0gTWF0aC5tYXgoLi4uaWRzLm1hcCh4ID0+IGdldE51bWJlck9mRG90cyh4KSkpXG4gICAgLy8gcmV0dXJuIGlkcy5maWx0ZXIoeCA9PiBnZXROdW1iZXJPZkRvdHMoeCkgPT09IG1heExlbilcblxuICAgIGNvbnN0IG9jID0gZ2V0T3duZXJzaGlwQ2hhaW4oY2xhdXNlKVxuXG4gICAgaWYgKG9jLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgIHJldHVybiBtYXBzLmZsYXRNYXAoeCA9PiBPYmplY3QudmFsdWVzKHgpKSAvL2FsbFxuICAgIH1cblxuICAgIC8vIFRPRE86IHByb2JsZW0gbm90IHJldHVybmluZyBldmVyeXRoaW5nIGJlY2F1c2Ugb2YgZ2V0T3duZXJzaGlwQ2hhaW4oKVxuICAgIHJldHVybiBtYXBzLmZsYXRNYXAobSA9PiBtW29jLmF0KC0xKSFdKSAvLyBvd25lZCBsZWFmXG5cbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVUaGluZyhjbGF1c2U6IENsYXVzZSk6IFRoaW5nIHtcbiAgICBjb25zdCBiYXNlcyA9IGNsYXVzZS5mbGF0TGlzdCgpLm1hcCh4ID0+IHgucHJlZGljYXRlPy5yZWZlcmVudHM/LlswXSEpLyogT05MWSBGSVJTVD8gKi8uZmlsdGVyKHggPT4geClcbiAgICBjb25zdCBpZCA9IGdldEluY3JlbWVudGFsSWQoKVxuICAgIHJldHVybiBnZXRUaGluZyh7IGlkLCBiYXNlcyB9KVxufVxuXG5mdW5jdGlvbiBldmFsU3RyaW5nKGNvbnRleHQ6IENvbnRleHQsIGFzdD86IFN0cmluZ0FzdCwgYXJncz86IFRvQ2xhdXNlT3B0cyk6IFRoaW5nW10ge1xuXG4gICAgaWYgKCFhc3QpIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgY29uc3QgeCA9IGFzdFsnc3RyaW5nLXRva2VuJ10ubGlzdC5tYXAoeCA9PiB4LmxleGVtZS50b2tlbilcbiAgICBjb25zdCB5ID0geC5qb2luKCcgJylcbiAgICByZXR1cm4gW25ldyBTdHJpbmdUaGluZyh5KV1cbn1cblxuZnVuY3Rpb24gY291bGRIYXZlU2lkZUVmZmVjdHMoYXN0OiBBc3ROb2RlKSB7IC8vIGFueXRoaW5nIHRoYXQgaXMgbm90IGEgbm91bnBocmFzZSBDT1VMRCBoYXZlIHNpZGUgZWZmZWN0c1xuXG4gICAgaWYgKGFzdC50eXBlID09PSAnbWFjcm8nKSB7IC8vIHRoaXMgaXMgbm90IG9rLCBpdCdzIGhlcmUganVzdCBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucyAoc2F2aW5nIGFsbCBvZiB0aGUgbWFjcm9zIGlzIGN1cnJlbnRseSBleHBlbnNpdmUpIFxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICByZXR1cm4gISEoYXN0LnR5cGUgPT09ICdjb3B1bGEtc2VudGVuY2UnIHx8IGFzdC50eXBlID09PSAndmVyYi1zZW50ZW5jZScgfHwgKGFzdCBhcyBhbnkpLnN1YmNvbmopXG59XG5cbmludGVyZmFjZSBUb0NsYXVzZU9wdHMge1xuICAgIHN1YmplY3Q/OiBJZCxcbiAgICBhdXRvdml2aWZpY2F0aW9uPzogYm9vbGVhbixcbiAgICBzaWRlRWZmZWN0cz86IGJvb2xlYW4sXG59IiwiaW1wb3J0IHsgbGV4ZW1lcyB9IGZyb20gXCIuL2xleGVtZXNcIlxuaW1wb3J0IHsgbGV4ZW1lVHlwZXMgfSBmcm9tIFwiLi9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IHByZWx1ZGUgfSBmcm9tIFwiLi9wcmVsdWRlXCJcbmltcG9ydCB7IHN5bnRheGVzLCBzdGF0aWNEZXNjUHJlY2VkZW5jZSB9IGZyb20gXCIuL3N5bnRheGVzXCJcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29uZmlnKCkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbGV4ZW1lVHlwZXMsXG4gICAgICAgIGxleGVtZXMsXG4gICAgICAgIHN5bnRheGVzLFxuICAgICAgICBwcmVsdWRlLFxuICAgICAgICBzdGF0aWNEZXNjUHJlY2VkZW5jZSxcbiAgICAgICAgLy8gdGhpbmdzLFxuICAgIH1cbn1cblxuIiwiaW1wb3J0IHsgRWxlbWVudFR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvRWxlbWVudFR5cGVcIlxuaW1wb3J0IHsgc3RyaW5nTGl0ZXJhbHMgfSBmcm9tIFwiLi4vdXRpbHMvc3RyaW5nTGl0ZXJhbHNcIlxuXG5leHBvcnQgdHlwZSBMZXhlbWVUeXBlID0gRWxlbWVudFR5cGU8dHlwZW9mIGxleGVtZVR5cGVzPlxuXG5leHBvcnQgY29uc3QgbGV4ZW1lVHlwZXMgPSBzdHJpbmdMaXRlcmFscyhcbiAgJ2FkamVjdGl2ZScsXG4gICdjb3B1bGEnLFxuICAnZGVmYXJ0JyxcbiAgJ2luZGVmYXJ0JyxcbiAgJ2Z1bGxzdG9wJyxcbiAgJ2h2ZXJiJyxcbiAgJ3ZlcmInLFxuICAnbmVnYXRpb24nLFxuICAnZXhpc3RxdWFudCcsXG4gICd1bmlxdWFudCcsXG4gICdyZWxwcm9uJyxcbiAgJ25lZ2F0aW9uJyxcbiAgJ25vdW4nLFxuICAncHJlcG9zaXRpb24nLFxuICAnc3ViY29uaicsXG4gICdub25zdWJjb25qJywgLy8gYW5kXG4gICdkaXNqdW5jJywgLy8gb3JcbiAgJ3Byb25vdW4nLFxuICAncXVvdGUnLFxuXG4gICdtYWtyby1rZXl3b3JkJyxcbiAgJ2V4Y2VwdC1rZXl3b3JkJyxcbiAgJ3RoZW4ta2V5d29yZCcsXG4gICdlbmQta2V5d29yZCcsXG5cbiAgJ2dlbml0aXZlLXBhcnRpY2xlJyxcbiAgJ2RhdGl2ZS1wYXJ0aWNsZScsXG4gICdhYmxhdGl2ZS1wYXJ0aWNsZScsXG4gICdsb2NhdGl2ZS1wYXJ0aWNsZScsXG4gICdpbnN0cnVtZW50YWwtcGFydGljbGUnLFxuICAnY29taXRhdGl2ZS1wYXJ0aWNsZScsXG5cbiAgJ25leHQta2V5d29yZCcsXG4gICdwcmV2aW91cy1rZXl3b3JkJyxcblxuICAncGx1cy1vcGVyYXRvcicsXG5cbiAgJ2RpZ2l0JyxcblxuKVxuIiwiaW1wb3J0IHsgTGV4ZW1lIH0gZnJvbSBcIi4uL2Zyb250ZW5kL2xleGVyL0xleGVtZVwiO1xuXG5leHBvcnQgY29uc3QgbGV4ZW1lczogTGV4ZW1lW10gPSBbXG5cbiAgICB7IHJvb3Q6ICdiZScsIHR5cGU6ICdjb3B1bGEnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYmUnLCB0eXBlOiAnY29wdWxhJywgdG9rZW46ICdpcycsIGNhcmRpbmFsaXR5OiAxLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYmUnLCB0eXBlOiAnY29wdWxhJywgdG9rZW46ICc9JywgY2FyZGluYWxpdHk6ICcqJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2JlJywgdHlwZTogJ2NvcHVsYScsIHRva2VuOiAnYXJlJywgY2FyZGluYWxpdHk6ICcqJywgcmVmZXJlbnRzOiBbXSB9LCAvL1RPRE8hIDIrXG4gICAgeyByb290OiAnZG8nLCB0eXBlOiAnaHZlcmInLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnZG8nLCB0eXBlOiAnaHZlcmInLCB0b2tlbjogJ2RvZXMnLCBjYXJkaW5hbGl0eTogMSwgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2hhdmUnLCB0eXBlOiAndmVyYicsIHJlZmVyZW50czogW10gfSwvL3Rlc3RcbiAgICB7IHJvb3Q6ICdub3QnLCB0eXBlOiAnbmVnYXRpb24nLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICAvLyBsb2dpY2FsIHJvbGVzIG9mIGEgY29uc3RpdHVlbnQgdG8gYWJzdHJhY3QgYXdheSB3b3JkIG9yZGVyXG4gICAgeyByb290OiAnc3ViamVjdCcsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAncHJlZGljYXRlJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvYmplY3QnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2NvbmRpdGlvbicsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnY29uc2VxdWVuY2UnLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ293bmVyJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdyZWNlaXZlcicsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnb3JpZ2luJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdsb2NhdGlvbicsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaW5zdHJ1bWVudCcsIHR5cGU6ICdhZGplY3RpdmUnLCByZWZlcmVudHM6IFtdIH0sIC8vbWVhbnNcbiAgICB7IHJvb3Q6ICdjb21wYW5pb24nLCB0eXBlOiAnYWRqZWN0aXZlJywgcmVmZXJlbnRzOiBbXSB9LFxuXG4gICAgeyByb290OiAnc3RyaW5nLXRva2VuJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcblxuICAgIC8vIHJvbGUgb2YgbWF0aCBvcGVyYXRvclxuICAgIHsgcm9vdDogJ29wZXJhdG9yJywgdHlwZTogJ2FkamVjdGl2ZScsIHJlZmVyZW50czogW10gfSxcblxuICAgIC8vIG51bWJlciBvZiB0aW1lcyBhIGNvbnN0aXR1ZW50IGNhbiBhcHBlYXJcbiAgICB7IHJvb3Q6ICdvcHRpb25hbCcsIHR5cGU6ICdhZGplY3RpdmUnLCBjYXJkaW5hbGl0eTogJzF8MCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdvbmUtb3ItbW9yZScsIHR5cGU6ICdhZGplY3RpdmUnLCBjYXJkaW5hbGl0eTogJysnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnemVyby1vci1tb3JlJywgdHlwZTogJ2FkamVjdGl2ZScsIGNhcmRpbmFsaXR5OiAnKicsIHJlZmVyZW50czogW10gfSxcblxuICAgIC8vIGZvciB1c2UgaW4gYSBwYXJ0IG9mIG5vdW4tcGhyYXNlXG4gICAgeyByb290OiAnbmV4dCcsIHR5cGU6ICduZXh0LWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAncHJldmlvdXMnLCB0eXBlOiAncHJldmlvdXMta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcblxuICAgIHsgcm9vdDogJ29yJywgdHlwZTogJ2Rpc2p1bmMnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYW5kJywgdHlwZTogJ25vbnN1YmNvbmonLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnYScsIHR5cGU6ICdpbmRlZmFydCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdhbicsIHR5cGU6ICdpbmRlZmFydCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd0aGUnLCB0eXBlOiAnZGVmYXJ0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2lmJywgdHlwZTogJ3N1YmNvbmonLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnd2hlbicsIHR5cGU6ICdzdWJjb25qJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2V2ZXJ5JywgdHlwZTogJ3VuaXF1YW50JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2FueScsIHR5cGU6ICd1bmlxdWFudCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd0aGF0JywgdHlwZTogJ3JlbHByb24nLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnaXQnLCB0eXBlOiAncHJvbm91bicsIHJlZmVyZW50czogW10gfSxcblxuICAgIHsgcm9vdDogJ1wiJywgdHlwZTogJ3F1b3RlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJy4nLCB0eXBlOiAnZnVsbHN0b3AnLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICB7IHJvb3Q6ICd0aGVuJywgdHlwZTogJ3RoZW4ta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdleGNlcHQnLCB0eXBlOiAnZXhjZXB0LWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnbWFrcm8nLCB0eXBlOiAnbWFrcm8ta2V5d29yZCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdlbmQnLCB0eXBlOiAnZW5kLWtleXdvcmQnLCByZWZlcmVudHM6IFtdIH0sXG5cblxuICAgIHsgcm9vdDogJ29mJywgdHlwZTogJ2dlbml0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ3RvJywgdHlwZTogJ2RhdGl2ZS1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICdmcm9tJywgdHlwZTogJ2FibGF0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ29uJywgdHlwZTogJ2xvY2F0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2luJywgdHlwZTogJ2xvY2F0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2F0JywgdHlwZTogJ2xvY2F0aXZlLXBhcnRpY2xlJywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJ2J5JywgdHlwZTogJ2luc3RydW1lbnRhbC1wYXJ0aWNsZScsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICd3aXRoJywgdHlwZTogJ2NvbWl0YXRpdmUtcGFydGljbGUnLCByZWZlcmVudHM6IFtdIH0sXG5cbiAgICB7IHJvb3Q6ICcrJywgdHlwZTogJ3BsdXMtb3BlcmF0b3InLCByZWZlcmVudHM6IFtdIH0sXG5cblxuICAgIHsgcm9vdDogJzAnLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnMScsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICcyJywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzMnLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnNCcsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICc1JywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzYnLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG4gICAgeyByb290OiAnNycsIHR5cGU6ICdkaWdpdCcsIHJlZmVyZW50czogW10gfSxcbiAgICB7IHJvb3Q6ICc4JywgdHlwZTogJ2RpZ2l0JywgcmVmZXJlbnRzOiBbXSB9LFxuICAgIHsgcm9vdDogJzknLCB0eXBlOiAnZGlnaXQnLCByZWZlcmVudHM6IFtdIH0sXG5cbl1cblxuIiwiZXhwb3J0IGNvbnN0IHByZWx1ZGU6IHN0cmluZyA9XG5cbiAgYFxuICBtYWtybyBcbiAgICBhbnktbGV4ZW1lIGlzIGFkamVjdGl2ZSBcbiAgICBvciBjb3B1bGEgXG4gICAgb3IgZGVmYXJ0IFxuICAgIG9yIGluZGVmYXJ0IFxuICAgIG9yIGZ1bGxzdG9wIFxuICAgIG9yIGh2ZXJiIFxuICAgIG9yIHZlcmIgXG4gICAgb3IgbmVnYXRpb24gXG4gICAgb3IgZXhpc3RxdWFudCBcbiAgICBvciB1bmlxdWFudCBcbiAgICBvciByZWxwcm9uIFxuICAgIG9yIG5lZ2F0aW9uIFxuICAgIG9yIG5vdW4gXG4gICAgb3IgcHJlcG9zaXRpb24gXG4gICAgb3Igc3ViY29uaiBcbiAgICBvciBub25zdWJjb25qIFxuICAgIG9yIGRpc2p1bmMgXG4gICAgb3IgcHJvbm91biBcbiAgICBvciB0aGVuLWtleXdvcmRcbiAgICBvciBtYWtyby1rZXl3b3JkIFxuICAgIG9yIGV4Y2VwdC1rZXl3b3JkIFxuICAgIG9yIHF1b3RlXG4gICAgb3IgZGlnaXRcbiAgZW5kLlxuICBcbiAgbWFrcm8gXG4gICAgcXVhbnRpZmllciBpcyB1bmlxdWFudCBvciBleGlzdHF1YW50IFxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgYXJ0aWNsZSBpcyBpbmRlZmFydCBvciBkZWZhcnQgXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGdlbml0aXZlLWNvbXBsZW1lbnQgaXMgZ2VuaXRpdmUtcGFydGljbGUgdGhlbiBvd25lciBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBkYXRpdmUtY29tcGxlbWVudCBpcyBkYXRpdmUtcGFydGljbGUgdGhlbiByZWNlaXZlciBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBhYmxhdGl2ZS1jb21wbGVtZW50IGlzIGFibGF0aXZlLXBhcnRpY2xlIHRoZW4gb3JpZ2luIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGxvY2F0aXZlLWNvbXBsZW1lbnQgaXMgbG9jYXRpdmUtcGFydGljbGUgdGhlbiBsb2NhdGlvbiBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBpbnN0cnVtZW50YWwtY29tcGxlbWVudCBpcyBpbnN0cnVtZW50YWwtcGFydGljbGUgdGhlbiBpbnN0cnVtZW50IG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtyb1xuICAgIGNvbWl0YXRpdmUtY29tcGxlbWVudCBpcyBjb21pdGF0aXZlLXBhcnRpY2xlIHRoZW4gY29tcGFuaW9uIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBjb21wbGVtZW50IGlzIFxuICAgIGdlbml0aXZlLWNvbXBsZW1lbnQgb3IgXG4gICAgZGF0aXZlLWNvbXBsZW1lbnQgb3JcbiAgICBhYmxhdGl2ZS1jb21wbGVtZW50IG9yXG4gICAgbG9jYXRpdmUtY29tcGxlbWVudCBvclxuICAgIGluc3RydW1lbnRhbC1jb21wbGVtZW50IG9yXG4gICAgY29taXRhdGl2ZS1jb21wbGVtZW50XG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBjb3B1bGEtc2VudGVuY2UgaXMgc3ViamVjdCBub3VuLXBocmFzZSBcbiAgICB0aGVuIGNvcHVsYSBcbiAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgIHRoZW4gcHJlZGljYXRlIG5vdW4tcGhyYXNlIFxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBhbmQtcGhyYXNlIGlzIG5vbnN1YmNvbmogdGhlbiBub3VuLXBocmFzZVxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBsaW1pdC1waHJhc2UgaXMgbmV4dC1rZXl3b3JkIG9yIHByZXZpb3VzLWtleXdvcmQgdGhlbiBvcHRpb25hbCBudW1iZXItbGl0ZXJhbFxuICBlbmQuXG5cbiAgbWFrcm9cbiAgICBtYXRoLWV4cHJlc3Npb24gaXMgb3BlcmF0b3IgcGx1cy1vcGVyYXRvciB0aGVuIG5vdW4tcGhyYXNlXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBub3VuLXBocmFzZSBpcyBcbiAgICBvcHRpb25hbCBxdWFudGlmaWVyIFxuICAgIHRoZW4gb3B0aW9uYWwgYXJ0aWNsZSBcbiAgICB0aGVuIHplcm8tb3ItbW9yZSBhZGplY3RpdmVzXG4gICAgdGhlbiBvcHRpb25hbCBsaW1pdC1waHJhc2UgXG4gICAgdGhlbiBzdWJqZWN0IG5vdW4gb3IgcHJvbm91biBvciBzdHJpbmcgb3IgbnVtYmVyLWxpdGVyYWxcbiAgICB0aGVuIG9wdGlvbmFsIG1hdGgtZXhwcmVzc2lvblxuICAgIHRoZW4gb3B0aW9uYWwgc3Vib3JkaW5hdGUtY2xhdXNlXG4gICAgdGhlbiBvcHRpb25hbCBnZW5pdGl2ZS1jb21wbGVtZW50XG4gICAgdGhlbiBvcHRpb25hbCBhbmQtcGhyYXNlXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICB2ZXJiLXNlbnRlbmNlIGlzIFxuICAgIHN1YmplY3Qgbm91bi1waHJhc2UgXG4gICAgdGhlbiBvcHRpb25hbCBodmVyYiBcbiAgICB0aGVuIG9wdGlvbmFsIG5lZ2F0aW9uIFxuICAgIHRoZW4gdmVyYiBcbiAgICB0aGVuIG9wdGlvbmFsIG9iamVjdCBub3VuLXBocmFzZVxuICAgIHRoZW4gemVyby1vci1tb3JlIGNvbXBsZW1lbnRzXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBzaW1wbGUtc2VudGVuY2UgaXMgY29wdWxhLXNlbnRlbmNlIG9yIHZlcmItc2VudGVuY2UgXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBjb21wbGV4LXNlbnRlbmNlLW9uZSBpcyBcbiAgICBzdWJjb25qIFxuICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZSBcbiAgICB0aGVuIHRoZW4ta2V5d29yZFxuICAgIHRoZW4gY29uc2VxdWVuY2Ugc2ltcGxlLXNlbnRlbmNlXG4gIGVuZC5cblxuICBtYWtybyBcbiAgICBjb21wbGV4LXNlbnRlbmNlLXR3byBpcyBcbiAgICBjb25zZXF1ZW5jZSBzaW1wbGUtc2VudGVuY2UgXG4gICAgdGhlbiBzdWJjb25qIFxuICAgIHRoZW4gY29uZGl0aW9uIHNpbXBsZS1zZW50ZW5jZVxuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgY29tcGxleC1zZW50ZW5jZSBpcyBjb21wbGV4LXNlbnRlbmNlLW9uZSBvciBjb21wbGV4LXNlbnRlbmNlLXR3b1xuICBlbmQuXG5cbiAgbWFrcm8gXG4gICAgc3RyaW5nIGlzIHF1b3RlIHRoZW4gb25lLW9yLW1vcmUgc3RyaW5nLXRva2VuIGFueS1sZXhlbWUgZXhjZXB0IHF1b3RlIHRoZW4gcXVvdGUgXG4gIGVuZC5cblxuXG4gIGBcbiIsImltcG9ydCB7IFJvbGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiXG5pbXBvcnQgeyBTeW50YXhNYXAgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvU3ludGF4XCJcbmltcG9ydCB7IEVsZW1lbnRUeXBlIH0gZnJvbSBcIi4uL3V0aWxzL0VsZW1lbnRUeXBlXCJcbmltcG9ydCB7IHN0cmluZ0xpdGVyYWxzIH0gZnJvbSBcIi4uL3V0aWxzL3N0cmluZ0xpdGVyYWxzXCJcblxuZXhwb3J0IHR5cGUgQ29tcG9zaXRlVHlwZSA9IEVsZW1lbnRUeXBlPHR5cGVvZiBjb25zdGl0dWVudFR5cGVzPlxuXG5leHBvcnQgY29uc3QgY29uc3RpdHVlbnRUeXBlcyA9IHN0cmluZ0xpdGVyYWxzKFxuICAgICdtYWNybycsXG4gICAgJ21hY3JvcGFydCcsXG4gICAgJ3RhZ2dlZHVuaW9uJyxcbiAgICAnZXhjZXB0dW5pb24nLFxuXG4gICAgJ25vdW4tcGhyYXNlJyxcbiAgICAnYW5kLXBocmFzZScsXG4gICAgJ2xpbWl0LXBocmFzZScsXG4gICAgJ21hdGgtZXhwcmVzc2lvbicsXG4gICAgJ2NvcHVsYS1zZW50ZW5jZScsXG4gICAgJ3ZlcmItc2VudGVuY2UnLFxuICAgICdjb21wbGV4LXNlbnRlbmNlJyxcblxuICAgICdnZW5pdGl2ZS1jb21wbGVtZW50JyxcbiAgICAnZGF0aXZlLWNvbXBsZW1lbnQnLFxuICAgICdhYmxhdGl2ZS1jb21wbGVtZW50JyxcbiAgICAnbG9jYXRpdmUtY29tcGxlbWVudCcsXG4gICAgJ2luc3RydW1lbnRhbC1jb21wbGVtZW50JyxcbiAgICAnY29taXRhdGl2ZS1jb21wbGVtZW50JyxcblxuICAgICdzdWJvcmRpbmF0ZS1jbGF1c2UnLFxuXG4gICAgJ3N0cmluZycsXG4gICAgJ251bWJlci1saXRlcmFsJyxcbilcblxuZXhwb3J0IGNvbnN0IHN0YXRpY0Rlc2NQcmVjZWRlbmNlOiBDb21wb3NpdGVUeXBlW10gPSBbJ21hY3JvJ11cblxuZXhwb3J0IGNvbnN0IHN5bnRheGVzOiBTeW50YXhNYXAgPSB7XG4gICAgJ21hY3JvJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ21ha3JvLWtleXdvcmQnXSwgbnVtYmVyOiAxIH0sXG4gICAgICAgIHsgdHlwZXM6IFsnbm91biddLCBudW1iZXI6IDEsIHJvbGU6ICdzdWJqZWN0JyB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2NvcHVsYSddLCBudW1iZXI6IDEgfSxcbiAgICAgICAgeyB0eXBlczogWydtYWNyb3BhcnQnXSwgbnVtYmVyOiAnKycgfSxcbiAgICAgICAgeyB0eXBlczogWydlbmQta2V5d29yZCddLCBudW1iZXI6IDEgfSxcbiAgICBdLFxuICAgICdtYWNyb3BhcnQnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnYWRqZWN0aXZlJ10sIG51bWJlcjogJyonIH0sXG4gICAgICAgIHsgdHlwZXM6IFsndGFnZ2VkdW5pb24nXSwgbnVtYmVyOiAnKycgfSxcbiAgICAgICAgeyB0eXBlczogWydleGNlcHR1bmlvbiddLCBudW1iZXI6ICcxfDAnIH0sXG4gICAgICAgIHsgdHlwZXM6IFsndGhlbi1rZXl3b3JkJ10sIG51bWJlcjogJzF8MCcgfSxcbiAgICBdLFxuICAgICd0YWdnZWR1bmlvbic6IFtcbiAgICAgICAgeyB0eXBlczogWydub3VuJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ2Rpc2p1bmMnXSwgbnVtYmVyOiAnMXwwJyB9LFxuICAgIF0sXG4gICAgJ2V4Y2VwdHVuaW9uJzogW1xuICAgICAgICB7IHR5cGVzOiBbJ2V4Y2VwdC1rZXl3b3JkJ10sIG51bWJlcjogMSB9LFxuICAgICAgICB7IHR5cGVzOiBbJ3RhZ2dlZHVuaW9uJ10sIG51bWJlcjogJysnIH0sXG4gICAgXSxcbiAgICAnbnVtYmVyLWxpdGVyYWwnOiBbXG4gICAgICAgIHsgdHlwZXM6IFsnZGlnaXQnXSwgbnVtYmVyOiAxLCByb2xlOiAnZmlyc3QtZGlnaXQnIGFzIFJvbGUgfSxcbiAgICAgICAgeyB0eXBlczogWydkaWdpdCddLCBudW1iZXI6ICcqJyB9LFxuICAgIF0sXG4gICAgJ25vdW4tcGhyYXNlJzogW10sXG4gICAgJ2FuZC1waHJhc2UnOiBbXSxcbiAgICAnbGltaXQtcGhyYXNlJzogW10sXG4gICAgJ21hdGgtZXhwcmVzc2lvbic6IFtdLFxuICAgICdnZW5pdGl2ZS1jb21wbGVtZW50JzogW10sXG4gICAgJ2NvcHVsYS1zZW50ZW5jZSc6IFtdLFxuICAgICd2ZXJiLXNlbnRlbmNlJzogW10sXG4gICAgJ3N0cmluZyc6IFtdLFxuICAgICdjb21wbGV4LXNlbnRlbmNlJzogW10sXG4gICAgXCJkYXRpdmUtY29tcGxlbWVudFwiOiBbXSxcbiAgICBcImFibGF0aXZlLWNvbXBsZW1lbnRcIjogW10sXG4gICAgXCJsb2NhdGl2ZS1jb21wbGVtZW50XCI6IFtdLFxuICAgIFwiaW5zdHJ1bWVudGFsLWNvbXBsZW1lbnRcIjogW10sXG4gICAgXCJjb21pdGF0aXZlLWNvbXBsZW1lbnRcIjogW10sXG4gICAgJ3N1Ym9yZGluYXRlLWNsYXVzZSc6IFtdLFxufSIsImltcG9ydCB7IFRoaW5nIH0gZnJvbSBcIi4uL2JhY2tlbmQvVGhpbmdcIjtcbmltcG9ydCB7IEJyYWluTGlzdGVuZXIgfSBmcm9tIFwiLi4vZmFjYWRlL0JyYWluTGlzdGVuZXJcIjtcbmltcG9ydCB7IEFzdE5vZGUgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvQXN0Tm9kZVwiO1xuaW1wb3J0IHsgcGxvdEFzdCB9IGZyb20gXCIuL3Bsb3RBc3RcIjtcblxuZXhwb3J0IGNsYXNzIEFzdENhbnZhcyBpbXBsZW1lbnRzIEJyYWluTGlzdGVuZXIge1xuXG4gICAgcmVhZG9ubHkgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBwcm90ZWN0ZWQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgICBwcm90ZWN0ZWQgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbFxuICAgIHByb3RlY3RlZCBjYW1lcmFPZmZzZXQgPSB7IHg6IHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgeTogd2luZG93LmlubmVySGVpZ2h0IC8gMiB9XG4gICAgcHJvdGVjdGVkIGlzRHJhZ2dpbmcgPSBmYWxzZVxuICAgIHByb3RlY3RlZCBkcmFnU3RhcnQgPSB7IHg6IDAsIHk6IDAgfVxuICAgIHByb3RlY3RlZCBhc3Q/OiBBc3ROb2RlXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kaXYuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpXG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJylcblxuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBlID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWVcbiAgICAgICAgICAgIHRoaXMuZHJhZ1N0YXJ0LnggPSBlLnggLSB0aGlzLmNhbWVyYU9mZnNldC54XG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydC55ID0gZS55IC0gdGhpcy5jYW1lcmFPZmZzZXQueVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlID0+IHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlKVxuXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FtZXJhT2Zmc2V0LnggPSBlLmNsaWVudFggLSB0aGlzLmRyYWdTdGFydC54XG4gICAgICAgICAgICAgICAgdGhpcy5jYW1lcmFPZmZzZXQueSA9IGUuY2xpZW50WSAtIHRoaXMuZHJhZ1N0YXJ0LnlcbiAgICAgICAgICAgICAgICB0aGlzLnJlcGxvdCgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgb25VcGRhdGUoYXN0OiBBc3ROb2RlLCByZXN1bHRzOiBUaGluZ1tdKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYXN0ID0gYXN0XG4gICAgICAgIHRoaXMucmVwbG90KClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVwbG90ID0gKCkgPT4ge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGhcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodFxuICAgICAgICAgICAgdGhpcy5jb250ZXh0Py50cmFuc2xhdGUod2luZG93LmlubmVyV2lkdGggLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0Py50cmFuc2xhdGUoLXdpbmRvdy5pbm5lcldpZHRoIC8gMiArIHRoaXMuY2FtZXJhT2Zmc2V0LngsIC13aW5kb3cuaW5uZXJIZWlnaHQgLyAyICsgdGhpcy5jYW1lcmFPZmZzZXQueSlcbiAgICAgICAgICAgIHRoaXMuY29udGV4dD8uY2xlYXJSZWN0KDAsIDAsIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpXG5cbiAgICAgICAgICAgIGlmICghdGhpcy5jb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW52YXMgY29udGV4dCBpcyB1bmRlZmluZWQhJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmFzdCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQXN0IGlzIGlzIHVuZGVmaW5lZCEnKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwbG90QXN0KHRoaXMuY29udGV4dCwgdGhpcy5hc3QpXG4gICAgICAgIH0pXG4gICAgfVxuXG59XG4iLCJpbXBvcnQgeyBBc3ROb2RlIH0gZnJvbSBcIi4uL2Zyb250ZW5kL3BhcnNlci9pbnRlcmZhY2VzL0FzdE5vZGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGFzdFRvRWRnZUxpc3QoXG4gICAgYXN0OiBBc3ROb2RlLFxuICAgIHBhcmVudE5hbWU/OiBzdHJpbmcsXG4gICAgZWRnZXM6IEVkZ2VMaXN0ID0gW10sXG4pOiBFZGdlTGlzdCB7XG5cbiAgICBjb25zdCBsaW5rcyA9IE9iamVjdC5lbnRyaWVzKGFzdCkuZmlsdGVyKGUgPT4gZVsxXSAmJiBlWzFdLnR5cGUpXG5cbiAgICBjb25zdCBhc3ROYW1lID0gKGFzdC5yb2xlID8/IGFzdC5sZXhlbWU/LnJvb3QgPz8gYXN0LnR5cGUpICsgcmFuZG9tKClcblxuICAgIGNvbnN0IGFkZGl0aW9uczogRWRnZUxpc3QgPSBbXVxuXG4gICAgaWYgKHBhcmVudE5hbWUpIHtcbiAgICAgICAgYWRkaXRpb25zLnB1c2goW3BhcmVudE5hbWUsIGFzdE5hbWVdKVxuICAgIH1cblxuICAgIGlmICghbGlua3MubGVuZ3RoICYmICFhc3QubGlzdCkgeyAvLyBsZWFmIVxuICAgICAgICByZXR1cm4gWy4uLmVkZ2VzLCAuLi5hZGRpdGlvbnNdXG4gICAgfVxuXG4gICAgaWYgKGxpbmtzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbGlua3NcbiAgICAgICAgICAgIC5mbGF0TWFwKGUgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV6ZXJvID0gZVswXSArIHJhbmRvbSgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsuLi5hZGRpdGlvbnMsIFthc3ROYW1lLCBlemVyb10sIC4uLmFzdFRvRWRnZUxpc3QoZVsxXSwgZXplcm8sIGVkZ2VzKV1cbiAgICAgICAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGFzdC5saXN0KSB7XG4gICAgICAgIGNvbnN0IGxpc3QgPSBhc3QubGlzdC5mbGF0TWFwKHggPT4gYXN0VG9FZGdlTGlzdCh4LCBhc3ROYW1lLCBlZGdlcykpXG4gICAgICAgIHJldHVybiBbLi4uYWRkaXRpb25zLCAuLi5lZGdlcywgLi4ubGlzdF1cbiAgICB9XG5cbiAgICByZXR1cm4gW11cbn1cblxuZnVuY3Rpb24gcmFuZG9tKCkge1xuICAgIHJldHVybiBwYXJzZUludCgxMDAwMDAgKiBNYXRoLnJhbmRvbSgpICsgJycpXG59IiwiaW1wb3J0IHsgR3JhcGhOb2RlIH0gZnJvbSBcIi4vTm9kZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3TGluZShjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGZyb206IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgdG86IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSkge1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKClcbiAgICAvLyBjb250ZXh0LnN0cm9rZVN0eWxlID0gZnJvbU5vZGUuc3Ryb2tlU3R5bGVcbiAgICBjb250ZXh0Lm1vdmVUbyhmcm9tLngsIGZyb20ueSlcbiAgICBjb250ZXh0LmxpbmVUbyh0by54LCB0by55KVxuICAgIGNvbnRleHQuc3Ryb2tlKClcbn0iLCJpbXBvcnQgeyBHcmFwaE5vZGUgfSBmcm9tIFwiLi9Ob2RlXCJcblxuZXhwb3J0IGZ1bmN0aW9uIGRyYXdOb2RlKGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbm9kZTogR3JhcGhOb2RlKSB7XG4gICAgY29udGV4dC5iZWdpblBhdGgoKVxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gbm9kZS5maWxsU3R5bGVcbiAgICBjb250ZXh0LmFyYyhub2RlLngsIG5vZGUueSwgbm9kZS5yYWRpdXMsIDAsIE1hdGguUEkgKiAyLCB0cnVlKVxuICAgIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBub2RlLnN0cm9rZVN0eWxlXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBub2RlLmZpbGxTdHlsZVxuICAgIGNvbnRleHQuc3Ryb2tlKClcbiAgICBjb250ZXh0LmZpbGwoKVxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gXCIjRkYwMDAwXCJcbiAgICBjb250ZXh0LmZvbnQgPSBcIjEwcHggQXJpYWxcIi8vMjBweFxuICAgIGNvbnN0IHRleHRPZmZzZXQgPSAxMCAqIG5vZGUubGFiZWwubGVuZ3RoIC8gMiAvL3NvbWUgbWFnaWMgaW4gaGVyZSFcbiAgICBjb250ZXh0LmZpbGxUZXh0KG5vZGUubGFiZWwsIG5vZGUueCAtIHRleHRPZmZzZXQsIG5vZGUueSlcbn1cbiIsImltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vdXRpbHMvdW5pcVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29yZHMoXG4gICAgaW5pdGlhbFBvczogQ29vcmRpbmF0ZSxcbiAgICBkYXRhOiBFZGdlTGlzdCxcbiAgICBvbGRDb29yZHM6IHsgW3g6IHN0cmluZ106IENvb3JkaW5hdGUgfSA9IHt9LFxuICAgIG5lc3RpbmdGYWN0b3IgPSAxLFxuKTogeyBbeDogc3RyaW5nXTogQ29vcmRpbmF0ZSB9IHtcblxuICAgIGNvbnN0IHJvb3QgPSBnZXRSb290KGRhdGEpIC8vIG5vZGUgdy9vdXQgYSBwYXJlbnRcblxuICAgIGlmICghcm9vdCkge1xuICAgICAgICByZXR1cm4gb2xkQ29vcmRzXG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGRyZW4gPSBnZXRDaGlsZHJlbk9mKHJvb3QsIGRhdGEpXG4gICAgY29uc3Qgcm9vdFBvcyA9IG9sZENvb3Jkc1tyb290XSA/PyBpbml0aWFsUG9zXG5cbiAgICBjb25zdCB5T2Zmc2V0ID0gNTBcbiAgICBjb25zdCB4T2Zmc2V0ID0gMjAwXG5cbiAgICBjb25zdCBjaGlsZENvb3JkcyA9IGNoaWxkcmVuXG4gICAgICAgIC5tYXAoKGMsIGkpID0+ICh7IFtjXTogeyB4OiByb290UG9zLnggKyBpICogbmVzdGluZ0ZhY3RvciAqIHhPZmZzZXQgKiAoaSAlIDIgPT0gMCA/IDEgOiAtMSksIHk6IHJvb3RQb3MueSArIHlPZmZzZXQgKiAobmVzdGluZ0ZhY3RvciArIDEpIH0gfSkpXG4gICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+ICh7IC4uLmEsIC4uLmIgfSksIHt9KVxuXG4gICAgY29uc3QgcmVtYWluaW5nRGF0YSA9IGRhdGEuZmlsdGVyKHggPT4gIXguaW5jbHVkZXMocm9vdCkpXG4gICAgY29uc3QgcGFydGlhbFJlc3VsdCA9IHsgLi4ub2xkQ29vcmRzLCAuLi5jaGlsZENvb3JkcywgLi4ueyBbcm9vdF06IHJvb3RQb3MgfSB9XG5cbiAgICByZXR1cm4gZ2V0Q29vcmRzKGluaXRpYWxQb3MsIHJlbWFpbmluZ0RhdGEsIHBhcnRpYWxSZXN1bHQsIDAuOSAqIG5lc3RpbmdGYWN0b3IpXG59XG5cbmZ1bmN0aW9uIGdldFJvb3QoZWRnZXM6IEVkZ2VMaXN0KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gZWRnZXNcbiAgICAgICAgLmZsYXQoKSAvLyB0aGUgbm9kZXNcbiAgICAgICAgLmZpbHRlcihuID0+ICFlZGdlcy5zb21lKGUgPT4gZVsxXSA9PT0gbikpWzBdXG59XG5cbmZ1bmN0aW9uIGdldENoaWxkcmVuT2YocGFyZW50OiBzdHJpbmcsIGVkZ2VzOiBFZGdlTGlzdCkge1xuICAgIHJldHVybiB1bmlxKGVkZ2VzLmZpbHRlcih4ID0+IHhbMF0gPT09IHBhcmVudCkubWFwKHggPT4geFsxXSkpIC8vVE9ETyBkdXBsaWNhdGUgY2hpbGRyZW4gYXJlbid0IHBsb3R0ZWQgdHdpY2UsIGJ1dCBzdGlsbCBtYWtlIHRoZSBncmFwaCB1Z2xpZXIgYmVjYXVzZSB0aGV5IGFkZCBcImlcIiBpbmRlY2VzIGluIGNoaWxkQ29vcmRzIGNvbXB1dGF0aW9uIGFuZCBtYWtlIHNpbmdsZSBjaGlsZCBkaXNwbGF5IE5PVCBzdHJhaWdodCBkb3duLlxufVxuIiwiaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCJcbmltcG9ydCB7IGFzdFRvRWRnZUxpc3QgfSBmcm9tIFwiLi9hc3RUb0VkZ2VMaXN0XCJcbmltcG9ydCB7IGRyYXdMaW5lIH0gZnJvbSBcIi4vZHJhd0xpbmVcIlxuaW1wb3J0IHsgZHJhd05vZGUgfSBmcm9tIFwiLi9kcmF3Tm9kZVwiXG5pbXBvcnQgeyBnZXRDb29yZHMgfSBmcm9tIFwiLi9nZXRDb29yZHNcIlxuXG5leHBvcnQgZnVuY3Rpb24gcGxvdEFzdChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGFzdDogQXN0Tm9kZSkge1xuXG4gICAgY29udGV4dC5jbGVhclJlY3QoMCwgMCwgY29udGV4dC5jYW52YXMud2lkdGgsIGNvbnRleHQuY2FudmFzLmhlaWdodClcblxuICAgIGNvbnN0IHJlY3QgPSBjb250ZXh0LmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgY29uc3QgZWRnZXMgPSBhc3RUb0VkZ2VMaXN0KGFzdClcbiAgICBjb25zdCBjb29yZHMgPSBnZXRDb29yZHMoeyB4OiByZWN0LnggLSByZWN0LndpZHRoIC8gMiwgeTogcmVjdC55IH0sIGVkZ2VzKVxuXG4gICAgT2JqZWN0LmVudHJpZXMoY29vcmRzKS5mb3JFYWNoKGMgPT4ge1xuXG4gICAgICAgIGNvbnN0IG5hbWUgPSBjWzBdXG4gICAgICAgIGNvbnN0IHBvcyA9IGNbMV1cblxuICAgICAgICBkcmF3Tm9kZShjb250ZXh0LCB7XG4gICAgICAgICAgICB4OiBwb3MueCxcbiAgICAgICAgICAgIHk6IHBvcy55LFxuICAgICAgICAgICAgcmFkaXVzOiAyLCAvLzEwXG4gICAgICAgICAgICBmaWxsU3R5bGU6ICcjMjJjY2NjJyxcbiAgICAgICAgICAgIHN0cm9rZVN0eWxlOiAnIzAwOTk5OScsXG4gICAgICAgICAgICBsYWJlbDogbmFtZS5yZXBsYWNlQWxsKC9cXGQrL2csICcnKVxuICAgICAgICB9KVxuXG4gICAgfSlcblxuICAgIGVkZ2VzLmZvckVhY2goZSA9PiB7XG5cbiAgICAgICAgY29uc3QgZnJvbSA9IGNvb3Jkc1tlWzBdXVxuICAgICAgICBjb25zdCB0byA9IGNvb3Jkc1tlWzFdXVxuXG4gICAgICAgIGlmIChmcm9tICYmIHRvKSB7XG4gICAgICAgICAgICBkcmF3TGluZShjb250ZXh0LCBmcm9tLCB0bylcbiAgICAgICAgfVxuXG4gICAgfSlcbn1cbiIsImltcG9ydCB7IGdldENvbnRleHQgfSBmcm9tIFwiLi4vYmFja2VuZC9Db250ZXh0XCI7XG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL1RoaW5nXCI7XG5pbXBvcnQgeyBsb2dWZXJiIH0gZnJvbSBcIi4uL2JhY2tlbmQvVmVyYlRoaW5nXCI7XG5pbXBvcnQgeyBnZXRQYXJzZXIgfSBmcm9tIFwiLi4vZnJvbnRlbmQvcGFyc2VyL2ludGVyZmFjZXMvUGFyc2VyXCI7XG5pbXBvcnQgeyBldmFsQXN0IH0gZnJvbSBcIi4uL2JhY2tlbmQvZXZhbEFzdFwiO1xuaW1wb3J0IEJyYWluIGZyb20gXCIuL0JyYWluXCI7XG5pbXBvcnQgeyBCcmFpbkxpc3RlbmVyIH0gZnJvbSBcIi4vQnJhaW5MaXN0ZW5lclwiO1xuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuLi9mcm9udGVuZC9wYXJzZXIvaW50ZXJmYWNlcy9Bc3ROb2RlXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzaWNCcmFpbiBpbXBsZW1lbnRzIEJyYWluIHtcblxuICAgIHJlYWRvbmx5IGNvbnRleHQgPSBnZXRDb250ZXh0KHsgaWQ6ICdnbG9iYWwnIH0pXG4gICAgcHJvdGVjdGVkIGxpc3RlbmVyczogQnJhaW5MaXN0ZW5lcltdID0gW11cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV4ZWN1dGUodGhpcy5jb250ZXh0LmdldFByZWx1ZGUoKSlcbiAgICAgICAgdGhpcy5jb250ZXh0LnNldChsb2dWZXJiLmdldElkKCksIGxvZ1ZlcmIpXG4gICAgICAgIHRoaXMuY29udGV4dC5zZXRMZXhlbWUoeyByb290OiAnbG9nJywgdHlwZTogJ3ZlcmInLCByZWZlcmVudHM6IFtsb2dWZXJiXSB9KVxuICAgIH1cblxuICAgIGV4ZWN1dGUobmF0bGFuZzogc3RyaW5nKTogVGhpbmdbXSB7XG5cbiAgICAgICAgcmV0dXJuIG5hdGxhbmcuc3BsaXQoJy4nKS5mbGF0TWFwKHggPT4ge1xuXG4gICAgICAgICAgICByZXR1cm4gZ2V0UGFyc2VyKHgsIHRoaXMuY29udGV4dCkucGFyc2VBbGwoKS5mbGF0TWFwKGFzdCA9PiB7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhc3QpXG5cbiAgICAgICAgICAgICAgICBsZXQgcmVzdWx0czogVGhpbmdbXSA9IFtdXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cyA9IGV2YWxBc3QodGhpcy5jb250ZXh0LCBhc3QgYXMgQXN0Tm9kZSlcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLmZvckVhY2gobCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGwub25VcGRhdGUoYXN0LCByZXN1bHRzKVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0c1xuXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZXhlY3V0ZVVud3JhcHBlZChuYXRsYW5nOiBzdHJpbmcpOiAob2JqZWN0fG51bWJlcilbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4ZWN1dGUobmF0bGFuZykubWFwKHggPT4geC50b0pzKCkpXG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXIobGlzdGVuZXI6IEJyYWluTGlzdGVuZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmxpc3RlbmVycy5pbmNsdWRlcyhsaXN0ZW5lcikpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpXG4gICAgICAgIH1cbiAgICB9XG5cbn0iLCJpbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi9iYWNrZW5kL1RoaW5nXCJcbmltcG9ydCBCYXNpY0JyYWluIGZyb20gXCIuL0Jhc2ljQnJhaW5cIlxuaW1wb3J0IHsgQnJhaW5MaXN0ZW5lciB9IGZyb20gXCIuL0JyYWluTGlzdGVuZXJcIlxuXG4vKipcbiAqIEEgZmFjYWRlIHRvIHRoZSBEZWl4aXNjcmlwdCBpbnRlcnByZXRlci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgaW50ZXJmYWNlIEJyYWluIHtcbiAgICBleGVjdXRlKG5hdGxhbmc6IHN0cmluZyk6IFRoaW5nW11cbiAgICBleGVjdXRlVW53cmFwcGVkKG5hdGxhbmc6IHN0cmluZyk6IChvYmplY3R8bnVtYmVyKVtdXG4gICAgYWRkTGlzdGVuZXIobGlzdGVuZXI6IEJyYWluTGlzdGVuZXIpOiB2b2lkXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCcmFpbigpOiBCcmFpbiB7XG4gICAgcmV0dXJuIG5ldyBCYXNpY0JyYWluKClcbn1cbiIsImltcG9ydCBMZXhlciBmcm9tIFwiLi9MZXhlclwiO1xuaW1wb3J0IHsgTGV4ZW1lLCBtYWtlTGV4ZW1lIH0gZnJvbSBcIi4vTGV4ZW1lXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvQ29udGV4dFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFYWdlckxleGVyIGltcGxlbWVudHMgTGV4ZXIge1xuXG4gICAgcHJvdGVjdGVkIHRva2VuczogTGV4ZW1lW10gPSBbXVxuICAgIHByb3RlY3RlZCB3b3Jkczogc3RyaW5nW11cbiAgICBwcm90ZWN0ZWQgX3BvczogbnVtYmVyID0gMFxuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgc291cmNlQ29kZTogc3RyaW5nLCByZWFkb25seSBjb250ZXh0OiBDb250ZXh0KSB7XG5cbiAgICAgICAgdGhpcy53b3JkcyA9XG4gICAgICAgICAgICBzcGFjZU91dChzb3VyY2VDb2RlLCBbJ1wiJywgJy4nLCAnMCcsICcxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnLCAnOSddKVxuICAgICAgICAgICAgICAgIC50cmltKClcbiAgICAgICAgICAgICAgICAuc3BsaXQoL1xccysvKVxuXG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VucygpXG4gICAgfVxuXG4gICAgcmVmcmVzaFRva2VucygpIHtcbiAgICAgICAgdGhpcy50b2tlbnMgPSB0aGlzLndvcmRzLm1hcCh3ID0+IHRoaXMuY29udGV4dC5nZXRMZXhlbWVzKHcpLmF0KDApID8/IG1ha2VMZXhlbWUoeyByb290OiB3LCB0b2tlbjogdywgdHlwZTogJ25vdW4nLCByZWZlcmVudHM6IFtdIH0pKVxuICAgIH1cblxuICAgIG5leHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVmcmVzaFRva2VucygpXG4gICAgICAgIHRoaXMuX3BvcysrXG4gICAgfVxuXG4gICAgZ2V0IHBvcygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zXG4gICAgfVxuXG4gICAgYmFja1RvKHBvczogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3BvcyA9IHBvc1xuICAgIH1cblxuICAgIGdldCBwZWVrKCk6IExleGVtZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLl9wb3NdXG4gICAgfVxuXG4gICAgY3JvYWsoZXJyb3JNc2c6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZXJyb3JNc2d9IGF0ICR7dGhpcy5fcG9zfWApO1xuICAgIH1cblxuICAgIGdldCBpc0VuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zID49IHRoaXMudG9rZW5zLmxlbmd0aFxuICAgIH1cblxufVxuXG5mdW5jdGlvbiBzcGFjZU91dChzb3VyY2VDb2RlOiBzdHJpbmcsIHNwZWNpYWxDaGFyczogc3RyaW5nW10pIHtcblxuICAgIHJldHVybiBzb3VyY2VDb2RlXG4gICAgICAgIC5zcGxpdCgnJylcbiAgICAgICAgLnJlZHVjZSgoYSwgYykgPT4gYSArIChzcGVjaWFsQ2hhcnMuaW5jbHVkZXMoYykgPyAnICcgKyBjICsgJyAnIDogYyksICcnKVxuXG59IiwiaW1wb3J0IHsgTGV4ZW1lVHlwZSB9IGZyb20gXCIuLi8uLi9jb25maWcvTGV4ZW1lVHlwZVwiXG5pbXBvcnQgeyBDYXJkaW5hbGl0eSwgaXNSZXBlYXRhYmxlIH0gZnJvbSBcIi4uL3BhcnNlci9pbnRlcmZhY2VzL0NhcmRpbmFsaXR5XCJcbmltcG9ydCB7IHBsdXJhbGl6ZSB9IGZyb20gXCIuL2Z1bmN0aW9ucy9wbHVyYWxpemVcIlxuaW1wb3J0IHsgY29uanVnYXRlIH0gZnJvbSBcIi4vZnVuY3Rpb25zL2Nvbmp1Z2F0ZVwiXG5pbXBvcnQgeyBUaGluZyB9IGZyb20gXCIuLi8uLi9iYWNrZW5kL1RoaW5nXCJcblxuXG5leHBvcnQgaW50ZXJmYWNlIExleGVtZSB7XG4gICAgcmVhZG9ubHkgcm9vdDogc3RyaW5nXG4gICAgcmVhZG9ubHkgdHlwZTogTGV4ZW1lVHlwZVxuICAgIHJlYWRvbmx5IHRva2VuPzogc3RyaW5nXG4gICAgcmVhZG9ubHkgY2FyZGluYWxpdHk/OiBDYXJkaW5hbGl0eVxuICAgIHJlZmVyZW50czogVGhpbmdbXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFrZUxleGVtZShkYXRhOiBMZXhlbWUpOiBMZXhlbWUge1xuICAgIHJldHVybiBkYXRhXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BsdXJhbChsZXhlbWU6IExleGVtZSkge1xuICAgIHJldHVybiBpc1JlcGVhdGFibGUobGV4ZW1lLmNhcmRpbmFsaXR5KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFwb2xhdGUobGV4ZW1lOiBMZXhlbWUsIGNvbnRleHQ/OiBUaGluZyk6IExleGVtZVtdIHtcblxuICAgIGlmIChsZXhlbWUudHlwZSA9PT0gJ25vdW4nICYmICFpc1BsdXJhbChsZXhlbWUpKSB7XG4gICAgICAgIHJldHVybiBbbWFrZUxleGVtZSh7XG4gICAgICAgICAgICByb290OiBsZXhlbWUucm9vdCxcbiAgICAgICAgICAgIHR5cGU6IGxleGVtZS50eXBlLFxuICAgICAgICAgICAgdG9rZW46IHBsdXJhbGl6ZShsZXhlbWUucm9vdCksXG4gICAgICAgICAgICBjYXJkaW5hbGl0eTogJyonLFxuICAgICAgICAgICAgcmVmZXJlbnRzOiBsZXhlbWUucmVmZXJlbnRzXG4gICAgICAgIH0pXVxuICAgIH1cblxuICAgIGlmIChsZXhlbWUudHlwZSA9PT0gJ3ZlcmInKSB7XG4gICAgICAgIHJldHVybiBjb25qdWdhdGUobGV4ZW1lLnJvb3QpLm1hcCh4ID0+IG1ha2VMZXhlbWUoe1xuICAgICAgICAgICAgcm9vdDogbGV4ZW1lLnJvb3QsXG4gICAgICAgICAgICB0eXBlOiBsZXhlbWUudHlwZSxcbiAgICAgICAgICAgIHRva2VuOiB4LFxuICAgICAgICAgICAgcmVmZXJlbnRzOiBsZXhlbWUucmVmZXJlbnRzXG4gICAgICAgIH0pKVxuICAgIH1cblxuICAgIHJldHVybiBbXVxufVxuXG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2JhY2tlbmQvQ29udGV4dFwiXG5pbXBvcnQgRWFnZXJMZXhlciBmcm9tIFwiLi9FYWdlckxleGVyXCJcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuL0xleGVtZVwiXG5cbmV4cG9ydCBkZWZhdWx0IGludGVyZmFjZSBMZXhlciB7XG4gICAgZ2V0IHBlZWsoKTogTGV4ZW1lXG4gICAgZ2V0IHBvcygpOiBudW1iZXJcbiAgICBnZXQgaXNFbmQoKTogYm9vbGVhblxuICAgIG5leHQoKTogdm9pZFxuICAgIGJhY2tUbyhwb3M6IG51bWJlcik6IHZvaWRcbiAgICBjcm9hayhlcnJvck1zZzogc3RyaW5nKTogdm9pZFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TGV4ZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0KTogTGV4ZXIge1xuICAgIHJldHVybiBuZXcgRWFnZXJMZXhlcihzb3VyY2VDb2RlLCBjb250ZXh0KVxufSIsImV4cG9ydCBmdW5jdGlvbiBjb25qdWdhdGUodmVyYjpzdHJpbmcpe1xuICAgIHJldHVybiBbdmVyYisncyddXG59IiwiZXhwb3J0IGZ1bmN0aW9uIHBsdXJhbGl6ZShyb290OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gcm9vdCArICdzJ1xufSIsImltcG9ydCB7IEFzdE5vZGUsIFJvbGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9QYXJzZXJcIlxuaW1wb3J0IHsgaXNOZWNlc3NhcnksIGlzUmVwZWF0YWJsZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvQ2FyZGluYWxpdHlcIlxuaW1wb3J0IHsgQXN0VHlwZSwgTWVtYmVyLCBTeW50YXggfSBmcm9tIFwiLi9pbnRlcmZhY2VzL1N5bnRheFwiXG5pbXBvcnQgeyBMZXhlbWVUeXBlIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9MZXhlbWVUeXBlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IGdldExleGVyIH0gZnJvbSBcIi4uL2xleGVyL0xleGVyXCJcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vLi4vYmFja2VuZC9Db250ZXh0XCJcblxuXG5leHBvcnQgY2xhc3MgS29vbFBhcnNlciBpbXBsZW1lbnRzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNvdXJjZUNvZGU6IHN0cmluZyxcbiAgICAgICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbnRleHQ6IENvbnRleHQsXG4gICAgICAgIHByb3RlY3RlZCByZWFkb25seSBsZXhlciA9IGdldExleGVyKHNvdXJjZUNvZGUsIGNvbnRleHQpLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgcGFyc2VBbGwoKSB7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0czogQXN0Tm9kZVtdID0gW11cblxuICAgICAgICB3aGlsZSAoIXRoaXMubGV4ZXIuaXNFbmQpIHtcblxuICAgICAgICAgICAgY29uc3QgYXN0ID0gdGhpcy50cnlQYXJzZSh0aGlzLmNvbnRleHQuZ2V0U3ludGF4TGlzdCgpKVxuXG4gICAgICAgICAgICBpZiAoIWFzdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNpbXBsZUFzdCA9IHRoaXMuc2ltcGxpZnkoYXN0KVxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHNpbXBsZUFzdClcblxuICAgICAgICAgICAgaWYgKHRoaXMubGV4ZXIucGVlaz8udHlwZSA9PT0gJ2Z1bGxzdG9wJykge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIubmV4dCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgdHJ5UGFyc2UodHlwZXM6IEFzdFR5cGVbXSwgcm9sZT86IFJvbGUsIGV4Y2VwdFR5cGVzPzogQXN0VHlwZVtdKSB7IC8vcHJvYmxlbWF0aWNcblxuICAgICAgICBmb3IgKGNvbnN0IHQgb2YgdHlwZXMpIHtcblxuICAgICAgICAgICAgY29uc3QgbWVtZW50byA9IHRoaXMubGV4ZXIucG9zXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5rbm93blBhcnNlKHQsIHJvbGUpXG5cbiAgICAgICAgICAgIGlmICh4ICYmICFleGNlcHRUeXBlcz8uaW5jbHVkZXMoeC50eXBlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB4XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGV4ZXIuYmFja1RvKG1lbWVudG8pXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBrbm93blBhcnNlID0gKG5hbWU6IEFzdFR5cGUsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3Qgc3ludGF4ID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChuYW1lKVxuICAgICAgICAvLyBpZiB0aGUgc3ludGF4IGlzIGFuIFwidW5vZmZpY2lhbFwiIEFTVCwgYWthIGEgQ1NULCBnZXQgdGhlIG5hbWUgb2YgdGhlIFxuICAgICAgICAvLyBhY3R1YWwgQVNUIGFuZCBwYXNzIGl0IGRvd24gdG8gcGFyc2UgY29tcG9zaXRlXG5cbiAgICAgICAgaWYgKHN5bnRheC5sZW5ndGggPT09IDEgJiYgc3ludGF4WzBdLnR5cGVzLmV2ZXJ5KHQgPT4gdGhpcy5pc0xlYWYodCkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUxlYWYoc3ludGF4WzBdKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VDb21wb3NpdGUobmFtZSBhcyBDb21wb3NpdGVUeXBlLCBzeW50YXgsIHJvbGUpXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBwYXJzZUxlYWYgPSAobTogTWVtYmVyKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgaWYgKG0udHlwZXMuaW5jbHVkZXModGhpcy5sZXhlci5wZWVrLnR5cGUpKSB7XG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy5sZXhlci5wZWVrXG4gICAgICAgICAgICB0aGlzLmxleGVyLm5leHQoKVxuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogeC50eXBlLCBsZXhlbWU6IHggfVxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcGFyc2VDb21wb3NpdGUgPSAobmFtZTogQ29tcG9zaXRlVHlwZSwgc3ludGF4OiBTeW50YXgsIHJvbGU/OiBSb2xlKTogQXN0Tm9kZSB8IHVuZGVmaW5lZCA9PiB7XG5cbiAgICAgICAgY29uc3QgbGlua3M6IHsgW3g6IHN0cmluZ106IEFzdE5vZGUgfSA9IHt9XG5cbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHN5bnRheCkge1xuXG4gICAgICAgICAgICBjb25zdCBhc3QgPSB0aGlzLnBhcnNlTWVtYmVyKG0pXG5cbiAgICAgICAgICAgIGlmICghYXN0ICYmIGlzTmVjZXNzYXJ5KG0ubnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFhc3QpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaW5rc1ttLnJvbGUgPz8gYXN0LnR5cGVdID0gYXN0XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhsaW5rcykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiBuYW1lLFxuICAgICAgICAgICAgcm9sZTogcm9sZSxcbiAgICAgICAgICAgIC4uLmxpbmtzXG4gICAgICAgIH0gYXMgYW55IC8vIFRPRE8hXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBhcnNlTWVtYmVyID0gKG06IE1lbWJlciwgcm9sZT86IFJvbGUpOiBBc3ROb2RlIHwgdW5kZWZpbmVkID0+IHtcblxuICAgICAgICBjb25zdCBsaXN0OiBhbnlbXSA9IFtdIC8vIFRPRE8hXG5cbiAgICAgICAgd2hpbGUgKCF0aGlzLmxleGVyLmlzRW5kKSB7XG5cbiAgICAgICAgICAgIGlmICghaXNSZXBlYXRhYmxlKG0ubnVtYmVyKSAmJiBsaXN0Lmxlbmd0aCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMudHJ5UGFyc2UobS50eXBlcywgbS5yb2xlLCBtLmV4Y2VwdFR5cGVzKVxuXG4gICAgICAgICAgICBpZiAoIXgpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsaXN0LnB1c2goeClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGlzUmVwZWF0YWJsZShtLm51bWJlcikgPyAoe1xuICAgICAgICAgICAgdHlwZTogbGlzdFswXS50eXBlLFxuICAgICAgICAgICAgbGlzdDogbGlzdFxuICAgICAgICB9KSA6IGxpc3RbMF1cblxuICAgIH1cblxuICAgIHByb3RlY3RlZCBpc0xlYWYgPSAodDogQXN0VHlwZSkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmdldExleGVtZVR5cGVzKCkuaW5jbHVkZXModCBhcyBMZXhlbWVUeXBlKVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBzaW1wbGlmeShhc3Q6IEFzdE5vZGUpOiBBc3ROb2RlIHtcblxuICAgICAgICBpZiAodGhpcy5pc0xlYWYoYXN0LnR5cGUpIHx8IGFzdC5saXN0KSB7IC8vIGlmIG5vIGxpbmtzIHJldHVybiBhc3RcbiAgICAgICAgICAgIHJldHVybiBhc3RcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnN0IGFzdExpbmtzID0gT2JqZWN0LnZhbHVlcyhhc3QpLmZpbHRlcih4ID0+IHggJiYgeC50eXBlKS5maWx0ZXIoeCA9PiB4KVxuICAgICAgICAvLyBhc3RMaW5rcy5sZW5ndGggPT09IDFcbiAgICAgICAgLy8gcmV0dXJuIGFzdExpbmtzWzBdXG5cbiAgICAgICAgY29uc3Qgc3ludGF4ID0gdGhpcy5jb250ZXh0LmdldFN5bnRheChhc3QudHlwZSlcblxuICAgICAgICBpZiAoc3ludGF4Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY29uc3QgdiA9IE9iamVjdC52YWx1ZXMoYXN0KS5maWx0ZXIoeCA9PiB4ICYmIHgudHlwZSkuZmlsdGVyKHggPT4geClcbiAgICAgICAgICAgIHJldHVybiB2WzBdXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzaW1wbGVMaW5rcyA9IE9iamVjdFxuICAgICAgICAgICAgLmVudHJpZXMoYXN0KVxuICAgICAgICAgICAgLmZpbHRlcih4ID0+ICh4IGFzIGFueSkudHlwZSlcbiAgICAgICAgICAgIC5tYXAobCA9PiAoeyBbbFswXV06IHRoaXMuc2ltcGxpZnkobFsxXSkgfSkpXG4gICAgICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcblxuICAgICAgICByZXR1cm4geyAuLi5hc3QsIC4uLnNpbXBsZUxpbmtzIH1cblxuICAgIH1cblxufVxuIiwiZXhwb3J0IHR5cGUgQ2FyZGluYWxpdHkgPSAnKicgLy8gemVybyBvciBtb3JlXG4gICAgfCAnMXwwJyAvLyBvbmUgb3IgemVyb1xuICAgIHwgJysnIC8vIG9uZSBvciBtb3JlXG4gICAgfCBudW1iZXIgLy8gY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgPTFcblxuZXhwb3J0IGNvbnN0IGlzTmVjZXNzYXJ5ID0gKGM/OiBDYXJkaW5hbGl0eSkgPT4gYyA9PT0gdW5kZWZpbmVkIC8vIG5lY2Vzc2FyeSBieSBkZWZhdWx0XG4gICAgfHwgYyA9PSAnKydcbiAgICB8fCArYyA+PSAxXG5cbmV4cG9ydCBjb25zdCBpc1JlcGVhdGFibGUgPSAoYz86IENhcmRpbmFsaXR5KSA9PiBjID09ICcrJ1xuICAgIHx8IGMgPT0gJyonXG4iLCJpbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uLy4uL2JhY2tlbmQvQ29udGV4dFwiXG5pbXBvcnQgeyBLb29sUGFyc2VyIH0gZnJvbSBcIi4uL0tvb2xQYXJzZXJcIlxuaW1wb3J0IHsgQXN0Tm9kZSB9IGZyb20gXCIuL0FzdE5vZGVcIlxuXG5leHBvcnQgaW50ZXJmYWNlIFBhcnNlciB7XG4gICAgcGFyc2VBbGwoKTogQXN0Tm9kZVtdXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJzZXIoc291cmNlQ29kZTogc3RyaW5nLCBjb250ZXh0OiBDb250ZXh0KTogUGFyc2VyIHtcbiAgICByZXR1cm4gbmV3IEtvb2xQYXJzZXIoc291cmNlQ29kZSwgY29udGV4dClcbn1cbiIsImltcG9ydCB7IE1hY3JvLCBNYWNyb3BhcnQsIFJvbGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzL0FzdE5vZGVcIlxuaW1wb3J0IHsgTWVtYmVyLCBBc3RUeXBlIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9TeW50YXhcIlxuXG5leHBvcnQgZnVuY3Rpb24gbWFjcm9Ub1N5bnRheChtYWNybzogTWFjcm8pIHtcblxuICAgIGNvbnN0IG1hY3JvcGFydHMgPSBtYWNyby5tYWNyb3BhcnQubGlzdCA/PyBbXVxuICAgIGNvbnN0IHN5bnRheCA9IG1hY3JvcGFydHMubWFwKG0gPT4gbWFjcm9QYXJ0VG9NZW1iZXIobSkpXG4gICAgY29uc3QgbmFtZSA9IG1hY3JvLnN1YmplY3QubGV4ZW1lLnJvb3RcblxuICAgIGlmICghbmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Fub255bW91cyBzeW50YXghJylcbiAgICB9XG5cbiAgICByZXR1cm4geyBuYW1lLCBzeW50YXggfVxufVxuXG5mdW5jdGlvbiBtYWNyb1BhcnRUb01lbWJlcihtYWNyb1BhcnQ6IE1hY3JvcGFydCk6IE1lbWJlciB7XG5cbiAgICBjb25zdCBhZGplY3RpdmVOb2RlcyA9IG1hY3JvUGFydD8uYWRqZWN0aXZlPy5saXN0ID8/IFtdXG4gICAgY29uc3QgYWRqZWN0aXZlcyA9IGFkamVjdGl2ZU5vZGVzLmZsYXRNYXAoYSA9PiBhLmxleGVtZSA/PyBbXSlcblxuICAgIGNvbnN0IHRhZ2dlZFVuaW9ucyA9IG1hY3JvUGFydD8udGFnZ2VkdW5pb24/Lmxpc3QgPz8gW11cbiAgICBjb25zdCBncmFtbWFycyA9IHRhZ2dlZFVuaW9ucy5tYXAoeCA9PiB4Py5ub3VuKVxuXG4gICAgY29uc3QgcXVhbnRhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiBhLmNhcmRpbmFsaXR5KVxuICAgIGNvbnN0IHF1YWxhZGpzID0gYWRqZWN0aXZlcy5maWx0ZXIoYSA9PiAhYS5jYXJkaW5hbGl0eSlcblxuICAgIGNvbnN0IGV4Y2VwdFVuaW9ucyA9IG1hY3JvUGFydD8uZXhjZXB0dW5pb24/LnRhZ2dlZHVuaW9uPy5saXN0ID8/IFtdXG4gICAgY29uc3Qgbm90R3JhbW1hcnMgPSBleGNlcHRVbmlvbnMubWFwKHggPT4geD8ubm91bilcblxuICAgIHJldHVybiB7XG4gICAgICAgIHR5cGVzOiBncmFtbWFycy5mbGF0TWFwKGcgPT4gKGc/LmxleGVtZT8ucm9vdCBhcyBBc3RUeXBlKSA/PyBbXSksXG4gICAgICAgIHJvbGU6IHF1YWxhZGpzLmF0KDApPy5yb290IGFzIFJvbGUsXG4gICAgICAgIG51bWJlcjogcXVhbnRhZGpzLmF0KDApPy5jYXJkaW5hbGl0eSxcbiAgICAgICAgZXhjZXB0VHlwZXM6IG5vdEdyYW1tYXJzLmZsYXRNYXAoZyA9PiAoZz8ubGV4ZW1lPy5yb290IGFzIEFzdFR5cGUpID8/IFtdKSxcbiAgICB9XG5cbn1cbiIsImltcG9ydCB7IENvbXBvc2l0ZVR5cGUgfSBmcm9tIFwiLi4vLi4vY29uZmlnL3N5bnRheGVzXCJcbmltcG9ydCB7IFN5bnRheE1hcCwgQXN0VHlwZSB9IGZyb20gXCIuL2ludGVyZmFjZXMvU3ludGF4XCJcblxuZXhwb3J0IGNvbnN0IG1heFByZWNlZGVuY2UgPSAoYTogQ29tcG9zaXRlVHlwZSwgYjogQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXM6IFN5bnRheE1hcCkgPT4ge1xuXG4gICAgcmV0dXJuIGlkQ29tcGFyZShhLCBiKSA/P1xuICAgICAgICBkZXBlbmRlbmN5Q29tcGFyZShhLCBiLCBzeW50YXhlcykgPz9cbiAgICAgICAgbGVuQ29tcGFyZShhLCBiLCBzeW50YXhlcylcblxufVxuXG5jb25zdCBpZENvbXBhcmUgPSAoYTogQXN0VHlwZSwgYjogQXN0VHlwZSkgPT4ge1xuICAgIHJldHVybiBhID09IGIgPyAwIDogdW5kZWZpbmVkXG59XG5cbmNvbnN0IGRlcGVuZGVuY3lDb21wYXJlID0gKGE6IENvbXBvc2l0ZVR5cGUsIGI6IENvbXBvc2l0ZVR5cGUsIHN5bnRheGVzOiBTeW50YXhNYXApID0+IHtcblxuICAgIGNvbnN0IGFEZXBlbmRzT25CID0gZGVwZW5kZW5jaWVzKGEsIHN5bnRheGVzKS5pbmNsdWRlcyhiKVxuICAgIGNvbnN0IGJEZXBlbmRzT25BID0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5pbmNsdWRlcyhhKVxuXG4gICAgaWYgKGFEZXBlbmRzT25CID09PSBiRGVwZW5kc09uQSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgfVxuXG4gICAgcmV0dXJuIGFEZXBlbmRzT25CID8gMSA6IC0xXG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlcGVuZGVuY2llcyhhOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwLCB2aXNpdGVkOiBBc3RUeXBlW10gPSBbXSk6IEFzdFR5cGVbXSB7IC8vREZTXG5cbiAgICBjb25zdCBtZW1iZXJzID0gc3ludGF4ZXNbYV0gPz8gW11cblxuICAgIHJldHVybiBtZW1iZXJzLmZsYXRNYXAobSA9PiBtLnR5cGVzKS5mbGF0TWFwKHQgPT4ge1xuXG4gICAgICAgIGlmICh2aXNpdGVkLmluY2x1ZGVzKHQpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbLi4udmlzaXRlZCwgLi4uZGVwZW5kZW5jaWVzKHQgYXMgQ29tcG9zaXRlVHlwZSwgc3ludGF4ZXMsIFsuLi52aXNpdGVkLCB0XSldXG4gICAgICAgIH1cblxuICAgIH0pXG5cbn1cblxuY29uc3QgbGVuQ29tcGFyZSA9IChhOiBDb21wb3NpdGVUeXBlLCBiOiBDb21wb3NpdGVUeXBlLCBzeW50YXhlczogU3ludGF4TWFwKSA9PiB7XG4gICAgcmV0dXJuIGRlcGVuZGVuY2llcyhhLCBzeW50YXhlcykubGVuZ3RoIC0gZGVwZW5kZW5jaWVzKGIsIHN5bnRheGVzKS5sZW5ndGhcbn1cbiIsImltcG9ydCB7IEFzdENhbnZhcyB9IGZyb20gXCIuLi9kcmF3LWFzdC9Bc3RDYW52YXNcIlxuaW1wb3J0IHsgZ2V0QnJhaW4gfSBmcm9tIFwiLi4vZmFjYWRlL0JyYWluXCJcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWFpbigpIHtcblxuICAgIGNvbnN0IGJyYWluID0gZ2V0QnJhaW4oKTtcbiAgICAod2luZG93IGFzIGFueSkuYnJhaW4gPSBicmFpblxuXG4gICAgY29uc3QgYXN0Q2FudmFzID0gbmV3IEFzdENhbnZhcygpXG4gICAgYnJhaW4uYWRkTGlzdGVuZXIoYXN0Q2FudmFzKVxuXG4gICAgY29uc3QgbGVmdERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgY29uc3QgcmlnaHREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gICAgY29uc3Qgc3BsaXQgPSAnaGVpZ2h0OiAxMDAlOyB3aWR0aDogNTAlOyBwb3NpdGlvbjogZml4ZWQ7IHotaW5kZXg6IDE7IHRvcDogMDsgIHBhZGRpbmctdG9wOiAyMHB4OydcbiAgICBjb25zdCBsZWZ0ID0gJ2xlZnQ6IDA7IGJhY2tncm91bmQtY29sb3I6ICMxMTE7J1xuICAgIGNvbnN0IHJpZ2h0ID0gJ3JpZ2h0OiAwOyBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwOydcblxuICAgIGxlZnREaXYuc3R5bGUuY3NzVGV4dCA9IHNwbGl0ICsgbGVmdFxuICAgIHJpZ2h0RGl2LnN0eWxlLmNzc1RleHQgPSBzcGxpdCArIHJpZ2h0ICsgJ292ZXJmbG93OnNjcm9sbDsnICsgJ292ZXJmbG93LXg6c2Nyb2xsOycgKyAnb3ZlcmZsb3cteTpzY3JvbGw7J1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChsZWZ0RGl2KVxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmlnaHREaXYpXG5cbiAgICByaWdodERpdi5hcHBlbmRDaGlsZChhc3RDYW52YXMuZGl2KVxuXG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpXG4gICAgdGV4dGFyZWEuc3R5bGUud2lkdGggPSAnNDB2dydcbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSAnNDB2aCdcbiAgICBsZWZ0RGl2LmFwcGVuZENoaWxkKHRleHRhcmVhKVxuXG4gICAgY29uc3QgY29uc29sZU91dHB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJylcbiAgICBjb25zb2xlT3V0cHV0LnN0eWxlLndpZHRoID0gJzQwdncnXG4gICAgY29uc29sZU91dHB1dC5zdHlsZS5oZWlnaHQgPSAnNDB2aCdcbiAgICBsZWZ0RGl2LmFwcGVuZENoaWxkKGNvbnNvbGVPdXRwdXQpXG5cblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGFzeW5jIGUgPT4ge1xuXG4gICAgICAgIGlmIChlLmN0cmxLZXkgJiYgZS5jb2RlID09PSAnRW50ZXInKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBicmFpbi5leGVjdXRlVW53cmFwcGVkKHRleHRhcmVhLnZhbHVlKVxuICAgICAgICAgICAgY29uc29sZU91dHB1dC52YWx1ZSA9IHJlc3VsdC50b1N0cmluZygpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gICAgICAgIH0gZWxzZSBpZiAoZS5jdHJsS2V5ICYmIGUuY29kZSA9PT0gJ0tleVknKSB7XG4gICAgICAgICAgICBtYWluKClcbiAgICAgICAgfVxuXG4gICAgfSlcblxufSIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlLCBRdWVyeU9wdHMgfSBmcm9tIFwiLi9DbGF1c2VcIjtcbmltcG9ydCB7IElkIH0gZnJvbSBcIi4uL2lkL0lkXCI7XG5pbXBvcnQgeyBzb3J0SWRzIH0gZnJvbSBcIi4uL2lkL2Z1bmN0aW9ucy9zb3J0SWRzXCI7XG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyBoYXNoU3RyaW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2hhc2hTdHJpbmdcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgc29sdmVNYXBzIH0gZnJvbSBcIi4vZnVuY3Rpb25zL3NvbHZlTWFwc1wiO1xuLy8gaW1wb3J0IEltcGx5IGZyb20gXCIuL0ltcGx5XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuZCBpbXBsZW1lbnRzIENsYXVzZSB7XG5cbiAgICByZWFkb25seSBoYXNoQ29kZSA9IGhhc2hTdHJpbmcodGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKSArIHRoaXMubmVnYXRlZClcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5jbGF1c2UxLmVudGl0aWVzLmNvbmNhdCh0aGlzLmNsYXVzZTIuZW50aXRpZXMpKVxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzID0gdGhpcy5yaGVtZSAhPT0gZW1wdHlDbGF1c2VcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjbGF1c2UxOiBDbGF1c2UsXG4gICAgICAgIHJlYWRvbmx5IGNsYXVzZTI6IENsYXVzZSxcbiAgICAgICAgcmVhZG9ubHkgY2xhdXNlMklzUmhlbWUgPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgbmVnYXRlZCA9IGZhbHNlLFxuICAgICkge1xuXG4gICAgfVxuXG4gICAgYW5kKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBbmQodGhpcywgb3RoZXIsIG9wdHM/LmFzUmhlbWUgPz8gZmFsc2UpXG4gICAgfVxuXG4gICAgY29weShvcHRzPzogQ29weU9wdHMpOiBDbGF1c2Uge1xuICAgICAgICByZXR1cm4gbmV3IEFuZChcbiAgICAgICAgICAgIG9wdHM/LmNsYXVzZTEgPz8gdGhpcy5jbGF1c2UxLmNvcHkob3B0cyksXG4gICAgICAgICAgICBvcHRzPy5jbGF1c2UyID8/IHRoaXMuY2xhdXNlMi5jb3B5KG9wdHMpLFxuICAgICAgICAgICAgdGhpcy5jbGF1c2UySXNSaGVtZSxcbiAgICAgICAgICAgIG9wdHM/Lm5lZ2F0ZSA/PyB0aGlzLm5lZ2F0ZWQsXG4gICAgICAgIClcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgY29uc3QgeWVzID0gdGhpcy5jbGF1c2UxLnRvU3RyaW5nKCkgKyAnLCcgKyB0aGlzLmNsYXVzZTIudG9TdHJpbmcoKVxuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gYG5vdCR7eWVzfWAgOiB5ZXNcbiAgICB9XG5cbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gdGhpcy5jbGF1c2UxLm93bmVkQnkoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZWRCeShpZCkpXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKTogSWRbXSA9PiB0aGlzLmNsYXVzZTEub3duZXJzT2YoaWQpLmNvbmNhdCh0aGlzLmNsYXVzZTIub3duZXJzT2YoaWQpKVxuXG4gICAgZmxhdExpc3QoKTogQ2xhdXNlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5uZWdhdGVkID8gW3RoaXNdIDogWy4uLnRoaXMuY2xhdXNlMS5mbGF0TGlzdCgpLCAuLi50aGlzLmNsYXVzZTIuZmxhdExpc3QoKV1cbiAgICB9XG5cbiAgICBnZXQgdGhlbWUoKTogQ2xhdXNlIHsgLy8gY2FuJ3QgYmUgcHJvcCwgYmVjYXVzZSB3b3VsZCBiZSBjYWxsZWQgaW4gQW5kJ3MgY29ucywgQmFzaWNDbHVzZS5hbmQoKSBjYWxscyBBbmQncyBjb25zLCBcXGluZiByZWN1cnNpb24gZW5zdWVzXG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UxIDogdGhpcy5jbGF1c2UxLnRoZW1lLmFuZCh0aGlzLmNsYXVzZTIudGhlbWUpXG4gICAgfVxuXG4gICAgZ2V0IHJoZW1lKCk6IENsYXVzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNsYXVzZTJJc1JoZW1lID8gdGhpcy5jbGF1c2UyIDogdGhpcy5jbGF1c2UxLnJoZW1lLmFuZCh0aGlzLmNsYXVzZTIucmhlbWUpXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSwgb3B0cz86IFF1ZXJ5T3B0cyk6IE1hcFtdIHtcblxuICAgICAgICBjb25zdCB1bml2ZXJzZSA9IHRoaXMuY2xhdXNlMS5hbmQodGhpcy5jbGF1c2UyKVxuICAgICAgICBjb25zdCBpdCA9IG9wdHM/Lml0ID8/IHNvcnRJZHModW5pdmVyc2UuZW50aXRpZXMpLmF0KC0xKSEgLy9UT0RPIVxuXG4gICAgICAgIGNvbnN0IHVuaXZlcnNlTGlzdCA9IHVuaXZlcnNlLmZsYXRMaXN0KClcbiAgICAgICAgY29uc3QgcXVlcnlMaXN0ID0gcXVlcnkuZmxhdExpc3QoKVxuICAgICAgICBjb25zdCBtYXBzID0gc29sdmVNYXBzKHF1ZXJ5TGlzdCwgdW5pdmVyc2VMaXN0KVxuXG4gICAgICAgIGNvbnN0IHByb25NYXA6IE1hcCA9IHF1ZXJ5TGlzdC5maWx0ZXIoYyA9PiBjLnByZWRpY2F0ZT8udHlwZSA9PT0gJ3Byb25vdW4nKS5tYXAoYyA9PiAoeyBbYy5hcmdzPy5hdCgwKSFdOiBpdCB9KSkucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbiAgICAgICAgY29uc3QgcmVzID0gbWFwcy5jb25jYXQocHJvbk1hcCkuZmlsdGVyKG0gPT4gT2JqZWN0LmtleXMobSkubGVuZ3RoKSAvLyBlbXB0eSBtYXBzIGNhdXNlIHByb2JsZW1zIGFsbCBhcm91bmQgdGhlIGNvZGUhXG5cbiAgICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIGdldCBzaW1wbGUoKSB7XG5cbiAgICAgICAgY29uc3QgYzEgPSB0aGlzLmNsYXVzZTEuc2ltcGxlXG4gICAgICAgIGNvbnN0IGMyID0gdGhpcy5jbGF1c2UyLnNpbXBsZVxuXG4gICAgICAgIGlmIChjMi5oYXNoQ29kZSA9PT0gZW1wdHlDbGF1c2UuaGFzaENvZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBjMVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGMxLmhhc2hDb2RlID09PSBlbXB0eUNsYXVzZS5oYXNoQ29kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMyXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jb3B5KHsgY2xhdXNlMTogYzEsIGNsYXVzZTI6IGMyIH0pXG4gICAgfVxuXG4gICAgLy8gaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gbmV3IEltcGx5KHRoaXMsIGNvbmNsdXNpb24pXG5cbn1cbiIsImltcG9ydCB7IENsYXVzZSwgQW5kT3B0cywgQ29weU9wdHMsIGVtcHR5Q2xhdXNlIH0gZnJvbSBcIi4vQ2xhdXNlXCI7XG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSBcIi4uL2lkL01hcFwiO1xuaW1wb3J0IEFuZCBmcm9tIFwiLi9BbmRcIjtcbmltcG9ydCB7IExleGVtZSB9IGZyb20gXCIuLi8uLi9mcm9udGVuZC9sZXhlci9MZXhlbWVcIjtcbmltcG9ydCB7IHVuaXEgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdW5pcVwiO1xuaW1wb3J0IHsgaGFzaFN0cmluZyB9IGZyb20gXCIuLi8uLi91dGlscy9oYXNoU3RyaW5nXCI7XG4vLyBpbXBvcnQgSW1wbHkgZnJvbSBcIi4vSW1wbHlcIjtcblxuZXhwb3J0IGNsYXNzIEF0b21DbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgc2ltcGxlID0gdGhpc1xuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gZW1wdHlDbGF1c2VcbiAgICByZWFkb25seSBlbnRpdGllcyA9IHVuaXEodGhpcy5hcmdzKVxuICAgIHJlYWRvbmx5IGhhc2hDb2RlID0gaGFzaFN0cmluZyhKU09OLnN0cmluZ2lmeSh7IHByZWRpY2F0ZTogdGhpcy5wcmVkaWNhdGUucm9vdCwgYXJnczogdGhpcy5hcmdzLCBuZWdhdGVkOiB0aGlzLm5lZ2F0ZWQgfSkpXG4gICAgcmVhZG9ubHkgaGFzU2lkZUVmZmVjdHMgPSB0aGlzLnJoZW1lICE9PSBlbXB0eUNsYXVzZVxuXG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcHJlZGljYXRlOiBMZXhlbWUsXG4gICAgICAgIHJlYWRvbmx5IGFyZ3M6IElkW10sXG4gICAgICAgIHJlYWRvbmx5IG5lZ2F0ZWQgPSBmYWxzZSxcbiAgICApIHtcblxuICAgIH1cblxuICAgIGNvcHkgPSAob3B0cz86IENvcHlPcHRzKSA9PiBuZXcgQXRvbUNsYXVzZShcbiAgICAgICAgdGhpcy5wcmVkaWNhdGUsXG4gICAgICAgIHRoaXMuYXJncy5tYXAoYSA9PiBvcHRzPy5tYXA/LlthXSA/PyBhKSxcbiAgICAgICAgb3B0cz8ubmVnYXRlID8/IHRoaXMubmVnYXRlZCxcbiAgICApXG5cbiAgICBhbmQgPSAob3RoZXI6IENsYXVzZSwgb3B0cz86IEFuZE9wdHMpOiBDbGF1c2UgPT4gbmV3IEFuZCh0aGlzLCBvdGhlciwgb3B0cz8uYXNSaGVtZSA/PyBmYWxzZSlcbiAgICBmbGF0TGlzdCA9ICgpID0+IFt0aGlzXVxuICAgIG93bmVkQnkgPSAoaWQ6IElkKSA9PiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1sxXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzBdXSA6IFtdXG4gICAgb3duZXJzT2YgPSAoaWQ6IElkKSA9PiB0aGlzLnByZWRpY2F0ZS5yb290ID09PSAnb2YnICYmIHRoaXMuYXJnc1swXSA9PT0gaWQgPyBbdGhpcy5hcmdzWzFdXSA6IFtdXG4gICAgXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIGNvbnN0IHllcyA9IGAke3RoaXMucHJlZGljYXRlLnJvb3R9KCR7dGhpcy5hcmdzfSlgXG4gICAgICAgIHJldHVybiB0aGlzLm5lZ2F0ZWQgPyBgbm90KCR7eWVzfSlgIDogeWVzXG4gICAgfVxuXG4gICAgcXVlcnkocXVlcnk6IENsYXVzZSk6IE1hcFtdIHtcblxuICAgICAgICBpZiAoIShxdWVyeSBpbnN0YW5jZW9mIEF0b21DbGF1c2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnByZWRpY2F0ZS5yb290ICE9PSBxdWVyeS5wcmVkaWNhdGUucm9vdCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXAgPSBxdWVyeS5hcmdzXG4gICAgICAgIC5tYXAoKHgsIGkpID0+ICh7IFt4XTogdGhpcy5hcmdzW2ldIH0pKVxuICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gKHsgLi4uYSwgLi4uYiB9KSlcblxuICAgICAgICByZXR1cm4gW21hcF1cbiAgICB9XG5cbiAgICAvLyBpbXBsaWVzID0gKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZSA9PiBuZXcgSW1wbHkodGhpcywgY29uY2x1c2lvbilcbiAgICBcbn0iLCJpbXBvcnQgeyBBdG9tQ2xhdXNlIH0gZnJvbSBcIi4vQXRvbUNsYXVzZVwiXG5pbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9pZC9JZFwiXG5pbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vaWQvTWFwXCJcbmltcG9ydCBFbXB0eUNsYXVzZSBmcm9tIFwiLi9FbXB0eUNsYXVzZVwiXG5pbXBvcnQgeyBMZXhlbWUgfSBmcm9tIFwiLi4vLi4vZnJvbnRlbmQvbGV4ZXIvTGV4ZW1lXCJcblxuLyoqXG4gKiBBbiB1bmFtYmlndW91cyBwcmVkaWNhdGUtbG9naWMtbGlrZSBpbnRlcm1lZGlhdGUgcmVwcmVzZW50YXRpb25cbiAqIG9mIHRoZSBwcm9ncmFtbWVyJ3MgaW50ZW50LlxuKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ2xhdXNlIHtcblxuICAgIHJlYWRvbmx5IGhhc2hDb2RlOiBudW1iZXJcbiAgICByZWFkb25seSBlbnRpdGllczogSWRbXVxuICAgIHJlYWRvbmx5IHRoZW1lOiBDbGF1c2VcbiAgICByZWFkb25seSByaGVtZTogQ2xhdXNlXG4gICAgcmVhZG9ubHkgc2ltcGxlOiBDbGF1c2VcbiAgICBjb3B5KG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZVxuICAgIGFuZChvdGhlcjogQ2xhdXNlLCBvcHRzPzogQW5kT3B0cyk6IENsYXVzZVxuICAgIGZsYXRMaXN0KCk6IENsYXVzZVtdXG4gICAgb3duZWRCeShpZDogSWQpOiBJZFtdXG4gICAgb3duZXJzT2YoaWQ6IElkKTogSWRbXVxuICAgIHF1ZXJ5KGNsYXVzZTogQ2xhdXNlLCBvcHRzPzogUXVlcnlPcHRzKTogTWFwW11cbiAgICAvLyBpbXBsaWVzKGNvbmNsdXNpb246IENsYXVzZSk6IENsYXVzZVxuXG4gICAgcmVhZG9ubHkgcHJlZGljYXRlPzogTGV4ZW1lXG4gICAgcmVhZG9ubHkgYXJncz86IElkW11cbiAgICByZWFkb25seSBuZWdhdGVkPzogYm9vbGVhblxuICAgIHJlYWRvbmx5IGhhc1NpZGVFZmZlY3RzPzogYm9vbGVhblxuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGF1c2VPZihwcmVkaWNhdGU6IExleGVtZSwgLi4uYXJnczogSWRbXSk6IENsYXVzZSB7XG4gICAgcmV0dXJuIG5ldyBBdG9tQ2xhdXNlKHByZWRpY2F0ZSwgYXJncylcbn1cblxuZXhwb3J0IGNvbnN0IGVtcHR5Q2xhdXNlOiBDbGF1c2UgPSBuZXcgRW1wdHlDbGF1c2UoKVxuXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRzIHtcbiAgICBuZWdhdGU/OiBib29sZWFuXG4gICAgbWFwPzogTWFwXG4gICAgc2lkZUVmZmVjdHk/OiBib29sZWFuXG4gICAgY2xhdXNlMT86IENsYXVzZVxuICAgIGNsYXVzZTI/OiBDbGF1c2VcbiAgICBzdWJqY29uaj86IExleGVtZVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFuZE9wdHMge1xuICAgIGFzUmhlbWU/OiBib29sZWFuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUXVlcnlPcHRzIHtcbiAgICBpdD86IElkXG59IiwiaW1wb3J0IHsgQW5kT3B0cywgQ2xhdXNlLCBDb3B5T3B0cyB9IGZyb20gXCIuL0NsYXVzZVwiO1xuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vaWQvSWRcIjtcbmltcG9ydCB7IE1hcCB9IGZyb20gXCIuLi9pZC9NYXBcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW1wdHlDbGF1c2UgaW1wbGVtZW50cyBDbGF1c2Uge1xuXG4gICAgcmVhZG9ubHkgaGFzaENvZGUgPSAwXG4gICAgcmVhZG9ubHkgZW50aXRpZXMgPSBbXVxuICAgIHJlYWRvbmx5IHRoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHJoZW1lID0gdGhpc1xuICAgIHJlYWRvbmx5IHNpbXBsZSA9IHRoaXNcbiAgICByZWFkb25seSBoYXNTaWRlRWZmZWN0cyA9IGZhbHNlXG5cbiAgICBjb3B5ID0gKG9wdHM/OiBDb3B5T3B0cyk6IENsYXVzZSA9PiB0aGlzXG4gICAgYW5kID0gKG90aGVyOiBDbGF1c2UsIG9wdHM/OiBBbmRPcHRzKTogQ2xhdXNlID0+IG90aGVyXG4gICAgaW1wbGllcyA9IChjb25jbHVzaW9uOiBDbGF1c2UpOiBDbGF1c2UgPT4gY29uY2x1c2lvblxuICAgIGZsYXRMaXN0ID0gKCkgPT4gW11cbiAgICBvd25lZEJ5ID0gKGlkOiBJZCk6IElkW10gPT4gW11cbiAgICBvd25lcnNPZiA9IChpZDogSWQpOiBJZFtdID0+IFtdXG4gICAgcXVlcnkgPSAoY2xhdXNlOiBDbGF1c2UpOiBNYXBbXSA9PiBbXVxuICAgIHRvU3RyaW5nID0gKCkgPT4gJydcblxufSIsImltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIlxuaW1wb3J0IHsgSWQgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIlxuaW1wb3J0IHsgZ2V0VG9wTGV2ZWwgfSBmcm9tIFwiLi90b3BMZXZlbFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPd25lcnNoaXBDaGFpbihjbGF1c2U6IENsYXVzZSwgZW50aXR5OiBJZCB8dW5kZWZpbmVkID0gZ2V0VG9wTGV2ZWwoY2xhdXNlKVswXSk6IElkW10ge1xuXG4gICAgLy8gY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIC8vIGNvbnN0IHRvcExldmVsID0gZ2V0VG9wTGV2ZWwoY2xhdXNlKVswXVxuXG4gICAgaWYgKCFlbnRpdHkpIHtcbiAgICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgY29uc3Qgb3duZWRFbnRpdGllcyA9IGNsYXVzZS5vd25lZEJ5KGVudGl0eSlcblxuICAgIHJldHVybiBvd25lZEVudGl0aWVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgIFtlbnRpdHldIDpcbiAgICAgICAgW2VudGl0eV0uY29uY2F0KGdldE93bmVyc2hpcENoYWluKGNsYXVzZSwgb3duZWRFbnRpdGllc1swXSkpXG5cbn0iLCJpbXBvcnQgeyBNYXAgfSBmcm9tIFwiLi4vLi4vaWQvTWFwXCI7XG5pbXBvcnQgeyB1bmlxIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzL3VuaXFcIjtcbmltcG9ydCB7IGludGVyc2VjdGlvbiB9IGZyb20gXCIuLi8uLi8uLi91dGlscy9pbnRlcnNlY3Rpb25cIjtcbmltcG9ydCB7IFNwZWNpYWxJZHMgfSBmcm9tIFwiLi4vLi4vaWQvSWRcIjtcbmltcG9ydCB7IENsYXVzZSB9IGZyb20gXCIuLi9DbGF1c2VcIjtcblxuLyoqXG4gKiBGaW5kcyBwb3NzaWJsZSBNYXAtaW5ncyBmcm9tIHF1ZXJ5TGlzdCB0byB1bml2ZXJzZUxpc3RcbiAqIHtAbGluayBcImZpbGU6Ly8uLy4uLy4uLy4uLy4uLy4uL2RvY3Mvbm90ZXMvdW5pZmljYXRpb24tYWxnby5tZFwifVxuICovXG5leHBvcnQgZnVuY3Rpb24gc29sdmVNYXBzKHF1ZXJ5TGlzdDogQ2xhdXNlW10sIHVuaXZlcnNlTGlzdDogQ2xhdXNlW10pOiBNYXBbXSB7XG5cbiAgICBjb25zdCBjYW5kaWRhdGVzID0gZmluZENhbmRpZGF0ZXMocXVlcnlMaXN0LCB1bml2ZXJzZUxpc3QpXG5cbiAgICBjYW5kaWRhdGVzLmZvckVhY2goKG1sMSwgaSkgPT4ge1xuICAgICAgICBjYW5kaWRhdGVzLmZvckVhY2goKG1sMiwgaikgPT4ge1xuXG4gICAgICAgICAgICBpZiAobWwxLmxlbmd0aCAmJiBtbDIubGVuZ3RoICYmIGkgIT09IGopIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXJnZWQgPSBtZXJnZShtbDEsIG1sMilcbiAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW2ldID0gW11cbiAgICAgICAgICAgICAgICBjYW5kaWRhdGVzW2pdID0gbWVyZ2VkXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNhbmRpZGF0ZXMuZmxhdCgpLmZpbHRlcih4ID0+ICFpc0ltcG9zaWJsZSh4KSlcbn1cblxuZnVuY3Rpb24gZmluZENhbmRpZGF0ZXMocXVlcnlMaXN0OiBDbGF1c2VbXSwgdW5pdmVyc2VMaXN0OiBDbGF1c2VbXSk6IE1hcFtdW10ge1xuICAgIHJldHVybiBxdWVyeUxpc3QubWFwKHEgPT4ge1xuICAgICAgICBjb25zdCByZXMgPSB1bml2ZXJzZUxpc3QuZmxhdE1hcCh1ID0+IHUucXVlcnkocSkpXG4gICAgICAgIHJldHVybiByZXMubGVuZ3RoID8gcmVzIDogW21ha2VJbXBvc3NpYmxlKHEpXVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIG1lcmdlKG1sMTogTWFwW10sIG1sMjogTWFwW10pIHtcblxuICAgIGNvbnN0IG1lcmdlZDogTWFwW10gPSBbXVxuXG4gICAgbWwxLmZvckVhY2gobTEgPT4ge1xuICAgICAgICBtbDIuZm9yRWFjaChtMiA9PiB7XG5cbiAgICAgICAgICAgIGlmIChtYXBzQWdyZWUobTEsIG0yKSkge1xuICAgICAgICAgICAgICAgIG1lcmdlZC5wdXNoKHsgLi4ubTEsIC4uLm0yIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIHVuaXEobWVyZ2VkKVxufVxuXG5mdW5jdGlvbiBtYXBzQWdyZWUobTE6IE1hcCwgbTI6IE1hcCkge1xuICAgIGNvbnN0IGNvbW1vbktleXMgPSBpbnRlcnNlY3Rpb24oT2JqZWN0LmtleXMobTEpLCBPYmplY3Qua2V5cyhtMikpXG4gICAgcmV0dXJuIGNvbW1vbktleXMuZXZlcnkoayA9PiBtMVtrXSA9PT0gbTJba10pXG59XG5cbmZ1bmN0aW9uIG1ha2VJbXBvc3NpYmxlKHE6IENsYXVzZSk6IE1hcCB7XG4gICAgcmV0dXJuIHEuZW50aXRpZXNcbiAgICAgICAgLm1hcCh4ID0+ICh7IFt4XTogU3BlY2lhbElkcy5JTVBPU1NJQkxFIH0pKVxuICAgICAgICAucmVkdWNlKChhLCBiKSA9PiAoeyAuLi5hLCAuLi5iIH0pLCB7fSlcbn1cblxuZnVuY3Rpb24gaXNJbXBvc2libGUobWFwOiBNYXApIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhtYXApLmluY2x1ZGVzKFNwZWNpYWxJZHMuSU1QT1NTSUJMRSlcbn0iLCJpbXBvcnQgeyBDbGF1c2UgfSBmcm9tIFwiLi4vQ2xhdXNlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3BMZXZlbChjbGF1c2U6IENsYXVzZSkge1xuICAgIHJldHVybiBjbGF1c2VcbiAgICAgICAgLmVudGl0aWVzXG4gICAgICAgIC5tYXAoeCA9PiAoeyB4LCBvd25lcnM6IGNsYXVzZS5vd25lcnNPZih4KSB9KSlcbiAgICAgICAgLmZpbHRlcih4ID0+IHgub3duZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgLm1hcCh4ID0+IHgueClcbn0iLCJcbi8qKlxuICogSWQgb2YgYW4gZW50aXR5LlxuICovXG5leHBvcnQgdHlwZSBJZCA9IHN0cmluZ1xuXG4vKipcbiAqIFNvbWUgc3BlY2lhbCBJZHNcbiAqL1xuZXhwb3J0IGNvbnN0IFNwZWNpYWxJZHMgPSB7XG4gICAgSU1QT1NTSUJMRTogJ0lNUE9TU0lCTEUnXG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5jcmVtZW50YWxJZCgpOiBJZCB7XG4gICAgY29uc3QgbmV3SWQgPSBgaWQke2lkR2VuZXJhdG9yLm5leHQoKS52YWx1ZX1gO1xuICAgIHJldHVybiBuZXdJZFxufVxuXG5jb25zdCBpZEdlbmVyYXRvciA9IGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKTtcblxuZnVuY3Rpb24qIGdldEluY3JlbWVudGFsSWRHZW5lcmF0b3IoKSB7XG4gICAgbGV0IHggPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHgrKztcbiAgICAgICAgeWllbGQgeDtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuXG5cblxuXG5leHBvcnQgZnVuY3Rpb24gaWRUb051bShpZDogSWQpIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoaWQudG9TdHJpbmcoKS5yZXBsYWNlQWxsKC9cXEQrL2csICcnKSk7XG59XG4iLCJpbXBvcnQgeyBJZCB9IGZyb20gXCIuLi9JZFwiO1xuaW1wb3J0IHsgaWRUb051bSB9IGZyb20gXCIuL2lkVG9OdW1cIjtcblxuLyoqXG4gKiBTb3J0IGlkcyBpbiBhc2NlbmRpbmcgb3JkZXIuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRJZHMoaWRzOiBJZFtdKSB7XG4gICAgcmV0dXJuIGlkcy5zb3J0KChhLCBiKSA9PiBpZFRvTnVtKGEpIC0gaWRUb051bShiKSk7XG59XG4iLCJcbmV4cG9ydCBmdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5zcGxpdCgnJykubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKS5yZWR1Y2UoKGhhc2gsIGNjKSA9PiB7XG4gICAgICAgIGNvbnN0IGgxID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjY1xuICAgICAgICByZXR1cm4gaDEgJiBoMSAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9KVxufVxuIiwiaW1wb3J0IHsgdW5pcSB9IGZyb20gXCIuL3VuaXFcIlxuXG4vKipcbiAqIEludGVyc2VjdGlvbiBiZXR3ZWVuIHR3byBsaXN0cyBvZiBzdHJpbmdzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJzZWN0aW9uKHhzOiBzdHJpbmdbXSwgeXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIHVuaXEoeHMuZmlsdGVyKHggPT4geXMuaW5jbHVkZXMoeCkpXG4gICAgICAgIC5jb25jYXQoeXMuZmlsdGVyKHkgPT4geHMuaW5jbHVkZXMoeSkpKSlcbn1cbiIsIlxuLyoqXG4gKiBDaGVja3MgaWYgc3RyaW5nIGhhcyBhbnkgbm9uLWRpZ2l0IGNoYXIgKGV4Y2VwdCBmb3IgXCIuXCIpIGJlZm9yZVxuICogY29udmVydGluZyB0byBudW1iZXIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU51bWJlcihzdHJpbmc6IHN0cmluZyk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG5cbiAgICBjb25zdCBub25EaWcgPSBzdHJpbmcubWF0Y2goL1xcRC9nKT8uYXQoMClcblxuICAgIGlmIChub25EaWcgJiYgbm9uRGlnICE9PSAnLicpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHJldHVybiBwYXJzZUZsb2F0KHN0cmluZylcblxufSIsImV4cG9ydCBmdW5jdGlvbiBzdHJpbmdMaXRlcmFsczxUIGV4dGVuZHMgc3RyaW5nPiguLi5hcmdzOiBUW10pOiBUW10geyByZXR1cm4gYXJnczsgfVxuIiwiLyoqXG4gKiBSZW1vdmUgZHVwbGljYXRlcyBmcm9tIGFuIGFycmF5LiBFcXVhbGl0eSBieSBKU09OLnN0cmluZ2lmeS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuaXE8VD4oc2VxOiBUW10pOiBUW10ge1xuICAgIGxldCBzZWVuID0ge30gYXMgYW55XG5cbiAgICByZXR1cm4gc2VxLmZpbHRlcihlID0+IHtcbiAgICAgICAgY29uc3QgayA9IEpTT04uc3RyaW5naWZ5KGUpXG4gICAgICAgIHJldHVybiBzZWVuLmhhc093blByb3BlcnR5KGspID8gZmFsc2UgOiAoc2VlbltrXSA9IHRydWUpXG4gICAgfSlcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9hcHAvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=