import { defineComponent, PropType } from 'vue'
import {
  ElBreadcrumb as Breadcrumb,
  ElBreadcrumbItem as BreadcrumbItem,
} from 'element-plus'
import { observer } from '@formily/reactive-vue'
import {
  useDesigner,
  useHover,
  usePrefix,
  useSelectedNode,
  useSelection,
  useWorkspaceContext,
} from '../../hooks'
import { IconWidget } from '../IconWidget'
import { NodeTitleWidget } from '../NodeTitleWidget'
import './styles.less'

export const NodePathWidget = observer(
  defineComponent({
    name: 'NodePathWidget',
    props: {
      workspaceId: {
        type: String as PropType<string>,
        default: '',
      },
      maxItems: {
        type: Number as PropType<number>,
        default: 3,
      },
    },
    setup(props) {
      const prefix = usePrefix('node-path')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      return () => {
        const selected = useSelectedNode(
          designerRef,
          workspaceContextRef,
          props.workspaceId
        )
        const selection = useSelection(
          designerRef,
          workspaceContextRef,
          props.workspaceId
        )
        const hover = useHover(
          designerRef,
          workspaceContextRef,
          props.workspaceId
        )
        if (!selected) {
          return null
        }
        const maxItems = props.maxItems ?? 3
        const nodes = selected
          .getParents()
          .slice(0, maxItems - 1)
          .reverse()
          .concat(selected)
        return (
          <Breadcrumb class={prefix}>
            {nodes.map((node, key) => {
              return (
                <BreadcrumbItem key={key}>
                  {key === 0 && (
                    <IconWidget infer="Position" style={{ marginRight: 3 }} />
                  )}
                  <a
                    href=""
                    onMouseenter={() => {
                      hover.setHover(node)
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      selection.select(node)
                    }}
                  >
                    <NodeTitleWidget node={node} />
                  </a>
                </BreadcrumbItem>
              )
            })}
          </Breadcrumb>
        )
      }
    },
  })
)
