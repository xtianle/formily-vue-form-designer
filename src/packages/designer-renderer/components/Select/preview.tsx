import { connect, mapProps, h, mapReadPretty } from '@formily/vue'
import { defineComponent } from 'vue'

import { ElSelect, ElOption } from 'element-plus'
import { transformComponent } from '@formily/element-plus/lib/__builtins__'

import { PreviewText, Select as FormilySelect } from '@formily/element-plus'
import { createBehavior, createResource } from '@designable/core'

import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

export type SelectProps = typeof ElSelect & {
  options?: Array<typeof ElOption>
}

const TransformElSelect = transformComponent<SelectProps>(ElSelect, {
  change: 'update:modelValue',
})

const InnerSelect = connect(
  TransformElSelect,
  mapProps({ value: 'modelValue', readOnly: 'readonly' }),
  mapReadPretty(PreviewText.Select)
)

const SelectOption = defineComponent({
  name: 'FSelect',
  props: ['options'],
  setup(customProps, { attrs, slots }) {
    return () => {
      const options = customProps.options || []
      const children =
        options.length !== 0
          ? {
              default: () =>
                options.map((option: any, index: number) => {
                  if (typeof option === 'string') {
                    return h(
                      ElOption,
                      { key: option, value: option, label: option },
                      slots
                    )
                  } else {
                    return h(
                      ElOption,
                      {
                        key: option.value || `${index}`,
                        ...option,
                      },
                      slots
                    )
                  }
                }),
            }
          : slots
      return h(
        InnerSelect,
        {
          ...attrs,
        },
        children
      )
    }
  },
})

export const SelectCom = connect(
  SelectOption,
  mapProps({ dataSource: 'options', loading: true }),
  mapReadPretty(PreviewText.Select)
)

const Behavior = createBehavior({
  name: 'Select',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Select',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Select),
  },
  designerLocales: AllLocales.Select,
})

const Resource = createResource({
  icon: 'SelectSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Select',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
      },
    },
  ],
})

export const Select = Object.assign(SelectCom, {
  Behavior,
  Resource,
})
