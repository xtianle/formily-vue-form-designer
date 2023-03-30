import { TimePicker as FormilyTimePicker } from '@formily/element-plus'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { connect, mapProps } from '@formily/vue'

const FTimePicker = connect(
  FormilyTimePicker,
  mapProps((props: any, field: any) => {
    const newProps = {
      teleported: false,
      format: props.timePickerFormat
    }
    return { ...props, ...newProps }
  })
)

const Behavior = createBehavior({
  name: 'TimePicker',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'TimePicker',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.TimePicker)
  },
  designerLocales: AllLocales.TimePicker
})
const Resource = createResource({
  icon: 'TimePickerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        title: 'TimePicker',
        'x-decorator': 'FormItem',
        'x-component': 'TimePicker'
      }
    }
  ]
})

export const TimePicker = Object.assign(FTimePicker, {
  Behavior,
  Resource
})
