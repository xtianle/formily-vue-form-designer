import { CSSProperties, defineComponent, PropType } from 'vue'
import { observer } from '@formily/reactive-vue'
import {
  useDesigner,
  useMoveHelper,
  usePrefix,
  useWorkspaceContext,
} from '../../hooks'
import { ClosestPosition } from '@designable/core'
import { addUnit } from '../../shared'
export const Insertion = observer(
  defineComponent({
    name: 'Insertion',
    props: {
      workspaceId: {
        type: String as PropType<string>,
        default: undefined,
      },
    },
    setup(props) {
      const prefix = usePrefix('outline-tree-insertion')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      return () => {
        const moveHelper = useMoveHelper(
          designerRef,
          workspaceContextRef,
          props.workspaceId
        )
        const createInsertionStyle = (): CSSProperties => {
          const closestDirection = moveHelper.outlineClosestDirection
          const closestRect = moveHelper.outlineClosestOffsetRect
          const baseStyle: CSSProperties = {
            position: 'absolute',
            transform: 'perspective(1px) translate3d(0,0,0)',
            top: 0,
            left: 0,
          }
          if (!closestRect) return baseStyle
          if (
            closestDirection === ClosestPosition.After ||
            closestDirection === ClosestPosition.InnerAfter ||
            closestDirection === ClosestPosition.Under ||
            closestDirection === ClosestPosition.ForbidAfter ||
            closestDirection === ClosestPosition.ForbidInnerAfter ||
            closestDirection === ClosestPosition.ForbidUnder
          ) {
            baseStyle.width = addUnit(closestRect.width)
            baseStyle.height = '2px'
            baseStyle.transform = `perspective(1px) translate3d(${
              closestRect.x
            }px,${closestRect.y + closestRect.height - 2}px,0)`
          } else if (
            closestDirection === ClosestPosition.Before ||
            closestDirection === ClosestPosition.InnerBefore ||
            closestDirection === ClosestPosition.Upper ||
            closestDirection === ClosestPosition.ForbidBefore ||
            closestDirection === ClosestPosition.ForbidInnerBefore ||
            closestDirection === ClosestPosition.ForbidUpper
          ) {
            baseStyle.width = addUnit(closestRect.width)
            baseStyle.height = '2px'
            baseStyle.transform = `perspective(1px) translate3d(${closestRect.x}px,${closestRect.y}px,0)`
          }
          if (closestDirection.includes('FORBID')) {
            baseStyle.backgroundColor = 'red'
          } else {
            baseStyle.backgroundColor = ''
          }
          return baseStyle
        }
        if (!moveHelper?.closestNode) return null

        return <div class={prefix} style={createInsertionStyle()}></div>
      }
    },
  })
)

Insertion.displayName = 'Insertion'
