import createGame from "../game.js";
import createKeyboardListenner from "../keyboardListener.js";
import renderScreen from "../renderScreen.js";
import { io } from "socket.io-client";

const game = createGame();
const keyboardListenner = createKeyboardListenner(document);
const socket = io();
let ID = socket?.id;

socket.on("connect", () => {
	const currentPlayerId = socket.id;

	ID = currentPlayerId

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

socket.on("disconnect", () => {
	keyboardListenner.unsubscribe()

	if(!ID) return;

	game.unsubscribe(ID)
})

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