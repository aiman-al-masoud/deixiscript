concrete DeixiEng of Deixi = {

    lincat 
    DeixiAst,
    Formula,
    Atom,
    AtomicFormula,
    Equality,
    GeneralizedSimpleFormula,
    GreaterThanFormula,
    HappenSentence,
    IsAFormula,
    HasFormula,
    Conjunction,
    Disjunction,
    Negation,
    ExistentialQuantification,
    DerivationClause,
    IfElse,
    Entity,
    Boolean,
    Number,
    ListPattern,
    ListLiteral,
    Anaphor,
    MathExpression,
    GeneralizedSimpleFormula,
    GreaterThanFormula,
    HappenSentence,
    Constant,
    SimpleFormula,
    CompositeFormula,
    Term,
    Variable,
    Identifier = {s:Str};
    


    lin
    f1 x = x;
    f2 x = x;
    f3 x = x;
    f4 x = x;
    f5 x = x;
    f6 x = x;
    f7 x = x;
    f8 x = x;
    f9 x = x;
    f10 x = x;
    f11 x = x;
    f12 x = x;
    f13 x = x;
    f14 x = x;
    f15 x = x;
    f16 x = x;
    f17 x = x;
    f18 x = x;
    f19 x = x;
    f20 x = x;
    f21 x = x;
    f22 x = x;
    f23 x = x;
    f24 x = x;
    f25 cond then other = {s = "if" ++ cond.s ++ "then" ++ then.s ++ "else" ++ other.s}; 
    f26 conseq when  = {s = conseq.s ++ "when" ++ when.s};
    f27 conseq when  = {s = conseq.s ++ "when" ++ when.s};
    f28 variable wheree  = {s = variable.s ++ "where" ++ wheree.s};
    f29 variable wheree  = {s = variable.s ++ "such that" ++ wheree.s};
    f30 f1  = {s = "not" ++ f1.s};
    f31 f1 f2 = {s =  f1.s ++ "and" ++ f2.s };
    f32 f1 f2 = {s =  f1.s ++ "or" ++ f2.s };
    f33 a1 a2 role after = {s =  a1.s ++"has" ++a2.s ++ "as" ++role.s ++ "after"++after.s};
    f34 a1 a2 after = {s =  a1.s ++"is a" ++a2.s ++ "after"++after.s};
    f35 a1 a2 = {s =  a1.s ++"is" ++a2.s};
    f36 c1 = {s =  c1.s ++ "happens" };
    f37 a1 a2 = {s = a1.s ++ ">" ++ a2.s};
    f39 name type = { s = name.s ++ ":" ++ type.s };
    f38 seq tail  = {s = seq.s ++ "|" ++ tail.s};
    f41 id  = {s = id.s};
    f42 a1 a2 role = {s = a1.s ++ "has" ++ a2.s ++ "as" ++ role.s};


    X = {s = "x"};
    Capra = {s = "capra"};


}