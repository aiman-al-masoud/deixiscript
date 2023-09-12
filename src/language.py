from dataclasses import dataclass
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
    _as:'Ast'
    to:'Ast'

@dataclass(frozen=True)
class Negation:
    value:'Ast'

@dataclass(frozen=True)
class AnalyticDerivationClause:
    consequence:'Ast'
    definition:'Ast'

@dataclass(frozen=True)
class SyntheticDerivationClause:
    consequence:'Ast'
    cause:'Ast'

@dataclass(frozen=True)
class Command:
    value:'Ast'

Explicit = str | float | int | bool  | tuple
Implicit = Noun | Which | Numerality
NounPhrase = Explicit | Implicit
NounPhrasish = NounPhrase | BinExp
DerivationClause = AnalyticDerivationClause |  SyntheticDerivationClause
Ast = NounPhrasish | Negation | DerivationClause | VerbSentence | Command


@dataclass(frozen=True)
class KnowledgeBase:
    wm:Set['WmSentence']
    dcs:Tuple[DerivationClause]
    dd:'DeicticDict'

    def updateDD(self, dd:'DeicticDict')->'KnowledgeBase':
        return KnowledgeBase(**{**self.__dict__, 'dd':dd})
    
    def addToWm(self, s:'WmSentence')->'KnowledgeBase':
        wm = {*self.wm, s}
        return KnowledgeBase(wm, self.dcs, self.dd)
    
    @classmethod
    @property
    def empty(cls):
        return cls(set(), tuple(), DeicticDict({}))

WmSentence = Tuple[Ast, Ast, Ast]

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

def copyAst(ast:Ast, key:str, val:Ast):
    return ast.__class__(**{**ast.__dict__, key:val})