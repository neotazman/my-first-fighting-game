// TUTORIAL FOR THIS PROJECT
// https://www.youtube.com/watch?v=vyqbNFMDRGQ&t=99s

// the canvas element
const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const timerElement = document.getElementById('timer');
let time = 60
let countDown = setInterval(() => {time-= 1; console.log(time)}, 1000)

const gravity = 0.5

// the character sprites
class Sprite {
    constructor({position, velocity, color = 'green', offset}) { // apparantly if you put the parameters as an object, it doesn't matter what order you pass the arguments in
        this.position = position
        this.velocity = velocity
        this.width = 20
        this.height = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset, // a object being passed direct into this.attackBox
            width: 60,
            height: 10,
        }
        this.color = color
        this.isAttacking
    }
    draw () {
        canvasContext.fillStyle = this.color
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attack box
        if(this.isAttacking) { // will only show attack boxes while attacking
            canvasContext.fillStyle = 'goldenrod'
            canvasContext.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)            
        }

    }
    update () {
        this.draw() // if you call the draw method inside of the update method, you don't have to call both functions to animate
        // updates the shallow copy of this
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        // change the position based on the velocity
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y  

        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }
    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}

// the player
const player = new Sprite({
    position: {x: 0, y: 0},
    velocity: {x: 0, y: 1},
    color: 'crimson',
    offset: {x: 0, y: 0}
})

// the enemy
const enemy = new Sprite({
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
    // w: { // jump
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

// the animation
function animate () {
    window.requestAnimationFrame(animate)
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    if(time < 0) {
        clearInterval(countDown)
    } else {
        timerElement.innerText = JSON.stringify(time)
    }
    

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
        console.log('hit')
        document.querySelector('#enemyHealth').style.width = '20%'
    }
    if(collisionCheck({attacker: enemy, target: player}) && enemy.isAttacking) {
        enemy.isAttacking = false
        console.log('enemy hit')
    }
}







animate()

// control listeners
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        // player
        case 'd': keys.d.isPressed = true; player.lastKey = e.key; break // move right
        case 'a': keys.a.isPressed = true; player.lastKey = e.key; break // move left
        case 'w': player.velocity.y = -10; break // jump
        case ' ': player.attack(); break // attack
        // enemy
        case 'ArrowRight': keys.ArrowRight.isPressed = true; enemy.lastKey = 'ArrowRight'; break // move right
        case 'ArrowLeft': keys.ArrowLeft.isPressed = true; enemy.lastKey = 'ArrowLeft'; break // move left
        case 'ArrowUp': enemy.velocity.y = -10; break // jump
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