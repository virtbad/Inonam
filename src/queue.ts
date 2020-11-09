/* interface QueueStructure {
  toStation: boolean;
  instructions: Array<Instruction>;
} */

class Queue {
  public openPoints: Array<Point>;
  public foundPoints: Array<Point>;
  private _current: { toStation: boolean; instructions: Array<Instruction> };
  private _rover: Rover;
  private _pathfinding: Maneuvers;
  constructor(rover: Rover, pathfinding: Maneuvers) {
    this.openPoints = [];
    this.foundPoints = [];
    this._rover = rover;
    this._pathfinding = pathfinding;
    this._current = { toStation: false, instructions: null };
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

  private toStation(): Instruction[] {
    return this._current.instructions;
  }

  public shift(): Function {
    if (this._current == null) {
      this._current = { toStation: false, instructions: this._pathfinding.findToObject(this.openPoints.shift()) };
    } else if (this._current.instructions.length != 0) {
      const i: Instruction = this._current.instructions.shift();
      if (!i.radius || i.radius == 0) {
        this.solveDrive(i);
      } else {
        this.solveSteer(i);
      }
    } else if (!this._current.toStation) {
      this.cageItem();
      this._current.toStation = true;
      this._current.instructions = this.toStation();
    } else {
      this.releaseItem();
      this._current = null;
    }
    pause(1000);
    return this.shift();
  }

  private solveDrive(instruction: Instruction) {
    console.log('Solving Drive Instruction');
    console.log(`Length: ${instruction.length}`);
    this._rover.drive(instruction.length, 50);
    console.log('Finished Driving');
  }

  private solveSteer(instruction: Instruction) {
    console.log('Solving Steer Instruction');
    console.log(`Length: ${instruction.length}, Angle: ${instruction.radius}`);
    this._rover.steer(instruction.radius, 20);
    console.log('Driving in Steer Instruction');
    this._rover.drive(instruction.length, 50);
    this._rover.resetSteer(20);
    console.log('Finished Steering');
  }

  private cageItem() {
    console.log('Putting item into cage');
    this._rover.cage(CageDirection.Close, 20);
    console.log('Item is in cage');
  }

  private releaseItem() {
    console.log('Releasing item');
    this._rover.cage(CageDirection.Open, 20);
    pause(1000);
    console.log('Released item');
  }
}
