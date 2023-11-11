from parse.Parser import Parser
from core.EB import the, does, e
from core.Str import Str

parser = Parser()

def test_p002():
    assert parser.parse('the not cat') == the('cat').not_.e

def test_p003():
    assert parser.parse('the 2 cat') == the(2, 'cat').e

def test_p004():
    assert parser.parse('the new cat') == the('cat').new.e

def test_p005():
    assert parser.parse('cat and dog') == the('cat').and_(the('dog')).e

def test_p001():
    assert parser.parse('the cat does eat the mouse') \
        == the('cat').does('eat')._(the('mouse')).new.e
    
def test_p006():
    assert parser.parse('a cat which does eat') \
        == the('cat').which(does('eat')).e

#TODO: need start AST!!!!!!!!!
# def test_p007():
#     assert parser.parse('"capra scema"') == e("capra scema").e

def test_p008():
    assert parser.parse('stdout does be "capra scema"') \
        == the('stdout').does('be')._("capra scema").new.e

def test_p009():
    assert parser.parse('the redful cat') \
        == the('cat').which(does('be')._(the('red'))).e

def test_p010():
    assert parser.parse('1+2*3') == e(1).binop('+', 2).binop('*', 3).e

def test_p011():
    assert parser.parse('house of cat') \
        ==  the('house').which(the('cat').does('have')._(Str.GAP).as_('attribute')).e
