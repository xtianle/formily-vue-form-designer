import { defineComponent } from 'vue'
import { FormGrid as FormilyGird } from '@formily/element-plus'
import { TreeNode, createBehavior, createResource } from '@designable/core'
import {
  useTreeNode,
  useNodeIdProps,
  DroppableWidget,
  useDesigner,
} from '@designer-main-body'
import { LoadTemplate } from '../../common/LoadTemplate'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

import './styles.less'

const FormGirdCom = defineComponent({
  name: 'FormGirdCom',
  inheritAttrs: false,
  setup(props, { slots, attrs }) {
    const designerRef = useDesigner()
    const currentNode = useTreeNode()

    return () => {
      const node = currentNode.value
      const nodeId = useNodeIdProps(designerRef, currentNode)

      if (!node) return
      if (node.children.length === 0) return <DroppableWidget {...attrs} />

      return (
        <div class="dn-grid" {...nodeId}>
          <FormilyGird {...attrs}>{slots.default?.()}</FormilyGird>
          <LoadTemplate
            actions={[
              {
                title: node.getMessage('addGridColumn'),
                icon: 'AddColumn',
                onClick: () => {
                  const column = new TreeNode({
                    componentName: 'Field',
                    props: {
                      type: 'void',
                      'x-component': 'FormGrid.GridColumn',
                    },
                  })
                  node.append(column)
                },
              },
            ]}
          />
        </div>
      )
    }
  },
})

const GridColumn = defineComponent({
  name: 'GridColumn',
  props: { gridSpan: { type: Number, default: 1 } },
  setup(props, { attrs, slots }) {
    return () => {
      return (
        <DroppableWidget {...attrs} data-grid-span={props.gridSpan}>
          {slots.default?.()}
        </DroppableWidget>
      )
    }
  },
})

const Behavior = createBehavior(
  {
    name: 'FormGrid',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'FormGrid',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props?.['x-component'] !== 'FormGrid',
      propsSchema: createFieldSchema(AllSchemas.FormGrid),
    },
    designerLocales: AllLocales.FormGrid,
  },
  {
    name: 'FormGrid.GridColumn',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'FormGrid.GridColumn',
    designerProps: {
      droppable: true,
      resizable: {
        width(node) {
          const span = Number(node.props?.['x-component-props']?.gridSpan ?? 1)
          return {
            plus: () => {
              if (span + 1 > 12) return
              node.props['x-component-props'] =
                node.props?.['x-component-props'] || {}
              node.props['x-component-props'].gridSpan = span + 1
            },
            minus: () => {
              if (span - 1 < 1) return
              node.props['x-component-props'] =
                node.props['x-component-props'] || {}
              node.props['x-component-props'].gridSpan = span - 1
            },
          }
        },
      },
      resizeXPath: 'x-component-props.gridSpan',
      resizeStep: 1,
      resizeMin: 1,
      resizeMax: 12,
      allowDrop: (node) => node.props?.['x-component'] === 'FormGrid',
      propsSchema: createFieldSchema(AllSchemas.FormGrid.GridColumn),
    },
    designerLocales: AllLocales.FormGridColumn,
  }
)
const Resource = createResource({
  icon: 'GridSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormGrid',
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
          },
        },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
          },
        },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
          },
        },
      ],
    },
  ],
})
export const FormGrid = Object.assign(FormGirdCom, {
  GridColumn,
  Behavior,
  Resource,
})
