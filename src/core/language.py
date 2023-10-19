from dataclasses import dataclass
from typing import List, Tuple


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
class Derivation:
    pass
    negation:bool=False
    cmd:bool=False

@dataclass(frozen=True)
class Def(Derivation):
    definendum:'Ast'=False
    definition:'Ast'=False
    negation:bool=False
    cmd:bool=False

@dataclass(frozen=True)
class Law(Derivation):
    cause:'Ast'=False
    effect:'Ast'=False
    negation:bool=False
    cmd:bool=False

@dataclass(frozen=True)
class Idiom:
    value:'Ast'
    negation:bool=False
    cmd:bool=False

@dataclass(frozen=True)
class SimpleSentence:
    verb:'Ast'=''
    subject:'Ast'=''
    object:'Ast'=''
    as_:'Ast'=False
    to:'Ast'=False
    on:'Ast'=False
    negation:bool=False
    cmd:bool=False


    def filterOut(self, out:List[str])->List[Tuple[str, 'Ast']]:
        from core.language import subasts
 
        x1 = [(k,v) for k,v in subasts(self).items()]
        x2 = [(k,v) for k,v in x1 if k not in out]
        x3 = [(k,v) for k,v in x2 if v]
        return x3

    # @property 
    # def complements(self): # TODO:only used in linearize
    #     return self.filterOut(['verb', 'subject', 'object', 'negation'])
 
    @property
    def args(self): return self.filterOut([])

Explicit = str | float | int | bool | tuple
NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp | Idiom
Ast = NounPhrasish | SimpleSentence | Derivation


def copy(ast:Ast, **kwargs:Ast): # TUPLE!
    if isinstance(ast, Explicit): return ast
    return ast.__class__(**{**vars(ast), **kwargs})

def subasts(ast:Ast):
    return {k:v for k,v in vars(ast).items() if k not in {'negation', 'cmd'}}
