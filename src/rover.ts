class Rover {

  private driveMotor : motors.Motor;
  private steerMotor : motors.Motor;
  private cageMotor : motors.Motor;

  private distanceSensor : sensors.UltraSonicSensor;
  private orientationSensor : sensors.GyroSensor;
  private colorSensor : sensors.ColorSensor;

  private lastDegree : number;
  
  constructor() {
    this.driveMotor = motors.largeA;
    this.steerMotor = motors.mediumD;
    this.cageMotor = motors.mediumC;
    this.distanceSensor = sensors.ultrasonic3;
    this.orientationSensor = sensors.gyro4;
    this.colorSensor = sensors.color2;

    this.lastDegree = 0;
  }

  public driveSecurely(value: number, speed: number) {
    const eff: number = value / config.fieldsPerDeg;

    const modulo : number = eff % 5000;
    const iter : number = (eff - modulo) / 5000;

    for (let i = 0; i < iter; i++) {
      this.driveMotor.pauseUntilReady();
      this.driveMotor.run(speed, 5000, MoveUnit.Degrees);
      this.driveMotor.reset();
    }
    this.driveMotor.pauseUntilReady();
    this.driveMotor.run(speed, modulo, MoveUnit.Degrees);
    this.driveMotor.reset();
  }

  public drive(value: number, speed: number){
    const eff: number = value / config.fieldsPerDeg;
    this.driveMotor.run(speed, eff, MoveUnit.Degrees);
  }

  public resetDrive(){
    this.driveMotor.reset();
  }

  public go(speed: number){
    this.driveMotor.pauseUntilReady();
    this.driveMotor.run(speed);
  }

  public stop(){
    this.driveMotor.stop();
  }

  public getDriven() : number{
    return this.driveMotor.angle()
  }

  public steer(radius: number, speed: number){
    let degrees : number[] = MathUtils.solveQuadratic(Math.abs(radius), config.steer.a, config.steer.b, config.steer.c);
    degrees = degrees.filter(value => value < config.steer.maxMotorAngle);
    if (degrees.length > 0){
      const amount = degrees[0] * (radius < 0 ? -1 : 1);

      console.log(`Amount to steer ${amount}`)

      this.steerMotor.pauseUntilReady();
      this.steerMotor.run(speed, amount - this.steerMotor.angle(), MoveUnit.Degrees);

    }else console.log("Received Invalid steer Radius");
  }

  public resetSteer(speed: number){
    this.steerMotor.pauseUntilReady();
    this.steerMotor.run(speed, -this.steerMotor.angle(), MoveUnit.Degrees);
  }

  public lowerCage(){
    this.setCage(0);
  }

  public liftCage(){
    this.setCage(275);
  }

  public hoverCage(){
    this.setCage(20);
  }

  private setCage(degrees: number){
    this.cageMotor.pauseUntilReady();
    this.cageMotor.run(10, degrees - this.cageMotor.angle(), MoveUnit.Degrees)
  }

  public getNextObject() : number{
    return this.distanceSensor.distance();
  }

  public getOrientation() : number {
    return this.orientationSensor.angle() - this.lastDegree;
  }

  public resetOrientation() {
    return this.lastDegree = this.orientationSensor.angle();
  }

  public getColor() : ColorSensorColor {
    return this.colorSensor.color();
  }
}
