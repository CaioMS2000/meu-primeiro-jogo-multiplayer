"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const keyboardListener_1 = __importDefault(require("./keyboardListener"));
const game_1 = __importDefault(require("./game"));
const renderScreen_1 = __importDefault(require("./renderScreen.cjs"));
const socket_io_client_1 = require("socket.io-client");
/**
 * @type {HTMLCanvasElement}
 */
const game = (0, game_1.default)();
const keyboardListenner = (0, keyboardListener_1.default)(document);
const socket = (0, socket_io_client_1.io)();
socket.on("connect", () => {
    const currentPlayerId = socket.id;
    if (!currentPlayerId)
        return;
    console.log(`Connected with id '${currentPlayerId}'`);
    const screen = document.getElementById("screen");
    if (!screen)
        return;
    (0, renderScreen_1.default)(screen, game, requestAnimationFrame, currentPlayerId);
});
socket.on("setup", (state) => {
    const playerId = socket.id;
    if (!playerId)
        return;
    game.setState(state);
    keyboardListenner.registerPlayerId(playerId);
    keyboardListenner.subscribe(game.movePlayer);
    keyboardListenner.subscribe((command) => {
        socket.emit("move-player", command);
    });
});
socket.on("add-player", (command) => {
    game.addPlayer(command);
});
socket.on("remove-player", (command) => {
    game.removePlayer(command);
});
socket.on("move-player", (command) => {
    const playerId = socket.id;
    if (playerId != command.playerId) {
        game.movePlayer(command);
    }
});
socket.on("add-fruit", (command) => {
    game.addFruit(command);
});
socket.on("remove-fruit", (command) => {
    game.removeFruit(command);
});
