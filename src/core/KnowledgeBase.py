from dataclasses import dataclass
from typing import Dict, FrozenSet, Tuple
from core.language import AnalyticDerivation, Ast


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
class KnowledgeBase:
    wm:WorldModel= frozenset()
    adcs:FrozenSet[AnalyticDerivation]= frozenset()
    dd:DeicticDict= DeicticDict({})

    def __add__(self, o:WorldModel|DeicticDict|AnalyticDerivation):
        match o:
            case frozenset():
                return KnowledgeBase(self.wm | o, self.adcs, self.dd)
            case DeicticDict():
                return KnowledgeBase(self.wm, self.adcs, o)
            case AnalyticDerivation():
                from core.isMatch import sortByGenerality
                dcs = self.adcs | {o}
                sortedDcs = sortByGenerality(self, dcs)
                setDcs = frozenset(sortedDcs)
                return KnowledgeBase(self.wm, setDcs, self.dd)

    def __sub__(self, o:'WorldModel|AnalyticDerivation'):
        match o:
            case frozenset():
                return KnowledgeBase(self.wm - o, self.adcs, self.dd)
            case AnalyticDerivation():
                raise Exception()

@dataclass(frozen=True)
class Result:
    head:Ast
    kb:KnowledgeBase
    addition:WorldModel = frozenset()
    # eliminations:WorldModel
    # warning:str
    # prev:'Result|None' # like writer pattern
