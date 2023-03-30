import { CSSProperties } from 'vue'
import { TreeNode } from '@designable/core'
import { IconWidget } from '../IconWidget'
import { usePrefix } from '../../hooks'
import { ElButton as Button } from 'element-plus'

export interface IDeleteProps {
  node: TreeNode
  style?: CSSProperties
}

export const Delete = ({ node }: IDeleteProps) => {
  const prefix = usePrefix('aux-copy')
  if (node === node.root) return null
  return (
    <Button
      class={prefix}
      type="primary"
      onClick={() => {
        TreeNode.remove([node])
      }}
    >
      <IconWidget infer="Remove" />
    </Button>
  )
}

Delete.displayName = 'Delete'
