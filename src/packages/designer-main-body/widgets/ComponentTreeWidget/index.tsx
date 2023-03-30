import { GlobalRegistry, TreeNode } from '@designable/core'
import { observer } from '@formily/reactive-vue'
import { defineComponent, PropType, provide, toRef, VNode } from 'vue'
import {
  useComponents,
  useDesigner,
  usePrefix,
  useTree,
  useWorkspaceContext,
} from '../../hooks'
import { IDesignerComponents } from '../../types'
import { DesignerComponentsSymbol, TreeNodeSymbol } from '../../context'
import cls from 'classnames'
import './styles.less'

export const TreeNodeWidget = observer(
  defineComponent({
    name: 'TreeNodeWidget',
    props: {
      node: {
        type: Object as PropType<TreeNode>,
        required: true,
      },
    },
    setup(props) {
      provide(TreeNodeSymbol, toRef(props, 'node'))
      const componentsRef = useComponents()
      const designerRef = useDesigner(props.node?.designerProps?.effects)

      return () => {
        const node = props.node
        // default slot
        const renderChildren = () => {
          if (node?.designerProps?.selfRenderChildren) return []
          return node?.children
            ?.filter((child) => {
              const slot = child.props?.['x-slot']
              return !slot || slot === 'default'
            })
            ?.map((child) => {
              return <TreeNodeWidget {...{ node: child }} key={child.id} />
            })
        }

        // 支持 x-slot
        const renderSlots = () => {
          if (node?.designerProps?.selfRenderChildren) return []
          const result = node?.children?.reduce((buffer, child) => {
            const slot = child.props?.['x-slot']
            if (slot) {
              if (!buffer[slot]) buffer[slot] = []
              buffer[slot].push(<TreeNodeWidget node={child} key={child.id} />)
            }
            return buffer
          }, {} as Record<string, VNode[]>)
          return Object.entries(result).reduce((buffer, [key, value]) => {
            buffer[key] = () => value
            return buffer
          }, {} as Record<string, () => VNode[]>)
        }
        // 渲染属性
        const renderProps = (extendsProps: any = {}) => {
          const props = {
            ...node.designerProps?.defaultProps,
            ...extendsProps,
            ...node.props,
            ...node.designerProps?.getComponentProps?.(node),
          }
          if (node.depth === 0) {
            delete props.style
          }
          return props
        }
        // 渲染组件
        const renderComponent = () => {
          const componentName = node.componentName
          const Component = componentsRef.value?.[componentName] as any

          const dataId = {}
          if (Component) {
            if (designerRef.value) {
              dataId[designerRef.value?.props?.nodeIdAttrName] = node.id
            }
            const { style, ...attrs } = renderProps(dataId)
            return (
              <Component
                {...attrs}
                key={node.id}
                style={style}
                v-slots={renderSlots()}
              >
                {renderChildren()}
              </Component>
            )
          } else {
            if (node?.children?.length) {
              return <>{renderChildren()}</>
            }
          }
        }
        if (!node) return null
        if (node.hidden) return null
        return renderComponent()
      }
    },
  })
)

export const ComponentTreeWidget = observer(
  defineComponent({
    name: 'ComponentTreeWidget',
    props: {
      components: {
        type: Object as PropType<IDesignerComponents>,
        required: true,
      },
    },
    setup(props) {
      const prefix = usePrefix('component-tree')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      GlobalRegistry.registerDesignerBehaviors(props.components)
      provide(DesignerComponentsSymbol, toRef(props, 'components'))

      return () => {
        const tree = useTree(designerRef, workspaceContextRef)
        const dataId = {}
        if (designerRef && tree) {
          dataId[designerRef.value?.props?.nodeIdAttrName] = tree.id
        }

        return (
          <div
            style={{ ...tree?.props?.style }}
            class={cls(prefix)}
            {...dataId}
          >
            <TreeNodeWidget node={tree} />
          </div>
        )
      }
    },
  })
)
