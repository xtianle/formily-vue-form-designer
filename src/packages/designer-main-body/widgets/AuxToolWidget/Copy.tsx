import { TreeNode } from '@designable/core'
import { usePrefix } from '../../hooks'
import { IconWidget } from '../IconWidget'
import { ElButton as Button } from 'element-plus'
import { CSSProperties } from 'vue'
export interface ICopyProps {
  node: TreeNode
  style?: CSSProperties
}

export const Copy = ({ node }: { node: TreeNode }) => {
  const prefix = usePrefix('aux-copy')
  if (node === node.root) return null
  return (
    <Button
      class={prefix}
      type="primary"
      onClick={() => {
        TreeNode.clone([node])
      }}
    >
      <IconWidget infer="Clone" />
    </Button>
  )
}

Copy.displayName = 'Copy'
