class MathUtils {
  public static toRadiants(degrees: number): number {
    return (degrees / 180) * Math.PI;
  }

  public static toDegrees(radiants: number): number {
    return (radiants * 180) / Math.PI;
  }
}
