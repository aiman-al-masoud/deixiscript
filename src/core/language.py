from dataclasses import dataclass
from typing import Dict, List, Tuple

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
class AnalyticDerivation:
    definendum:'Ast'
    definition:'Ast'

@dataclass(frozen=True)
class SyntheticDerivation:
    effect:'Ast'
    cause:'Ast'

@dataclass(frozen=True)
class Command:
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
        return self.filterOut(['verb', 'subject', 'object', 'negation', 'command'])
 
    @property
    def args(self):
        return self.filterOut(['negation', 'command'])
    

Explicit = str | float | int | bool | tuple
Implicit = Noun | Which | Numerality
NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp | Command | Negation | Idiom
Derivation = AnalyticDerivation | SyntheticDerivation
Ast = NounPhrasish | SimpleSentence | Derivation

def copyAst(ast:Ast, key:str, val:Ast):
    return ast.__class__(**{**ast.__dict__, key:val})

