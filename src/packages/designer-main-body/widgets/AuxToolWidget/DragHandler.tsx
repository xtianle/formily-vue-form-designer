import { CSSProperties, defineComponent, PropType } from 'vue'
import { TreeNode } from '@designable/core'
import { observer } from '@formily/reactive-vue'
import { IconWidget } from '../IconWidget'
import { useDesigner, usePrefix } from '../../hooks'
import { ElButton as Button } from 'element-plus'

export interface IDragHandlerProps {
  node: TreeNode
  style?: CSSProperties
}

export const DragHandler = observer(
  defineComponent({
    name: 'DragHandler',
    props: {
      node: {
        type: Object as PropType<TreeNode>,
        required: true,
      },
    },
    setup(props) {
      const designerRef = useDesigner()
      const prefix = usePrefix('aux-drag-handler')
      return () => {
        const node = props.node
        if (node === node.root || !node.allowDrag()) return null
        const handlerProps = {
          [designerRef.value.props.nodeDragHandlerAttrName]: 'true',
        }
        return (
          <Button {...handlerProps} class={prefix} type="primary">
            <IconWidget infer="Move" />
          </Button>
        )
      }
    },
  })
)

DragHandler.displayName = 'DragHandler'
