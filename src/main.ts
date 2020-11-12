// Priority: -1
//console.sendToScreen();

//TODO: Kalibrierung, Zwei Parametersets, Vor und Rückwärts Bewegung

const rover: Rover = new Rover();

const pickupThreshold : number = 15;
const steerVariability : number = 4;
const steeringLoss : number = 5;


function main(){
  console.log("Going to get Next Object")
  if(!getNextObject()) return;
  console.log("Compensate Loss")
  //rover.drive(steeringLoss, 10);
  console.log("Steering for deposit")
  steer(90, 50);
  console.log("Goint to Station for deposit")
  rover.hoverCage();
  driveToStation();
  console.log("Steering Back")
  steer(90, -50);
}

function getNextObject() : boolean{
  let distance : number = rover.getNextObject();

  let wholeDistance : number = 0;

  if (distance != 255){
    console.log("Object at: " + distance);
    rover.drive(distance - pickupThreshold, 50);
    wholeDistance += distance - pickupThreshold;
    distance = rover.getNextObject();

    console.log("Next: " + distance);

    if (distance < pickupThreshold || distance > pickupThreshold){
      wholeDistance += distance - pickupThreshold;
      rover.drive(distance - pickupThreshold, 10);
    }

    rover.lowerCage();

    console.log("Catched Object");

    console.log("Going back for: " + wholeDistance);

    rover.drive(-wholeDistance, 50);

    return true;

  }else {
    console.log("There are no more bricks to collect!");
    return false;
  }
}

function driveToStation(){
  rover.resetDrive();
  rover.go(50);
  while (true){
    if (rover.getColor() == ColorSensorColor.White) break;
  }
  rover.stop();
  rover.drive(12, 20);
  rover.liftCage();
  
  let current = rover.getDriven() * config.fieldsPerDeg;
  rover.drive(-current, 50);
}

function steer(degrees : number, speed : number){
  pause(1000);
  rover.resetOrientation();
  pause(1000);
  rover.steer(20);
  rover.go(speed);
  while(true){
    if (Math.abs(rover.getOrientation()) + steerVariability >= degrees) break;
  }
  rover.stop();
  pause(1000);
  rover.resetSteer(20);
}

function steerUp(){
  steer(90, 50);
}

function steerDown(){
  steer(90, -50);
}

let ui : UI = new UI(rover);

//48 / 14
//42 / 15
//38 / 13
//38 / 12
//40 / 16