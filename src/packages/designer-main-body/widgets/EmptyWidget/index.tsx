import { defineComponent, PropType } from 'vue'
import { observer } from '@formily/reactive-vue'
import {
  useDesigner,
  usePrefix,
  useTree,
  useWorkspaceContext,
} from '../../hooks'
import { IconWidget } from '../IconWidget'

import './styles.less'
export const EmptyWidget = observer(
  defineComponent({
    name: 'EmptyWidget',
    props: {
      dragTipsDirection: {
        type: String as PropType<'left' | 'right'>,
        default: 'left',
      },
    },
    setup(props) {
      const prefix = usePrefix('empty')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      const renderEmpty = () => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div class="animations">
              <IconWidget
                infer={
                  props.dragTipsDirection === 'left'
                    ? 'DragLeftSourceAnimation'
                    : 'DragRightSourceAnimation'
                }
                size={240}
              />
              <IconWidget infer="BatchDragAnimation" size={240} />
            </div>
            <div class="hotkeys-list">
              <div>
                Selection <IconWidget infer="Command" /> + Click /{' '}
                <IconWidget infer="Shift" /> + Click /{' '}
                <IconWidget infer="Command" /> + A
              </div>
              <div>
                Copy <IconWidget infer="Command" /> + C / Paste{' '}
                <IconWidget infer="Command" /> + V
              </div>
              <div>
                Delete <IconWidget infer="Delete" />
              </div>
            </div>
          </div>
        )
      }

      return () => {
        const tree = useTree(designerRef, workspaceContextRef)
        // const emptyContent = slots.default?.()
        if (!tree?.children?.length) {
          return (
            <div class={prefix}>
              {/* {!emptyContent?.every(isComment) ? emptyContent : renderEmpty()} */}
              {renderEmpty()}
            </div>
          )
        }
        return null
      }
    },
  })
)
