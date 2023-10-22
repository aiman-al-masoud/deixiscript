from dataclasses import dataclass
from typing import Dict, Sequence, TypeVar


class Explicit():
    __slots__=()

class Str(str, Explicit):
    pass

class Int(int, Explicit):
    pass

@dataclass(frozen=True)
class Implicit:
    head:Str
    card:Int =Int(1)
    ord:'Ast'  =Str('last')
    which:'Ast'=Int(True)
    negation:Int=Int(False)
    cmd:Int=Int(False)
    concept:Int=Int(False)

@dataclass(frozen=True)
class BinExp:
    op:Str
    left:'Ast'
    right:'Ast'
    negation:'Ast'=Int(False) # ??
    cmd:'Ast'=Int(False)

@dataclass(frozen=True)
class Def:
    definendum:'Ast'
    definition:'Ast'
    negation:Int=Int(False)
    cmd:Int=Int(False)

@dataclass(frozen=True)
class Law:
    cause:'Ast'
    effect:'Ast'
    negation:Int=Int(False)
    cmd:Int=Int(False)

@dataclass(frozen=True)
class SimpleSentence:
    verb:'Ast'
    subject:'Ast'=Int(False)
    object:'Ast'=Int(False)
    as_:'Ast'=Int(False)
    to:'Ast'=Int(False)
    on:'Ast'=Int(False)
    negation:Int=Int(False)
    cmd:Int=Int(False)

    @property
    def args(self)->Dict[str, 'Ast']:
        x1 = [(k,v) for k,v in vars(self).items() if v] # non-falsy
        x2 = [(k,v) for k,v in x1 if k not in {'negation', 'cmd'}]
        x3 = dict(x2)
        return x3

NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp
Ast = NounPhrasish | SimpleSentence | Def | Law
Composite = Implicit | BinExp | SimpleSentence | Def | Law


GAP=Str('__GAP__') 
'''linguistic gap denoting the empty noun-phrase'''

T = TypeVar('T', bound='Ast')
def copy(ast:T, **kwargs:Ast)->T:
    if isinstance(ast, Explicit): return ast
    return ast.__class__(**{**vars(ast), **kwargs})

def unroll(ast:BinExp)->Sequence[Ast]:
    x1= unroll(ast.left) if isinstance(ast.left, BinExp) else [ast.left]
    x2= unroll(ast.right) if isinstance(ast.right, BinExp) else [ast.right]
    return [*x1, *x2]