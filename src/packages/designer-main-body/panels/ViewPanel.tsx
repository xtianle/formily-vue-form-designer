import { ITreeNode, WorkbenchTypes } from '@designable/core'
import { observer } from '@formily/reactive-vue'
import { defineComponent, PropType, ref, provide } from 'vue'
import { Viewport } from '../containers'
import {
  useDesigner,
  useTree,
  useWorkbench,
  useWorkspaceContext
} from '../hooks'

export const ViewPanel = observer(
  defineComponent({
    name: 'ViewPanel',
    props: {
      type: {
        type: String as PropType<WorkbenchTypes>,
        default: 'DESIGNABLE'
      },
      scrollable: {
        type: Boolean as PropType<boolean>,
        default: true
      },
      dragTipsDirection: {
        type: String as PropType<'left' | 'right'>,
        default: 'left'
      }
    },
    setup(props, { slots }) {
      provide('isDesignEnv', props.type !== 'PREVIEW')
      const isVisible = ref(true)
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      return () => {
        const workbench = useWorkbench(designerRef)
        if (workbench.type !== props.type) {
          return null
        }

        const tree = useTree(designerRef, workspaceContextRef)
        const render = () => {
          return slots.default?.(tree, (payload: ITreeNode) => {
            tree.from(payload)
            tree.takeSnapshot()
          })
        }

        if (workbench.type === 'DESIGNABLE') {
          return (
            <Viewport dragTipsDirection={props.dragTipsDirection}>
              {render()}
            </Viewport>
          )
        }
        return (
          <div
            style={{
              overflow: props.scrollable ? 'overlay' : 'hidden',
              height: '100%',
              cursor: 'auto',
              userSelect: 'text'
            }}
          >
            {isVisible.value && render()}
          </div>
        )
      }
    }
  })
)
