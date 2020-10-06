import { DefaultNodeModel, LinkModel } from '@projectstorm/react-diagrams';
/*
enum Peripheral_Type {
    Chip,
    Ground,
    Voltage,
    Resistance,
    LED,
    UltraSonic,
    Switch
}
*/
export default class PeripheralNodeModel extends DefaultNodeModel {

    PERIPHAREL_TYPE: number = -1;
    static all_peripherals: PeripheralNodeModel[] = [];
    static chips: PeripheralNodeModel[] = [];

    updateColour (colour: string) {
        this.options.color = colour;
    }

    getName(): string {
        return this.options.name as string;
    }

    getOtherConnections(port_name: string): string[][] {
        let connections: string[][] = [];
        return connections;
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

} 