import React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { GenerateWidgetEvent, GenerateModelEvent } from '@projectstorm/react-canvas-core';
import JunctionNodeModel from '../Nodes/JunctionNodeModel';
import JunctionNodeWidget from './JunctionNodeWidget';

export default class JunctionNodeFactory extends AbstractReactFactory<JunctionNodeModel, DiagramEngine> {
    constructor() {
        super('junction');
    }

    generateReactWidget(event: GenerateWidgetEvent<JunctionNodeModel>) {
        return <JunctionNodeWidget node={event.model} engine={this.engine} />
    }

    generateModel(event: GenerateModelEvent) {
        return new JunctionNodeModel(0, 0);
    }
}