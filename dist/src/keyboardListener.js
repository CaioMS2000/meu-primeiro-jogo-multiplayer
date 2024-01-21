export default function createKeyboardListenner(document) {
    const state = {
        observers: [],
        playerId: null
    };
    function registerPlayerId(playerId) {
        state.playerId = playerId;
    }
    function subscribe(observeFunction) {
        state.observers.push(observeFunction);
    }
    function unsubscribe() {
        console.log('keyboardListener');
        console.log(state.observers);
        while (state.observers.length > 0)
            state.observers.pop();
        console.log('#');
        console.log(state.observers);
        console.log('\n');
    }
    function notifyAll(command) {
        for (const observeFunction of state.observers) {
            observeFunction(command);
        }
    }
    function handleKeyDown(event) {
        const key = event.key;
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            key,
        };
        notifyAll(command);
    }
    document.addEventListener('keydown', handleKeyDown);
    return {
        subscribe,
        registerPlayerId,
        unsubscribe,
    };
}
