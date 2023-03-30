import { TreeNode } from '@designable/core'
import { useDesigner, useSelectedNode, useWorkspaceContext } from '@designer-main-body'
import { ElTreeSelect as TreeSelect } from 'element-plus'
import { CSSProperties, defineComponent } from 'vue'

export interface IPathSelectorProps {
  value?: string
  style?: CSSProperties
  class?: string
}

const transformDataSource = (node: TreeNode) => {
  const currentNode = node
  const dots = (count: number) => {
    let dots = ''
    for (let i = 0; i < count; i++) {
      dots += '.'
    }
    return dots
  }
  const targetPath = (parentNode: TreeNode, targetNode: TreeNode) => {
    const path: string[] = []
    const transform = (node: TreeNode) => {
      if (node && node !== parentNode) {
        path.push(node.props.name || node.id)
      } else {
        transform(node.parent)
      }
    }
    transform(targetNode)
    return path.reverse().join('.')
  }
  const hasNoVoidChildren = (node: TreeNode): boolean | undefined => {
    return node.children?.some((node) => {
      if (node.props.type !== 'void' && node !== currentNode) return true
      return hasNoVoidChildren(node)
    })
  }
  const findRoot = (node: TreeNode): TreeNode => {
    if (!node?.parent) return node
    if (node?.parent?.componentName !== node.componentName) return node.parent
    return findRoot(node.parent)
  }
  const findArrayParent = (node: TreeNode) => {
    if (!node?.parent) return
    if (node.parent.props.type === 'array') return node.parent
    if (node.parent === root) return
    return findArrayParent(node.parent)
  }
  const transformRelativePath = (arrayNode: TreeNode, targetNode: TreeNode) => {
    if (targetNode.depth === currentNode.depth)
      return `.${targetNode.props.name || targetNode.id}`
    return `${dots(currentNode.depth - arrayNode.depth)}[].${targetPath(
      arrayNode,
      targetNode
    )}`
  }
  const transformChildren = (children: TreeNode[], path = []) => {
    return children.reduce((buf, node) => {
      if (node === currentNode) return buf
      if (node.props.type === 'array' && !node.contains(currentNode)) return buf
      if (node.props.type === 'void' && !hasNoVoidChildren(node)) return buf
      const currentPath = path.concat(node.props.name || node.id)
      const arrayNode = findArrayParent(node)
      const label =
        node.props.title ||
        node.props['x-component-props']?.title ||
        node.props.name ||
        node.designerProps.title
      const value = arrayNode
        ? transformRelativePath(arrayNode, node)
        : currentPath.join('.')
      return buf.concat({
        label,
        value,
        node,
        children: transformChildren(node.children, currentPath),
      })
    }, [])
  }
  const root = findRoot(node)
  if (root) {
    return transformChildren(root.children)
  }
  return []
}

interface DataSourceItem {
  label: string
  value: string
  node: TreeNode
  children: DataSourceItem[]
}

const cloneDataSource = (data: DataSourceItem[]) => {
  return data.map(({ label, value, children }) => {
    return {
      label,
      value,
      children: cloneDataSource(children),
    }
  })
}
export const PathSelector = defineComponent({
  name: 'PathSelector',
  props: {
    value: { type: String, default: undefined },
  },
  emits: ['change'],
  setup(props, { attrs, emit }) {
    const designerRef = useDesigner()
    const workspaceContextRef = useWorkspaceContext()
    const findNode = (dataSource: any[], value: string) => {
      for (let i = 0; i < dataSource.length; i++) {
        const item = dataSource[i]
        if (item.value === value) return item.node
        if (item.children?.length) {
          const fondedChild = findNode(item.children, value)
          if (fondedChild) return fondedChild
        }
      }
    }

    return () => {
      const baseNode = useSelectedNode(designerRef, workspaceContextRef)
      const dataSource = cloneDataSource(transformDataSource(baseNode))
      return (
        <TreeSelect
          default-expand-all
          check-strictly={true}
          {...attrs}
          {...{
            modelValue: props.value,
            'onUpdate:modelValue': (arg: string) => emit('change', arg),
          }}
          data={dataSource}
        />
      )
    }
  },
})
