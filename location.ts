class Location {
    private v : Vector;
    private width : number = 15;
    private length : number = 22;

    //THIS ARE RADIANTS!!!

    public updateDirection(){
        this.v.angle = sensors.gyro1.angle();
    }

    private getOmegaByRadius(radius : number) : number {
        return Math.asin((this.length / 2) / radius);
    }

    private getCircleLength(radius: number) : number {
        return Math.PI * 2 * radius;
    }

    private getDistanceToTurn(radius: number, degrees : number) : number {
        let full = this.getCircleLength(radius);
        return full / 360 * degrees;
    }
}

class Vector {
    public x : number;
    public y : number;

    public angle : number;
}



