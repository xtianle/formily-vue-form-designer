import { FormLayout as FormilyFormLayout } from '@formily/element-plus'
import { createBehavior, createResource } from '@designable/core'
import { withContainer } from '../../common/Container'
import { createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

const Behavior = createBehavior({
  name: 'FormLayout',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'FormLayout',
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.FormLayout),
  },
  designerLocales: AllLocales.FormLayout,
})

const Resource = createResource({
  icon: 'FormLayoutSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormLayout',
      },
    },
  ],
})

export const FormLayout = Object.assign(withContainer(FormilyFormLayout), {
  Behavior,
  Resource,
})
