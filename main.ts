console.sendToScreen();
const rover: Rover = new Rover();
const finder: Finder = new Finder(rover);
let objects: Array<Coordinate> = [];

brick.buttonDown.onEvent(ButtonEvent.Pressed, () => {
  brick.setStatusLight(StatusLight.GreenPulse);
  if (rover.drive('forwards', MoveUnit.Rotations, 2, 10)) {
    console.log('arrived');
  }
});

brick.buttonUp.onEvent(ButtonEvent.Pressed, () => {
  rover.steer('right', 27, 20);
});

finder.onFind((coordinate: Coordinate) => {
  objects.push(coordinate);
  console.log(coordinate.x + ',' + coordinate.y);
});

rover.onEvent(
  (event: RoverEvent, distance: number, coordinate?: Coordinate) => {
    switch (event) {
      case RoverEvent.DRIVE:
        if (!coordinate.isInField()) rover.stopAll();
        break;
      case RoverEvent.GYRO:
        break;
      case RoverEvent.STEER:
        break;
    }
  },
);

/**
 * 67cm, 5 rot 61cm, 5 rot, 1806deg - 12.2cm/rot 1.2deg off/rot 61.5cm, 5 rot, 1807deg - 12.3cm/rot 1.4deg off/rot 62cm, 5 rot, 1813deg - 12.4cm/rot 2.6deg off/rot Average: 61.5cm/5rot, 12.3cm/rot, 1.73deg off/rot Average: 0.34mm/deg 0.0048deg off/deg
 */
