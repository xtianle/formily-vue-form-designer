import { observer } from '@formily/reactive-vue'
import { usePrefix } from '@designer-main-body'
import './styles.less'
import { defineComponent } from 'vue'

export const HeaderCom = observer(
  defineComponent({
    name: 'HeaderCom',
    setup(props, { slots }) {
      const prefix = usePrefix('data-source-setter')
      return () => {
        return (
          <div class={`${prefix + '-layout-item-header'}`}>
            <div class={`${prefix + '-layout-item-title'}`}>
              {slots.title?.()}
            </div>
            {slots.extra?.()}
          </div>
        )
      }
    },
  })
)
