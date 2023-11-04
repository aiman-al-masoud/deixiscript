from dataclasses import dataclass
from typing import Generic, Tuple, TypeVar

# TODO: https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two
T=TypeVar('T')
@dataclass(frozen=True)
class DeicticDict(Generic[T]):
    tup:Tuple[T, ...]=tuple()

    def update(self, ast:T)->'DeicticDict':
        return DeicticDict((*(x for x in self.tup if x!=ast), ast))

    def __getitem__(self, key: T)->int:
        return next((v for v,k in enumerate(self.tup, start=1) if k==key), 0)

    def latest(self, default:T):
        return self.tup[-1] if self.tup else default
