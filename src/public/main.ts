import createGame, { Game, Identifier, Player } from "../game.js";
import createKeyboardListenner from "../keyboardListener.js";
import createNotifyer from "../notify.js";
import renderScreen from "../renderScreen.js";
declare let io: Function;

const game = createGame();
const keyboardListenner = createKeyboardListenner(document);
const notifyer = createNotifyer();
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

socket.on("setup", (state: any) => {
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

socket.on("add-player", (command: any) => {
	game.addPlayer(command);
});

socket.on("remove-player", (command: any) => {
	game.removePlayer(command);
});

socket.on("move-player", (command: any) => {
	const playerId = socket.id;

	if (playerId != command.playerId) {
		game.movePlayer(command);
	}
});

socket.on("add-fruit", (command: any) => {
	game.addFruit(command);
});

socket.on("remove-fruit", (command: any) => {
	game.removeFruit(command);
});

socket.on("score", (command: any) => {
	const playerId = command.playerId || socket.id;

	notifyer.notify({[`${playerId}`]:{...game.state.players[playerId]}})
});