import { useWorkspace, WorkspaceContextRef } from './useWorkspace'
import { DesignerRef } from './useDesigner'

export const useViewport = (
  designer: DesignerRef,
  workspaceContext: WorkspaceContextRef,
  workspaceId?: string
) => {
  const workspace = useWorkspace(designer, workspaceContext, workspaceId)
  return workspace?.viewport
}
