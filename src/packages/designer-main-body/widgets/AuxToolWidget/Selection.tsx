import { CSSProperties, defineComponent, PropType } from 'vue'
import { Helpers } from './Helpers'
import { ResizeHandler } from './ResizeHandler'
import {
  useSelection,
  useTree,
  useCursor,
  useMoveHelper,
  usePrefix,
  useDesigner,
  useWorkspaceContext,
  useValidNodeOffsetRectRef,
} from '../../hooks'
import { observer } from '@formily/reactive-vue'
import { TreeNode } from '@designable/core'
import { TranslateHandler } from './TranslateHandler'
import { addUnit } from '../../shared'

export interface ISelectionBoxProps {
  node: TreeNode
  showHelpers: boolean
}

export const SelectionBox = observer(
  defineComponent({
    name: 'SelectionBox',
    props: {
      node: {
        type: Object as PropType<TreeNode>,
        required: true,
      },
      showHelpers: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
    },
    setup(props) {
      const prefix = usePrefix('aux-selection-box')
      const innerPrefix = usePrefix('aux-selection-box-inner')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      const nodeRectRef = useValidNodeOffsetRectRef(
        designerRef,
        workspaceContextRef,
        props.node
      )

      const createSelectionStyle = (nodeRect: any) => {
        const baseStyle: CSSProperties = {
          position: 'absolute',
          top: 0,
          left: 0,
          boxSizing: 'border-box',
          zIndex: 4,
        }
        if (nodeRect) {
          baseStyle.transform = `perspective(1px) translate3d(${nodeRect.x}px,${nodeRect.y}px,0)`
          baseStyle.height = addUnit(nodeRect.height)
          baseStyle.width = addUnit(nodeRect.width)
        }
        return baseStyle
      }

      return () => {
        const nodeRect = nodeRectRef.value
        if (!nodeRect) return null

        if (!nodeRect.width || !nodeRect.height) return null

        const selectionId = {
          [designerRef.value.props?.nodeSelectionIdAttrName]: props.node.id,
        }

        return (
          <div
            {...selectionId}
            class={prefix}
            style={createSelectionStyle(nodeRect)}
          >
            <div class={innerPrefix}></div>
            <ResizeHandler node={props.node} />
            <TranslateHandler node={props.node} />
            {props.showHelpers && (
              <Helpers {...props} node={props.node} nodeRect={nodeRect} />
            )}
          </div>
        )
      }
    },
  })
)

export const Selection = observer(
  defineComponent({
    name: 'Selection',
    setup() {
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      return () => {
        const selection = useSelection(designerRef, workspaceContextRef)
        const tree = useTree(designerRef, workspaceContextRef)
        const cursor = useCursor(designerRef)
        const viewportMoveHelper = useMoveHelper(
          designerRef,
          workspaceContextRef
        )
        if (cursor.status !== 'NORMAL' && viewportMoveHelper.touchNode) {
          return null
        }
        return (
          <>
            {selection.selected.map((id) => {
              const node = tree.findById(id)
              if (!node) return
              if (node.hidden) return
              return (
                <SelectionBox
                  key={id}
                  node={node}
                  showHelpers={selection.selected.length === 1}
                />
              )
            })}
          </>
        )
      }
    },
  })
)

Selection.displayName = 'Selection'
