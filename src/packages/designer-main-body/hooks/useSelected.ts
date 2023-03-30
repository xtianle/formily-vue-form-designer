import { DesignerRef } from './useDesigner'
import { useSelection } from './useSelection'
import { WorkspaceContextRef } from './useWorkspace'

export const useSelected = (
  designer: DesignerRef,
  workspaceContext: WorkspaceContextRef,
  workspaceId?: string
) => {
  const selection = useSelection(designer, workspaceContext, workspaceId)
  return selection?.selected || []
}
