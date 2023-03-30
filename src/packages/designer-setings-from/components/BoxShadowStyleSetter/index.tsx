import { defineComponent } from 'vue'
import { useField } from '@formily/vue'
import { DataField } from '@formily/core'
import { observer } from '@formily/reactive-vue'
import { FoldItem } from '../FoldItem'
import { ColorInput } from '../ColorInput'
import { SizeInput } from '../SizeInput'
import { InputItems } from '../InputItems'
import cls from 'classnames'
import { usePrefix } from '@designer-main-body'

export interface IBoxShadowStyleSetterProps {
  value?: string
}

export const BoxShadowStyleSetter = observer(
  defineComponent({
    props: { value: String },
    setup(props, { emit }) {
      const fieldRef = useField<DataField>()
      const prefix = usePrefix('shadow-style-setter')

      const createBoxShadowConnector = (position: number) => {
        const splited = String(props.value || '')
          .trim()
          .split(' ')
        const result = {
          value: splited[position] || '',
          onChange: (value: any) => {
            splited[position] = value
            emit(
              'change',
              `${splited[0] || ''} ${splited[1] || ''} ${splited[2] || ''} ${
                splited[3] || ''
              } ${splited[4] || ''}`
            )
          },
        }
        return result
      }

      return () => {
        const field = fieldRef.value

        return (
          <FoldItem
            class={cls(prefix)}
            label={field.title}
            v-slots={{
              base: () => {
                return <ColorInput {...createBoxShadowConnector(4)} />
              },
              extra: () => {
                return (
                  <InputItems width="50%">
                    <InputItems.Item icon="AxisX">
                      <SizeInput
                        exclude={['inherit', 'auto']}
                        {...createBoxShadowConnector(0)}
                      />
                    </InputItems.Item>
                    <InputItems.Item icon="AxisY">
                      <SizeInput
                        exclude={['inherit', 'auto']}
                        {...createBoxShadowConnector(1)}
                      />
                    </InputItems.Item>
                    <InputItems.Item icon="Blur">
                      <SizeInput
                        exclude={['inherit', 'auto']}
                        {...createBoxShadowConnector(2)}
                      />
                    </InputItems.Item>
                    <InputItems.Item icon="Shadow">
                      <SizeInput
                        exclude={['inherit', 'auto']}
                        {...createBoxShadowConnector(3)}
                      />
                    </InputItems.Item>
                  </InputItems>
                )
              },
            }}
          />
        )
      }
    },
  })
)
