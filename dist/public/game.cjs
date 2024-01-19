"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createGame() {
    const state = {
        players: {},
        fruits: {},
        screen: {
            height: 20,
            width: 20,
        },
    };
    const observers = [];
    function startFruitDrops() {
        const frequency = 2 * 1000;
        setInterval(addFruit, frequency);
    }
    function subscribe(observeFunction) {
        observers.push(observeFunction);
    }
    function notifyAll(command) {
        for (const observeFunction of observers) {
            observeFunction(command);
        }
    }
    function addPlayer(command) {
        const playerId = command.playerId;
        const playerX = 'x' in command ? command.x : Math.floor(Math.random() * state.screen.width);
        const playerY = 'y' in command ? command.y : Math.floor(Math.random() * state.screen.height);
        state.players[playerId] = {
            x: playerX,
            y: playerY
        };
        notifyAll({
            type: 'add-player',
            playerId,
            x: playerX,
            y: playerY,
        });
    }
    function removePlayer(command) {
        const playerId = command.playerId;
        delete state.players[playerId];
        notifyAll({
            type: 'remove-player',
            playerId,
        });
    }
    function addFruit(command) {
        if (Object.keys(state.fruits).length >= 10)
            return;
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 1000000);
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width);
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height);
        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        };
        notifyAll({
            type: 'add-fruit',
            fruitId,
            fruitX,
            fruitY,
        });
    }
    function removeFruit(command) {
        const fruitId = command.fruitId;
        delete state.fruits[fruitId];
        notifyAll({
            type: 'remove-fruit',
            fruitId,
        });
    }
    function checkFruitColision(playerId) {
        const player = state.players[playerId];
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId];
            if (player.x == fruit.x && player.y == fruit.y) {
                removeFruit({ fruitId });
            }
        }
    }
    function movePlayer(command) {
        notifyAll(command);
        const key = command.key;
        const playerId = command.playerId;
        const player = state.players[playerId];
        const acceptedMoves = {
            ArrowUp(player) {
                const newCoordinate = player.y - 1;
                if (newCoordinate >= 0) {
                    player.y = newCoordinate;
                }
            },
            ArrowDown(player) {
                const newCoordinate = player.y + 1;
                if (newCoordinate < state.screen.height) {
                    player.y = newCoordinate;
                }
            },
            ArrowRight(player) {
                const newCoordinate = player.x + 1;
                if (newCoordinate < state.screen.width) {
                    player.x = newCoordinate;
                }
            },
            ArrowLeft(player) {
                const newCoordinate = player.x - 1;
                if (newCoordinate >= 0) {
                    player.x = newCoordinate;
                }
            },
        };
        const moveFunction = acceptedMoves[key];
        if (player && moveFunction) {
            moveFunction(player);
            checkFruitColision(playerId);
        }
    }
    function setState(newState) {
        Object.assign(state, newState);
    }
    return {
        movePlayer,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        setState,
        subscribe,
        startFruitDrops,
        state,
    };
}
exports.default = createGame;
