import qemu_lpc_ctrl, { QemuEventData } from 'qemu-lpc4088-controller';
import MachineState from './MachineState';
import { MachineStateEventData } from './QemuConnectorTypes';

export type QemuEventHandler = (qemuEvent: QemuEventData) => void;

export type OnMachineStateChangeHandler = (event: MachineStateEventData) => void;

class QemuConnector {
    static eventHandler?: QemuEventHandler;
    static onMachineStateChangeHandler?: OnMachineStateChangeHandler;
    static machineState?: MachineState;

    static updateMachineState(msg: QemuEventData) {
        if(this.machineState) {
            if(msg.module === "GPIO") {
                if(msg.event === "reg_change") {
                    if(QemuConnector.onMachineStateChangeHandler) {
                        if(this.machineState.gpioState.PORTS[msg.port].DIR !== msg.DIR) {
                            QemuConnector.onMachineStateChangeHandler({
                                module: "GPIO",
                                event: "dir_change",
                                port: msg.port,
                                old_dir: this.machineState.gpioState.PORTS[msg.port].DIR,
                                new_dir: msg.DIR,
                            });
                        }
                        if(this.machineState.gpioState.PORTS[msg.port].MASK !== msg.MASK) {
                            QemuConnector.onMachineStateChangeHandler({
                                module: "GPIO",
                                event: "mask_change",
                                port: msg.port,
                                old_mask: this.machineState.gpioState.PORTS[msg.port].MASK,
                                new_mask: msg.MASK,
                            });
                        }
                        if(this.machineState.gpioState.PORTS[msg.port].PIN !== msg.PIN) {
                            QemuConnector.onMachineStateChangeHandler({
                                module: "GPIO",
                                event: "pin_change",
                                port: msg.port,
                                old_pin: this.machineState.gpioState.PORTS[msg.port].PIN,
                                new_pin: msg.PIN,
                            });
                        }
                    }
                    this.machineState.gpioState.PORTS[msg.port].DIR = msg.DIR;
                    this.machineState.gpioState.PORTS[msg.port].MASK = msg.MASK;
                    this.machineState.gpioState.PORTS[msg.port].PIN = msg.PIN;
                }
            } else if(msg.module === "IOCON") {
                if(msg.event === "reg_change") {
                    const new_func = (msg.value & 0x7);
                    if(QemuConnector.onMachineStateChangeHandler) {
                        if(this.machineState.ioconState.PORTS[msg.port][msg.pin] !== new_func) {
                            QemuConnector.onMachineStateChangeHandler({
                                module: "IOCON",
                                event: "func_change",
                                port: msg.port,
                                pin: msg.pin,
                                old_func: this.machineState.ioconState.PORTS[msg.port][msg.pin],
                                new_func: new_func,
                            });
                        }
                    }
                    this.machineState.ioconState.PORTS[msg.port][msg.pin] = (msg.value & 0x7);
                }
            }
        }
    }

    static async start_qemu(exe_file: string) {
        this.machineState = new MachineState();

        const qemu = await qemu_lpc_ctrl.start_qemu(exe_file);
        qemu_lpc_ctrl.SenderMQ.open();
        qemu_lpc_ctrl.ReceiverMQ.open();

        qemu_lpc_ctrl.ReceiverMQ.set_receive_handler((msg) => {
            this.updateMachineState(msg);
            if(QemuConnector.eventHandler !== undefined) {
                QemuConnector.eventHandler(msg);
            }
        });

        return qemu;
    }

    static setEventHandler(handler: QemuEventHandler) {
        QemuConnector.eventHandler = handler;
    }

    static setOnMachineStateChangeHandler(handler: OnMachineStateChangeHandler) {
        QemuConnector.onMachineStateChangeHandler = handler;
    }

    static clearEventHandler() {
        QemuConnector.eventHandler = undefined;
    }

    static clearOnMachineStateChangeHandler() {
        QemuConnector.onMachineStateChangeHandler = undefined;
    }

}

export default QemuConnector;