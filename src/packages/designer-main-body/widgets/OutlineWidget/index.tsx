import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  provide,
  ref,
} from 'vue'
import { observer } from '@formily/reactive-vue'
import { TreeNode, Viewport } from '@designable/core'
import {
  useDesigner,
  useOutline,
  usePrefix,
  useTree,
  useWorkbench,
  useWorkspaceContext,
} from '../../hooks'
import { Insertion } from './Insertion'
import { OutlineTreeNode } from './OutlineNode'
import cls from 'classnames'
import { NodeSymbol } from './context'
import { globalThisPolyfill } from '@designable/shared'

export const OutlineTreeWidget = observer(
  defineComponent({
    name: 'OutlineTreeWidget',
    props: {
      renderTitle: {
        type: Function as PropType<(node: TreeNode) => any>,
      },
      renderActions: {
        type: Function as PropType<(node: TreeNode) => any>,
      },
    },
    setup(props, { attrs }) {
      provide(
        NodeSymbol,
        ref({
          renderActions: props.renderActions,
          renderTitle: props.renderTitle,
        })
      )
      let dispose: null | (() => void) = null
      const disposeFn = () => {
        dispose && dispose()
      }
      const domRef = ref<HTMLDivElement>()
      const prefix = usePrefix('outline-tree')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()

      const outlineRef = ref<Viewport>()

      onMounted(() => {
        disposeFn()
        nextTick(() => {
          const workbench = useWorkbench(designerRef)
          const current =
            workbench?.activeWorkspace || workbench?.currentWorkspace
          const workspaceId = current?.id

          const outline = useOutline(
            designerRef,
            workspaceContextRef,
            workspaceId
          )
          if (!workspaceId) return
          if (outlineRef.value && outlineRef.value !== outline) {
            outlineRef.value.onUnmount()
          }
          if (domRef.value && outline) {
            outline.onMount(domRef.value, globalThisPolyfill)
          }
          outlineRef.value = outline
          dispose = () => {
            outline.onUnmount()
          }
        })
      })

      onBeforeUnmount(() => {
        disposeFn()
      })

      return () => {
        const workbench = useWorkbench(designerRef)
        const current =
          workbench?.activeWorkspace || workbench?.currentWorkspace
        const workspaceId = current?.id
        const tree = useTree(designerRef, workspaceContextRef, workspaceId)
        const outline = useOutline(
          designerRef,
          workspaceContextRef,
          workspaceId
        )

        if (!outline || !workspaceId) return null
        return (
          <div {...attrs} class={cls(prefix + '-container')}>
            <div class={prefix + '-content'} ref={domRef}>
              <OutlineTreeNode node={tree} workspaceId={workspaceId} />
              <div
                class={prefix + '-aux'}
                style={{
                  pointerEvents: 'none',
                }}
              >
                <Insertion workspaceId={workspaceId} />
              </div>
            </div>
          </div>
        )
      }
    },
  })
)
