import {
  defineComponent,
  computed,
  InjectionKey,
  provide,
  Ref,
  CSSProperties,
  VNode,
  inject,
  ref,
  PropType,
} from 'vue'
import { IconWidget, usePrefix } from '@designer-main-body'
import './styles.less'
import cls from 'classnames'

export interface IInputItemsContext {
  width?: string | number
  vertical?: boolean
}

export interface IInputItemsProps {
  className?: string
  style?: CSSProperties
  width?: string | number
  vertical?: boolean
}

export interface IInputItemProps {
  className?: string
  style?: CSSProperties
  icon?: VNode
  width?: string | number
  vertical?: boolean
  title?: VNode
}

const InputItemsSymbol: InjectionKey<Ref<IInputItemsContext>> =
  Symbol('IInputItemsContext')

const InputItemsBase = defineComponent({
  props: {
    width: { type: [String, Number], default: '100%' },
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    const prefix = usePrefix('input-items')
    provide(
      InputItemsSymbol,
      computed(() => props)
    )
    return () => {
      return <div class={cls(prefix)}>{slots.default?.()}</div>
    }
  },
})

const InputItemsItem = defineComponent({
  props: {
    vertical: Boolean,
    width: String,
    icon: {
      type: [String, Object, Function] as PropType<any>,
      default: undefined,
    },
    title: {
      type: [String, Object, Function] as PropType<any>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const prefix = usePrefix('input-items-item')
    const ctxRef = inject(InputItemsSymbol, ref())
    return () => {
      const ctx = ctxRef.value
      return (
        <div
          class={cls(prefix, {
            vertical: props.vertical || ctx.vertical,
          })}
          style={{ width: props.width || ctx.width }}
        >
          {props.icon && (
            <div class={prefix + '-icon'}>
              <IconWidget infer={props.icon} size={16} />
            </div>
          )}
          {props.title && <div class={prefix + '-title'}>{props.title}</div>}
          <div class={prefix + '-controller'}>{slots.default?.()}</div>
        </div>
      )
    }
  },
})

export const InputItems = Object.assign(InputItemsBase, {
  Item: InputItemsItem,
})
