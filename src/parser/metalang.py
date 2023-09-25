from dataclasses import dataclass
from typing import Any, Callable, Dict, List, Type


@dataclass(frozen=True)
class Var:
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
Predicate = Callable[[List['MetaAst']], object]
V = Var
L = MultiVar
D = Derivation
MetaAst = Var | MultiVar | Lit | Type | Predicate


Pattern = List[MetaAst]
Map = Dict[str, object]