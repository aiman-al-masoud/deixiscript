import sys
from typing import Callable, Generic, Literal, TypeVar, overload
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

    def complement(self, name:str, thing:'Ast|EB|str|int'):
        if not isinstance(self.e, SimpleSentence): raise Exception()
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
        return e(self.e).eval(kb).head
    
    def count(self, kb=KB()):
        return len(self.get(kb).unroll())
    
    def tell(self, kb=KB()):
        return self.new.eval(kb)

def e(x:Ast|EB|str|int):
    if isinstance(x, EB):
        return x
    elif isinstance(x, Ast):
        return EB(x)
    elif isinstance(x, str):
        return EB(Str(x))
    elif isinstance(x, int):
        return EB(Int(x))
    raise Exception()

def does(v:str):
    return e(Str.GAP).does(Str(v))

def every(x:str):
    return the(sys.maxsize)(x)

@overload
def the(x:Literal['first', 'last'])->Callable[[str|int], Callable[[str], EB]]:...
@overload
def the(x:int)->Callable[[str], EB]:...
@overload
def the(x:str)->EB[Implicit]:...
def the(x:str|int)->object:

    match x:
        case 'first' | 'last':
            def f1(y:int):
                def f2(z:str):
                    return e(Implicit(head=Str(z), card=Int(y), ord=Str(x)))
                return f2
            return f1
        case int():
            return the('last')(x)
        case object():
            return the('last')(1)(x) # 1 or sys.maxsize


