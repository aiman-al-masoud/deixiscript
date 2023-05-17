import { WorldModel } from "./types.ts";

// TODO: no distinction between concepts and individuals?
export const model: WorldModel = [

    /* World Model */
    ['event#1', 'birth-event'], // is-a
    ['event#1', 'person#1', 'baby'], // event#1 has person#1 as baby
    ['event#1', 'person#2', 'mother'],
    ['event#1', 'time-point#1', 'time'],
    ['event#1', 'space-point#1', 'location'],
    ['space-point#1', 'boston', 'enclosing-city'],
    ['person#1', 'event#1', 'birth'],
    ['person#2', 'woman'],
    ['person#1', 'person'],
    ['boston', 'city'],
    ['space-point#1', 'space-point'],
    ['door#1', 'door'],
    ['door-opening-event#1', 'door-opening-event'],
    ['door-opening-event#1', 'door#1', 'object'],
    ['door-closing-event#1', 'door-closing-event'],
    ['door-closing-event#1', 'door#1', 'object'],



    /* Conceptual Model */
    ['person', 'thing'], // is-a
    ['woman', 'person'],
    ['event', 'thing'],
    ['door-opening-event', 'event'],
    ['birth-event', 'event'],
    ['time-instant', 'thing'],
    ['point-in-space', 'thing'],
    ['city', 'thing'],
    ['multiple-birth-event', 'birth-event'],
    ['animal', 'thing'],
    ['bird', 'animal'],
    ['penguin', 'bird'],
    ['canary', 'bird'],
    ['move', 'thing'],
    ['fly', 'move'],
    ['swim', 'move'],

    ['birth-event', 'mother', 'part'],// birth-event has mother as a part
    ['birth-event', 'baby', 'part'],
    ['birth-event', 'time', 'part'],
    ['birth-event', 'location', 'part'],
    ['birth-event', 'vr#1', 'part'],
    ['birth-event', 'nr#2', 'part'],


    ['person', 'birth-event', 'birth'], // person has birth-event as birth

    ['mother', 'role'],// maybe uneeded
    ['baby', 'role'],// maybe uneeded
    ['time', 'role'],// maybe uneeded
    ['location', 'role'],// maybe uneeded

    ['vr#1', 'value-restriction'],
    ['vr#1', 'mother', 'subject'], // vr#1 has mother as a subject
    ['vr#1', 'woman', 'object'],

    ['nr#2', 'number-restriction'],
    ['nr#2', 'baby', 'subject'],
    ['nr#2', '1', 'object'],

    ['ann#1', 'cancel-annotation'],
    ['ann#1', 'nr#2', 'subject'],
    ['multiple-birth-event', 'ann#1', 'part'],
    

]

