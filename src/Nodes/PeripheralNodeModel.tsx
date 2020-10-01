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

} 