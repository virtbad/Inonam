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
    if(instructions.length == 1) {
      music.playSoundEffect(sounds.colorsRed)

    } else {
      music.playSoundEffect(sounds.colorsGreen)

    }
    instructions.forEach((instruction: Instruction) => {
      this._currentInstructions.push(instruction);
      if(instruction instanceof DriveInstruction) {
      } 
      if(instruction instanceof SteerInstruction) {
      }
    });
  }

  public toNewPoint(): boolean {
    if(this._queue.length != 0) {
      if(this._currentInstructions.length != 0) {
        const shift: Instruction[] = pathfinding.findToObject( this._queue.shift())
        shift.forEach((instruction: Instruction) => this._currentInstructions.push(instruction));
        return true;
      } else return false;
    } else return false;
  }

  public toStation(): void {

  }

  public shift() {
    if (this._currentInstructions.length != 0) {
      const shift: Instruction = this._currentInstructions.shift();
      if (shift instanceof DriveInstruction) {
        if (this.solveDriveinstruction(shift)) {
          this.shift();
          return true;
        }
      } 
      if (shift instanceof SteerInstruction) {
        if (this.solveSteerinstruction(shift)) {
          return true;
        }
      } 
    }
    return false;
  }

  private solveDriveinstruction(instruction: DriveInstruction): boolean {
    const length: number = instruction.getLength();
    if (this._rover.drive(1, 4, length, 20)) {
      return true;
    }
    return true;
  }

  private solveSteerinstruction(instruction: SteerInstruction): boolean {
    brick.setStatusLight(StatusLight.Orange)
    const length: number = instruction.getLength();
    const angle: number = Math.abs(instruction.getAngle());
    const direction: SteerDirection = angle < 0 ? -1 : 1;
    if (this._rover.steer(direction, angle, 20)) {
      if (this._rover.drive(1, 4, length, 20)) {
        if (
          this._rover.steer(
            direction * -1,
            angle,
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
