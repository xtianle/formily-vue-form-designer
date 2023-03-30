import { DesignerRef } from './useDesigner'
import { WorkspaceSymbol, useContext } from '../context'
import { Workspace } from '@designable/core'
import { globalThisPolyfill } from '@designable/shared'
import { Ref } from 'vue'
import { IWorkspaceContext } from '../types'

export type WorkspaceContextRef = Ref<IWorkspaceContext>

export const useWorkspace = (
  designer: DesignerRef,
  workspace: WorkspaceContextRef,
  id?: string
): Workspace => {
  const _win: any = globalThisPolyfill
  const workspaceId = id || workspace.value?.id
  if (workspaceId) {
    return designer.value.workbench.findWorkspaceById(workspaceId) as any
  }
  if (_win['__DESIGNABLE_WORKSPACE__']) {
    return _win['__DESIGNABLE_WORKSPACE__'] as any
  }
  return designer.value.workbench.currentWorkspace as any
}

export const useWorkspaceContext = () => {
  return useContext(WorkspaceSymbol)
}
