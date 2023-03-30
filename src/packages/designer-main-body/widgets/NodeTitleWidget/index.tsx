import { defineComponent, PropType } from 'vue'
import { observer } from '@formily/reactive-vue'
import { TreeNode } from '@designable/core'

export const NodeTitleWidget = observer(
  defineComponent({
    name: 'NodeTitleWidget',
    props: {
      node: {
        type: Object as PropType<TreeNode>,
        required: true,
      },
    },
    setup(props) {
      const takeNode = () => {
        const node = props.node
        if (node.componentName === '$$ResourceNode$$') {
          return node.children[0]
        }
        return node
      }
      return () => {
        const node = takeNode()
        return <>{node.getMessage('title') || node.componentName}</>
      }
    },
  })
)
