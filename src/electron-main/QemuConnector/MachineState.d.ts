import { GPIOState, IOCONState, TIMERState } from "../../common/QemuConnectorTypes";
declare class MachineState {
    gpioState: GPIOState;
    ioconState: IOCONState;
    timerState: TIMERState;
    constructor();
    get getGpioState(): GPIOState;
    get getIoconState(): IOCONState;
}
export default MachineState;
