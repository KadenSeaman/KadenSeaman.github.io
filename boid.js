const canvas = document.getElementById("canvas");
const startButton = document.getElementById("start-btn");
const ctx = canvas.getContext("2d");
const fishContainerDiv = document.getElementById("hero-container");


class Fish {
    constructor(){
        this.width = 20;
        this.height = 20;
        this.position = {x: Math.random() * (canvas.width - this.width/2),y: Math.random() * (canvas.height - this.height/2)};
        this.velocity = {x: ((Math.random() * 2) - 1),y: ((Math.random() * 2) - 1)};
        this.acceleration = {x:0, y:0};
    }

    draw(){
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height);
    }
    update(otherFish){
        this.flock(otherFish);

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.edges();
        this.draw();

    }
    align(otherFish){
        let perception = 100;
        let steering = {x: 0,y: 0};
        let fishInRadius = 0;
        let maxSteering = 1;
        let maxSpeed = 2;
        
        otherFish.forEach((fish) => {
            if(fish === this){
                return;
            }

            let distance = calculateDistance(this.position.x,this.position.y,fish.position.x,fish.position.y);

            if(distance < perception){
                steering.x += fish.velocity.x;
                steering.y += fish.velocity.y;
                fishInRadius++;
            }
        })
        if(fishInRadius){
            steering.x /= fishInRadius;
            steering.y /= fishInRadius;

            if (steering.x <= 0){
                steering.x = Math.max(steering.x - this.velocity.x,-maxSteering);
            }
            else{
                steering.x = Math.min(steering.x - this.velocity.x,maxSteering);
            }
            if (steering.y <= 0){
                steering.y = Math.max(steering.y - this.velocity.y,-maxSteering);
            }
            else{
                steering.y = Math.min(steering.y - this.velocity.y,maxSteering);
            }
        }

        return steering;
    }

    edges(){
        if(this.position.x < 0){
            this.position.x = canvas.width -10;
        }
        if(this.position.x > canvas.width){
            this.position.x = 10;
        }
        if(this.position.y < 0){
            this.position.y = canvas.height - 10;
        }
        if(this.position.y > canvas.height){
            this.position.y = 10;
        }
    }

    flock(otherFish){
        let alignment = this.align(otherFish);
        this.acceleration.x = alignment.x;
        this.acceleration.y = alignment.y;
    }
}

const calculateDistance = (x1,y1,x2,y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2-y1) ** 2);
}

const proportionalSize = (size) => {
    return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
}

const fishFlock = [];

const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    fishFlock.forEach((fish) => fish.update(fishFlock))
}

const startGame = () => {
    canvas.width = fishContainerDiv.clientWidth;
    canvas.height = fishContainerDiv.clientHeight;

    for(let i = 0; i < 50; i++){
        fishFlock.push(new Fish())
    }

    const p = createVector();
    console.log(p);

    animate();
}

startButton.addEventListener("click", (e) => {
    e.preventDefault();
    startGame();
})