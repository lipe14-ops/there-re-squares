import http from 'http'
import express from 'express'
import createGame from './public/game.js'
import { Server } from "socket.io";

const app = express()
const server = http.createServer(app)
const io = new Server(server);
const game = createGame()

app.use(express.static('public'))

function randomNumber(min, max) {
    return Math.round((Math.random()*(max-min)+min)/10)*10
}

game.addTarget({id: (new Date()).getTime().toString(33), x: randomNumber(10, 390), y: randomNumber(10, 390)})
game.addTarget({id: (new Date()).getTime().toString(32), x: randomNumber(10, 390), y: randomNumber(10, 390)})
game.addTarget({id: (new Date()).getTime().toString(31), x: randomNumber(10, 390), y: randomNumber(10, 390)})

io.on('connection', (socket) => {
    io.emit('setup', game.gameState)
    socket.emit('disconnected')

    socket.on('move player', (player) => {
        if (player) {
            game.movePlayer(player)

            if (game.detectCollision({id: player.id})) {
                const collided = game.detectCollision({id: player.id})
                const playersList = Object.entries(game.gameState.players).sort((a, b) => {return a[1].score - b[1].score;}).reverse()
                
                game.addPointsPlayer({id: player.id, points: 10})
                game.removeTarget({id: collided.target})
                game.addTarget({id: (new Date()).getTime().toString(30), x: randomNumber(10, 390), y: randomNumber(10, 390)})
                
                game.gameState.players = {}
                for (const player of playersList) {
                    let playerId = player[0]
                    let playerInfo = player[1]

                    game.gameState.players[playerId] = playerInfo
                }
            }
            io.emit('setup', game.gameState)
        }
    });

    socket.on('add player', (player) => {
        let playerNick = player.nick? player.nick: `guest#${Math.floor(Math.random() * (5000 - 1000) + 5000)}`
        game.addPlayer({id: socket.id, nick: playerNick, score: 0, x: randomNumber(10, 390), y: randomNumber(10, 390)})
        io.emit('setup', game.gameState)
    });

    socket.on('disconnect', () => {
        game.removePlayer({id: socket.id})
        io.emit('setup', game.gameState)
        socket.emit('disconnected')
    });
})

server.listen(5500, () => console.log('server is listening on port 5500'))