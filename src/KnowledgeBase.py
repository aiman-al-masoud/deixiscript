from dataclasses import dataclass, field
from typing import Dict, Set, Tuple
from language import AnalyticDerivation, Ast

@dataclass(frozen=True)
class KnowledgeBase:
    wm:'WorldModel'
    adcs:Set[AnalyticDerivation]
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
        setDcs = set(sortedDcs)
        return KnowledgeBase(self.wm, setDcs, self.dd)
    
    def rmDef(self, dc:AnalyticDerivation)->'KnowledgeBase':
        raise Exception('rmDef()')

    @classmethod
    @property
    def empty(cls): 
        return cls(set(), set(), DeicticDict({}))

WmSentence = Tuple[Ast, Ast, Ast]
WorldModel = Set[WmSentence]

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
    addition:WorldModel = field(default_factory=lambda:set())
    # eliminations:WorldModel
    # warning:str
    # passages:List[Ast] # like writer monad pattern, log all expansion steps