from dataclasses import dataclass, field
from typing import Dict, Set, Tuple

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
class VerbSentence:
    verb:'Ast'
    subject:'Ast'
    object:'Ast'
    negation:'Ast'
    command:'Ast'
    as_:'Ast'
    to:'Ast'

@dataclass(frozen=True)
class Negation:
    value:'Ast'

@dataclass(frozen=True)
class DerivationClause:
    consequence:'Ast'

@dataclass(frozen=True)
class AnalyticDerivationClause(DerivationClause):
    definition:'Ast'

@dataclass(frozen=True)
class SyntheticDerivationClause(DerivationClause):
    cause:'Ast'

@dataclass(frozen=True)
class Command:
    value:'Ast'

Explicit = str | float | int | bool  | tuple
Implicit = Noun | Which | Numerality
NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp
Ast = NounPhrasish | VerbSentence | Negation | DerivationClause | Command

@dataclass(frozen=True)
class KnowledgeBase:
    wm:'WorldModel'
    dcs:Set[DerivationClause]
    dd:'DeicticDict'

    def updateDD(self, dd:'DeicticDict')->'KnowledgeBase':
        return KnowledgeBase(**{**self.__dict__, 'dd':dd})
    
    def addWm(self, wm:'WorldModel')->'KnowledgeBase':
        return KnowledgeBase(self.wm | wm, self.dcs, self.dd)
    
    def subWm(self, wm:'WorldModel')->'KnowledgeBase':
        return KnowledgeBase(self.wm - wm, self.dcs, self.dd)

    @classmethod
    @property
    def empty(cls): 
        return cls(set(), set(), DeicticDict({}))

WmSentence = Tuple[Ast, Ast, Ast]
WorldModel = Set[WmSentence]

@dataclass(frozen=True)
class DeicticDict:
    d:Dict[Ast, int]

    def copy(self, ast:Ast)->'DeicticDict':
        latest = max([*self.d.values(), 0]) + 1
        return DeicticDict({ **self.d, ast:latest})

    def __getitem__(self, key: Ast) -> int:
        return self.d.get(key, 0)

@dataclass(frozen=True)
class Result:
    head:Ast
    kb:KnowledgeBase
    addition:WorldModel = field(default_factory=lambda:set())

def copyAst(ast:Ast, key:str, val:Ast):
    return ast.__class__(**{**ast.__dict__, key:val})
