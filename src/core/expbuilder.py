import sys
from dataclasses import dataclass
from typing import Callable, Generic, Literal, TypeVar, overload
from core.language import AnalyticDerivation, Ast, BinExp, Command, Domino, Explicit, Idiom, Implicit, Negation, Noun, Numerality, SimpleSentence, SyntheticDerivation, Which
from core.KnowledgeBase import KnowledgeBase


_=''    
'''linguistic gap denoting the empty noun-phrase'''

T=TypeVar('T', bound='Ast')

@dataclass(frozen=True)
class ExpBuilder(Generic[T]):

    e:T

    def binop(self, op:Ast, right:'Ast|ExpBuilder'):
        return ExpBuilder(BinExp(op, self.e, makeAst(right)))

    def equals(self, x:'Ast|ExpBuilder'):return self.binop('=', x)
    def and_(self, x:'Ast|ExpBuilder'): return self.binop('and', x)
    def or_(self, x:'Ast|ExpBuilder'): return self.binop('or', x)
    def plus(self, x:'ExpBuilder'): return self.binop('+', x)

    def does(self, verb:'Ast|ExpBuilder'):        
        return ExpBuilder(SimpleSentence(makeAst(verb), self.e))

    def complement(self, name:str, thing:'Ast|ExpBuilder'):
        if not isinstance(self.e, SimpleSentence): raise Exception()
        v = SimpleSentence(**{**self.e.__dict__, name : makeAst(thing)}) #TODO: dedup?
        return ExpBuilder(v)

    def _(self, object:'Ast|ExpBuilder'): return self.complement('object', object)
    def as_(self, as_:'Ast|ExpBuilder'): return self.complement('as_', as_)
    def to(self, to:'Ast|ExpBuilder'): return self.complement('to', to)
    def on(self, on:'Ast|ExpBuilder'): return self.complement('on', on)

    def which(self, which:'Ast|ExpBuilder'):
        return ExpBuilder(Which(self.e, makeAst(which)))

    def when(self, definition:'Ast|ExpBuilder'):
        return ExpBuilder(AnalyticDerivation(self.e, Idiom(makeAst(definition))))

    def after(self, cause:'Ast|ExpBuilder'):
        return ExpBuilder(SyntheticDerivation(makeAst(cause), Domino(self.e)))

    @property
    def new(self): 
        return ExpBuilder(Command(self.e))

    @property
    def idiom(self): return ExpBuilder(Idiom(self.e))
    
    @property
    def domino(self): return ExpBuilder(Domino(self.e))

    def ask(self, kb=KnowledgeBase()):
        from core.ask import ask
        return ask(self.e, kb)

    def get(self, kb=KnowledgeBase()):
        return e(self.e).ask(kb).head
    
    def count(self, kb=KnowledgeBase()):
        r = self.get(kb)
        return len(r) if isinstance(r, tuple) else 1
    
    def tell(self, kb=KnowledgeBase()):
        return new(self.e).ask(kb)
    
    def rTell(self, kb=KnowledgeBase()):
        return e(cmd(self.e)).tell(kb)
            
    @property
    def lin(self):
        from core.linearize import linearize
        return linearize(self.e)


def e(x:Ast|ExpBuilder):
    return ExpBuilder(makeAst(x))

def does(v:Ast):
    return e(_).does(v)

def it_is_false_that(x:Ast|ExpBuilder):
    return ExpBuilder(Negation(makeAst(x)))

def makeAst(x:Ast|ExpBuilder)->Ast:
    return x if isinstance(x, Ast) else x.e

def new(x:Ast|ExpBuilder):
    return e(x).new

@overload
def the(x:Literal['first', 'last'])->Callable[[Ast], Callable[[Ast], ExpBuilder]]:...
@overload
def the(x:int)->Callable[[Ast], ExpBuilder]:...
@overload
def the(x:Ast)->ExpBuilder[Numerality]:...
def the(x:Ast=sys.maxsize)->object:

    match x:
        case 'first' | 'last':
            return lambda y: lambda z: e(Numerality(makeImplicit(z), y, x))
        case int():
            return the('last')(x)
        case object():
            return the('last')(1)(x) # 1 or sys.maxsize

def makeImplicit(ast:Ast):
    from core.decompressed import isImplicitish, isNounPhrasish
    assert isNounPhrasish(ast)
    return ast if isImplicitish(ast) else Noun(ast)

def i(x:Ast|ExpBuilder):
    return ExpBuilder(Noun(makeAst(x)))

def every(x:Ast): # or any
    return the(sys.maxsize)(x)

def cmd(ast:Ast)->Ast:
    if isinstance(ast, Explicit): return ast
    if isinstance(ast, Implicit): return Command(ast)
    x1 = vars(ast).items()
    x2 = {k : cmd(v) for k,v in x1}
    return Command(ast.__class__(**x2))