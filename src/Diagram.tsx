import {
    CanvasWidget,
    CanvasEngineListener
} from '@projectstorm/react-canvas-core';
import createEngine, {
    DefaultPortModel,
    DiagramEngine,
    DiagramListener,
    DiagramModel,
    LinkModelListener,
} from '@projectstorm/react-diagrams';
import { ipcRenderer } from 'electron';
import React from 'react';
import { MachineStateEventData, IOCONState } from './common/QemuConnectorTypes';
import { IOCON_LOOKUP_TABLE } from './common/IOCONLookup';
import CircuitSimulator from './CircuitSimulator';
import { LEDNodeFactory } from './CustomNodes/LEDNodeFactory';
import { SimplePortFactory } from './CustomNodes/SimplePortFactory';
import ChipNodeModel from './Nodes/ChipNodeModel';
import PeripheralNodeModel from './Nodes/PeripheralNodeModel';
import UltraSonicNodeModel from './Nodes/UltraSonicNodeModel';

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
    switch(state_update.module) {
        case "GPIO":
            if(state_update.event === "dir_change") {
                const port = state_update.port;
                for(let i = 0; i < 32; i++) {
                    let iocon_func = CircuitSimulator.iocon_state?.PORTS[port][i];
                    iocon_func = iocon_func ? iocon_func : 0;

                    const pinInput = !(state_update.new_dir & (1 << i));
                    const chip = PeripheralNodeModel.chips[port] as ChipNodeModel;
                    chip.GPIO_pin_directions[i] = pinInput;
                    if(IOCON_LOOKUP_TABLE[port][i][iocon_func]?.module === "GPIO") {
                        chip.pin_directions[i] = pinInput;
                    }
                }
            } else if(state_update.event === "mask_change") {
                // TODO ignore this update lul
            } else if(state_update.event === "pin_change") {
                const port = state_update.port;
                for(let i = 0; i < 32; i++) {
                    let iocon_func = CircuitSimulator.iocon_state?.PORTS[port][i];
                    iocon_func = iocon_func ? iocon_func : 0;

                    const pinVoltage = (!!(state_update.new_pin & (1 << i))) ? 3.3 : 0;
                    const chip = PeripheralNodeModel.chips[port] as ChipNodeModel;
                    chip.GPIO_pin_voltages_initial[i] = pinVoltage;
                    if(IOCON_LOOKUP_TABLE[port][i][iocon_func]?.module === "GPIO") {
                        chip.pin_voltages_initial[i] = pinVoltage;
                    }
                }
            }
            break;
        case "IOCON":
            console.log(state_update);
            if(state_update.event === "func_change") {
                
                if(CircuitSimulator.iocon_state !== null) {
                    CircuitSimulator.iocon_state.PORTS[state_update.port][state_update.pin] = state_update.new_func;
                }
            }
            break;
        case "TIMER":
            if(state_update.event === "emr_change") {
                if(CircuitSimulator._onTimerEMRChangeListener) {
                    CircuitSimulator._onTimerEMRChangeListener(state_update.timer_nr, state_update.old_emr, state_update.new_emr);
                }
            }
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
        CircuitSimulator.initializeSimulation();
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

        model.registerListener({
            linksUpdated: (ev) => {
                if(ev.isCreated) {
                    const l = (ev: any) => {
                        CircuitSimulator.startSimulation();
                        console.log((PeripheralNodeModel.chips[0] as ChipNodeModel).pin_voltages);
                    };
                    ev.link.registerListener({
                        sourcePortChanged: l,
                        targetPortChanged: l,
                        entityRemoved: l,
                    } as LinkModelListener);
                }
            },
        } as DiagramListener);

        

        ipcRenderer.on('exec-started', (ev, iocon) => {
            CircuitSimulator.initializeSimulation();
            CircuitSimulator.iocon_state = iocon as IOCONState;
        });

        ipcRenderer.on('on-machine-state-changed', (ev, state_change_ev) => {
            const m_state_change_ev = state_change_ev as MachineStateEventData;

            processMachineStateUpdate(m_state_change_ev);

            CircuitSimulator.startSimulation();
        });

        ipcRenderer.on('us-distance', (ev, val) => {
            UltraSonicNodeModel.ObstacleDistance = val;
        });

        CircuitSimulator.onInputChangeListener = (port, pin, val) => {
            if(CircuitSimulator.iocon_state) {
                const iocon_func = CircuitSimulator.iocon_state.PORTS[port][pin];
                console.log(iocon_func);
                if((IOCON_LOOKUP_TABLE[port][pin][iocon_func]?.module === "GPIO")) {
                    
                    ipcRenderer.send("gpio-pin-change", port, pin, (val > 2.0) ? 1 : 0);
                }
            }
            
        };
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