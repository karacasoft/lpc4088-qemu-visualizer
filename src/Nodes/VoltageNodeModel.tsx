import { DiagramModel, PortModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel, { Peripheral_Type } from './PeripheralNodeModel';
import VoltagePortModel from '../Ports/VoltagePortModel';

export default class VoltageNodeModel extends PeripheralNodeModel {

    voltage = 0;

    constructor(locked: boolean, x: number, y: number, model: DiagramModel, voltage: number) {
        super({ name: voltage + "V Voltage", color: "rgb(192, 0, 0)", type: "peripheral"  });
        this.addInPort("<=");
        this.addOutPort("=>");
        this.setPosition(x, y);
        this.setLocked(locked);
        PeripheralNodeModel.all_peripherals.push(this);
        this.PERIPHAREL_TYPE = Peripheral_Type.Voltage;
        this.voltage = voltage;
    }

    followConnection(port_id: string): PortModel[] {
        return [];
    }

    addInPort(label: string): VoltagePortModel {
        const port = new VoltagePortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): VoltagePortModel {
        const port = new VoltagePortModel(false, label, label);
        this.addPort(port);
        return port;
    }

} 