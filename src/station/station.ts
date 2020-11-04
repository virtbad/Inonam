class Station {
  private collectorBelt: ConveyorBelt;
  private upwardsBelt: ConveyorBelt;

  constructor() {
    this.collectorBelt = new ConveyorBelt(false, 40, 10, 'largeA');
  }

  public test(): void {
    this.collectorBelt.run(100);
  }
}
