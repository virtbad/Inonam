class UI {
    private uiMode : number;

    private steerTestMode : number;
    private steerTestA : number;
    private steerTestB : number;
    private steerTestC : number;
    private steerTestDelta : number;

    private rover : Rover;

    constructor(rover : Rover){
        this.uiMode = 0;

        this.steerTestMode = 0;
        this.steerTestA = 500;
        this.steerTestB = 2000;
        this.steerTestC = 500;
        this.steerTestDelta = 100;

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
                this.rover.runSteer(1);
                break;
            case 1:
                this.steeringTest(true);
                break;
        }
    }

    private right(){
        switch (this.uiMode) {
            case 0:
                this.rover.runSteer(-1);
                break;
            case 1:
                this.steeringTest(false);
                break;
        }
    }

    private up(){
        switch (this.uiMode) {
            case 0:
                break;
            case 1:
                this.steerTestChange(true);
                break;
        }
    }

    private down(){
        switch (this.uiMode) {
            case 0:
                break;
            case 1:
                this.steerTestChange(false);
                break;
        }
    }

    private center(){
        switch (this.uiMode) {
            case 0:
                this.rover.calibrateSteer();
                this.uiMode = 1;
                this.updateInterface();
                break;
            case 1:
                this.steerTestSwitchMode();
                break;
        }
    }

    public updateInterface(){
        brick.clearScreen();

        switch (this.uiMode) {
            case 0:
                brick.showString("Please set steering", 1);
                break;
            case 1:
                brick.showString((this.steerTestMode == 0 ? "- " : "") + "First: " + this.steerTestA, 1);
                brick.showString((this.steerTestMode == 1 ? "- " : "") + "Main: " + this.steerTestB, 2);
                brick.showString((this.steerTestMode == 2 ? "- " : "") + "Last: " + this.steerTestC, 3);
                break;
        }
    }
      
    private steerTestSwitchMode(){
        this.steerTestMode++;
    
        if(this.steerTestMode < 0) this.steerTestMode = 2;
        if(this.steerTestMode > 2) this.steerTestMode = 0;
    
        this.updateInterface();
    }
    
    private steerTestChange(increase : boolean){
        switch(this.steerTestMode){
            case 0: this.steerTestA += (increase ? this.steerTestDelta : -this.steerTestDelta); break;
            case 1: this.steerTestB += (increase ? this.steerTestDelta : -this.steerTestDelta); break;
            case 2: this.steerTestC += (increase ? this.steerTestDelta : -this.steerTestDelta); break;
        }
    
        if (this.steerTestA < 0) this.steerTestA = 0;
        if (this.steerTestB < 0) this.steerTestB = 0;
        if (this.steerTestC < 0) this.steerTestC = 0;
    
        this.updateInterface();
    }
    
    private steeringTest(forwards : boolean){
        this.rover.driveSteer(this.steerTestA, this.steerTestB, this.steerTestC, forwards);
    }
}