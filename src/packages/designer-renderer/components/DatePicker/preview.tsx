import { DatePicker as FormilyDatePicker } from '@formily/element-plus'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { connect, mapProps } from '@formily/vue'
const FDatePicker = connect(
  FormilyDatePicker,
  mapProps((props: any, field: any) => {
    const newProps = {
      teleported: false,
      format: props.datePickerFormat
    }
    return { ...props, ...newProps }
  })
)
const Behavior = createBehavior({
  name: 'DatePicker',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'DatePicker',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.DatePicker)
  },
  designerLocales: AllLocales.DatePicker
})
const Resource = createResource({
  icon: 'DatePickerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'DatePicker',
        'x-decorator': 'FormItem',
        'x-component': 'DatePicker'
      }
    }
  ]
})

export const DatePicker = Object.assign(FDatePicker, {
  Behavior,
  Resource
})
