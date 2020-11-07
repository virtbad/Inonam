class MathUtils {
  public static toRadiants(degrees: number): number {
    return (degrees / 180) * Math.PI;
  }

  public static toDegrees(radiants: number): number {
    return (radiants * 180) / Math.PI;
  }

  public static solveQuadratic(y : number, a : number, b : number, c : number) : number[] {
    c = c - y;

    const q : number = Math.sqrt(b**2 - 4 * a * c);

    const x1 : number = (-b + q) / (2 * a);
    const x2 : number = (-b - q) / (2 * a);

    return [x1, x2];
  }
}
