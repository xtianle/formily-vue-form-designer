import { ArrayField } from '@formily/core'
import { useField, SchemaSymbol, Schema, ISchema } from '@formily/vue'
import { observer } from '@formily/reactive-vue'
import { GlobalRegistry } from '@designable/core'
import { ArrayItems } from '@formily/element-plus'
import { FoldItem } from '../FoldItem'
import { ElSelect as Select, ElOption as Option } from 'element-plus'
import { defineComponent, provide, toRef } from 'vue'

export interface IValidatorSetterProps {
  value?: any
  onChange?: (value: any) => void
}

const ValidatorSchema: ISchema = {
  type: 'array',
  items: {
    type: 'object',
    'x-decorator': 'ArrayItems.Item',
    'x-decorator-props': {
      style: {
        alignItems: 'center',
        borderRadius: 3,
        paddingTop: 6,
        paddingBottom: 6,
      },
    },
    properties: {
      space: {
        type: 'void',
        'x-component': 'Space',
        'x-decorator': 'FormLayout',
        'x-decorator-props': {
          spaceGap: 2,
          style: { marginBottom: '10px' },
        },
        properties: {
          sortable: {
            type: 'void',
            'x-component': 'ArrayItems.SortHandle',
            'x-component-props': { style: { marginRight: 10 } },
          },
          drawer: {
            type: 'void',
            'x-component': 'DrawerSetter',
            properties: {
              triggerType: {
                type: 'string',
                enum: ['onInput', 'onFocus', 'onBlur'],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
              },
              validator: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'ValueInput',
                'x-component-props': {
                  include: ['EXPRESSION'],
                },
              },
              message: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input.TextArea',
              },
              format: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  clearable: true,
                },
              },
              pattern: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  'suffix-icon': () => <i>/</i>,
                  'prefix-icon': () => <i>/</i>,
                },
              },
              len: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
              },
              max: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
              },
              min: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
              },
              exclusiveMaximum: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
              },
              exclusiveMinimum: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'InputNumber',
              },
              whitespace: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Switch',
              },
              required: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Switch',
              },
            },
          },
          moveDown: {
            type: 'void',
            'x-component': 'ArrayItems.MoveDown',
            'x-component-props': { style: { marginLeft: 10 } },
          },
          moveUp: {
            type: 'void',
            'x-component': 'ArrayItems.MoveUp',
            'x-component-props': { style: { marginLeft: 5 } },
          },
          remove: {
            type: 'void',
            'x-component': 'ArrayItems.Remove',
            'x-component-props': { style: { marginLeft: 5 } },
          },
        },
      },
    },
  },
  properties: {
    addValidatorRules: {
      type: 'void',
      title: '添加校验规则',
      'x-component': 'ArrayItems.Addition',
      'x-component-props': {
        style: {
          marginBottom: '10px',
        },
      },
    },
  },
}
const SchemaContextProvider = defineComponent({
  props: ['value'],
  setup(props, { slots }) {
    provide(SchemaSymbol, toRef(props, 'value'))
    return () => {
      return slots.default?.()
    }
  },
})
export const ValidatorSetter = observer(
  defineComponent({
    name: 'ValidatorSetter',
    props: {
      value: {
        type: [String, Array, Object],
        default: undefined,
      },
    },
    emits: ['change'],
    setup(props, { emit }) {
      const fieldRef = useField<ArrayField>()
      return () => {
        const field = fieldRef.value
        return (
          <FoldItem
            label={field.title}
            v-slots={{
              base() {
                return (
                  <Select
                    modelValue={
                      Array.isArray(props.value) ? undefined : props.value
                    }
                    {...{
                      'onUpdate:modelValue': (val: any) => {
                        emit('change', val)
                      },
                    }}
                    clearable={true}
                    placeholder={GlobalRegistry.getDesignerMessage(
                      'SettingComponents.ValidatorSetter.pleaseSelect'
                    )}
                  >
                    {GlobalRegistry.getDesignerMessage(
                      'SettingComponents.ValidatorSetter.formats'
                    ).map((item: any) => {
                      return <Option label={item.label} value={item.value} />
                    })}
                  </Select>
                )
              },
              extra() {
                return (
                  <SchemaContextProvider value={new Schema(ValidatorSchema)}>
                    <ArrayItems />
                  </SchemaContextProvider>
                )
              },
            }}
          />
        )
      }
    },
  })
)
