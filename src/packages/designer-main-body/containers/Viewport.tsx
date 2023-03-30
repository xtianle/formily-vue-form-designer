import { defineComponent, onBeforeUnmount, onMounted, PropType, ref } from 'vue'
import { Viewport as ViewportType } from '@designable/core'
import {
  useDesigner,
  usePrefix,
  useViewport,
  useWorkspaceContext,
} from '../hooks'
import cls from 'classnames'
import { requestIdle } from '@designable/shared'
import { AuxToolWidget, EmptyWidget } from '../widgets'

export const Viewport = defineComponent({
  name: 'Viewport',
  props: {
    dragTipsDirection: {
      type: String as PropType<'left' | 'right'>,
      default: 'left',
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    className: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    const loaded = ref(false)
    const prefix = usePrefix('viewport')
    const designerRef = useDesigner()
    const workspaceContextRef = useWorkspaceContext()
    const domRef = ref<HTMLDivElement>()

    const viewportRef = ref<ViewportType>()

    const isFrameRef = ref(false)

    const viewport = useViewport(designerRef, workspaceContextRef)
    const viewportMount = () => {
      const frameElement = domRef.value?.querySelector('iframe')
      if (!viewport) return
      if (viewportRef.value && viewportRef.value !== viewport) {
        viewportRef.value.onUnmount()
      }
      if (frameElement) {
        frameElement.addEventListener('load', () => {
          viewport.onMount(frameElement, frameElement.contentWindow)
          requestIdle(() => {
            isFrameRef.value = true
            loaded.value = true
          })
        })
      } else {
        viewport.onMount(domRef.value, window)
        requestIdle(() => {
          isFrameRef.value = false
          loaded.value = true
        })
      }
      viewportRef.value = viewport
    }

    onMounted(() => {
      viewportMount()
    })

    onBeforeUnmount(() => {
      viewport.onUnmount()
    })

    return () => {
      return (
        <div
          {...props}
          ref={domRef}
          class={cls(prefix, props.className)}
          style={{
            opacity: !loaded ? 0 : 1,
            overflow: isFrameRef.value ? 'hidden' : 'overlay',
          }}
        >
          {slots?.default()}
          <AuxToolWidget />
          <EmptyWidget dragTipsDirection={props.dragTipsDirection} />
        </div>
      )
    }
  },
})
