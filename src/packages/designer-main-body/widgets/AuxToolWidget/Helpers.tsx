import {
  CSSProperties,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  PropType,
  reactive,
  ref,
} from 'vue'
import { TreeNode } from '@designable/core'
import { reaction } from '@formily/reactive'
import {
  useDesigner,
  usePrefix,
  useViewport,
  useWorkspaceContext,
} from '../../hooks'
import { Selector } from './Selector'
import { Copy } from './Copy'
import { Delete } from './Delete'
import { DragHandler } from './DragHandler'
import cls from 'classnames'

const HELPER_DEBOUNCE_TIMEOUT = 100

export interface IHelpersProps {
  node: TreeNode
  nodeRect: DOMRect
}
export interface IViewportState {
  viewportWidth?: number
  viewportHeight?: number
  viewportScrollX?: number
  viewportScrollY?: number
  viewportIsScrollTop?: boolean
  viewportIsScrollBottom?: boolean
}

export const Helpers = defineComponent({
  name: 'Helpers',
  props: {
    node: {
      type: Object as PropType<TreeNode>,
      required: true,
    },
    nodeRect: {
      type: Object as PropType<DOMRect>,
      required: true,
    },
  },
  setup(props) {
    let dispose: null | (() => void) = null
    const disposeFn = () => {
      dispose && dispose()
    }

    const prefix = usePrefix('aux-helpers')
    const designerRef = useDesigner()
    const workspaceContextRef = useWorkspaceContext()
    const domRef = ref<HTMLDivElement>()

    const state = reactive({
      position: 'top-right',
      unmount: false,
    })

    let request = null

    const calcpPosition = () => {
      disposeFn()
      const nodeRect = props.nodeRect
      const viewport = useViewport(designerRef, workspaceContextRef)
      const getYInViewport = (nodeRect: DOMRect, helpersRect: DOMRect) => {
        if (nodeRect.top - viewport.scrollY > helpersRect.height) {
          return 'top'
        } else if (
          viewport.isScrollTop &&
          nodeRect.height + helpersRect.height > viewport.height
        ) {
          return 'inner-top'
        } else if (
          nodeRect.bottom >= viewport.scrollY + viewport.height &&
          nodeRect.height + helpersRect.height > viewport.height
        ) {
          return 'inner-bottom'
        }

        return 'bottom'
      }

      const getXInViewport = (nodeRect: DOMRect, helpersRect: DOMRect) => {
        const widthDelta = helpersRect.width - nodeRect.width
        if (widthDelta >= 0) {
          if (nodeRect.x < widthDelta) {
            return 'left'
          } else if (nodeRect.right + widthDelta > viewport.width) {
            return 'right'
          } else {
            return 'center'
          }
        }
        return 'right'
      }
      const update = () => {
        const helpersRect = domRef.value?.getBoundingClientRect()
        if (!helpersRect || !nodeRect) {
          return
        }
        if (state.unmount) {
          return
        }
        const newPosition =
          getYInViewport(nodeRect, helpersRect) +
          '-' +
          getXInViewport(nodeRect, helpersRect)
        if (newPosition != state.position) {
          state.position = newPosition
        }
      }
      update()
      dispose = reaction(
        () => [
          viewport.width,
          viewport.height,
          viewport.scrollX,
          viewport.scrollY,
          viewport.isScrollBottom,
          viewport.isScrollTop,
        ],
        () => {
          clearTimeout(request)
          request = setTimeout(update, HELPER_DEBOUNCE_TIMEOUT)
        }
      )
    }

    onMounted(() => {
      calcpPosition()
    })

    onUpdated(() => {
      nextTick(() => {
        calcpPosition()
      })
    })

    onBeforeUnmount(() => {
      disposeFn()
    })

    return () => {
      const node = props.node
      const nodeRect = props.nodeRect

      if (!nodeRect || !node) {
        return null
      }

      return (
        <div
          class={cls(prefix, {
            [state.position]: true,
          })}
          ref={domRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div class={cls(prefix + '-content')}>
            <Selector node={node} />
            {node?.allowClone() === false ? null : <Copy node={node} />}
            {node?.allowDrag() === false ? null : <DragHandler node={node} />}
            {node?.allowDelete() === false ? null : <Delete node={node} />}
          </div>
        </div>
      )
    }
  },
})

Helpers.displayName = 'Helpers'
