import { PropType, shallowRef, defineComponent, computed } from 'vue'
import { TreeNode } from '@designable/core'
import { transformToSchema } from '@designable/transformer'
import { createForm, Form as IForm } from '@formily/core'
import { Form } from '@formily/element-plus'

import { SchemaField } from '../shared'

export default defineComponent({
  name: 'PreviewFormWidget',
  props: {
    tree: {
      type: Object as PropType<TreeNode>,
      required: true
    }
  },
  setup(props) {
    const formRef = shallowRef<IForm>(createForm())
    const treeSchemaRef = computed(() => {
      return transformToSchema(props.tree)
    })

    return () => {
      const form = formRef.value
      const { form: formProps, schema } = treeSchemaRef.value
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            overflowY: 'auto',
            background: 'var(--dn-composite-panel-tabs-content-bg-color)'
          }}
        >
          <Form previewTextPlaceholder={' '} form={form} {...formProps}>
            <SchemaField schema={schema} />
          </Form>
        </div>
      )
    }
  }
})
