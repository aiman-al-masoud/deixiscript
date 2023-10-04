from dataclasses import dataclass
from typing import FrozenSet, Tuple
from core.language import Derivation, Ast, SyntheticDerivation, AnalyticDerivation


WmSentence = Tuple[Ast, Ast, Ast]
WorldModel = FrozenSet[WmSentence]

@dataclass(frozen=True)
class DeicticDict:
    fs:FrozenSet[Tuple[Ast, int]]=frozenset()

    def update(self, ast:Ast)->'DeicticDict':
        vals = [v for _,v in self.fs]
        latest = max([*vals, 0]) + 1

        x1={(k,v) for k,v in self.fs if k!=ast}
        x2={*x1,(ast,latest)}
        return DeicticDict(frozenset(x2))

    def __getitem__(self, key: Ast)->int:
        return next((v for k,v in self.fs if k==key),0)


@dataclass(frozen=True)
class KnowledgeBase:
    wm:WorldModel             =frozenset()
    ds:Tuple[Derivation, ...] =tuple()
    dd:DeicticDict            =DeicticDict()

    def __add__(self, o:WorldModel|DeicticDict|Derivation):
        match o:
            case frozenset(): 
                return KnowledgeBase(self.wm | o, self.ds, self.dd)
            case DeicticDict(): 
                return KnowledgeBase(self.wm, self.ds, o)
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


@dataclass(frozen=True)
class Result:
    head:Ast
    kb:KnowledgeBase
    # warning:str
    # prev:'Result|None' # like writer pattern
