import { CSSProperties, defineComponent } from 'vue'
import {
  useCursor,
  usePrefix,
  useViewport,
  useOperation,
  useDesigner,
  useWorkspaceContext,
} from '../../hooks'
import { observer } from '@formily/reactive-vue'
import { CursorDragType, CursorStatus } from '@designable/core'
import { calcRectByStartEndPoint } from '@designable/shared'
import cls from 'classnames'
import { addUnit } from '../../shared'

export const FreeSelection = observer(
  defineComponent({
    name: 'FreeSelection',
    setup() {
      const prefix = usePrefix('aux-free-selection')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      return () => {
        const cursor = useCursor(designerRef)
        const viewport = useViewport(designerRef, workspaceContextRef)
        const operation = useOperation(designerRef, workspaceContextRef)
        const createSelectionStyle = () => {
          const startDragPoint = viewport.getOffsetPoint({
            x: cursor.dragStartPosition.topClientX,
            y: cursor.dragStartPosition.topClientY,
          })
          const currentPoint = viewport.getOffsetPoint({
            x: cursor.position.topClientX,
            y: cursor.position.topClientY,
          })
          const rect = calcRectByStartEndPoint(
            startDragPoint,
            currentPoint,
            viewport.dragScrollXDelta,
            viewport.dragScrollYDelta
          )
          const baseStyle: CSSProperties = {
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0.2,
            borderWidth: 1,
            borderStyle: 'solid',
            transform: `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`,
            height: addUnit(rect.height),
            width: addUnit(rect.width),
            pointerEvents: 'none',
            boxSizing: 'border-box',
            zIndex: 1,
          }
          return baseStyle
        }

        if (
          operation.moveHelper.hasDragNodes ||
          cursor.status !== CursorStatus.Dragging ||
          cursor.dragType !== CursorDragType.Move
        ) {
          return null
        }

        return <div class={cls(prefix)} style={createSelectionStyle()}></div>
      }
    },
  })
)
