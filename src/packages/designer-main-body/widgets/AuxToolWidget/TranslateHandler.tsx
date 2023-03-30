import { defineComponent, PropType } from 'vue'
import cls from 'classnames'
import { useDesigner, usePrefix } from '../../hooks'
import { TreeNode } from '@designable/core'
import { IconWidget } from '../IconWidget'

export interface ITranslateHandlerProps {
  node: TreeNode
}

export const TranslateHandler = defineComponent({
  name: 'translate',
  props: {
    node: {
      type: Object as PropType<TreeNode>,
      required: true,
    },
  },
  setup(props) {
    const designerRef = useDesigner()
    const prefix = usePrefix('aux-node-translate-handler')
    return () => {
      const createHandler = (value: string) => {
        return {
          [designerRef.value.props.nodeTranslateAttrName]: value,
          class: cls(prefix, value),
        }
      }
      const allowTranslate = props.node.allowTranslate()
      if (!allowTranslate) return null
      return (
        <>
          <div {...createHandler('translate')}>
            <IconWidget infer="FreeMove" />
          </div>
        </>
      )
    }
  },
})
