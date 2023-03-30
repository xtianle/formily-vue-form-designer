import { TreeNode } from '@designable/core'
import { observer } from '@formily/reactive-vue'
import { defineComponent, PropType, unref } from 'vue'
import { useDesigner, useNodeIdProps, useTreeNode } from '../../hooks'
import { addUnit } from '../../shared'
import { NodeActionsWidget } from '../NodeActionsWidget'
import { NodeTitleWidget } from '../NodeTitleWidget'

import './styles.less'
export const DroppableWidget = observer(
  defineComponent({
    name: 'DroppableWidget',
    inheritAttrs: false,
    props: {
      node: {
        type: Object as PropType<TreeNode>,
        default: undefined,
      },
      actions: {
        type: Array as PropType<{ icon: any; title: any }[]>,
        default: () => [],
      },
      placeholder: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
      height: {
        type: Number as PropType<number>,
        default: undefined,
      },
      hasChildren: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
    },
    setup(props, { slots, attrs }) {
      const designerRef = useDesigner()
      const currentNode = useTreeNode()
      return () => {
        const node = props.node
        const actions = props.actions
        const placeholder = props.placeholder
        const nodeId = useNodeIdProps(designerRef, currentNode, node)
        const target = node ?? unref(currentNode)
        const children = slots.default?.()
        const hasChildren =
          props.hasChildren || (target.children?.length > 0 && children)
        const height = addUnit(props.height)

        return (
          <div {...nodeId} {...attrs}>
            {hasChildren ? (
              children
            ) : placeholder ? (
              <div style={{ height }} class="dn-droppable-placeholder">
                <NodeTitleWidget node={target} />
              </div>
            ) : (
              children
            )}
            {actions?.length ? (
              <NodeActionsWidget>
                {actions.map((action, key) => (
                  <NodeActionsWidget.Action {...action} key={key} />
                ))}
              </NodeActionsWidget>
            ) : null}
          </div>
        )
      }
    },
  })
)
