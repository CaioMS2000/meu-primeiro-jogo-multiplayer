
export type Observer = (...args:any[]) => void;

export type Identifier = string|number;

export interface EntityData{
    x: number;
    y: number;
}

export interface Screen{
    height: number;
    width: number;
}

export type Entity = Record<Identifier, EntityData>;

export interface GameState{
    players: Entity;
    fruits: Entity;
    screen: Screen
}

export interface Game{
    movePlayer: (arg: Record<string, any>) => void,
    addPlayer: (arg: Record<string, any>) => void,
    removePlayer: (arg: Record<string, any>) => void,
    addFruit: (arg: Record<string, any>) => void,
    removeFruit: (arg: Record<string, any>) => void,
    setState: (arg: GameState) => void,
    subscribe: (arg: Observer) => void,
    startFruitDrops: () => void,
    state: GameState,
}

export default function createGame(): Game{

    const state: GameState = {
        players: {},
        fruits: {},
        screen: {
            height: 20,
            width: 20,
        },
    }

    const observers: Observer[] = []

    function startFruitDrops(){
        const frequency = 2 * 1000

        setInterval(addFruit, frequency)
    }

    function subscribe(observeFunction: Observer){
        observers.push(observeFunction)
    }

    function notifyAll(command: Record<string, any>){

        for(const observeFunction of observers){
            observeFunction(command)
        }
    }

    function addPlayer(command: Record<string, any>){
        const playerId = command.playerId
        const playerX = 'x' in command? command.x : Math.floor(Math.random()*state.screen.width)
        const playerY = 'y' in command? command.y : Math.floor(Math.random()*state.screen.height)
        

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }

        notifyAll({
            type:'add-player',
            playerId,
            x: playerX,
            y: playerY,
        })
    }

    function removePlayer(command: Record<string, any>){
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId,
        })
    }

    function addFruit(command: Record<string, any>){
        if(Object.keys(state.fruits).length >= 10) return;
        
        const fruitId = command? command.fruitId : Math.floor(Math.random()*1000000)
        const fruitX = command? command.fruitX : Math.floor(Math.random()*state.screen.width)
        const fruitY = command? command.fruitY : Math.floor(Math.random()*state.screen.height)
        

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        notifyAll({
            type: 'add-fruit',
            fruitId,
            fruitX,
            fruitY,
        })
    }

    function removeFruit(command: Record<string, any>){
        const fruitId = command.fruitId

        delete state.fruits[fruitId]

        notifyAll({
            type: 'remove-fruit',
            fruitId,
        })
    }

    function checkFruitColision(playerId: Identifier){
        const player = state.players[playerId]

        for(const fruitId in state.fruits){
            const fruit = state.fruits[fruitId]

            if(player.x == fruit.x && player.y == fruit.y){
                removeFruit({fruitId})
            }
        }
    }

    function movePlayer(command: Record<string, any>){
        notifyAll(command)
        
        const key = command.key;
        const playerId = command.playerId;
        const player = state.players[playerId]

        const acceptedMoves: Record<string, (arg: EntityData) => void> = {
            ArrowUp(player: EntityData){
                const newCoordinate = player.y - 1

                if(newCoordinate >= 0){
                    player.y = newCoordinate
                }
            },
            ArrowDown(player: EntityData){
                const newCoordinate = player.y + 1

                if(newCoordinate < state.screen.height){
                    player.y = newCoordinate
                }
            },
            ArrowRight(player: EntityData){
                const newCoordinate = player.x + 1

                if(newCoordinate < state.screen.width){
                    player.x = newCoordinate
                }
            },
            ArrowLeft(player: EntityData){
                const newCoordinate = player.x - 1

                if(newCoordinate >= 0){
                    player.x = newCoordinate
                }
            },
        }

        const moveFunction = acceptedMoves[key as string]
        
        if(player && moveFunction) {
            moveFunction(player);
            checkFruitColision(playerId );
        }
    }

    function setState(newState: GameState){
        Object.assign(state, newState)
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
    }
}
