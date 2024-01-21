import express from 'express'
import {Server} from 'socket.io'
import {createServer} from'http'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import createGame from './src/game';

export const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, { /* options */ });
const port = 3001;

app.use(express.static('dist/src'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'src/public/index.html'));
});

httpServer.listen(port, () => {
  console.log(`> O aplicativo está rodando em http://localhost:${port}`);
});

const game = createGame()
game.startFruitDrops()
game.subscribe({'server': command => {
    io.emit(command.type, command)
}})

io.on('connection', socket => {
    const playerId = socket.id

    game.addPlayer({playerId})

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({playerId})
        game.unsubscribe(playerId)
    })

    socket.on('move-player', command => {
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })
})