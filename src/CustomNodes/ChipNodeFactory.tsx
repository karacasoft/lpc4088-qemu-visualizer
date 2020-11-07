import React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DefaultNodeWidget, DiagramEngine } from '@projectstorm/react-diagrams';
import { GenerateWidgetEvent, GenerateModelEvent } from '@projectstorm/react-canvas-core';
import ChipNodeModel from '../Nodes/ChipNodeModel';

export default class ChipNodeFactory extends AbstractReactFactory<ChipNodeModel, DiagramEngine> {
    constructor() {
        super('chip');
    }

    generateReactWidget(event: GenerateWidgetEvent<ChipNodeModel>) {
        return <DefaultNodeWidget node={event.model} engine={this.engine} />
    }

    generateModel(event: GenerateModelEvent) {
        return new ChipNodeModel(true, 0, 0, 0);
    }
}