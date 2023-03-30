import cls from 'classnames'
import { useDesigner, usePrefix } from '../../hooks'
import { TreeNode } from '@designable/core'

export interface IResizeHandlerProps {
  node: TreeNode
}

export const ResizeHandler = (props: IResizeHandlerProps) => {
  const prefix = usePrefix('aux-node-resize-handler')
  const designerRef = useDesigner()
  const createHandler = (value: string) => {
    return {
      [designerRef.value.props.nodeResizeHandlerAttrName]: value,
      class: cls(prefix, value),
    }
  }
  const allowResize = props.node.allowResize()
  if (!allowResize) return null
  const allowX = allowResize.includes('x')
  const allowY = allowResize.includes('y')
  return (
    <>
      {allowX && <div {...createHandler('left-center')}></div>}
      {allowX && <div {...createHandler('right-center')}></div>}
      {allowY && <div {...createHandler('center-top')}></div>}
      {allowY && <div {...createHandler('center-bottom')}></div>}
      {allowX && allowY && <div {...createHandler('left-top')}></div>}
      {allowY && allowY && <div {...createHandler('right-top')}></div>}
      {allowX && allowY && <div {...createHandler('left-bottom')}></div>}
      {allowY && allowY && <div {...createHandler('right-bottom')}></div>}
    </>
  )
}
