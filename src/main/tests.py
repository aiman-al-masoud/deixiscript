from core.KB import KB
from parse.parse import Parser
# from plot.show import show

parser = Parser()

def test_m001():
    kb1=parser.parse('a new cat').eval(KB())
    kb2=parser.parse('a new house of cat').eval(kb1)
    kb3=parser.parse('a new house').eval(kb2)
    assert parser.parse('the house of cat').eval(kb3).it == 'house#1'

def test_m002():
    kb1=parser.parse('f of a number when the number').eval(KB())
    kb2=parser.parse('f of 1 when 33').eval(kb1)

    assert parser.parse('f of 1').eval(kb2).it == 33
    assert parser.parse('f of 10').eval(kb2).it == 10
    assert parser.parse('f of 5').eval(kb2).it == 5
