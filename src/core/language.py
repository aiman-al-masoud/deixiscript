from dataclasses import dataclass
from typing import Dict


@dataclass(frozen=True)
class Implicit:
    head:'Ast'
    card:int =1
    ord:'Ast'  ='last'
    which:'Ast'=True
    negation:bool=False
    cmd:bool=False

@dataclass(frozen=True)
class BinExp:
    op:'Ast'
    left:'Ast'
    right:'Ast'

    negation:bool=False
    cmd:bool=False

@dataclass(frozen=True)
class Def:
    definendum:'Ast'
    definition:'Ast'
    negation:bool=False
    cmd:bool=False

@dataclass(frozen=True)
class Law:
    cause:'Ast'
    effect:'Ast'
    negation:bool=False
    cmd:bool=False

@dataclass(frozen=True)
class SimpleSentence:
    verb:'Ast'
    subject:'Ast'=False
    object:'Ast'=False
    as_:'Ast'=False
    to:'Ast'=False
    on:'Ast'=False
    negation:bool=False
    cmd:bool=False

    @property
    def args(self)->Dict[str, 'Ast']:
        x1 = [(k,v) for k,v in vars(self).items() if v] # non-falsy
        x2 = [(k,v) for k,v in x1 if k not in {'negation', 'cmd'}]
        x3 = dict(x2)
        return x3

Explicit = str | float | int | bool
NounPhrase = Explicit | Implicit | tuple
NounPhrasish = NounPhrase | BinExp
Ast = NounPhrasish | SimpleSentence | Def | Law

GAP='__GAP__' 
'''linguistic gap denoting the empty noun-phrase'''

# T = TypeVar('T', bound='Ast')
def copy(ast:'Ast', **kwargs:Ast)->'Ast': # TUPLE!
    if isinstance(ast, Explicit): return ast
    return ast.__class__(**{**vars(ast), **kwargs})
# x = copy(Implicit('sd'))