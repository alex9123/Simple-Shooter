// Player game
let cnv = document.getElementById("myCanvas");
let ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 800;

// Global Variables
let playerX = 100;
let playerY = 150;
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

let start = false 
let end = false

function setUp() { // Start screen
    ctx.fillText('Press Space to Start', 10, 50);
}

function endScreen() { // end screen, game over
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.fillText('Game Over, Press R to Restart', 10, 50);
    end = true
}

let spawn

function update() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    move();

    attackLoop();

    drawEnemy();

    if (start) {
        requestAnimationFrame(update);
    } else {
        clearInterval(spawn);
        endScreen();
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
        ctx.arc(bullets[i].x, bullets[i].y, bullets[i].size, 0, Math.PI * 2, true);
        bullets[i].x += Math.cos(bullets[i].direction) * bullets[i].Bspeed
        bullets[i].y += Math.sin(bullets[i].direction) * bullets[i].Bspeed
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.fill();


        for (ii = 0; ii < enemies.length; ii++) {
            if (CollisionDetect(bullets[i].x, bullets[i].y, bullets[i].size, enemies[ii].x, enemies[ii].y, enemies[ii].size)) {
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
        if (CollisionDetect(playerX, playerY, playerRadius, enemies[i].x, enemies[i].y, enemies[i].size)) {
            start = false;
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
    if (event.code == "Space") {
        if (!start) {
            requestAnimationFrame(update);
            start = true
            spawn = setInterval(SpawnEnemy, 2000); // spawn enemies
        }
    }
    if (event.code == "KeyR") {
        if (end) {
            start = true
            requestAnimationFrame(update);
            end = false
        }
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
        Bspeed: 10,
        size: 10
    }

    bullets.push(object)

}


function SpawnEnemy() {
    if (start) {
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
}

function CollisionDetect(circleX, circleY, radius, squareX, squareY, squareSize) { // suqare circle only
    let closestPointX; // Closest point on square from circle
    let closestPointY;
    let Pythag = false; // if distance need pythagorean therom (if distance is diagonal)

    if (circleX <= squareX) { // If circle to left of square
        closestPointX = squareX;
        if (circleY <= squareY) { // If circle is left and above square
            closestPointY = squareY;
            Pythag = true;
        } else if (circleY >= squareY + squareSize) { // if circle is below square
            closestPointY = squareY + squareSize;
            Pythag = true;
        } else { // if circle is aligned with square
            closestPointY =  squareY + (circleY - squareY)
        }
    } else if (circleX >= squareX + squareSize) { // If circle is to right of square
        closestPointX = squareX + squareSize;
        if (circleY <= squareY) { // If circle is left and above square
            closestPointY = squareY;
            Pythag = true;
        } else if (circleY >= squareY + squareSize) { // if circle is below square
            closestPointY = squareY + squareSize;
            Pythag = true;
        } else { // if circle is aligned with square
            closestPointY =  squareY + (circleY - squareY)
        }
    } else { // if circle is above or below circle 
        closestPointX = squareX + (circleX - squareX)
        if (circleY <= squareY) { // if above
            closestPointY = squareY
        } else { // if below
            closestPointY = squareY + squareSize
        }
    }
   
    let distX = Math.abs(closestPointX - circleX);
    let distY = Math.abs(closestPointY - circleY);

    if (Pythag) {
        if (Math.sqrt((distX * distX) + (distY * distY)) <= radius) {
            return true;
        } else {
            return false;
        }
    } else {
        if (distX < radius &&
            distY < radius
            ) {
            return true;
        } else {
            return false;
        }
    }
}

setUp()