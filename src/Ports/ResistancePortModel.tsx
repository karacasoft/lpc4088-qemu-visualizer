import { PortModel } from '@projectstorm/react-diagrams';
import PeripheralPortModel from './PeripheralPortModel';

export default class ResistancePortModel extends PeripheralPortModel {

    canLinkToPort(port: PortModel): boolean {
		if (port instanceof PeripheralPortModel) {
            if (this.options.in === port.getOptions().in) {
                return false;
            }
            if (Object.values(this.getLinks()).length > 1) {
                return false;
            }
            return port.canLinkToPortAsTarget();
		}
        return true;
    }

    canLinkToPortAsTarget(): boolean {
        if (Object.values(this.getLinks()).length > 0) {
            return false;
        }
        return true;
    }

}