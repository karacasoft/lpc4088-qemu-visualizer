import * as React from 'react';
import { DiamondNodeModel } from './DiamondNodeModel';
import { DiagramEngine, PortModelAlignment, PortWidget } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import { css, jsx } from '@emotion/core'
import * as CSS from 'csstype';

export interface DiamondNodeWidgetProps {
	node: DiamondNodeModel;
	engine: DiagramEngine;
	size?: number;
	node_port_distance?: number;
}
/*
export declare namespace S {
	export const Port = styled.div`
		width: 16px;
		height: 16px;
		z-index: 10;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 8px;
		cursor: pointer;

		&:hover {
			background: rgba(0, 0, 0, 1);
		}
	`;
}
*/
/**
 * @author Dylan Vorster
 */
export class DiamondNodeWidget extends React.Component<DiamondNodeWidgetProps> {
	render() {
		const { node_port_distance, node } = this.props;
		const non_null_node_port_distance = node_port_distance ? node_port_distance : 50;

		const left_port = node.getPort(PortModelAlignment.LEFT);
		const top_port = node.getPort(PortModelAlignment.TOP);
		const right_port = node.getPort(PortModelAlignment.RIGHT);
		

		return (
			<div
				className={'diamond-node'}
				style={{
					position: 'relative',
					width: 50,
					height: 50
				}}>
				<svg
					width={50}
					height={50}
					dangerouslySetInnerHTML={{
						__html:
							`
          <g id="Layer_1">
          </g>
          <g id="Layer_2">
            <polygon fill="mediumpurple" stroke="${
							this.props.node.isSelected() ? 'turquoise' : '#000000'
						}" stroke-width="2" stroke-miterlimit="10" points="10,` +
							50 / 2 +
							` ` +
							50 / 2 +
							`,10 ` +
							(50 - 10) +
							`,` +
							50 / 2 +
							` ` +
							50 / 2 +
							`,` +
							(50 - 10) +
							` "/>
          </g>
        `
					}}
				/>
				{
					left_port &&
						(<PortWidget
							style={{
								top: non_null_node_port_distance / 2 - 8,
								left: -8,
								position: 'absolute'
							}}
							port={left_port}
							engine={this.props.engine}>
							<div className={"DiamondPort"} />
						</PortWidget>)
				}
				{
					top_port && <PortWidget
						style={{
							left: non_null_node_port_distance / 2 - 8,
							top: -8,
							position: 'absolute'
						}}
						port={top_port}
						engine={this.props.engine}>
						<div className={"DiamondPort"} />
					</PortWidget>
				}
				{
					right_port && <PortWidget
						style={{
							left: non_null_node_port_distance - 8,
							top: non_null_node_port_distance / 2 - 8,
							position: 'absolute'
						}}
						port={right_port}
						engine={this.props.engine}>
						<div className={"DiamondPort"} />
					</PortWidget>
				}

			</div>
		);
	}
}
