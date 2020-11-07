import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel, { Peripheral_Type } from './PeripheralNodeModel';
import ResistancePortModel from '../Ports/ResistancePortModel';

export default class ResistanceNodeModel extends PeripheralNodeModel {

    resistance = 0;

    constructor(locked: boolean, x: number, y: number, model: DiagramModel, resistance: number) {
        super({ name: resistance + " Ω", color: "rgb(64, 64, 64)", type: "peripheral"  });
        this.addInPort("<=");
        this.addOutPort("=>");
        this.setPosition(x, y);
        this.setLocked(locked);
        PeripheralNodeModel.all_peripherals.push(this);
        this.PERIPHAREL_TYPE = Peripheral_Type.Resistance;
        this.resistance = resistance;
    }

    addInPort(label: string): ResistancePortModel {
        const port = new ResistancePortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): ResistancePortModel {
        const port = new ResistancePortModel(false, label, label);
        this.addPort(port);
        return port;
    }

    getOtherConnections(port_id: string): string[][] {
        let connections: string[][] = [];

        let links_left = this.getInPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_left, this.getID(), port_id, connections);

        let links_right = this.getOutPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_right, this.getID(), port_id, connections);

        return connections;
    }
    
} 