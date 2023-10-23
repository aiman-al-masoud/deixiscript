from dataclasses import dataclass
from typing import Tuple
from core.Ast import Ast
from core.Int import Int


@dataclass(frozen=True)
class DeicticDict:
    tup:Tuple[Ast, ...]=tuple()

    def update(self, ast:Ast)->'DeicticDict':
        return DeicticDict((*(x for x in self.tup if x!=ast), ast))

    def __getitem__(self, key: Ast)->int:
        return next((v for v,k in enumerate(self.tup, start=1) if k==key), 0)

    @property
    def latest(self)->Ast:
        return self.tup[-1] if self.tup else Int(False)
