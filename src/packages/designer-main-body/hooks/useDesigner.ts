import { Engine } from '@designable/core'
import { DesignerEngineSymbol, useContext } from '../context'
import { isFn, globalThisPolyfill } from '@designable/shared'
import { onBeforeUnmount, Ref } from 'vue'
export interface IEffects {
  (engine: Engine): void
}
export type DesignerRef = Ref<Engine>

export const useDesigner = (effects?: IEffects): DesignerRef => {
  const designer: DesignerRef =
    globalThisPolyfill['__DESIGNABLE_ENGINE__'] ||
    useContext(DesignerEngineSymbol)
  if (isFn(effects)) {
    const dispose = effects(designer.value)
    onBeforeUnmount(() => {
      dispose && dispose()
    })
  }
  return designer
}
