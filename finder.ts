class Finder {
  private _rover: Rover;
  constructor(rover: Rover) {
    this._rover = rover;
  }

  public onFind(handler: (coordinate: Coordinate) => void): void {
    sensors.ultrasonic3.onEvent(UltrasonicSensorEvent.ObjectDetected, () => {
      const coordinate: Coordinate = getCoordinateFromDistance(
        sensors.ultrasonic3.distance(),
        this._rover.gyroDegrees,
        this._rover.position,
      );
      if (coordinate.isInField()) handler(coordinate);
    });
  }
}

function getCoordinateFromDistance(
  distance: number,
  angle: number,
  pos: Coordinate,
): Coordinate {
  const rots: number = angle % 360;
  const degrees: number = rots % 90;
  const quadrant: number = Math.floor(rots / 90) + (rots < 0 ? 5 : 1);
  const l1: number = Math.cos(degrees * (Math.PI / 180)) * distance;
  const l2: number = Math.sqrt(distance ** 2 - l1 ** 2);
  if (degrees == 0) {
    switch (rots / 90) {
      case 0:
        return new Coordinate(pos.x + distance, pos.y);
      case 1:
        return new Coordinate(pos.x, pos.y + distance);
      case 2:
        return new Coordinate(pos.x - distance, pos.y);
      case 3:
        return new Coordinate(pos.x, pos.y - distance);
      case 4:
        return new Coordinate(pos.x + distance, pos.y);
    }
  } else {
    switch (quadrant) {
      case 1:
        return new Coordinate(pos.x + l1, pos.y + l2);
      case 2:
        return new Coordinate(pos.x - l1, pos.y + l2);
      case 3:
        return new Coordinate(pos.x - l1, pos.y - l2);
      case 4:
        return new Coordinate(pos.x + l1, pos.y - l2);
    }
  }
  return new Coordinate(0, 0);
}

class Coordinate {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public isInField(): boolean {
    if (this.x <= config.dimensions.x && this.y <= config.dimensions.y) {
      if (this.x >= 0 && this.y >= 0) {
        return true;
      } else return false;
    } else return false;
  }
}
