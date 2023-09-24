from functools import reduce
from language import AnalyticDerivation, Ast, BinExp, Command, Negation, Noun, SimpleSentence, Which

def linearize(ast:Ast)->str:

    match ast:

        case str(x) | int(x) | float(x):
            return str(x)
        case tuple(xs):
            y0 = [linearize(x) for x in xs]
            y1 = reduce(lambda a, b: a+b+',', y0, '').strip(',')
            return '[ '+y1+' ]'
        case Noun(x):
            return 'the '+linearize(x)
        case SimpleSentence(v, subject=s, object=o):
            complements = [k + ' ' + linearize(v) for k,v in ast.complements]
            complementsStr = reduce(lambda a,b: a+' '+b, complements, '')
            verb = ' does '+linearize(v)
            return linearize(s) + verb + ' ' +linearize(o) + complementsStr
        case BinExp(op, l, r):
            return '( '+ linearize(l) +' ' + linearize(op) + ' '+linearize(r) +' )'
        case Negation(v):
            return 'it is false that (' + linearize(v) + ')'
        case AnalyticDerivation(a, b):
            return linearize(a) + ' when ' + linearize(b)
        case Which(h, w):
            return linearize(h) + ' which ' + linearize(w)
        case Command(v):
            return '(' + linearize(v) +')' + '!'
        case _:
            raise Exception(ast)
