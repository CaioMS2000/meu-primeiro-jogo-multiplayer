export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId){
    const context = screen.getContext('2d')
    context.fillStyle = 'white'
    context.clearRect(0, 0, game.state.screen.height, game.state.screen.width)

    for(const playerId in game.state.players){
        const player = game.state.players[playerId]

        context.fillStyle = 'black'
        context.fillRect(player.playerX, player.playerY, 1, 1)
    }

    for (const fruitId in game.state.fruits){
        const fruit = game.state.fruits[fruitId]

        context.fillStyle = 'green'
        context.fillRect(fruit.fruitX, fruit.fruitY, 1, 1)
    }

    const currentPlayer = game.state.players[currentPlayerId]
    
    if(currentPlayer){
        context.fillStyle = 'blue'
        context.fillRect(currentPlayer.playerX, currentPlayer.playerY, 1, 1)
    }

    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    })
}