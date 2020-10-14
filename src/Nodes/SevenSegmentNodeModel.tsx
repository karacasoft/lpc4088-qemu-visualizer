import { DiagramModel, DefaultLinkModel, DefaultNodeModel } from '@projectstorm/react-diagrams';
import GroundNodeModel from './GroundNodeModel';
import LEDNodeModel from './LEDNodeModel';
import PeripheralNodeModel from './PeripheralNodeModel';
import ResistanceNodeModel from './ResistanceNodeModel';

export default class SevenSegmentNodeModel extends PeripheralNodeModel {

    static state: boolean = false;
    static nodes: PeripheralNodeModel[] = [];
    static place: number[][] = [[800, 300], [750, 350], [850, 350], [800, 400], [750, 450], [850, 450], [800, 500]];
    
    constructor(open: boolean, x: number, y: number, model: DiagramModel) {
        if (open === true) {
            super({ name: "Open Seven Segment", color: "rgb(128, 64, 255)" });
        }
        else {
            super({ name: "Close Seven Segment", color: "rgb(255, 64, 128)" });
        }
        this.setPosition(x, y);
        this.setLocked();
        if (open === true) {
            this.registerListener(
                {
                    selectionChanged: () => {
                        if (this.isSelected()) {
                            if (SevenSegmentNodeModel.state === false) {
                                SevenSegmentNodeModel.state = true;
                                let resistance = new ResistanceNodeModel(false, 600, 400, model, 1000);
                                SevenSegmentNodeModel.nodes.push(resistance);
                                PeripheralNodeModel.all_peripherals.push(resistance);
                                model.addNode(resistance);
                                let ground = new GroundNodeModel(false, 500, 400, model);
                                SevenSegmentNodeModel.nodes.push(ground);
                                PeripheralNodeModel.all_peripherals.push(ground);
                                model.addNode(ground);
                                let link = ground.getOutPorts()[0].link<DefaultLinkModel>(resistance.getInPorts()[0]);
                                model.addLink(link);
                                for (let i = 0; i < 7; i ++) {
                                    let led = new LEDNodeModel(false, false, SevenSegmentNodeModel.place[i][0], SevenSegmentNodeModel.place[i][1], model, "G");
                                    SevenSegmentNodeModel.nodes.push(led);
                                    PeripheralNodeModel.all_peripherals.push(led);
                                    model.addNode(led);

                                    let link = resistance.getOutPorts()[0].link<DefaultLinkModel>(led.getInPorts()[0]);
                                    model.addLink(link);
                                }
                            }
                        }
                    }
                }
            );
        }
        else {
            this.registerListener(
                {
                    selectionChanged: () => {
                        if (this.isSelected()) {
                            if (SevenSegmentNodeModel.state === true) {
                                SevenSegmentNodeModel.state = false;
                                for (let node of SevenSegmentNodeModel.nodes) {
                                    node.remove();
                                }
                            }
                        }
                    }
                }
            );
        }
    }

}