from language import Ast, BinExp, Negation, Noun, VerbSentence
from functools import reduce

def linearize(ast:Ast)->str:

    match ast:

        case str(x) | int(x) | float(x):
            return str(x)
        case tuple(xs):
            content = reduce(lambda a, b: a+','+b, [linearize(x) for x in xs], '')
            return '( '+content+' )'
        case Noun(x):
            return 'the '+linearize(x)
        case VerbSentence(v, s, o, n, c, a, t):
            return linearize(s)+' does '+(' not ' if n else '')  +linearize(v)+' '+linearize(o)
        case BinExp(op, l, r):
            return '( '+ linearize(l) +' ' + linearize(op) + ' '+linearize(r) +' )'
        case Negation(v):
            return 'it is false that '+linearize(v)
        case _:
            raise Exception()


# from expbuilder import __, the

# print(linearize(the('capra').does('eat')._(the('grass')).e))
# print(linearize(the('capra').does('be')._('stupid').e))
