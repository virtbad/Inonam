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

  public drive(direction: DriveDirection, unit: Units, repetitions: number, speed: number): boolean {
    const effUnit: number = unit == 4 ? 3 : unit;
    const effRepetitions: number = unit == 4 ? repetitions / config.fieldsPerDeg : repetitions;
    motors.largeA.pauseUntilReady();
    console.log('started');
    motors.largeA.run(direction * speed, effRepetitions, effUnit);
    console.log('ready');
    return true;
  }

  public steer(direction: SteerDirection, degrees: number, speed: number): boolean {
    const current: number = motors.mediumD.angle();
    const deg: number = degrees * (config.maxSteerMotorDegrees / config.maxEffectiveDegrees);
    const max: number = config.maxSteerMotorDegrees;
    let run: { speed: number; degrees: number } = { speed: direction * speed, degrees: degrees };
    if (direction == SteerDirection.Right) {
      if (current - deg < -max) run.degrees = max + current;
      else run.degrees = deg;
    } else {
      if (current + deg > max) run.degrees = max - current;
      else run.degrees = deg;
    }
    motors.mediumD.pauseUntilReady();
    motors.mediumD.run(run.speed, run.degrees, MoveUnit.Degrees);
    this.positions.steer = motors.mediumD.angle();
    return true;
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
