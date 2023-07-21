// import * as denoDom from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
// import { Element } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
// import * as dom from "https://esm.sh/linkedom";
// import { JSDOM } from "jsdom";
/// <reference lib="dom" />
import * as ev from "../core/evaluate.ts";
import { $ } from "../core/exp-builder.ts";
import { HasSentence, KnowledgeBase, LLangAst, isHasSentence } from "../core/types.ts";


export type State = KnowledgeBase & {
    readonly domDict: { [id: string]: HTMLElement }
    readonly document: Document
    readonly root: HTMLElement
    eventQueue: DeixiEvent[]
}

type DeixiEvent = {
    down: 'down' | 'up'
    targetId: string
}

export function init(kb: KnowledgeBase, root: HTMLElement, document: Document): State {
    const state = {
        ...kb,
        domDict: {},
        document,
        root,
        eventQueue: [],
    }
    setupKeyListeners(state)
    return state
}

export function evaluate(ast: LLangAst, state: State) {
    const { additions, eliminations, kb, result } = ev.evaluate(ast, state)
    applyAdditions(state, additions.filter(isHasSentence))
    return {
        state: {
            ...state,
            ...kb,
        },
        result,
    }
}

function applyOneAddition(state: State, hasSentence: HasSentence) {

    const property = hasSentence[2]
    const id = hasSentence[0] as string
    const value = hasSentence[1]
    const element = state.domDict[id]

    if (
        (element === undefined && property !== 'visibility')
        && id !== 'stdout'
    ) return

    switch (property) {

        case 'visibility':
            if (value !== 'hidden' && element === undefined) {
                createDomObject(state, id)
            } else {
                element.style.visibility = value as string
            }
            break
        case 'xcoord':
            element.style.left = `${value}px`
            break
        case 'ycoord':
            element.style.top = `${value}px`
            break
        case 'width':
            element.style.width = `${value}px`
            break
        case 'height':
            element.style.height = `${value}px`
            break
        case 'color':
            element.style.background = value as string
            break
        case 'z-index':
            element.style.zIndex = value as string
            break
        case 'text':
            element.childNodes[0].textContent = value as string
            break
        case 'image':
            break
        case 'value':
            if (id === 'stdout') console.log(value)
            break
        case 'press-state':
        case 'key-code':
            break

    }

}

function applyAdditions(state: State, hasSentences: HasSentence[]) {
    hasSentences.forEach(hs => applyOneAddition(state, hs))
}

function createDomObject(state: State, id: string) {
    state.domDict[id] = state.document.createElement('div')
    state.domDict[id].style.position = 'fixed'
    state.domDict[id].id = id
    state.root.appendChild(state.domDict[id])
    const hasSentences = state.wm.filter(isHasSentence).filter(x => x[0] === id)
    applyAdditions(state, hasSentences)
    addListenersTo(state.domDict[id], state)
}

function singleEventToSentence(e: DeixiEvent): LLangAst {
    return $(e.targetId).has(e.down).as('press-state').$
}

export function eventsToSentence(events: DeixiEvent[]) {
    if (events.length <= 0) return $('nothing').$
    if (events.length === 1) return singleEventToSentence(events[0])
    const sentence = events.map(singleEventToSentence).reduce((a, b) => $(a).and($(b)).$)
    return $(sentence).tell.$
}

function addListenersTo(element: HTMLElement, state: State) {
    element.addEventListener('mousedown', () => pushEvent({ down: 'down', targetId: element.id }, state))
    element.addEventListener('mouseup', () => pushEvent({ down: 'up', targetId: element.id }, state))
}

function setupKeyListeners(state: State) {
    state.root.addEventListener('keydown', e => pushEvent({ down: 'down', targetId: e.key }, state))
    state.root.addEventListener('keyup', e => pushEvent({ down: 'up', targetId: e.key }, state))
}

function pushEvent(e: DeixiEvent, state: State) {
    const maxEvents = 10
    if (state.eventQueue.length >= maxEvents) return
    state.eventQueue.push(e)
}

export function processEvents(state: State) {
    const sentence = eventsToSentence(state.eventQueue)
    state = evaluate(sentence, state).state
    state.eventQueue.length = 0
    return state
}

