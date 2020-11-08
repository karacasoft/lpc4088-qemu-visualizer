import { PortModel, PortModelGenerics } from '@projectstorm/react-diagrams';
import PeripheralNodeModel, { Peripheral_Type } from './PeripheralNodeModel';

export default class JoystickNodeModel extends PeripheralNodeModel {

    up_pressed: boolean = false;
    down_pressed: boolean = false;
    left_pressed: boolean = false;
    right_pressed: boolean = false;
    center_pressed: boolean = false;

    constructor() {
        super({ type: "joystick" });
        this.addInPort("Common");
        this.addOutPort("Up");
        this.addOutPort("Down");
        this.addOutPort("Left");
        this.addOutPort("Right");
        this.addOutPort("Center");
        PeripheralNodeModel.all_peripherals.push(this);
        this.PERIPHAREL_TYPE = Peripheral_Type.Joystick;
    }

    followConnection(port_id: string): PortModel<PortModelGenerics>[] {
        const curr_port = Object.values(this.getPorts()).find(p => p.getID() === port_id);
        switch(curr_port?.getName()) {
            case "Up":
                if(this.up_pressed) return [this.getInPorts()[0]];
                else return [curr_port];
            case "Down":
                if(this.down_pressed) return [this.getInPorts()[0]];
                else return [curr_port];
            case "Left":
                if(this.left_pressed) return [this.getInPorts()[0]];
                else return [curr_port];
            case "Right":
                if(this.right_pressed) return [this.getInPorts()[0]];
                else return [curr_port];
            case "Center":
                if(this.center_pressed) return [this.getInPorts()[0]];
                else return [curr_port];
        }
        return [];
    }

}