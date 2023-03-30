import { createForm, Form as IForm } from '@formily/core'

import { Form } from '@formily/element-plus'
import { SchemaField } from './shared'
import { IFormilySchema } from '@designable/transformer'
import { defineComponent, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'

const createEmptyFormContent = () => {
  return { form: {}, schema: {} }
}
export default defineComponent({
  name: 'FormContentPage',
  setup() {
    const formRef: any = shallowRef<IForm & any>(createForm())
    const schemaRef = shallowRef<IFormilySchema>(createEmptyFormContent())

    // 初始化数据
    const loadInitialSchema = () => {
      const schemaJson = window.localStorage.getItem('schemaJson')
      if (!schemaJson) {
        ElMessage.error('没有schemaJson数据')
        return
      }
      schemaRef.value = JSON.parse(schemaJson)
    }

    loadInitialSchema()

    return () => {
      const form = formRef.value
      const { form: formProps, schema } = schemaRef.value
      return (
        <div style="height:100%;width:100%">
          <Form previewTextPlaceholder={' '} form={form} {...formProps}>
            <SchemaField schema={schema} />
          </Form>
        </div>
      )
    }
  },
})
