const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');


//set canvas width and height to fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//centered x, y coordinates
const x0 = canvas.width / 2;
const y0 = canvas.height / 2;

//score
const scoreDisplay = document.querySelector('.score');
const finalScoreDisplay = document.querySelector('#final-score');
//start game btn
const startGameBtn = document.querySelector('#start-game');
const modal = document.querySelector('#modal');

// shoot SFX
const shootSfx = document.querySelector('#shootSfx');

//on-hit audio
const onHitAudio = document.querySelector('#hitmarker');
//background music
const bgm = document.querySelector('#bgm');
//player object
let player = new Player(x0, y0, 15, 'white');

let projectiles = []; //projectile objects
let enemies = [];  //array to store enemy objects
let particles = [];  //array to store particles objects
let spawnEnemiesInterval;

let gameOver = true;

function init(){
    player = new Player(x0, y0, 15, 'white');
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    gameOver = false;
}
function spawnEnemies(){

    const radius = Math.random() * (30 - 5) + 5; //radius between 5 and 30
    let x;
    let y;
    if(Math.random() < 0.5){
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        y = Math.random() * canvas.height;
    }else{
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    let color  = `hsl(${Math.random() * 360}, 50%, 50%)`
    const angle = Math.atan2(y0 - y, x0 - x);
    const velocity = {
    x: Math.cos(angle) * 1.2,
    y: Math.sin(angle) * 1.2,
    }
    //create new enemy every interval interation
    enemies.push(new Enemy(x,y,radius,color,velocity))
    // console.log(enemies);
    // console.log(projectiles);
}

//infinite loop
let animationId;
let score = 0;
function animate(){
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(0,0, canvas.width, canvas.height); //clear previous frame objects (comment this out to see why)
    player.draw(); //re-initialize player object

    particles.forEach((particle, index) => {
        if(particle.alpha <= 0){
            particles.splice(index, 1)
        }else{
            particle.update();
        }
    });
    projectiles.forEach((projectile, index) => {
        projectile.update();

        //remove from edges of screen
        if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0|| projectile.y - projectile.radius > canvas.height){
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.update();

        //remove from edges of screen
        if(enemy.x + enemy.radius < 0 || enemy.x - enemy.radius > canvas.width || enemy.y + enemy.radius < 0|| enemy.y - enemy.radius > canvas.height){
            setTimeout(() => {
                // enemies.splice(enemy, 1);
                delete enemies[enemies.indexOf(enemy)];
            }, 0);
        }

        //if enemy hits player, stop the game at current frame
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if(dist - enemy.radius - player.radius < 1){
            //GAME OVER
            cancelAnimationFrame(animationId);
            modal.style.display = 'block';
            finalScoreDisplay.innerHTML = score;
            scoreDisplay.style.display = 'none';
            clearInterval(spawnEnemiesInterval); //prevents more enemies from spawning while modal is open
            gameOver = true;
            bgm.pause();
        }

        //PROJECTILES LOOP
        projectiles.forEach((projectile) => {     
            //check for collission
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if(dist - enemy.radius - projectile.radius < 1){
                projectileCollission(projectile, enemy)
            }

        });

        
        
    });
    //sort enemies array, filter out enemies that are killed or no longer rendered
    enemies = enemies.filter(function(element){
        return element != null;
    })
    projectiles = projectiles.filter(function(element){
        return element != null;
    })
}

    //create projectiles on mouse click
    window.addEventListener('mousedown', function(event){
        if(!gameOver){
            fireProjectile(event.clientY, event.clientX);
        }
    });

startGameBtn.addEventListener('click', function(){
    init();
    animate();
    spawnEnemiesInterval = setInterval(spawnEnemies, 800);
    modal.style.display = 'none';
    scoreDisplay.innerHTML = 0;
    finalScoreDisplay.innerHTML = 0;
    scoreDisplay.style.display = 'inline';

    //start background music
    bgm.play();
});