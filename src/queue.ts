class Queue {
  private _queue: Array<Point>;
  private _currentInstructions: Array<Instruction>;
  private _rover: Rover;
  private _pathfinding: Maneuvers
  constructor(rover: Rover, pathfinding: Maneuvers) {
    this._queue = [];
    this._currentInstructions = [];
    this._rover = rover;
    this._pathfinding = pathfinding
    //control.runInParallel(() => this.shift());
  }

  public add(point: Point) {
    this._queue.push(point);
  }

  public addInstructions(instructions: Instruction[]) {
    instructions.forEach((instruction: Instruction) => {
      this._currentInstructions.push(instruction);
    });
    console.log("added instructions")
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

  public shift(): Function {
    if (this._currentInstructions.length != 0) {
      console.log("object");
      const shift: Instruction = this._currentInstructions.shift();
      if (!shift.angle || shift.angle == 0) {
         this.solveDriveinstruction(shift) 
      } else {
        this.solveSteerinstruction(shift);
      }
    }
    pause(2000);
    return this.shift();
  }

  private solveDriveinstruction(instruction: Instruction) {
    console.log("drive: " + instruction.length)
    this._rover.drive(1, 4, instruction.length, 20);
    console.log("drivefinished");
  }

  private solveSteerinstruction(instruction: Instruction): boolean {
    console.log("steer")
    brick.setStatusLight(StatusLight.Orange)
    const length: number = instruction.length;
    const angle: number = Math.abs(instruction.angle);
    const direction: SteerDirection = angle < 0 ? -1 : 1;
    this._rover.steer(direction, angle, 20) 
    this._rover.drive(1, 4, length, 20) 
    this._rover.steer(direction * -1, angle, 20) 
    pause(100)
    return true
    }
  }


    /*    if (this._rover.steer(direction, angle, 20)) {
      if (this._rover.drive(1, 4, length, 20)) {
        if (
          this._rover.steer(
            direction * -1,
            angle,
            20,
          )
        ) {
          pause(100)
          return true;
        }
      }
    } */
   //reeturn true;
  /* }
}
 */