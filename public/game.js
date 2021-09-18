export default function createGame() {
    let gameState = {
        width: 400,
        height: 400,
        entitiesSize: 10,
        players: {},
        targets: {}
    }

    function addTarget(target) {
        let targetId = target.id
        delete target.id
        gameState.targets[targetId] = target
    }

    function removeTarget(target) {
        delete gameState.targets[target.id]
    }

    function addPlayer(player) {
        let playerId = player.id
        delete player.id
        gameState.players[playerId] = player
    }

    function removePlayer(player) {
        delete gameState.players[player.id]
    }

    function detectCollision(player) {
        const playerId = player.id
        const playerPosition = {x: gameState.players[playerId].x, y: gameState.players[playerId].y}

        for (const targetId of Object.keys(gameState.targets)) {
            const targetPosition = {x: gameState.targets[targetId].x, y: gameState.targets[targetId].y}

            if (JSON.stringify(playerPosition) === JSON.stringify(targetPosition) ) {
                return {target: targetId, player: playerId}
            }
        }
    }

    function addPointsPlayer(player) {
        let playerData = gameState.players[player.id]
        playerData.score = playerData.score + player.points
    }

    function movePlayer(player) {

        let keyPressed = player.keyPressed
        let playerData = gameState.players[player.id]

        const validKeys = {
            ArrowUp() {
                if (playerData.y > 0) {
                    playerData.y = playerData.y - gameState.entitiesSize
                }
            },
            ArrowDown() {
                if (playerData.y + gameState.entitiesSize < gameState.height) {
                    playerData.y = playerData.y + gameState.entitiesSize
                }
               
            },
            ArrowRight() {
                if (playerData.x + gameState.entitiesSize < gameState.width) {
                    playerData.x = playerData.x + gameState.entitiesSize
                }
            },
            ArrowLeft() {
                if (playerData.x > 0) {
                    playerData.x = playerData.x - gameState.entitiesSize
                }
            }
        }

        if (validKeys[keyPressed]) {
            validKeys[keyPressed]()
        }
    }

    return {
        detectCollision,
        addPointsPlayer,
        gameState,
        addPlayer,
        removePlayer,
        addTarget,
        removeTarget,
        movePlayer,
    }
}