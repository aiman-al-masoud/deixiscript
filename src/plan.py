from typing import List
from lang import *
from kb import KB
from match import match

def plan(
    order:Order,
    kb:KB,
    maxDurationSeconds:float=1,
    durationSeconds:float=0,
    steps:List[SimpleSentence]=[],
)->'Tuple[List[SimpleSentence], float]|Zorror':

    if durationSeconds > maxDurationSeconds:
        return steps, durationSeconds
    
    maybeGoalStatus=order.goal.ask().eval(kb)
    if isinstance(maybeGoalStatus, Zorror): return maybeGoalStatus
    
    elif maybeGoalStatus[1]:
        return steps, durationSeconds
    else:
        maybeTarget=order.goal.tell().eval(kb)
        if isinstance(maybeTarget, Zorror): return maybeTarget
        targetKb=maybeTarget[0]
        error=worldError(kb, targetKb)
        couldDo:List[Potential]=[]

        for pot in whatAgentCanDo(order.agent, kb):
            # print(pot.event.english())
            maybeNew=pot.event.tell().eval(kb)
            if isinstance(maybeNew, Zorror): return maybeNew
            newKb=maybeNew[0]
            newError=worldError(newKb, targetKb)
            if newError < error: couldDo.append(pot)

        if not couldDo: 
            return Zorror(f'Agent "{order.agent.english()}" cannot do: "{order.goal.english()}"')

        cantDoYet=[p for p in couldDo if not p.precondition.ask().eval(kb)[1]] # pyright:ignore

        if cantDoYet:
            preconditions=[p.precondition for p in cantDoYet]
            intermedGoal=reduce(lambda a,b: AndExp(a, b), preconditions)
            intermedOrder=Order(order.agent, intermedGoal)
            maybeNew=plan(intermedOrder, kb, maxDurationSeconds, durationSeconds, steps)
            if isinstance(maybeNew, Zorror): return maybeNew
            maybeAfter=intermedGoal.tell().eval(kb)
            if isinstance(maybeAfter, Zorror): return maybeAfter
            newSteps,newDuration=maybeNew
            kbAfter=maybeAfter[0]
            return plan(order, kbAfter, maxDurationSeconds, newDuration, newSteps)
        else:
            actions=[p.event for p in couldDo]
            maybeAfter=Prog(actions).tell().eval(kb)
            if isinstance(maybeAfter, Zorror): return maybeAfter
            kbAfter=maybeAfter[0]
            newSteps=[*steps, *actions]
            newDuration=durationSeconds+sum([p.durationSeconds for p in couldDo])
            return plan(order, kbAfter, maxDurationSeconds, newDuration, newSteps)

def whatAgentCanDo(agent:NounPhrase, kb:KB):
    return [p for p in kb.pots if match(p.event.subject, agent)]

def worldError(kb1:KB, kb2:KB):
    totalError=0
    
    for thing1, thing2 in zip(kb1.wm, kb2.wm):
        commonKeys=thing1.keys()&thing2.keys()
        for k in commonKeys:
            v1, v2 = thing1[k], thing2[k]
            if isinstance(v1, Num) and isinstance(v2, Num):
                totalError+=abs(v2-v1)

    return totalError

def groupRepeated(steps:List[SimpleSentence]):
    from itertools import groupby
    newSteps:List[SimpleSentence|Repeat]=[]
    for group in groupby(steps):
        times=len(list(group[1]))
        if times>1:
            newSteps.append(Repeat(group[0], times))
        else:
            newSteps.append(group[0])    
    return newSteps
