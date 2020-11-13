class Rover {

  private driveMotor : motors.Motor;
  private steerMotor : motors.Motor;
  private cageMotor : motors.Motor;

  private distanceSensor : sensors.UltraSonicSensor;
  private orientationSensor : sensors.GyroSensor;
  private colorSensor : sensors.ColorSensor;

  private lastDegree : number;

  private steeringSpeed : number;
  private steeringDegrees : number;
  private calibrationLength : number;
  
  constructor() {
    this.driveMotor = motors.largeA;
    this.steerMotor = motors.mediumD;
    this.cageMotor = motors.mediumC;
    this.distanceSensor = sensors.ultrasonic3;
    this.orientationSensor = sensors.gyro4;
    this.colorSensor = sensors.color2;

    this.lastDegree = 0;
    this.steeringSpeed = 5;
    this.steeringDegrees = 75;
    this.calibrationLength = 45;
  }

  public drive(value: number, speed: number){
    const eff: number = value / config.fieldsPerDeg;
    this.driveMotor.run(speed, eff, MoveUnit.Degrees);
  }

  public driveSteer(a : number, b : number, c : number, forwards : boolean){
    this.resetDrive();
    this.driveMotor.pauseUntilReady();
    control.runInParallel(() => {
      while (true){
        if (Math.abs(this.driveMotor.angle()) >= a) break;
      }
      this.steer(this.steeringSpeed);
      while (true) {
        if (Math.abs(this.driveMotor.angle()) >= a + b) break;
      }
      this.resetSteer(this.steeringSpeed);
    }); 
    this.driveMotor.run((forwards ? 1 : -1) * 50, a + b + c, MoveUnit.Degrees);
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

  public steer(speed: number){
    this.steerMotor.pauseUntilReady();
    this.steerMotor.run(speed, this.steeringDegrees, MoveUnit.Degrees);
  }

  public resetSteer(speed: number){
    this.steerMotor.pauseUntilReady();
    this.steerMotor.run(speed, -this.steeringDegrees, MoveUnit.Degrees);
  }

  public lowerCage(){
    this.setCage(0);
  }

  public liftCage(){
    this.setCage(275);
  }

  public hoverCage(){
    this.setCage(30);
  }

  private setCage(degrees: number){
    this.cageMotor.pauseUntilReady();
    this.cageMotor.run(10, degrees - this.cageMotor.angle(), MoveUnit.Degrees)
  }

  public getNextObject() : number{
    return this.distanceSensor.distance();
  }

  public getOrientation() : number {
    console.log("" + this.orientationSensor.angle());
    return this.orientationSensor.angle() - this.lastDegree;
  }

  public resetOrientation() {
    return this.lastDegree = this.orientationSensor.angle();
  }

  public getColor() : ColorSensorColor {
    return this.colorSensor.color();
  }

  public runSteer(amount : number) {
    this.steerMotor.run(5, amount, MoveUnit.Degrees);
  }

  public calibrateSteerDone(){
    this.steerMotor.reset();
  }

  public calibrateSteerMove(forwards : boolean){
    this.steerMotor.run(this.steeringSpeed, this.steeringDegrees, MoveUnit.Degrees);
    this.steerMotor.run(this.steeringSpeed, -this.steeringDegrees + (forwards ? 1 : -1), MoveUnit.Degrees);
  }
}
