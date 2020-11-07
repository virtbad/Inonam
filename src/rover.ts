enum RoverEvent {
  DRIVE = 1,
  GYRO = 2
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
  Open = 1,
  Close = -1
}

enum CageDirection {
  Open = -1,
  Close = 1
}

class Rover {
  public position: Point;
  public driveDegrees: number;
  public gyroDegrees: number;
  private events: Array<(event: RoverEvent, distance: number, coordinate?: Point) => void>;
  public positions: {
    cage: CageDirection;
  };
  constructor() {
    this.position = config.startCoordinate;
    this.driveDegrees = motors.largeA.angle();
    this.gyroDegrees = sensors.gyro4.angle();
    this.positions = {
      cage: CageDirection.Open
    };
    this.handleEvents();
  }

  public drive(value: number, speed: number) {
    const eff: number = value / config.fieldsPerDeg;
    console.log("Degs: " + eff)

    const modulo : number = eff % 5000;
    const iter : number = (eff - modulo) / 5000;

    for (let i = 0; i < iter; i++) {
      motors.largeA.pauseUntilReady();
      motors.largeA.run(speed, 5000, MoveUnit.Degrees);
      motors.largeA.reset();
    }
    motors.largeA.pauseUntilReady();
    motors.largeA.run(speed, modulo, MoveUnit.Degrees);
    motors.largeA.reset();
  }

  // DEPRECATED
  public steerWithDegrees(degrees: number, speed: number) {
    if (degrees > config.maxEffectiveDegrees) degrees = config.maxEffectiveDegrees;
    if (degrees < -config.maxEffectiveDegrees) degrees = -config.maxEffectiveDegrees;
    const steerPerDegree: number = config.maxSteerMotorDegrees / config.maxEffectiveDegrees;
    const real: number = degrees * steerPerDegree - motors.mediumD.angle();
    motors.mediumD.pauseUntilReady();
    motors.mediumD.run(speed, real, MoveUnit.Degrees);
  }


  public cage(direction: CageDirection, speed: number) {
    if (direction != this.positions.cage) {
      motors.mediumC.pauseUntilReady();
      motors.mediumC.run(direction * speed, config.maxCageMotorDegrees, MoveUnit.Degrees);
    }
  }
    
  public steer(radius: number, speed: number) {
    let degrees : number[] = MathUtils.solveQuadratic(Math.abs(radius), config.steer.a, config.steer.b, config.steer.c);
    degrees = degrees.filter(value => value < config.steer.maxMotorAngle);
    if (degrees.length > 0){
      const amount = degrees[0] * (radius < 0 ? -1 : 1);
      console.log(`Amount to steer ${amount}`)
      motors.mediumD.pauseUntilReady();
      motors.mediumD.run(speed, amount - motors.mediumD.angle(), MoveUnit.Degrees);
    } else console.log("Received Invalid steer Radius");
  }

  public resetSteer(speed: number) {
    motors.mediumD.pauseUntilReady();
    motors.mediumD.run(speed, -motors.mediumD.angle(), MoveUnit.Degrees);
  }

  public stopAll(): void {
    motors.stopAll();
  }

  private handleEvents() {
    control.runInParallel(() => {
      forever(() => {
        const currentDriveAngle: number = motors.largeA.angle();
        const currentGyroAngle: number = sensors.gyro4.angle();
        if (currentDriveAngle != this.driveDegrees) {
          const difference: number = currentDriveAngle - this.driveDegrees;
          this.driveDegrees = currentDriveAngle;
          this.position = this.position.getCoordinateFromDistance(difference * config.fieldsPerDeg, this.gyroDegrees);
          this.events.forEach((handler: (event: RoverEvent, distance: number, coordinate?: Point) => void) => {
            handler(1, difference, this.position);
          });
        }
        if (currentGyroAngle != this.gyroDegrees) {
          this.events.forEach((handler: (event: RoverEvent, distance: number, coordinate?: Point) => void) => {
            handler(2, currentGyroAngle - this.gyroDegrees);
          });
          this.gyroDegrees = currentGyroAngle;
        }
        pause(250);
      });
    });
  }

  public onEvent(handler: (event: RoverEvent, distance: number, coordinate?: Point) => void): void {
    this.events.push(handler);
  }
}
