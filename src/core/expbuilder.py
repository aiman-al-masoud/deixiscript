import sys
from dataclasses import dataclass
from typing import Callable, Generic, Literal, TypeVar, overload
from core.language import GAP, Def, Ast, BinExp, Implicit, SimpleSentence, Law, copy
from core.KnowledgeBase import KnowledgeBase


T=TypeVar('T', bound='Ast')

@dataclass(frozen=True)
class EB(Generic[T]):

    e:T

    def binop(self, op:Ast, right:'Ast|EB'):
        return EB(BinExp(op=op, left=self.e, right=makeAst(right)))

    def equals(self, x:'Ast|EB'):return self.binop('=', x)
    def and_(self, x:'Ast|EB'): return self.binop('and', x)
    def or_(self, x:'Ast|EB'): return self.binop('or', x)
    def plus(self, x:'EB'): return self.binop('+', x)

    def does(self, verb:'Ast|EB'):        
        return EB(SimpleSentence(makeAst(verb), self.e))

    def complement(self, name:str, thing:'Ast|EB'):
        if not isinstance(self.e, SimpleSentence): raise Exception()
        v = copy(self.e, **{name:makeAst(thing)})
        return EB(v)

    def _(self, object:'Ast|EB'): return self.complement('object', object)
    def as_(self, as_:'Ast|EB'): return self.complement('as_', as_)
    def to(self, to:'Ast|EB'): return self.complement('to', to)
    def on(self, on:'Ast|EB'): return self.complement('on', on)

    def which(self, which:'Ast|EB'):
        assert isinstance(self.e, Implicit)
        return EB(Implicit(**{**vars(self.e), 'which':makeAst(which)}))

    def when(self, definition:'Ast|EB'):
        return EB(Def(definendum=self.e, definition=makeAst(definition)))

    def after(self, cause:'Ast|EB'):
        return EB(Law(  cause=makeAst(cause), effect=self.e))

    @property
    def new(self): 
        x1=copy(self.e, cmd=True)
        return EB(x1)

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

def e(x:Ast|EB):
    return EB(makeAst(x))

def does(v:Ast):
    return e(GAP).does(v)

def it_is_false_that(x:Ast|EB):
    return EB(copy(makeAst(x), negation=True))

def makeAst(x:Ast|EB)->Ast:
    return x if isinstance(x, Ast) else x.e

def new(x:Ast|EB):
    return e(x).new

@overload
def the(x:Literal['first', 'last'])->Callable[[Ast], Callable[[Ast], EB]]:...
@overload
def the(x:int)->Callable[[Ast], EB]:...
@overload
def the(x:Ast)->EB[Implicit]:...
def the(x:Ast=sys.maxsize)->object:

    match x:
        case 'first' | 'last':
            return lambda y: lambda z: e(Implicit(z, y, x))
        case int():
            return the('last')(x)
        case object():
            return the('last')(1)(x) # 1 or sys.maxsize

def makeImplicit(ast:Ast):
    from core.decompressed import isImplicitish, isNounPhrasish
    assert isNounPhrasish(ast)
    return ast if isImplicitish(ast) else Implicit(ast)

def every(x:Ast): # or any
    return the(sys.maxsize)(x)
