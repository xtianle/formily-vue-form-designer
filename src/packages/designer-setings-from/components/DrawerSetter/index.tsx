import { defineComponent, unref, ref, Teleport, Component } from 'vue'
import { useField } from '@formily/vue'
import { observer } from '@formily/reactive-vue'
import { FormLayout } from '@formily/element-plus'
import { ElButton } from 'element-plus'
import { IconWidget, usePrefix } from '@designer-main-body'
import cls from 'classnames'

import './styles.less'

export interface IDrawerSetterProps {
  text: Component
}

export const DrawerSetter = observer(
  defineComponent({
    name: 'DrawerSetter',
    props: { text: {} },
    inheritAttrs: false,
    setup(props, { attrs, slots }) {
      const visible = ref(false)
      const remove = ref(false)

      const fieldRef = useField()
      const prefix = usePrefix('drawer-setter')
      const formWrapperCls = usePrefix('settings-form-wrapper')

      const handleOpen = () => {
        visible.value = true
      }

      const handleClose = () => {
        remove.value = true
        setTimeout(() => {
          visible.value = false
          remove.value = false
        }, 150)
      }

      const field = unref(fieldRef)

      return () => {
        return (
          <>
            <ElButton onClick={handleOpen}>
              {props.text || field.title}
            </ElButton>
            {visible.value && (
              <Teleport to=".dn-settings-form-wrapper">
                <div
                  class={cls(
                    prefix,
                    'animate__animated animate__slideInRight',
                    {
                      animate__slideOutRight: remove.value,
                    }
                  )}
                  {...attrs}
                >
                  <div class={prefix + '-header'} onClick={handleClose}>
                    <IconWidget infer="Return" size={18} />
                    <span class={prefix + '-header-text'}>
                      {props.text || field.title}
                    </span>
                  </div>
                  <div class={prefix + '-body'}>
                    <FormLayout
                      colon={false}
                      labelWidth={120}
                      labelAlign="left"
                      wrapperAlign="right"
                      feedbackLayout="none"
                      tooltipLayout="text"
                    >
                      {slots.default?.()}
                    </FormLayout>
                  </div>
                </div>
              </Teleport>
            )}
          </>
        )
      }
    },
  })
)
