import sys
from typing import Generic, TypeVar
from dataclasses import dataclass
from core.Ast import Ast
from core.SimpleSentence import SimpleSentence
from core.BinExp import BinExp
from core.Def import Def
from core.Law import Law
from core.Implicit import Implicit
from core.Str import Str
from core.Int import Int
from core.KB import KB


T=TypeVar('T', bound='Ast')

@dataclass(frozen=True)
class EB(Generic[T]):

    e:T

    def binop(self, op:str, right:'Ast|EB|str|int'):
        return EB(BinExp(op=Str(op), left=self.e, right=e(right).e))

    def and_(self, x:'Ast|EB|str|int'): return self.binop('and', x)
    def or_(self, x:'Ast|EB|str|int'): return self.binop('or', x)

    def does(self, verb:'Ast|EB|str'):
        return EB(SimpleSentence(verb=e(verb).e, subject=self.e))

    def complement(self, name:str, thing:'Ast|EB|str|int')->'EB[SimpleSentence]':
        if not isinstance(self.e, SimpleSentence): raise Exception
        v = self.e.copy(**{name:e(thing).e})
        return EB(v)

    def _(self, object:'Ast|EB|str|int'): return self.complement('object', object)
    def as_(self, as_:'Ast|EB|str|int'): return self.complement('as_', as_)
    def to(self, to:'Ast|EB|str|int'): return self.complement('to', to)
    def on(self, on:'Ast|EB|str|int'): return self.complement('on', on)

    def which(self, which:'Ast|EB')->'EB[Implicit]':
        assert isinstance(self.e, Implicit)
        return EB(self.e.copy(which=e(which).e))

    def when(self, definition:'Ast|EB|int|str'):
        return EB(Def(definendum=self.e, definition=e(definition).e))

    def after(self, cause:'Ast|EB'):
        return EB(Law(cause=e(cause).e, effect=self.e))

    @property
    def not_(self):
        return EB(self.e.copy(negation=Int(True)))

    @property
    def new(self):
        return EB(self.e.copy(cmd=Int(True)))

    def eval(self, kb=KB()):
        return self.e.eval(kb)

    def get(self, kb=KB()):
        return e(self.e).eval(kb).it
    
    def count(self, kb=KB()):
        return len(self.get(kb).unroll())
    
    def tell(self, kb=KB()):
        return self.new.eval(kb)

    def reallyIs(self, x:'Ast|EB|str'):
        return self.does('have')._(x).as_('concept')
        

def e(x:Ast|EB|str|int)->EB[Ast]:
    if isinstance(x, EB):
        return x
    elif isinstance(x, Ast):
        return EB(x)
    elif isinstance(x, str):
        return EB(Str(x))
    elif isinstance(x, int):
        return EB(Int(x))
    raise Exception

def does(v:str):
    return e(Str.GAP).does(Str(v))

def every(x:str):
    return the(sys.maxsize, x)

def the(*args:int|str):
    ord  = next((x for x in args if x in {'first', 'last'}), 'last')
    card = next((x for x in args if isinstance(x, int)), 1)
    head = [x for x in args if isinstance(x, str) and x!=ord][0]

    return e(Implicit(head=Str(head), card=Int(card), ord=Str(ord)))