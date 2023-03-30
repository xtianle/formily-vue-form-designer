import { useWorkspace, WorkspaceContextRef } from './useWorkspace'
import { DesignerRef } from './useDesigner'

export const useHistory = (
  designer: DesignerRef,
  workspaceContext: WorkspaceContextRef,
  workspaceId?: string
) => {
  const workspace = useWorkspace(designer, workspaceContext, workspaceId)
  return workspace?.history
}
