import { defineComponent } from 'vue'
import { ElCard } from 'element-plus'
import { createBehavior, createResource } from '@designable/core'

import { createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

const CardCom = defineComponent({
  props: { title: { type: String, default: '' } },
  setup(props, { slots }) {
    return () => {
      return (
        <ElCard
          {...props}
          v-slots={{
            header: () => (
              <span data-content-editable="x-component-props.title">
                {props.title}
              </span>
            ),
          }}
        >
          {slots.default?.()}
        </ElCard>
      )
    }
  },
})

const Behavior = createBehavior({
  name: 'Card',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Card',
  designerProps: {
    droppable: true,
    propsSchema: createVoidFieldSchema(AllSchemas.Card),
  },
  designerLocales: AllLocales.Card,
})

const Resource = createResource({
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          title: 'Title',
        },
      },
    },
  ],
})

export const Card = Object.assign(CardCom, {
  Behavior,
  Resource,
})
