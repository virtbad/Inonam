enum RoverEvent {
  STEER = 1,
  DRIVE = 2,
  GYRO = 3
}

enum Units {
  Rotations = 0,
  Degrees = 1,
  Seconds = 2,
  Milliseconds = 3,
  Centimeters = 4
}

enum DriveDirection {
  Forwards = 1,
  Backwards = -1
}

enum SteerDirection {
  Left = 1,
  Right = -1
}

enum CraneDirection {
  Up = -1,
  Down = 1
}

enum ClawPosition {
  Open = -1,
  Close = 1
}

class Rover {
  public position: Point;
  public driveDegrees: number;
  public steerDegrees: number;
  public gyroDegrees: number;
  public positions: {
    claw: ClawPosition;
    crane: CraneDirection;
    steer: number;
  };
  constructor() {
    this.position = config.startCoordinate;
    this.driveDegrees = motors.largeA.angle();
    this.steerDegrees = motors.mediumD.angle();
    this.gyroDegrees = sensors.gyro4.angle();
    this.positions = {
      claw: ClawPosition.Open,
      crane: CraneDirection.Down,
      steer: 0
    };
  }

  public drive(unit: Units, value: number, speed: number) {
    const effRepetitions: number = unit == 4 ? value / config.fieldsPerDeg : value;
    const effUnit: number = unit == 4 ? MoveUnit.Degrees : unit;

    console.log('' + effRepetitions);
    motors.largeA.run(speed, effRepetitions, effUnit);
  }

  public steer(degrees: number, speed: number) {
    if (degrees > config.maxEffectiveDegrees) degrees = config.maxEffectiveDegrees;

    const steerPerDegree: number = config.maxSteerMotorDegrees / config.maxEffectiveDegrees;
    const real: number = degrees * steerPerDegree - motors.mediumD.angle();

    motors.mediumD.run(speed, real, MoveUnit.Degrees);
  }

  public stopAll(): void {
    motors.stopAll();
  }

  /*
   * Not sure if motor
   * directions are correct.
   * Manual testing required.
   */

  public moveCrane(direction: CraneDirection, speed: number = config.defaultRoverMotorSpeed): boolean {
    if (this.positions.crane == direction) {
      return true;
    } else {
      motors.largeC.pauseUntilReady();
      motors.largeC.run(direction * speed, config.craneRotationCount, MoveUnit.Rotations);
      this.positions.crane = direction;
      return true;
    }
  }

  /*
   * Not sure if motor
   * directions are correct.
   * Manual testing required.
   */

  public useClaw(operation: ClawPosition, speed: number = config.defaultRoverMotorSpeed): boolean {
    if (this.positions.claw == operation) {
      return true;
    } else {
      motors.mediumB.pauseUntilReady();
      motors.mediumB.run(operation * speed, config.clawRotationCount, MoveUnit.Rotations);
      this.positions.claw = operation;
      return true;
    }
  }

  public onEvent(handler: (event: RoverEvent, distance: number, coordinate?: Point) => void): void {
    forever(() => {
      const currentDriveAngle: number = motors.largeA.angle();
      const currentSteerAngle: number = motors.mediumD.angle();
      const currentGyroAngle: number = sensors.gyro4.angle();
      if (currentSteerAngle != this.steerDegrees) {
        handler(1, currentSteerAngle - this.steerDegrees);
        this.steerDegrees = currentSteerAngle;
      }
      if (currentDriveAngle != this.driveDegrees) {
        const difference: number = currentDriveAngle - this.driveDegrees;
        this.driveDegrees = currentDriveAngle;
        this.position = this.position.getCoordinateFromDistance(difference * config.fieldsPerDeg, this.gyroDegrees);
        handler(2, difference, this.position);
      }
      if (currentGyroAngle != this.gyroDegrees) {
        handler(3, currentGyroAngle - this.gyroDegrees);
        this.gyroDegrees = currentGyroAngle;
      }
    });
  }
}
