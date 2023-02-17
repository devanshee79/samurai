function rectCollision({retc1, rect2}){
    return(
    (retc1.attackBox.position.x + retc1.attackBox.width) >= rect2.attackBox.position.x
    && retc1.attackBox.position.x <= (rect2.attackBox.position.x + rect2.attackBox.width)
    && (retc1.attackBox.position.y + retc1.attackBox.height) >= rect2.attackBox.position.y           
    && retc1.attackBox.position.y <= (rect2.attackBox.position.y + rect2.attackBox.height)
    )
}

function clear(id){
    console.log("called")
    clearTimeout(id);
}

const audio = {
    battleSound: new Howl({
        src:'./sounds/battleSound.mp3',
        html5:true
    }),
    attack: new Howl({
        src:'./sounds/attack.mp3',
        html5:true
    }),
    death: new Howl({
        src:'./sounds/Death.mp3',
        html5:true
    }),
    success: new Howl({
        src:'./sounds/success.mp3',
        html5:true
    })
}

// //  function for time
// function sound(src) {
//     this.sound = document.createElement("audio");
//     this.sound.src = src;
//     this.sound.setAttribute("preload", "auto");
//     this.sound.setAttribute("controls", "none");
//     this.sound.style.display = "none";
//     document.body.appendChild(this.sound);
//     this.play = function(){
//       this.sound.play();
//     }
//     this.stop = function(){
//       this.sound.pause();
//     }
//     this.muted = muted
//   }

let timer = 60
let timerid;
// timer update logic
function updateTimer(){
    if(timer > 0){
    timer-=1;
    // document.querySelector('#timer').innerHTML;
    document.querySelector('#timer').innerHTML = timer;
    timerid = setTimeout(updateTimer, 1000);
    }

    // logic for winning 
    if(timer === 0 || player.health <= 0 || enemy.health <= 0){
        if(player.health == enemy.health){
            document.querySelector('#displayText').innerHTML = 'Tie';
            document.querySelector('#displayText').style.display = 'flex';
            clear(timerid);
        }else if(player.health > enemy.health){
            document.querySelector('#displayText').innerHTML = 'Player Won';
            document.querySelector('#displayText').style.display = 'flex';
            clear(timerid);
        }else if(player.health < enemy.health){
            document.querySelector('#displayText').innerHTML = 'Enemy Won';
            document.querySelector('#displayText').style.display = 'flex';
            clear(timerid);
        }    
    }
}