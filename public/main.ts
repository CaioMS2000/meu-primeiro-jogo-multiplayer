import createKeyboardListenner from "./keyboardListener";
import createGame from "./game";
import renderScreen from "./renderScreen";
import { io } from "socket.io-client";

/**
 * @type {HTMLCanvasElement}
 */
const game = createGame();
const keyboardListenner = createKeyboardListenner(document);
const socket = io();

socket.on("connect", () => {
	const currentPlayerId = socket.id;

	if(!currentPlayerId) return;

	console.log(`Connected with id '${currentPlayerId}'`);

	const screen: HTMLCanvasElement|null = document.getElementById("screen") as HTMLCanvasElement;

	if(!screen) return;

	renderScreen(screen, game, requestAnimationFrame, currentPlayerId);
});

socket.on("setup", (state) => {
	const playerId = socket.id;

	if(!playerId) return;

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
