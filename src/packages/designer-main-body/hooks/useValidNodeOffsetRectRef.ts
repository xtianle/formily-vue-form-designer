import { TreeNode, CursorStatus, CursorDragType } from '@designable/core'
import { LayoutObserver } from '@designable/shared'
import { useViewport } from './useViewport'
import { DesignerRef, useDesigner } from './useDesigner'
import {
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  Ref,
  shallowRef,
} from 'vue'
import { WorkspaceContextRef } from './useWorkspace'

const isEqualRect = (rect1: DOMRect, rect2: DOMRect) => {
  return (
    rect1?.x === rect2?.x &&
    rect1?.y === rect2?.y &&
    rect1?.width === rect2?.width &&
    rect1?.height === rect2?.height
  )
}

let destroyFn: null | (() => void) = null

export const destroyValidNodeOffsetRectRef = () => {
  destroyFn && destroyFn()
}

export const useValidNodeOffsetRectRef = (
  designer: DesignerRef,
  workspaceContext: WorkspaceContextRef,
  node: TreeNode
) => {
  destroyValidNodeOffsetRectRef()
  onBeforeUnmount(() => {
    destroyValidNodeOffsetRectRef()
  })
  const engine = useDesigner()
  const viewport = useViewport(designer, workspaceContext)
  const vm = getCurrentInstance()
  const forceUpdate = () => {
    vm.proxy.$forceUpdate()
  }

  let currentRect = shallowRef(
    viewport.getValidNodeOffsetRect(node)
  ) as Ref<DOMRect>

  const element = viewport.findElementById(node?.id)

  const compute = () => {
    nextTick(() => {
      if (
        engine.value.cursor.status !== CursorStatus.Normal &&
        engine.value.cursor.dragType === CursorDragType.Move
      ) {
        return
      }
      const nextRect: any = viewport.getValidNodeOffsetRect(node)
      if (!isEqualRect(currentRect.value, nextRect) && nextRect) {
        currentRect.value = nextRect
        forceUpdate()
      }
    })
  }
  compute()
  const layoutObserver = new LayoutObserver(compute)
  if (element) {
    layoutObserver.observe(element)
  }
  destroyFn = () => {
    layoutObserver.disconnect()
  }

  return currentRect
}
