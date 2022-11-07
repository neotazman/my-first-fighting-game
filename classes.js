
const groundHeight = 10
// the character sprites
class Sprite {
    constructor({position, imageSource, scale = 1, horizontalFrames = 1, verticalFrames = 1, offset = {x: 0, y: 0}}) { // apparantly if you put the parameters as an object, it doesn't matter what order you pass the arguments in
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
        this.frameHold = 5
        this.offset = offset
    }
    draw () {
        canvasContext.drawImage( 
            this.image, 
            this.currentXFrame * (this.image.width / this.horizontalFrames), 
            this.currentYFrame * (this.image.height / this.verticalFrames), 
            this.image.width / this.horizontalFrames, 
            this.image.height / this.verticalFrames, 
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            this.width * this.scale, 
            this.height * this.scale
        )
    }
    animateFrames () { // the frame animation of the sprite
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
    update () {
        this.draw() // if you call the draw method inside of the update method, you don't have to call both functions to animate
        this.animateFrames()
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

class Bomb extends Sprite { // for multiple bombs throughout the background
    constructor({position, scale}) {
        super({
            position,
            // the sprite and animation will always be the same
            imageSource: './Free Bomb Sprite/BOM.BUM.png',
            scale,
            verticalFrames: 5,
            horizontalFrames: 5,
        })
    }
}

class Fighter extends Sprite { // the characters that are fighting
    constructor({position, velocity, color = 'green', imageSource, scale = 1, horizontalFrames = 1, verticalFrames = 1, offset = {x: 0, y: 0}, sprites, attackBox = {offset: {}, width: undefined, height: undefined}}) { // apparantly if you put the parameters as an object, it doesn't matter what order you pass the arguments in as long as you say what arguments they are
        super({
            position,
            imageSource,
            scale,
            horizontalFrames,
            verticalFrames,
            offset,
        })
        this.velocity = velocity
        this.width = 50
        this.height = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset, // an object being passed directly into this.attackBox
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color
        this.isAttacking
        this.health = 100 //DO NOT RAISE ABOVE 100 -- it's being parsed into a percentage for the css
        this.sprites = sprites

        for(let sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSource
        }
    }
    update () {
        this.draw() // if you call the draw method inside of the update method, you don't have to call both functions to animate
        this.animateFrames()
        // updates the shallow copy of this
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        canvasContext.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        // change the position based on the velocity
        this.position.x += this.velocity.x 
        this.position.y += this.velocity.y  

        // gravity function
        if(this.position.y + this.height + this.velocity.y >= canvas.height - groundHeight) { // the characters can't fall below groundHeight
            this.velocity.y = 0
            // this.position.y = canvas.height - groundHeight -- the tutorial didn't set a ground height, so he included this line to fix a bug that i'm not getting
        } else {
            this.velocity.y += gravity
        }
    }
    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
        // setTimeout(() => {
        //     this.isAttacking = false
        // }, 100)
    }
    switchSprite(sprite) {
        if(this.image === this.sprites.attack1.image && this.currentXFrame < this.sprites.attack1.horizontalFrames - 1) return
        switch(sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.horizontalFrames = this.sprites.idle.horizontalFrames
                    this.currentXFrame = 0
                    this.currentYFrame = 0
                }
                break
            case 'run': 
                if(this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.horizontalFrames = this.sprites.run.horizontalFrames
                    this.currentXFrame = 0
                    this.currentYFrame = 0
                }
                break
            case 'jump': 
                if(this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.horizontalFrames = this.sprites.jump.horizontalFrames
                    this.currentXFrame = 0
                    this.currentYFrame = 0
                }
                break
            case 'fall': 
            if(this.image !== this.sprites.fall.image) {
                this.image = this.sprites.fall.image
                this.horizontalFrames = this.sprites.fall.horizontalFrames
                this.currentXFrame = 0
                this.currentYFrame = 0
            }
                break
            case 'attack1': 
            if(this.image !== this.sprites.attack1.image) {
                this.image = this.sprites.attack1.image
                this.horizontalFrames = this.sprites.attack1.horizontalFrames
                this.currentXFrame = 0
                this.currentYFrame = 0
            }
                break
        }
    }
}

