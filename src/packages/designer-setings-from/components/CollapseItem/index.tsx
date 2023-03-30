import { defineComponent, ref } from 'vue'
import { observer } from '@formily/reactive-vue'
import { IconWidget, usePrefix } from '@designer-main-body'
import { useField } from '@formily/vue'
import cls from 'classnames'
import './styles.less'

export const CollapseItem = observer(
  defineComponent({
    name: 'CollapseItem',
    props: {
      defaultExpand: {
        type: Boolean,
        default: true,
      },
    },
    setup(props, { slots }) {
      const prefix = usePrefix('collapse-item')
      const fieldRef = useField()
      const isExpand = ref(props.defaultExpand ?? true)

      return () => {
        return (
          <div class={cls(prefix, { expand: isExpand.value })}>
            <div
              class={prefix + '-header'}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                isExpand.value = !isExpand.value
              }}
            >
              <div class={prefix + '-header-expand'}>
                <IconWidget infer="Expand" size={10} />
              </div>
              <div class={prefix + '-header-content'}>
                {fieldRef.value.title}
              </div>
            </div>
            <div class={prefix + '-content'}>{slots?.default?.()}</div>
          </div>
        )
      }
    },
  })
)
