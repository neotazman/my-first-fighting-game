// the character sprites
class Sprite {
    constructor({position, imageSource}) { // apparantly if you put the parameters as an object, it doesn't matter what order you pass the arguments in
        this.position = position
        this.width = 90
        this.height = 50
        this.image = new Image()
        this.image.src = imageSource
    }
    draw () {
        canvasContext.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update () {
        this.draw() // if you call the draw method inside of the update method, you don't have to call both functions to animate
    }
}

class Background extends Sprite { // the position for the background will always be "x: 0, y: 0" so I extended the Sprite class to need fewer arguments
    constructor({backgroundImage}) { //
        super ({
            position: {
                x: 0,
                y: 0,
            },
            imageSource: backgroundImage,
        })
        this.width = canvasContext.canvas.width
        this.height = canvasContext.canvas.height
    }
}

// class MovingBackground extends Background {
//     constructor({backgroundImage}) {
//         super({backgroundImage})

//     }
// }

class Fighter {
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
            offset, // an object being passed directly into this.attackBox
            width: 60,
            height: 10,
        }
        this.color = color
        this.isAttacking
        this.health = 100 //DO NOT RAISE ABOVE 100 -- it's being parsed into a percentage for the css
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

