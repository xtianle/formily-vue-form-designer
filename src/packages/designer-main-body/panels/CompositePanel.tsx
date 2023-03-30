import { isValid } from '@designable/shared'
import {
  defineComponent,
  markRaw,
  PropType,
  ref,
  unref,
  VNode,
  watch
} from 'vue'
import { usePrefix } from '../hooks'
import cls from 'classnames'
import { IconWidget, TextWidget } from '../widgets'

export const CompositePanelItem = defineComponent({
  name: 'CompositePanelItem',
  props: {
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  setup(props, { slots }) {
    return () => {
      return <>{slots && slots?.default?.()}</>
    }
  }
})

const parseItems = (children: VNode[]): Array<any> => {
  const items: any[] = []
  children.forEach((item, index) => {
    items.push({
      key: item.key ?? `${index}`,
      ...item?.props,
      children: item
    })
  })
  return items
}

const findItem = (items: any[], key: string | number) => {
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    if (key === index) return item
    if (key === item.key) return item
  }
}

const CompositePanelCom = defineComponent({
  name: 'CompositePanel',
  props: {
    direction: {
      type: String as PropType<'left' | 'right'>,
      default: 'left'
    },
    showNavTitle: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    defaultOpen: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    defaultPinning: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    defaultActiveKey: {
      type: String as PropType<string>,
      default: '0'
    },
    activeKey: {
      type: String as PropType<string>,
      default: ''
    }
  },
  emits: ['change'],
  setup(props, { slots, emit }) {
    const prefix = usePrefix('composite-panel')

    const pinning = ref(props.defaultPinning ?? false)
    const visible = ref(props.defaultOpen ?? true)

    const activeKey = ref(props.defaultActiveKey ?? '')
    watch(
      () => props.activeKey,
      () => {
        if (isValid(props.activeKey)) {
          if (props.activeKey !== activeKey.value) {
            activeKey.value = props.activeKey
          }
        }
      },
      { immediate: true }
    )

    const changeKey = (key: string) => {
      emit('change', key)
    }
    return () => {
      const children = slots.default?.()
      if (!children || children.length === 0) {
        return
      }

      const items = parseItems(children as unknown as VNode[])

      if (!activeKey.value) {
        activeKey.value = items[0].key
      }
      const renderContent = () => {
        const currentItem = findItem(items, unref(activeKey))
        const content = currentItem?.children
        if (!unref(visible) || !content) {
          return
        }
        return (
          <div
            class={cls(prefix + '-tabs-content', {
              pinning: unref(pinning)
            })}
          >
            <div class={prefix + '-tabs-header'}>
              <div class={prefix + '-tabs-header-title'}>
                <TextWidget token={currentItem.title} />
              </div>
              <div class={prefix + '-tabs-header-actions'}>
                <div class={prefix + '-tabs-header-extra'}>
                  {currentItem?.extra}
                </div>
                {!pinning.value ? (
                  <IconWidget
                    key={prefix + '-tabs-header-pin'}
                    class={prefix + '-tabs-header-pin'}
                    infer="PushPinOutlined"
                    onClick={() => {
                      pinning.value = !pinning.value
                    }}
                  />
                ) : (
                  <IconWidget
                    key={prefix + '-tabs-header-pin-filled'}
                    class={prefix + '-tabs-header-pin-filled'}
                    infer="PushPinFilled"
                    onClick={() => {
                      pinning.value = !pinning.value
                    }}
                  />
                )}
                <IconWidget
                  class={prefix + '-tabs-header-close'}
                  infer="Close"
                  onClick={() => {
                    visible.value = false
                  }}
                />
              </div>
            </div>
            <div class={prefix + '-tabs-body'} key={unref(activeKey)}>
              {content}
            </div>
          </div>
        )
      }
      return (
        <div
          class={cls(prefix, {
            [`direction-${props.direction}`]: !!props.direction
          })}
        >
          <div class={prefix + '-tabs'}>
            {items.map((item, index) => {
              const takeTab = () => {
                if (item.href) {
                  return <a href={item.href}>{item.icon}</a>
                }
                const tooltip: any = props.showNavTitle
                  ? undefined
                  : {
                      content: markRaw(<TextWidget token={item.title} />),
                      placement: props.direction === 'right' ? 'left' : 'right'
                    }
                return <IconWidget tooltip={tooltip} infer={item.icon} />
              }
              const shape = item.shape ?? 'tab'
              const Comp = shape === 'link' ? 'a' : 'div'
              return (
                <Comp
                  key={index}
                  href={item.href}
                  class={cls(prefix + '-tabs-pane', {
                    active: unref(activeKey) === item.key
                  })}
                  onClick={(e: MouseEvent) => {
                    if (shape === 'tab') {
                      if (unref(activeKey) === item.key) {
                        visible.value = !visible.value
                      } else {
                        visible.value = true
                      }
                      if (!props?.activeKey || !props?.onChange)
                        activeKey.value = item.key
                    }
                    item.onClick?.(e)
                    changeKey(item.key)
                  }}
                >
                  {takeTab()}
                  {props.showNavTitle && item.title ? (
                    <div class={prefix + '-tabs-pane-title'}>
                      <TextWidget token={item.title} />
                    </div>
                  ) : null}
                </Comp>
              )
            })}
          </div>
          {renderContent()}
        </div>
      )
    }
  }
})

export const CompositePanel = Object.assign(CompositePanelCom, {
  Item: CompositePanelItem
})
