from lang import *
from parser import Parser
from match import match

parser=Parser()

def test_parse_attributive():
    st=parser.parse('the dead player')

def test_parse_negated_attributive():
    st=parser.parse('the non-dead player')

def test_parse_noun():
    st=parser.parse('the player')

def test_parse_event_with_pronoun():
    st=parser.parse('it moves down')

def test_parse_event_with_object():
    st=parser.parse('the player moves down')

def test_parse_genitive():
    st=parser.parse("player's health")

def test_parse_fact():
    st=parser.parse('the player is dead')

def test_parse_fact_with_object():
    st=parser.parse('the player is near enemy')

def test_parse_compare_with_math_formula():
    st=parser.parse("the player's health = 1 + 2 * 3")
    assert st[0] == EqExp(Genitive(ImplicitPhrase('player'), Str('health')), AddExp(Num(1), MulExp(Num(2), Num(3))))

def test_parse_events_with_comma():
    st=parser.parse("player moves, enemy moves")

def test_parse_order_with_ensure():
    st=parser.parse("enemy should ensure player is dead")

def test_parse_potential_with_implicit_precondition():
    st=parser.parse('the player can move')

def test_parse_potential_with_precondition():
    st=parser.parse('the player can move if the player is up')

def test_parse_potential_with_duration():
    st=parser.parse('the player can move (0.3 seconds)')[0]
    assert isinstance(st, Potential) and st.durationSeconds==0.3

def test_parse_potential_with_duration_and_precondition():
    st=parser.parse('the player can move (0.3 seconds) if 1=1')

def test_parse_repeat_event():
    st=parser.parse('the enemy moves 2 times')

def test_parse_idea_def_fact():
    st=parser.parse('the player is dead means: health <= 0')[0]
    assert st == Def(SimpleSentence(ImplicitPhrase('player'), Str('dead')),  LteExp(Str('health'), Num(0)))

def test_parse_idea_def_event():
    st=parser.parse('an enemy moves right means: x-coord increments, health decrements')[0]

def test_parse_negated_attributive_attributive():
    st=parser.parse('non-red enemy')[0]
    assert isinstance(st, ImplicitPhrase) and st.adjectives[0].negation

def test_parse_multi_adjective():
    st=parser.parse('non-dead red enemy')[0]
    assert isinstance(st, ImplicitPhrase) and len(st.adjectives)==2

def test_parse_question():
    st=parser.parse('the red enemy is near the player?')

# ----------------------------------------------------------------------------------------------------------------

def test_match_constant():
    st=parser.parse('player')[0]
    assert match(st, st)

def test_match_attributive_attributive():
    st=parser.parse('the red enemy')[0]
    assert match(st, st)

def test_match_attributive_attributive_negated():
    yes=parser.parse('the red enemy')[0]
    no=parser.parse('the non-red enemy')[0]    
    assert not match(yes, no) and not match(no, yes)

def test_match_attributive_negated_attributive_negated():
    st=parser.parse('the non-red enemy')[0]
    assert match(st, st)

def test_match_noun_attributive():
    super=parser.parse('an enemy')[0]
    sub=parser.parse('a red enemy')[0]
    assert match(super, sub) and not match(sub, super)

def test_match_noun_genitive():
    super=parser.parse("the color")[0]
    sub=parser.parse("the enemy's color")[0]
    assert match(super, sub) and not match(sub, super)

def test_match_sentence_sentence():
    super=parser.parse('the enemy moves')[0]
    sub=parser.parse('the red enemy moves')[0]
    assert match(super, sub) and not match(sub, super)

def test_match_sentence_sentence_with_object():
    super=parser.parse('the enemy hits the player')[0]
    sub=parser.parse('the enemy hits the dead player')[0]
    assert match(super, sub) and not match(sub, super)

def test_match_or_sentence():
    big=parser.parse('enemy is red or enemy is green')[0]
    small=parser.parse('enemy is green')[0]
    assert match(big, small) and match(small, big)

def test_match_and_sentence():
    big=parser.parse('enemy is red and enemy is green')[0]
    small=parser.parse('enemy is red')[0]
    assert match(small, big) and not match(big, small) 

def test_match_sentence_with_pronoun():
    nopro=parser.parse('the enemy hits the player')[0]
    pro=parser.parse('it hits the player')[0]
    assert match(nopro, pro)

def test_match_variable_with_noun_phrase():
    super=parser.parse("x's y")[0]
    sub=parser.parse("player's health")[0]    
    assert match(super, sub) and not match(sub, super)

#---------------------------------------------------------------------------

