import { DiagramListener, DiagramModel, LinkModelListener, PortModel } from '@projectstorm/react-diagrams';
import PeripheralNodeModel, { Peripheral_Type } from './PeripheralNodeModel';
import UltraSonicPortModel from '../Ports/UltraSonicPortModel';

function validateConnectedNodeType(port: PortModel, type: Peripheral_Type): boolean {
    let vcc_links = port.getLinks();
    if(Object.keys(vcc_links).length === 0) return false;
    let src_port = Object.values(vcc_links)[0].getSourcePort();
    let target_port;
    if(src_port === port) {
        target_port = Object.values(vcc_links)[0].getTargetPort();
    } else {
        target_port = src_port;
        src_port = Object.values(vcc_links)[0].getTargetPort();
    }
    if(!target_port) return false;
    if((target_port.getNode() as PeripheralNodeModel).PERIPHAREL_TYPE !== type) {
        return false;
    }
    return true;
}

export default class UltraSonicNodeModel extends PeripheralNodeModel {

    static ObstacleDistance: number = 1;

    constructor(locked: boolean, x: number, y: number, model: DiagramModel) {
        super({ name: "UltraSonic", color: "rgb(64, 128, 255)" });
        this.addOutPort("Vcc");
        const trig_port = this.addOutPort("Trig");
        const echo_port = this.addOutPort("Echo");
        this.addOutPort("GND");
        this.setPosition(x, y);
        this.setLocked(locked);

        model.registerListener({
            linksUpdated: (ev) => {
                if(ev.isCreated) {
                    ev.link.registerListener({
                        sourcePortChanged: (ev) => {
                            if(ev.port === trig_port && validateConnectedNodeType(trig_port, Peripheral_Type.Chip)) {
                                // TODO setup listener for connected port and pin
                            }
                        }
                    } as LinkModelListener);
                }
            }
        } as DiagramListener);
        

        PeripheralNodeModel.all_peripherals.push(this);
        this.PERIPHAREL_TYPE = Peripheral_Type.UltraSonic;
    }

    addInPort(label: string): UltraSonicPortModel {
        const port = new UltraSonicPortModel(true, label, label);
        this.addPort(port);
        return port;
    }

    addOutPort(label: string): UltraSonicPortModel {
        const port = new UltraSonicPortModel(false, label, label);
        this.addPort(port);
        return port;
    }

    followConnection(port_id: string): PortModel[] {
        return [];
    }

    checkConnectionsValid(): boolean {
        return validateConnectedNodeType(this.getOutPorts()[0], Peripheral_Type.Voltage) &&
            validateConnectedNodeType(this.getOutPorts()[3], Peripheral_Type.Ground);
    }

    getOtherConnections(port_id: string): string[][] {
        let connections: string[][] = [];

        let links_Vcc = this.getOutPorts()[0].getLinks();
        PeripheralNodeModel.linkConnect(links_Vcc, this.getID(), port_id, connections);

        /*let links_Trig = this.getOutPorts()[1].getLinks();
        PeripheralNodeModel.linkConnect(links_Trig, this.getID(), port_id, connections);*/

        let links_Echo = this.getOutPorts()[2].getLinks();
        PeripheralNodeModel.linkConnect(links_Echo, this.getID(), port_id, connections);

        let links_GND = this.getOutPorts()[3].getLinks();
        PeripheralNodeModel.linkConnect(links_GND, this.getID(), port_id, connections);

        return connections;
    }
 
} 