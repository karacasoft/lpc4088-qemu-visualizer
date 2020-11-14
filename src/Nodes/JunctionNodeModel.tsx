import { DefaultPortModel, PortModel, PortModelAlignment, PortModelGenerics } from '@projectstorm/react-diagrams';
import PeripheralNodeModel, { Peripheral_Type } from './PeripheralNodeModel';

export default class JunctionNodeModel extends PeripheralNodeModel {



    constructor(x: number, y: number) {
        super({ type: "junction" });
        this.setPosition(x, y);
        this.addLeftPort();
        this.addRightPort();
        this.addUpPort();
        PeripheralNodeModel.all_peripherals.push(this);
        this.PERIPHAREL_TYPE = Peripheral_Type.Junction;
    }

    addLeftPort() {
        const port: DefaultPortModel = new DefaultPortModel({
            name: "left",
            alignment: PortModelAlignment.LEFT,
        });
        this.addPort(port);
        return port;
    }

    addRightPort() {
        const port = new DefaultPortModel({
            name: "right",
            alignment: PortModelAlignment.RIGHT,
        });
        this.addPort(port);
        return port;
    }

    addUpPort() {
        const port = new DefaultPortModel({
            name: "up",
            alignment: PortModelAlignment.TOP,
        });
        this.addPort(port);
        return port;
    }

    getPortByName(name: string) {
        return Object.values(this.getPorts()).find(p => p.getName() === name);
    }

    followConnection(port_id: string): PortModel<PortModelGenerics>[] {
        const curr_port = Object.values(this.getPorts()).find(p => p.getID() === port_id);
        switch(curr_port?.getName()) {
            case "up":
                return [
                    this.getPorts()["left"],
                    this.getPorts()["right"],
                ]
            case "left":
                return [
                    this.getPorts()["up"],
                    this.getPorts()["right"],
                ]
            case "right":
                return [
                    this.getPorts()["up"],
                    this.getPorts()["left"],
                ]
            default:
                return [];
        }
    }

}