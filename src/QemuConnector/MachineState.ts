interface GPIOPortState {
    DIR: number;
    MASK: number;
    PIN: number;
}

interface GPIOState {
    PORTS: GPIOPortState[];
}

type IOCONPinState = number;

interface IOCONPortState {
    [k: number]: IOCONPinState;
}

interface IOCONState {
    PORTS: IOCONPortState[];
}

class MachineState {
    gpioState: GPIOState;
    ioconState: IOCONState;

    constructor() {
        this.gpioState = {
            PORTS: [
                { DIR: 0, PIN: 0, MASK: 0, },
                { DIR: 0, PIN: 0, MASK: 0, },
                { DIR: 0, PIN: 0, MASK: 0, },
                { DIR: 0, PIN: 0, MASK: 0, },
                { DIR: 0, PIN: 0, MASK: 0, },
                { DIR: 0, PIN: 0, MASK: 0, }
            ]
        };

        this.ioconState = {
            PORTS: [
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 },
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 },
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 },
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 },
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 },
                { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0 }
            ]
        };
    }

    
    public get getGpioState() : GPIOState {
        return {
            PORTS: [
                { ...this.gpioState.PORTS[0] },
                { ...this.gpioState.PORTS[1] },
                { ...this.gpioState.PORTS[2] },
                { ...this.gpioState.PORTS[3] },
                { ...this.gpioState.PORTS[4] },
                { ...this.gpioState.PORTS[5] },
            ]
        };
    }

    public get getIoconState() : IOCONState {
        return {
            PORTS: [
                { ...this.ioconState.PORTS[0] },
                { ...this.ioconState.PORTS[1] },
                { ...this.ioconState.PORTS[2] },
                { ...this.ioconState.PORTS[3] },
                { ...this.ioconState.PORTS[4] },
                { ...this.ioconState.PORTS[5] }
            ]
        };
    }
    
}

export default MachineState;