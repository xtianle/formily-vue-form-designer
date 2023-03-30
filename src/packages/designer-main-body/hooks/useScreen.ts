import { DesignerRef } from './useDesigner'

export const useScreen = (designer: DesignerRef) => {
  return designer.value.screen
}
