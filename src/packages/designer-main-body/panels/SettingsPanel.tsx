import { defineComponent, reactive } from 'vue'
import { observer } from '@formily/reactive-vue'
import { requestIdle } from '@designable/shared'
import { useDesigner, usePrefix, useWorkbench } from '../hooks'
import cls from 'classnames'
import { IconWidget, TextWidget } from '../widgets'

export const SettingsPanel = observer(
  defineComponent({
    name: 'SettingsPanel',
    props: {
      title: {
        type: String,
        default: '',
      },
      extra: {
        type: String,
        default: '',
      },
    },
    setup(props, { slots }) {
      const state = reactive({
        innerVisible: true,
        pinning: false,
        visible: true,
      })

      const prefix = usePrefix('settings-panel')
      const designerRef = useDesigner()
      return () => {
        const workbench = useWorkbench(designerRef)

        if (state.visible || workbench.type === 'DESIGNABLE') {
          if (!state.innerVisible) {
            requestIdle(() => {
              requestAnimationFrame(() => {
                state.innerVisible = true
              })
            })
          }
        }

        if (workbench.type !== 'DESIGNABLE') {
          if (state.innerVisible) {
            state.innerVisible = false
          }
          return null
        }
        if (!state.visible) {
          if (state.innerVisible) {
            state.innerVisible = false
          }
          return (
            <div
              class={prefix + '-opener'}
              onClick={() => {
                state.visible = true
              }}
            >
              <IconWidget infer="Setting" size={20} />
            </div>
          )
        }
        return (
          <div class={cls(prefix, { pinning: state.pinning })}>
            <div class={prefix + '-header'}>
              <div class={prefix + '-header-title'}>
                <TextWidget token={props.title} />
              </div>
              <div class={prefix + '-header-actions'}>
                <div class={prefix + '-header-extra'}>{props.extra}</div>
                {state.pinning ? (
                  <IconWidget
                    infer="PushPinFilled"
                    class={prefix + '-pin-filled'}
                    onClick={() => {
                      state.pinning = !state.pinning
                    }}
                  />
                ) : (
                  <IconWidget
                    infer="PushPinOutlined"
                    class={prefix + '-header-pin'}
                    onClick={() => {
                      state.pinning = !state.pinning
                    }}
                  />
                )}
                <IconWidget
                  infer="Close"
                  class={prefix + '-header-close'}
                  onClick={() => {
                    state.visible = false
                  }}
                />
              </div>
            </div>
            <div class={prefix + '-body'}>
              {state.innerVisible && slots.default()}
            </div>
          </div>
        )
      }
    },
  })
)
