import {
  CSSProperties,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  Ref,
} from 'vue'

import {
  useTransformHelper,
  useCursor,
  usePrefix,
  useDesigner,
  useWorkspaceContext,
} from '../../hooks'
import { observer } from '@formily/reactive-vue'
import { CursorStatus } from '@designable/core'
import { addUnit } from '../../shared'

export const SnapLine = observer(
  defineComponent({
    name: 'SnapLine',
    setup() {
      const prefix = usePrefix('aux-snap-line')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      const createLineStyle = (rect: DOMRect) => {
        const baseStyle: CSSProperties = {
          top: 0,
          left: 0,
          height: addUnit(rect.height || 1),
          width: addUnit(rect.width || 1),
          transform: `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`,
          background: `#b0b1f3`,
          position: 'absolute',
          zIndex: 2,
        }
        return baseStyle
      }
      return () => {
        const cursor = useCursor(designerRef)
        const transformHelper = useTransformHelper(
          designerRef,
          workspaceContextRef
        )
        if (cursor.status !== CursorStatus.Dragging) {
          return null
        }
        return (
          <>
            {transformHelper.closestSnapLines.map((line, key) => {
              if (line.type !== 'normal') return null
              return (
                <div
                  key={key}
                  class={prefix}
                  style={createLineStyle(line.rect as any)}
                ></div>
              )
            })}
          </>
        )
      }
    },
  })
)

SnapLine.displayName = 'SnapLine'
