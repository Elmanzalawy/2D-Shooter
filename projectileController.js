//Projectile class
class Projectile {
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0 , 360, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update(){
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

function fireProjectile(y, x){
    for(let i=0;i<=0;i++){
        const angle = Math.atan2(y - y0, x - x0)// * (Math.random() - 0.5);
        const speedMultiplier = 4; //* Math.floor(Math.random() * Math.floor(3));
        const velocity = {
            x: Math.cos(angle) * speedMultiplier,
            y: Math.sin(angle) * speedMultiplier,
        }
        const projectile = new Projectile(x0,y0, 2, 'red', velocity);
        setTimeout(() => { //we use setTimeOut to prevent the frame stuttering when deleting an array item
            projectiles.push(projectile);
        }, 1);
        // console.log(projectiles)
    }
    
}

function projectileCollission(projectile, enemy){

        
        console.log(enemies);
        onHitAudio.play();
        //create splash particles
        for(let i=0; i<enemy.radius * 2; i++){  //how many particles based on enemy radius
            particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: (Math.random() - 0.5) * (Math.random() * 4), y: (Math.random() - 0.5) * (Math.random() * 4)})); //we subtract 0.5 from Math.random to get values between -0.5 and 0.5
        }

        if(enemy.radius - 10 > 10){
            
            //increment score
            score += 10;
            scoreDisplay.innerHTML = score;
            gsap.to(enemy, {
                radius: enemy.radius - 10
            })

            setTimeout(() => { //we use setTimeOut to prevent the frame stuttering when deleting an array item
            }, 0);
            
        }
        if(enemy.radius - 10 <= 10){
            //increment score
            score += 25;
            scoreDisplay.innerHTML = score;
            setTimeout(() => { //we use setTimeOut to prevent the frame stuttering when deleting an array item
            delete enemies[enemies.indexOf(enemy)];
            
            }, 0);
        }
        projectiles.splice(projectile, 1);
    
}