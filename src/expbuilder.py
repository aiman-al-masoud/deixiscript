from dataclasses import dataclass
from functools import partial
from typing import Generic, TypeVar, cast
from language import AnalyticDerivation, Ast, BinExp, Command, Idiom, Negation, Noun, Numerality, SimpleSentence, Which
from KnowledgeBase import KnowledgeBase
from subst import subst


_=''    
'''linguistic gap denoting the empty noun-phrase'''

T=TypeVar('T', bound='Ast')

@dataclass(frozen=True)
class ExpBuilder(Generic[T]):

    e:T

    def binop(self, op:Ast, right:'Ast|ExpBuilder'):
        return ExpBuilder(BinExp(op, self.e, makeAst(right)))

    def equals(self, x:'Ast|ExpBuilder'):
        return self.binop('=', x)

    def _and(self, x:'Ast|ExpBuilder'):
        return self.binop('and', x)
    
    def _or(self, x:'Ast|ExpBuilder'):
        return self.binop('or', x)
    
    def plus(self, x:'ExpBuilder'):
        return self.binop('+', x)

    def verbSen(self, verb:'Ast|ExpBuilder', negation:bool):
        return ExpBuilder(SimpleSentence(makeAst(verb), self.e, _, negation, False, _, _, _))

    def does(self, verb:'Ast|ExpBuilder'):        
        return self.verbSen(verb, False)

    def does_not(self, verb:'Ast|ExpBuilder'):
        return self.verbSen(verb, True)

    def complement(self, name:str, thing:'Ast|ExpBuilder'):
        if not isinstance(self.e, SimpleSentence): raise Exception()

        v = SimpleSentence(**{**self.e.__dict__, name : makeAst(thing)})
        return ExpBuilder(v)

    def _(self, object:'Ast|ExpBuilder'): return self.complement('object', object)
    def as_(self, as_:'Ast|ExpBuilder'): return self.complement('as_', as_)
    def to(self, to:'Ast|ExpBuilder'): return self.complement('to', to)
    def on(self, on:'Ast|ExpBuilder'): return self.complement('on', on)

    def which(self, which:'Ast|ExpBuilder'):
        return ExpBuilder(Which(self.e, makeAst(which)))

    def when(self, definition:'Ast|ExpBuilder'):
        return ExpBuilder(AnalyticDerivation(self.e, makeAst(definition)))
    
    @property
    def idiom(self):
        return ExpBuilder(Idiom(self.e))

    def ask(self, kb=KnowledgeBase.empty): # TODO: change name to eval
        from ask import evaluate
        return evaluate(self.e, kb)

    def get(self, kb=KnowledgeBase.empty):
        return e(removeCommands(self.e)).ask(kb).head
    
    def count(self, kb=KnowledgeBase.empty):
        r = self.get(kb)
        return len(r) if isinstance(r, tuple) else 1
    
    def tell(self, kb=KnowledgeBase.empty):
        return new(self).ask(kb)

    def tellKb(self, kb=KnowledgeBase.empty):
        return self.tell(kb).kb


def e(x:Ast|ExpBuilder):
    '''explicit'''
    return ExpBuilder(makeAst(x))

def i(x:Ast):
    '''implicit'''
    return ExpBuilder(Noun(x))

def every(x:Ast):
    return ExpBuilder(Noun(x))

def does(v:Ast):
    return e(_).does(v)

def it_is_false_that(x:Ast|ExpBuilder):
    return ExpBuilder(Negation(makeAst(x)))

def makeAst(x:Ast|ExpBuilder)->Ast:
    return x if isinstance(x, Ast) else x.e

def new(x:Ast|ExpBuilder):
    return ExpBuilder(Command(makeAst(x)))

def the(card:int=1):
    def f(x:Ast):
        return ExpBuilder(Numerality(x, card, -1))
    return f

def removeCommands(x:Ast):
    p = partial(subst, lambda x:isinstance(x, Command), lambda x: cast(Command, x).value)
    y = p(x)
    z = p(y)
    return z