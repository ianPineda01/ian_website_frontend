<template>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component'

class snekNode{
    next:snekNode|null = null
    xPos:number
    yPos:number
    /**
     * Constructor for snekNode
     * @param x x position for new node
     * @param y y position for new node
     */
    constructor(x:number, y:number){
        this.xPos = x
        this.yPos = y
    }
}

/**
 * @returns 30x30 array filled with 0
 */
const createArr = ():number[][] => {
    let arr:number[][] = new Array(30);
    let i = 0
    while(i < 30){
        arr[i] = new Array(30);
        let j = 0
        while(j < 30){
            arr[i][j] = 0
            j++
        }
        i++
    }
    return arr
}

/**
 * Void function that paints a square to the canvas
 * @param context Rendering context that will be used to draw
 * @param colour Colour of the square (0 = black, 1 = green, 2 = red)
 * @param x x Position in the grid
 * @param y y position in the grid
 */
const square = (arr:number[][]) => (context:CanvasRenderingContext2D) => (colour:number) => (x:number) => (y:number):void => {
    if(colour === 0){
        context.fillStyle = "#000000"
    }else if(colour === 1){
        context.fillStyle = "#00FF00"
    }else if(colour === 2){
        context.fillStyle = "#FF0000"
    }
    arr[y][x] = colour
    context.fillRect(x * 20 , y * 20, 20, 20)
    context.stroke()
}

const drawWholeSnek = (arr:number[][]) => (context:CanvasRenderingContext2D) => (input:snekNode):void =>{
    square(arr)(context)(1)(input.xPos)(input.yPos)
    if(input.next){
        drawWholeSnek(arr)(context)(input.next)
    }
}

const newApple = (arr:number[][]) => (context:CanvasRenderingContext2D):void => {
    let x
    let y
    do{
        x = Math.floor(Math.random() * 30)
        y = Math.floor(Math.random() * 30)
    }while(arr[y][x] !== 0)
    square(arr)(context)(2)(x)(y)
    console.log(x)
    console.log(y)
}

const iterate = (arr:number[][]) => (context:CanvasRenderingContext2D) => (node:snekNode) => (x:number) => (y:number):void => {
    if(node.next){
        const tempX = node.xPos
        const tempY = node.yPos
        node.xPos = x
        node.yPos = y
        iterate(arr)(context)(node.next)(tempX)(tempY)
    }else{
        square(arr)(context)(0)(node.xPos)(node.yPos)
        node.xPos = x
        node.yPos = y
    }
}
const move = (arr:number[][]) => (context:CanvasRenderingContext2D) => (node:snekNode) => (x:number) => (y:number):void =>{
    if(0 <= x && x < 30 && 0 <= y && y < 30){
        if(!arr[y][x]){
            square(arr)(context)(1)(x)(y)
            iterate(arr)(context)(node)(x)(y)
        }else if(arr[y][x] === 2){
            square(arr)(context)(1)(x)(y)
            const temp = snek.next
            snek.next = new snekNode(snek.xPos, snek.yPos)
            snek.next.next = temp
            snek.xPos = x
            snek.yPos = y
            newApple(arr)(context)
        }else if(arr[y][x] === 1){
            clearInterval(intervalID)
            alert("Ouchie, you bit yourself and lost ):")
        }
    }else{
        clearInterval(intervalID)
        alert("You lost :(")
    }
}

//Canvas starting conditions
const canvas = <HTMLCanvasElement> document.createElement("canvas")
document.body.innerHTML = ""
document.body.appendChild(canvas)
const context = <CanvasRenderingContext2D> canvas.getContext("2d")
canvas.width = 600
canvas.height = 600
context.fillRect(0,0,600,600)
context.stroke()

const up = (arr:number[][]) => (node:snekNode):void => move(arr)(context)(node)(node.xPos)(node.yPos - 1)
const down = (arr:number[][]) => (node:snekNode):void => move(arr)(context)(node)(node.xPos)(node.yPos + 1)
const left = (arr:number[][]) => (node:snekNode):void => move(arr)(context)(node)(node.xPos - 1)(node.yPos)
const right = (arr:number[][]) => (node:snekNode):void => move(arr)(context)(node)(node.xPos + 1)(node.yPos)

//draw starnting snake and apple
const arr = createArr()
const snek = new snekNode(7, 15)
snek.next = new snekNode(6, 15)
snek.next.next = new snekNode(5, 15)
snek.next.next.next = new snekNode(4, 15)
const tail = snek.next.next.next
drawWholeSnek(arr)(context)(snek)
newApple(arr)(context)

const dir = [right]

const intervalID = setInterval(() => {
    dir[0](arr)(snek)
    if(dir.length > 1){
        dir.shift()
    }
}, 100)

document.addEventListener("keypress", (e) => {
    if(e.code === "KeyW"){
        if(dir[0] !== down){
            dir.push(up)
        }
    }else if(e.code === "KeyS"){
        if(dir[0] !== up){
            dir.push(down)
        }
    }else if(e.code === "KeyA"){
        if(dir[0] !== right){
            dir.push(left)
        }
    }else if(e.code === "KeyD"){
        if(dir[0] !== left){
            dir.push(right)
        }
    }e
})

@Options({
})

export default class Home extends Vue {}
</script>
