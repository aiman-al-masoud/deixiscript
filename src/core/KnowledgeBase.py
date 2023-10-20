from dataclasses import dataclass
from typing import FrozenSet, Tuple
from core.language import Ast, Law, Def
from core.sortByGenerality import sortByGenerality


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
    ds:Tuple[Def|Law, ...]    =tuple()
    dd:DeicticDict            =DeicticDict()

    def __lshift__(self, o:Ast)->'KnowledgeBase':
        return KnowledgeBase(self.wm, self.ds, self.dd.update(o))

    def __add__(self, o:WorldModel|Def|Law):
        match o:
            case frozenset(): 
                return KnowledgeBase(self.wm | o, self.ds, self.dd)
            case Def()|Law():
                ds = sortByGenerality([*self.ds, o])
                return KnowledgeBase(self.wm, ds, self.dd)

    def __sub__(self, o:WorldModel|Def|Law):
        match o:
            case frozenset():
                return KnowledgeBase(self.wm - o, self.ds, self.dd)
            case Def()|Law():
                raise Exception()

    @property
    def defs(self): 
        return (x for x in self.ds if isinstance(x, Def))
    
    @property
    def laws(self): 
        return (x for x in self.ds if isinstance(x, Law))

    @property
    def head(self)->'Ast':
        return self.dd.latest
    