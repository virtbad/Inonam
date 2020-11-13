class UI {
    private uiMode : number;

    private steerTestMode : number;
    private steerTestDelta : number;

    private steerTestForwardsA : number;
    private steerTestForwardsB : number;
    private steerTestForwardsC : number;

    private steerTestBackwardsA : number;
    private steerTestBackwardsB : number;
    private steerTestBackwardsC : number;

    private currentCalibratedBalance : number;

    private rover : Rover;

    constructor(rover : Rover){
        this.uiMode = 0;

        this.steerTestMode = 0;
        this.steerTestDelta = 50;

        this.steerTestForwardsA = 500;
        this.steerTestForwardsB = 3300;
        this.steerTestForwardsC = 800;

        this.steerTestBackwardsA = 100;
        this.steerTestBackwardsB = 3500;
        this.steerTestBackwardsC = 1000;

        this.currentCalibratedBalance = -9999;

        this.rover = rover;

        brick.buttonDown.onEvent(ButtonEvent.Pressed, () => this.down());
        brick.buttonUp.onEvent(ButtonEvent.Pressed, () => this.up());
        brick.buttonEnter.onEvent(ButtonEvent.Pressed, () => this.center());
        brick.buttonLeft.onEvent(ButtonEvent.Pressed, () => this.left());
        brick.buttonRight.onEvent(ButtonEvent.Pressed, () => this.right());

        this.updateInterface();
    }

    private left(){
        switch (this.uiMode) {
            case 0:
                this.rover.calibrateSteerMove(true);
                if (this.currentCalibratedBalance == -9999) this.currentCalibratedBalance = 0;
                this.currentCalibratedBalance++;
                this.updateInterface();
                break;
            case 1:
            case 2:
                this.steerTestSwitchMode();
                break;
        }
    }

    private right(){
        switch (this.uiMode) {
            case 0:
                this.rover.calibrateSteerMove(false);
                if (this.currentCalibratedBalance == -9999) this.currentCalibratedBalance = 0;
                this.currentCalibratedBalance--;
                this.updateInterface();
                break;
            case 2:
            case 1:
                this.steerTestSwitchMode();
                break;
        }
    }

    private up(){
        switch (this.uiMode) {
            case 0:
                break;
            case 1:
                this.steerTestChange(true, true);
                break;
            case 2:
                this.steerTestChange(true, false);
                break;
            case 3:
                this.collectingTest();
                break;
        }
    }

    private down(){
        switch (this.uiMode) {
            case 0:
                break;
            case 1:
                this.steerTestChange(false, true);
                break;
            case 2:
                this.steerTestChange(false, false);
                break;
            case 3:
                this.curvingTest();
                break;
        }
    }

    private center(){
        switch (this.uiMode) {
            case 0:
                if (this.currentCalibratedBalance != -9999) this.rover.calibrateSteerDone();
                this.uiMode = 1;
                this.updateInterface();
                break;
            case 1:
                this.uiMode = 2;
                this.updateInterface();
                break;
            case 2:
                this.uiMode = 3;
                this.updateInterface(); 
                break;
            case 3:
                this.currentCalibratedBalance = -9999;
                this.uiMode = 0;
                this.updateInterface();
                break;
        }
    }

    public updateInterface(){
        brick.clearScreen();

        switch (this.uiMode) {
            case 0:
                brick.showString("Steering Calibration", 1);
                brick.showString((this.currentCalibratedBalance != -9999 ? "Calibration: " + this.currentCalibratedBalance : "Not yet Changed"), 2);
                break;
            case 1:
                brick.showString("Test Forwards", 1);
                brick.showString((this.steerTestMode == 0 ? "- " : "") + "First: " + this.steerTestForwardsA, 2);
                brick.showString((this.steerTestMode == 1 ? "- " : "") + "Main: " + this.steerTestForwardsB, 3);
                brick.showString((this.steerTestMode == 2 ? "- " : "") + "Last: " + this.steerTestForwardsC, 4);
                break;
            case 2:
                brick.showString("Test Backwards", 1);
                brick.showString((this.steerTestMode == 0 ? "- " : "") + "First: " + this.steerTestBackwardsA, 2);
                brick.showString((this.steerTestMode == 1 ? "- " : "") + "Main: " + this.steerTestBackwardsB, 3);
                brick.showString((this.steerTestMode == 2 ? "- " : "") + "Last: " + this.steerTestBackwardsC, 4);
                break;
            case 3:
                brick.showString("Up: Collecting", 1);
                brick.showString("Down: Curving", 2);
                break;
        }
    }
      
    private steerTestSwitchMode(){
        this.steerTestMode++;
    
        if(this.steerTestMode < 0) this.steerTestMode = 2;
        if(this.steerTestMode > 2) this.steerTestMode = 0;
    
        this.updateInterface();
    }
    
    private steerTestChange(increase : boolean, forwards : boolean){

        let a : number;
        let b : number;
        let c : number;

        if (forwards){
            a = this.steerTestForwardsA; 
            b = this.steerTestForwardsB; 
            c = this.steerTestForwardsC; 
        }else {
            a = this.steerTestBackwardsA; 
            b = this.steerTestBackwardsB; 
            c = this.steerTestBackwardsC; 
        }

        switch(this.steerTestMode){
            case 0: a += (increase ? this.steerTestDelta : -this.steerTestDelta); break;
            case 1: b += (increase ? this.steerTestDelta : -this.steerTestDelta); break;
            case 2: c += (increase ? this.steerTestDelta : -this.steerTestDelta); break;
        }
    
        if (a < 0) a = 0;
        if (b < 0) b = 0;
        if (c < 0) c = 0;

        if(forwards){
            this.steerTestForwardsA = a;
            this.steerTestForwardsB = b;
            this.steerTestForwardsC = c;
        }else {
            this.steerTestBackwardsA = a;
            this.steerTestBackwardsB = b;
            this.steerTestBackwardsC = c;
        }
    
        this.updateInterface();
    }
    
    private collectingTest(){
        this.rover.driveSteer(this.steerTestBackwardsA, this.steerTestBackwardsB, this.steerTestBackwardsC, false);
        pause(1000);
        this.rover.drive(100, 50);
        pause(2000);
        this.rover.drive(-100, 50);
        pause(1000);
        this.rover.driveSteer(this.steerTestForwardsA, this.steerTestForwardsB, this.steerTestForwardsC, true);
    }

    private curvingTest(){
        this.rover.driveSteer(this.steerTestForwardsA, this.steerTestForwardsB, this.steerTestForwardsC, true);
        pause(2000);
        this.rover.driveSteer(this.steerTestBackwardsA, this.steerTestBackwardsB, this.steerTestBackwardsC, false);
    }
}