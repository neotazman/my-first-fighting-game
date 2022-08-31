// TUTORIAL FOR THIS PROJECT
// https://www.youtube.com/watch?v=vyqbNFMDRGQ&t=99s
// stopping point 1:59:51 / 3:56:19

// Sprite images come from https://edermunizz.itch.io/free-pixel-art-plataformer-painted-style?download

// Fighter, Sprite, and Background are seen from classes.js
// collisionCheck, determineWinner, and timer related functions are seen from utils.js




// the canvas element
const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

let gameOver = false // not on the tutorial
let backgroundFlicker = true // for switching between two frames

const gravity = 0.5

// the background -- isn't perfect but good enough  
const firstBackground = new Background({
    backgroundImage: './Free Pixel Art plataformer painted style/PNG/Mountains/Background.png'
})
// the two arrays to switch between for the animation
let backgrounds1 = [firstBackground]
let backgrounds2 = [firstBackground]

// the background animation
for(let i = 1; i <= 7; i++) { // luckily the the layers all have a number in the filename
    let newBackground = new Background({
        backgroundImage: `./Free Pixel Art plataformer painted style/PNG/Mountains/Layer ${i} anim1.png`
    })
    backgrounds1.push(newBackground)
    if(i === 1 || i === 3) {
        let cloundBackground = new Background({ // that's how it's actually spelled, i didn't want to change it
            backgroundImage: `./Free Pixel Art plataformer painted style/PNG/Mountains/Layer ${i} clound anim1.png`
        })
        backgrounds2.push(cloundBackground)
    } 
}
for(let i = 1; i <= 6; i++) {
    let newBackground = new Background({
        backgroundImage: `./Free Pixel Art plataformer painted style/PNG/Mountains/Layer ${i} anim2.png`
    })
    backgrounds2.push(newBackground)
    if(i === 1 || i === 3) {
        let cloundBackground = new Background({
            backgroundImage: `./Free Pixel Art plataformer painted style/PNG/Mountains/Layer ${i} clound anim2.png`
        })
        backgrounds2.push(cloundBackground)
    } 
}
function animationSwitch() {
    backgroundFlicker ? backgroundFlicker = false : backgroundFlicker = true
}
let backgroundChange = setInterval(animationSwitch, 800) // this gets cleared in determine winner

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

const bomb1 = new Sprite({
    position: {x: 50, y: 30},
    imageSource: './Free Bomb Sprite/BOM.BUM.png',
    scale: 2,
    verticalFrames: 5,
    horizontalFrames: 5,
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

// the animation
function animate () {
    if(gameOver) return // the animation stops when the game is over, might look better with sprite images added
    window.requestAnimationFrame(animate)
    // just as a backup if the background animation doesn't work
    canvasContext.fillStyle = 'green' // is grass at the bottom
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    // background1.update()
    if(backgroundFlicker) {
        backgrounds1.forEach(background => background.update()) // has all the background layers in order
    } else {
        backgrounds2.forEach(background => background.update()) // has all the background layers in order
    }
    bomb1.update()
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