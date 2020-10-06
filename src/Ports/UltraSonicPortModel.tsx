import { PortModel } from '@projectstorm/react-diagrams';
import PeripheralPortModel from './PeripheralPortModel';

export default class UltraSonicPortModel extends PeripheralPortModel {

    canLinkToPort(port: PortModel): boolean {

		if (port instanceof PeripheralPortModel) {

            if (this.options.in === port.getOptions().in) {
                return false;
            }

            let links = this.getLinks();
            for (let link of Object.values(links)) {
                if (link.getSourcePort() !== null && link.getTargetPort() !== null) {
                    return false;
                }
            }

            return port.canLinkToPortAsTarget();

        }
        
        return true;

    }

    canLinkToPortAsTarget(): boolean {

        let links = this.getLinks();
        for (let link of Object.values(links)) {
            if (link.getSourcePort() !== null && link.getTargetPort() !== null) {
                return false;
            }
        }

        return true;

    }
}