// Priority: -1
console.sendToScreen();

const rover: Rover = new Rover();
const finder: Finder = new Finder(rover);

const pathfinding: Maneuvers = new Maneuvers(config.size.width, config.size.length, config.maxEffectiveDegrees);

pathfinding.update(new Point(10, 10), 30);

const queue: Queue = new Queue(rover, pathfinding);

let test: number = 1;

finder.onFind((point: Point) => {
  if (test == 2) return;
  console.log(`Spotted Object [${point.x}, ${point.y}]`);
  if (!Finder.alreadyFound(point, queue.foundPoints) && !Finder.alreadyFound(point, queue.openPoints)) {
    queue.addInstructions(pathfinding.findToObject(new Point(100, 100)));
  } else {
    console.log('Already found this point');
  }
  //queue.addInstructions(pathfinding.findToObject(new Point(coordinate.x, coordinate.y)));
  queue.add(point);
  test = 2;
});

rover.onEvent((event: RoverEvent, distance: number, coordinate?: Point) => {
  switch (event) {
    case RoverEvent.DRIVE:
      if (!coordinate.isInField()) rover.stopAll();
      pathfinding.update(coordinate, rover.gyroDegrees);
      break;
    case RoverEvent.GYRO:
      break;
  }
});

control.runInParallel(() => queue.shift());

/*
 * 67cm, 5 rot
 * 61cm, 5 rot, 1806deg - 12.2cm/rot 1.2deg off/rot
 * 61.5cm, 5 rot, 1807deg - 12.3cm/rot 1.4deg off/rot
 * 62cm, 5 rot, 1813deg - 12.4cm/rot 2.6deg off/rot
 *
 * Average: 61.5cm/5rot, 12.3cm/rot, 1.73deg off/rot
 * Average: 0.34mm/deg 0.0048deg off/deg
 */
