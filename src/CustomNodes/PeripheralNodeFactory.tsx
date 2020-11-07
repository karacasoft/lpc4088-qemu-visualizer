import React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DefaultNodeWidget, DiagramEngine } from '@projectstorm/react-diagrams';
import { GenerateWidgetEvent, GenerateModelEvent } from '@projectstorm/react-canvas-core';
import PeripheralNodeModel from '../Nodes/PeripheralNodeModel';

export default class PeripheralNodeFactory extends AbstractReactFactory<PeripheralNodeModel, DiagramEngine> {
    constructor() {
        super('peripheral');
    }

    generateReactWidget(event: GenerateWidgetEvent<PeripheralNodeModel>) {
        return <DefaultNodeWidget node={event.model} engine={this.engine} />
    }

    generateModel(event: GenerateModelEvent) {
        return new PeripheralNodeModel();
    }
}