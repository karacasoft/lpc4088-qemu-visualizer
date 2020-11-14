import { DefaultNodeModel, LinkModel, PortModel } from '@projectstorm/react-diagrams';
import { DeserializeEvent,  } from '@projectstorm/react-canvas-core';

export enum Peripheral_Type {
    None,
    Chip,
    Ground,
    Voltage,
    Resistance,
    LED,
    UltraSonic,
    Switch,
    LDR,
    VoltagePot,
    Hand,
    Joystick,
    Junction,
}

export default class PeripheralNodeModel extends DefaultNodeModel {

    PERIPHAREL_TYPE: Peripheral_Type = Peripheral_Type.None;
    static all_peripherals: PeripheralNodeModel[] = [];
    static chips: PeripheralNodeModel[] = [];

    remove() {
        super.remove();
        const nodeModel = this;
        PeripheralNodeModel.all_peripherals = PeripheralNodeModel.all_peripherals.filter((element) => {
            return element !== nodeModel;
        });
        PeripheralNodeModel.chips = PeripheralNodeModel.chips.filter((element) => {
            return element !== nodeModel;
        });
	}

    serialize() {
        const serialized = super.serialize();
        serialized["PERIPHAREL_TYPE"] = this.PERIPHAREL_TYPE;
        return serialized;
    }

    deserialize(ev: DeserializeEvent<this>) {
        super.deserialize(ev);
        this.PERIPHAREL_TYPE = ev.data["PERIPHAREL_TYPE"];
    }

    updateColour (colour: string) {
        this.options.color = colour;
    }

    getName(): string {
        return this.options.name as string;
    }

    getOtherConnections(port_id: string): string[][] {
        let connections: string[][] = [];
        return connections;
    }

    followConnection(port_id: string): PortModel[] {
        const other_port_ids = Object.values(this.getPorts()).map(x => x.getID()).filter(x => x !== port_id);
        const other_ports = other_port_ids.map(x => {
            return Object.values(this.getPorts()).find(y => y.getID() === x) as PortModel;
        });
        return other_ports;
    }

    static getPeripheral(node_id: string) {
        for (let peripheral of PeripheralNodeModel.all_peripherals) {
            if (node_id === peripheral.getID()) {
                return peripheral;
            }
        }
        return null;
    }

    static getChip(node_id: string) {
        for (let chip of PeripheralNodeModel.chips) {
            if (node_id === chip.getID()) {
                return chip;
            }
        }
        return null;
    }

    static linkSourceTarget(link: LinkModel): string[] {
        let connect: string[] = [];
        connect.push((link.getSourcePort().getNode() as PeripheralNodeModel).getName());
        connect.push(link.getSourcePort().getNode().getID());
        connect.push(link.getSourcePort().getName());
        connect.push(link.getSourcePort().getID());
        connect.push((link.getTargetPort().getNode() as PeripheralNodeModel).getName());
        connect.push(link.getTargetPort().getNode().getID());
        connect.push(link.getTargetPort().getName());
        connect.push(link.getTargetPort().getID());
        return connect;
    }

    static linkTargetSource(link: LinkModel): string[] {
        let connect: string[] = [];
        connect.push((link.getTargetPort().getNode() as PeripheralNodeModel).getName());
        connect.push(link.getTargetPort().getNode().getID());
        connect.push(link.getTargetPort().getName());
        connect.push(link.getTargetPort().getID());
        connect.push((link.getSourcePort().getNode() as PeripheralNodeModel).getName());
        connect.push(link.getSourcePort().getNode().getID());
        connect.push(link.getSourcePort().getName());
        connect.push(link.getSourcePort().getID());
        return connect;
    }

    static linkConnect(links: {[id: string]: LinkModel;}, node_id: string, port_id: string, connections: string[][]) {
        for (let link of Object.values(links)) {
            if (link.getSourcePort() !== null && link.getTargetPort() !== null && link.getSourcePort().getID() !== port_id && link.getTargetPort().getID() !== port_id) {
                if (link.getSourcePort().getNode().getID() === node_id) {
                    let connect: string[] = [];
                    connect.push((link.getSourcePort().getNode() as PeripheralNodeModel).getName());
                    connect.push(link.getSourcePort().getNode().getID());
                    connect.push(link.getSourcePort().getName());
                    connect.push(link.getSourcePort().getID());
                    connect.push((link.getTargetPort().getNode() as PeripheralNodeModel).getName());
                    connect.push(link.getTargetPort().getNode().getID());
                    connect.push(link.getTargetPort().getName());
                    connect.push(link.getTargetPort().getID());
                    connections.push(connect);
                }
                else {
                    let connect: string[] = [];
                    connect.push((link.getTargetPort().getNode() as PeripheralNodeModel).getName());
                    connect.push(link.getTargetPort().getNode().getID());
                    connect.push(link.getTargetPort().getName());
                    connect.push(link.getTargetPort().getID());
                    connect.push((link.getSourcePort().getNode() as PeripheralNodeModel).getName());
                    connect.push(link.getSourcePort().getNode().getID());
                    connect.push(link.getSourcePort().getName());
                    connect.push(link.getSourcePort().getID());
                    connections.push(connect);
                }
            }
        }
    }

} 