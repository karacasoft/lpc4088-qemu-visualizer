import { DiagramModel, PortModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel, { Peripheral_Type } from './PeripheralNodeModel';
import SwitchPortModel from '../Ports/SwitchPortModel';
import CircuitSimulator from '../CircuitSimulator';

export default class SwitchNodeModel extends PeripheralNodeModel {

    private _selectedInput: number = 0;

    get selectedInput(): number {
        return this._selectedInput;
    }

    set selectedInput(s: number) {
        this._selectedInput = s;
        CircuitSimulator.startSimulation();
    }

    constructor(locked: boolean, x: number, y: number) {
        super({ name: "Switch", color: "rgb(34, 120, 236)", type: "switch" });
        this.addInPort("In 1");
        this.addInPort("In 2");
        this.addOutPort("Out");
        this.setPosition(x, y);
        this.setLocked(locked);
        PeripheralNodeModel.all_peripherals.push(this);
        this.PERIPHAREL_TYPE = Peripheral_Type.Switch;
    }

    addInPort(label: string): SwitchPortModel {
        const port = new SwitchPortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): SwitchPortModel {
        const port = new SwitchPortModel(false, label, label);
        this.addPort(port);
        return port;
    }

    followConnection(port_id: string): PortModel[] {
        let other_port_ids: string[] = [];
        if(this.getOutPorts()[0].getID() === port_id) {
            other_port_ids.push(this.getInPorts()[this.selectedInput].getID());
        } else {
            other_port_ids.push(this.getOutPorts()[0].getID());
        }
        const other_ports = other_port_ids.map(x => {
            return Object.values(this.getPorts()).find(y => y.getID() === x) as PortModel;
        });
        return other_ports;
    }

    getOtherConnections(port_id: string): string[][] {
        let connections: string[][] = [];

        let links_Voltage = this.getInPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_Voltage, this.getID(), port_id, connections);

        let links_Value = this.getInPorts()[1].getLinks();
        PeripheralNodeModel.linkConnect(links_Value, this.getID(), port_id, connections);

        let links_Ground = this.getOutPorts()[1].getLinks();
        PeripheralNodeModel.linkConnect(links_Ground, this.getID(), port_id, connections);

        return connections;
    }
    
} 