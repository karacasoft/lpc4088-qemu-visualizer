import { DiagramModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel, { Peripheral_Type } from './PeripheralNodeModel';
import SwitchPortModel from '../Ports/SwitchPortModel';

export default class SwitchNodeModel extends PeripheralNodeModel {

    constructor(locked: boolean, x: number, y: number, model: DiagramModel) {
        super({ name: "Switch", color: "rgb(255, 64, 128)" });
        this.addInPort("Voltage");
        this.addInPort("Select");
        this.addOutPort("Chip");
        this.addOutPort("Ground");
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