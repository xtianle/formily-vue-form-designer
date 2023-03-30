import { DesignerRef } from './useDesigner'
import { useOperation } from './useOperation'
import { WorkspaceContextRef } from './useWorkspace'

export const useTransformHelper = (
  designer: DesignerRef,
  workspaceContext: WorkspaceContextRef,
  workspaceId?: string
) => {
  const operation = useOperation(designer, workspaceContext, workspaceId)
  return operation?.transformHelper
}
