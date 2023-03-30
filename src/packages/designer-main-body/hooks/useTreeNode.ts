import { TreeNode } from '@designable/core'
import { Ref } from 'vue'
import { TreeNodeSymbol, useContext } from '../context'

export type TreeNodeContextRef = Ref<TreeNode>

export const useTreeNode = () => {
  return useContext(TreeNodeSymbol)
}
