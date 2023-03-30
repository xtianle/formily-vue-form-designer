import { InputNumber as FormilyInputNumber } from '@formily/element-plus'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

const Behavior = createBehavior({
  name: 'InputNumber',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'InputNumber',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.InputNumber),
  },
  designerLocales: AllLocales.InputNumber,
})

const Resource = createResource({
  icon: 'NumberPickerSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'number',
        title: 'InputNumber',
        'x-decorator': 'FormItem',
        'x-component': 'InputNumber',
        'x-component-props': {
          'controls-position': 'right',
        },
      },
    },
  ],
})

export const InputNumber = Object.assign(FormilyInputNumber, {
  Behavior,
  Resource,
})
