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

//create random bombs in the background
let bombs = []
function throwXBombs(x) { // i could've made the bomb class have all this logic, but I might one day have specific locations and size
    for (let i = 1; i <= x; i++) { // creating an array of randomly sized bombs in random places on the map
        let newBomb = new Bomb({position: {x: Math.random() * (canvas.width - 50), y: Math.random() * (canvas.height / 2) - groundHeight}, scale: Math.random() * 3})
        bombs.push(newBomb)
    }
    console.log(bombs.length + ' bombs')
}
throwXBombs(Math.random() * 33) // throw between 0 and 33 bombs in random places

// the player
const player = new Fighter({
    position: {x: 0, y: 0},
    velocity: {x: 0, y: 1},
    offset: {x: 35, y: groundHeight},
    imageSource: './Martial Hero 3/Sprite/Idle.png',
    horizontalFrames: 10,
    scale: 2,
    sprites: {
        idle: {
            imageSource: './Martial Hero 3/Sprite/Idle.png',
            horizontalFrames: 10,
        },
        run: {
            imageSource: './Martial Hero 3/Sprite/Run.png',
            horizontalFrames: 8,
        },
        jump: {
            imageSource: './Martial Hero 3/Sprite/Going Up.png',
            horizontalFrames: 3,
        },
        fall: {
            imageSource: './Martial Hero 3/Sprite/Going Down.png',
            horizontalFrames: 3,
        },
        attack1: {
            imageSource: './Martial Hero 3/Sprite/Attack1.png',
            horizontalFrames: 7,
        },
        takeHit: {
            imageSource: './Martial Hero 3/Sprite/Take Hit.png',
            horizontalFrames: 3,
        },
        death: {
            imageSource: './Martial Hero 3/Sprite/Death.png',
            horizontalFrames: 11,
        },
    },
    attackBox: {
        offset: {
            x: 30, y: 0,
        },
        width: 35,
        height: 60,
    },
})

// the enemy
const enemy = new Fighter({
    position: {x: 60, y: 80},
    velocity: {x: 0, y: 1},
    offset: {x: -40, y: groundHeight + 30},
    imageSource: './Kenji/Sprites/Idle.png',
    horizontalFrames: 4,
    scale: 3,
    sprites: {
        idle: {
            imageSource: './Kenji/Sprites/Idle.png',
            horizontalFrames: 4,
        },
        run: {
            imageSource: './Kenji/Sprites/Run.png',
            horizontalFrames: 8,
        },
        jump: {
            imageSource: './Kenji/Sprites/Jump.png',
            horizontalFrames: 2,
        },
        fall: {
            imageSource: './Kenji/Sprites/Fall.png',
            horizontalFrames: 2,
        },
        attack1: {
            imageSource: './Kenji/Sprites/Attack1.png',
            horizontalFrames: 4,
        },
        takeHit: {
            imageSource: './Kenji/Sprites/Take hit.png',
            horizontalFrames: 3,
        },
        death: {
            imageSource: './Kenji/Sprites/Death.png',
            horizontalFrames: 7,
        },
    },
    attackBox: {
        offset: {
            x: 50, y: 13,
        },
        width: 50,
        height: 40,
    },
    reverseXFrames: true,
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
    // if(gameOver) return // won't show the character die if on
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
    bombs.forEach(bomb => bomb.update())
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
        player.switchSprite('run')
    } else if(keys.d.isPressed && player.lastKey === 'd') {
        if(charactersCollide()) {
            player.velocity.x = 0
            return // characters can't run past each other -- an easy alternative to rewriting the code for when they're on opposite sides
        }
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    // player jumping
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    // enemy movement
    enemy.velocity.x = 0
    if(keys.ArrowLeft.isPressed && enemy.lastKey === 'ArrowLeft') {
        if(charactersCollide()) {
            enemy.velocity.x = 0
            return // for some reason, if they're both running toward each other when they collide, enemy won't stop until you let go of the key
        } 
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if(keys.ArrowRight.isPressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }
    // enemy jumping
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if(enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }
    // collision checking
    // player
    if(collisionCheck({attacker: player, target: enemy}) && player.isAttacking && player.currentXFrame === 4) {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }
    if(player.isAttacking && player.currentXFrame === 4) {
        player.isAttacking = false
    }
    // enemy
    if(collisionCheck({attacker: enemy, target: player}) && enemy.isAttacking && enemy.currentXFrame === 2) {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }
    if(enemy.isAttacking && enemy.currentXFrame === 4) {
        enemy.isAttacking = false
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
