import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { observer } from '@formily/reactive-vue'
import { useCursor, useDesigner, usePrefix } from '../../hooks'
import { NodeTitleWidget } from '../NodeTitleWidget'
import { CursorStatus } from '@designable/core'
import { autorun } from '@formily/reactive'

import './styles.less'

export const GhostWidget = observer(
  defineComponent({
    name: 'GhostWidget',
    setup() {
      const designerRef = useDesigner()

      const domRef = ref<HTMLDivElement>()
      const prefix = usePrefix('ghost')
      let dispose: null | (() => void) = null

      onMounted(() => {
        dispose = autorun(() => {
          const cursor = useCursor(designerRef)
          const transform = `perspective(1px) translate3d(${
            cursor.position?.topClientX - 18
          }px,${cursor.position?.topClientY - 12}px,0) scale(0.8)`
          if (!domRef.value) return
          domRef.value.style.transform = transform
        })
      })
      onBeforeUnmount(() => {
        dispose && dispose()
      })
      return () => {
        const cursor = useCursor(designerRef)
        const movingNodes = designerRef.value.findMovingNodes()
        const firstNode = movingNodes[0]
        const renderNodes = () => {
          return (
            <span
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              <NodeTitleWidget node={firstNode} />
              {movingNodes.length > 1 ? '...' : ''}
            </span>
          )
        }

        if (!firstNode) return null
        return cursor.status === CursorStatus.Dragging ? (
          <div ref={domRef} class={prefix}>
            {renderNodes()}
          </div>
        ) : null
      }
    },
  })
)
