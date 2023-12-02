from typing import Dict
from lang import *

def subst(
    ast:Ast,
    mapping:Dict[Ast, Ast],
):
    if ast in mapping: return mapping[ast]
    if isinstance(ast, Constant): return ast
    if not isinstance(ast, Ast): return ast
    d={k:subst(v, mapping) for k,v in vars(ast).items()}
    return ast.__class__(**d)
