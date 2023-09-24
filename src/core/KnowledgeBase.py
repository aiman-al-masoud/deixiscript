from dataclasses import dataclass
from typing import Dict, FrozenSet, Tuple
from language import AnalyticDerivation, Ast

@dataclass(frozen=True)
class KnowledgeBase:
    wm:'WorldModel'
    adcs:FrozenSet[AnalyticDerivation]
    dd:'DeicticDict'

    def updateDD(self, dd:'DeicticDict')->'KnowledgeBase':
        return KnowledgeBase(self.wm, self.adcs, dd)
    
    def addWm(self, wm:'WorldModel')->'KnowledgeBase':
        return KnowledgeBase(self.wm | wm, self.adcs, self.dd)
    
    def subWm(self, wm:'WorldModel')->'KnowledgeBase':
        return KnowledgeBase(self.wm - wm, self.adcs, self.dd)
    
    def addDef(self, dc:AnalyticDerivation)->'KnowledgeBase':
        from matchAst import sortByGenerality
        dcs = self.adcs | {dc}
        sortedDcs = sortByGenerality(self, dcs)
        setDcs = frozenset(sortedDcs)
        return KnowledgeBase(self.wm, setDcs, self.dd)
    
    def rmDef(self, dc:AnalyticDerivation)->'KnowledgeBase':
        raise Exception('rmDef()')

    @classmethod
    @property
    def empty(cls): 
        return cls(frozenset(), frozenset(), DeicticDict({}))

WmSentence = Tuple[Ast, Ast, Ast]
WorldModel = FrozenSet[WmSentence]

@dataclass(frozen=True)
class DeicticDict:
    d:Dict[Ast, int]

    def update(self, ast:Ast)->'DeicticDict':
        latest = max([*self.d.values(), 0]) + 1
        return DeicticDict({ **self.d, ast:latest})

    def __getitem__(self, key: Ast)->int:
        return self.d.get(key, 0)

@dataclass(frozen=True)
class Result:
    head:Ast
    kb:KnowledgeBase
    addition:WorldModel = frozenset()
    # eliminations:WorldModel
    # warning:str
    # prev:'Result|None' # like writer pattern
