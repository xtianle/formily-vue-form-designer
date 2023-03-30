import { defineComponent } from 'vue'
import { ElInput, ElColorPicker } from 'element-plus'
import { usePrefix } from '@designer-main-body'
import './styles.less'

export interface IColorInputProps {
  value?: string
  onChange?: (color: string) => void
}

export const ColorInput = defineComponent({
  props: {
    value: {
      type: String,
      default: undefined,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const prefix = usePrefix('color-input')
    return () => {
      return (
        <div class={prefix}>
          <ElInput
            modelValue={props.value}
            placeholder="Color"
            {...{
              'onUpdate:modelValue': (e) => {
                emit('change', e)
              },
            }}
            v-slots={{
              prefix: () => {
                return (
                  <ElColorPicker
                    modelValue={props.value}
                    {...{
                      'onUpdate:modelValue': (e) => {
                        emit('change', e)
                      },
                    }}
                  />
                )
              },
            }}
          />
        </div>
      )
    }
  },
})
