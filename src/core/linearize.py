from functools import reduce
from core.language import AnalyticDerivation, Ast, BinExp, Command, Negation, Noun, SimpleSentence, SyntheticDerivation, Which

def linearize(ast:Ast)->str:

    match ast:

        case str(x) | int(x) | float(x):
            return str(x)
        case tuple(xs):
            y0 = [linearize(x) for x in xs]
            y1 = reduce(lambda a, b: a+b+',', y0, '').strip(',')
            return '[ '+y1+' ]'
        case Noun(x):
            return linearize(x)
        case SimpleSentence(verb=v, subject=s, object=o):
            complements = [k + ' ' + linearize(v) for k,v in ast.complements]
            complementsStr = reduce(lambda a,b: a+' '+b, complements, '')
            verb = ' does '+linearize(v)
            return linearize(s) + verb + ' ' + (linearize(o) if o else '') + complementsStr
        case BinExp(op, l, r):
            return '( '+ linearize(l) +' ' + linearize(op) + ' '+linearize(r) +' )'
        case Negation(v):
            return 'it is false that (' + linearize(v) + ')'
        case AnalyticDerivation(a, b):
            return linearize(a) + ' when ' + linearize(b)
        case Which(h, w):
            return linearize(h) + ' which ' + linearize(w)
        case Command(v):
            return '!' + linearize(v) + '!'
        case SyntheticDerivation(c, e):
            return linearize(e) + ' after ' + linearize(c)
        case _:
            raise Exception('linearize', ast)
