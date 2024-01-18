import express from 'express'
import createGame from './public/game.js'
import {Server} from 'socket.io'
import {createServer} from'http'

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const port = 3001;

app.use(express.static('public'))

httpServer.listen(port, () => {
  console.log(`> O aplicativo está rodando em http://localhost:${port}`);
});

const game = createGame()
game.start()
game.subscribe(command => {
    io.emit(command.type, command)
})

io.on('connection', socket => {
    const playerId = socket.id

    game.addPlayer({playerId})

    socket.emit('setup', game.state)

    socket.on('disconnect', () => {
        game.removePlayer({playerId})
    })

    socket.on('move-player', command => {
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })
})