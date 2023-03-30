import { DesignerRef } from './useDesigner'

export const useWorkbench = (designer: DesignerRef) => {
  return designer.value.workbench
}
