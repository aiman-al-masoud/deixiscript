from dataclasses import dataclass
from typing import Callable, Dict, List, Type
import sys

@dataclass(frozen=True)
class Variable:
    name:str
    type:'MetaAst'=object
    default:'MetaAst|None'=None
    maxCard:int=sys.maxsize

@dataclass(frozen=True)
class Derivation:
    pat:'Pattern'
    definition:object

Lit = str | int | float
MetaAst = Lit | Variable | Type | Callable
Pattern = List[MetaAst]
Map = Dict[str, object] # or Lit as key?
L = Variable
D = Derivation

def V(name:str, type:'MetaAst'=object, default:'MetaAst|None'=None): # rename to S()
    return Variable(name, type, default, 1)