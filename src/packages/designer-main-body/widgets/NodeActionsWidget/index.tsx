import { defineComponent, PropType } from 'vue'
import { observer } from '@formily/reactive-vue'
import { Space } from '@formily/element-plus'
import { ElButton as Button } from 'element-plus'
import cls from 'classnames'
import {
  useDesigner,
  usePrefix,
  useSelected,
  useTreeNode,
  useWorkspaceContext,
} from '../../hooks'
import { IconWidget } from '../IconWidget'
import { TextWidget } from '../TextWidget'

import './styles.less'

const Action = (props, { emit }) => {
  const prefix = usePrefix('node-actions-item')
  return (
    <Button text={true} class={cls(prefix)} data-click-stop-propagation="true">
      <span class={prefix + '-text'}>
        <IconWidget infer={props.icon} />
        <TextWidget token={props.title} />
      </span>
    </Button>
  )
}

const NodeActionsWidgetCom = observer(
  defineComponent({
    name: 'NodeActionsWidget',
    props: {
      activeShown: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
    },
    setup(props, { slots }) {
      const prefix = usePrefix('node-actions')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      return () => {
        const node = useTreeNode()
        const selected = useSelected(designerRef, workspaceContextRef)
        if (selected.indexOf(node.value.id) === -1 && props.activeShown) {
          return null
        }
        return (
          <div class={cls(prefix)}>
            <div class={prefix + '-content'}>
              <Space {...({ split: '|' } as any)}>{slots.default()}</Space>
            </div>
          </div>
        )
      }
    },
  })
)

export const NodeActionsWidget = Object.assign(NodeActionsWidgetCom, {
  Action,
})
