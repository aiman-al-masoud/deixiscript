from dataclasses import dataclass
from typing import Dict, FrozenSet, Tuple
from core.language import AnalyticDerivation, Ast, SyntheticDerivation


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
    wm:WorldModel = frozenset()
    ads:Tuple[AnalyticDerivation,...] = tuple() # maybe common adcs/sdcs sequence
    sds:Tuple[SyntheticDerivation,...] = tuple()
    dd:DeicticDict = DeicticDict({})

    def __add__(self, o:WorldModel|DeicticDict|AnalyticDerivation|SyntheticDerivation):
        match o:
            case frozenset():
                return KnowledgeBase(self.wm | o, self.ads, self.sds, self.dd)
            case DeicticDict():
                return KnowledgeBase(self.wm, self.ads, self.sds, o)
            case AnalyticDerivation():
                from core.isMatch import sortByGenerality
                dcs = (*self.ads, o)
                sortedDcs = tuple(sortByGenerality(self, dcs))
                return KnowledgeBase(self.wm, sortedDcs, self.sds, self.dd)
            case SyntheticDerivation():
                from core.isMatch import sortByGenerality
                dcs = (*self.sds, o)
                sortedDcs = tuple(sortByGenerality(self, dcs))
                return KnowledgeBase(self.wm, self.ads, sortedDcs, self.dd)

    def __sub__(self, o:'WorldModel|AnalyticDerivation'):
        match o:
            case frozenset():
                return KnowledgeBase(self.wm - o, self.ads, self.sds, self.dd)
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
