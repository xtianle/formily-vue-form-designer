import { defineComponent, PropType } from 'vue'
import { observer } from '@formily/reactive-vue'
import { isStr, isPlainObj } from '@designable/shared'
import { GlobalRegistry, IDesignerMiniLocales } from '@designable/core'

export const TextWidget = observer(
  defineComponent({
    name: 'TextWidget',
    props: {
      componentName: {
        type: String,
        default: undefined,
      },
      sourceName: {
        type: String,
        default: undefined,
      },
      token: {
        type: [String, Object] as PropType<string | IDesignerMiniLocales>,
        default: undefined,
      },
      defaultMessage: {
        type: [String, Object] as PropType<string | IDesignerMiniLocales>,
        default: undefined,
      },
    },
    setup(props, { slots }) {
      const takeLocale = (message: string | IDesignerMiniLocales) => {
        if (isStr(message)) return message
        if (isPlainObj(message)) {
          const lang = GlobalRegistry.getDesignerLanguage()
          for (let key in message) {
            if (key.toLocaleLowerCase() === lang) return message[key]
          }
          return
        }
        return message
      }
      const takeMessage = (token: any) => {
        if (!token) return
        const message = isStr(token)
          ? GlobalRegistry.getDesignerMessage(token)
          : token
        if (message) return takeLocale(message)
        return token
      }
      return () => {
        return (
          <>
            {takeMessage(props.token) ||
              takeMessage(slots.default?.()?.[0]) ||
              takeMessage(props.defaultMessage)}
          </>
        )
      }
    },
  })
)
