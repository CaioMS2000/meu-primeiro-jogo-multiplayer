import { Game, Identifier, Player } from "./game.js"

declare let table: Element;
function buildTable(game: Game, currentPlayerId: Identifier){
	const tableContent = table.querySelector('tbody')
	let content = ''
    const playersList: {id: Identifier, points: number}[] = [];


    const players = game.state.players
    
    for(const playerId in players){
        const player = game.state.players[playerId]

		playersList.push({id: playerId, points: player.points})
    }
    
	playersList.sort((a, b) => b.points - a.points).forEach(el => {
        const flag = el.id == currentPlayerId;

        if(flag){
            content += '<tr class="border-0 h-fit border-b-2 text-[#2b62f8]">'
        }
        else{
            content += '<tr class="border-0 h-fit border-b-2">'
        }
		content += `<td class='border-0 border-r-2 p-2'>${el.id}</td> <td class='p-2 text-center'>${el.points}</td> </tr>`
	})

	if(tableContent) tableContent.innerHTML = content;
}

export default function renderScreen(screen: HTMLCanvasElement, game: Game, requestAnimationFrame: (callback: () => void) => void, currentPlayerId: Identifier){
    const context = screen.getContext('2d')
    
    if(!context) return;

    screen.width = game.state.screen.width
	screen.height = game.state.screen.height

    buildTable(game, currentPlayerId)

    context.fillStyle = 'white'
    context.clearRect(0, 0, game.state.screen.height, game.state.screen.width)

    for(const playerId in game.state.players){
        const player = game.state.players[playerId]

        context.fillStyle = '#5a0000'
        context.fillRect(player.x, player.y, 1, 1)
    }

    for (const fruitId in game.state.fruits){
        const fruit = game.state.fruits[fruitId]

        context.fillStyle = '#a9cf00'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }

    const currentPlayer = game.state.players[currentPlayerId]
    
    if(currentPlayer){
        context.fillStyle = '#0e2668'
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
    })
}