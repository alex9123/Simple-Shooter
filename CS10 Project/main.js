// Player game
let cnv = document.getElementById("myCanvas");
let ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 800;

// Global Variables
let playerX = 100;
let playerY = 150;
let playerSize = 80;
let playerRadius = 20;
let playerColor = "blue"

let moveLeft = false
let moveRight = false
let moveUp = false
let moveDown = false
let speed = 2

let bullets = []
let mouseX, mouseY;

let spawned = false
let enemies = []
let healthColor = ['red', 'yellow', 'orange', 'green']

let caught = false

let CurrentAnimation

CurrentAnimation = requestAnimationFrame(update);

function update() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    move();

    attackLoop();

    drawEnemy();

    if (!caught) {
        CurrentAnimation = requestAnimationFrame(update);
    }
}



function move() {
    if (playerY > 0) {
        if (moveUp) {
            playerY -= speed;
        }
    }
    
    if (playerX > 0) {
        if (moveLeft) {
            playerX -= speed;
        }
    }

    if (playerY < cnv.height) {
        if (moveDown) {
            playerY += speed;
        }
    }

    if (playerX < cnv.width) {
        if (moveRight) {
            playerX += speed;
        }
    }


    let Player = new Path2D()
    ctx.fillStyle = "blue";
    Player.arc(playerX, playerY, playerRadius, 0, Math.PI * 2, true);
    ctx.fill(Player);
    
}


function attackLoop() {

    for (i = 0; i < bullets.length; i++) {
        

        ctx.beginPath();
        ctx.arc(bullets[i].x, bullets[i].y, 10, 0, Math.PI * 2, true);
        bullets[i].x += Math.cos(bullets[i].direction) * bullets[i].Bspeed
        bullets[i].y += Math.sin(bullets[i].direction) * bullets[i].Bspeed
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.fill();


        for (ii = 0; ii < enemies.length; ii++) {
            let distX = Math.abs(bullets[i].x - enemies[ii].x-50/2)
            let distY = Math.abs(bullets[i].y - enemies[ii].y-50/2)
            if (distX <= 25 &&
                distY <= 25) 
                {
                bullets.splice(i, 1)
                i--
                if (enemies[ii].health <= 0) {
                    enemies.splice(ii, 1);
                    ii--;
                    
                } else {
                    enemies[ii].health -= 1
                }
                
            }

        }
    }
}


function drawEnemy() {

    for (i = 0; i < enemies.length; i++) {
        ctx.fillStyle = healthColor[enemies[i].health];
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].size, enemies[i].size);
        let direction = Math.atan2(playerY - enemies[i].y, enemies[i].x - playerX);

        enemies[i].x += Math.cos(direction) * -enemies[i].Bspeed
        enemies[i].y += Math.sin(direction) * enemies[i].Bspeed

        // Collision
        let distX = Math.abs(playerX - (enemies[i].x+enemies[i].size/2));
        let distY = Math.abs(playerY - (enemies[i].y+enemies[i].size/2));

        if (distX <= enemies[i].size &&
            distY <= enemies[i].size
            ) {
            caught = true;
            console.log(distX, distY, playerRadius)
        }
        
    }

}

// Event Functions
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("click", clickHandler)

function keydownHandler(event) {
    if (event.code == "KeyW") {
        moveUp = true;
    }
    if (event.code == "KeyS") {
        moveDown = true;
    }
    if (event.code == "KeyA") {
        moveLeft = true;
    }
    if (event.code == "KeyD") {
        moveRight = true;
    }
    if (event.code == "ShiftLeft") {
        speed = 5;
    }
}

function keyupHandler(event) {
    if (event.code == "KeyW") {
        moveUp = false;
    }
    if (event.code == "KeyS") {
        moveDown = false;
    }
    if (event.code == "KeyA") {
        moveLeft = false;
    }
    if (event.code == "KeyD") {
        moveRight = false;
    }
    if (event.code == "ShiftLeft") {
        speed = 2;
    }
}

function clickHandler(event) {
    let cnvRect = cnv.getBoundingClientRect();
    mouseX = event.x - cnvRect.x;
    mouseY = event.y - cnvRect.y;

    let object = {
        x: playerX,
        y: playerY,
        mX: mouseX,
        mY: mouseY,
        direction: Math.atan2(mouseY - playerY, mouseX - playerX),
        Bspeed: 10
    }

    bullets.push(object)

}

// Spawn Enemy every 2 seconds
let t = setInterval(SpawnEnemy, 2000); 

function SpawnEnemy() {
    let object = {
        x: 450,
        y: 0,
        size: 50,
        Bspeed: 1,
        health: 3
    }

    enemies.push(object)
    spawned = true
}