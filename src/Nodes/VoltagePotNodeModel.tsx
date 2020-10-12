import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel from './PeripheralNodeModel';
import VoltagePotPortModel from '../Ports/VoltagePotPortModel';

export default class VoltagePotNodeModel extends PeripheralNodeModel {

    constructor(locked: boolean, x: number, y: number, model: DiagramModel) {
        super({ name: "Voltage Pot", color: "rgb(0, 192, 192)" });
        this.addInPort("Voltage");
        this.addOutPort("Chip");
        this.addOutPort("Ground");
        this.setPosition(x, y);
        if (locked === true) {
            this.setLocked();
            this.registerListener(
                {
                    selectionChanged: () => {
                        if (this.isSelected()) {
                            let node = new VoltagePotNodeModel(false, x, y + 400, model);
                            model.addNode(node);
                            PeripheralNodeModel.all_peripherals.push(node);
                        }
                    }
                }
            );
        }
        this.PERIPHAREL_TYPE = 8;
    }

    addInPort(label: string): VoltagePotPortModel {
        const port = new VoltagePotPortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): VoltagePotPortModel {
        const port = new VoltagePotPortModel(false, label, label);
        this.addPort(port);
        return port;
    }

    getOtherConnections(port_id: string): string[][] {
        let connections: string[][] = [];

        let links_Voltage = this.getInPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_Voltage, this.getID(), port_id, connections);

        /*let links_Chip = this.getOutPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_Chip, this.getID(), port_id, connections);*/

        let links_Ground = this.getOutPorts()[1].getLinks();
        PeripheralNodeModel.linkConnect(links_Ground, this.getID(), port_id, connections);

        return connections;
    }

} 