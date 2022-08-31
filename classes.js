
const groundHeight = 10
// the character sprites
class Sprite {
    constructor({position, imageSource, scale = 1, horizontalFrames = 1, verticalFrames = 1}) { // apparantly if you put the parameters as an object, it doesn't matter what order you pass the arguments in
        this.position = position
        this.width = 50
        this.height = 50
        this.image = new Image()
        this.image.src = imageSource
        this.scale = scale
        this.horizontalFrames = horizontalFrames
        this.verticalFrames = verticalFrames
        this.currentXFrame = 0
        this.currentYFrame = 0
        this.framesElapsed = 0
        // this.yFramesElapsed = 0
        this.frameHold = 5
        // this.yFrameHold = 0
    }
    draw () {
        canvasContext.drawImage(
            this.image, 
            this.currentXFrame * (this.image.width / this.horizontalFrames), 
            this.currentYFrame * (this.image.height / this.verticalFrames), 
            this.image.width / this.horizontalFrames, 
            this.image.height / this.verticalFrames, 
            this.position.x, 
            this.position.y, 
            this.width * this.scale, 
            this.height * this.scale
        )
    }
    update () {
        this.draw() // if you call the draw method inside of the update method, you don't have to call both functions to animate

        //the frame animation of the sprite
        this.framesElapsed++
        if(this.framesElapsed % this.frameHold === 0) {
            if(this.currentXFrame < this.horizontalFrames - 1) {
                this.currentXFrame++
            } else if(this.currentYFrame < this.verticalFrames - 1) {
                this.currentXFrame = 0
                this.currentYFrame++
            } else {
                this.currentXFrame = 0
                this.currentYFrame = 0
            }
        }
    }
}

class Background extends Sprite { // the position for the background will always be "x: 0, y: 0" and take up the full size of the page, so I extended the Sprite class to need fewer arguments
    constructor({backgroundImage}) { //
        super ({
            position: {
                x: 0,
                y: 0,
            },
            imageSource: backgroundImage,
        })
        this.width = canvasContext.canvas.width
        this.height = canvasContext.canvas.height - groundHeight
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

        if(this.position.y + this.height + this.velocity.y >= canvas.height - groundHeight) { // the characters can't fall below groundHeight
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

