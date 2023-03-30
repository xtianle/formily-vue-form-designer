import { createBehavior, createResource } from '@designable/core'
import { Container } from '../../common/Container'

import { createFieldSchema } from '../Field'
import { AllLocales } from '../../locales'

const Behavior = createBehavior({
  name: 'Object',
  extends: ['Field'],
  selector: (node) => node.props?.type === 'object',
  designerProps: {
    droppable: true,
    propsSchema: createFieldSchema(),
  },
  designerLocales: AllLocales.ObjectLocale,
})

const Resource = createResource({
  icon: 'ObjectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
      },
    },
  ],
})

export const ObjectContainer = Object.assign(Container, {
  Behavior,
  Resource,
})
