// alert("script connected");
const canvas = document.getElementById("myCanva");
const ctx = canvas.getContext("2d");

const gravity = 0.2;
ctx.fillStyle = "black";
ctx.fillRect(0, 0, 1320, 580);
let start = true;


const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './image/background.png',
    scaleX:1.3,
    scaleY:1
    
})


const shop = new Sprite({
    position:{
        x:910,
        y:128
    },
    imageSrc: './image/shop.png',
    scaleX: 2.75,
    scaleY: 2.75,
    framesMax: 6
})

// Creating Player
const player = new Fighter({
    position : {
        x : 50,
        y : 0
    },
    velocity : {
        x : 0, 
        y : 10
    },
    color: "red", 
    imageSrc: './image/samuraiMack/Idle.png',
    scaleX: 3,
    scaleY: 3,
    framesMax: 8,
    offset:{
        x:200,
        y:320
    },
    sprites:{
        idle:{
            imageSrc: './image/samuraiMack/Idle.png',
            framesMax: 8
        },
        run:{
            imageSrc: './image/samuraiMack/Run.png',
            framesMax: 8           
        },
        jump:{
            imageSrc: './image/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: './image/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: './image/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit:{
            imageSrc: './image/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death:{
            imageSrc: './image/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox:{
        offset:{
            x:130,
            y:-90
        },
        width:190,
        height:50
    }
});
// Creating Enemy
const enemy = new Fighter({
    position : {
        x : 700,
        y : 200
    },
    velocity : {
        x : 0, 
        y : 10
    },
    color:"blue",
    imageSrc: './image/kenji/Idle.png',
    scaleX: 3,
    scaleY: 3,
    framesMax: 4,
    offset:{
        x:200,
        y:340
    },
    sprites:{
        idle:{
            imageSrc: './image/kenji/Idle.png',
            framesMax: 4
        },
        run:{
            imageSrc: './image/kenji/Run.png',
            framesMax: 8           
        },
        jump:{
            imageSrc: './image/kenji/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: './image/kenji/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: './image/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit:{
            imageSrc: './image/kenji/Take hit.png',
            framesMax: 3
        },
        death:{
            imageSrc: './image/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox:{
        offset:{
            x:-100,
            y:-90
        },
        width:190,
        height:50
    }
})

const keys = {
    a:{
        pressed: false
    },
    w:{
        pressed: false
    },
    s:{
        pressed: false
    },
    d:{
        pressed: false
    },
    ArrowUp:{
        pressed: false
    },
    ArrowDown:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
}


updateTimer();
// main function which updates evrything
function animate(){
    window.requestAnimationFrame(animate);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();  

    // PLAYING THE SOUND
    window.addEventListener('click',() => {
        if(start){
            console.log(start)
            audio.battleSound.play()
            start = false
        }
    })
    // changing the speeed of players according to keys pressed
    if(keys.a.pressed){
        player.switchSprite('run')
        console.log("run")
        player.velocity.x -= 0.1;
    }
    else if(keys.d.pressed){
        player.switchSprite('run')
        player.velocity.x += 0.1;
    }
    // there is no need for checking the down arrow 
    // as it will come down on the basis of gravity
    else if(keys.w.pressed){
        // player.switchSprite('jump')
        if(player.velocity.y < 40*gravity){
            player.velocity.y = 0;
        }
        player.velocity.y -= 60*gravity;
        keys.w.pressed = false;
    }
    else{
        player.switchSprite('idle')
    }


    // ENEMY
    if(keys.ArrowRight.pressed){
        enemy.switchSprite('run')
        enemy.velocity.x += 0.1;
    }
    else if(keys.ArrowLeft.pressed){
        enemy.switchSprite('run')
        enemy.velocity.x -= 0.1;   
    }else if(keys.ArrowUp.pressed){
        if(enemy.velocity.y < 40*gravity){
            enemy.velocity.y = 0;
        }
        enemy.velocity.y -= 60*gravity;
        keys.ArrowUp.pressed = false;
    }else{
        enemy.switchSprite('idle')
    }


    // PLAYER JUMP FALL
    if(player.velocity.y < 0){
        player.switchSprite('jump')
    }
    else if(player.velocity.y > 0){
        player.switchSprite('fall')
    }
    // ENEMY JUMP FALL
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }
    else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

       
    // logic for bringing the players down
    if(!keys.ArrowUp.pressed && enemy.position.y+150 <= canvas.height && enemy.position.y <= 0){
        enemy.velocity.y += 70*gravity;
        enemy.position.y += enemy.velocity.y;  
    }
    if(!keys.w.pressed && player.position.y+150 <= canvas.height && player.position.y <= 0){
        player.velocity.y += 70*gravity;
        player.position.y += player.velocity.y;  
    }

    // PLAYER SUCCESSFUL HITING ENEMY
    if(rectCollision({
        retc1: player,
        rect2: enemy
    })&& (player.isAttacking)
    && player.framesCurrent === 4
        ){
            enemy.switchSprite('takeHit')
            player.isAttacking = false
            enemy.health -= 20
            document.querySelector('#sudoEnemyHealth').style.width = enemy.health+'%'
            console.log("There is an attack by player");
    }
    //  if player misses
    if(player.isAttacking
    && player.framesCurrent === 5){
        player.isAttacking = false

    }
    if(rectCollision({
        retc1: enemy,
        rect2: player
    })
        && (enemy.isAttacking)
        && enemy.framesCurrent === 2)
        {
            player.switchSprite('takeHit')
            player.health -= 20
            document.querySelector('#sudoplayerHealth').style.width = player.health+'%'
            enemy.isAttacking = false
            console.log("There is an attack");
        }
    //  if player misses
    if(enemy.isAttacking
        && enemy.framesCurrent === 3){
            enemy.isAttacking = false
    
        }
        console.log(player.health)

    //  DEATH ANIMATION FOR PLAYER
    if(player.health <= 0){
        audio.battleSound.stop()
        audio.death.play()
        player.switchSprite('death')
    }
    //  DEATH ANIMATION FOR ENEMY
    if(enemy.health <= 0){
        audio.battleSound.stop()
        audio.success.play()
        enemy.switchSprite('death')
    } 

}

window.addEventListener('keydown', (event) =>{
    if(!player.dead){
        switch(event.key){
            case 'w' :
            keys.w.pressed = true;
            break;
    
            case 's' :
            keys.s.pressed = true;
            break;
    
            case 'd' :
            keys.d.pressed = true;
            break;
    
            case 'a' :
            keys.a.pressed= true;
            break;
            
            case ' ' :
            audio.attack.play()
            player.attack();
            player.switchSprite('attack1')
            break; 
    
    }
    if(!enemy.dead){
        switch(event.key){
            case 'ArrowUp' :
            keys.ArrowUp.pressed = true;
            break;

            case 'ArrowDown' :
            keys.ArrowDown.pressed = true;
            break;

            case 'ArrowRight' :
            keys.ArrowRight.pressed = true;
            break;

            case 'p' :
            audio.attack.play()
            enemy.attack();
            enemy.switchSprite('attack1')
            break; 

            case 'ArrowLeft' :
            keys.ArrowLeft.pressed= true;
            break;
            }
    }
        
        
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key){
        
        case 'w' :
        keys.w.pressed = false;
        player.velocity.y = 0;
        break;

        case 's' :
        keys.s.pressed = false;
        player.velocity.y = 0;
        break;

        case 'd' :
        keys.d.pressed = false;
        player.velocity.x = 0;
        break;

        case 'a' :
        keys.a.pressed= false;
        player.velocity.x = 0;
        break;

        case 'ArrowUp' :
        keys.ArrowUp.pressed = false;
        enemy.velocity.y = 0;
        break;

        case 'ArrowDown' :
        keys.ArrowDown.pressed = false;        
        enemy.velocity.y = 0;
        break;

        case 'ArrowRight' :
        keys.ArrowRight.pressed = false;
        enemy.velocity.x = 0;
        break;

        case 'ArrowLeft' :
        keys.ArrowLeft.pressed = false;
        enemy.velocity.x = 0;
        break;
    }
})

player.draw();
enemy.draw();
animate();