import { defineComponent } from 'vue'
import {
  useTransformHelper,
  useCursor,
  usePrefix,
  useDesigner,
  useWorkspaceContext,
} from '../../hooks'
import { observer } from '@formily/reactive-vue'
import { CursorStatus } from '@designable/core'
import { ILineSegment, calcRectOfAxisLineSegment } from '@designable/shared'
import { addUnit } from '../../shared'

export const SpaceBlock = observer(
  defineComponent({
    name: 'SpaceBlock',
    setup() {
      const prefix = usePrefix('aux-space-block')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      const renderRulerBox = (distance: number, type: string) => {
        if (type === 'top' || type === 'bottom') {
          return (
            <div class={prefix + '-ruler-v'}>
              <div class={prefix + '-ruler-indicator'}>
                <span>{distance?.toFixed(0)}</span>
              </div>
            </div>
          )
        } else if (type === 'left' || type === 'right') {
          return (
            <div class={prefix + '-ruler-h'}>
              <div class={prefix + '-ruler-indicator'}>
                <span>{distance?.toFixed(0)}</span>
              </div>
            </div>
          )
        }
      }

      const renderDashedLine = (line: ILineSegment) => {
        const rect = calcRectOfAxisLineSegment(line)
        if (!rect) return null
        const width = rect.width || 2
        const height = rect.height || 2
        return (
          <svg
            width={addUnit(width)}
            height={addUnit(height)}
            viewBox={`0 0 ${width} ${height}`}
            style={{
              top: 0,
              left: 0,
              transform: `perspective(1px) translate3d(${line.start.x}px,${line.start.y}px,0)`,
              position: 'absolute',
              zIndex: 3,
            }}
          >
            <line
              x1={line.start.x - rect.x}
              y1={line.start.y - rect.y}
              x2={line.end.x - rect.x}
              y2={line.end.y - rect.y}
              stroke-dasharray={4}
              stroke="#745BFF"
              stroke-width={2}
            ></line>
          </svg>
        )
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
            {transformHelper.measurerSpaceBlocks.map(
              ({ type, crossDragNodesRect, distance, extendsLine }, key) => {
                return (
                  <>
                    {renderDashedLine(extendsLine)}
                    <div
                      key={key}
                      style={{
                        top: 0,
                        left: 0,
                        height: addUnit(crossDragNodesRect.height),
                        width: addUnit(crossDragNodesRect.width),
                        transform: `perspective(1px) translate3d(${crossDragNodesRect.x}px,${crossDragNodesRect.y}px,0)`,
                        position: 'absolute',
                        zIndex: 3,
                      }}
                    >
                      {renderRulerBox(distance, type)}
                    </div>
                  </>
                )
              }
            )}
            {transformHelper.thresholdSpaceBlocks.map(({ rect }, key) => {
              return (
                <div
                  key={key}
                  class={prefix}
                  style={{
                    top: 0,
                    left: 0,
                    height: addUnit(rect.height),
                    width: addUnit(rect.width),
                    transform: `perspective(1px) translate3d(${rect.x}px,${rect.y}px,0)`,
                    position: 'absolute',
                    background: 'rgba(255, 0, 0, 0.2)',
                    zIndex: 1,
                  }}
                ></div>
              )
            })}
          </>
        )
      }
    },
  })
)

SpaceBlock.displayName = 'SpaceBlock'
