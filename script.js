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
    }
    draw () {
        canvasContext.fillStyle = 'crimson'
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    update () {
        this.draw() // if you call the draw method inside of the update method, you don't have to call both functions to animate
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
    velocity: {x: 0, y: 2}
})

// the enemy
const enemy = new Sprite({
    position: {x: 40, y: 80},
    velocity: {x: 0, y: 1}
})

// the animation
function animate () {
    window.requestAnimationFrame(animate)
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
}

animate()

console.log(player)