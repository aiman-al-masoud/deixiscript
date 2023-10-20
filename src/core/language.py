from dataclasses import dataclass
from typing import Sequence, Tuple


@dataclass(frozen=True)
class Implicit:
    head:'Ast'
    card:'Ast' =1
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
    verb:'Ast'=''
    subject:'Ast'=''
    object:'Ast'=False
    as_:'Ast'=False
    to:'Ast'=False
    on:'Ast'=False
    negation:bool=False
    cmd:bool=False

    @property
    def args(self)->Sequence[Tuple[str, 'Ast']]:
        x1 = [(k,v) for k,v in subasts(self).items()]
        x2 = [(k,v) for k,v in x1 if v]
        return x2

Explicit = str | float | int | bool | tuple
NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp
Ast = NounPhrasish | SimpleSentence | Def | Law


def copy(ast:Ast, **kwargs:Ast): # TUPLE!
    if isinstance(ast, Explicit): return ast
    return ast.__class__(**{**vars(ast), **kwargs})

def subasts(ast:Ast):
    return {k:v for k,v in vars(ast).items() if k not in {'negation', 'cmd'}}
