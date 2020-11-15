class Driver {
    private rover : Rover;

    private static runSpeed : number = 50;
    private static markingSpeed : number = 20;
    private static steeringSpeed : number = 5;

    private static approachThreshold : number = 35;
    private static approachSpeed : number = 30;
    private static collectedDistance : number = 5;

    private static rampSpeed : number = 40;
    private static rampDistance : number = 40;
    private static rampDepositDelay : number = 2000;
    private static rampBackDistnace : number = 35;
    
    private static markingColor : ColorSensorColor = ColorSensorColor.White;

    private static afterSteerMax : number = 2000;

    public forwardsA : number;
    public forwardsB : number;
    public forwardsC : number;

    public backwardsA : number;
    public backwardsB : number;
    public backwardsC : number;

    constructor(rover : Rover){
        this.rover = rover;

        this.forwardsA = 600;
        this.forwardsB = 2600;
        this.forwardsC = 800;

        this.backwardsA = 100;
        this.backwardsB = 2700;
        this.backwardsC = 1000;
    }

    public forwardsSteer(){
        this.driveSteer(this.forwardsA, this.forwardsB, true)
        //this.rover.driveSteer(this.forwardsA, this.forwardsB, this.forwardsC, true);
    }

    public backwardsSteer(){        
        this.driveSteer(this.backwardsA, this.backwardsB, false)
        //this.rover.driveSteer(this.backwardsA, this.backwardsB, this.backwardsC, false);
    }

    public getToNextObject() {

        this.rover.resetDrive();
        this.rover.goAccelerated(Driver.runSpeed);                                             // Starts Driving

        while (true){                                                               // Waits for distance to hit Threshold
            let distance : number = this.rover.getDistance();
            if (distance <= Driver.approachThreshold) break;
        }

        let current = this.rover.getDriven();
        this.rover.goAccelerated(Driver.approachSpeed);                                        // Drives slower

        this.rover.cageMid();                                                       // Mids Cage whilst driving

        while (true){                                                               // Waits for rover to hit half the collected Distance
            if (this.rover.getDriven() >= current + Rover.cmToDegrees(Driver.approachThreshold + Driver.collectedDistance)) break;
        }

        this.rover.cageDown();                                                      // Lowers Cage

        this.rover.stop();                                                          // Stops Last driving Job

        pause(500);                                                                 // Waits

        this.driveUntilMarking(-Driver.runSpeed)                                    // Runs Back to next Marking
    }

    public driveSteer(a : number, b : number, forwards : boolean){
        console.log("Drive Steer")
        let speedFactor = forwards ? 1 : -1;
        this.rover.goAccelerated(Driver.markingSpeed * speedFactor);                 // Runs slowly
        
        console.log("Waiting for Exiting Marking");
        while (true){
            if (this.rover.getColor() != Driver.markingColor) {
                music.playTone(Note.C, 125);
                break;                // Waits for rover to leave makring
            }
        }

        console.log("Starting Steer Sequence");
        this.rover.resetDrive();                                                    // Resets Driven Degrees
        this.rover.goAccelerated(Driver.runSpeed * speedFactor);                               // Runs faster

        while (true){
            if (Math.abs(this.rover.getDriven()) >= a) break;                       // Waits for degrees to hit distance a
        }

        this.rover.steer(Driver.steeringSpeed);                                     // Steers 

        while (true) {
            if (Math.abs(this.rover.getDriven()) >= a + b) break;                   // Waits for degrees to hit distance a + b
        }

        this.rover.resetSteer(Driver.steeringSpeed);                                // Steers back

        while (true) {
            if (this.rover.getColor() == Driver.markingColor || this.rover.getDriven() >= Driver.afterSteerMax + a + b) break;  // Waits for rover to get back on marking
        }

        console.log("Finished")

        this.rover.stop();                                                          // Stops Rover
    }

    public depositBrick(){
        this.rover.resetDrive();
        this.rover.goAccelerated(Driver.rampSpeed);
        this.rover.cageHover();

        while (Rover.degreesToCm(this.rover.getDriven()) < Driver.rampDistance);
        this.rover.stop();
        
        pause(Driver.rampDepositDelay);
        this.rover.cageUp();
        pause(Driver.rampDepositDelay);

        this.rover.driveByCM(-Driver.rampBackDistnace, Driver.rampSpeed);
    }

    public driveUntilMarking(speed : number){
        this.rover.goAccelerated(speed);

        while (true) {
            if (this.rover.getColor() == Driver.markingColor) break;
        }

        this.rover.stop();
    }

    public testSequence(){
        this.backwardsSteer();
        pause(1000);
        this.getToNextObject();
        pause(1000);
        this.forwardsSteer();
        pause (1000);
        this.depositBrick();
    }

    public calibratoinSequence(){
        this.backwardsSteer();
        pause(1000);
        this.getToNextObject();
        pause(1000);
        this.forwardsSteer();
    }

    public steerSequence(){
        this.backwardsSteer();
        pause(2000);
        this.forwardsSteer();
        pause(1000);
        this.depositBrick();
    }
}