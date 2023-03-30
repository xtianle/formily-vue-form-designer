import { defineComponent } from 'vue'
import { observer } from '@formily/reactive-vue'
import { useField } from '@formily/vue'
import { IconWidget, usePrefix } from '@designer-main-body'
import { FormItem } from '@formily/element-plus'
import { observable } from '@formily/reactive'
import cls from 'classnames'

import './styles.less'

const ExpandedMap = new Map<string, boolean>()

export const FoldItem = observer(
  defineComponent({
    name: 'FoldItem',
    props: {
      label: {
        type: String,
        default: '',
      },
    },
    setup(props, { slots }) {
      const prefix = usePrefix('fold-item')
      const fieldRef = useField()

      const expand = observable.ref(
        ExpandedMap.get(fieldRef.value.address.toString())
      )

      return () => {
        return (
          <div class={cls(prefix)}>
            <div
              class={prefix + '-base'}
              onClick={() => {
                expand.value = !expand.value
                ExpandedMap.set(fieldRef.value.address.toString(), expand.value)
              }}
            >
              <FormItem.BaseItem
                {...props}
                label={
                  <span
                    class={cls(prefix + '-title', {
                      expand: expand.value,
                    })}
                  >
                    {slots.extra && <IconWidget infer="Expand" size={10} />}
                    {props.label}
                  </span>
                }
              >
                <div
                  style={{ width: '100%' }}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  {slots.base?.()}
                </div>
              </FormItem.BaseItem>
            </div>
            {expand.value && slots.extra && (
              <div class={prefix + '-extra'}>{slots.extra?.()}</div>
            )}
          </div>
        )
      }
    },
  })
)
