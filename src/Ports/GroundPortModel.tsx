import { PortModel } from '@projectstorm/react-diagrams';
import PeripheralPortModel from './PeripheralPortModel';

export default class GroundPortModel extends PeripheralPortModel {

    canLinkToPort(port: PortModel): boolean {
		if (port instanceof PeripheralPortModel) {
            if (this.options.in === port.getOptions().in) {
                return false;
            }
            return port.canLinkToPortAsTarget();
		}
        return true;
    }

    canLinkToPortAsTarget(): boolean {
        return true;
    }
}