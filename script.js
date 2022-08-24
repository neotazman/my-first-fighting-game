// TUTORIAL FOR THIS PROJECT
// https://www.youtube.com/watch?v=vyqbNFMDRGQ&t=99s
// stopping point 1:59:51 / 3:56:19

// Sprite images come from https://edermunizz.itch.io/free-pixel-art-plataformer-painted-style?download

// Fighter, Sprite, and Background are imported from classes.js




// the canvas element
const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

let gameOver = false // not on the tutorial

const gravity = 0.5

//the background -- isn't perfect but good enough  
const background1 = new Background({
    backgroundImage: './Free Pixel Art plataformer painted style/PNG/Mountains/Background.png'
})
let backgrounds = [background1]
for(let i = 1; i <= 7; i++) {
    let newBackground = new Background({
        backgroundImage: `./Free Pixel Art plataformer painted style/PNG/Mountains/Layer ${i} anim1.png`
    })
    backgrounds.push(newBackground)
}
console.log(backgrounds)
// the player
const player = new Fighter({
    position: {x: 0, y: 0},
    velocity: {x: 0, y: 1},
    color: 'crimson',
    offset: {x: 0, y: 0}
})

// the enemy
const enemy = new Fighter({
    position: {x: 60, y: 80},
    velocity: {x: 0, y: 1},
    color: 'blue',
    offset: {x: -40, y: 0},
})

// control options
const keys = {
    // player
    d: { // right
        isPressed: false,
    },
    a: { // left
        isPressed: false,
    },
    // w: { // jump and attack don't need an isPressed property because they aren't contradicted by other controls
    //     isPressed: false,
    // },

    // enemy
    ArrowRight: { // right
        isPressed: false,
    },
    ArrowLeft: { // left
        isPressed: false,
    },
    // ArrowUp: { // jump
    //     isPressed: false,
    // },
}

function collisionCheck ({attacker, target}) { // a function to check if the attack hit the target
    return (
        attacker.attackBox.position.x + attacker.attackBox.width >= target.position.x && 
        attacker.attackBox.position.x <= target.position.x + target.width && 
        attacker.attackBox.position.y + attacker.attackBox.height >= target.position.y && 
        attacker.attackBox.position.y <= target.position.y + target.height
    )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
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

// the animation
function animate () {
    if(gameOver) return // the animation stops when the game is over, might look better with sprite images added
    window.requestAnimationFrame(animate)
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    // background1.update()
    backgrounds.forEach(background => background.update())
    player.update()
    enemy.update()

    // ALSO MY CODE, THE TUTORIAL DOES IT DIFFERENTLY
    // if(time < 0) {
    //     clearInterval(countDown)
    // } else {
    //     timerElement.innerText = JSON.stringify(time)
    // }
    

    // player movement
    player.velocity.x = 0
    if(keys.a.isPressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if(keys.d.isPressed && player.lastKey === 'd') {
        player.velocity.x = 5
    }
    // enemy movement
    enemy.velocity.x = 0
    if(keys.ArrowLeft.isPressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if(keys.ArrowRight.isPressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
    }

    // collision checking
    if(collisionCheck({attacker: player, target: enemy}) && player.isAttacking) {
        player.isAttacking = false
        enemy.health > 0 ? enemy.health-= 20 : enemy.health = 0 // if the health is zero or less, it's becomes 0
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }
    if(collisionCheck({attacker: enemy, target: player}) && enemy.isAttacking) {
        enemy.isAttacking = false
        player.health > 0 ? player.health-= 20 : player.health = 0
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }
    // check for victory
    if(enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()
countDown()

// control listeners
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        // player
        case 'd': keys.d.isPressed = true; player.lastKey = e.key; break // move right
        case 'a': keys.a.isPressed = true; player.lastKey = e.key; break // move left
        case 'w': player.velocity.y === 0 ? player.velocity.y = -10 : player.velocity.y+=1 ; break // jump -- the ternary prevents jumping while midair 
        case ' ': player.attack(); break // attack
        // enemy
        case 'ArrowRight': keys.ArrowRight.isPressed = true; enemy.lastKey = 'ArrowRight'; break // move right
        case 'ArrowLeft': keys.ArrowLeft.isPressed = true; enemy.lastKey = 'ArrowLeft'; break // move left
        case 'ArrowUp': enemy.velocity.y === 0 ? enemy.velocity.y = -10 : enemy.velocity.y+=1; break // jump -- the ternary prevents jumping while midair
        case 'ArrowDown': enemy.attack(); break // attack
    }
}) 

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'd': keys.d.isPressed = false; break 
        case 'a': keys.a.isPressed = false; break
        case 'w': break

        case 'ArrowRight': keys.ArrowRight.isPressed = false; break 
        case 'ArrowLeft': keys.ArrowLeft.isPressed = false; break
        case 'ArrowUp': break
    }
})  

console.log(player)