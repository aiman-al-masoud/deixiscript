from expbuilder import e
from language import Ast, KnowledgeBase, Result
from prepareAst import decompress, expandCommands, expandNegations, removeImplicit
from linearize import linearize

def evaluate(ast:Ast, kb:KnowledgeBase=KnowledgeBase.empty)->Result:
    """
    TOP LEVEL ONLY!
    NOT supposed to be called by any other function! 
    """
    # TODO: check for definitions in analytic derivaton clauses
    x1 = expandNegations(ast)
    x2 = expandCommands(x1)
    x3 = removeImplicit(x2, kb)
    x4 = decompress(x3.head) # should be free of implicit references 
    x5 = e(x4).ask(x3.kb)
    # TODO: check for consequences in synthetic derivation clauses
    return x5
