import { DesignerRef } from './useDesigner'
import { useWorkspace, WorkspaceContextRef } from './useWorkspace'

export const useOutline = (
  designer: DesignerRef,
  workspaceContext: WorkspaceContextRef,
  workspaceId?: string
) => {
  const workspace = useWorkspace(designer, workspaceContext, workspaceId)
  return workspace?.outline
}
