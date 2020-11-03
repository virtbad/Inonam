class Instruction {
  constructor() {}
}

class DriveInstruction extends Instruction {
  private length: number;

  constructor(length: number) {
    super();
    this.length = length;
  }

  public getLength(): number {
    return this.length;
  }
}

class SteerInstruction extends DriveInstruction {
  private angle: number;

  constructor(length: number, angle: number) {
    super(length);
    this.angle = angle;
  }

  public getAngle(): number {
    return this.angle;
  }
}
