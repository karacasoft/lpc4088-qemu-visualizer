import { DiagramModel, PortModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel, { Peripheral_Type } from './PeripheralNodeModel';
import GroundPortModel from '../Ports/GroundPortModel';

export default class GroundNodeModel extends PeripheralNodeModel {

    constructor(locked: boolean, x: number, y: number, model: DiagramModel) {
        super({ name: "Ground", color: "rgb(128, 128, 128)", type: "peripheral" });
        this.addInPort("<=");
        this.addOutPort("=>");
        this.setPosition(x, y);
        this.setLocked(locked);
        PeripheralNodeModel.all_peripherals.push(this);
        this.PERIPHAREL_TYPE = Peripheral_Type.Ground;
    }

    followConnection(port_id: string): PortModel[] {
        return [];
    }
    
    addInPort(label: string): GroundPortModel {
        const port = new GroundPortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): GroundPortModel {
        const port = new GroundPortModel(false, label, label);
        this.addPort(port);
        return port;
    }
    
} 