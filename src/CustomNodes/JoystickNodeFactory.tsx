import React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { GenerateWidgetEvent, GenerateModelEvent } from '@projectstorm/react-canvas-core';
import JoystickNodeModel from '../Nodes/JoystickNodeModel';
import JoystickNodeWidget from './JoystickNodeWidget';

export default class JoystickNodeFactory extends AbstractReactFactory<JoystickNodeModel, DiagramEngine> {
    constructor() {
        super('joystick');
    }

    generateReactWidget(event: GenerateWidgetEvent<JoystickNodeModel>) {
        return <JoystickNodeWidget node={event.model} engine={this.engine} />
    }

    generateModel(event: GenerateModelEvent) {
        return new JoystickNodeModel(0, 0);
    }
}