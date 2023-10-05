from dataclasses import dataclass
from typing import FrozenSet, Tuple
from core.language import Derivation, Ast, SyntheticDerivation, AnalyticDerivation


WmSentence = Tuple[Ast, Ast, Ast]
WorldModel = FrozenSet[WmSentence]

@dataclass(frozen=True)
class DeicticDict:
    tup:Tuple[Ast, ...]=tuple()

    def update(self, ast:Ast)->'DeicticDict':
        return DeicticDict((*(x for x in self.tup if x!=ast), ast))

    def __getitem__(self, key: Ast)->int:
        return next((v for v,k in enumerate(self.tup, start=1) if k==key), 0)

    @property
    def latest(self)->Ast:
        return self.tup[-1] if self.tup else False

@dataclass(frozen=True)
class KnowledgeBase:
    wm:WorldModel             =frozenset()
    ds:Tuple[Derivation, ...] =tuple()
    dd:DeicticDict            =DeicticDict()

    def __lshift__(self, o:Ast)->'KnowledgeBase':
        return KnowledgeBase(self.wm, self.ds, self.dd.update(o))

    def __add__(self, o:WorldModel|Derivation):
        match o:
            case frozenset(): 
                return KnowledgeBase(self.wm | o, self.ds, self.dd)
            case Derivation():
                from core.isMatch import sortByGenerality
                ds = sortByGenerality(self, [*self.ds, o])
                return KnowledgeBase(self.wm, ds, self.dd)

    def __sub__(self, o:WorldModel|Derivation):
        match o:
            case frozenset():
                return KnowledgeBase(self.wm - o, self.ds, self.dd)
            case Derivation():
                raise Exception()
                
    @property
    def ads(self): 
        return (x for x in self.ds if isinstance(x, AnalyticDerivation))
    
    @property
    def sds(self): 
        return (x for x in self.ds if isinstance(x, SyntheticDerivation))

    @property
    def head(self)->'Ast':
        return self.dd.latest
    
@dataclass(frozen=True)
class Result:
    head:Ast
    kb:KnowledgeBase
    # warning:str
    # prev:'Result|None' # like writer pattern
