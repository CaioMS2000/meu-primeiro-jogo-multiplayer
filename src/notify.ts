import { Player } from "./game.js"

const pointAudio = new Audio('/public/pick.mp3')
const pointStreakAudio = new Audio('/public/pick1.mp3')

export default function createNotifyer(){
    function notify(_player: Player){
        const [arr,] = Object.entries(_player)
        const [, player] = arr

        if(player.points % 10 === 0){
            pointStreakAudio.play()
        }
        else{
            pointAudio.play()
        }
    }

    return {notify}
}