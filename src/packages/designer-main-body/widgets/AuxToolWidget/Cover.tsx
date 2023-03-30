import { CSSProperties, defineComponent, PropType } from 'vue'
import {
  useViewport,
  useMoveHelper,
  useCursor,
  usePrefix,
  useDesigner,
  useWorkspaceContext,
  useValidNodeOffsetRectRef,
} from '../../hooks'
import { addUnit } from '../../shared'
import { observer } from '@formily/reactive-vue'
import { CursorStatus, ClosestPosition, TreeNode } from '@designable/core'
import cls from 'classnames'
interface ICoverRectProps {
  node: TreeNode
  dragging?: boolean
  dropping?: boolean
}

const CoverRect = defineComponent({
  name: 'CoverRect',
  props: {
    node: {
      type: Object as PropType<TreeNode>,
      required: true,
    },
    dragging: {
      type: Boolean,
      default: false,
    },
    dropping: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const prefix = usePrefix('aux-cover-rect')
    const designerRef = useDesigner()
    const workspaceContextRef = useWorkspaceContext()

    const nodeRectRef = useValidNodeOffsetRectRef(
      designerRef,
      workspaceContextRef,
      props.node
    )
    const createCoverStyle = (rect: any) => {
      const baseStyle: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }
      if (rect) {
        baseStyle.transform = `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`
        baseStyle.height = addUnit(rect.height)
        baseStyle.width = addUnit(rect.width)
      }
      return baseStyle
    }

    return () => {
      const rect = nodeRectRef.value

      return (
        <div
          class={cls(prefix, {
            dragging: props.dragging,
            dropping: props.dropping,
          })}
          style={createCoverStyle(rect)}
        ></div>
      )
    }
  },
})

export const Cover = observer(
  defineComponent({
    name: 'Cover',
    setup() {
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      return () => {
        const viewportMoveHelper = useMoveHelper(
          designerRef,
          workspaceContextRef
        )
        const viewport = useViewport(designerRef, workspaceContextRef)
        const cursor = useCursor(designerRef)
        const renderDropCover = () => {
          if (
            !viewportMoveHelper.closestNode ||
            !viewportMoveHelper.closestNode?.allowAppend(
              viewportMoveHelper.dragNodes
            ) ||
            viewportMoveHelper.viewportClosestDirection !==
              ClosestPosition.Inner
          )
            return null
          return <CoverRect node={viewportMoveHelper.closestNode} dropping />
        }
        if (cursor.status !== CursorStatus.Dragging) return null
        return (
          <>
            {viewportMoveHelper.dragNodes.map((node) => {
              if (!node) return
              if (!viewport.findElementById(node.id)) return
              return <CoverRect key={node.id} node={node} dragging />
            })}
            {renderDropCover()}
          </>
        )
      }
    },
  })
)

Cover.displayName = 'Cover'
