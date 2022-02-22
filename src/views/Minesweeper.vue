<template>
    <div class="text-center">
        Mine count: 40 <br>
        Flags placed: {{flagsPositioned}}
        <canvas width="600" height="600" class="mx-auto" @click="leftClick" @contextmenu="rightClick"></canvas>
        <Button @click="initialize">Reload</Button>
        <br>
        <Button @click="toggleInstructions">Instructions</Button>
        <br>
        <div v-if="instructions" class="fixed bg-gray-600 top-0 left-0 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div class="bg-white dark:bg-slate-900 py-1 px-2 rounded">
                <p class="py-2">
                    Welcome to my interpretation of the classic minesweeper game.
                </p>
                <p class="py-2">
                    The number printed on a cell is the number of mines adjacent to that cell.
                </p>
                <p class="py-2">
                    Use left click to reveal a mine.
                </p>
                <p class="py-2">
                    Use right click to flag a cell.
                </p>
                <p class="py-2">
                    You win when every mine is flagged, and no mine-less cell is flagged.
                </p>
                <Button @click="toggleInstructions">Return to game</Button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Button from '../components/Button.vue'

const textColour = '#BD467C'
const backgroundColour = '#42B983'

export default defineComponent({
    data(){
        const dataVal: {
            context:CanvasRenderingContext2D|null,
            mines:Array<Array<number>>
            game:Array<Array<number>>
            flagsPositioned:number
            instructions:boolean
        } = {
            context:null,
            mines:[],
            game:[],
            flagsPositioned:0,
            instructions:false
        }
        return dataVal
    },
    mounted(){
        this.context = document.getElementsByTagName('canvas')[0].getContext('2d')
        if(this.context){
            this.initialize()
        }
    },
    methods:{
        initialize(){
            if(!this.context){
                return
            }
            this.context.rect(0, 0, 600, 600)
            this.context.fillStyle = backgroundColour 
            this.context.fill()
            this.context.strokeStyle = 'white'
            for(let i = 0; i <= 600; i += 40){
                this.context.moveTo(0, i)
                this.context.lineTo(600, i)
                this.context.stroke()
                this.context.moveTo(i, 0)
                this.context.lineTo(i, 600)
                this.context.stroke()
            }

            //Fill the game arrays
            this.game = []
            this.mines = []
            this.flagsPositioned = 0
            for(let i = 0; i < 15; i++){
                let line:Array<number> = []
                for(let j = 0; j < 15; j++){
                    line.push(0)
                }
                this.mines.push(line)
                this.game.push(line.map(x => x))
            }

            //Generate mines
            let mineCount = 0;
            while(mineCount < 40){
                let x = Math.floor(Math.random() * 15)
                let y = Math.floor(Math.random() * 15)
                if(this.mines[x][y] == 0){
                    mineCount++
                    this.mines[x][y] = -1
                }
            }

            //Calculate adjacent mines
            for(let i = 0; i < 15; i++){
                for(let j = 0; j < 15; j++){
                    this.mines[i][j] = this.checkPosition(i, j)
                }
            }
        },
        checkPosition(x:number, y:number){
            if(this.mines[x][y] == -1){
                return -1
            }
            let sum = 0;
            for(let i = Math.max(x - 1, 0); i < Math.min(15, x + 2); i++){
                for(let j = Math.max(y - 1, 0); j < Math.min(15, y + 2); j++){
                    if(this.mines[i][j] == -1){
                        sum++
                    }
                }
            }
            return sum
        },
        printPos(x:number, y:number){
            if(!this.context){
                return
            }
            this.context.font = '40px monospace'
            this.context.fillStyle = textColour 
            this.context.textAlign = 'center'
            this.context.fillText('' + this.mines[x][y], x * 40 + 20, y * 40 + 33)
        },
        eraseCell(x:number, y: number){
            if(!this.context){
                return
            }
            this.context.fillStyle = backgroundColour
            this.context.fillRect(x * 40, y * 40 , 40, 40)
            this.context.strokeStyle = 'white'
            this.context.rect(x * 40, y * 40, 40, 40)
            this.context.stroke()
        },
        asteriskAt(x:number, y:number){
            if(!this.context){
                return
            }
            this.context.font = '40px monospace'
            this.context.fillStyle = textColour 
            this.context.textAlign = 'center'
            this.context.fillText('*', x * 40 + 20, y * 40 + 33)

        },
        leftClick(event:MouseEvent){
            const x = Math.floor(event.offsetX / 40)
            const y = Math.floor(event.offsetY / 40)
            if(this.game[x][y] != -1){
                if(this.mines[x][y] == -1){
                    alert('You lost :(')
                }else if(this.mines[x][y] == 0){
                    this.bfs([x, y])
                }else{
                    this.printPos(x, y)
                    this.game[x][y] = 1
                }
            }
        },
        rightClick(event:MouseEvent){
            event.preventDefault()
            const x = Math.floor(event.offsetX / 40)
            const y = Math.floor(event.offsetY / 40)
            if(this.game[x][y] == 0){
                this.game[x][y] = -1
                this.asteriskAt(x, y)
                this.flagsPositioned++

            }else if(this.game[x][y] == -1){
                this.game[x][y] = 0
                this.eraseCell(x, y)
                this.flagsPositioned--
            }

            if(this.flagsPositioned == 40){
                if(this.check()){
                    alert('You won :D')
                }
            }
        },
        check(){
            for(let i = 0; i < 15; i++){
                for(let j = 0; j < 15; j++){
                    if(this.mines[i][j] == -1 && this.mines[i][j] != this.game[i][j]){
                        return false
                    }
                }
            }
            return true
        },
        bfs(queue:Array<number>){
            const x = queue.shift()
            const y = queue.shift()
            if(typeof(x) != 'number' || typeof(y) != 'number'){
                return
            }

            for(let i = Math.max(x - 1, 0); i < Math.min(15, x + 2); i++){
                for(let j = Math.max(y - 1, 0); j < Math.min(15, y + 2); j++){
                    console.log(i, j)
                    if(this.game[i][j] == 0){
                        this.printPos(i, j)
                        this.game[i][j] = 1
                        if(this.mines[i][j] == 0){
                            queue.push(i)
                            queue.push(j)
                        }
                    }
                }
            }
            this.bfs(queue)
        },
        toggleInstructions(){
            this.instructions = !this.instructions
        }
    },
    components:{
        Button
    }
})
</script>