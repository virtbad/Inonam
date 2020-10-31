enum RoverEvent {
  STEER = 1,
  DRIVE = 2,
  GYRO = 3,
}

class Rover {
  public position: Coordinate;
  public driveDegrees: number;
  public steerDegrees: number;
  public gyroDegrees: number;
  public positions: {
    claw: 'open' | 'close';
    crane: 'up' | 'down';
    steer: number;
  };
  constructor() {
    this.position = config.startCoordinate;
    this.driveDegrees = motors.largeA.angle();
    this.steerDegrees = motors.mediumD.angle();
    this.gyroDegrees = sensors.gyro4.angle();
    this.positions = {
      claw: 'open',
      crane: 'down',
      steer: 0,
    };
  }

  public drive(
    direction: 'forwards' | 'backwards',
    unit: MoveUnit,
    repetitions: number,
    speed: number = config.defaultRoverMotorSpeed,
  ): boolean {
    motors.largeA.setPauseOnRun(true);
    motors.largeA.run(
      direction == 'forwards' ? speed : -speed,
      repetitions,
      unit,
    );
    return true;
  }

  public steer(
    direction: 'left' | 'right',
    degrees: number,
    speed: number = config.defaultRoverMotorSpeed,
  ): boolean {
    const current: number = motors.mediumD.angle();
    const deg: number =
      degrees * (config.maxSteerMotorDegrees / config.maxEffectiveDegrees);
    const max: number = config.maxSteerMotorDegrees;
    let run: { speed: number; degrees: number };
    if (direction == 'right') {
      if (current - deg < -max) {
        run = {
          speed: -speed,
          degrees: max + current,
        };
      } else {
        run = {
          speed: -speed,
          degrees: deg,
        };
      }
    } else {
      if (current + deg > max) {
        run = {
          speed: speed,
          degrees: max - current,
        };
      } else {
        run = {
          speed: speed,
          degrees: deg,
        };
      }
    }
    motors.mediumD.setPauseOnRun(true);
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

  public moveCrane(
    direction: 'up' | 'down',
    speed: number = config.defaultRoverMotorSpeed,
  ): boolean {
    if (this.positions.crane == direction) {
      return true;
    } else {
      motors.largeC.setPauseOnRun(true);
      motors.largeC.run(
        direction == 'up' ? -speed : speed,
        config.craneRotationCount,
        MoveUnit.Rotations,
      );
      this.positions.crane = direction;
      return true;
    }
  }

  /*
   * Not sure if motor
   * directions are correct.
   * Manual testing required.
   */

  public useClaw(
    operation: 'close' | 'open',
    speed: number = config.defaultRoverMotorSpeed,
  ): boolean {
    if (this.positions.claw == operation) {
      return true;
    } else {
      motors.mediumB.setPauseOnRun(true);
      motors.mediumB.run(
        operation == 'open' ? -speed : speed,
        config.clawRotationCount,
        MoveUnit.Rotations,
      );
      this.positions.claw = operation;
      return true;
    }
  }

  public onEvent(
    handler: (
      event: RoverEvent,
      distance: number,
      coordinate?: Coordinate,
    ) => void,
  ): void {
    forever(() => {
      setInterval(() => {
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
          this.position = getCoordinateFromDistance(
            difference * config.fieldsPerDeg,
            this.gyroDegrees,
            this.position,
          );
          handler(2, difference, this.position);
        }
        if (currentGyroAngle != this.gyroDegrees) {
          handler(3, currentGyroAngle - this.gyroDegrees);
          this.gyroDegrees = currentGyroAngle;
        }
      }, config.driveInterval);
    });
  }
}
