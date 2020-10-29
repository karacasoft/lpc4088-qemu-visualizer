import { DiagramListener, DiagramModel, LinkModelListener, PortModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel, { Peripheral_Type } from './PeripheralNodeModel';
import UltraSonicPortModel from '../Ports/UltraSonicPortModel';
import ChipNodeModel from './ChipNodeModel';
import CircuitSimulator from '../CircuitSimulator';
import { IOCON_LOOKUP_TABLE } from '../common/IOCONLookup';
import { ipcRenderer } from 'electron';

function getConnectedPort(port: PortModel): PortModel | undefined {
    const trig_port_links = Object.values(port.getLinks());

    if(trig_port_links.length !== 1) return undefined;
    let src_port = trig_port_links[0].getSourcePort();
    let target_port;
    if(src_port === port) target_port = trig_port_links[0].getTargetPort();
    else {
        target_port = src_port;
        src_port = trig_port_links[0].getSourcePort();
    }
    return target_port;
}

function validateNodeType(port: PortModel, type: Peripheral_Type): boolean {
    return (port.getNode() as PeripheralNodeModel).PERIPHAREL_TYPE === type;
}

function validateConnectedNodeType(port: PortModel, type: Peripheral_Type): boolean {
    let target_port = getConnectedPort(port);
    if(target_port === undefined || target_port === null) return false;
    return validateNodeType(target_port, type);
}

function getIOCON(chip: ChipNodeModel, port: PortModel) {
    if(CircuitSimulator.iocon_state !== null) {
        const port_nr = chip.lpc_4088_port;
        const pin_nr = parseInt(port.getName());

        const pin_func = CircuitSimulator.iocon_state.PORTS[port_nr][pin_nr];
        const lookup = IOCON_LOOKUP_TABLE[port_nr][pin_nr][pin_func];
        return lookup;
    }
    return undefined;
}

export default class UltraSonicNodeModel extends PeripheralNodeModel {

    private _connected: boolean = false;

    static ObstacleDistance: number = 30;

    private _trig_timer_nr: number = 0;
    private _trig_timer_pin: number = 0;

    private _echo_timer_nr: number = 0;
    private _echo_timer_pin: number = 0;

    _rising_edge_sent: boolean = false;


    private check_trig_port_connected_correctly() {
        const trig_port = this.getOutPorts()[1];
        const trig_conn_port = getConnectedPort(trig_port);
        if(trig_conn_port === undefined || trig_conn_port === null) return false;

        if(!validateNodeType(trig_conn_port, Peripheral_Type.Chip)) return false;
        const trig_chip = (trig_conn_port.getNode() as ChipNodeModel);
        const trig_iocon = getIOCON(trig_chip, trig_conn_port);
        if(trig_iocon === undefined) return false;
        if(trig_iocon.module === "TIMER" && trig_iocon.type === "match") {
            this._trig_timer_nr = trig_iocon.timer_name;
            this._trig_timer_pin = trig_iocon.pin_nr;
            return true;
        }
        return false;
    }

    private check_echo_port_connected_correctly() {
        const echo_port = this.getOutPorts()[2];
        const echo_conn_port = getConnectedPort(echo_port);
        if(echo_conn_port === undefined || echo_conn_port === null) return false;

        if(!validateNodeType(echo_conn_port, Peripheral_Type.Chip)) return false;
        const echo_chip = (echo_conn_port.getNode() as ChipNodeModel);
        const echo_iocon = getIOCON(echo_chip, echo_conn_port);
        if(echo_iocon === undefined) return false;
        if(echo_iocon.module === "TIMER" && echo_iocon.type === "capture") {
            this._echo_timer_nr = echo_iocon.timer_name;
            this._echo_timer_pin = echo_iocon.pin_nr;
            return true;
        }
        return false;
    }

    /*
     * level = 1 sends a rising edge
     * level = 0 sends a falling edge
     */
    send_echo(level: 0 | 1) {
        ipcRenderer.send("timer-capture", this._echo_timer_nr, this._echo_timer_pin, level);
    }

    check_chip_connected_correctly() {
        return validateConnectedNodeType(this.getOutPorts()[0], Peripheral_Type.Voltage) &&
            this.check_trig_port_connected_correctly() &&
            this.check_echo_port_connected_correctly() &&
            validateConnectedNodeType(this.getOutPorts()[3], Peripheral_Type.Ground);
    }

    register_listeners_if_chip_connected_correctly() {
        const _this = this;
        const chip_connected_correctly = this.check_chip_connected_correctly();
        if(chip_connected_correctly && !this._connected) {
            this._connected = true;
            CircuitSimulator._onTimerEMRChangeListener = (timer, old_val, emr_val) => {
                if(timer === this._trig_timer_nr && !(old_val & (1 << this._trig_timer_pin)) && (emr_val & (1 << this._trig_timer_pin))) {
                    if(!_this._rising_edge_sent) {
                        _this._rising_edge_sent = true;
                        _this.send_echo(1);
                        const start_time = process.hrtime();
                        setImmediate(() => {
                            const wait_time = (UltraSonicNodeModel.ObstacleDistance / 34) * 2000000;
                            let time_passed;
                            do {
                                const curr_time = process.hrtime();
                                time_passed = ((curr_time[0] - start_time[0]) * 1000000000) + (curr_time[1] - start_time[1]);
                            } while(time_passed < wait_time);
                            _this._rising_edge_sent = false;
                            _this.send_echo(0);
                        });
                    }
                }
            }
        } else if(!chip_connected_correctly && this._connected) {
            this._connected = false;
            CircuitSimulator._onTimerEMRChangeListener = undefined;
        }
        
    }

    constructor(locked: boolean, x: number, y: number, model: DiagramModel) {
        super({ name: "UltraSonic", color: "rgb(64, 128, 255)" });
        this.addOutPort("Vcc");
        this.addOutPort("Trig");
        this.addOutPort("Echo");
        this.addOutPort("GND");
        this.setPosition(x, y);
        this.setLocked(locked);

        this.register_listeners_if_chip_connected_correctly = this.register_listeners_if_chip_connected_correctly.bind(this);

        const l_handle = model.registerListener({
            linksUpdated: (ev) => {
                this.register_listeners_if_chip_connected_correctly();
                if(ev.isCreated) {
                    ev.link.registerListener({
                        sourcePortChanged: this.register_listeners_if_chip_connected_correctly,
                        targetPortChanged: this.register_listeners_if_chip_connected_correctly,
                    } as LinkModelListener);
                }
            }
        } as DiagramListener);

        // Since the listener registered to the model persists,
        // we have to clear it when ultrasonic sensor is removed
        this.registerListener({
            entityRemoved: () => {
                model.deregisterListener(l_handle);
            }
        })
        

        PeripheralNodeModel.all_peripherals.push(this);
        this.PERIPHAREL_TYPE = Peripheral_Type.UltraSonic;
    }

    addInPort(label: string): UltraSonicPortModel {
        const port = new UltraSonicPortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): UltraSonicPortModel {
        const port = new UltraSonicPortModel(false, label, label);
        this.addPort(port);
        return port;
    }

    followConnection(port_id: string): PortModel[] {
        return [];
    }

    checkConnectionsValid(): boolean {
        return validateConnectedNodeType(this.getOutPorts()[0], Peripheral_Type.Voltage) &&
            validateConnectedNodeType(this.getOutPorts()[3], Peripheral_Type.Ground);
    }

    getOtherConnections(port_id: string): string[][] {
        let connections: string[][] = [];

        let links_Vcc = this.getOutPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_Vcc, this.getID(), port_id, connections);

        /*let links_Trig = this.getOutPorts()[1].getLinks();
        PeripheralNodeModel.linkConnect(links_Trig, this.getID(), port_id, connections);*/

        let links_Echo = this.getOutPorts()[2].getLinks();
        PeripheralNodeModel.linkConnect(links_Echo, this.getID(), port_id, connections);

        let links_GND = this.getOutPorts()[3].getLinks();
        PeripheralNodeModel.linkConnect(links_GND, this.getID(), port_id, connections);

        return connections;
    }
 
} 