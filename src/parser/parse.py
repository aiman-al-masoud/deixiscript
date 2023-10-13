from functools import reduce
from typing import List, Set
from core.expbuilder import e
from core.language import BinExp, Command, Negation, SimpleSentence, Which

preps  = {'to', 'on', 'as'}
binops = {'and', 'or'}
verb_markers = {'does', 'do'}
relativizers = {'which'}
whens = {'when'}
afters = {'after'}
negations = {'not'}

def parse(toks:List[str|int|float]):

    match toks:

        case ['(', *xs, ')']:
            return parse(xs)
        case [*xs, '!']:
            return Command(parse(xs))
        case [*xs, '?']:
            return parse(xs)
        case _ if ps:=splitBy(toks, whens):
            return e(parse(ps[0])).when(parse(ps[2])).e
        case _ if ps:=splitBy(toks, afters):
            return e(parse(ps[0])).after(parse(ps[2])).e
        case _ if ps:=splitBy(toks, relativizers):
            return Which(parse(ps[0]), parse(ps[2]))
        case _ if ps:=splitBy(toks, verb_markers):
            subject     = parse(ps[0])
            negation    = toks[ps[1][1]+1] in negations
            verb        = toks[ps[1][1]+2] if negation else toks[ps[1][1]+1]
            rest        = toks[toks.index(verb)+1:]
            endObject   = next((i for i, x in enumerate(rest) if x in preps), len(toks))
            object      = parse(rest[:endObject]) if rest else ''            
            complements = parComplements(rest[endObject:])
            sentence    = SimpleSentence(**{'verb':verb, 'subject':subject, 'object':object, **complements})
            result      = Negation(sentence) if negation else sentence 
            return result
        case _ if ps:=splitBy(toks, binops):
            return BinExp(ps[1][0], parse(ps[0]), parse(ps[2]))
        case [x]:
            return x
        case []:
            return ''
        case _:
            raise Exception(toks)

def splitBy(toks:List[str|int|float], seps:Set[str]):
    i = next((i for i,x in enumerate(toks) if x in seps), None)
    if i is None: return None
    left  = toks[:i]
    right = toks[i+1:]
    if not isMatching(left) or not isMatching(right): return None
    return left, (toks[i], i), right

def parComplements(toks:List[str|int|float]):
    x1 = [i for i,x in enumerate(toks) if x in preps]
    x2 = [toks[i: x1[i+1] if len(x1)>i+1 else None] for i in x1]
    x3 = [parComplement(x) for x in x2]
    x4 = reduce(lambda a,b: {**a, **b}, x3, {})
    return x4

def parComplement(toks:List[str|int|float]):
    if toks[0] not in preps: return {}
    thing = parse(toks[1:]) if toks else {toks[0]: ''}
    return {toks[0]: thing}

def isMatching(toks:List[str|int|float]):
    return toks.count('(') == toks.count(')')