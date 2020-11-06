interface QueueStructure {
  toStation: boolean;
  instructions: Array<Instruction>;
}

class Queue {
  public openPoints: Array<Point>;
  public foundPoints: Array<Point>;
  private _current: QueueStructure;
  private _rover: Rover;
  private _pathfinding: Maneuvers;
  constructor(rover: Rover, pathfinding: Maneuvers) {
    this.openPoints = [];
    this._rover = rover;
    this._pathfinding = pathfinding;
  }

  public add(point: Point) {
    this.openPoints.push(point);
  }

  public addInstructions(instructions: Instruction[]) {
    console.log('New Instructions');
    this._current = {
      toStation: false,
      instructions: instructions
    };
  }

  public toStation(): Instruction[] {
    return this._current.instructions;
  }

  public shift(): Function {
    if (this._current == null) {
      this._current = { toStation: false, instructions: this._pathfinding.findToObject(this.openPoints.shift()) };
    } else if (this._current.instructions.length != 0) {
      const i: Instruction = this._current.instructions.shift();
      if (!i.angle || i.angle == 0) {
        this.solveDrive(i);
      } else {
        this.solveSteer(i);
      }
    } else if (!this._current.toStation) {
      this.pickupItem();
      this._current.toStation = true;
      this._current.instructions.push(...this.toStation());
    } else {
      this.releaseItem();
      this._current = null;
    }
    pause(1000);
    return this.shift();
  }

  public solveDrive(instruction: Instruction) {
    console.log('Solving Drive Instruction');
    console.log(`Length: ${instruction.length}`);
    this._rover.drive(Units.Centimeters, instruction.length, 20);
    console.log('Finished Driving');
  }

  private solveSteer(instruction: Instruction) {
    console.log('Solving Steer Instruction');
    console.log(`Length: ${instruction.length}, Angle: ${instruction.angle}`);
    this._rover.steer(instruction.angle, 20);
    console.log('Driving in Steer Instruction');
    this._rover.drive(Units.Centimeters, instruction.length, 20);
    this._rover.steer(-instruction.angle, 20);
    console.log('Finished Steering');
  }

  public pickupItem() {
    console.log('Picking item up');
    this._rover.useClaw(-1, 20);
    console.log('Opened claw');
    this._rover.moveCrane(1, 20);
    console.log('Moved crane down');
    pause(1000);
    this._rover.useClaw(1, 20);
    console.log('Closed claw');
    this._rover.moveCrane(1, 20);
    console.log('Picked item up');
  }

  public releaseItem() {
    console.log('Releasing item');
    this._rover.useClaw(-1, 20);
    pause(1000);
    console.log('Released item');
    this._rover.useClaw(1, 20);
  }
}
