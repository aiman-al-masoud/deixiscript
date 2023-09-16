from functools import reduce
from language import AnalyticDerivation, Ast, BinExp, Negation, Noun, SimpleSentence, Which

def linearize(ast:Ast)->str:

    match ast:

        case str(x) | int(x) | float(x):
            return str(x)
        case tuple(xs):
            content = reduce(lambda a, b: a+','+b, [linearize(x) for x in xs], '')
            return '( '+content+' )'
        case Noun(x):
            return 'the '+linearize(x)
        case SimpleSentence(v, s, o, n, c):
            
            complements = [k + ' ' + linearize(v) for k,v in ast.complements.items() if v]
            complementsStr = reduce(lambda a,b:a+' '+b, complements, '')
            verb = ' does '+(' not ' if n else '')  +linearize(v) 
            return linearize(s) + verb + ' ' +linearize(o) + complementsStr

        case BinExp(op, l, r):
            return '( '+ linearize(l) +' ' + linearize(op) + ' '+linearize(r) +' )'
        case Negation(v):
            return 'it is false that '+linearize(v)
        case AnalyticDerivation(a, b):
            return linearize(a) + ' when ' + linearize(b)
        case Which(h, w):
            return linearize(h) + ' which ' + linearize(w)
        case _:
            raise Exception(ast)
