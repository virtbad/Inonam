interface configOptions {
  dimensions: { x: number; y: number };
  size: { width: number; length: number };
  steer: { a: number; b: number, c: number, maxMotorAngle: number, minimalSteerRadius: number };
  
  maxSteerMotorDegrees: number;
  maxEffectiveDegrees: number;
  offPerDeg: number;
  fieldsPerDeg: number;
  driveInterval: number;
  minPointDistance: number;
}

const config: configOptions = {
  dimensions: { x: 200, y: 200 },
  size: { width: 15.5, length: 22 },
  steer: {a: 0.03, b: -5.4033, c: 282.85, maxMotorAngle: 91, minimalSteerRadius: 40},

  maxSteerMotorDegrees: 95,
  maxEffectiveDegrees: 27,
  fieldsPerDeg: 0.034,
  offPerDeg: 0.0048,
  driveInterval: 300,
  minPointDistance: 5
};
