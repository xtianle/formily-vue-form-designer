import { defineComponent } from 'vue'
import { Switch } from '@formily/element-plus'

export interface IFormItemSwitcherProps {
  value?: string
}

export const FormItemSwitcher = defineComponent({
  name: 'FormItemSwitcher',
  props: {
    value: {
      type: String,
      default: undefined,
    },
  },
  emit: ['change'],
  setup(props, { emit }) {
    return () => {
      return (
        <Switch
          modelValue={props.value === 'FormItem'}
          {...{
            'onUpdate:modelValue': (value) => {
              emit('change', value ? 'FormItem' : undefined)
            },
          }}
        />
      )
    }
  },
})
