export default function createGame(){
    /**
    * @typedef {Object} Player
    * @property {number} x - A posição X do jogador.
    * @property {number} y - A posição Y do jogador.
    */

    /**
    * @typedef {Object} Fruit
    * @property {number} x - A posição X da fruta.
    * @property {number} y - A posição Y da fruta.
    */

    /**
    * @typedef {Object} State
    * @property {Object.<string, Player>} players - Objeto contendo jogadores.
    * @property {Object.<string, Fruit>} fruits - Objeto contendo frutas.
    */

    /**
    * @type {State}
    */

    const state = {
        players: {},
        fruits: {},
        screen: {
            height: 10,
            width: 10,
        },
    }

    const observers = []

    function start(){
        const frequency = 2 * 1000

        setInterval(addFruit, frequency)
    }

    function subscribe(observeFunction){
        observers.push(observeFunction)
    }

    function notifyAll(command){

        for(const observeFunction of observers){
            observeFunction(command)
        }
    }

    function addPlayer(command){
        const playerId = command.playerId
        const playerX = 'playerX' in command? command.playerX : Math.floor(Math.random()*state.screen.width)
        const playerY = 'playerY' in command? command.playerY : Math.floor(Math.random()*state.screen.height)
        

        state.players[playerId] = {
            playerX: playerX,
            playerY: playerY
        }

        notifyAll({
            type:'add-player',
            playerId,
            playerX,
            playerY,
        })
    }

    function removePlayer(command){
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId,
        })
    }

    function addFruit(command){
        const fruitId = command? command.fruitId : Math.floor(Math.random()*1000000)
        const fruitX = command? command.fruitX : Math.floor(Math.random()*state.screen.width)
        const fruitY = command? command.fruitY : Math.floor(Math.random()*state.screen.height)
        

        state.fruits[fruitId] = {
            fruitX,
            fruitY
        }

        notifyAll({
            type: 'add-fruit',
            fruitId,
            fruitX,
            fruitY,
        })
    }

    function removeFruit(command){
        const fruitId = command.fruitId

        delete state.fruits[fruitId]

        notifyAll({
            type: 'remove-fruit',
            fruitId,
        })
    }

    function checkFruitColision(playerId){
        const player = state.players[playerId]

        for(const fruitId in state.fruits){
            const fruit = state.fruits[fruitId]

            if(player.playerX == fruit.fruitX && player.playerY == fruit.fruitY){
                removeFruit({fruitId})
            }
        }
    }

    function movePlayer(command){
        notifyAll(command)
        
        const key = command.key;
        const playerId = command.playerId;
        const player = state.players[playerId]

        const acceptedMoves = {
            ArrowUp(player){
                const newCoordinate = player.playerY - 1

                if(newCoordinate >= 0){
                    player.playerY = newCoordinate
                }
            },
            ArrowDown(player){
                const newCoordinate = player.playerY + 1

                if(newCoordinate < state.screen.height){
                    player.playerY = newCoordinate
                }
            },
            ArrowRight(player){
                const newCoordinate = player.playerX + 1

                if(newCoordinate < state.screen.width){
                    player.playerX = newCoordinate
                }
            },
            ArrowLeft(player){
                const newCoordinate = player.playerX - 1

                if(newCoordinate >= 0){
                    player.playerX = newCoordinate
                }
            },
        }

        const moveFunction = acceptedMoves[key]
        
        if(player && moveFunction) {
            moveFunction(player);
            checkFruitColision(playerId );
        }
    }

    function setState(newState){
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
        start,
        state,
    }
}
