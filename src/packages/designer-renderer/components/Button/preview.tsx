/* eslint-disable max-len */
import { defineComponent } from 'vue'
import { observer } from '@formily/reactive-vue'
import { ElButton } from 'element-plus'
import { connect, mapProps, useForm } from '@formily/vue'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'
import { inject } from 'vue'

const EButtonCom = observer(
  defineComponent({
    name: 'EButton',
    props: {
      title: {
        type: String,
        default: '按钮'
      },
      value: {
        type: String,
        default: ''
      },
      onClick: {
        type: Function,
        default: undefined
      }
    },
    setup(props, { attrs }) {
      const isDesignEnv = inject('isDesignEnv', false)
      const formRef: any = useForm()
      const clickHandler = (e: Event) => {
        if (!isDesignEnv) {
          e.stopPropagation()
          props.onClick && props.onClick(e)
        }
      }
      return () => {
        const { title } = props
        return (
          <div>
            <ElButton
              {...{
                type: 'primary',
                ...attrs
              }}
              onClick={clickHandler}
            >
              {/* data-content-editable="x-component-props.title" */}
              <span>{title}</span>
            </ElButton>
          </div>
        )
      }
    }
  })
)

const EButtonInner = connect(EButtonCom, mapProps({}))

const Behavior = createBehavior({
  name: 'Button',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Button',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Button)
  },
  designerLocales: AllLocales.Button
})

const Resource = createResource({
  icon: 'Button',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        'x-component': 'Button',
        'x-component-props': {
          title: '按钮'
        }
      }
    }
  ]
})

export const Button = Object.assign(EButtonInner, { Behavior, Resource })
