interface configOptions {
  roverDriveMotor: 'largeA' | 'largeB' | 'largeC' | 'largeD';
  roverSteerMotor: 'mediumA' | 'mediumB' | 'mediumC' | 'mediumD';
  cageMotor: 'mediumA' | 'mediumB' | 'mediumC' | 'mediumD';
  ultrasonicPort: 'ultrasonic1' | 'ultrasonic2' | 'ultrasonic3' | 'ultrasonic4';
  gyroSensor: 'gyro1' | 'gyro2' | 'gyro3' | 'gyro4';
  stationCoordinate: Point;
  startCoordinate: Point;
  dimensions: { x: number; y: number };
  size: { width: number; length: number };
  maxSteerMotorDegrees: number;
  maxEffectiveDegrees: number;
  maxCageMotorDegrees: number;
  offPerDeg: number;
  fieldsPerDeg: number;
  driveInterval: number;
  minPointDistance: number;
}

const config: configOptions = {
  roverDriveMotor: 'largeA',
  roverSteerMotor: 'mediumD',
  cageMotor: 'mediumC',
  ultrasonicPort: 'ultrasonic3',
  gyroSensor: 'gyro4',
  stationCoordinate: new Point(0, 50),
  startCoordinate: new Point(0, 20),
  dimensions: { x: 200, y: 200 },
  size: { width: 15.5, length: 22 },
  maxCageMotorDegrees: 6500,
  maxSteerMotorDegrees: 95,
  maxEffectiveDegrees: 27,
  fieldsPerDeg: 0.034,
  offPerDeg: 0.0048,
  driveInterval: 300,
  minPointDistance: 5
};
