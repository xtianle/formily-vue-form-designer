import { Space as FormilySpace } from '@formily/element-plus'
import { createBehavior, createResource } from '@designable/core'

import { createVoidFieldSchema } from '../Field'
import { withContainer } from '../../common/Container'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

const Behavior = createBehavior({
  name: 'Space',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Space',
  designerProps: {
    droppable: true,
    inlineChildrenLayout: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Space),
  },
  designerLocales: AllLocales.Space,
})

const Resource = createResource({
  icon: 'SpaceSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Space',
      },
    },
  ],
})

export const Space = Object.assign(withContainer(FormilySpace), {
  Behavior,
  Resource,
})
