import { defineComponent, unref } from 'vue'
import { useField, Field } from '@formily/vue'
import { observer } from '@formily/reactive-vue'
import { FormItem } from '@formily/element-plus'
import {
  ElRadioButton as RadioButton,
  ElRadioGroup as RadioGroup,
} from 'element-plus'
import { FlexStyleSetter } from '../FlexStyleSetter'
import { DataField, GeneralField } from '@formily/core'
import { usePrefix, IconWidget } from '@designer-main-body'
import cls from 'classnames'
import './styles.less'

export interface IDisplayStyleSetterProps {
  value?: string
}

export const DisplayStyleSetter = observer(
  defineComponent({
    name: 'DnDisplayStyleSetter',
    props: {
      value: { type: String, default: undefined },
    },
    emits: ['change'],
    setup(props, { emit, attrs }) {
      const prefix = usePrefix('display-style-setter')
      const fieldRef = useField<DataField>()

      return () => {
        const field = unref(fieldRef)
        const style = attrs.style || {}

        return (
          <>
            <FormItem.BaseItem
              label={field.title}
              class={cls(prefix)}
              style={style}
            >
              <RadioGroup
                class={prefix + '-radio'}
                modelValue={props.value}
                {...{
                  'onUpdate:modelValue': (e) => {
                    emit('change', e)
                  },
                }}
              >
                <RadioButton label="block">
                  <IconWidget infer="DisplayBlock" size={16} />
                </RadioButton>
                <RadioButton label="inline-block">
                  <IconWidget infer="DisplayInlineBlock" size={16} />
                </RadioButton>
                <RadioButton label="inline">
                  <IconWidget infer="DisplayInline" size={16} />
                </RadioButton>
                <RadioButton label="flex">
                  <IconWidget infer="DisplayFlex" size={16} />
                </RadioButton>
              </RadioGroup>
            </FormItem.BaseItem>
            <Field
              name="flex"
              basePath={field.address.parent()}
              visible={false}
              reactions={(flexField: GeneralField) => {
                flexField.visible = field.value === 'flex'
              }}
              component={[FlexStyleSetter]}
            />
          </>
        )
      }
    },
  })
)
