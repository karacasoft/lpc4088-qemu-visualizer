import { GPIOState, IOCONState, PWMState, TIMERState } from "../../common/QemuConnectorTypes";
declare class MachineState {
    gpioState: GPIOState;
    ioconState: IOCONState;
    timerState: TIMERState;
    pwmState: PWMState;
    constructor();
    get getGpioState(): GPIOState;
    get getIoconState(): IOCONState;
}
export default MachineState;
