import React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { GenerateWidgetEvent, GenerateModelEvent } from '@projectstorm/react-canvas-core';
import SwitchNodeModel from '../Nodes/SwitchNodeModel';
import SwitchNodeWidget from './SwitchNodeWidget';

export default class SwitchNodeFactory extends AbstractReactFactory<SwitchNodeModel, DiagramEngine> {
    constructor() {
        super('switch');
    }

    generateReactWidget(event: GenerateWidgetEvent<SwitchNodeModel>) {
        return <SwitchNodeWidget node={event.model} engine={this.engine} />
    }

    generateModel(event: GenerateModelEvent) {
        return new SwitchNodeModel(true, 0, 0);
    }
}