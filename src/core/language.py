from dataclasses import dataclass
from typing import List, Tuple


@dataclass(frozen=True)
class Noun:
    head:'Ast'

@dataclass(frozen=True)
class Which:
    head:'Ast'
    which:'Ast'

@dataclass(frozen=True)
class Numerality:
    head:'Ast'
    card:'Ast'
    ord:'Ast'

@dataclass(frozen=True)
class BinExp:
    op:'Ast'
    left:'Ast'
    right:'Ast'

@dataclass(frozen=True)
class Negation:
    value:'Ast'

@dataclass(frozen=True)
class Derivation:
    pass

@dataclass(frozen=True)
class AnalyticDerivation(Derivation):
    definendum:'Ast'
    definition:'Ast'

@dataclass(frozen=True)
class SyntheticDerivation(Derivation):
    cause:'Ast'
    effect:'Ast'

@dataclass(frozen=True)
class Command:
    value:'Ast'

@dataclass(frozen=True)
class Domino:
    value:'Ast'
    
@dataclass(frozen=True) # what about idiom-containing idioms in case of evaluating a multi step derivation?
class Idiom(): # overrideme, non-literal
    value:'Ast'

@dataclass(frozen=True)
class SimpleSentence:
    verb:'Ast'
    subject:'Ast'
    object:'Ast'=False
    as_:'Ast'=False
    to:'Ast'=False
    on:'Ast'=False
    # TODO: use None instead

    def filterOut(self, out:List[str])->List[Tuple[str, 'Ast']]:
        x1 = [(k,v) for k,v in self.__dict__.items()]
        x2 = [(k,v) for k,v in x1 if k not in out]
        x3 = [(k,v) for k,v in x2 if v]
        return x3

    @property 
    def complements(self): # TODO:only used in linearize
        return self.filterOut(['verb', 'subject', 'object'])
 
    @property
    def args(self): return self.filterOut([])

Explicit = str | float | int | bool | tuple
Implicit = Noun | Which | Numerality
NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp | Command | Negation | Idiom | Domino
Ast = NounPhrasish | SimpleSentence | Derivation
