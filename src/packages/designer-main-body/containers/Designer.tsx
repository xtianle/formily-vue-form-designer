import {
  defineComponent,
  onBeforeUnmount,
  PropType,
  provide,
  ref,
  toRef,
  watchEffect
} from 'vue'
import { Engine, GlobalRegistry } from '@designable/core'
import { DesignerEngineSymbol } from '../context'
import { useDesigner } from '../hooks'
import { GhostWidget } from '../widgets'
import { Layout } from './Layout'
import * as icons from '../icons'

GlobalRegistry.registerDesignerIcons(icons)

export const Designer = defineComponent({
  name: 'Designer',
  props: {
    engine: {
      type: Object as PropType<Engine>,
      required: true
    },
    prefixCls: {
      type: String,
      default: 'dn-'
    },
    theme: {
      type: String as PropType<'dark' | 'light' | (string & {})>,
      default: 'light'
    },
    variables: {
      type: Object as PropType<Record<string, string>>,
      default: undefined
    },
    position: {
      type: String as PropType<'fixed' | 'absolute' | 'relative'>,
      default: 'fixed'
    }
  },
  setup(props, { slots }) {
    const engine = useDesigner()
    const refInstance = ref<Engine | null>(null)

    provide(DesignerEngineSymbol, toRef(props, 'engine'))

    watchEffect(() => {
      if (props.engine) {
        if (props.engine && refInstance.value) {
          if (props.engine !== refInstance.value) {
            refInstance.value.unmount()
          }
        }
        props.engine.mount()
        refInstance.value = props.engine
      }
    })

    onBeforeUnmount(() => {
      if (props.engine) {
        props.engine.unmount()
      }
    })

    return () => {
      if (engine.value) {
        throw new Error('There can only be one Designable Engine Context')
      }
      return (
        <Layout {...{ theme: props.theme, prefixCls: props.prefixCls }}>
          {slots.default()}
          <GhostWidget />
        </Layout>
      )
    }
  }
})
