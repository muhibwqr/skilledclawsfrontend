import React from 'react'
import { DefaultNodeModel } from '@projectstorm/react-diagrams-defaults'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import { DefaultPortLabel } from '@projectstorm/react-diagrams-defaults'

/**
 * Diamond-shaped node (decision style). Same API as DefaultNodeModel but type 'diamond'.
 */
export class DiamondNodeModel extends DefaultNodeModel {
  constructor(options = {}) {
    super({ ...options, type: 'diamond' })
  }
}

/**
 * Widget: diamond shape with white bold uppercase label and ports.
 */
export class DiamondNodeWidget extends React.Component {
  generatePort = (port) => (
    <DefaultPortLabel engine={this.props.engine} port={port} key={port.getID()} />
  )

  render() {
    const { node } = this.props
    const name = (node.getOptions().name || '').toUpperCase()
    const color = node.getOptions().color || '#343a40'
    const selected = node.isSelected()

    return (
      <div
        className="diamond-node"
        data-default-node-name={name}
        style={{
          width: 100,
          height: 100,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          backgroundColor: color,
          border: `2px solid ${selected ? 'rgb(0,192,255)' : '#1a1d20'}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'visible',
          fontFamily: 'sans-serif',
          fontSize: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
          }}
        >
          <span
            style={{
              color: '#fff',
              fontWeight: 700,
              textTransform: 'uppercase',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            {name}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.2)',
            justifyContent: 'space-around',
            gap: 4,
            padding: 2,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {node.getInPorts().map(this.generatePort)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {node.getOutPorts().map(this.generatePort)}
          </div>
        </div>
      </div>
    )
  }
}

export class DiamondNodeFactory extends AbstractReactFactory {
  constructor() {
    super('diamond')
  }

  generateReactWidget(event) {
    return React.createElement(DiamondNodeWidget, {
      engine: event.engine,
      node: event.model,
    })
  }

  generateModel() {
    return new DiamondNodeModel()
  }
}
