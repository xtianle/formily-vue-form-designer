import { DesignerRef } from './useDesigner'

export const useCursor = (designer: DesignerRef) => {
  return designer.value.cursor
}
