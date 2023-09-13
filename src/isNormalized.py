from language import Ast


def isNormalized(ast:Ast):
    # no implicit references, only explicit
    # everything is decompressed
    # verb sentences don't cotain negations or commands
    raise Exception('')