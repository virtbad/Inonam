class Queue {
  private _queue: Array<Point> = [];
  private _currentInstructions: Array<Instruction> = [];
  private _rover: Rover;
  constructor(rover: Rover) {
    this._rover = rover;
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

  public shift() {
    if (this._currentInstructions.length != 0) {
      const shift: Instruction = this._currentInstructions.shift();
      if (shift instanceof DriveInstruction) {
        brick.setStatusLight(StatusLight.RedPulse);
        if (this.solveDriveinstruction(shift)) {
          loops.pause(500);
          //this.shift();
        }
      } else if (shift instanceof SteerInstruction) {
        if (this.solveSteerinstruction(shift)) {
          loops.pause(500);
          //this.shift();
        }
      } else {
        brick.setStatusLight(StatusLight.GreenPulse);
      }
    } else {
      if (this._queue.length != 0) {
      } else {
        loops.pause(1000);
        //this.shift();
      }
    }
  }

  private solveDriveinstruction(instruction: DriveInstruction): boolean {
    const length: number = instruction.getLength();
    if (this._rover.drive('forwards', 'centimeter', length, 20)) {
      return true;
    }
    return true;
  }

  private solveSteerinstruction(instruction: SteerInstruction): boolean {
    const length: number = instruction.getLength();
    const angle: number = instruction.getAngle();
    const direction: 'left' | 'right' = angle < 0 ? 'left' : 'right';
    if (this._rover.steer(direction, Math.abs(angle), 20)) {
      if (this._rover.drive('forwards', 'centimeter', length, 20)) {
        loops.pause(250);
        if (
          this._rover.steer(
            direction == 'left' ? 'right' : 'left',
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
