import {
  cloneVNode,
  computed,
  defineComponent,
  inject,
  InjectionKey,
  isVNode,
  onMounted,
  PropType,
  provide,
  ref,
  Ref,
  unref,
  VNode,
} from 'vue'
import { observer } from '@formily/reactive-vue'
import { ElTooltip, ElTooltipProps } from 'element-plus'
import { usePrefix, useRegistry, useTheme } from '../../hooks'
import { isFn, isObj, isPlainObj, isStr } from '@designable/shared'
import cls from 'classnames'
import './styles.less'
import { addUnit } from '../../shared'

export interface IconProviderProps {
  tooltip?: boolean
}
const IconSymbol: InjectionKey<Ref<IconProviderProps>> = Symbol()

const ShadowSVG = defineComponent({
  props: {
    width: {
      type: [Number, String] as PropType<number | string>,
      default: '1em',
    },
    height: {
      type: [Number, String] as PropType<number | string>,
      default: '1em',
    },
    content: {
      type: String,
      default: undefined,
    },
  },
  setup(props, {}) {
    const refInstance = ref<HTMLDivElement>()

    onMounted(() => {
      if (refInstance.value) {
        const width = addUnit(props.width)
        const height = addUnit(props.height)

        const root = refInstance.value.attachShadow({
          mode: 'open',
        })
        root.innerHTML = `<svg viewBox="0 0 1024 1024" style="width:${width};height:${height}">${props.content}</svg>`
      }
    })

    return () => <div ref={refInstance}></div>
  },
})

const Provider = defineComponent({
  name: 'IconWidget.Provider',
  inheritAttrs: false,
  props: { tooltip: { type: Boolean, default: false } },
  setup(props, { slots }) {
    provide(
      IconSymbol,
      computed(() => props)
    )
    return () => slots.default?.()
  },
})

const IconWidgetCom = observer(
  defineComponent({
    name: 'IconWidget',
    inheritAttrs: false,
    props: {
      tooltip: {
        type: [String, Object] as PropType<
          (Partial<ElTooltipProps> & { content: any }) | string
        >,
        default: undefined,
      },
      infer: {
        type: [String, Function, Object] as PropType<
          string | VNode | { shadow: string }
        >,
        default: undefined,
      },
      size: {
        type: [Number, String] as PropType<number | string>,
        default: '1em',
      },
    },
    emits: ['click'],
    setup(props, { emit, attrs }) {
      const IconContextRef = inject(IconSymbol, ref({ tooltip: false }))
      const registry = useRegistry()
      const prefix = usePrefix('icon')
      const theme = useTheme()

      return () => {
        const size = props.size
        const style = attrs.style as any
        const height = addUnit(style?.height || size)
        const width = addUnit(style?.width || size)

        const takeIcon: any = (infer: any) => {
          if (isStr(infer)) {
            const finded = registry.getDesignerIcon(infer)
            if (finded) {
              return takeIcon(finded)
            }
            return <img src={infer} height={height} width={width} />
          } else if (isFn(infer)) {
            return (
              <infer
                {...{
                  height: height,
                  width: width,
                  fill: 'currentColor',
                  focusable: 'false',
                  'aria-hidden': 'true',
                }}
                fill="currentColor"
              ></infer>
            )
          } else if (isVNode(infer)) {
            if (infer.type === 'svg') {
              const Component = cloneVNode(infer, {
                height,
                width,
                fill: 'currentColor',
                viewBox: infer.props?.viewBox || '0 0 1024 1024',
                focusable: 'false',
                'aria-hidden': 'true',
              })
              return Component
            } else if (infer.type === 'path' || infer.type === 'g') {
              return (
                <svg
                  viewBox="0 0 1024 1024"
                  height={height}
                  width={width}
                  fill="currentColor"
                  focusable="false"
                  aria-hidden="true"
                >
                  {infer}
                </svg>
              )
            }
            return infer
          } else if (isPlainObj(infer)) {
            if (infer[theme]) {
              return takeIcon(infer[theme])
            } else if (infer['shadow']) {
              return (
                <ShadowSVG
                  width={width}
                  height={height}
                  content={infer['shadow']}
                />
              )
            }
          }
          return null
        }

        const renderTooltips = (children: VNode) => {
          const IconContext = unref(IconContextRef)
          if (!isStr(props.infer) && IconContext?.tooltip) return children
          const tooltip =
            props.tooltip || registry.getDesignerMessage(`icons.${props.infer}`)
          if (tooltip) {
            const props = isObj(tooltip) ? tooltip : { content: tooltip }
            const { content, ..._props } = props as any
            return (
              <ElTooltip
                showAfter={200}
                {..._props}
                v-slots={{ content: () => content }}
              >
                {children}
              </ElTooltip>
            )
          }
          return children
        }

        return renderTooltips(
          <span
            {...attrs}
            class={cls(prefix)}
            style={{
              cursor: attrs.onClick ? 'pointer' : style?.cursor,
            }}
            onClick={() => emit('click')}
          >
            {takeIcon(props.infer)}
          </span>
        )
      }
    },
  })
)

export const IconWidget = Object.assign(IconWidgetCom, {
  ShadowSVG,
  Provider,
})
