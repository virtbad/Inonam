class Finder {
  private _rover: Rover;
  constructor(rover: Rover) {
    this._rover = rover;
  }

  public onFind(handler: (coordinate: Point) => void): void {
    sensors.ultrasonic3.onEvent(UltrasonicSensorEvent.ObjectDetected, () => {
      const coordinate: Point = getCoordinateFromDistance(sensors.ultrasonic3.distance(), this._rover.gyroDegrees, this._rover.position);
      if (coordinate.isInField()) handler(coordinate);
    });
  }
}

function getCoordinateFromDistance(distance: number, angle: number, pos: Point): Point {
  const rots: number = angle % 360;
  const degrees: number = rots % 90;
  const quadrant: number = Math.floor(rots / 90) + (rots < 0 ? 5 : 1);
  const l1: number = Math.cos(degrees * (Math.PI / 180)) * distance;
  const l2: number = Math.sqrt(distance ** 2 - l1 ** 2);
  if (degrees == 0) {
    switch (rots / 90) {
      case 0:
        return new Point(pos.x + distance, pos.y);
      case 1:
        return new Point(pos.x, pos.y + distance);
      case 2:
        return new Point(pos.x - distance, pos.y);
      case 3:
        return new Point(pos.x, pos.y - distance);
      case 4:
        return new Point(pos.x + distance, pos.y);
    }
  } else {
    switch (quadrant) {
      case 1:
        return new Point(pos.x + l1, pos.y + l2);
      case 2:
        return new Point(pos.x - l1, pos.y + l2);
      case 3:
        return new Point(pos.x - l1, pos.y - l2);
      case 4:
        return new Point(pos.x + l1, pos.y - l2);
    }
  }
  return new Point(0, 0);
}
