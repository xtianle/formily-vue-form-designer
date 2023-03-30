import { Component, defineComponent, PropType, unref } from 'vue'
import { useField } from '@formily/vue'
import { observer } from '@formily/reactive-vue'
import { FoldItem } from '../FoldItem'
import { SizeInput } from '../SizeInput'
import { InputItems } from '../InputItems'

import cls from 'classnames'
import { usePrefix } from '@designer-main-body'

type Position = 'top' | 'right' | 'left' | 'bottom' | 'all'

export interface IMarginStyleSetterProps {
  labels?: Component[] | String[]
  value?: string
  onChange?: (value: string) => void
}

const PositionMap = {
  top: 1,
  right: 2,
  bottom: 3,
  left: 4,
  all: 1,
}

const BoxRex =
  /([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+))?)?)?/

export const BoxStyleSetter = observer(
  defineComponent({
    name: 'DnBoxStyleSetter',
    props: {
      value: {
        type: String,
        default: undefined,
      },
      labels: {
        type: Array as PropType<string[] | Component[]>,
        default: () => ['Top', 'Right', 'Bottom', 'Left'],
      },
    },
    emits: ['change'],
    setup(props, { emit }) {
      const fieldRef = useField()
      const prefix = usePrefix('box-style-setter')

      const createPositionHandler = (
        position: Position,
        props: IMarginStyleSetterProps
      ) => {
        const matched = String(props.value).match(BoxRex) || []
        const value = matched[PositionMap[position]]
        const v1 = matched[1]
        const v2 = matched[2]
        const v3 = matched[3]
        const v4 = matched[4]
        const allEqualls = v1 === v2 && v2 === v3 && v3 === v4
        return {
          ...props,
          value: position === 'all' ? (allEqualls ? v1 : undefined) : value,
          onChange(value: string) {
            if (position === 'all') {
              emit(
                'change',
                `${value || '0px'} ${value || '0px'} ${value || '0px'} ${
                  value || '0px'
                }`
              )
            } else {
              matched[PositionMap[position]] = value
              emit(
                'change',
                `${matched[1] || '0px'} ${matched[2] || '0px'} ${
                  matched[3] || '0px'
                } ${matched[4] || '0px'}`
              )
            }
          },
        }
      }

      return () => {
        const field = unref(fieldRef)

        return (
          <FoldItem
            class={cls(prefix)}
            label={field.title}
            v-slots={{
              base: () => {
                return (
                  <SizeInput
                    {...createPositionHandler('all', props)}
                    exclude={['auto', 'inherit']}
                  />
                )
              },
              extra: () => {
                return (
                  <InputItems width="50%">
                    <InputItems.Item icon={props.labels[0]}>
                      <SizeInput
                        {...createPositionHandler('top', props)}
                        exclude={['inherit', 'auto']}
                      />
                    </InputItems.Item>
                    <InputItems.Item icon={props.labels[1]}>
                      <SizeInput
                        {...createPositionHandler('right', props)}
                        exclude={['inherit', 'auto']}
                      />
                    </InputItems.Item>
                    <InputItems.Item icon={props.labels[2]}>
                      <SizeInput
                        {...createPositionHandler('bottom', props)}
                        exclude={['inherit', 'auto']}
                      />
                    </InputItems.Item>
                    <InputItems.Item icon={props.labels[3]}>
                      <SizeInput
                        {...createPositionHandler('left', props)}
                        exclude={['inherit', 'auto']}
                      />
                    </InputItems.Item>
                  </InputItems>
                )
              },
            }}
          ></FoldItem>
        )
      }
    },
  })
)
