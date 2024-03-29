function collisionCheck ({attacker, target}) { // a function to check if the attack hit the target
    return (
        attacker.attackBox.position.x + attacker.attackBox.width >= target.position.x - target.offset.x * target.scale && 
        attacker.attackBox.position.x <= target.position.x - target.offset.x * target.scale + target.width * target.scale && 
        attacker.attackBox.position.y + attacker.attackBox.height >= target.position.y - target.offset.y * target.scale && 
        attacker.attackBox.position.y <= target.position.y - target.offset.y * target.scale + target.height * target.scale
    ) // the offset, height and width need to be multiplied by scale
}

function charactersCollide () {
    return (player.position.x - player.offset.x * player.scale + player.width * player.scale >= enemy.position.x - enemy.offset.x * enemy.scale)
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    // clearInterval(backgroundChange)
    gameOver = true
    document.querySelector('#endMessage').style.display = 'flex'
    if(player.health === enemy.health) {
        document.querySelector('#endMessage').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelector('#endMessage').innerHTML = 'Player 1 Wins'
    } else if (player.health < enemy.health) {
        document.querySelector('#endMessage').innerHTML = 'Player 2 Wins'
    }
}

// const timerElement = document.getElementById('timer')
let time = 60
//let countDown = setInterval(() => {time--}, 1000) // this was what i came up with, below is the way he did it
let timerId
function countDown() { // the timer for the round
    if(time > 0) {
        timerId = setTimeout(countDown, 1000)
        time--
        document.querySelector('#timer').innerHTML = time
    }
    if(time === 0) {
        determineWinner({player, enemy, timerId})
    } 
}