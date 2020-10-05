import { DefaultNodeModel } from '@projectstorm/react-diagrams';
/*
enum Peripheral_Type {
    Chip,
    Ground,
    Voltage,
    Resistance,
    LED
}
*/
export default class PeripheralNodeModel extends DefaultNodeModel {

    PERIPHAREL_TYPE: number = -1;
    static all_peripherals: PeripheralNodeModel[] = [];
    static chips: PeripheralNodeModel[] = [];

    updateColour (colour: string) {
        this.options.color = colour;
    }

    getName () : string {
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

} 