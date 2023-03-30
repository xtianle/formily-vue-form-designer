import {
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
} from 'vue'
import {
  ClosestPosition,
  CursorStatus,
  DragMoveEvent,
  TreeNode,
} from '@designable/core'
import {
  useCursor,
  useDesigner,
  useMoveHelper,
  usePrefix,
  useSelection,
  useWorkspaceContext,
} from '../../hooks'
import { observer } from '@formily/reactive-vue'
import { autorun } from '@formily/reactive'
import { isFn } from '@formily/shared'
import { NodeSymbol } from './context'
import { IconWidget } from '../IconWidget'
import cls from 'classnames'

import './styles.less'
import { NodeTitleWidget } from '../NodeTitleWidget'
import { addUnit } from '../../shared'

export const OutlineTreeNode = observer(
  defineComponent({
    name: 'OutlineNode',
    props: {
      workspaceId: {
        type: String as PropType<string>,
        default: undefined,
      },
      node: {
        type: Object as PropType<TreeNode>,
        required: true,
      },
    },
    setup(props) {
      const prefix = usePrefix('outline-tree-node')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      const domRef = ref<HTMLDivElement>()
      const ctxRef = inject(NodeSymbol, ref())
      const requestRef = ref(null)

      let disposeList: (() => void)[] = []

      onMounted(() => {
        const dispose1 = designerRef.value.subscribeTo(DragMoveEvent, () => {
          const moveHelper = useMoveHelper(
            designerRef,
            workspaceContextRef,
            props.workspaceId
          )

          const closestNodeId = moveHelper?.closestNode?.id

          const closestDirection = moveHelper?.outlineClosestDirection

          const id = props.node.id
          if (!domRef.value) return
          if (
            closestNodeId === id &&
            closestDirection === ClosestPosition.Inner
          ) {
            if (!domRef.value.classList.contains('droppable')) {
              domRef.value.classList.add('droppable')
            }
            if (!domRef.value.classList.contains('expanded')) {
              if (requestRef.value) {
                clearTimeout(requestRef.value)
                requestRef.value = null
              }
              requestRef.value = setTimeout(() => {
                domRef.value.classList.add('expanded')
              }, 600)
            }
          } else {
            if (requestRef.value) {
              clearTimeout(requestRef.value)
              requestRef.value = null
            }
            if (domRef.value.classList.contains('droppable')) {
              domRef.value.classList.remove('droppable')
            }
          }
        })
        disposeList.push(dispose1)

        const dispose2 = autorun(() => {
          const cursor = useCursor(designerRef)
          const moveHelper = useMoveHelper(
            designerRef,
            workspaceContextRef,
            props.workspaceId
          )
          const selection = useSelection(
            designerRef,
            workspaceContextRef,
            props.workspaceId
          )

          const selectedIds = selection?.selected || []
          const id = props.node.id
          if (!domRef.value) return
          if (selectedIds.includes(id)) {
            if (!domRef.value.classList.contains('selected')) {
              domRef.value.classList.add('selected')
            }
          } else {
            if (domRef.value.classList.contains('selected')) {
              domRef.value.classList.remove('selected')
            }
          }
          if (
            cursor.status === CursorStatus.Dragging &&
            moveHelper?.dragNodes?.length
          ) {
            if (domRef.value.classList.contains('selected')) {
              domRef.value.classList.remove('selected')
            }
          }
        })
        disposeList.push(dispose2)
      })
      onBeforeUnmount(() => {
        disposeList.forEach((cb) => cb())
      })

      return () => {
        const node = props.node
        const workspaceId = props.workspaceId

        if (!node) return null

        const renderIcon = (node: TreeNode) => {
          const icon = node.designerProps.icon
          if (icon) {
            return <IconWidget infer={icon} size={12} />
          }
          if (node === node?.root) {
            return <IconWidget infer="Page" size={12} />
          } else if (node.designerProps?.droppable) {
            return <IconWidget infer="Container" size={12} />
          }
          return <IconWidget infer="Component" size={12} />
        }

        const renderTitle = (node: TreeNode) => {
          if (isFn(ctxRef.value.renderTitle)) {
            return ctxRef.value.renderTitle(node)
          }
          return (
            <span>
              <NodeTitleWidget node={node} />
            </span>
          )
        }

        const renderActions = (node: TreeNode) => {
          if (isFn(ctxRef.value.renderActions))
            return ctxRef.value.renderActions(node)
        }

        return (
          <div
            ref={domRef}
            class={cls(prefix, 'expanded')}
            data-designer-outline-node-id={node.id}
          >
            <div class={prefix + '-header'}>
              <div
                class={prefix + '-header-head'}
                style={{
                  left: addUnit(-node.depth * 16),
                  width: addUnit(node.depth * 16),
                }}
              ></div>
              <div class={prefix + '-header-content'}>
                <div class={prefix + '-header-base'}>
                  {(node?.children?.length > 0 || node === node.root) && (
                    <div
                      class={prefix + '-expand'}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (domRef.value?.classList?.contains('expanded')) {
                          domRef.value?.classList.remove('expanded')
                        } else {
                          domRef.value?.classList.add('expanded')
                        }
                      }}
                    >
                      <IconWidget infer="Expand" size={10} />
                    </div>
                  )}
                  <div class={prefix + '-icon'}>{renderIcon(node)}</div>
                  <div class={prefix + '-title'}>{renderTitle(node)}</div>
                </div>
                <div
                  class={prefix + '-header-actions'}
                  data-click-stop-propagation
                >
                  {renderActions(node)}
                  {node !== node.root && (
                    <IconWidget
                      class={cls(prefix + '-hidden-icon', {
                        hidden: node.hidden,
                      })}
                      infer={node.hidden ? 'EyeClose' : 'Eye'}
                      size={14}
                      onClick={() => {
                        node.hidden = !node.hidden
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div class={prefix + '-children'}>
              {node.children?.map((child) => {
                return (
                  <OutlineTreeNode
                    node={child}
                    key={child.id}
                    workspaceId={workspaceId}
                  />
                )
              })}
            </div>
          </div>
        )
      }
    },
  })
)
