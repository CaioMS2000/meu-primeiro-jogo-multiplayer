"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
    const context = screen.getContext('2d');
    if (!context)
        return;
    context.fillStyle = 'white';
    context.clearRect(0, 0, game.state.screen.height, game.state.screen.width);
    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];
        context.fillStyle = '#5a0000';
        context.fillRect(player.x, player.y, 1, 1);
    }
    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];
        context.fillStyle = '#a9cf00';
        context.fillRect(fruit.x, fruit.y, 1, 1);
    }
    const currentPlayer = game.state.players[currentPlayerId];
    if (currentPlayer) {
        context.fillStyle = '#0e2668';
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
    }
    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId);
    });
}
exports.default = renderScreen;