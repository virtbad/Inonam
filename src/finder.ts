class Finder {
  private _rover: Rover;
  constructor(rover: Rover) {
    this._rover = rover;
  }

  public onFind(handler: (coordinate: Point) => void): void {
    sensors.ultrasonic3.onEvent(UltrasonicSensorEvent.ObjectDetected, () => {
      const coordinate: Point = this._rover.position.getCoordinateFromDistance(sensors.ultrasonic3.distance(), this._rover.gyroDegrees);
      if (coordinate.isInField()) handler(coordinate);
    });
  }

  public static alreadyFound(point: Point, points: Array<Point>): boolean {
    let f: boolean = false;
    points.forEach((p: Point) => {
      const start: Point = new Point(p.x - config.minPointDistance, p.y - config.minPointDistance);
      const end: Point = new Point(p.x + config.minPointDistance, p.y + config.minPointDistance);
      const xIn: boolean = point.x >= start.x && point.x <= end.x;
      const yIn: boolean = point.y >= start.y && point.y <= end.y;
      if (xIn && yIn) f = true;
    });
    return f;
  }
}
