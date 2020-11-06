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
}
