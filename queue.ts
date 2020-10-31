class Queue {
  private _queue: Array<Point> = [];
  private _currentInstructions: Array<Instruction> = [];
  private _rover: Rover;
  private _pathfinding: Maneuvers
  constructor(rover: Rover, pathfinding: Maneuvers) {
    this._rover = rover;
    this._pathfinding = pathfinding
    forever(() => this.shift());
  }

  public add(point: Point) {
    this._queue.push(point);
  }

  public addInstructions(instructions: Instruction[]) {
    instructions.forEach((instruction: Instruction) => {
      this._currentInstructions.push(instruction);
    });
    brick.setStatusLight(StatusLight.Red);
  }

  public toNewPoint(): void {
    if(this._queue.length != 0) {
      const shift: Instruction[] = pathfinding.findToObject( this._queue.shift())
      shift.forEach((instruction: Instruction) => this._currentInstructions.push(instruction));
    }
  }

  public shift() {
    console.log("ASDF");
    if (this._currentInstructions.length != 0) {
      const shift: Instruction = this._currentInstructions.shift();
      if (shift instanceof DriveInstruction) {
        brick.setStatusLight(StatusLight.RedPulse);
        if (this.solveDriveinstruction(shift)) {
          this.shift();
          return true;
        }
      } else if (shift instanceof SteerInstruction) {
        if (this.solveSteerinstruction(shift)) {
          return true;
        }
      } else {
        brick.setStatusLight(StatusLight.GreenPulse);
      }
    } else {
      if (this._queue.length != 0) {
      } else {
          return true;
      }
    }
    return true;
  }

  private solveDriveinstruction(instruction: DriveInstruction): boolean {
    const length: number = instruction.getLength();
    if (this._rover.drive(1, 4, length, 20)) {
      return true;
    }
    return true;
  }

  private solveSteerinstruction(instruction: SteerInstruction): boolean {
    const length: number = instruction.getLength();
    const angle: number = instruction.getAngle();
    const direction: SteerDirection = angle < 0 ? -1 : 1;
    if (this._rover.steer(direction, Math.abs(angle), 20)) {
      if (this._rover.drive(1, 4, length, 20)) {
        if (
          this._rover.steer(
            direction * -1,
            Math.abs(angle),
            20,
          )
        ) {
          return true;
        }
      }
    }
    return true;
  }
}
