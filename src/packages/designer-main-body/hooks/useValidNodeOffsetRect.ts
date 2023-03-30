import { TreeNode, CursorStatus, CursorDragType } from '@designable/core'
import { LayoutObserver } from '@designable/shared'
import { useViewport } from './useViewport'
import { DesignerRef, useDesigner } from './useDesigner'
import { getCurrentInstance } from 'vue'
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

export const destroyValidNodeObserver = () => {
  destroyFn && destroyFn()
}

export const useValidNodeOffsetRect = (
  designer: DesignerRef,
  workspaceContext: WorkspaceContextRef,
  node: TreeNode
) => {
  destroyValidNodeObserver()
  const engine = useDesigner()
  const viewport = useViewport(designer, workspaceContext)
  const vm = getCurrentInstance()
  const forceUpdate = () => {
    vm.proxy.$forceUpdate()
  }

  let currentRect: any = viewport.getValidNodeOffsetRect(node)

  const element = viewport.findElementById(node?.id)

  const compute = () => {
    if (
      engine.value.cursor.status !== CursorStatus.Normal &&
      engine.value.cursor.dragType === CursorDragType.Move
    )
      return
    const nextRect: any = viewport.getValidNodeOffsetRect(node)
    if (!isEqualRect(currentRect, nextRect) && nextRect) {
      currentRect = nextRect
      forceUpdate()
    }
  }

  const layoutObserver = new LayoutObserver(compute)
  if (element) {
    layoutObserver.observe(element)
  }
  destroyFn = () => {
    layoutObserver.disconnect()
  }

  return currentRect
}
