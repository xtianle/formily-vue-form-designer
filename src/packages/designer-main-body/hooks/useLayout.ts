import { DesignerLayoutSymbol, useContext } from '../context'
import { IDesignerLayoutContext } from '../types'
import { globalThisPolyfill } from '@designable/shared'
import { Ref } from 'vue'

export const useLayout = (): Ref<IDesignerLayoutContext> => {
  return (
    globalThisPolyfill['__DESIGNABLE_LAYOUT__'] ||
    useContext(DesignerLayoutSymbol)
  )
}
