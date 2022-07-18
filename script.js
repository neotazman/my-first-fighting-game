// the canvas element
const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
    constructor(position) {
        this.position = position
    }
    draw () {
        canvasContext.fillStyle = 'crimson'
        canvasContext.fillRect(this.position.x, this.position.y, 30, 50)
    }
}

const player = new Sprite({x: 0, y: 0})

player.draw()

console.log(player)