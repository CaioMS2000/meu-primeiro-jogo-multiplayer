import { Identifier, Observer } from "./game";

export interface KeyboardListennerState{
    observers: Observer[];
    playerId: Identifier|null
}

export interface KeyboardListenner{
    registerPlayerId: (arg: Identifier) => void;
    subscribe: (arg: Observer) => void;
    unsubscribe: () => void;
}

export default function createKeyboardListenner(document: Document): KeyboardListenner{
    const state: KeyboardListennerState = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId: Identifier){
        state.playerId = playerId
    }

    function subscribe(observeFunction: Observer){
        state.observers.push(observeFunction)
    }

    function unsubscribe(){
        console.log('keyboardListener')
        console.log(state.observers)
        for(const observerID in state.observers){
            delete state.observers[observerID]
        }
        console.log('#')
        console.log(state.observers)
        console.log('\n')
    }

    function notifyAll(command: Record<string, any>){

        for(const observeFunction of state.observers){
            observeFunction(command)
        }
    }

    function handleKeyDown(event: Record<string, any>){
        const key = event.key;
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            key,
        }

        notifyAll(command)
    }

    document.addEventListener('keydown', handleKeyDown)

    return {
        subscribe,
        registerPlayerId,
        unsubscribe,
    }

}