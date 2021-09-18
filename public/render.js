export default function renderGame(currentPlayerId) {
    const context = canvas.getContext('2d');

    function* enumerate (it, start = 0) { 
        let i = start
        for (const x of it)
            yield [i++, x]
    }
    
    function renderPlayers(gameState) {

        for (const playerId of Object.keys(gameState.players)) {
            
            const player = gameState.players[playerId]
            const color = playerId === currentPlayerId ? '#A53E3E' : '#7A60F0'

            context.fillStyle = color
            context.shadowColor = color
            context.shadowBlur = 15
            context.fillRect(player.x, player.y, gameState.entitiesSize, gameState.entitiesSize);
        }
    }

    function renderTargets(gameState) {
        
        for (const targetId of Object.keys(gameState.targets)) {
            const target = gameState.targets[targetId]
            const color = '#2daa52'

            context.fillStyle = color
            context.shadowColor = color
            context.shadowBlur = 15
            context.fillRect(target.x, target.y, gameState.entitiesSize, gameState.entitiesSize);
        }
    }

    function renderRank(gameState, rankDiv) {
        rankDiv.innerHTML = ''

        const bestPlayers = Object.keys(gameState.players)

        for (const [index, player] of enumerate(bestPlayers)) {
            if (index === 10)
                break

            const playerData = gameState.players[player]
            let color = currentPlayerId === player? '#A53E3E' : '#FFFFFF'

            rankDiv.innerHTML += `<p style="color:${color};">#${index + 1} - ${playerData.nick}: ${playerData.score}</p>`
            
        }
        
        // if (bestPlayers.indexOf(currentPlayerId) > 2) {
        //     rankDiv.innerHTML += `<p style="color: #A53E3E;">${bestPlayers.indexOf(currentPlayerId)}</p>`
        // }
    }

    function renderAll(gameState) {
        resetCanvas()
        renderTargets(gameState)
        renderPlayers(gameState)
    }

    const resetCanvas = () => context.clearRect(0, 0, 400, 400)

    return {
        renderPlayers,
        renderTargets,
        resetCanvas,
        renderRank,
        renderAll
    }
}