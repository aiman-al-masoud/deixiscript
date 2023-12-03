from typing import Any, List
from lark import Lark, Transformer
from lang import *


class Parser:
    def __init__(self, path='./grammar.lark'):
        self.lark=Lark(open(path).read())
        self.tran=Toast()
    
    def parse(self, code:str):
        # code=code.replace(' its ', " it's ")
        # code=code.replace('?', '?.')
        st=self.lark.parse(code)
        ast=self.tran.transform(st)
        return ast

class Toast(Transformer[Any, Prog]):
    
    def verb(self, cs): return cleanVerb(str(cs[0]))
    def NEGATION(self, c): return 'non'
    def COPULA(self, c): return 'be'
    def IF(self, c): return 'if'
    def VARIABLE(self, c): return Var(str(c))
    def NUMBER(self, c): return Num(str(c))
    def MATHOP(self, c): return str(c)
    def LOGICOP(self, c): return cleanLogicOp(str(c))
    def COMPAREOP(self, c): return str(c)
    def BOOL(self, c): return Bool(str(c)=='true')
    def PRONOUN(self, c): return Pronoun()
    def NOUN(self, c): return Str(c) 
    def STRING(self, c): return Str(c) 
    def genitive(self, cs): return Genitive(*cs)
    def defin(self, cs): return Def(*cs)
    def repeat(self, cs): return Repeat(*cs)
    def idea(self, cs): return Idea(*cs)
    def question(self, cs:List[Ast]): return cs[0].ask()
    def command(self, cs:List[Ast]): return cs[0].tell()

    def order(self, cs):return Order(*cs)
    
    def implicit_phrase(self, cs):
        if isinstance(cs[0], ImplicitPhrase): return cs[0] 
        return ImplicitPhrase(*cs)

    def compare_exp(self, cs): 
        match cs[1]:
            case '=': return EqExp(cs[0], cs[2])
            case '>=': return GteExp(cs[0], cs[2])
            case '<=': return LteExp(cs[0], cs[2])
            case '>': return GtExp(cs[0], cs[2])
            case '<': return LtExp(cs[0], cs[2])
            case '!=': return NeExp(cs[0], cs[2])
        raise Exception
    
    def math_exp(self, cs): 
        match cs[1]:
            case '+': return AddExp(cs[0], cs[2])
            case '-': return SubExp(cs[0], cs[2])
            case '*': return MulExp(cs[0], cs[2])
            case '/': return DivExp(cs[0], cs[2])
        raise Exception

    def logic_exp(self, cs): 
        match cs[1]:
            case 'and': return AndExp(cs[0], cs[2])
            case 'or': return OrExp(cs[0], cs[2])
        raise Exception

    def attributive(self, cs):
        neg = 'non' in cs
        adjective=Adjective(cs[1] if neg else cs[0], neg)
        noun = cs[2] if neg else cs[1]

        if isinstance(noun, Str): 
            return ImplicitPhrase(noun, (adjective,))

        if isinstance(noun, ImplicitPhrase):
            return ImplicitPhrase(
                noun.head,
                (*noun.adjectives, adjective),
                noun.cmd,
            )

    def potential_core(self, cs:List): return Potential(Idea(*cs))
    
    def potential_with_duration(self, cs:List):
        potential=cs[0]
        assert isinstance(potential, Potential)
        return Potential(potential.event, potential.precondition, cs[1])

    def potential_with_precondition(self, cs:List):
        potential=cs[0]
        assert isinstance(potential, Potential)
        return Potential(potential.event, cs[1], potential.durationSeconds)

    def existential_quantifier(self, cs:List):
        return ExistentialQuantifier(cs[0])

    def prog(self, cs): 
        flattened=flatten([list(x) if isinstance(x, Prog) else x for x in cs])
        return Prog(flattened)

def cleanVerb(v:str):
    if v in {'go', 'goes'}: return 'go'
    return v

def cleanLogicOp(op:str):
    if op==',': return 'and'
    return op

def flatten(s:List):
    if not s: return s
    if isinstance(s[0], List): return [*flatten(s[0]), *flatten(s[1:])]
    return [*s[:1], *flatten(s[1:])]
