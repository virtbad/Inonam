class ConveyorBelt {
  private direction: boolean;
  private speed: number;
  private lengthPerRound: number;
  private motor: 'largeA' | 'largeB' | 'largeC' | 'largeD';

  constructor(direction: boolean, speed: number, cmPerRound: number, motor: 'largeA' | 'largeB' | 'largeC' | 'largeD') {
    this.direction = direction;
    this.speed = speed;
    this.lengthPerRound = cmPerRound;
    this.motor = motor;
  }

  public run(length: number): void {
    let rounds = (length / this.lengthPerRound) * (this.direction ? 1 : -1);
    motors.largeA.run(this.speed, rounds, MoveUnit.Rotations);
  }

  public stop(): void {
    motors.largeA.stop();
  }
}
