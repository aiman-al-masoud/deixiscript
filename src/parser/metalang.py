from dataclasses import dataclass
from typing import Callable, Dict, List, Type


@dataclass(frozen=True)
class SingleVar:
    name:str
    type:'MetaAst'=object

@dataclass(frozen=True)
class MultiVar:
    name:str
    type:'MetaAst'=object
    default:'MetaAst|None'=None

@dataclass(frozen=True)
class Derivation:
    pat:'Pattern'
    definition:object

Lit = str | int | float
V = SingleVar
L = MultiVar
D = Derivation
Variable = SingleVar | MultiVar
Predicate = Callable[[List['MetaAst']], object]
MetaAst = Variable | Lit | Type | Predicate
Pattern = List[MetaAst]
Map = Dict[str, object]