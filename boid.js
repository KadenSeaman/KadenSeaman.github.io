const canvas = document.getElementById("canvas");
const startButton = document.getElementById("start-btn");
const ctx = canvas.getContext("2d");
const fishContainerDiv = document.getElementById("hero-container");


/*
TODO:

Replace fish image
avoid pointer

*/



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
    static sub(vector1,vector2){
        return new Vector(vector1.x - vector2.x,vector1.y - vector2.y);
    }
    mul(multiplier){
        this.x *= multiplier;
        this.y *= multiplier;
    }
    getMagnitude(){
        return Math.sqrt((this.x ** 2 + this.y ** 2));
    }
    setMagnitude(desiredMagnitude){
        const currentmagnitude = this.getMagnitude();
        this.x *= desiredMagnitude / currentmagnitude;
        this.y *= desiredMagnitude / currentmagnitude;
    }
    limitMagnitude(desiredLimit){
        if(this.getMagnitude() > desiredLimit){
            this.setMagnitude(desiredLimit);
        }
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

        this.maxForce = .6;
        this.maxSpeed = 4;
        this.perception = 100;
    }

    draw(){
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height);
    }


    update(otherFish){
        let vectors = this.flock(otherFish);

        let alignment = vectors[0];
        let cohesion = vectors[1];
        let seperation = vectors[2];

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(seperation);

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limitMagnitude(this.maxSpeed);
        this.acceleration.mul(0);

        this.edges();
        this.draw();
    }

    flock(otherFish){
        let alignmnetVector = new Vector(0,0);
        let cohesionVector = new Vector(0,0);
        let seperationVector = new Vector(0,0);

        let fishInRadius = 0;

        //accumalate all velocities and positions
        otherFish.forEach((fish) => {
            if(fish === this){
                return;
            }

            let distance = calculateDistance(
                this.position.x,
                this.position.y,
                fish.position.x,
                fish.position.y
            );

            if(distance < this.perception){
                alignmnetVector.add(fish.velocity);

                cohesionVector.add(fish.position);

                let avoidanceVector = Vector.sub(this.position,fish.position);
                avoidanceVector.div(distance ** 2);
                seperationVector.add(avoidanceVector);

                fishInRadius++; 
            }
        })

        if(fishInRadius){
            alignmnetVector.div(fishInRadius);
            alignmnetVector.setMagnitude(this.maxSpeed)
            alignmnetVector.sub(this.velocity);
            alignmnetVector.limitMagnitude(this.maxForce);

            //cohesionVector is currently the average position
            cohesionVector.div(fishInRadius);
            cohesionVector.sub(this.position);

            //cohesionVector is now a vector
            cohesionVector.setMagnitude(this.maxSpeed);
            cohesionVector.sub(this.velocity);
            cohesionVector.limitMagnitude(this.maxForce);

            seperationVector.div(fishInRadius);
            seperationVector.setMagnitude(this.maxSpeed);
            seperationVector.sub(this.velocity);
            seperationVector.limitMagnitude(this.maxForce * 1.0005)
        }

        return [alignmnetVector,cohesionVector,seperationVector];
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
    const snapshotOfFlock = [...fishFlock];
    fishFlock.forEach((fish) => fish.update(snapshotOfFlock))
}

const startGame = () => {
    canvas.width = fishContainerDiv.clientWidth;
    canvas.height = fishContainerDiv.clientHeight;

    for(let i = 0; i < 50; i++){
        fishFlock.push(new Fish())
    }
    
    animate();
}

document.querySelector("body").addEventListener("load", startGame())