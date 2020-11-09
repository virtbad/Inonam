// Priority: -1
console.sendToScreen();

const rover: Rover = new Rover();
const finder: Finder = new Finder(rover);
let circle: { driving: boolean; deg: number } = { driving: false, deg: 0 };

const pathfinding: Maneuvers = new Maneuvers(config.size.width, config.size.length, config.steer.minimalSteerRadius);

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
  queue.add(point);
  test = 2;
});

rover.onDrive((distance: number, point: Point) => {
  pathfinding.update(point, rover.gyroDegrees);
});

rover.onGyro((change: number, angle: number) => {
  console.log('' + angle);
  if (circle.driving && rover.gyroDegrees >= circle.deg + 360) rover.stopDrive();
});

//control.runInParallel(() => queue.shift());
rover.steer(config.steer.minimalSteerRadius, 20);
//console.log('Extent: ' + new Circle(null, config.steer.minimalSteerRadius).getExtent());
circle = { driving: true, deg: rover.gyroDegrees };
//rover.drive(new Circle(null, config.steer.minimalSteerRadius + config.size.width / 2).getExtent(), 50);
rover.drive(10000, 50);
rover.resetSteer(20);
console.log('Arrived');

/*
 * 67cm, 5 rot
 * 61cm, 5 rot, 1806deg - 12.2cm/rot 1.2deg off/rot
 * 61.5cm, 5 rot, 1807deg - 12.3cm/rot 1.4deg off/rot
 * 62cm, 5 rot, 1813deg - 12.4cm/rot 2.6deg off/rot
 *
 * Average: 61.5cm/5rot, 12.3cm/rot, 1.73deg off/rot
 * Average: 0.34mm/deg 0.0048deg off/deg
 */
