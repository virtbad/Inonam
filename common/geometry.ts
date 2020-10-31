class Line {
    public m : number;
    public q : number;

    constructor(m : number, q : number){
        this.m = m;
        this.q = q;
    }

    public fromAngle(p : Point, a : number){
        this.m = Math.tan(MathUtils.toRadiants(a));
        this.q = p.y - p.x * this.m;
    }

    public fromPoints(p1: Point, p2: Point){
        if (p2.x > p1.x){
            this.fromPoints(p2, p1);
            return;
        }

        let a : number = p1.y - p2.y;
        let b : number = p1.x - p2.x;

        this.m = (a) / b;

        this.q = p1.y - p1.x * this.m;
    }

    public getX(y : number) : number{
        return (y - this.q) / this.m;
    }

    public getY(x : number) : number{
        return (this.m * x + this.q);
    }
}

class Point {
    public x : number;
    public y : number;

    constructor(x : number, y : number){
        this.x = x;
        this.y = y;
    }
}

class Circle {
    public m : Point;
    public r : number;

    constructor(m : Point, r : number){
        this.m = m;
        this.r = r;
    }

    public getExtent() : number {
        return 2 * this.r * Math.PI;
    }
}

class GeometryUtils {
    public static linesParalles(l1 : Line, l2 : Line) : boolean {
        return l1.m == l2.m;
    }

    public static linesXOfIntersection(l1 : Line, l2 : Line) : number{
        if (l1.m == l2.m) throw Error("Intersecting lines must not be parallel");
        return ((l2.q - l1.q) / (l1.m - l2.m));
    }

    public static linePerpendicularThrough(line : Line, point : Point) : Line {
        let m : number = -(1 / line.m);
        let q : number = point.y - point.x * m;

        return new Line(m, q);
    }

    public static lineDistanceOnBetween(line : Line, x1 : number, x2 : number) : number{
        let x : number = x1 - x2;
        let y : number = line.getY(x1) - line.getY(x2);

        return  Math.sqrt(x * x + y * y);
    }

    public static lineXOfDistanceAfter(l : Line, x : number, s : number) : number{
        let k : number = Math.sqrt(1 + l.m * l.m);
        return x + (s / k);
    }

    public static pointDistanceBetween(p1 : Point, p2 : Point) : number {
        let dx : number = p1.x - p2.x;
        let dy : number = p1.y - p2.y;

        return Math.sqrt(dx**2 + dy**2);
    }
}