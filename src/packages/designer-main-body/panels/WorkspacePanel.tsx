// import { defineComponent } from 'vue'
import { CSSProperties } from 'vue'
import { usePrefix } from '../hooks'

export interface IWorkspaceItemProps {
  style?: CSSProperties
  flexable?: boolean
}
// const WorkspacePanelCom = defineComponent({
//   name: 'WorkspacePanel',
//   setup(props, { slots }) {
//     const prefix = usePrefix('workspace-panel')
//     return () => {
//       return <div class={prefix}>   {slots?.default()}  </div>
//     }
//   },
// })

const WorkspacePanelCom = (props, { slots }) => {
  const prefix = usePrefix('workspace-panel')
  return <div class={prefix}>{slots?.default()}</div>
}

const Item = (props, { slots }) => {
  const prefix = usePrefix('workspace-panel-item')
  return (
    <div
      class={prefix}
      style={{
        flexGrow: props.flexable ? 1 : 0,
        flexShrink: props.flexable ? 1 : 0,
      }}
    >
      {slots?.default()}
    </div>
  )
}

export const WorkspacePanel = Object.assign(WorkspacePanelCom, {
  Item,
})
