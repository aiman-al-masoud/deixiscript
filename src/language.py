from dataclasses import dataclass
from typing import Dict

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
class SimpleSentence:
    verb:'Ast'
    subject:'Ast'
    object:'Ast'
    negation:'Ast'
    command:'Ast'
    as_:'Ast'
    to:'Ast'
    on:'Ast'

    @property
    def complements(self)->Dict[str, 'Ast']:
        out = ['verb', 'subject', 'object', 'negation', 'command']
        d = {k:v for k,v in self.__dict__.items() if k not in out}
        return d

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

Explicit = str | float | int | bool  | tuple
Implicit = Noun | Which | Numerality
NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp | Command | Negation
Derivation = AnalyticDerivation | SyntheticDerivation
Ast = NounPhrasish | SimpleSentence | Derivation

def copyAst(ast:Ast, key:str, val:Ast):
    return ast.__class__(**{**ast.__dict__, key:val})
