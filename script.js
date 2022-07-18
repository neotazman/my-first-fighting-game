// TUTORIAL FOR THIS PROJECT
// https://www.youtube.com/watch?v=vyqbNFMDRGQ&t=99s

// the canvas element
const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.1

// the character sprites
class Sprite {
    constructor({position, velocity}) { // apparantly if you put the parameters as an object, it doesn't matter what order you pass in the arguments
        this.position = position
        this.velocity = velocity
        this.width = 20
        this.height = 50
        this.lastKey
    }
    draw () {
        canvasContext.fillStyle = 'crimson'
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update () {
        this.draw() // if you call the draw method inside of the update method, you don't have to call both functions to animate
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }
}

// the player
const player = new Sprite({
    position: {x: 0, y: 0},
    velocity: {x: 0, y: 1}
})

// the enemy
const enemy = new Sprite({
    position: {x: 40, y: 80},
    velocity: {x: 0, y: 1}
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
    w: { // jump
        isPressed: false,
    },

    // enemy
    ArrowRight: { // right
        isPressed: false,
    },
    ArrowLeft: { // left
        isPressed: false,
    },
    ArrowUp: { // jump
        isPressed: false,
    },
}

// the animation
function animate () {
    window.requestAnimationFrame(animate)
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    if(keys.a.isPressed && player.lastKey === 'a') {
        player.velocity.x = -1
    } else if(keys.d.isPressed && player.lastKey === 'd') {
        player.velocity.x = 1
    }
    enemy.velocity.x = 0
    if(keys.ArrowLeft.isPressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -1
    } else if(keys.ArrowRight.isPressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 1
    }
}

animate()

// control listeners
window.addEventListener('keydown', (e) => {
    console.log(e.key)
    switch(e.key) {
        case 'd': keys.d.isPressed = true; player.lastKey = e.key; break // move right
        case 'a': keys.a.isPressed = true; player.lastKey = e.key; break // move left
        case 'w': player.velocity.y = -5; break // jump
        case 'ArrowRight': keys.ArrowRight.isPressed = true; enemy.lastKey = 'ArrowRight'; break // move right
        case 'ArrowLeft': keys.ArrowLeft.isPressed = true; enemy.lastKey = 'ArrowLeft'; break // move left
        case 'ArrowUp': enemy.velocity.y = -5; break // jump
    }
}) 

window.addEventListener('keyup', (e) => {
    console.log(e.key)
    switch(e.key) {
        case 'd': keys.d.isPressed = false; break 
        case 'a': keys.a.isPressed = false; break
        case 'w': keys.w.isPressed = false; break
        case 'ArrowRight': keys.ArrowRight.isPressed = false; break 
        case 'ArrowLeft': keys.ArrowLeft.isPressed = false; break
        case 'ArrowUp': keys.ArrowUp.isPressed = false; break
    }
})  

console.log(player)