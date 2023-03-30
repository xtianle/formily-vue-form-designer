import { defineComponent, shallowRef } from 'vue'
import { usePrefix } from '@designer-main-body'
import { createBehavior, createResource } from '@designable/core'
import { createForm, Form as IForm } from '@formily/core'
import { observer } from '@formily/reactive-vue'
import { Form as FormilyForm } from '@formily/element-plus'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

import './styles.less'

const FormCom = observer(
  defineComponent({
    name: 'FormCom',
    setup(props, { slots, attrs }) {
      const prefix = usePrefix('designable-form')
      const formRef = shallowRef<IForm>(
        createForm({
          designable: true,
        })
      )
      return () => {
        return (
          <FormilyForm class={prefix} form={formRef.value} {...attrs}>
            {slots.default?.()}
          </FormilyForm>
        )
      }
    },
  })
)

const Behavior = createBehavior({
  name: 'Form',
  selector: (node) => node.componentName === 'Form',
  designerProps(node) {
    return {
      draggable: !node.isRoot,
      cloneable: !node.isRoot,
      deletable: !node.isRoot,
      droppable: true,
      propsSchema: {
        type: 'object',
        properties: {
          ...(AllSchemas.FormLayout.properties as any),
          style: AllSchemas.CSSStyle,
        },
      },
      defaultProps: {
        labelCol: 6,
        wrapperCol: 24,
        // labelCol: 3,
        // wrapperCol: 12,
        // colon: false,
        // feedbackLayout: 'loose',
        // size: 'default',
        // layout: 'horizontal',
        // tooltipLayout: 'icon',
        // labelAlign: 'right',
        // wrapperAlign: 'left',
        // shallow: true,
        // bordered: true,
      },
    }
  },
  designerLocales: AllLocales.Form,
})

const Resource = createResource({
  title: { 'zh-CN': '表单', 'en-US': 'Form' },
  icon: 'FormLayoutSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
        'x-component': 'Form',
      },
    },
  ],
})

export const Form = Object.assign(FormCom, {
  Behavior,
  Resource,
})
