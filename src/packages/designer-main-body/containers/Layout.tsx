import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  provide,
  ref,
} from 'vue'
import { DesignerLayoutSymbol, useContext } from '../context'
import { each } from '@designable/shared'

export const Layout = defineComponent({
  name: 'Loyout',
  props: {
    prefixCls: {
      type: String,
      default: 'dn-',
    },
    theme: {
      type: String as PropType<'dark' | 'light' | (string & {})>,
      default: 'light',
    },
    variables: {
      type: Object as PropType<Record<string, string>>,
      default: undefined,
    },
    position: {
      type: String as PropType<'fixed' | 'absolute' | 'relative'>,
      default: 'fixed',
    },
  },
  setup(props, { slots }) {
    // const layoutRef = useContext(DesignerLayoutSymbol)
    const domRef = ref<HTMLDivElement>()

    onMounted(() => {
      each(props.variables, (value, key) => {
        domRef.value.style.setProperty(`--${key}`, value)
      })
    })

    provide(
      DesignerLayoutSymbol,
      computed(() => {
        return {
          theme: props.theme,
          prefixCls: props.prefixCls,
          position: props.position,
        }
      })
    )

    return () => {
      // if (layoutRef) {
      //   return <></>
      // }

      return (
        <div
          ref={domRef}
          class={{
            [`${props.prefixCls}app`]: true,
            [`${props.prefixCls}${props.theme}`]: props.theme,
          }}
        >
          {slots.default?.()}
        </div>
      )
    }
  },
})
