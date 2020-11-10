// Priority: -1
console.sendToScreen();

const rover: Rover = new Rover();

const pickupThreshold : number = 18;
const steerVariability : number = 1;

//const pathfinding: Maneuvers = new Maneuvers(config.size.width, config.size.length, config.steer.minimalSteerRadius);
//pathfinding.update(new Point(10, 10), 30);

function main(){
  if(!getNextObject()) return;
  steer(90, 50);
  rover.hoverCage();
  driveToStation();
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
  rover.resetOrientation();
  rover.steer(40, 20);
  rover.go(speed);
  while(true){
    if (Math.abs(rover.getOrientation()) - steerVariability >= degrees) break;
  }
  rover.stop();
  rover.resetSteer(20);
}

brick.buttonUp.onEvent(ButtonEvent.Pressed, () => rover.liftCage());
brick.buttonDown.onEvent(ButtonEvent.Pressed, () => rover.lowerCage());
brick.buttonEnter.onEvent(ButtonEvent.Pressed, () => main());
brick.buttonRight.onEvent(ButtonEvent.Pressed, () => steer(90, -50));
brick.buttonLeft.onEvent(ButtonEvent.Pressed, () => steer(90, 50));