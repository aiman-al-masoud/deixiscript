abstract Deixi = {
    flags startcat =  DeixiAst;
    -- flags startcat =  Variable;

    cat 
    DeixiAst;
    Formula;
    Atom;
    AtomicFormula;
    Equality;
    GeneralizedSimpleFormula;
    GreaterThanFormula;
    HappenSentence;
    IsAFormula;
    HasFormula;
    Conjunction;
    Disjunction;
    Negation;
    ExistentialQuantification;
    DerivationClause;
    IfElse;
    Entity;
    Boolean;
    Number;
    ListPattern;
    ListLiteral;
    Anaphor;
    MathExpression;
    GeneralizedSimpleFormula;
    GreaterThanFormula;
    HappenSentence;
    Constant;
    SimpleFormula;
    CompositeFormula;
    Term;
    Variable;
    MyString;

    fun
    f1: Atom -> DeixiAst;
    f2: Formula -> DeixiAst;
    f3: Term -> Atom;
    f4: Term -> ListPattern;
    f5: Term -> ListLiteral;
    f6: Term -> Anaphor;
    f7: Term -> MathExpression;
    f8: SimpleFormula -> Formula;
    f9: CompositeFormula -> Formula; 
    f10: Constant -> Term; 
    f11: Variable -> Term; 
    f12: AtomicFormula -> SimpleFormula;
    f13: Equality -> SimpleFormula;
    f14: GeneralizedSimpleFormula -> SimpleFormula;
    f15: GreaterThanFormula -> SimpleFormula;
    f16: HappenSentence -> SimpleFormula;
    f17: IsAFormula -> AtomicFormula;
    f18: HasFormula-> AtomicFormula;
    f19: Conjunction -> CompositeFormula;
    f20: Disjunction -> CompositeFormula;
    f21: Negation -> CompositeFormula;
    f22: ExistentialQuantification -> CompositeFormula;
    f23: DerivationClause -> CompositeFormula;
    f24: IfElse -> CompositeFormula;
    f25: DeixiAst -> Formula -> DeixiAst -> IfElse;
    f26: AtomicFormula -> DeixiAst -> DerivationClause;
    f27: GeneralizedSimpleFormula -> DeixiAst -> DerivationClause;
    f28: Variable -> DeixiAst -> ExistentialQuantification;
    f29: Variable -> DeixiAst -> Anaphor;
    f30: Formula -> Negation;
    f31: Formula -> Formula -> Conjunction;
    f32: Formula -> Formula -> Disjunction;
    f33: Atom -> Atom -> Atom -> Atom -> HasFormula;
    f34: Atom -> Atom -> Atom -> IsAFormula;
    f35: Atom -> Atom -> Equality;
    f36: Constant -> HappenSentence;
    f37: Atom -> Atom -> GreaterThanFormula;
    f38: Atom -> Atom -> ListPattern;    
    f39: MyString -> MyString -> Variable;
    f40: Int -> Number;
    f41: MyString -> Entity;


}