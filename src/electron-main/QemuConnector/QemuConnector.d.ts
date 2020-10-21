import { QemuEventData } from 'qemu-lpc4088-controller';
import MachineState from './MachineState';
import { MachineStateEventData } from '../../common/QemuConnectorTypes';
export declare type QemuEventHandler = (qemuEvent: QemuEventData) => void;
export declare type OnMachineStateChangeHandler = (event: MachineStateEventData) => void;
declare class QemuConnector {
    static eventHandler?: QemuEventHandler;
    static onMachineStateChangeHandler?: OnMachineStateChangeHandler;
    static machineState?: MachineState;
    static updateMachineState(msg: QemuEventData): void;
    static start_qemu(exe_file: string): Promise<import("qemu-lpc4088-controller/dist/apprunner/qemu_runner").QemuProcessInterface>;
    static setEventHandler(handler: QemuEventHandler): void;
    static setOnMachineStateChangeHandler(handler: OnMachineStateChangeHandler): void;
    static clearEventHandler(): void;
    static clearOnMachineStateChangeHandler(): void;
}
export default QemuConnector;
