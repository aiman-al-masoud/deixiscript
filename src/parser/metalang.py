from dataclasses import dataclass
from typing import Callable, Dict, List, Type
import sys

@dataclass(frozen=True)
class Variable:
    name:str
    type:'MetaAst'=object
    default:'MetaAst|None'=None
    maxCard:int=sys.maxsize

def V(name:str, type:'MetaAst'=object, default:'MetaAst|None'=None):
    return Variable(name, type, default, 1)

@dataclass(frozen=True)
class Derivation:
    pat:'Pattern'
    definition:object

Lit = str | int | float
L = Variable
D = Derivation
Predicate = Callable[[object], object]
MetaAst = Variable | Lit | Type | Predicate
Pattern = List[MetaAst]
Map = Dict[str, object]
