from parse.parse import Parser
from core.expbuilder import e, the, does

parser = Parser()

def test_p002():
    assert parser.parse('the not cat') == the('cat').not_.e

def test_p003():
    assert parser.parse('the 2 cat') == the(2)('cat').e

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
