"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const game_js_1 = __importDefault(require("./public/game.cjs"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
exports.app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(exports.app);
exports.io = new socket_io_1.Server(httpServer, { /* options */});
const port = 3001;
exports.app.use(express_1.default.static('public'));
httpServer.listen(port, () => {
    console.log(`> O aplicativo está rodando em http://localhost:${port}`);
});
const game = (0, game_js_1.default)();
game.startFruitDrops();
game.subscribe(command => {
    exports.io.emit(command.type, command);
});
exports.io.on('connection', socket => {
    const playerId = socket.id;
    game.addPlayer({ playerId });
    socket.emit('setup', game.state);
    socket.on('disconnect', () => {
        game.removePlayer({ playerId });
    });
    socket.on('move-player', command => {
        command.playerId = playerId;
        command.type = 'move-player';
        game.movePlayer(command);
    });
});
