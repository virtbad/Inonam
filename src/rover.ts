class Rover {

  private driveMotor : motors.Motor;
  private steerMotor : motors.Motor;
  private cageMotor : motors.Motor;

  private distanceSensor : sensors.UltraSonicSensor;
  private orientationSensor : sensors.GyroSensor;
  private colorSensor : sensors.ColorSensor;

  private steeringSpeed : number;
  private steeringDegrees : number;
  private calibrationLength : number;

  private static cmPerDegree : number = 0.034865;

  private static cageDownDegrees : number = 0;
  private static cageUpDegrees : number = 290;
  private static cageMidDegrees : number = 100;
  private static cageHoverDegrees : number = 140;
  
  constructor() {
    this.driveMotor = motors.largeA;
    this.steerMotor = motors.mediumD;
    this.cageMotor = motors.mediumC;
    this.distanceSensor = sensors.ultrasonic3;
    this.orientationSensor = sensors.gyro4;
    this.colorSensor = sensors.color2;

    this.colorSensor.setMode(ColorSensorMode.Color);

    this.steeringSpeed = 5;
    this.steeringDegrees = 75;
    this.calibrationLength = 45;
  }

  public static cmToDegrees(cm : number) : number {
    return cm / Rover.cmPerDegree;
  }

  public static degreesToCm(degrees : number) : number {
    return degrees * this.cmPerDegree;
  }

  public driveByCM(value: number, speed: number){
    this.driveByDegrees(Rover.cmToDegrees(value), speed);
  }

  public driveByDegrees(value: number, speed : number){
    this.driveMotor.run(speed, value, MoveUnit.Degrees);
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

  public goAccelerated(speed: number){
    this.driveMotor.run(speed);
    //control.runInParallel(() => this.driveMotor.ramp(speed, 1000000000, MoveUnit.Rotations, 0.5)); // COMPROMISE TO HAVE SMOOTH ACCELERATION
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

  public cageDown(){
    this.cageSet(Rover.cageDownDegrees);
  }
  public cageMid(){
    this.cageSet(Rover.cageMidDegrees);
  }
  public cageUp(){
    this.cageSet(Rover.cageUpDegrees);
  }
  public cageHover(){
    this.cageSet(Rover.cageHoverDegrees);
  }
  private cageSet(degrees: number){
    this.cageMotor.pauseUntilReady();
    this.cageMotor.run(10, degrees - this.cageMotor.angle(), MoveUnit.Degrees)
  }

  public getDistance() : number{
    return this.distanceSensor.distance();
  }

  public getOrientation() : number {
    return this.orientationSensor.angle();
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
