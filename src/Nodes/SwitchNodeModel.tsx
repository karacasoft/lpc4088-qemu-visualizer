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

    getOtherConnections(port_name: string): string[][] {
        let connections: string[][] = [];

        if (Object.values(this.getInPorts()[0].getLinks()).length > 0){
            if (port_name !== this.getInPorts()[0].getName()) {
                let source_port = Object.values(this.getInPorts()[0].getLinks())[0].serialize().sourcePort;
                if (source_port !== null) {
                    let connect: string[] = [];
                    connect.push((Object.values(this.getInPorts()[0].getLinks())[0].getSourcePort().getParent() as PeripheralNodeModel).getName());
                    connect.push(Object.values(this.getInPorts()[0].getLinks())[0].serialize().source);
                    connect.push(Object.values(this.getInPorts()[0].getLinks())[0].getSourcePort().serialize().name);
                    connect.push(Object.values(this.getInPorts()[0].getLinks())[0].serialize().sourcePort);
                    connect.push(this.getName());
                    connect.push(this.getID());
                    connect.push(this.getInPorts()[0].getName());
                    connect.push(this.getInPorts()[0].getID());
                    connections.push(connect);
                }
            }
        }

        if (Object.values(this.getOutPorts()[0].getLinks()).length > 0){
            if (port_name !== this.getOutPorts()[0].getName()) {
                let target_port = Object.values(this.getOutPorts()[0].getLinks())[0].serialize().targetPort;
                if (target_port !== null) {
                    let connect: string[] = [];
                    connect.push(this.getName());
                    connect.push(this.getID());
                    connect.push(this.getOutPorts()[0].getName());
                    connect.push(this.getOutPorts()[0].getID());
                    connect.push((Object.values(this.getOutPorts()[0].getLinks())[0].getTargetPort().getParent() as PeripheralNodeModel).getName());
                    connect.push(Object.values(this.getOutPorts()[0].getLinks())[0].serialize().target);
                    connect.push(Object.values(this.getOutPorts()[0].getLinks())[0].getTargetPort().serialize().name);
                    connect.push(Object.values(this.getOutPorts()[0].getLinks())[0].serialize().targetPort);
                    connections.push(connect);
                }
            }
        }

        return connections;
    }
    
} 