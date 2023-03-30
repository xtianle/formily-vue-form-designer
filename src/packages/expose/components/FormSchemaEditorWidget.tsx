import { PropType, defineComponent, computed } from 'vue'
import { transformToSchema, transformToTreeNode } from '@designable/transformer'
import { TreeNode } from '@designable/core'
import { MonacoInput } from '@designer-setings-from'

export default defineComponent({
  name: 'SchemaEditorWidget',
  props: {
    tree: {
      type: Object as PropType<TreeNode>,
      required: true
    }
  },
  emits: ['change'],
  setup(props, { attrs, emit }) {
    const code = computed(() => {
      return JSON.stringify(transformToSchema(props.tree), null, 2)
    })

    return () => {
      return (
        <MonacoInput
          {...attrs}
          value={code.value}
          onChange={(value: any) =>
            emit('change', transformToTreeNode(JSON.parse(value)))
          }
          language="json"
          height="100%"
          width="100%"
        />
      )
    }
  }
})
