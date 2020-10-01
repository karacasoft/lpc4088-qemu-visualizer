import { DefaultPortModel } from '@projectstorm/react-diagrams';

export default class PeripheralPortModel extends DefaultPortModel {
	/*constructor(isIn: boolean, name?: string, label?: string) {
        super(isIn, name, label);
    }*/

    canLinkToPortAsTarget(): boolean {
        return true;
    }
}