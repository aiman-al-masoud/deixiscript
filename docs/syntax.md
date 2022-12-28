```
<sentence> ::= <declaration>
              |<question>
```

```
<declaration> ::= <simple>
                 |<compound>
```

```
<simple> ::= <copula_sentence>
            |<verb_sentence>           
```

```
<compound> ::= <complex>
             |<conjunctive>
```

```
<complex> ::=  <subord_conj> <simple> ['then'] <simple>
                    |<simple> <subord_conj> <simple>
```

```
<conjunctive> ::= <simple> <conj_conj> <simple>
                 |<simple> <conj_conj> <iverb> <complement>*
                 |<simple> <conj_conj> <mverb> <object> <complement>*
                 |<conjunctive> <conj_conj> <conjunctive>
```

```
<copula_sentence> ::= <subject> <copula> [<negation>] <subject>
```

```
<verb_sentence> ::= <intransitive_sentence> 
                   |<monotransitive_sentence>
```

```
<intransitive_sentence> ::= <subject> [<negation>] <iverb> <complement>*
```

```
<monotransitive_sentence> ::= <subject> [<negation>] <mverb> <complement>* <object> <complement>*
```

```
<question> ::= <binary_question>
              |<wh_question>
```

```
<binary_question> ::= <copula_question>
                     |<hverb> <verb_sentence>
```

```
<copula_question> :: = <copula> <subject> <subject> 
```

```
<subject> ::= <noun_phrase>
```

```
<noun_phrase> ::= [<quantifier>] [<article>] <adjective>* <noun> [<subordinate_clause>] <complement>*
```

```
<complement> ::= <preposition> <noun_phrase>
```

```
<subordinate_clause> ::= <copula_subordinate_clause>
                        |<iverb_subordinate_clause>
                        |<mverb_subordinate_clause1> 
                        |<mverb_subordinate_clause2>
```

```
<copula_subordinate_clause> ::= <rel_pro> <copula> <subject>
```

```
<iverb_subordinate_clause> ::= <rel_pro> <iverb> <complement>*
```

```
<mverb_subordinate_clause1> ::= <rel_pro> <mverb> <object> <complement>*
```

```
<mverb_subordinate_clause2> ::= <rel_pro> <subject> <mverb> <complement>*
```


```
<quantifier> ::= 'every'
				|'all'
				|'each'
				|'some'
```

```
<article> ::= 'a'
			 |'an'
			 |'the'
```

```
<rel_pro>  ::= 'that'
```

```
<copula> ::= 'is'
			|'are'
			|'be'
```

```
<negation> ::= "doesn't"
              |"does not"
              |'not'
              |"don't"
              |'do not'
```

```
<subord_conj> ::= 'if'
                 |'when'
                 |'because'
```

```
<hverb> ::= 'do'
           |'does'
```

```
<iverb> ::= [a-z]+
```

```
<mverb> ::= [a-z]+
```

```
<noun> ::= [a-z]+
```

```
<adjective> ::= [a-z]+
```

```
<preposition> ::= 'to'
                 |'with'
                 |'from' ...
```
