import { defineComponent, CSSProperties } from 'vue'
import { createBehavior, createResource } from '@designable/core'
import { createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

import cls from 'classnames'
import './styles.less'

export interface IDesignableTextProps {
  value?: string
  content?: string
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p'
  style?: CSSProperties
  className?: string
}

const TextCom = defineComponent({
  name: 'TextCom',
  props: ['mode', 'content', 'value'],
  setup(props, { attrs }) {
    const TagName = props.mode === 'normal' || !props.mode ? 'div' : props.mode
    return () => {
      return (
        <TagName
          class={cls('dn-text')}
          {...{
            ...attrs,
            ...props,
            'data-content-editable': 'x-component-props.content',
          }}
        >
          {props.content || props.value}
        </TagName>
      )
    }
  },
})

const Behavior = createBehavior({
  name: 'Text',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Text',
  designerProps: {
    propsSchema: createVoidFieldSchema(AllSchemas.Text),
  },
  designerLocales: AllLocales.Text,
})

const Resource = createResource({
  icon: 'TextSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        'x-component': 'Text',
      },
    },
  ],
})

export const Text = Object.assign(TextCom, {
  Behavior,
  Resource,
})
