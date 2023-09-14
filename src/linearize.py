from functools import reduce
from language import Ast, BinExp, Negation, Noun, SimpleSentence

def linearize(ast:Ast)->str:

    match ast:

        case str(x) | int(x) | float(x):
            return str(x)
        case tuple(xs):
            content = reduce(lambda a, b: a+','+b, [linearize(x) for x in xs], '')
            return '( '+content+' )'
        case Noun(x):
            return 'the '+linearize(x)
        case SimpleSentence(v, s, o, n, c, a, t):
            return linearize(s)+' does '+(' not ' if n else '')  +linearize(v)+' '+linearize(o)
        case BinExp(op, l, r):
            return '( '+ linearize(l) +' ' + linearize(op) + ' '+linearize(r) +' )'
        case Negation(v):
            return 'it is false that '+linearize(v)
        case _:
            raise Exception()