def test_eval_sort_defs_by_descending_specificity():

    tmp=parser.parse("""
    a red player is dead means: life=0.0.
    a player is dead means: life=0.0.
    a green red player is dead means: life=0.0.
    a green red ok player is dead means: life=0.0.
    """).eval(KB())

    assert not isinstance(tmp, Zorror)
    definitionLengths=[len(str(x)) for x in tmp[0].defs]
    assert definitionLengths==sorted(definitionLengths, reverse=True)

def test_eval_orphaned_property_names_in_definitions():
    x=parser.parse("a player is dead means: the player's life=0.0.").eval(KB())
    y=parser.parse('a player is dead means: the life=0.0.').eval(KB())
    assert x==y

def test_eval_and_operator_1():
    result=parser.parse('true and true')[0].eval(KB())
    assert not isinstance(result, Zorror)
    assert result[1]

def test_eval_and_operator_2():
    result=parser.parse('true and false')[0].eval(KB())
    assert not isinstance(result, Zorror)
    assert not result[1]

def test_eval_and_operator_3():
    result=parser.parse('true and true and true')[0].eval(KB())
    assert not isinstance(result, Zorror)
    assert result[1]

def test_eval_or_operator_1():
    result=parser.parse('true or false')[0].eval(KB())
    assert not isinstance(result, Zorror)
    assert result[1]

def test_eval_or_operator_2():
    result=parser.parse('false or false')[0].eval(KB())
    assert not isinstance(result, Zorror)
    assert not result[1]

def test_eval_comparison_operators():
    result=parser.parse("""
        (1 < 2) and (2 > 1) and (1 >= 1) and (2 != 1) and (2<=2)    
    """)[0].eval(KB())
    assert not isinstance(result, Zorror)

def test_eval_math():
    result=parser.parse('((3 + 1) / 4) * 5')[0].eval(KB())
    assert not isinstance(result, Zorror)
    assert result[1]==5

def test_eval_math_wrong():
    assert isinstance(parser.parse('1 + true')[0].eval(KB()), Zorror)

def test_eval_assign_property():
    result=parser.parse("""
        there is a player.
        the player's health = 10.
    """).eval(KB())
    assert not isinstance(result, Zorror)
    assert result[0].wm[0]['health']==10

def test_eval_idea():
    result=parser.parse("""
        a player is dead means: the health = 0.0.
        there is a player.
        the player is dead.
    """).eval(KB())
    assert not isinstance(result, Zorror)
    assert result[0].wm[0] == {'type':'player', 'health':0}

def test_eval_error_creating_identical_individuals():
    result=parser.parse("""
        there is a player.
        there is a player.
    """).eval(KB())
    assert isinstance(result, Zorror)

def test_eval_creating_similar_but_distinct_individuals():
    result=parser.parse("""
        a player is dead means: the health = 0.0.
        there is a player.
        there is a dead player.
    """).eval(KB())
    assert not isinstance(result, Zorror)
    assert result[0].wm[0]=={'type':'player'}
    assert result[0].wm[1]=={'type':'player', 'health':0}

def test_eval_pronoun_in_genitive_phrase():
    result=parser.parse("""
        there is a player.
        the player's health = 2.0.
        there is an enemy.
        the enemy's state = 3.0.
        (it's health = 2), 
        (it's state = 3)?
    """).eval(KB())
    assert not isinstance(result, Zorror)
    assert result[1]

def test_eval_pronoun_in_idea_sentences():
    result=parser.parse("""
        a player moves right means: the x-coord = the x-coord + 1.0.
        a door opens means: the state = 3.0.

        there is a player.
        the player's x-coord = 1.0.
        there is a door.
        he moves right and it opens.

    """).eval(KB())
    assert not isinstance(result, Zorror)
    assert result[0].wm[0] == {'type':'player', 'x-coord':2}
    assert result[0].wm[1] == {'type':'door', 'state': 3}

def test_eval_fish():
    maybe=parser.parse(open('./examples/fish.txt').read()).eval(KB())
    assert not isinstance(maybe, Zorror)
    assert maybe[1]

# ----------------------------------------------------------------------

def test_plan_enemy_should_ensure_player_is_dead():
    maybe=parser.parse(open('./examples/player-enemy.txt').read()).eval(KB())
    assert not isinstance(maybe, Zorror)
    kb=maybe[0]
    from plan import  groupRepeated, plan
    order:Order=parser.parse('the enemy should ensure the player is dead')[0] # pyright:ignore
    maybePlan=plan(order, kb)
    assert not isinstance(maybePlan, Zorror)
    steps=maybePlan[0]
    groupedSteps=groupRepeated(steps)
    assert groupedSteps==[parser.parse('an enemy moves right 2 times')[0], parser.parse('an enemy hits the player 4 times')[0]]