import {
    CanvasWidget
} from '@projectstorm/react-canvas-core';
import createEngine, {
    DefaultPortModel,
    DiagramEngine,
    DiagramModel
} from '@projectstorm/react-diagrams';
import { ipcRenderer } from 'electron';
import React from 'react';
import { MachineStateEventData } from '../common/QemuConnectorTypes';
import CircuitSimulator from './CircuitSimulator';
import { LEDNodeFactory } from './CustomNodes/LEDNodeFactory';
import { SimplePortFactory } from './CustomNodes/SimplePortFactory';
import ChipNodeModel from './Nodes/ChipNodeModel';
import PeripheralNodeModel from './Nodes/PeripheralNodeModel';

interface MyProps {
}
  
interface MyState {
    initialized: boolean;

    ultraSonic: number;
    light: number;
    message: string;
    info: string;
}

let model = new DiagramModel();
let engine: DiagramEngine = createEngine({ registerDefaultZoomCanvasAction: false });
engine.getPortFactories().registerFactory(
    new SimplePortFactory('led', (config) => new DefaultPortModel(config))
);
engine.getNodeFactories().registerFactory(new LEDNodeFactory()); 

export function getModel() { return model; }
export function getEngine() { return engine; }

function processMachineStateUpdate(state_update: MachineStateEventData) {
    console.log("machine updated");
    switch(state_update.module) {
        case "GPIO":
            if(state_update.event === "dir_change") {
                const port = state_update.port;
                for(let i = 0; i < 32; i++) {
                    const pinInput = !(state_update.new_dir & (1 << i));
                    const chip = PeripheralNodeModel.chips[port] as ChipNodeModel;
                    chip.pin_directions[i] = pinInput;
                }
            } else if(state_update.event === "mask_change") {
                // TODO ignore this update lul
            } else if(state_update.event === "pin_change") {
                const port = state_update.port;
                for(let i = 0; i < 32; i++) {
                    const pinVoltage = (!!(state_update.new_pin & (1 << i))) ? 3.3 : 0;
                    const chip = PeripheralNodeModel.chips[port] as ChipNodeModel;
                    chip.pin_voltages_initial[i] = pinVoltage;
                }
            }
            break;
        case "IOCON":
            if(state_update.event === "func_change") {
                // TODO need to retrieve machine state according to
                // updated function of the pin
            }
            break;
        default:
            
            break;
    }
    getEngine().repaintCanvas();
}

export default class CircuitDisplay extends React.Component<MyProps, MyState> {

    constructor(props: any) {
        // React preparation \\
        super(props);
        this.state = {
            initialized: false,

            ultraSonic: 1,
            light: 1,
            message: "",
            info: "All information will be displayed here."
        };
    }

    componentDidMount() {
        let prev_height = 100;
        for(let i = 0; i < 5; i++) {
            const port = new ChipNodeModel(true, 600, prev_height, model, i);
            prev_height += 550;
            model.addNode(port);
        }
        
        engine.setModel(model);
        this.setState({
            initialized: true,
        });

        ipcRenderer.on('on-machine-state-changed', (ev, state_change_ev) => {
            const m_state_change_ev = state_change_ev as MachineStateEventData;

            processMachineStateUpdate(m_state_change_ev);

            CircuitSimulator.startSimulation();
        });
    }

    render() {
        //console.log(this.engine.getModel());
        if(engine.getModel() !== null) {
            return (<CanvasWidget
                engine={engine}
                className={"diagram"}/>);
        }
        return null;
    }

}