import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  useViewport,
  useDesigner,
  usePrefix,
  useWorkspaceContext,
} from '../../hooks'
import { Insertion } from './Insertion'
import { Selection } from './Selection'
import { FreeSelection } from './FreeSelection'
import { Cover } from './Cover'
import { DashedBox } from './DashedBox'
import { SpaceBlock } from './SpaceBlock'
import { SnapLine } from './SnapLine'
import './styles.less'

export const AuxToolWidget = defineComponent({
  name: 'AuxToolWidget',
  setup() {
    let dispose: null | (() => void) = null
    const disposeFn = () => {
      dispose && dispose()
    }

    const prefix = usePrefix('auxtool')
    const designerRef = useDesigner()
    const workspaceContextRef = useWorkspaceContext()

    const domRef = ref<HTMLDivElement>()

    onMounted(() => {
      disposeFn()
      dispose = designerRef.value.subscribeWith('viewport:scroll', () => {
        const viewport = useViewport(designerRef, workspaceContextRef)
        if (viewport.isIframe && domRef.value) {
          domRef.value.style.transform = `perspective(1px) translate3d(${-viewport.scrollX}px,${-viewport.scrollY}px,0)`
        }
      })
    })
    onBeforeUnmount(() => {
      disposeFn()
    })
    return () => {
      const viewport = useViewport(designerRef, workspaceContextRef)
      if (!viewport) return null
      return (
        <div ref={domRef} class={prefix}>
          <Insertion />
          <SpaceBlock />
          <SnapLine />
          <DashedBox />
          <Selection />
          <Cover />
          <FreeSelection />
        </div>
      )
    }
  },
})

AuxToolWidget.displayName = 'AuxToolWidget'
