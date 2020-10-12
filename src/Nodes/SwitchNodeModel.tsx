import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel from './PeripheralNodeModel';
import SwitchPortModel from '../Ports/SwitchPortModel';

export default class SwitchNodeModel extends PeripheralNodeModel {

    constructor(locked: boolean, x: number, y: number, model: DiagramModel) {
        super({ name: "Switch", color: "rgb(128, 96, 64)" });
        this.addInPort("0");
        this.addInPort("1");
        this.addOutPort("Selector");
        this.addOutPort("Voltage");
        this.setPosition(x, y);
        if (locked === true) {
            this.setLocked();
            this.registerListener(
                {
                    selectionChanged: () => {
                        if (this.isSelected()) {
                            let node = new SwitchNodeModel(false, x, y + 400, model)
                            model.addNode(node);
                            PeripheralNodeModel.all_peripherals.push(node);
                        }
                    }
                }
            );
        }
        this.PERIPHAREL_TYPE = 6;
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

    getOtherConnections(port_id: string): string[][] {
        let connections: string[][] = [];

        let links_Selector = this.getOutPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_Selector, this.getID(), port_id, connections);

        let links_Voltage = this.getOutPorts()[1].getLinks();
        PeripheralNodeModel.linkConnect(links_Voltage, this.getID(), port_id, connections);

        if (connections.length === 1) {
            connections.push([]);
        }

        let links_0 = this.getInPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_0, this.getID(), port_id, connections);

        if (connections.length === 2) {
            connections.push([]);
        }

        let links_1 = this.getInPorts()[1].getLinks();
        PeripheralNodeModel.linkConnect(links_1, this.getID(), port_id, connections);

        if (connections.length === 3) {
            connections.push([]);
        }
        
        return connections;
    }
    
} 