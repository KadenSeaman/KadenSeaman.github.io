const canvas = document.getElementById("canvas");
const startButton = document.getElementById("start-btn");
const ctx = canvas.getContext("2d");
const fishContainerDiv = document.getElementById("hero-container");

class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    add(otherVector){
        this.x += otherVector.x;
        this.y += otherVector.y;
    }
    div(divisor){
        this.x /= divisor;
        this.y /= divisor;
    }
    sub(otherVector){
        this.x -= otherVector.x;
        this.y -= otherVector.y;
    }
    mul(otherVector){
        this.x *= otherVector.x;
        this.y *= otherVector.y;
    }
    getMagnitude(){
        return Math.sqrt((this.x ** 2 + this.y ** 2));
    }
    setMagnitude(desiredMagnitude){
        this.x *= desiredMagnitude / this.getMagnitude();
        this.y *= desiredMagnitude / this.getMagnitude();
    }
}

class Fish {
    constructor(){
        this.width = 20;
        this.height = 20;

        const randomPositionX = Math.random() * (canvas.width - this.width/2);
        const randomPositionY = Math.random() * (canvas.height - this.height/2);

        const randomVelocityX = ((Math.random() * 2) - 1);
        const randomVelocityY = ((Math.random() * 2) - 1);


        this.position = new Vector(randomPositionX, randomPositionY);
        this.velocity = new Vector(randomVelocityX, randomVelocityY);
        this.acceleration = new Vector(0,0);
    }

    draw(){
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height);
    }


    update(otherFish){
        let vectors = this.flock(otherFish);

        let alignment = vectors[0];

        this.acceleration = alignment;
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);

        this.edges();
        this.draw();
    }

    flock(otherFish){
        let perception = 100;
        let maxSteering = 1;
        let maxSpeed = 2;
        //TODO IMPLEMENT MAXES

        let alignmnetVector = new Vector(0,0);
        let cohesionVector = new Vector(0,0);
        let fishInRadius = 0;

        //accumalate all velocities and positions
        otherFish.forEach((fish) => {
            if(fish === this){
                return;
            }

            let distance = calculateDistance(this.position.x,this.position.y,fish.position.x,fish.position.y);

            if(distance < perception){
                alignmnetVector.add(fish.velocity);
                fishInRadius++;
            }
        })

        if(fishInRadius){
            alignmnetVector.div(fishInRadius);
            alignmnetVector.sub(this.velocity);
        }

        return [alignmnetVector];
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
}

const fishFlock = [];

const calculateDistance = (x1,y1,x2,y2) => {
    return Math.sqrt((x2 - x1) ** 2 + (y2-y1) ** 2);
}

const proportionalSize = (size) => {
    return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
}

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
    
    animate();
}

startButton.addEventListener("click", (e) => {
    e.preventDefault();
    startGame();
})