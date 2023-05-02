(the cat (that ate tuna)) is (black)

# ONE

subject = (the cat (that ate tuna)) 
predicate = black

[black(X)] + subject.toProlog({subject:X})

# TWO

(the cat (that ate tuna)) 

noun = cat
subord = that ate tuna

[cat(args.subject)] + subord.toProlog(args)

# THREE

that ate tuna

mverb = eat
object = tuna

[eat(args.subject, Y), tuna(Y)]

# RESULT

[black(X), cat(X), eat(X, Y), tuna(Y)]

----------------------------------------

(the manager (that the customer contacted)) called (a friend)


# ONE

subject = (the manager (that the customer contacted))
mverb = called
object = (a friend)

[call(X, Y)] + subject.toProlog({subject:X}) + object.toProlog({subject:Y})


# TWO point ONE

(the manager (that the customer contacted))

subject = the manager
subord = (that the customer contacted)

[manager(args.subject)] + subord.toProlog(args)

# TWO point TWO

subject = (a friend)

[friend(args.subject)]


# THREE

// I am an MVERB2 subordinate clause, so the subject I ...
// receive from above is actually my object!

(that the customer contacted) 

subject = the customer
mverb = contacted

[customer(Z), contact(Z, args.subject)]


# RESULT


[call(X, Y), manager(X), friend(Y), customer(Z), contact(Z, X)]


--------------------------------------------------

if (the cat (that is on the table) jumps) then (the table breaks)

# ONE 

condition = (the cat (that is on the table) jumps)
outcome = (the table breaks)

outcome.toProlog()[0] :- outcome.toProlog()[1:] + condition.toProlog()


# TWO point ONE

subject = the table 
iverb = breaks

[table(X), break(X)]

# TWO point TWO

subject = the cat
iverb = jumps
subord = that is on the table

[cat(Y), jump(Y)] + subord.toProlog({subject:Y})

NB: use a pseudorandom number generator to make "sure" no collisions happen when choosing a new id.

# THREE

that is on the table

[table(Z), on(args.subject, Z)]

NB: ask user if table(Z) and table(X) are the same table, or keep a 
minimal dictionary with predicate/1 to entity (single slot) entries. And
pass down this dictionary to every ast within ToPrologArgs args.

# RESULT

break(X) :- table(X), cat(Y), jump(Y), table(Z), on(Y, Z)


---------------------------------------------

the cat on the table // I am a noun phrase

#ONE 

compl = (on the table)
cat(X) + compl.toProlog(subject=X)

#TWO

noun_phrase = the table
on the table

on(args.subject, Y) + noun_phrase.toProlog({subject:Y})

----------------------------

every cat is smart

# ONE

nounphrase = every cat
predicate = smart

nounphrase.isUniversallyQuantified() // true

smart(X) :- nounphrase.toProlog({subject:X})

// NB: you have to choose the IMPORTANT part of the predicate to put 
// on the LHS of the Horn clause!

# TWO

every cat

cat(args.subject)

# RESULT 

smart(X) :- cat(X)








