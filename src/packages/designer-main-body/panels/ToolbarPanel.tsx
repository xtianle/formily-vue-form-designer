import { defineComponent } from 'vue'
import { WorkspacePanel, IWorkspaceItemProps } from './WorkspacePanel'

// export const ToolbarPanel = (props: IWorkspaceItemProps, { slots }) => {
//   return (
//     <WorkspacePanel.Item
//       {...props}
//       style={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         marginBottom: 4,
//         padding: '0 4px',
//       }}
//     >
//       qqqq{slots.default()}
//     </WorkspacePanel.Item>
//   )
// }

export const ToolbarPanel = defineComponent({
  setup(props, { slots }) {
    return () => (
      <WorkspacePanel.Item
        {...props}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '4px',
          padding: '0 4px',
        }}
      >
        {slots.default()}
      </WorkspacePanel.Item>
    )
  },
})
