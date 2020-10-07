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
        for (let link of Object.values(links_Selector)) {
            if (link.getSourcePort() !== null && link.getTargetPort() !== null) {
                if (link.getSourcePort().getNode().getID() === this.getID()) {
                    connections.push(PeripheralNodeModel.linkSourceTarget(link));
                }
                else {
                    connections.push(PeripheralNodeModel.linkTargetSource(link));
                }
            }
        }

        let links_Voltage = this.getOutPorts()[1].getLinks();
        for (let link of Object.values(links_Voltage)) {
            if (link.getSourcePort() !== null && link.getTargetPort() !== null) {
                if (link.getSourcePort().getNode().getID() === this.getID()) {
                    connections.push(PeripheralNodeModel.linkSourceTarget(link));
                }
                else {
                    connections.push(PeripheralNodeModel.linkTargetSource(link));
                }
            }
        }

        if (connections.length === 1) {
            connections.push([]);
        }

        let links_0 = this.getInPorts()[0].getLinks();
        for (let link of Object.values(links_0)) {
            if (link.getSourcePort() !== null && link.getTargetPort() !== null) {
                if (link.getSourcePort().getNode().getID() === this.getID()) {
                    connections.push(PeripheralNodeModel.linkSourceTarget(link));
                }
                else {
                    connections.push(PeripheralNodeModel.linkTargetSource(link));
                }
            }
        }

        if (connections.length === 2) {
            connections.push([]);
        }

        let links_1 = this.getInPorts()[1].getLinks();
        for (let link of Object.values(links_1)) {
            if (link.getSourcePort() !== null && link.getTargetPort() !== null) {
                if (link.getSourcePort().getNode().getID() === this.getID()) {
                    connections.push(PeripheralNodeModel.linkSourceTarget(link));
                }
                else {
                    connections.push(PeripheralNodeModel.linkTargetSource(link));
                }
            }
        }

        if (connections.length === 3) {
            connections.push([]);
        }
        
        return connections;
    }
    
} 