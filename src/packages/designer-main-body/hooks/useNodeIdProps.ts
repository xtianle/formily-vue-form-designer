import { TreeNode } from '@designable/core'
import { TreeNodeContextRef } from './useTreeNode'
import { DesignerRef } from './useDesigner'

export const useNodeIdProps = (
  designer: DesignerRef,
  treeNodeContext: TreeNodeContextRef,
  node?: TreeNode
) => {
  return {
    [designer.value.props.nodeIdAttrName]: node
      ? node.id
      : treeNodeContext.value.id,
  }
}
