interface QueueStructure {
  toStation: boolean;
  instructions: Array<Instruction>;
}

class Queue {
  private _queue: Array<Point>;
  private _currentInstructions: Array<Instruction>;
  private _currentInstruciton: QueueStructure;
  private _rover: Rover;
  private _pathfinding: Maneuvers;
  constructor(rover: Rover, pathfinding: Maneuvers) {
    this._queue = [];
    this._currentInstructions = [];
    this._rover = rover;
    this._pathfinding = pathfinding;
  }

  public add(point: Point) {
    this._queue.push(point);
  }

  public addInstructions(instructions: Instruction[]) {
    this._currentInstruciton = {
      instructions: instructions,
      toStation: false
    };
    console.log('New Instructions');
    instructions.forEach((instruction: Instruction) => {
      this._currentInstructions.push(instruction);
    });
  }

  public toStation(): Instruction[] {
    return this._currentInstructions;
  }

  public shift(): Function {
    if (this._currentInstruciton == null) {
      this._currentInstruciton = { toStation: false, instructions: this._pathfinding.findToObject(this._queue.shift()) };
    } else if (this._currentInstruciton.instructions.length != 0) {
      const i: Instruction = this._currentInstruciton.instructions.shift();
      if (!i.angle || i.angle == 0) {
        this.solveDrive(i);
      } else {
        this.solveSteer(i);
      }
    } else if (!this._currentInstruciton.toStation) {
      this.pickupItem();
      this._currentInstruciton.toStation = true;
      this._currentInstruciton.instructions.push(...this.toStation());
    } else {
      this.releaseItem();
      this._currentInstruciton = null;
    }
    pause(1000);
    return this.shift();
  }

  public solveDrive(instruction: Instruction) {
    console.log('Solving Drive Instruction');
    console.log('Amount to go: ' + instruction.length);
    this._rover.drive(Units.Centimeters, instruction.length, 20);
    console.log('Finished Driving');
  }

  private solveSteer(instruction: Instruction) {
    console.log('Solving Steer Instruction');
    console.log('Amount to go: ' + instruction.length);
    console.log('Amount to steer: ' + instruction.angle);
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
