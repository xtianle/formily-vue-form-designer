import { DesignerRef } from './useDesigner'
import { useSelected } from './useSelected'
import { useTree } from './useTree'
import { WorkspaceContextRef } from './useWorkspace'

export const useSelectedNode = (
  designer: DesignerRef,
  workspaceContext: WorkspaceContextRef,
  workspaceId?: string
) => {
  const selected = useSelected(designer, workspaceContext, workspaceId)
  const tree = useTree(designer, workspaceContext, workspaceId)
  return tree?.findById?.(selected[0])
}

/**
 * @deprecated
 * please use useSelectedNode
 */
export const useCurrentNode = useSelectedNode
