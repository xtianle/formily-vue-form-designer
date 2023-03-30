import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

import { connect, mapProps } from '@formily/vue'

import { ElSwitch } from 'element-plus'
import 'element-plus/theme-chalk/src/switch.scss'

export const FSwitch = connect(
  ElSwitch,
  mapProps({ value: 'modelValue', readOnly: 'readonly' })
)

const Behavior = createBehavior({
  name: 'Switch',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Switch',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Switch)
  },
  designerLocales: AllLocales.Switch
})
const Resource = createResource({
  icon: 'SwitchSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'boolean',
        title: 'Switch',
        'x-decorator': 'FormItem',
        'x-component': 'Switch'
      }
    }
  ]
})

export const Switch = Object.assign(FSwitch, {
  Behavior,
  Resource
})
