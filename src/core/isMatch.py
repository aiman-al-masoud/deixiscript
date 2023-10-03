from functools import cmp_to_key, partial
from typing import Iterable, TypeVar
from core.expbuilder import e, it_is_false_that
from core.language import AnalyticDerivation, Ast, Command, NounPhrase, SimpleSentence, SyntheticDerivation
from core.KnowledgeBase import KnowledgeBase


T = TypeVar('T', bound=Ast)

def sortByGenerality(kb:KnowledgeBase, asts:Iterable[T]):
    cmp = partial(compareByGenerality, kb)
    x1 = sorted(asts, key=cmp_to_key(cmp))
    x2 = tuple(x1)
    return x2

def compareByGenerality(kb:KnowledgeBase, ast1:Ast, ast2:Ast)->int:

    match ast1, ast2:
        case AnalyticDerivation(d1, _), AnalyticDerivation(d2, _):
            return compareByGenerality(kb, d1, d2)
        case SyntheticDerivation(c1, _), SyntheticDerivation(c2, _):
            return compareByGenerality(kb, c1, c2)
        case _:
            m1, m2 = isMatch(ast1, ast2, kb), isMatch(ast2, ast1, kb)
            return m1 - m2

def isMatch(generic:Ast, specific:Ast, kb:KnowledgeBase=KnowledgeBase()):

    # if generic == specific: return True #
    #TODO: problem, if specific is id, get will work no matter what withoutGen contains! :-(, maybe need to distinguish concepts from individuals
    
    withSpec = e(recCommand(specific)).tell(kb)
    genWithSpec = e(generic).get(withSpec.kb)
    withoutGen = it_is_false_that(generic).tell(kb)
    specWithoutGen = e(specific).get(withoutGen.kb) 
    r = bool(genWithSpec) and not bool(specWithoutGen)
    return r

def recCommand(ast:Ast)->Ast:
    from core.normalized import isImplicitish
    from core.subst import subst
    from functools import partial

    match ast:
        case Command(v):
            return Command(recCommand(v))    
        case SimpleSentence(v, s, o, a, t, on):
            return SimpleSentence(v, recCommand(s), recCommand(o), recCommand(a), recCommand(t), recCommand(on))
        case _:
            wrap = partial(subst, lambda x: isinstance(x, NounPhrase) and isImplicitish(x), lambda x:Command(x))
            return wrap(ast)