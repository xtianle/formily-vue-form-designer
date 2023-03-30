import {
  CSSProperties,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  Ref,
} from 'vue'
import { TreeNode } from '@designable/core'
import {
  useHover,
  useSelection,
  usePrefix,
  useDesigner,
  useWorkspaceContext,
} from '../../hooks'
import { IconWidget } from '../IconWidget'
import { NodeTitleWidget } from '../NodeTitleWidget'
import { ElButton as Button } from 'element-plus'

import { observer } from '@formily/reactive-vue'

const useMouseHover = (
  domRef: Ref<HTMLElement | undefined>,
  enter?: () => void,
  leave?: () => void
) => {
  let timer = null
  let unmounted = false
  const onMouseOver = (e: MouseEvent) => {
    const target: HTMLElement = e.target as any
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (unmounted) return
      if (domRef?.value?.contains(target)) {
        enter && enter()
      } else {
        leave && leave()
      }
    }, 100)
  }

  onMounted(() => {
    document.addEventListener('mouseover', onMouseOver)
  })

  onBeforeUnmount(() => {
    unmounted = true
    document.removeEventListener('mouseover', onMouseOver)
  })
}

export interface ISelectorProps {
  node: TreeNode
  style?: CSSProperties
}

export const Selector = observer(
  defineComponent({
    name: 'selector',
    props: {
      node: {
        type: Object as PropType<TreeNode>,
        required: true,
      },
    },
    setup(props) {
      const expand = ref(false)
      const setExpand = (value: boolean) => {
        expand.value = value
      }

      const domRef = ref<HTMLDivElement>(null)
      const prefix = usePrefix('aux-selector')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()

      useMouseHover(
        domRef,
        () => {
          setExpand(true)
        },
        () => {
          setExpand(false)
        }
      )

      return () => {
        const node = props.node
        const hover = useHover(designerRef, workspaceContextRef)
        const selection = useSelection(designerRef, workspaceContextRef)

        const renderIcon = (node: TreeNode) => {
          const icon = node.designerProps.icon
          if (icon) {
            return <IconWidget infer={icon} />
          }
          if (node === node.root) {
            return <IconWidget infer="Page" />
          } else if (node.designerProps?.droppable) {
            return <IconWidget infer="Container" />
          }
          return <IconWidget infer="Component" />
        }

        const renderMenu = () => {
          const parents = node.getParents()
          return (
            <div
              class={prefix + '-menu'}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
              }}
            >
              {parents.slice(0, 4).map((parent) => {
                return (
                  <Button
                    key={parent.id}
                    type="primary"
                    onClick={() => {
                      selection.select(parent.id)
                    }}
                    {...{
                      onMouseenter: () => {
                        hover.setHover(parent)
                      },
                    }}
                  >
                    {renderIcon(parent)}
                    <span
                      style={{ transform: 'scale(0.85)', marginLeft: '2px' }}
                    >
                      <NodeTitleWidget node={parent} />
                    </span>
                  </Button>
                )
              })}
            </div>
          )
        }

        return (
          <div ref={domRef} class={prefix}>
            <Button
              class={prefix + '-title'}
              type="primary"
              {...{
                onMouseenter: () => {
                  hover.setHover(node)
                },
              }}
            >
              {renderIcon(node)}
              <span>
                <NodeTitleWidget node={node} />
              </span>
            </Button>
            {expand.value && renderMenu()}
          </div>
        )
      }
    },
  })
)

Selector.displayName = 'Selector'
