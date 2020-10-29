import qemu_lpc_ctrl, { QemuEventData } from 'qemu-lpc4088-controller';
import MachineState from './MachineState';
import { MachineStateEventData, timerOffsetToRegName } from '../../common/QemuConnectorTypes';

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
            } else if(msg.module === "TIMER") {
                if(msg.event === "emr_change") {
                    const new_emr = msg.value;
                    const old_emr = this.machineState.timerState["EMR"];
                    this.machineState.timerState["EMR"] = new_emr;
                    if(QemuConnector.onMachineStateChangeHandler) {
                        if(new_emr !== old_emr) {
                            QemuConnector.onMachineStateChangeHandler({
                                module: "TIMER",
                                event: "emr_change",
                                timer_nr: msg.timer_name,
                                old_emr,
                                new_emr,
                            });
                        }
                    }
                } else if(msg.event === "reg_change") {
                    const reg_name = timerOffsetToRegName(msg.reg_offset);
                    const new_reg = msg.value;
                    const old_reg = this.machineState.timerState[reg_name];
                    this.machineState.timerState[reg_name] = new_reg;
                    if(QemuConnector.onMachineStateChangeHandler) {
                        if(new_reg !== old_reg) {
                            QemuConnector.onMachineStateChangeHandler({
                                module: "TIMER",
                                event: "reg_change",
                                offset: msg.reg_offset,
                                timer_nr: msg.timer_name,
                                old_val: old_reg,
                                new_val: new_reg,
                            });
                            if(reg_name === "EMR") {
                                QemuConnector.onMachineStateChangeHandler({
                                    module: "TIMER",
                                    event: "emr_change",
                                    timer_nr: msg.timer_name,
                                    old_emr: old_reg,
                                    new_emr: new_reg,
                                });
                            }
                        }
                    }
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
        const orig_setOnExit = qemu.setOnExit;
        qemu.setOnExit = (onExit) => 
                orig_setOnExit((err?: Error) => {
                    qemu_lpc_ctrl.SenderMQ.close();
                    qemu_lpc_ctrl.ReceiverMQ.close();
                    onExit(err);
                });

        const orig_kill = qemu.kill;
        qemu.kill = () => {
            qemu_lpc_ctrl.SenderMQ.close();
            qemu_lpc_ctrl.ReceiverMQ.close();
            orig_kill();
        }
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