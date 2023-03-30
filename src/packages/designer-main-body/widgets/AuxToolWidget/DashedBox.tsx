import { CSSProperties, defineComponent, onBeforeUnmount } from 'vue'
import {
  useHover,
  usePrefix,
  useValidNodeOffsetRect,
  useSelection,
  useDesigner,
  useWorkspaceContext,
  destroyValidNodeObserver,
} from '../../hooks'
import { observer } from '@formily/reactive-vue'
import { addUnit } from '../../shared'

export const DashedBox = observer(
  defineComponent({
    name: 'DashedBox',
    setup() {
      const prefix = usePrefix('aux-dashed-box')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      const createTipsStyle = (rect) => {
        const baseStyle: CSSProperties = {
          top: 0,
          left: 0,
          pointerEvents: 'none',
          boxSizing: 'border-box',
          visibility: 'hidden',
          zIndex: 2,
        }
        if (rect) {
          baseStyle.transform = `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`
          baseStyle.height = addUnit(rect.height)
          baseStyle.width = addUnit(rect.width)
          baseStyle.visibility = 'visible'
        }
        return baseStyle
      }

      onBeforeUnmount(() => {
        destroyValidNodeObserver()
      })

      return () => {
        const selection = useSelection(designerRef, workspaceContextRef)
        const hover = useHover(designerRef, workspaceContextRef)
        const rect = useValidNodeOffsetRect(
          designerRef,
          workspaceContextRef,
          hover?.node
        )
        if (!hover.node) return null
        if (hover.node.hidden) return null
        if (selection.selected.includes(hover.node.id)) return null
        return (
          <div class={prefix} style={createTipsStyle(rect)}>
            <span
              class={prefix + '-title'}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                fontSize: 12,
                userSelect: 'none',
                fontWeight: 'lighter',
                whiteSpace: 'nowrap',
              }}
            >
              {hover?.node.getMessage('title')}
            </span>
          </div>
        )
      }
    },
  })
)

DashedBox.displayName = 'DashedBox'
