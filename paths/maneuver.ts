class Maneuvers {

    private width : number;
    private length : number;

    private minR : number; // Minimal Radius

    private p : Point; // Position
    private a : number; // Angle

    constructor(width : number, length : number, maximalSteer : number) {
        this.width = width;
        this.length = length;
        this.minR = this.minimalRadius(maximalSteer);
    }

    public findToObject(t : Point) : Instruction[] {
        let g : Line = new Line(0, 0);
        g.fromAngle(this.p, this.a);

        let c : Line = GeometryUtils.linePerpendicularThrough(g, t);

        let over : boolean = g.getY(t.x) < t.y;
        let after : boolean = this.p.x < GeometryUtils.linesXOfIntersection(g, c);

        let f : number = GeometryUtils.lineDistanceOnBetween(c, GeometryUtils.linesXOfIntersection(g, c), t.x);

        let r = this.minR;

        if (f > 2 * r) r = f / 2;

        let e : number = f - r;

        let h = Math.sqrt(r**2 - e**2);

        let dhx = GeometryUtils.lineXOfDistanceAfter(c, GeometryUtils.linesXOfIntersection(c, g), r  * (over ? -1 : 1));
        let d : Line = GeometryUtils.linePerpendicularThrough(c, new Point(dhx, c.getY(dhx)));

        let mx : number = GeometryUtils.lineXOfDistanceAfter(d, GeometryUtils.linesXOfIntersection(c, d), h * (after ? -1 : 1));
        let my : number = d.getY(mx);

        // INSTRUCTION CREATION

        let instructions : Instruction[] = [];

        let circle : Circle = new Circle(new Point(mx, my), r);

        let downMX : number = GeometryUtils.linesXOfIntersection(GeometryUtils.linePerpendicularThrough(g, new Point(mx, my)), g);
        let distance = GeometryUtils.lineDistanceOnBetween(g, this.p.x, downMX);

        instructions.push(new DriveInstruction(distance));

        let k : number = GeometryUtils.pointDistanceBetween(t, new Point(downMX, g.getY(downMX)));
        let phi : number = 2 * MathUtils.toDegrees(Math.asin((k / 2) / circle.r));

        let circleDistance = circle.getExtent() / 360 * phi;
        let angle = this.steerAngleFromRadius(circle.r);

        instructions.push(new SteerInstruction(circleDistance, angle));

        return instructions;
    }

    public update(p : Point, a : number) : void {
        this.p = p;
        this.a = a;
    }

    public steerAngleFromRadius(radius : number){
        return MathUtils.toDegrees(Math.atan(this.length / (radius + (this.width / 2))));
    }

    public minimalRadius(maximalAngle : number) {
        let o : number = this.length / Math.tan(MathUtils.toRadiants(maximalAngle));
        return o - (this.width / 2);
    }


}
